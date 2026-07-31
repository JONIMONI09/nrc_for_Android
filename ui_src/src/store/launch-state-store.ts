import { create } from "zustand";

export enum LaunchState {
  IDLE = "IDLE",
  LAUNCHING = "LAUNCHING",
  RUNNING = "RUNNING",
  ERROR = "ERROR",
}

export const useLaunchStateStore = create<any>((set, get) => ({
  profiles: {},
  getProfileState: (id: string) => get().profiles[id] || { isButtonLaunching: false, launchState: LaunchState.IDLE },
  initializeProfile: (id: string) => {},
  initiateButtonLaunch: (id: string) => {},
  finalizeButtonLaunch: (id: string) => {},
  setButtonStatusMessage: (id: string, msg: string | null) => {},
  setLaunchError: (id: string, err: string | null) => {},
}));
