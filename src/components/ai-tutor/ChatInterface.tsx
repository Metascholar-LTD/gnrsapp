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
  BookOpen,
  MessageCircle
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
  { icon: Lightbulb, text: "Explain simply", prompt: "Can you explain this concept in very simple terms, like I'm 10 years old? Use fun analogies and everyday examples." },
  { icon: HelpCircle, text: "I'm confused", prompt: "I'm confused about this topic. Can you explain it differently, maybe with a step-by-step breakdown?" },
  { icon: RefreshCw, text: "Give example", prompt: "Can you give me a practical, real-world example to help me understand this better?" },
  { icon: BookOpen, text: "Summarize", prompt: "Can you summarize the key points I need to remember about this topic?" },
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
      simple: "I'll explain everything in the simplest way possible, using everyday examples and analogies. No jargon, I promise!",
      balanced: "I'll give you clear explanations with the right amount of depth. Feel free to ask for more details anytime!",
      exam_focused: "Let's focus on what's most likely to come up in exams. I'll highlight key points and common question types.",
      deep_conceptual: "Let's dive deep! I'll help you understand the 'why' behind everything and how concepts connect."
    };

    return `# Welcome to your study session

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

Let's make learning fun! What's on your mind?`;
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

  const isGreeting = (message: Message) => message.id === 'greeting';

  return (
    <>
      <style>{`
        .chat-interface {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .chat-interface .welcome-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        }

        .chat-interface .message-bubble {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .chat-interface .message-bubble.user {
          background: #1f2937;
          color: #ffffff;
        }

        .chat-interface .message-bubble.assistant {
          background: #ffffff;
          color: #111827;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
        }

        .chat-interface .prose {
          color: #374151;
          line-height: 1.7;
        }

        .chat-interface .prose h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-top: 0;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .chat-interface .prose h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .chat-interface .prose h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .chat-interface .prose p {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          color: #374151;
          line-height: 1.7;
        }

        .chat-interface .prose strong {
          font-weight: 600;
          color: #111827;
        }

        .chat-interface .prose ul,
        .chat-interface .prose ol {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
        }

        .chat-interface .prose li {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          color: #374151;
          line-height: 1.7;
        }

        .chat-interface .prose code {
          background: #f3f4f6;
          color: #111827;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-size: 0.875em;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
        }

        .chat-interface .prose pre {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          overflow-x: auto;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .chat-interface .quick-prompt-btn {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          color: #374151;
          transition: all 0.15s ease;
        }

        .chat-interface .quick-prompt-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          color: #111827;
        }

        .chat-interface .input-area {
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
        }

        .chat-interface .send-button {
          background: #1f2937;
          color: #ffffff;
        }

        .chat-interface .send-button:hover:not(:disabled) {
          background: #111827;
        }

        .chat-interface .send-button:disabled {
          background: #d1d5db;
          color: #9ca3af;
        }
      `}</style>
      <div className="chat-interface flex h-full flex-col bg-[#fafafa]">
        {/* Chat messages */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="mx-auto max-w-3xl px-4 min-[768px]:px-6 py-6 min-[768px]:py-8">
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => {
                  const isWelcome = isGreeting(message);
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "flex",
                        message.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {isWelcome ? (
                        // Welcome Card - Spacious and Modern
                        <div className="welcome-card w-full max-w-full p-6 min-[768px]:p-8 min-[1200px]:p-10 relative">
                          {/* Mark as Complete Button - Desktop Only */}
                          <div className="hidden min-[1200px]:block absolute top-6 min-[1200px]:top-8 right-6 min-[1200px]:right-8">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={onLessonComplete}
                              className="gap-2 text-[#059669] hover:text-[#047857] hover:bg-[#ecfdf5] font-semibold border border-[#d1fae5] bg-white shadow-sm"
                              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Mark as complete
                            </Button>
                          </div>
                          
                          <div className="space-y-6 min-[768px]:space-y-8 pr-0 min-[1200px]:pr-32">
                            {/* Header */}
                            <div className="space-y-3">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 min-[768px]:w-12 min-[768px]:h-12 rounded-xl bg-[#f3f4f6] flex items-center justify-center">
                                  <MessageCircle className="w-5 h-5 min-[768px]:w-6 min-[768px]:h-6 text-[#6b7280]" />
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                  <h1 className="text-xl min-[768px]:text-2xl font-bold text-[#111827] leading-tight mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Welcome to your study session
                                  </h1>
                                  <p className="text-sm min-[768px]:text-base text-[#6b7280] leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    I'm your AI tutor, ready to help you learn about{' '}
                                    <span className="font-semibold text-[#111827]">{topic}</span>
                                    {subtopic && (
                                      <span className="text-[#6b7280]"> — focusing on "{subtopic}"</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="prose prose-slate max-w-none">
                              <ReactMarkdown>
                                {message.content.replace(/^# Welcome to your study session\n\nI'm your AI tutor[^]*?\.\n\n/, '')}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Regular Message Bubbles
                        <div
                          className={cn(
                            "message-bubble max-w-[85%] min-[768px]:max-w-[75%] rounded-2xl px-4 py-3 min-[768px]:px-5 min-[768px]:py-4",
                            message.role === 'user' ? "user" : "assistant"
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
                            <p className="text-sm min-[768px]:text-base leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {message.content}
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Streaming indicator */}
              {isStreaming && messages[messages.length - 1]?.content === '' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 border border-[#e5e7eb] shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-[#6b7280]" />
                    <span className="text-sm text-[#6b7280]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Thinking...
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Quick prompts */}
        {showQuickPrompts && messages.length <= 1 && (
          <div className="input-area px-4 min-[768px]:px-6 py-4 border-t border-[#e5e7eb] bg-white">
            <div className="mx-auto max-w-3xl">
              <p className="mb-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Quick actions
              </p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.text}
                    onClick={() => handleSend(prompt.prompt)}
                    className="quick-prompt-btn flex items-center gap-2 rounded-lg px-3 py-2 text-xs min-[768px]:text-sm font-medium transition-all"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <prompt.icon className="h-3.5 w-3.5 min-[768px]:h-4 min-[768px]:w-4 flex-shrink-0" />
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="input-area px-4 min-[768px]:px-6 py-4 min-[768px]:py-5">
          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about this topic..."
                disabled={isStreaming}
                className="min-h-[56px] min-[768px]:min-h-[64px] resize-none rounded-xl border-[#e5e7eb] bg-white pr-14 min-[768px]:pr-16 text-sm min-[768px]:text-base focus:border-[#9ca3af] focus:ring-2 focus:ring-[#f3f4f6] transition-all"
                rows={1}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isStreaming}
                size="icon"
                className="send-button absolute bottom-2 right-2 h-9 w-9 min-[768px]:h-10 min-[768px]:w-10 rounded-lg transition-all"
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex flex-col min-[768px]:flex-row items-stretch min-[768px]:items-center justify-between gap-2 min-[768px]:gap-0">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRequestQuiz}
                  className="gap-1.5 text-[#6b7280] hover:text-[#111827] hover:bg-[#f9fafb] flex-1 min-[768px]:flex-initial"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden min-[768px]:inline">Quiz me</span>
                  <span className="min-[768px]:hidden">Quiz</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowRecap}
                  className="gap-1.5 text-[#6b7280] hover:text-[#111827] hover:bg-[#f9fafb] flex-1 min-[768px]:flex-initial"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="hidden min-[768px]:inline">End session</span>
                  <span className="min-[768px]:hidden">End</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLessonComplete}
                className="gap-1.5 text-[#059669] hover:text-[#047857] hover:bg-[#ecfdf5] font-semibold flex-1 min-[768px]:flex-initial"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as complete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
