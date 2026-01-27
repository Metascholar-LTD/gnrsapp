import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Loader2, 
  Sparkles, 
  RefreshCw,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAITutor } from '@/hooks/useAITutor';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'explanation' | 'question' | 'feedback' | 'tip';
}

interface ChatInterfaceProps {
  materialContent: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  learningStyle: string;
  onLessonComplete: () => void;
  onRequestQuiz: () => void;
  onShowRecap: () => void;
}

const quickPrompts = [
  { icon: Lightbulb, text: "Explain this like I'm 10", prompt: "Can you explain this concept in very simple terms, like I'm 10 years old? Use fun analogies and everyday examples." },
  { icon: HelpCircle, text: "I'm confused", prompt: "I'm confused about this topic. Can you explain it differently, maybe with a step-by-step breakdown?" },
  { icon: RefreshCw, text: "Give me an example", prompt: "Can you give me a practical, real-world example to help me understand this better?" },
  { icon: BookOpen, text: "Summarize key points", prompt: "Can you summarize the key points I need to remember about this topic?" },
];

export function ChatInterface({
  materialContent,
  topic,
  subtopic,
  difficulty,
  learningStyle,
  onLessonComplete,
  onRequestQuiz,
  onShowRecap
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { chat, isStreaming, streamedContent } = useAITutor();

  // Initialize with greeting
  useEffect(() => {
    const greeting = getGreeting();
    setMessages([{
      id: 'greeting',
      role: 'assistant',
      content: greeting,
      type: 'explanation'
    }]);
  }, [topic, subtopic]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedContent]);

  const getGreeting = () => {
    const styleIntro = {
      simple: "I'll explain everything in the simplest way possible, using everyday examples and analogies. No jargon, I promise! 🌟",
      balanced: "I'll give you clear explanations with the right amount of depth. Feel free to ask for more details anytime! 📚",
      exam_focused: "Let's focus on what's most likely to come up in exams. I'll highlight key points and common question types. 🎯",
      deep_conceptual: "Let's dive deep! I'll help you understand the 'why' behind everything and how concepts connect. 🔬"
    };

    return `# Welcome to your study session! 👋

I'm your AI tutor, and I'm excited to help you learn about **${topic}**${subtopic ? ` - specifically focusing on "${subtopic}"` : ''}.

${styleIntro[learningStyle as keyof typeof styleIntro] || styleIntro.balanced}

**Here's what I've prepared for you:**
- A structured breakdown of the key concepts
- Examples and analogies to make things click
- Questions to test your understanding
- Personalized explanations based on how you learn

**What would you like to start with?** You can:
- Ask me to explain any concept
- Request practice questions
- Ask "Why?" or "How?" about anything
- Say "I'm confused" and I'll try a different approach

Let's make learning fun! What's on your mind? 🚀`;
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isStreaming) return;

    setShowQuickPrompts(false);
    setInput('');

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText
    };

    setMessages(prev => [...prev, userMessage]);

    // Build context
    const contextMessages = messages.map(m => ({ role: m.role, content: m.content }));
    contextMessages.push({ role: 'user', content: messageText });

    // Add material context in first message
    if (contextMessages.length === 2) {
      contextMessages[0] = {
        ...contextMessages[0],
        content: `[Study Material Context]:\n${materialContent.substring(0, 10000)}\n\n[Tutor's Response]:\n${contextMessages[0].content}`
      };
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: ''
    };

    setMessages(prev => [...prev, assistantMessage]);

    const response = await chat(contextMessages, {
      topic,
      subtopic,
      difficulty,
      learningStyle
    });

    setMessages(prev => 
      prev.map(m => 
        m.id === assistantMessage.id 
          ? { ...m, content: response }
          : m
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="mx-auto max-w-3xl space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3",
                    message.role === 'user'
                      ? "bg-emerald-600 text-white"
                      : "bg-white shadow-sm border border-slate-200"
                  )}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-slate prose-sm max-w-none">
                      <ReactMarkdown>
                        {message.id === messages[messages.length - 1]?.id && isStreaming
                          ? streamedContent
                          : message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Streaming indicator */}
          {isStreaming && messages[messages.length - 1]?.content === '' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm border border-slate-200">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Quick prompts */}
      {showQuickPrompts && messages.length <= 1 && (
        <div className="border-t border-slate-200 bg-white px-4 py-3">
          <p className="mb-2 text-xs font-medium text-slate-400 uppercase tracking-wide">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt.text}
                variant="outline"
                size="sm"
                onClick={() => handleSend(prompt.prompt)}
                className="gap-1.5 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <prompt.icon className="h-3.5 w-3.5" />
                {prompt.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about this topic..."
              disabled={isStreaming}
              className="min-h-[56px] resize-none rounded-xl border-slate-200 pr-12 text-base focus:border-emerald-300 focus:ring-emerald-200"
              rows={1}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isStreaming}
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-lg bg-emerald-600 hover:bg-emerald-700"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onRequestQuiz}
                className="gap-1.5 text-slate-500 hover:text-emerald-600"
              >
                <Sparkles className="h-4 w-4" />
                Quiz me
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowRecap}
                className="gap-1.5 text-slate-500 hover:text-emerald-600"
              >
                <CheckCircle2 className="h-4 w-4" />
                End session
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLessonComplete}
              className="gap-1.5 text-emerald-600 hover:bg-emerald-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark as complete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
