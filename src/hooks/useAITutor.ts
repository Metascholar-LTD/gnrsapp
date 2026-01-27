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
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
        body: { action: 'analyze_material', material }
      });

      if (error) throw error;
      return data as TopicAnalysis;
    } catch (err) {
      console.error('Error analyzing material:', err);
      toast.error('Failed to analyze material');
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
      const response = await fetch(
        `https://iygdxidivqoukcsiszvt.supabase.co/functions/v1/ai-tutor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Z2R4aWRpdnFvdWtjc2lzenZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjExMTcsImV4cCI6MjA4MTM5NzExN30.EG9p2I-s43FokxOGxLKBy-NSWNo7VgflEHyw7xl0H1I`
          },
          body: JSON.stringify({
            action: 'chat',
            messages,
            lessonContext
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start chat');
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
    lessonContext: LessonContext
  ): Promise<Question[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
        body: { action: 'generate_question', lessonContext }
      });

      if (error) throw error;
      return data?.questions || [];
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
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
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
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
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
