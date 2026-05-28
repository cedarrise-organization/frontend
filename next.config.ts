import type { NextConfig } from "next";

const config: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},

	images: {
		remotePatterns: [
			{
				hostname: "res.cloudinary.com",
				pathname: "/**",
				port: "",
				protocol: "https",
			},
		],
	},

	reactStrictMode: true,

	typedRoutes: true,

	typescript: {
		ignoreBuildErrors: true,
	},
};

export default config;
