"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Plus,
  Search,
  Home,
  FileText,
  Clock,
  RefreshCw,
  Paperclip,
  Image as ImageIcon,
  Send,
  Loader2,
  User,
  Mail,
  FileQuestion,
  Settings,
} from "lucide-react";
import Image from "next/image";

type Message = {
  id: number;
  content: string;
  isUser: boolean;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

export function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [isSidebarExtended, setIsSidebarExtended] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now(),
      title: `New Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats((prev) => [...prev, newChat]);
    setCurrentChat(newChat);
    setIsSidebarExtended(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleSendMessage = async () => {
    if (!prompt.trim() && !draggedImage) return;

    setIsLoading(true);
    const newMessage: Message = {
      id: Date.now(),
      content: prompt,
      isUser: true,
    };
    setCurrentChat((prev) => {
      if (!prev) return null;
      return { ...prev, messages: [...prev.messages, newMessage] };
    });
    setPrompt("");
    setDraggedImage(null);

    // Simulate API response
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const botResponse: Message = {
      id: Date.now() + 1,
      content: "This is a dummy response from the AI.",
      isUser: false,
    };
    setCurrentChat((prev) => {
      if (!prev) return null;
      return { ...prev, messages: [...prev.messages, botResponse] };
    });
    setIsLoading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDraggedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDraggedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const promptCards = [
    { title: "Write a to-do list for a personal project or task", icon: User },
    { title: "Generate an email to reply to a job offer", icon: Mail },
    {
      title: "Summarise this article or text for me in one paragraph",
      icon: FileQuestion,
    },
    { title: "How does AI work in a technical capacity", icon: Settings },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [currentChat?.messages]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        initial={{ width: "4rem" }}
        animate={{ width: isSidebarExtended ? "20rem" : "4rem" }}
        className="bg-white border-r flex h-full overflow-hidden"
      >
        <div className="w-16 flex flex-col items-center py-4 gap-6 border-r">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <X className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={handleNewChat}
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => setIsSidebarExtended(!isSidebarExtended)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <FileText className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Clock className="h-5 w-5" />
          </Button>
        </div>
        <AnimatePresence>
          {isSidebarExtended && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "16rem" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 p-4 overflow-hidden"
            >
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
              />
              <ScrollArea className="h-[calc(100vh-8rem)]">
                {filteredChats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start px-2 py-1 text-left mb-1"
                    onClick={() => setCurrentChat(chat)}
                  >
                    <div className="truncate">
                      {chat.title}
                      {chat.messages.length > 0 && (
                        <p className="text-xs text-gray-500 truncate">
                          {chat.messages[chat.messages.length - 1].content}
                        </p>
                      )}
                    </div>
                  </Button>
                ))}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence>
          {!currentChat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 max-w-4xl mx-auto px-8 py-14 overflow-y-auto "
            >
              <h1 className="text-4xl font-semibold mb-2">
                Hi there, <span className="text-purple-600">David</span>
              </h1>
              <h2 className="text-3xl font-semibold mb-4">
                What{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  would you like to Study?
                </span>
              </h2>
              <p className="text-gray-500 mb-8">
                Use one of the most common prompts below or use your own to
                begin
              </p>

              {/* Prompt Cards Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {promptCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3"
                      onClick={() => {
                        handleNewChat();
                        setPrompt(card.title);
                      }}
                    >
                      <card.icon className="h-5 w-5 mt-0.5 text-gray-500" />
                      <p className="text-sm">{card.title}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Refresh Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-8"
              >
                <Button
                  variant="ghost"
                  onClick={handleRefresh}
                  className="text-gray-500"
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh Prompts
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages */}
        {currentChat && (
          <ScrollArea className="flex-1 p-4 py-10" ref={chatScrollRef}>
            <AnimatePresence>
              {currentChat.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-4 p-3 rounded-lg ${
                    message.isUser ? "bg-purple-100 ml-auto" : "bg-gray-100"
                  } max-w-[80%]`}
                >
                  {message.content}
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        )}

        {/* Input Area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="p-4 bg-white border-t"
        >
          <div
            className="relative flex justify-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Textarea
              ref={textareaRef}
              placeholder="Ask whatever you want...."
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                // handleNewChat();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();

                  if (currentChat === null) {
                    handleNewChat();
                  }
                  handleSendMessage();
                }
              }}
              className="pr-24 py-3 min-h-[70px] max-h-[200px] w-[60rem] resize-none"
              rows={1}
            />
            {draggedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 relative inline-block"
              >
                <Image
                  src={draggedImage}
                  alt="Dragged"
                  className="max-h-32 rounded-lg border-2 border-purple-500"
                  width={100}
                  height={100}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-1 right-1 bg-white rounded-full"
                  onClick={() => setDraggedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="rounded-full"
                onClick={handleSendMessage}
                disabled={isLoading || (!prompt && !draggedImage)}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="absolute bottom-2 left-3 text-sm text-gray-400">
              {prompt.length}/1000
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
