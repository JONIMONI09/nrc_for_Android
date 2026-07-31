import { create } from "zustand";

export const useSocialsModalStore = create<any>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
