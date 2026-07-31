export function translateApiError(error: any, fallback?: string) {
  return fallback || "Unknown error";
}
