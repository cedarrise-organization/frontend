import type { MainAppRoutes } from "@/components/common/NavLink";

export const EMPTY_VALUE_PLACEHOLDER = "---";

export type DashboardNavItem = {
	icon: string;
	label: string;
	link: MainAppRoutes;
};

export const placeholderHref = "#";

export const dashboardNavSections = [
	{
		icon: "lucide:layout-grid",
		label: "Dashboard",
		link: "/admin/dashboard",
	},
	{
		children: [
			{
				icon: "streamline-ultimate:layers-stacked",
				label: "Form Data",
				link: "/admin/dashboard/form-data",
			},
			{
				icon: "material-symbols:subtitles-outline-rounded",
				label: "Tracker Forms",
				link: "/admin/dashboard/tracker-forms",
			},
			{
				icon: "hugeicons:wallet-05",
				label: "Tracker Data",
				link: "/admin/dashboard/tracker-data",
			},
		],
		label: "Forms & Tracking",
	},
	{
		children: [
			{
				icon: "lucide:square-pen",
				label: "Blog Uploads",
				link: placeholderHref,
			},
			{
				icon: "hugeicons:share-03",
				label: "General Uploads",
				link: "/admin/dashboard/general-uploads",
			},
		],
		label: "Content Management",
	},
	{
		children: [
			{
				icon: "lucide:receipt-text",
				label: "Receipts",
				link: placeholderHref,
			},
			{
				icon: "mynaui:layers-two",
				label: "General Information",
				link: placeholderHref,
			},
		],
		label: "Interim Miscellaneous",
	},
	{
		children: [
			{
				icon: "solar:user-linear",
				label: "Users",
				link: placeholderHref,
			},
			{
				icon: "solar:login-2-linear",
				label: "Logout",
				link: placeholderHref,
			},
		],
		label: "System",
	},
] satisfies Array<DashboardNavItem | { children: DashboardNavItem[]; label: string }>;
