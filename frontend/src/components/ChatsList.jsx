import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "../components/UsersLoadingSkeleton";
import NoChatsFound from "../components/NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";
import { ChevronDown, Trash2, BellOff, Archive, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

const ChatsList = () => {
  const { chats, getMyChatPartners, isUsersLoading, setSelectedUser} = useChatStore();
   const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if(chats.length === 0) return <NoChatsFound/>

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-emerald-500/10 p-4 rounded-lg cursor-pointer hover:bg-emerald-500/20 transition-colors border border-zinc-700/40"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"} `}>
                <div className="size-12 rounded-full">
                  <img
                    src={chat.profilePic || "/avatar.png"}
                    alt={chat.fullName}
                  />
                </div>
              </div>
              <h4 className="text-zinc-200 font-medium truncate">
                {chat.fullName}
              </h4>
            </div>

            <div className="dropdown dropdown-end" onClick={(e) => e.stopPropagation()}>
              <button tabIndex={0} className="btn btn-ghost btn-xs text-zinc-400 hover:text-zinc-200">
                <ChevronDown className="w-4 h-4" />
              </button>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-zinc-800 rounded-box w-44 border border-zinc-700/60">
                <li>
                  <button
                
                    className="text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete chat
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatsList;
