"use client";
import { useState, useEffect } from "react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check if we"re in the browser
    if (typeof window === "undefined") return;
    
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // État initial
    setIsOnline(navigator.onLine);

    // Écouter les changements
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Cleanup
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return isOnline;
} 