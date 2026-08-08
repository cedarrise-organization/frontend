const BACKEND_HOST =
	process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://backend-69mv.onrender.com";

export const BASE_API_URL = `${BACKEND_HOST}/api/v1`;
