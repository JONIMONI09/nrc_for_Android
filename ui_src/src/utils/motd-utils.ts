export function parseMotdToHtml(motd: string | object) {
  if (typeof motd === "object") {
    return JSON.stringify(motd);
  }
  return motd;
}
