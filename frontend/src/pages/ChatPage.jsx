import BorderAnimatedContainer from "../components/BorderAnimatedContainer"
import ProfileHeader from "../components/ProfileHeader"
import ActiveTabSwitch from "../components/ActiveTabSwitch"
import ChatsList from "../components/ChatsList"
import ContactList from "../components/ContactList"
import ChatContainer from "../components/ChatContainer"
import NoConversationPlaceholder from "../components/NoConversationPlaceholder"
import {useChatStore} from "../store/useChatStore"
import { useEffect } from "react"
import { useShallow } from "zustand/react/shallow";


const ChatPage = () => {
  const { activeTab, selectedUser, subscribeToMessages, unsubscribeFromMessages } =
    useChatStore(
      useShallow((state) => ({
        activeTab: state.activeTab,
        selectedUser: state.selectedUser,
        subscribeToMessages: state.subscribeToMessages,
        unsubscribeFromMessages: state.unsubscribeFromMessages,
      })),
    );

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages]);

   return (
    <div className="fixed inset-0 w-screen h-[100dvh] md:relative md:inset-auto md:w-full md:max-w-6xl md:h-[800px]">
      <BorderAnimatedContainer className="rounded-none border-0 animate-none md:rounded-2xl md:border md:animate-border">
        <div className="relative w-full h-full md:flex">
          <div
            className={`absolute inset-y-0 left-0 w-full bg-zinc-800/50 backdrop-blur-sm flex flex-col transition-transform duration-300 md:static md:w-80 md:translate-x-0 ${
              selectedUser ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <ProfileHeader/>
            <ActiveTabSwitch />

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </div>

          <div
            className={`absolute inset-y-0 left-0 w-full bg-zinc-900/50 backdrop-blur-sm flex flex-col transition-transform duration-300 md:static md:flex-1 md:translate-x-0 ${
              selectedUser ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage
