import {XIcon} from "lucide-react"
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const {selectedUser, setSelectedUser, isTyping} = useChatStore()
  const { onlineUsers } = useAuthStore();
    const isOnline = onlineUsers.includes(selectedUser._id);
  useEffect(() => {
    const handleEscKey = (event) => {
      if(event.key === "Escape"){
        setSelectedUser(null)
      }
    }

    window.addEventListener("keydown", handleEscKey)

    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  },[setSelectedUser])

 return (
  <div
    className="flex justify-between items-center bg-zinc-800/50 border-b
    border-zinc-700/50 max-h-[84px] px-6 flex-1"
  >
    <div className="flex items-center space-x-3">
      
      
      <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

  
      <div>
        <h3 className="text-zinc-200 font-medium">
          {selectedUser.fullName}
        </h3>
        <p className="text-slate-400 text-sm">
          {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>

   
    <button onClick={() => setSelectedUser(null)}>
      <XIcon className="w-5 h-5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer" />
    </button>
  </div>
);

}

export default ChatHeader
