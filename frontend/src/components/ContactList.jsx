import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "../components/UsersLoadingSkeleton";

const ContactList = () => {

    const { allContacts, getAllContacts, isUsersLoading } = useChatStore();

     useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

    if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
    {allContacts.map(contact => (

      <div
        key={contact._id}
      className="bg-emerald-500/10 p-4 rounded-lg cursor-pointer hover:bg-emerald-500/20 transition-colors border border-zinc-700/40">
        <div className="flex items-center gap-3">
          <div className={`avatar online`}>
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
