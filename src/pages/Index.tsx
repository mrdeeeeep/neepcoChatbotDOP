import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";

type RecentChat = { id: string; title: string; messages: Message[] };
type Message = { sender: 'user' | 'bot'; text: string };

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<RecentChat | null>(null);
  const [pendingChatId, setPendingChatId] = useState<string | null>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleSelectChat = (chat: RecentChat) => {
    setSelectedChat(chat);
  };

  const handleNewChat = () => {
    setSelectedChat(null);
  };

  const handleChatUpdate = (chatId: string, messages: Message[]) => {
    // This function can be used to update the sidebar when chat changes
    // For now, the sidebar will refresh via the useEffect interval
  };

  const handlePendingChange = (chatId: string | null) => {
    setPendingChatId(chatId);
  };

  return (
    <div className="flex h-screen w-full font-quicksand overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onToggle={toggleSidebar}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        currentChatId={selectedChat?.id || null}
        pendingChatId={pendingChatId}
      />
      <ChatArea 
        onToggleSidebar={toggleSidebar}
        selectedChat={selectedChat}
        onChatUpdate={handleChatUpdate}
        onPendingChange={handlePendingChange}
      />
    </div>
  );
};

export default Index;
