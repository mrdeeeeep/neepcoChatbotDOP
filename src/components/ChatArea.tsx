import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Mic, Send, Sparkles, Menu, ThumbsUp, ThumbsDown, MessageSquare, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { askQuestion, submitFeedback, checkRequestStatus, QueueStatus } from "../inferenceAPI";

const RECENT_CHATS_KEY = "recentChats";

type RecentChat = { id: string; title: string; messages: Message[] };
type Message = { 
  sender: 'user' | 'bot'; 
  text: string; 
  requestId?: string; 
  context?: string;
  feedbackGiven?: boolean;
};

interface ChatAreaProps {
  onToggleSidebar: () => void;
  selectedChat: RecentChat | null;
  onChatUpdate: (chatId: string, messages: Message[]) => void;
}

const ChatArea = ({ onToggleSidebar, selectedChat, onChatUpdate }: ChatAreaProps) => {
  const suggestions = [
    "How to grant joining time extensions?",
    "What are conditions for write-offs?",
    "Delegation for approving resignations",
    "Limits on recruitment sanction approvals"
  ];

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<{ [key: number]: boolean }>({});
  const [feedbackData, setFeedbackData] = useState<{ [key: number]: { feedback: string; comment: string } }>({});
  const [submittingFeedback, setSubmittingFeedback] = useState<{ [key: number]: boolean }>({});
  
  // Queue-related state
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear session storage and polling when component mounts/unmounts
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.clear();
      // Clear any active polling
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        sessionStorage.removeItem(RECENT_CHATS_KEY);
        // Clear polling when tab becomes hidden
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
          setCurrentRequestId(null);
          setQueueStatus(null);
          setLoading(false);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Load selected chat
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setChatId(selectedChat.id);
    }
  }, [selectedChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, queueStatus]);

  // Save chat to sessionStorage whenever messages change
  useEffect(() => {
    if (!chatId || messages.length === 0) return;
    
    const stored = sessionStorage.getItem(RECENT_CHATS_KEY);
    let chats: RecentChat[] = stored ? JSON.parse(stored) : [];
    const idx = chats.findIndex(c => c.id === chatId);
    
    const firstMessage = messages[0];
    const title = firstMessage?.text
      ? firstMessage.text.slice(0, 50) + (firstMessage.text.length > 50 ? '...' : '')
      : 'New Chat';

    const updatedChat = {
      id: chatId,
      title,
      messages
    };

    if (idx !== -1) {
      chats[idx] = updatedChat;
    } else {
      chats.push(updatedChat);
    }
    
    sessionStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(chats));
    onChatUpdate(chatId, messages);
  }, [messages, chatId, onChatUpdate]);

  // Polling function for checking request status
  const pollRequestStatus = async (requestId: string) => {
    try {
      const statusResponse = await checkRequestStatus(requestId);
      
      const newQueueStatus: QueueStatus = {
        status: statusResponse.status,
        message: statusResponse.message,
        queuePosition: statusResponse.queue_position,
        estimatedWaitTime: statusResponse.estimated_wait_time,
        error: statusResponse.error
      };

      // If completed, extract the result
      if (statusResponse.status === 'completed' && statusResponse.result) {
        newQueueStatus.result = {
          answer: statusResponse.result.answer,
          requestId: statusResponse.result.request_id,
          context: statusResponse.result.context_used
        };
      }

      setQueueStatus(newQueueStatus);

      // Stop polling if completed or failed
      if (statusResponse.status === 'completed' || statusResponse.status === 'failed') {
        // Clear polling first to prevent multiple executions
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        
        setLoading(false);
        setCurrentRequestId(null);

        if (statusResponse.status === 'completed' && statusResponse.result) {
          // Add bot response to messages
          const botMessage: Message = {
            sender: 'bot',
            text: statusResponse.result.answer,
            requestId: statusResponse.result.request_id,
            context: statusResponse.result.context_used,
            feedbackGiven: false
          };
          
          // Use functional update to avoid stale state
          setMessages(prev => {
            // Check if this message was already added (prevent duplicates)
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.sender === 'bot' && lastMessage.requestId === statusResponse.result?.request_id) {
              return prev; // Don't add duplicate
            }
            return [...prev, botMessage];
          });
        } else if (statusResponse.status === 'failed') {
          // Add error message
          const errorMessage: Message = {
            sender: 'bot',
            text: statusResponse.error || "Sorry, an error occurred while processing your request."
          };
          
          setMessages(prev => {
            // Check if error message was already added
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.sender === 'bot' && lastMessage.text === errorMessage.text) {
              return prev; // Don't add duplicate
            }
            return [...prev, errorMessage];
          });
        }

        // Clear queue status after a delay
        setTimeout(() => {
          setQueueStatus(null);
        }, 2000);
        
        // Return true to indicate polling should stop
        return true;
      }
      
      // Return false to continue polling
      return false;

    } catch (error) {
      console.error('Error polling request status:', error);
      // Continue polling on error, but update status
      setQueueStatus(prev => prev ? {
        ...prev,
        message: "Connection issue while checking status. Retrying..."
      } : null);
      
      // Return false to continue polling
      return false;
    }
  };

  // Start polling for request status
  const startPolling = (requestId: string) => {
    // Clear any existing interval first
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    
    const interval = setInterval(async () => {
      const shouldStop = await pollRequestStatus(requestId);
      if (shouldStop && interval) {
        clearInterval(interval);
        setPollingInterval(null);
      }
    }, 3000); // Poll every 3 seconds
    
    setPollingInterval(interval);
    
    // Poll immediately (but don't wait for it to complete)
    pollRequestStatus(requestId).then(shouldStop => {
      if (shouldStop && interval) {
        clearInterval(interval);
        setPollingInterval(null);
      }
    });
  };

  // Animation variants
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

  // Handle feedback submission
  const handleFeedbackSubmit = async (messageIndex: number, botMessage: Message, userMessage: Message) => {
    const feedback = feedbackData[messageIndex];
    if (!feedback || !feedback.feedback) return;

    setSubmittingFeedback(prev => ({ ...prev, [messageIndex]: true }));

    try {
      await submitFeedback({
        request_id: botMessage.requestId || '',
        question: userMessage.text,
        answer: botMessage.text,
        context_used: botMessage.context || '',
        feedback: feedback.feedback,
        comment: feedback.comment || undefined
      });

      // Mark feedback as given
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], feedbackGiven: true };
      setMessages(updatedMessages);
      setShowFeedback(prev => ({ ...prev, [messageIndex]: false }));
      
      // Clear feedback data
      setFeedbackData(prev => {
        const newData = { ...prev };
        delete newData[messageIndex];
        return newData;
      });

    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmittingFeedback(prev => ({ ...prev, [messageIndex]: false }));
    }
  };

  // Handle input submit
  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading || currentRequestId) return;

    let newChatId = chatId;
    if (!chatId) {
      newChatId = Date.now().toString();
      setChatId(newChatId);
    }

    const userMessage = { sender: 'user' as const, text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);
    setError(null);
    const currentInput = input;
    setInput("");
    
    setTimeout(() => inputRef.current?.focus(), 200);
    
    try {
      const queueResponse = await askQuestion({ question: currentInput });
      
      setCurrentRequestId(queueResponse.request_id);
      
      // Set initial queue status
      const initialStatus: QueueStatus = {
        status: queueResponse.status,
        message: queueResponse.message,
        queuePosition: queueResponse.queue_position,
        estimatedWaitTime: queueResponse.estimated_wait_time
      };
      
      setQueueStatus(initialStatus);
      
      // Handle different queue responses
      if (queueResponse.status === 'queue_full') {
        setLoading(false);
        setCurrentRequestId(null);
        setError("Queue is full. Please try again later.");
        
        // Remove the user message since request failed
        setMessages(prev => prev.slice(0, -1));
        
        // Clear queue status after delay
        setTimeout(() => {
          setQueueStatus(null);
        }, 5000);
        
      } else if (queueResponse.status === 'processing') {
        // Start polling immediately for processing requests
        startPolling(queueResponse.request_id);
        
      } else if (queueResponse.status === 'queued') {
        // Start polling for queued requests
        startPolling(queueResponse.request_id);
      }
      
    } catch (err: any) {
      console.error('API Error:', err);
      setLoading(false);
      setCurrentRequestId(null);
      setQueueStatus(null);
      setError("Failed to get response. Please try again.");
      
      const errorMessages = [...newMessages, { 
        sender: 'bot' as const, 
        text: "Sorry, I'm having trouble connecting to the server. Please try again in a moment." 
      }];
      setMessages(errorMessages);
    }
  };

  // Handle suggestion click
  const handleSuggestion = async (s: string) => {
    if (loading || currentRequestId) return;
    
    let newChatId = chatId;
    if (!chatId) {
      newChatId = Date.now().toString();
      setChatId(newChatId);
    }

    const userMessage = { sender: 'user' as const, text: s };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);
    setError(null);
    
    setTimeout(() => inputRef.current?.focus(), 200);
    
    try {
      const queueResponse = await askQuestion({ question: s });
      
      setCurrentRequestId(queueResponse.request_id);
      
      // Set initial queue status
      const initialStatus: QueueStatus = {
        status: queueResponse.status,
        message: queueResponse.message,
        queuePosition: queueResponse.queue_position,
        estimatedWaitTime: queueResponse.estimated_wait_time
      };
      
      setQueueStatus(initialStatus);
      
      // Handle different queue responses
      if (queueResponse.status === 'queue_full') {
        setLoading(false);
        setCurrentRequestId(null);
        setError("Queue is full. Please try again later.");
        
        // Remove the user message since request failed
        setMessages(prev => prev.slice(0, -1));
        
        // Clear queue status after delay
        setTimeout(() => {
          setQueueStatus(null);
        }, 5000);
        
      } else if (queueResponse.status === 'processing') {
        // Start polling immediately for processing requests
        startPolling(queueResponse.request_id);
        
      } else if (queueResponse.status === 'queued') {
        // Start polling for queued requests
        startPolling(queueResponse.request_id);
      }
      
    } catch (err: any) {
      console.error('API Error:', err);
      setLoading(false);
      setCurrentRequestId(null);
      setQueueStatus(null);
      setError("Failed to get response. Please try again.");
      
      const errorMessages = [...newMessages, { 
        sender: 'bot' as const, 
        text: "Sorry, I'm having trouble connecting to the server. Please try again in a moment." 
      }];
      setMessages(errorMessages);
    }
  };

  const formatBotMessage = (text: string) => {
    return text
      .replace(/\* (.*?)(?=\n|$)/g, '• $1<br/>')
      .replace(/\n/g, '<br/>');
  };

  const showChat = messages.length > 0 || loading || queueStatus;
  const isInputDisabled = loading || currentRequestId !== null;

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 relative">
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
                    disabled={isInputDisabled}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bottom Section with Input */}
            <div className="flex flex-col items-center p-4 md:p-6 space-y-4">
              <form
                className="w-full max-w-3xl bg-white rounded-2xl p-3 md:p-4 shadow-lg border border-gray-200"
                onSubmit={handleSubmit}
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-custom-red hidden md:flex" type="button">
                    {/* <Paperclip className="w-4 md:w-5 h-4 md:h-5" /> */}
                  </Button>
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
                    }}
                    placeholder="Ask about delegations of power..."
                    className="flex-1 border-0 bg-transparent text-gray-700 placeholder:text-gray-400 font-quicksand focus-visible:ring-0 text-sm md:text-base"
                    disabled={isInputDisabled}
                  />
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-custom-red hidden md:flex" type="button">
                    <Mic className="w-4 md:w-5 h-4 md:h-5" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-custom-red hover:bg-custom-blue text-white rounded-xl px-3 md:px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    aria-label="Send"
                    disabled={isInputDisabled}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat View */}
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
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white/80 backdrop-blur-md flex-shrink-0">
              <div className="flex items-center gap-2">
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
                className="text-gray-500 hover:text-custom-red text-sm md:text-base"
                onClick={() => {
                  setMessages([]);
                  setChatId(null);
                  setShowFeedback({});
                  setFeedbackData({});
                  setQueueStatus(null);
                  setCurrentRequestId(null);
                  setLoading(false);
                  if (pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                  }
                }}
              >
                Close
              </Button>
            </div>

            {/* Chat Messages Container - Centered */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0 flex justify-center">
              <div className="w-full max-w-4xl">
                <div className="flex flex-col gap-4 md:gap-6">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07, type: 'spring', stiffness: 300, damping: 30 }}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] md:max-w-[70%] font-quicksand text-sm md:text-base leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-custom-blue text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md'
                            : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100'
                        }`}
                      >
                        {msg.sender === 'bot' ? (
                          <div 
                            className="whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                              __html: formatBotMessage(msg.text)
                            }}
                          />
                        ) : (
                          msg.text
                        )}
                      </div>

                      {/* Feedback Section for Bot Messages */}
                      {msg.sender === 'bot' && msg.requestId && !msg.feedbackGiven && (
                        <div className="mt-2 flex flex-col space-y-2">
                          {!showFeedback[idx] ? (
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-green-600 h-8 px-2"
                                onClick={() => {
                                  setFeedbackData(prev => ({ 
                                    ...prev, 
                                    [idx]: { feedback: 'positive', comment: '' } 
                                  }));
                                  setShowFeedback(prev => ({ ...prev, [idx]: true }));
                                }}
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-red-600 h-8 px-2"
                                onClick={() => {
                                  setFeedbackData(prev => ({ 
                                    ...prev, 
                                    [idx]: { feedback: 'negative', comment: '' } 
                                  }));
                                  setShowFeedback(prev => ({ ...prev, [idx]: true }));
                                }}
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-blue-600 h-8 px-2"
                                onClick={() => {
                                  setFeedbackData(prev => ({ 
                                    ...prev, 
                                    [idx]: { feedback: 'neutral', comment: '' } 
                                  }));
                                  setShowFeedback(prev => ({ ...prev, [idx]: true }));
                                }}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-w-md">
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Feedback Type
                                  </label>
                                  <div className="flex space-x-2">
                                    {['positive', 'negative', 'neutral'].map((type) => (
                                      <Button
                                        key={type}
                                        variant={feedbackData[idx]?.feedback === type ? "default" : "outline"}
                                        size="sm"
                                        className={`h-8 text-xs ${
                                          feedbackData[idx]?.feedback === type 
                                            ? type === 'positive' 
                                              ? 'bg-green-600 hover:bg-green-700' 
                                              : type === 'negative' 
                                              ? 'bg-red-600 hover:bg-red-700'
                                              : 'bg-blue-600 hover:bg-blue-700'
                                            : ''
                                        }`}
                                        onClick={() => {
                                          setFeedbackData(prev => ({
                                            ...prev,
                                            [idx]: { ...prev[idx], feedback: type }
                                          }));
                                        }}
                                      >
                                        {type === 'positive' && <ThumbsUp className="w-3 h-3 mr-1" />}
                                        {type === 'negative' && <ThumbsDown className="w-3 h-3 mr-1" />}
                                        {type === 'neutral' && <MessageSquare className="w-3 h-3 mr-1" />}
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Comments (Optional)
                                  </label>
                                  <Textarea
                                    placeholder="Share your thoughts about this response..."
                                    value={feedbackData[idx]?.comment || ''}
                                    onChange={(e) => {
                                      setFeedbackData(prev => ({
                                        ...prev,
                                        [idx]: { ...prev[idx], comment: e.target.value }
                                      }));
                                    }}
                                    className="text-sm h-20 resize-none"
                                  />
                                </div>

                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    className="bg-custom-blue hover:bg-custom-red text-white"
                                    onClick={() => {
                                      const userMessage = messages[idx - 1]; // Previous message should be user message
                                      handleFeedbackSubmit(idx, msg, userMessage);
                                    }}
                                    disabled={submittingFeedback[idx] || !feedbackData[idx]?.feedback}
                                  >
                                    {submittingFeedback[idx] ? 'Submitting...' : 'Submit Feedback'}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setShowFeedback(prev => ({ ...prev, [idx]: false }));
                                      setFeedbackData(prev => {
                                        const newData = { ...prev };
                                        delete newData[idx];
                                        return newData;
                                      });
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Feedback Given Indicator */}
                      {msg.sender === 'bot' && msg.feedbackGiven && (
                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Feedback submitted
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Queue Status Display */}
                  {queueStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[75%] md:max-w-[70%] bg-blue-50 text-blue-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-blue-200 font-quicksand text-sm md:text-base">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {queueStatus.status === 'processing' ? (
                              <div className="flex space-x-1 mt-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            ) : queueStatus.status === 'queued' ? (
                              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                            ) : queueStatus.status === 'queue_full' ? (
                              <Users className="w-5 h-5 text-red-600 mt-0.5" />
                            ) : null}
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium mb-1">
                              {queueStatus.status === 'processing' && 'Processing your request...'}
                              {queueStatus.status === 'queued' && 'Request queued'}
                              {queueStatus.status === 'queue_full' && 'Queue full'}
                            </div>
                            
                            <div className="text-sm text-blue-700">
                              {queueStatus.message}
                            </div>
                            
                            {queueStatus.queuePosition && queueStatus.queuePosition > 0 && (
                              <div className="text-sm text-blue-600 mt-2 flex items-center space-x-4">
                                <span>Position: #{queueStatus.queuePosition}</span>
                                {queueStatus.estimatedWaitTime && (
                                  <span>Est. wait: {queueStatus.estimatedWaitTime}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {loading && !queueStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[75%] md:max-w-[70%] bg-white text-gray-600 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 font-quicksand text-sm md:text-base italic">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span>Connecting...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {error && (
                    <div className="flex justify-center">
                      <div className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                        {error}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Chat Input at Bottom - Centered */}
            <div className="flex-shrink-0 p-4 md:p-6 bg-white border-t border-gray-200">
              <div className="max-w-4xl mx-auto">
                <form
                  className="w-full bg-white rounded-2xl p-3 md:p-4 shadow-lg border border-gray-200"
                  onSubmit={handleSubmit}
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-custom-red hidden md:flex" type="button">
                      {/* <Paperclip className="w-4 md:w-5 h-4 md:h-5" /> */}
                    </Button>
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
                      }}
                      placeholder={isInputDisabled ? "Please wait for current request..." : "Type your message..."}
                      className="flex-1 border-0 bg-transparent text-gray-700 placeholder:text-gray-400 font-quicksand focus-visible:ring-0 text-sm md:text-base"
                      disabled={isInputDisabled}
                    />
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-custom-red hidden md:flex" type="button">
                      <Mic className="w-4 md:w-5 h-4 md:h-5" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-custom-red hover:bg-custom-blue text-white rounded-xl px-3 md:px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      aria-label="Send"
                      disabled={isInputDisabled}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatArea;