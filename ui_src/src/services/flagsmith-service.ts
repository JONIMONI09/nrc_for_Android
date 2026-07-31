import { invoke } from "./bridge-service";

export async function getPackRolloutConfig() {
  return invoke("get_pack_rollout_config");
}
