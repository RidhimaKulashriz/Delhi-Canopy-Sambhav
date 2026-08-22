import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Brain, 
  Sparkles, 
  MessageCircle, 
  X, 
  Send,
  ChevronUp,
  Zap,
  Loader2,
  AlertCircle,
  Trash2
} from "lucide-react";
import { useCanopyAI } from "@/hooks/useCanopyAI";
import ReactMarkdown from "react-markdown";

const quickActions = [
  "Analyze current heat stress zones",
  "Show green cover recommendations",
  "Identify high-risk wards",
  "Plan plantation strategy",
];

export function FloatingAIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { messages, isLoading, error, sendMessage, clearMessages, isLocalPreview } = useCanopyAI();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isExpanded]);

  const handleSend = () => {
    if (!message.trim() || isLoading) return;
    sendMessage(message.trim());
    setMessage("");
  };

  const handleQuickAction = (action: string) => {
    if (isLoading) return;
    sendMessage(action);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 w-96 glass-card glow-border overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full ai-orb flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="w-3 h-3 text-secondary" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-semibold">Canopy AI</h3>
                    <div className="flex items-center gap-1">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isLoading ? "bg-yellow-500 animate-pulse" : "bg-primary animate-pulse"
                      )} />
                      <span className="text-[10px] text-muted-foreground font-tech">
                        {isLoading ? "Thinking..." : isLocalPreview ? "Local preview" : "Ready"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <button
                      onClick={clearMessages}
                      className="p-1.5 rounded-lg hover:bg-card/50 transition-colors"
                      title="Clear chat"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 rounded-lg hover:bg-card/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="p-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-4">
              {/* Welcome message when empty */}
              {messages.length === 0 && (
                <>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-card/50 border border-border/50">
                      <p className="text-sm text-foreground/90">
                        Hello! I'm Canopy AI, your urban green intelligence assistant. 
                        I can analyze heat stress zones, recommend plantation strategies, 
                        and provide real-time environmental insights for Delhi. How can I help you today?
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground font-tech uppercase tracking-wider">Quick Actions</p>
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickAction(action)}
                          disabled={isLoading}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 disabled:opacity-50"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Message History */}
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center",
                    msg.role === "assistant" 
                      ? "bg-gradient-to-br from-primary to-secondary" 
                      : "bg-muted"
                  )}>
                    {msg.role === "assistant" ? (
                      <Zap className="w-3 h-3 text-primary-foreground" />
                    ) : (
                      <span className="text-[10px] font-bold text-muted-foreground">U</span>
                    )}
                  </div>
                  <div className={cn(
                    "flex-1 p-3 rounded-lg max-w-[85%]",
                    msg.role === "assistant" 
                      ? "bg-card/50 border border-border/50" 
                      : "bg-primary/10 border border-primary/20"
                  )}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none text-foreground/90">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/90">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && messages.length > 0 && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0 flex items-center justify-center">
                    <Loader2 className="w-3 h-3 text-primary-foreground animate-spin" />
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-card/50 border border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Error display */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about green cover, heat zones..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/30 focus:outline-none text-sm placeholder:text-muted-foreground disabled:opacity-50"
                />
                <button 
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-primary" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Orb Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative w-14 h-14 rounded-full",
          "ai-orb",
          "flex items-center justify-center",
          "transition-all duration-300",
          "float"
        )}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <ChevronUp className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-0 rounded-full border border-secondary/30 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      </motion.button>
    </div>
  );
}
