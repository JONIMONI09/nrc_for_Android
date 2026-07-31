import { invoke } from "./bridge-service";

export async function fetchTesterQueueCount() {
  return invoke<{ count: number }>("fetch_tester_queue_count");
}

export async function openTesterWindow() {
  return invoke("open_tester_window");
}
