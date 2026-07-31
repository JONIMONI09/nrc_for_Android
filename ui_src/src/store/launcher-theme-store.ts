import { create } from "zustand";

export const LAUNCHER_THEMES = {};
export const useLauncherThemeStore = create<any>((set) => ({
  themes: [],
}));
