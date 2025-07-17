import { MessageSquare, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const RECENT_CHATS_KEY = "recentChats";
type RecentChat = { id: string; title: string };

const Sidebar = () => {
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<RecentChat | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_CHATS_KEY);
    if (stored) setRecentChats(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(recentChats));
  }, [recentChats]);

  const addNewChat = (title: string) => {
    const newChat: RecentChat = { id: Date.now().toString(), title };
    setRecentChats((prevChats) => [...prevChats, newChat]);
  };

  const selectChat = (chat: RecentChat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="w-64 bg-custom-white h-screen flex flex-col p-4 border-r border-custom-blue/20">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <img src="public/logo/neepcologo.png" alt="NEEPCO Logo" className="w-12 h-12 rounded-lg" />
        
      </div>

      {/* Main Actions */}
      <div className="space-y-2 mb-8">
        <Button className="w-full justify-start bg-custom-red hover:bg-custom-blue text-custom-white font-quicksand font-medium" size="sm">
          <MessageSquare className="w-4 h-4 mr-3" />
          New Chat
        </Button>
        
        <Button variant="ghost" className="w-full justify-start text-custom-blue hover:text-custom-red hover:bg-custom-blue/10 font-quicksand" size="sm">
          <Search className="w-4 h-4 mr-3" />
          Search Chats
        </Button>
      </div>

      {/* Recent Chats */}
      <div className="flex-1">
        <h3 className="text-sm font-quicksand font-medium text-custom-blue/70 mb-3">Recent Chats</h3>
        <div className="space-y-1">
          {recentChats.length === 0 ? (
            <div className="text-custom-blue/40 text-xs font-quicksand px-2 py-4">No recent chats yet.</div>
          ) : (
            recentChats.map(chat => (
              <Button
                key={chat.id}
                variant="ghost"
                className={`w-full justify-start text-custom-blue hover:text-custom-red hover:bg-custom-blue/10 font-quicksand text-sm h-auto py-2 ${selectedChat?.id === chat.id ? 'bg-custom-blue/10' : ''}`}
                onClick={() => selectChat(chat)}
              >
                <FileText className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="truncate">{chat.title}</span>
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;