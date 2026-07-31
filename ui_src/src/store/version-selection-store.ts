import { create } from "zustand";

export const useVersionSelectionStore = create<any>((set) => ({
  selectedVersion: null,
  setSelectedVersion: (version: string) => set({ selectedVersion: version }),
}));
