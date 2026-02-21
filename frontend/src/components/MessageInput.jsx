import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import useKeyboardSounds from "../hooks/useKeyboardSounds";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const MessageInput = () => {
  const playRandomKeyStrokeSound = useKeyboardSounds();
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const {
    sendMessage,
    isSoundEnabled,
    emitTypingStart,
    emitTypingStop,
    composerText,
    setComposerText,
  } = useChatStore();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      emitTypingStop();
    };
  }, [emitTypingStop]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!composerText.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();
    // Stop typing indicator once the message is sent.
    emitTypingStop();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    sendMessage({
      text: composerText.trim(),
      image: imagePreview,
    });

    setComposerText("");
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
    <div className="w-full p-3 sm:p-4 border-t border-zinc-700/50">
    {imagePreview && (
        <div className="w-full max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-200 hover:bg-zinc-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}


      <form
        onSubmit={handleSendMessage}
        className="w-full max-w-3xl mx-auto flex items-center gap-2 sm:gap-3 min-w-0"
      >
        <input
          type="text"
          className="flex-1 min-w-0 bg-zinc-800/50 border border-zinc-700/50 rounded-lg py-2 px-3 sm:px-4 text-sm sm:text-base text-zinc-200 placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          placeholder="Type your message..."
          value={composerText}
          onChange={(e) => {
            const nextText = e.target.value;
            setComposerText(nextText);
            isSoundEnabled && playRandomKeyStrokeSound();

            // Emit "typing:start" while user types, then debounce "typing:stop".
            if (nextText.trim()) {
              emitTypingStart();
              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = setTimeout(() => {
                emitTypingStop();
              }, 1200);
            } else {
              emitTypingStop();
              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            }
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
            className={`shrink-0 bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 rounded-lg px-3 sm:px-4 py-2 transition-colors ${
  imagePreview ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" : ""
}`}>
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
            disabled={!composerText.trim() && !imagePreview}
          className="shrink-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg px-3 sm:px-4 py-2 font-medium hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
