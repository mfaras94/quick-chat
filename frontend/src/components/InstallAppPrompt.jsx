import { useEffect, useMemo, useState } from "react";
import { Download, Share2, X } from "lucide-react";

const InstallAppPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  });

  const isIos = useMemo(
    () => /iphone|ipad|ipod/i.test(window.navigator.userAgent),
    [],
  );

  useEffect(() => {
    if (isInstalled) return;

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [isInstalled]);

  if (isInstalled || isDismissed) return null;

  const shouldShowAndroidPrompt = !!deferredPrompt;
  const shouldShowIosHint = isIos && !shouldShowAndroidPrompt;
  if (!shouldShowAndroidPrompt && !shouldShowIosHint) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] w-[calc(100%-1.5rem)] max-w-md">
      <div className="alert bg-zinc-800/95 border border-zinc-700 text-zinc-100 shadow-xl backdrop-blur-sm">
        <div className="flex items-start gap-3 w-full">
          <div className="mt-0.5">
            {shouldShowAndroidPrompt ? (
              <Download className="size-5 text-emerald-400" />
            ) : (
              <Share2 className="size-5 text-emerald-400" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Install QuickChat</h4>
            {shouldShowAndroidPrompt ? (
              <p className="text-xs text-zinc-300 mt-1">
                Add QuickChat to your home screen for a faster app experience.
              </p>
            ) : (
              <p className="text-xs text-zinc-300 mt-1">
                Tap Share in Safari, then choose Add to Home Screen.
              </p>
            )}
            <div className="flex gap-2 mt-3">
              {shouldShowAndroidPrompt && (
                <button
                  className="btn btn-xs bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                  onClick={handleInstall}
                >
                  Install
                </button>
              )}
              <button
                className="btn btn-xs btn-ghost text-zinc-300 hover:text-white"
                onClick={() => setIsDismissed(true)}
              >
                {shouldShowAndroidPrompt ? "Not now" : "Got it"}
              </button>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-xs text-zinc-400 hover:text-zinc-200"
            onClick={() => setIsDismissed(true)}
            aria-label="Close install prompt"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallAppPrompt;
