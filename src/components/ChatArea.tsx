import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Mic, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askQuestion } from "../inferenceAPI";

const RECENT_CHATS_KEY = "recentChats";

type RecentChat = { id: string; title: string; messages: Message[] };

type Message = { sender: 'user' | 'bot'; text: string };

const ChatArea = () => {
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

  // Load last chat on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_CHATS_KEY);
    if (stored) {
      const chats: RecentChat[] = JSON.parse(stored);
      if (chats.length > 0) {
        setMessages(chats[chats.length - 1].messages);
        setChatId(chats[chats.length - 1].id);
      }
    }
  }, []);

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
    <div className="flex-1 flex flex-col h-screen bg-custom-white relative overflow-hidden">
      <AnimatePresence>
        {!showChat && (
          <motion.div
            key="landing"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatVariants}
            className="flex-1 flex flex-col items-center justify-center p-8 absolute inset-0 z-10 bg-custom-white"
          >
            {/* Welcome Message */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-quicksand font-bold text-custom-blue mb-2">
                Welcome to NEEPCO Chatbot
              </h1>
              <p className="text-xl font-quicksand text-custom-blue">
                Your assistant for <span className="text-custom-red font-medium">Delegations of Power queries</span>
              </p>
            </div>
            <p className="text-custom-blue/70 font-quicksand mb-6">
              How can I help you with delegation procedures?
            </p>
            {/* Chat Input */}
            <form
              className="w-full max-w-2xl bg-custom-white rounded-2xl p-4 mb-8 shadow-lg border border-custom-blue/20"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="text-custom-blue hover:text-custom-red" type="button">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
                  }}
                  placeholder="Ask about delegations of power..."
                  className="flex-1 border-0 bg-transparent text-custom-blue placeholder:text-custom-blue/60 font-quicksand focus-visible:ring-0"
                />
                <Button variant="ghost" size="sm" className="text-custom-blue hover:text-custom-red" type="button">
                  <Mic className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  className="bg-custom-red hover:bg-custom-blue text-custom-white rounded-xl px-4"
                  type="submit"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="bg-custom-red/5 backdrop-blur-sm border-custom-red/20 text-custom-blue hover:bg-custom-red/10 hover:border-custom-red/30 text-sm font-quicksand text-left p-4 h-auto rounded-xl"
                  onClick={() => handleSuggestion(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
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
            className="flex-1 flex flex-col h-full absolute inset-0 z-20 bg-custom-white"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-custom-blue/10 bg-custom-white/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-custom-red" />
                <span className="font-quicksand text-lg text-custom-blue font-bold">NEEPCO Chat</span>
              </div>
              <Button
                variant="ghost"
                className="text-custom-blue/50 hover:text-custom-red"
                onClick={() => setShowChat(false)}
              >
                Close
              </Button>
            </div>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
              {messages.length === 0 ? (
                <div className="text-custom-blue/60 font-quicksand text-center">No messages yet.</div>
              ) : (
                messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07, type: 'spring', stiffness: 300, damping: 30 }}
                    className="mb-4"
                  >
                    <div
                      className={`rounded-xl px-4 py-3 max-w-[80%] font-quicksand shadow-md ${
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
                  className="mb-4"
                >
                  <div className="rounded-xl px-4 py-3 max-w-[80%] font-quicksand shadow-md bg-custom-white text-custom-blue mr-auto border border-custom-blue/10 opacity-60 italic">
                    ...Generating response
                  </div>
                </motion.div>
              )}
              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}
            </div>
            {/* Chat Input at Bottom */}
            <form
              className="w-full max-w-2xl mx-auto bg-custom-white rounded-2xl p-4 mb-8 shadow-lg border border-custom-blue/20"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="text-custom-blue hover:text-custom-red" type="button">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
                  }}
                  placeholder="Type your message..."
                  className="flex-1 border-0 bg-transparent text-custom-blue placeholder:text-custom-blue/60 font-quicksand focus-visible:ring-0"
                />
                <Button variant="ghost" size="sm" className="text-custom-blue hover:text-custom-red" type="button">
                  <Mic className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  className="bg-custom-red hover:bg-custom-blue text-custom-white rounded-xl px-4"
                  type="submit"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Attach Section at Bottom for landing only */}
      {!showChat && (
        <div className="p-6">
          <div className="flex items-center justify-center">
            <Button variant="ghost" className="text-custom-blue/70 hover:text-custom-red hover:bg-custom-red/10 font-quicksand">
              <Paperclip className="w-4 h-4 mr-2" />
              Attach
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatArea;