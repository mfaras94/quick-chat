import {XIcon} from "lucide-react"
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

const ChatHeader = () => {
  const {selectedUser, setSelectedUser} = useChatStore()

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
      
      {/* AVATAR */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Online Indicator */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-900 rounded-full"></span>
      </div>

      {/* USER INFO */}
      <div>
        <h3 className="text-zinc-200 font-medium">
          {selectedUser.fullName}
        </h3>
        <p className="text-zinc-400 text-sm">
          Online
        </p>
      </div>
    </div>

    {/* CLOSE BUTTON */}
    <button onClick={() => setSelectedUser(null)}>
      <XIcon className="w-5 h-5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer" />
    </button>
  </div>
);

}

export default ChatHeader
