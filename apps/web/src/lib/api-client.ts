const raw = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:3001";
const baseUrl = raw.replace(/\/$/, "");

export function apiUrl(path: string): string {
  const prefix = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${prefix}`;
}
