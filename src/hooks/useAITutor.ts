import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LessonContext {
  topic: string;
  subtopic?: string;
  difficulty: string;
  learningStyle: string;
}

interface TopicAnalysis {
  title: string;
  topics: Array<{
    name: string;
    subtopics: string[];
    keyConcepts: string[];
    difficulty: string;
    estimatedMinutes: number;
    order: number;
  }>;
  overallDifficulty: string;
  totalEstimatedMinutes: number;
  learningObjectives: string[];
  prerequisites: string[];
  conceptMap: Record<string, string[]>;
}

interface Question {
  type: 'multiple_choice' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  concept: string;
}

export function useAITutor() {
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');

  const analyzeMaterial = useCallback(async (material: string): Promise<TopicAnalysis | null> => {
    setIsLoading(true);
    try {
      if (!material || !material.trim()) {
        toast.error('Please provide material content to analyze');
        return null;
      }

      console.log('Calling bright-handler function with material length:', material.length);

      let responseData;
      let responseError;
      
      try {
        const response = await supabase.functions.invoke('bright-handler', {
          body: { action: 'analyze_material', material }
        });
        
        responseData = response.data;
        responseError = response.error;
      } catch (invokeError: any) {
        console.error('Function invoke error:', invokeError);
        responseError = invokeError;
      }

      if (responseError) {
        console.error('Supabase function error:', responseError);
        
        // Try to extract error message from multiple sources
        let errorMessage = 'Unknown error';
        
        // Try error.message first
        if (responseError.message) {
          errorMessage = responseError.message;
        }
        
        // Try to get error from context
        if (responseError.context) {
          // Try context.body
          if (responseError.context.body) {
            try {
              const errorBody = typeof responseError.context.body === 'string' 
                ? JSON.parse(responseError.context.body) 
                : responseError.context.body;
              if (errorBody.error) {
                errorMessage = errorBody.error;
              } else if (errorBody.message) {
                errorMessage = errorBody.message;
              }
            } catch {
              // If parsing fails, try as string
              if (typeof responseError.context.body === 'string') {
                errorMessage = responseError.context.body;
              }
            }
          }
          
          // Try context.response
          if (responseError.context.response) {
            try {
              const responseBody = typeof responseError.context.response === 'string'
                ? JSON.parse(responseError.context.response)
                : responseError.context.response;
              if (responseBody.error) {
                errorMessage = responseBody.error;
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
        
        // Try error.error or error.details
        if (responseError.error) {
          errorMessage = typeof responseError.error === 'string' 
            ? responseError.error 
            : responseError.error.message || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = responseData;

      if (!data) {
        throw new Error('No data received from analysis');
      }

      // Check if there's an error in the response
      if (data.error) {
        console.error('Error in response data:', data.error);
        throw new Error(data.error);
      }

      console.log('Analysis successful, received data:', Object.keys(data));
      return data as TopicAnalysis;
    } catch (err: any) {
      console.error('Error analyzing material:', err);
      
      let errorMessage = 'Failed to analyze material';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.context?.body) {
        try {
          const errorBody = typeof err.context.body === 'string' 
            ? JSON.parse(err.context.body) 
            : err.context.body;
          if (errorBody.error) {
            errorMessage = errorBody.error;
          }
        } catch {
          // Ignore parse errors
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Show more specific error messages
      if (errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('not configured')) {
        errorMessage = 'AI service is not configured. Please contact support or check server configuration.';
      } else if (errorMessage.includes('API error') || errorMessage.includes('Gemini')) {
        errorMessage = 'AI service error. Please try again in a moment.';
      } else if (errorMessage.includes('parse') || errorMessage.includes('JSON')) {
        errorMessage = 'Failed to process AI response. Please try again.';
      } else if (errorMessage.includes('500') || errorMessage.includes('Internal Server')) {
        errorMessage = 'Server error occurred. Please check if the AI service is properly configured.';
      }
      
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const chat = useCallback(async (
    messages: Message[],
    lessonContext?: LessonContext,
    onDelta?: (chunk: string) => void
  ): Promise<string> => {
    setIsStreaming(true);
    setStreamedContent('');
    
    try {
      // For streaming, we need to use fetch directly with Supabase function URL
      // The Supabase client handles auth automatically, but for streaming we need direct fetch
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://iygdxidivqoukcsiszvt.supabase.co";
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Z2R4aWRpdnFvdWtjc2lzenZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjExMTcsImV4cCI6MjA4MTM5NzExN30.EG9p2I-s43FokxOGxLKBy-NSWNo7VgflEHyw7xl0H1I";
      
      const response = await fetch(
        `${supabaseUrl}/functions/v1/bright-handler`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            action: 'chat',
            messages,
            lessonContext
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to start chat');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              fullContent += text;
              setStreamedContent(fullContent);
              onDelta?.(text);
            }
          } catch {
            // Incomplete JSON, continue
          }
        }
      }

      return fullContent;
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('Failed to get response');
      return '';
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const generateQuestions = useCallback(async (
    lessonContext: LessonContext & { count?: number }
  ): Promise<Question[]> => {
    setIsLoading(true);
    try {
      const requestedCount = lessonContext.count || 10;
      console.log('Requesting questions:', { count: requestedCount, topic: lessonContext.topic });
      
      const { data, error } = await supabase.functions.invoke('bright-handler', {
        body: { 
          action: 'generate_question', 
          lessonContext,
          count: requestedCount
        }
      });

      if (error) {
        console.error('Error from API:', error);
        throw error;
      }
      
      const questions = data?.questions || [];
      console.log('Received questions:', { requested: requestedCount, received: questions.length });
      
      // If we got fewer questions than requested, log it
      if (questions.length < requestedCount) {
        console.warn(`Only received ${questions.length} questions, requested ${requestedCount}`);
      }
      
      // Return all questions we got (up to requested count)
      return questions.slice(0, requestedCount);
    } catch (err) {
      console.error('Error generating questions:', err);
      toast.error('Failed to generate questions');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAnswer = useCallback(async (
    question: string,
    options: string[] | undefined,
    correctAnswer: string,
    userAnswer: string
  ): Promise<{ isCorrect: boolean; feedback: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bright-handler', {
        body: {
          action: 'check_answer',
          question: { question, options, correctAnswer, userAnswer }
        }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error checking answer:', err);
      return { isCorrect: false, feedback: 'Unable to check answer' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSessionSummary = useCallback(async (
    lessonContext: LessonContext
  ): Promise<string> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bright-handler', {
        body: { action: 'get_summary', lessonContext }
      });

      if (error) throw error;
      return data?.summary || '';
    } catch (err) {
      console.error('Error getting summary:', err);
      return '';
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    isStreaming,
    streamedContent,
    analyzeMaterial,
    chat,
    generateQuestions,
    checkAnswer,
    getSessionSummary
  };
}
