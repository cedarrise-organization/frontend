import { DashboardHeader } from "./-components/DashboardHeader";
import { DashboardSidebar } from "./-components/DashboardSidebar";

function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
	return (
		<div className="flex grow bg-[hsl(210,17%,98%)]">
			<DashboardSidebar />

			<div className="flex grow flex-col">
				<DashboardHeader />

				{children}
			</div>
		</div>
	);
}

export default DashboardLayout;
