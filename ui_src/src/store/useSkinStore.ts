import { create } from "zustand";

export const useSkinStore = create<any>((set) => ({
  selectedSkinId: null,
  skinRevision: 0,
  setSelectedSkinId: (id: string | null) => set({ selectedSkinId: id }),
}));
