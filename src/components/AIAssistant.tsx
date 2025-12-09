import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Plus, 
  ThumbsUp, 
  ThumbsDown, 
  X, 
  Bot,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! 👋 How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help! This is a simulated response. In a real implementation, this would connect to your AI service.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleRetry = () => {
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      setMessages((prev) => prev.slice(0, -1));
      setInputValue(messages[messages.length - 1]?.content || "");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {/* Floating Robot Button */}
      <div className="fixed bottom-[100px] right-6 z-40">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
            >
              <p className="font-medium">Stuck on something?</p>
              <p className="text-gray-300">Let me help, get a quick assist! 😊</p>
              <div className="absolute bottom-0 right-4 h-2 w-2 rotate-45 bg-gray-900 translate-y-1/2" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [
              0,      // Ground - start
              -45,    // Bounce 1: Peak up
              0,      // Ground - hit
              -38,    // Bounce 2: Peak up (smaller)
              0,      // Ground - hit
              -30,    // Bounce 3: Peak up
              0,      // Ground - hit
              -22,    // Bounce 4: Peak up
              0,      // Ground - hit
              -14,    // Bounce 5: Peak up
              0,      // Ground - hit
              -8,     // Bounce 6: Peak up
              0,      // Ground - hit
              -4,     // Bounce 7: Peak up
              0,      // Ground - hit
              -1.5,   // Bounce 8: Tiny peak
              0,      // Ground - final settle
              0       // Stay still
            ],
          }}
          transition={{
            y: {
              duration: 4,
              times: [
                0,      // Start
                0.12,   // Bounce 1 peak
                0.24,   // Bounce 1 ground
                0.32,   // Bounce 2 peak
                0.40,   // Bounce 2 ground
                0.46,   // Bounce 3 peak
                0.52,   // Bounce 3 ground
                0.57,   // Bounce 4 peak
                0.62,   // Bounce 4 ground
                0.66,   // Bounce 5 peak
                0.70,   // Bounce 5 ground
                0.73,   // Bounce 6 peak
                0.76,   // Bounce 6 ground
                0.78,   // Bounce 7 peak
                0.80,   // Bounce 7 ground
                0.82,   // Bounce 8 peak
                0.84,   // Bounce 8 ground
                1.0     // Stay still
              ],
              ease: [
                [0.25, 0.46, 0.45, 0.94],  // Bounce 1 up - elastic
                [0.55, 0.06, 0.68, 0.19],  // Bounce 1 down - gravity
                [0.25, 0.46, 0.45, 0.94],  // Bounce 2 up
                [0.55, 0.06, 0.68, 0.19],  // Bounce 2 down
                [0.25, 0.46, 0.45, 0.94],  // Bounce 3 up
                [0.55, 0.06, 0.68, 0.19],  // Bounce 3 down
                [0.25, 0.46, 0.45, 0.94],  // Bounce 4 up
                [0.55, 0.06, 0.68, 0.19],  // Bounce 4 down
                [0.25, 0.46, 0.45, 0.94],  // Bounce 5 up
                [0.55, 0.06, 0.68, 0.19],  // Bounce 5 down
                [0.25, 0.46, 0.45, 0.94],  // Bounce 6 up
                [0.55, 0.06, 0.68, 0.19],  // Bounce 6 down
                [0.25, 0.46, 0.45, 0.94],  // Bounce 7 up
                [0.55, 0.06, 0.68, 0.19],  // Bounce 7 down
                [0.25, 0.46, 0.45, 0.94],  // Bounce 8 up
                [0.55, 0.06, 0.68, 0.19],  // Bounce 8 down
                [0.25, 0.25, 0.75, 0.75]   // Settle - smooth stop
              ],
              repeat: Infinity,
              repeatDelay: 5, // Wait 5 seconds before bouncing again
            },
          }}
          aria-label="Open AI Assistant"
        >
          <motion.div
            animate={{
              rotate: [
                0,      // Start
                -20,    // Rotate on bounce 1
                20,     // Rotate back
                -16,    // Rotate on bounce 2
                16,     // Rotate back
                -12,    // Rotate on bounce 3
                12,     // Rotate back
                -8,     // Rotate on bounce 4
                8,      // Rotate back
                -5,     // Rotate on bounce 5
                5,      // Rotate back
                -3,     // Rotate on bounce 6
                3,      // Rotate back
                -1.5,   // Rotate on bounce 7
                1.5,    // Rotate back
                0,      // Settle
                0       // Stay still
              ],
            }}
            transition={{
              rotate: {
                duration: 4,
                times: [
                  0, 0.12, 0.24, 0.32, 0.40, 0.46, 0.52, 0.57, 0.62, 0.66, 0.70, 0.73, 0.76, 0.78, 0.80, 0.84, 1.0
                ],
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 5,
              },
            }}
          >
            <Bot className="h-8 w-8 text-white" />
          </motion.div>
        </motion.button>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-[100px] right-6 z-50 flex h-[600px] w-[420px] max-h-[calc(85vh-100px)] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/30 shadow-2xl border border-purple-100/50"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-purple-100/50 bg-white/80 backdrop-blur-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">AI Assistant</h3>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex w-full",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm",
                        message.role === "user"
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-900 border border-purple-100/50"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p
                        className={cn(
                          "mt-1 text-xs",
                          message.role === "user"
                            ? "text-gray-400"
                            : "text-gray-500"
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[75%] rounded-2xl bg-white border border-purple-100/50 px-4 py-2.5 shadow-sm">
                      <div className="flex gap-1">
                        <motion.div
                          className="h-2 w-2 rounded-full bg-purple-500"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="h-2 w-2 rounded-full bg-purple-500"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="h-2 w-2 rounded-full bg-purple-500"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-purple-100/50 bg-white/80 backdrop-blur-sm p-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                    <button
                      onClick={handleRetry}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      title="Retry"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                      <Plus className="h-4 w-4" />
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none border-none"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isLoading}
                      className={cn(
                        "rounded-full p-1.5 transition-all",
                        inputValue.trim() && !isLoading
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "text-gray-300 cursor-not-allowed"
                      )}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title="Helpful"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title="Not helpful"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

