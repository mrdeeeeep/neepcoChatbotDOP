import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Mic, Send, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askQuestion } from "../inferenceAPI";

const RECENT_CHATS_KEY = "recentChats";

type RecentChat = { id: string; title: string; messages: Message[] };
type Message = { sender: 'user' | 'bot'; text: string };

interface ChatAreaProps {
  onToggleSidebar: () => void;
}

const ChatArea = ({ onToggleSidebar }: ChatAreaProps) => {
  const suggestions = [
    "Help me understand delegation procedures",
    "What are the approval limits for different roles?",
    "Show me financial delegation guidelines",
    "Explain procurement authority levels"
  ];

  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load last chat on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_CHATS_KEY);
    if (stored) {
      const chats: RecentChat[] = JSON.parse(stored);
      if (chats.length > 0) {
        setMessages(chats[chats.length - 1].messages);
        setChatId(chats[chats.length - 1].id);
        setShowChat(true);
      }
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Save chat to localStorage whenever messages change
  useEffect(() => {
    if (!chatId) return;
    const stored = localStorage.getItem(RECENT_CHATS_KEY);
    let chats: RecentChat[] = stored ? JSON.parse(stored) : [];
    const idx = chats.findIndex(c => c.id === chatId);
    if (idx !== -1) {
      chats[idx].messages = messages;
    } else {
      chats.push({ id: chatId, title: messages[0]?.text?.slice(0, 30) || 'New Chat', messages });
    }
    localStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(chats));
  }, [messages, chatId]);

  // Animation variants for chat view
  const chatVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.95, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: 'spring' as const,
        stiffness: 600,
        damping: 40,
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      y: -80,
      scale: 0.95,
      filter: "blur(8px)",
      transition: { duration: 0.4 }
    }
  };

  // Handle input submit (Enter or Send)
  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setShowChat(true);
    let newChatId = chatId;
    if (!chatId) {
      newChatId = Date.now().toString();
      setChatId(newChatId);
    }
    const userMessage = { sender: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 200);
    try {
      const response = await askQuestion({ question: input });
      setMessages((prev) => [...prev, { sender: 'bot', text: response }]);
    } catch (err: any) {
      setError("Failed to get response. Please try again.");
      setMessages((prev) => [...prev, { sender: 'bot', text: "Sorry, I couldn't get a response." }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestion = async (s: string) => {
    setInput("");
    setShowChat(true);
    let newChatId = chatId;
    if (!chatId) {
      newChatId = Date.now().toString();
      setChatId(newChatId);
    }
    const userMessage = { sender: 'user' as const, text: s };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 200);
    try {
      const response = await askQuestion({ question: s });
      setMessages((prev) => [...prev, { sender: 'bot', text: response }]);
    } catch (err: any) {
      setError("Failed to get response. Please try again.");
      setMessages((prev) => [...prev, { sender: 'bot', text: "Sorry, I couldn't get a response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-custom-white relative">
      <AnimatePresence>
        {!showChat && (
          <motion.div
            key="landing"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatVariants}
            className="flex-1 flex flex-col h-full"
          >
            {/* Mobile Menu Button */}
            <div className="flex justify-start p-4 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-custom-blue hover:text-custom-red"
                onClick={onToggleSidebar}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>

            {/* Main Content Container */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-h-0">
              {/* Welcome Message */}
              <div className="text-center mb-8 md:mb-12 px-4">
                <h1 className="text-2xl md:text-4xl font-quicksand font-bold text-custom-blue mb-2">
                  Welcome to NEEPCO Chatbot
                </h1>
                <p className="text-lg md:text-xl font-quicksand text-custom-blue">
                  Your assistant for <span className="text-custom-red font-medium">Delegations of Power queries</span>
                </p>
              </div>
              <p className="text-custom-blue/70 font-quicksand mb-6 text-center px-4">
                How can I help you with delegation procedures?
              </p>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4 mb-8">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="bg-custom-red/5 backdrop-blur-sm border-custom-red/20 text-custom-blue hover:bg-custom-red/10 hover:border-custom-red/30 text-xs md:text-sm font-quicksand text-left p-3 md:p-4 h-auto rounded-xl"
                    onClick={() => handleSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bottom Section with Input */}
            <div className="flex flex-col items-center p-4 md:p-6 space-y-4">
              {/* Chat Input */}
              <form
                className="w-full max-w-2xl bg-custom-white rounded-2xl p-3 md:p-4 shadow-lg border border-custom-blue/20"
                onSubmit={handleSubmit}
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Button variant="ghost" size="sm" className="text-custom-blue hover:text-custom-red hidden md:flex" type="button">
                    <Paperclip className="w-4 md:w-5 h-4 md:h-5" />
                  </Button>
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
                    }}
                    placeholder="Ask about delegations of power..."
                    className="flex-1 border-0 bg-transparent text-custom-blue placeholder:text-custom-blue/60 font-quicksand focus-visible:ring-0 text-sm md:text-base"
                  />
                  <Button variant="ghost" size="sm" className="text-custom-blue hover:text-custom-red hidden md:flex" type="button">
                    <Mic className="w-4 md:w-5 h-4 md:h-5" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-custom-red hover:bg-custom-blue text-custom-white rounded-xl px-3 md:px-4"
                    type="submit"
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>

              {/* Attach Section */}
              <div className="flex items-center justify-center">
                <Button variant="ghost" className="text-custom-blue/70 hover:text-custom-red hover:bg-custom-red/10 font-quicksand text-sm md:text-base">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat View with Animation */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            key="chat"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatVariants}
            className="flex-1 flex flex-col h-full"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-custom-blue/10 bg-custom-white/80 backdrop-blur-md flex-shrink-0">
              <div className="flex items-center gap-2">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-custom-blue hover:text-custom-red mr-2"
                  onClick={onToggleSidebar}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <Sparkles className="w-5 md:w-6 h-5 md:h-6 text-custom-red" />
                <span className="font-quicksand text-base md:text-lg text-custom-blue font-bold">NEEPCO Chat</span>
              </div>
              <Button
                variant="ghost"
                className="text-custom-blue/50 hover:text-custom-red text-sm md:text-base"
                onClick={() => setShowChat(false)}
              >
                Close
              </Button>
            </div>

            {/* Chat Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
              <div className="flex flex-col gap-4 md:gap-6 min-h-full">
                {messages.length === 0 ? (
                  <div className="text-custom-blue/60 font-quicksand text-center flex-1 flex items-center justify-center">
                    No messages yet.
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07, type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <div
                        className={`rounded-xl px-3 md:px-4 py-2 md:py-3 max-w-[90%] md:max-w-[80%] font-quicksand shadow-md text-sm md:text-base ${
                          msg.sender === 'user'
                            ? 'bg-custom-blue text-white ml-auto'
                            : 'bg-custom-white text-custom-blue mr-auto border border-custom-blue/10'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))
                )}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="rounded-xl px-3 md:px-4 py-2 md:py-3 max-w-[90%] md:max-w-[80%] font-quicksand shadow-md bg-custom-white text-custom-blue mr-auto border border-custom-blue/10 opacity-60 italic text-sm md:text-base">
                      ...Generating response
                    </div>
                  </motion.div>
                )}
                {error && (
                  <div className="text-red-500 text-sm mb-2">{error}</div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input at Bottom - Fixed Position */}
            <div className="flex-shrink-0 p-4 md:p-6 bg-custom-white border-t border-custom-blue/10">
              <form
                className="w-full max-w-4xl mx-auto bg-custom-white rounded-2xl p-3 md:p-4 shadow-lg border border-custom-blue/20"
                onSubmit={handleSubmit}
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Button variant="ghost" size="sm" className="text-custom-blue hover:text-custom-red hidden md:flex" type="button">
                    <Paperclip className="w-4 md:w-5 h-4 md:h-5" />
                  </Button>
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
                    }}
                    placeholder="Type your message..."
                    className="flex-1 border-0 bg-transparent text-custom-blue placeholder:text-custom-blue/60 font-quicksand focus-visible:ring-0 text-sm md:text-base"
                  />
                  <Button variant="ghost" size="sm" className="text-custom-blue hover:text-custom-red hidden md:flex" type="button">
                    <Mic className="w-4 md:w-5 h-4 md:h-5" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-custom-red hover:bg-custom-blue text-custom-white rounded-xl px-3 md:px-4"
                    type="submit"
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatArea;
