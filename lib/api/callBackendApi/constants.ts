const BACKEND_HOST =
	process.env.NODE_ENV === "development" ?
		"http://localhost:3000"
	:	"https://api-cedarriseinitiative.up.railway.app";

export const BASE_API_URL = `${BACKEND_HOST}/api/v1`;
