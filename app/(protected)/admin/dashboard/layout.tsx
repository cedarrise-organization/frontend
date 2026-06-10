import { DashboardHeader } from "./-components/DashboardHeader";
import { DashboardSidebar } from "./-components/DashboardSidebar";

function DashboardLayout({ children }: LayoutProps<"/admin/dashboard">) {
	return (
		<div className="flex grow bg-[hsl(210,17%,98%)]">
			<DashboardSidebar />

			<div className="flex min-w-0 grow flex-col">
				<DashboardHeader />

				{children}
			</div>
		</div>
	);
}

export default DashboardLayout;
