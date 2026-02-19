import { ImageIcon, SendIcon, XIcon } from "lucide-react";

const MessageInput = () => {
  return (
    <div className="p-4 border-t border-zinc-700/50">
      <div className="max-w-3xl mx-auto mb-3 flex items-center">
        <div className="relative">
          <img
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
          />
          <button
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-200 hover:bg-zinc-700"
            type="button"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <form className="max-w-3xl mx-auto flex space-x-4">
        <input
          type="text"
          className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg py-2 px-4 text-zinc-200 placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          placeholder="Type your message..."
        />

        <button
          type="button"
          className={`bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 rounded-lg px-4 transition-colors`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg px-4 py-2 font-medium hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
