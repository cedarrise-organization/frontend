import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	ignores: [".next/**", "eslint.config.js", "next-env.d.ts"],
	react: true,
	tailwindcssBetter: true,
	tanstack: true,
	typescript: true,
});
