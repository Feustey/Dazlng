"use client";

import { useEffect } from "react"';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady(): void {
  useEffect(() => {
    window.frameworkReady?.();
  }, []);
}
