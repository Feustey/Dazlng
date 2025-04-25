"use client";

import { create } from "zustand";

export type AlertType = "success" | "error" | "warning";

interface Alert {
  type: AlertType;
  message: string;
}

interface AlertStore {
  alert: Alert | null;
  showAlert: (type: AlertType, message: string) => void;
  hideAlert: () => void;
}

export const useAlert = create<AlertStore>((set) => ({
  alert: null,
  showAlert: (type, message) => set({ alert: { type, message } }),
  hideAlert: () => set({ alert: null }),
}));
