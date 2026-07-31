export enum ContentType {
  Mod = "Mod",
  ResourcePack = "ResourcePack",
  ShaderPack = "ShaderPack",
  DataPack = "DataPack",
  NoRiskMod = "NoRiskMod",
}

export type ModLoader = "vanilla" | "forge" | "fabric" | "quilt" | "neoforge";

export interface NoriskModIdentifier {
  pack_id: string;
  mod_id: string;
  game_version: string;
  loader: ModLoader;
}
