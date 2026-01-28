import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface TutorRequest {
  action: 'analyze_material' | 'chat' | 'generate_question' | 'check_answer' | 'get_summary';
  sessionId?: string;
  material?: string;
  messages?: { role: string; content: string }[];
  lessonContext?: {
    topic: string;
    subtopic?: string;
    difficulty: string;
    learningStyle: string;
  };
  count?: number;
  question?: {
    question: string;
    options?: string[];
    correctAnswer: string;
    userAnswer: string;
  };
}

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const systemPrompts = {
  tutor: `You are an exceptional AI Study Tutor - a caring, patient, and highly intelligent teacher who genuinely helps students understand, not memorize. Your goal is to make complex topics simple and build true understanding.

TEACHING PHILOSOPHY:
- Explain concepts in simple language first, then gradually increase depth
- Use examples, analogies, and real-life explanations
- Be encouraging and supportive - celebrate progress
- Detect confusion and re-explain using different approaches
- Ask probing Socratic questions to deepen understanding

RESPONSE STYLE:
- Keep explanations clear and well-structured
- Use bullet points and numbered lists for clarity
- Include relevant examples from everyday life
- End with a check for understanding or follow-up question

MODES:
- Simple ("Teach Me Like I'm 10"): Use very basic language, fun analogies
- Balanced: Clear explanations with moderate depth
- Exam-Focused: Emphasize key points, common exam questions, quick revision
- Deep Conceptual: Thorough exploration with connections to related concepts`,

  analyzer: `You are an expert educational content analyzer. Analyze the provided learning material and extract:

1. Main topics and subtopics with their relationships
2. Key concepts that need to be understood
3. Difficulty assessment (beginner, intermediate, advanced)
4. Suggested learning order from foundational to advanced
5. Potential areas where students commonly struggle

Return your analysis as a JSON object with this structure:
{
  "title": "Brief title for the material",
  "topics": [
    {
      "name": "Topic Name",
      "subtopics": ["Subtopic 1", "Subtopic 2"],
      "keyConcepts": ["Concept 1", "Concept 2"],
      "difficulty": "beginner|intermediate|advanced",
      "estimatedMinutes": 15,
      "order": 1
    }
  ],
  "overallDifficulty": "beginner|intermediate|advanced",
  "totalEstimatedMinutes": 60,
  "learningObjectives": ["Objective 1", "Objective 2"],
  "prerequisites": ["Prerequisite 1"],
  "conceptMap": {
    "Concept A": ["relates to Concept B", "builds on Concept C"]
  }
}`,

  questionGenerator: `You are an expert educational assessment designer. Generate thoughtful questions that test understanding, not memorization.

Create questions that:
1. Start easy and progressively get harder
2. Include multiple choice AND short answer formats
3. Test comprehension, application, and analysis
4. Provide helpful explanations for each answer

Return as JSON:
{
  "questions": [
    {
      "type": "multiple_choice",
      "question": "Question text",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A",
      "explanation": "Why this is correct and why others are wrong",
      "difficulty": "easy|medium|hard",
      "concept": "Concept being tested"
    }
  ]
}`,

  feedbackProvider: `You are a supportive tutor providing feedback on a student's answer.

When correct:
- Celebrate briefly and specifically
- Reinforce why it's correct
- Add a bit of extra insight

When incorrect:
- Be encouraging, not discouraging
- Explain why their answer was wrong without making them feel bad
- Guide them to the correct understanding
- Suggest a way to remember the correct concept

Always end with an encouraging note.`
};

