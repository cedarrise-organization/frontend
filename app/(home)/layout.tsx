import { Footer } from "./-components/Footer";
import { NavBar } from "./-components/Navbar";

function HomeLayout({ children }: LayoutProps<"/">) {
	return (
		<div className="flex min-h-svh w-full flex-col items-center bg-cedar-white">
			<NavBar />
			{children}
			<Footer />
		</div>
	);
}

export default HomeLayout;
