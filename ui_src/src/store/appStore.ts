import { create } from "zustand";

export const useAppDragDropStore = create<any>((set) => ({
  isDragging: false,
}));
