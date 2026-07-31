import { create } from "zustand";

export const useServerPingStore = create<any>((set) => ({
  pings: {},
  pingServer: async () => {},
}));
