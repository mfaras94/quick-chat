import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled") ?? "true"),
  isTyping: false,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser?._id,
      receiverId: selectedUser._id,
      text: messageData?.text || "",
      image: messageData?.image || null,
      createdAt: new Date().toISOString(),
      isPending: true,
    };

    set((state) => ({ messages: state.messages.concat(optimisticMessage) }));
    set({ activeTab: "chats" });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set((state) => ({
        messages: state.messages.map((message) =>
          message._id === tempId ? res.data : message,
        ),
      }));
 
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((message) => message._id !== tempId),
      }));
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  deleteConversation: async (chatId) => {
    try {
      await axiosInstance.delete(`/messages/chats/${chatId}`);
      set((state) => ({
        chats: state.chats.filter(
          (chat) => String(chat._id) !== String(chatId),
        ),
        selectedUser: null,
        messages: [],
      }));
      await get().getMyChatPartners();
      toast.success("Chat Deleted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        String(newMessage.senderId) === String(selectedUser._id);
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (get().isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");

        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  subscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Avoid duplicate listeners when selecting users repeatedly.
    socket.off("typing:start");
    socket.off("typing:stop");

    socket.on("typing:start", ({ senderId }) => {
      const selectedUserId = get().selectedUser?._id;
      if (String(senderId) === String(selectedUserId)) {
        set({ isTyping: true });
      }
    });

    socket.on("typing:stop", ({ senderId }) => {
      const selectedUserId = get().selectedUser?._id;
      if (String(senderId) === String(selectedUserId)) {
        set({ isTyping: false });
      }
    });
  },

  unsubscribeFromTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("typing:start");
    socket.off("typing:stop");
    set({ isTyping: false });
  },

  emitTypingStart: () => {
    const socket = useAuthStore.getState().socket;
    const selectedUserId = get().selectedUser?._id;
    if (!socket || !selectedUserId) return;
    socket.emit("typing:start", { receiverId: selectedUserId });
  },

  emitTypingStop: () => {
    const socket = useAuthStore.getState().socket;
    const selectedUserId = get().selectedUser?._id;
    if (!socket || !selectedUserId) return;
    socket.emit("typing:stop", { receiverId: selectedUserId });
  },
}));
