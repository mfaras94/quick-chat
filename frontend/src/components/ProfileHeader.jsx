import { useRef , useState } from "react";
import {EllipsisVertical, LogOutIcon, Trash2, Volume2Icon,VolumeOffIcon,LoaderCircle} from "lucide-react"
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ConfirmModal from "./ConfirmModal";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3")

const ProfileHeader = () => {
    const { logout, authUser, updateProfile, isProfileLoading, deleteProfile, isDeletingAccount } = useAuthStore();
    const {isSoundEnabled,toggleSound} = useChatStore()
    const [selectedImg, setSelectedImg] = useState(null);


    const fileInputRef = useRef(null)
    const deleteModalRef = useRef(null)


    const handleImageUpload = (e) => {
      const file = e.target.files[0]
      if(!file) return

      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = async () => {
        const base64Image = reader.result
        
        setSelectedImg(base64Image)
        await updateProfile({profilePic:base64Image})
      }
    }

    const handleDeleteProfile = async () => {
      await deleteProfile();
    };

   return (
    <div className="p-6 border-b border-zinc-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
              {isProfileLoading && (
                <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
                  <LoaderCircle className="size-6 text-emerald-400 animate-spin" />
                </div>
              )}

              <input 
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              />
            </button>

          
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-zinc-200 font-medium text-base max-w-[190px] truncate">
              {authUser.fullName}
            </h3>

            <p className="text-zinc-400 text-xs">Online</p>
          </div>
        </div>

        {/* 3-DOT ACTION MENU */}
        <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-ghost btn-sm text-zinc-400 hover:text-zinc-200">
            <EllipsisVertical className="size-5" />
          </button>
          <ul tabIndex={0} className="dropdown-content z-[30] mt-2 menu p-2 shadow bg-zinc-800 rounded-box w-52 border border-zinc-700/60">
            <li>
              <button
                onClick={() => {
                  mouseClickSound.currentTime = 0;
                  mouseClickSound.play().catch((error) => console.error("Audio play faild", error));
                  toggleSound();
                }}
                className="text-zinc-200"
              >
                {isSoundEnabled ? <Volume2Icon className="size-4" /> : <VolumeOffIcon className="size-4" />}
                {isSoundEnabled ? "Sound: On" : "Sound: Off"}
              </button>
            </li>
            <li>
              <button onClick={logout} className="text-zinc-200">
                <LogOutIcon className="size-4" />
                Logout
              </button>
            </li>
            <li>
              <button
                onClick={() => deleteModalRef.current?.showModal()}
                className="text-red-400"
                disabled={isDeletingAccount}
              >
                <Trash2 className="size-4" />
                {isDeletingAccount ? "Deleting..." : "Delete profile"}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <ConfirmModal
        modalRef={deleteModalRef}
        title="Delete profile?"
        message="This will permanently delete your account and chats. This action cannot be undone."
        confirmText="Delete profile"
        confirmClassName="btn btn-error text-white"
        onConfirm={handleDeleteProfile}
        isLoading={isDeletingAccount}
        loadingText="Deleting..."
      />
    </div>
  );
}

export default ProfileHeader
