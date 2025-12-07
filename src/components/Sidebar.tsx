import { MessageSquare, Search, FileText, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ServerStatus from "./ServerStatus";

const NeepcoLogo = "/logo/neepcologo.png";

const RECENT_CHATS_KEY = "recentChats";
type RecentChat = { id: string; title: string; messages: Message[] };
type Message = { 
  sender: 'user' | 'bot'; 
  text: string; 
  requestId?: string; 
  context?: string;
  feedbackGiven?: boolean;
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onSelectChat: (chat: RecentChat) => void;
  onNewChat: () => void;
  currentChatId: string | null;
}

const Sidebar = ({ isOpen, onClose, onToggle, onSelectChat, onNewChat, currentChatId }: SidebarProps) => {
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);

  // Load chats from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem(RECENT_CHATS_KEY);
    if (stored) {
      try {
        const chats = JSON.parse(stored);
        setRecentChats(chats);
      } catch (error) {
        console.error('Error parsing stored chats:', error);
        setRecentChats([]);
      }
    }

    // Clear chats only when tab/window is closed (not when switching tabs)
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(RECENT_CHATS_KEY);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Listen for sessionStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = sessionStorage.getItem(RECENT_CHATS_KEY);
      if (stored) {
        try {
          const chats = JSON.parse(stored);
          setRecentChats(chats);
        } catch (error) {
          console.error('Error parsing stored chats:', error);
        }
      } else {
        setRecentChats([]);
      }
    };

    const interval = setInterval(handleStorageChange, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectChat = (chat: RecentChat) => {
    onSelectChat(chat);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleNewChat = () => {
    onNewChat();
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 left-0 z-50 
        w-64 bg-custom-white h-screen flex flex-col p-4 
        border-r border-custom-blue/20
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <div className="flex items-center">
            <img src={NeepcoLogo} alt="NEEPCO Logo" className="w-8 h-8 rounded-lg mr-2" />
            <span className="font-quicksand font-bold text-custom-blue">NEEPCO</span>z
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-custom-blue hover:text-custom-red"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Desktop Logo */}
        <div className="hidden md:flex items-center justify-center mb-8">
          <img src={NeepcoLogo} alt="NEEPCO Logo" className="w-12 h-12 rounded-lg" />
        </div>

        {/* Main Actions */}
        <div className="space-y-2 mb-6 md:mb-8">
          <Button 
            onClick={handleNewChat}
            className="w-full justify-start bg-custom-red hover:bg-custom-blue text-custom-white font-quicksand font-medium text-sm md:text-base" 
            size="sm"
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            New Chat
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-custom-blue hover:text-custom-red hover:bg-custom-blue/10 font-quicksand text-sm md:text-base" size="sm">
            <Search className="w-4 h-4 mr-3" />
            Search Chats
          </Button>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-quicksand font-medium text-custom-blue/70 mb-3">Recent Chats (Session Only)</h3>
          <div className="space-y-1">
            {recentChats.length === 0 ? (
              <div className="text-custom-blue/40 text-xs font-quicksand px-2 py-4">No recent chats in this session.</div>
            ) : (
              recentChats.map(chat => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className={`w-full justify-start text-custom-blue hover:text-custom-red hover:bg-custom-blue/10 font-quicksand text-xs md:text-sm h-auto py-2 ${
                    currentChatId === chat.id ? 'bg-custom-blue/10 text-custom-red' : ''
                  }`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <FileText className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="truncate text-left">{chat.title}</span>
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Server Status */}
        <div className="pt-4 mt-4 border-t border-custom-blue/20">
          <ServerStatus />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
