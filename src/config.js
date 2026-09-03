const configuredApiUrl = import.meta.env.VITE_API_URL || "https://techzone-backend.vercel.app";

export const API_URL = configuredApiUrl.replace(/\/+$/, "");