import { create } from "zustand";

interface NoticeState {
  toastOpen: boolean;
  toastMessage: string;
  showToast: (message: string) => void;

  alertOpen: boolean;
  alertTitle: string;
  alertMessage: string;
  confirmLabel: string;
  onConfirm: (() => void) | null;
  showAlert: (
    title: string,
    message: string,
    confirmLabel?: string,
    onConfirm?: () => void
  ) => void;
  hideAlert: () => void;
}

export const useNoticeStore = create<NoticeState>(set => ({
  toastOpen: false,
  toastMessage: "",
  showToast: message => {
    set({ toastOpen: true, toastMessage: message });
    setTimeout(() => set({ toastOpen: false }), 2000);
  },

  alertOpen: false,
  alertTitle: "",
  alertMessage: "",
  confirmLabel: "CONFIRM",
  onConfirm: null,
  showAlert: (title, message, confirmLabel = "CONFIRM", onConfirm) => {
    set({
      alertOpen: true,
      alertTitle: title,
      alertMessage: message,
      confirmLabel,
      onConfirm: onConfirm || null,
    });
  },
  hideAlert: () => set({ alertOpen: false, onConfirm: null }),
}));
