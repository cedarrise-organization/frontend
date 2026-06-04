"use client";

// import { For } from "@/components/common/for";
// import { IconBox } from "@/components/common/IconBox";
// import { NavLink, type MainAppRoutes } from "@/components/common/NavLink";
import { Sidebar } from "@/components/ui";

// const navItems = [
// 	{
// 		href: "/dashboard",
// 		icon: "material-symbols:dashboard-outline-rounded",
// 		title: "Dashboard",
// 	},
// ] satisfies Array<{ href: MainAppRoutes; icon: string; title: "Dashboard" }>;

function DashboardSidebar() {
	return (
		<Sidebar.Provider
			sidebarWidth="256px"
			sidebarWidthIcon="68px"
			className="shrink-0 animate-slide-from-left transition-[width] duration-300 ease-in-out
				data-[state=collapsed]:w-(--sidebar-width-icon) data-[state=expanded]:w-(--sidebar-width)"
		>
			<Sidebar.Root
				collapsible="icon"
				classNames={{
					base: "bg-[hsl(210,9%,96%)]",
					container: "border-r-[hsl(231,20%,80%,0.2)]",
					inner: "gap-7 bg-[hsl(210,9%,96%)]",
				}}
			>
				{/* <Sidebar.Header className="relative px-3 pt-5"></Sidebar.Header> */}

				<Sidebar.Content className="px-3">
					{/* <Sidebar.Group>
						<Sidebar.Menu className="gap-2"></Sidebar.Menu>
					</Sidebar.Group> */}
				</Sidebar.Content>

				<Sidebar.Rail />
			</Sidebar.Root>
		</Sidebar.Provider>
	);
}

export { DashboardSidebar };
