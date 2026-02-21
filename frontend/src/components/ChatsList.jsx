import { useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "../components/UsersLoadingSkeleton";
import NoChatsFound from "../components/NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";
import { ChevronDown, Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { useShallow } from "zustand/react/shallow";

const ChatsList = () => {
  const {
    chats,
    getMyChatPartners,
    isUsersLoading,
    setSelectedUser,
    deleteConversation,
    unreadCounts,
    selectedUser,
  } = useChatStore(
    useShallow((state) => ({
      chats: state.chats,
      getMyChatPartners: state.getMyChatPartners,
      isUsersLoading: state.isUsersLoading,
      setSelectedUser: state.setSelectedUser,
      deleteConversation: state.deleteConversation,
      unreadCounts: state.unreadCounts,
      selectedUser: state.selectedUser,
    })),
  );
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const onlineSet = useMemo(
    () => new Set(onlineUsers.map((id) => String(id))),
    [onlineUsers],
  );
  const deleteModalRef = useRef(null);
  const [pendingDeleteChat, setPendingDeleteChat] = useState(null);

  useEffect(() => {
    if (chats.length === 0) {
      getMyChatPartners();
    }
  }, [getMyChatPartners, chats.length]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if(chats.length === 0) return <NoChatsFound/>

  const handleOpenDeleteModal = (chat) => {
    setPendingDeleteChat(chat);
    deleteModalRef.current?.showModal();
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteChat?._id) return;
    await deleteConversation(pendingDeleteChat._id);
    setPendingDeleteChat(null);
    deleteModalRef.current?.close();
  };

  return (
    <>
      {chats.map((chat) => {
        const isActive = String(selectedUser?._id) === String(chat._id);
        return (
        <div
          key={chat._id}
          className={`group rounded-xl cursor-pointer transition-all border ${
            isActive
              ? "bg-emerald-500/15 border-emerald-500/40 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]"
              : "bg-zinc-800/40 border-zinc-700/40 hover:bg-zinc-800/70 hover:border-emerald-500/30"
          } p-2.5 sm:p-3`}
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <div className={`avatar ${onlineSet.has(String(chat._id)) ? "online" : "offline"} `}>
                  <div className="size-10 rounded-full">
                    <img
                      src={chat.profilePic || "/avatar.png"}
                      alt={chat.fullName}
                    />
                  </div>
                </div>
                {!!unreadCounts[String(chat._id)] && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-white text-[10px] font-semibold flex items-center justify-center border border-zinc-900 z-10">
                    {unreadCounts[String(chat._id)]}
                  </span>
                )}
              </div>
              <h4 className="text-zinc-200 text-sm font-medium truncate">
                {chat.fullName}
              </h4>
             
            </div>

            <div className="dropdown dropdown-end" onClick={(e) => e.stopPropagation()}>
              <button tabIndex={0} className="btn btn-ghost btn-xs text-zinc-500 hover:text-zinc-200 group-hover:text-zinc-300">
                <ChevronDown className="w-4 h-4" />
              </button>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-zinc-800 rounded-box w-44 border border-zinc-700/60">
                <li>
                  <button
                   onClick={() => handleOpenDeleteModal(chat)}
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
        );
      })}

      <ConfirmModal
        modalRef={deleteModalRef}
        title="Delete chat?"
        message={`Delete conversation with ${pendingDeleteChat?.fullName || "this user"}?`}
        confirmText="Delete chat"
        confirmClassName="btn btn-error text-white"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ChatsList;
