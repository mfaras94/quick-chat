import { useChatStore } from "../store/useChatStore"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput"

const ChatContainer = () => {
  const {getMessagesByUserId, messages,isMessagesLoading,selectedUser} = useChatStore()
  return (
  <>
    <ChatHeader />

    <div className="flex-1 px-6 overflow-y-auto py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* RECEIVED MESSAGE */}
        <div className="chat chat-start">
          <div className="chat-bubble bg-zinc-800 text-zinc-200 relative">
            <p>Hello Faras 👋</p>
            <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
              09:41 AM
            </p>
          </div>
        </div>

        {/* SENT MESSAGE */}
        <div className="chat chat-end">
          <div className="chat-bubble bg-emerald-500  bg-gradient-to-r from-emerald-500 to-teal-500 text-white relative">
            <p>Hey! How are you?</p>
            <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
              09:42 AM
            </p>
          </div>
        </div>

        {/* IMAGE MESSAGE */}
        <div className="chat chat-start">
          <div className="chat-bubble bg-zinc-800 text-zinc-200 relative">
            <img
              src="https://via.placeholder.com/300"
              alt="Shared"
              className="rounded-lg h-48 object-cover"
            />
            <p className="text-xs mt-2 opacity-75">
              09:43 AM
            </p>
          </div>
        </div>

      </div>
    </div>

    <MessageInput />
  </>
);

}

export default ChatContainer
