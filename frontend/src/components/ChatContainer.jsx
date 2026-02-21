import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { useEffect, useRef } from "react";

const ChatContainer = () => {
  const {
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    selectedUser,
    subscribeToTyping,
    unsubscribeFromTyping,
  } =
    useChatStore();
    const messageEndRef = useRef()
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToTyping();

    return () => {
      unsubscribeFromTyping();
    };
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToTyping,
    unsubscribeFromTyping,
  ]);

  useEffect(() => {
    if(messageEndRef.current){
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  },[messages])

  const isOwnMessage = (msg) => String(msg.senderId) === String(authUser._id);

  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-3 sm:px-6 overflow-y-auto py-4 sm:py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              // TEXT MESSAGE
              <div
                key={msg._id}
                className={`chat ${isOwnMessage(msg) ? "chat-end" : "chat-start"} `}
              >
                <div
                  className={`chat-bubble ${isOwnMessage(msg) ? "bg-emerald-500  bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-zinc-800 text-zinc-200"}  text-white relative`}
                >
                  {msg.text && <p>{msg.text}</p>}
                  {msg.image && (
                    <div className="relative mt-2">
                      <img
                        src={msg.image}
                        alt="Shared"
                        className={`rounded-lg h-48 object-cover ${msg.isPending ? "blur-sm opacity-70" : ""}`}
                      />
                      {msg.isPending && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/45 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="w-3 h-3 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString(["en-PK"],{
                      hour:"2-digit",
                      minute:"2-digit"
                    })}
                    {msg.isPending && <span>sending</span>}
                  </p>
                </div>
              </div>
            ))}

            <div ref={messageEndRef}/>
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
