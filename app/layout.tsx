import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { SonnerToaster } from "@/components/common/Toaster";
import { cnJoin } from "@/lib/utils/cn";
import { Providers } from "./Providers";
import "../tailwind.css";

const coolvetica = localFont({
	src: "../assets/fonts/coolvetica-regular.woff2",
	variable: "--font-coolvetica",
	weight: "400",
});

const poppins = Poppins({
	subsets: ["latin"],
	variable: "--font-poppins",
	weight: ["400", "500"],
});

export const metadata: Metadata = {
	description: "Nurturing Minds, Transforming Communities",
	title: "CedarRise",
};

function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en">
			<body className={cnJoin(coolvetica.variable, poppins.variable)}>
				<Providers>{children}</Providers>

				<SonnerToaster />
			</body>
		</html>
	);
}

export default RootLayout;
