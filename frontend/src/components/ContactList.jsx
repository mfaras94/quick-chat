import { useEffect, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "../components/UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { useShallow } from "zustand/react/shallow";

const ContactList = () => {

    const { allContacts, getAllContacts, isUsersLoading, setSelectedUser } =
      useChatStore(
        useShallow((state) => ({
          allContacts: state.allContacts,
          getAllContacts: state.getAllContacts,
          isUsersLoading: state.isUsersLoading,
          setSelectedUser: state.setSelectedUser,
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
    {allContacts.map(contact => (

      <div
        key={contact._id}
      className="bg-emerald-500/10 p-4 rounded-lg cursor-pointer hover:bg-emerald-500/20 transition-colors border border-zinc-700/40"
        onClick={() =>  setSelectedUser(contact)}
      >
        <div className="flex items-center gap-3">
          <div className={`avatar ${onlineSet.has(String(contact._id)) ? "online" : "offline"}`}>
            <div className="size-12 rounded-full">
             <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.fullName}
                />
            </div>
          </div>
          <h4 className="text-zinc-200 font-medium">{contact.fullName}</h4>
        </div>
      </div>
    ))}
    </>
  );
};

export default ContactList;
