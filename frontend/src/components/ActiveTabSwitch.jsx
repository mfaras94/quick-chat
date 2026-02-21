import { useChatStore } from "../store/useChatStore";
import { useShallow } from "zustand/react/shallow";

const ActiveTabSwitch = () => {
    const { activeTab, setActiveTab } = useChatStore(
      useShallow((state) => ({
        activeTab: state.activeTab,
        setActiveTab: state.setActiveTab,
      })),
    );

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab ${
          activeTab === "chats" ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-400"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab ${
          activeTab === "contacts" ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-400"
        }`}
      >
        People
      </button>
    </div>
  );
}

export default ActiveTabSwitch
