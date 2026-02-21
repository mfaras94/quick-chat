import { useEffect, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "../components/UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { useShallow } from "zustand/react/shallow";

const ContactList = () => {

    const { allContacts, getAllContacts, isUsersLoading, setSelectedUser, selectedUser } =
      useChatStore(
        useShallow((state) => ({
          allContacts: state.allContacts,
          getAllContacts: state.getAllContacts,
          isUsersLoading: state.isUsersLoading,
          setSelectedUser: state.setSelectedUser,
          selectedUser: state.selectedUser,
        })),
      );
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const onlineSet = useMemo(
    () => new Set(onlineUsers.map((id) => String(id))),
    [onlineUsers],
  );
     useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

    if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
    {allContacts.map(contact => {
      const isActive = String(selectedUser?._id) === String(contact._id);
      return (

      <div
        key={contact._id}
      className={`rounded-xl cursor-pointer transition-all border ${
        isActive
          ? "bg-emerald-500/15 border-emerald-500/40 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]"
          : "bg-zinc-800/40 border-zinc-700/40 hover:bg-zinc-800/70 hover:border-emerald-500/30"
      } p-2.5 sm:p-3`}
        onClick={() =>  setSelectedUser(contact)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`avatar ${onlineSet.has(String(contact._id)) ? "online" : "offline"}`}>
            <div className="size-10 rounded-full">
             <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.fullName}
                />
            </div>
          </div>
          <h4 className="text-zinc-200 text-sm font-medium truncate">{contact.fullName}</h4>
        </div>
      </div>
      );
    })}
    </>
  );
};

export default ContactList;
