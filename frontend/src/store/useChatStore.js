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
  composerText: "",
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled") ?? "true"),
  isTyping: false,
  unreadCounts: {},

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setComposerText: (composerText) => set({ composerText }),
  setSelectedUser: (selectedUser) =>
    set((state) => {
      if (!selectedUser?._id) return { selectedUser };
      const selectedId = String(selectedUser._id);
      return {
        selectedUser,
        composerText: "",
        unreadCounts: { ...state.unreadCounts, [selectedId]: 0 },
      };
    }),

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
    set((state) => {
      const nextChats = [...state.chats];
      const currentId = String(selectedUser._id);
      const existingIndex = nextChats.findIndex(
        (chat) => String(chat._id) === currentId,
      );

      if (existingIndex > 0) {
        const [moved] = nextChats.splice(existingIndex, 1);
        nextChats.unshift(moved);
      } else if (existingIndex === -1 && selectedUser) {
        nextChats.unshift(selectedUser);
      }

      return { chats: nextChats };
    });

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
        unreadCounts: { ...state.unreadCounts, [String(chatId)]: 0 },
      }));
      await get().getMyChatPartners();
      toast.success("Chat Deleted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const authUserId = useAuthStore.getState().authUser?._id;
    if (!socket) return;
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const senderId = String(newMessage.senderId);
      const receiverId = String(newMessage.receiverId);
      const partnerId =
        String(authUserId) === senderId ? receiverId : senderId;
      const socketChatPartner = newMessage.chatPartner;

      set((state) => {
        const nextChats = [...state.chats];
        const existingIndex = nextChats.findIndex(
          (chat) => String(chat._id) === partnerId,
        );

        if (existingIndex > 0) {
          const [moved] = nextChats.splice(existingIndex, 1);
          nextChats.unshift(moved);
        } else if (existingIndex === -1) {
          const candidate = state.allContacts.find(
            (contact) => String(contact._id) === partnerId,
          );
          if (candidate) {
            nextChats.unshift(candidate);
          } else if (socketChatPartner?._id) {
            nextChats.unshift(socketChatPartner);
          }
        }

        const isFromOpenChat =
          String(state.selectedUser?._id) === senderId;

        return {
          chats: nextChats,
          unreadCounts: !isFromOpenChat
            ? {
                ...state.unreadCounts,
                [partnerId]: (state.unreadCounts[partnerId] || 0) + 1,
              }
            : state.unreadCounts,
          messages: isFromOpenChat
            ? [...state.messages, newMessage]
            : state.messages,
        };
      });

      const hasChatItem = get().chats.some(
        (chat) => String(chat._id) === partnerId,
      );
      if (!hasChatItem && !socketChatPartner?._id) get().getMyChatPartners();

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
