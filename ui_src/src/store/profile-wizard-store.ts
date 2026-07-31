import { create } from "zustand";

export const useProfileWizardStore = create<any>((set) => ({
  isOpen: false,
}));
