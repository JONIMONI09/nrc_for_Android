import { invoke } from "./bridge-service";

export const MinecraftSkinService = {
  getActiveSkin: async () => invoke("get_active_skin"),
  getStarlightSkinRender: async (payload: any) => invoke("get_starlight_skin_render", payload),
  getUserSkinData: async () => invoke("get_user_skin_data"),
  getAllSkins: async () => invoke("get_all_skins"),
  updateSkinProperties: async (id: string, name: string, variant: string) => invoke("update_skin_properties", { id, name, variant }),
  addSkinLocally: async (skinInput: string, targetName: string, targetVariant: string, description?: string | null) => invoke("add_skin_locally", { skinInput, targetName, targetVariant, description }),
  removeSkin: async (id: string) => invoke("remove_skin", { id }),
  applySkinFromBase64: async (base64_data: string, variant: string, name: string) => invoke("apply_skin_from_base64", { base64_data, variant, name }),
  getBase64FromSkinSource: async (source: any) => invoke<string>("get_base64_from_skin_source", { source }),
  getFaceAvatar: async (uuid: string, size: number, overlay: boolean) => invoke<string>("get_face_avatar", { uuid, size, overlay }),
};
