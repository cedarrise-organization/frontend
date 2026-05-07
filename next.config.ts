import type { NextConfig } from "next";

const config: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},

	reactStrictMode: true,

	typedRoutes: true,

	typescript: {
		ignoreBuildErrors: true,
	},
};

export default config;
