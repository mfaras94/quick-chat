import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { useEffect, useState } from "react";

const ChatContainer = () => {
  const { getMessagesByUserId, messages, isMessagesLoading, selectedUser } =
    useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser,getMessagesByUserId]);


  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              // TEXT MESSAGE
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"} `}
              >
                <div
                  className={`chat-bubble ${msg.senderId === authUser._id ? "bg-emerald-500  bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-zinc-800 text-zinc-200"}  text-white relative`}
                >
                  <p>{msg.text}</p>
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(["en-PK"],{
                      hour:"2-digit",
                      minute:"2-digit"
                    })}
                  </p>
                </div>
              </div>
            ))}

      
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
};

export default ChatContainer;
