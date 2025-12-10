// In development, use empty string to leverage Vite proxy (forwarding /api to backend)
// In production, use VITE_API_URL environment variable
export const API_URL = import.meta.env.VITE_API_URL || ''
