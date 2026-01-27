import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userContent}` }]
          }
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: 4096,
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function streamGemini(systemPrompt: string, messages: { role: string; content: string }[]): Promise<ReadableStream> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const formattedContents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // Prepend system prompt to first message
  if (formattedContents.length > 0) {
    formattedContents[0].parts[0].text = `${systemPrompt}\n\n${formattedContents[0].parts[0].text}`;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Gemini streaming error:", error);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  return response.body!;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: TutorRequest = await req.json();
    const { action, material, messages, lessonContext, question } = body;

    switch (action) {
      case 'analyze_material': {
        if (!material) {
          throw new Error("Material content is required");
        }
        
        const analysis = await callGemini(
          systemPrompts.analyzer,
          `Please analyze this learning material:\n\n${material.substring(0, 50000)}`,
          0.3
        );
        
        // Extract JSON from response
        const jsonMatch = analysis.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse analysis" };
        
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
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

        const prompt = `Generate 3 questions about:
Topic: ${lessonContext.topic}
Subtopic: ${lessonContext.subtopic || 'General'}
Difficulty: ${lessonContext.difficulty}

Mix of easy, medium, and hard questions. Include multiple choice and short answer.`;

        const questions = await callGemini(systemPrompts.questionGenerator, prompt, 0.5);
        
        const jsonMatch = questions.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { questions: [] };
        
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
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
