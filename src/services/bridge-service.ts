export const invokeNative = async <T>(command: string, args: Record<string, any> = {}): Promise<T> => {
  // 1. Android Check (Pojav Glow-Worm Bridge)
  const androidBridge = (window as any).AndroidBridge;
  
  if (androidBridge && androidBridge[command]) {
     const argsString = JSON.stringify(args);
     
     // Java Methode synchron aufrufen
     const result = androidBridge[command](argsString);
     
     if (result) {
         return JSON.parse(result) as T;
     }
     
     return {} as T;
  }
  
  // 2. Desktop Check (Tauri)
  if ((window as any).__TAURI__) {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke<T>(command, args);
  }
  
  throw new Error(`[Vibecore-Architektur] Fehler: Befehl ${command} konnte nicht geroutet werden.`);
};
