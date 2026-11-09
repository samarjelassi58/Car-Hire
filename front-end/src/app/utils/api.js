const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const API_BASE_URL = `${API_ORIGIN}/api`;

export const AUTH_API = `${API_BASE_URL}/auth`;
export const USER_API = `${API_BASE_URL}/user`;
export const MESSAGE_API = `${API_BASE_URL}/message`;
export const CAR_API = `${API_BASE_URL}/car`;
export const RESERVATION_API = `${API_BASE_URL}/reservation`;

export const FALLBACK_CAR_IMAGE =
  "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80";

// Les images envoyées via l'API sont servies par le backend (/uploads/...).
export const imageUrl = (path) => {
  if (!path) return FALLBACK_CAR_IMAGE;
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/uploads/") ? `${API_ORIGIN}${path}` : path;
};

export const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getErrorMessage = (err, fallback = "Une erreur est survenue") => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ERR_NETWORK") return "Serveur injoignable. Vérifiez que l'API est démarrée.";
  return fallback;
};

export const formatDate = (value) => new Date(value).toLocaleDateString("fr-FR", { timeZone: "UTC" });
