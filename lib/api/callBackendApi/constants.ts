const BACKEND_HOST = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export const BASE_API_URL = `${BACKEND_HOST}/api/v1`;
