import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import useKeyboardSounds from "../hooks/useKeyboardSounds";
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const MessageInput = () => {
  const playRandomKeyStrokeSound = useKeyboardSounds();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();
    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);

      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 border-t border-zinc-700/50">
    {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}


      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex space-x-4"
      >
        <input
          type="text"
          className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg py-2 px-4 text-zinc-200 placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <button
         type="button"
          onClick={() => fileInputRef.current?.click()}
            className={`bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 rounded-lg px-4 transition-colors ${
  imagePreview ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" : ""
}`}>
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
            disabled={!text.trim() && !imagePreview}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg px-4 py-2 font-medium hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