async function callGemini(systemPrompt: string, userContent: string, temperature = 0.7): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  // Use gemini-2.5-flash which is available in your account
  const model = "gemini-2.5-flash";
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  
  // Combine system prompt and user content
  const fullPrompt = `${systemPrompt}\n\n${userContent}`;
  
  // Limit content size to avoid token limits (Gemini 1.5 Flash has ~1M token context)
  const maxChars = 800000; // Conservative limit
  const truncatedContent = fullPrompt.length > maxChars 
    ? fullPrompt.substring(0, maxChars) + "\n\n[Content truncated due to length...]"
    : fullPrompt;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: truncatedContent }]
          }
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: 8192, // gemini-2.5-flash supports up to 8192
          topP: 0.95,
          topK: 40,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error response:", errorText);
      let errorMessage = `Gemini API error: ${response.status}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        // If not JSON, use the text as is
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error("No candidates in Gemini response:", JSON.stringify(data));
      throw new Error("No response from Gemini API");
    }
    
    const text = data.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.error("Empty text in Gemini response:", JSON.stringify(data));
      throw new Error("Empty response from Gemini API");
    }
    
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

async function streamGemini(systemPrompt: string, messages: { role: string; content: string }[]): Promise<ReadableStream> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = "gemini-2.5-flash";
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`;

  const formattedContents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // Prepend system prompt to first message
  if (formattedContents.length > 0) {
    formattedContents[0].parts[0].text = `${systemPrompt}\n\n${formattedContents[0].parts[0].text}`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192, // gemini-2.5-flash supports up to 8192
          topP: 0.95,
          topK: 40,
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini streaming error:", error);
      let errorMessage = `Gemini API error: ${response.status}`;
      
      try {
        const errorJson = JSON.parse(error);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        // If not JSON, use the text as is
      }
      
      throw new Error(errorMessage);
    }

    if (!response.body) {
      throw new Error("No response body from Gemini API");
    }

    return response.body;
  } catch (error) {
    console.error("Error in streamGemini:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      }
    });
  }

  try {
    const body: TutorRequest = await req.json();
    const { action, material, messages, lessonContext, question, count } = body;

    switch (action) {
      case 'analyze_material': {
        if (!material) {
          throw new Error("Material content is required");
        }
        
        if (!material.trim()) {
          throw new Error("Material content cannot be empty");
        }
        
        console.log(`Analyzing material, length: ${material.length} characters`);
        
        try {
          const analysis = await callGemini(
            systemPrompts.analyzer,
            `Please analyze this learning material:\n\n${material}`,
            0.3
          );
          
          console.log(`Received analysis response, length: ${analysis.length} characters`);
          
          // Try to extract JSON from response - handle markdown code blocks
          let jsonText = analysis;
          
          // Remove markdown code blocks if present
          const codeBlockMatch = analysis.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
          if (codeBlockMatch) {
            jsonText = codeBlockMatch[1];
          } else {
            // Try to find JSON object
            const jsonMatch = analysis.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              jsonText = jsonMatch[0];
            }
          }
          
          let parsed;
          try {
            parsed = JSON.parse(jsonText);
          } catch (parseError) {
            console.error("JSON parse error:", parseError);
            console.error("Attempted to parse:", jsonText.substring(0, 500));
            // Return a fallback structure if JSON parsing fails
            parsed = {
              title: "Learning Material",
              topics: [{
                name: "General Topic",
                subtopics: [],
                keyConcepts: [],
                difficulty: "intermediate",
                estimatedMinutes: 30,
                order: 1
              }],
              overallDifficulty: "intermediate",
              totalEstimatedMinutes: 30,
              learningObjectives: ["Understand the key concepts"],
              prerequisites: [],
              conceptMap: {},
              rawResponse: analysis.substring(0, 1000) // Include first 1000 chars for debugging
            };
          }
          
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        } catch (geminiError: unknown) {
          console.error("Error in analyze_material:", geminiError);
          const errorMsg = geminiError instanceof Error ? geminiError.message : "Unknown error";
          throw new Error(`Failed to analyze material: ${errorMsg}`);
        }
      }

      case 'chat': {
        if (!messages || messages.length === 0) {
          throw new Error("Messages are required");
        }

        let contextPrompt = systemPrompts.tutor;
        
        if (lessonContext) {
          contextPrompt += `\n\nCurrent context:
- Topic: ${lessonContext.topic}
- Subtopic: ${lessonContext.subtopic || 'General'}
- Difficulty: ${lessonContext.difficulty}
- Learning Style: ${lessonContext.learningStyle}`;
        }

        const stream = await streamGemini(contextPrompt, messages);
        
        return new Response(stream, {
          headers: { ...corsHeaders, "Content-Type": "text/event-stream" }
        });
      }

      case 'generate_question': {
        if (!lessonContext) {
          throw new Error("Lesson context is required");
        }

        const questionCount = count || 10;
        console.log(`Generating ${questionCount} questions for topic: ${lessonContext.topic}`);

        const prompt = `Generate exactly ${questionCount} questions about:
Topic: ${lessonContext.topic}
Subtopic: ${lessonContext.subtopic || 'General'}
Difficulty: ${lessonContext.difficulty}

IMPORTANT: You MUST generate exactly ${questionCount} questions, no more, no less.

Mix of difficulty levels (easy, medium, hard). Include both multiple choice and short answer questions.`;

        const questions = await callGemini(systemPrompts.questionGenerator, prompt, 0.5);
        
        const jsonMatch = questions.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { questions: [] };
        
        console.log(`Generated ${parsed.questions?.length || 0} questions (requested: ${questionCount})`);
        
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      case 'check_answer': {
        if (!question) {
          throw new Error("Question data is required");
        }

        const prompt = `Student answered a question:

Question: ${question.question}
${question.options ? `Options:\n${question.options.join('\n')}` : ''}
Correct Answer: ${question.correctAnswer}
Student's Answer: ${question.userAnswer}

Is the student correct? Provide encouraging feedback.`;

        const feedback = await callGemini(systemPrompts.feedbackProvider, prompt, 0.6);
        
        const isCorrect = question.userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim() ||
                         question.userAnswer.toUpperCase() === question.correctAnswer.toUpperCase();
        
        return new Response(JSON.stringify({ isCorrect, feedback }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      case 'get_summary': {
        if (!lessonContext) {
          throw new Error("Lesson context is required");
        }

        const prompt = `Create a brief session recap for a student who has been learning about:
Topic: ${lessonContext.topic}
Learning Style: ${lessonContext.learningStyle}

Include:
1. Key takeaways (3-5 bullet points)
2. What they did well
3. Areas to focus on next
4. An encouraging closing message`;

        const summary = await callGemini(systemPrompts.tutor, prompt, 0.7);
        
        return new Response(JSON.stringify({ summary }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: unknown) {
    console.error("AI Tutor error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Log full error details for debugging
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      error: JSON.stringify(error)
    });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: Deno.env.get("DENO_ENV") === "development" ? errorStack : undefined
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
