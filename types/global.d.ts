// Global type declarations

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Dat,e,
      config?: Record<string>
    ) => void;
  }
}

export {};</string>