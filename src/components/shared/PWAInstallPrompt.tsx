"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { toast } from "sonner";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes("android-app://");
    
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      toast.success("Thank you for installing Berlin Food!");
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (isStandalone) return null;

  // For iOS, we can't trigger the prompt programmatically, 
  // so we show a custom message if they haven't installed it yet.
  if (isIOS && !isStandalone) {
    return (
      <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-bottom-5 duration-500">

        <div className="bg-surface-container-high border border-outline-variant/20 rounded-3xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden group">

          <div className="flex gap-4 items-start relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
              <Smartphone size={24} strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-on-surface">Install the App</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Tap the share button <span className="inline-block p-1 bg-surface-container-low rounded">⎋</span> and then <span className="font-bold text-primary">"Add to Home Screen"</span>
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-surface-container-highest rounded-full transition-colors ms-auto"
            >
              <X size={16} />
            </button>
          </div>
          {/* Decorative background glow */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-bottom-5 duration-500">

      <div className="bg-surface-container-high border border-outline-variant/20 rounded-3xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden group">

        <div className="flex gap-4 items-start relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
            <Download size={24} strokeWidth={2.5} />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-bold text-on-surface">Experience Berlin Food</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Install our app for a faster and smoother culinary adventure in the city.
            </p>
            <button
              onClick={handleInstallClick}
              className="mt-3 w-full py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary text-xs font-bold rounded-full shadow-lg transition-all active:scale-95 hover:shadow-primary-glow"
            >
              Install the App
            </button>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-surface-container-highest rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Decorative background glow */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
      </div>
    </div>
  );
}
