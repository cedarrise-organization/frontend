"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { CollapsibleAnimated } from "@/components/animated/ui";
import { For, ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Logo } from "@/components/common/Logo";
import { NavLink } from "@/components/common/NavLink";
import { Sidebar } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/components/ui/useMobile";
import { signoutMutation } from "@/lib/react-query/mutationOptions";
import { dashboardNavSections, type DashboardNavItem } from "./constants";

function DashboardSidebar() {
	const isMobile = useIsMobile({ mobileBreakpoint: 1000 });

	return (
		<Sidebar.Provider
			sidebarWidth="303px"
			sidebarWidthIcon="64px"
			sidebarWidthIconDesktop="90px"
			withMobileBreakpoint={false}
			className="max-lg:max-w-(--sidebar-width-icon)"
		>
			<Sidebar.Overlay enabled={isMobile} />

			<Sidebar.Root
				collapsible="icon"
				variant="sidebar-sticky"
				classNames={{
					container: "animate-slide-from-left border-0 bg-cedar-black",
					inner: "gap-0 bg-cedar-black text-cedar-white",
				}}
			>
				<DashboardSidebarHeaderSection />

				<Sidebar.Content className="scrollbar-none pt-6 pb-12">
					<ForWithWrapper
						as="article"
						className="flex grow flex-col gap-5 px-4 transition-[padding] duration-300 ease-in-out
							group-data-[state=collapsed]:px-2 lg:px-8"
						each={dashboardNavSections}
						renderItem={(section) => (
							<DashboardSidebarGroupSection key={section.label} section={section} />
						)}
					/>

					{/* <DashboardSidebarFooterSection /> */}
				</Sidebar.Content>

				<Sidebar.Rail
					className="group-data-[state=collapsed]:-translate-x-2
						lg:group-data-[state=collapsed]:-translate-x-1"
				/>
			</Sidebar.Root>
		</Sidebar.Provider>
	);
}

function DashboardSidebarHeaderSection() {
	return (
		<Sidebar.Header
			className="relative border-b border-b-cedar-white/20 px-4 pt-5.5 pb-4 lg:pt-11 lg:pb-5"
		>
			<Sidebar.MenuButton className="h-auto p-0 text-cedar-white">
				<Logo
					variant="white"
					width={32}
					classNames={{
						image: "w-8 lg:w-[54px]",
					}}
				>
					<div className="flex shrink-0 flex-col gap-1 leading-none">
						<h3 className="text-[18px] text-cedar-white lg:text-[24px]">CedarRise</h3>
						<p className="text-[12px] text-cedar-yellow lg:text-[14px]">Admin Dashboard</p>
					</div>
				</Logo>
			</Sidebar.MenuButton>

			<Sidebar.Trigger
				unstyled={true}
				classNames={{
					base: "absolute -right-2.75 size-4 lg:-right-3.75 lg:size-6",
					icon: "size-full text-cedar-yellow hover:bg-[initial] hover:text-cedar-yellow/70",
				}}
			/>
		</Sidebar.Header>
	);
}

function DashboardSidebarGroupSection(props: { section: (typeof dashboardNavSections)[number] }) {
	const { section } = props;

	return (
		<Sidebar.Group>
			{section.link && (
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<DashboardSidebarLink {...section} />
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			)}

			{section.children && (
				<CollapsibleAnimated.Root defaultOpen={true}>
					<CollapsibleAnimated.Trigger asChild={true}>
						<Sidebar.MenuButton
							tooltip={section.label}
							className="h-9 gap-3 rounded-[8px] px-5 text-cedar-white/64
								group-data-[state=collapsed]:px-0 hover:bg-cedar-white/10"
						>
							<p
								className="w-fit shrink-0 overflow-hidden whitespace-nowrap opacity-100
									transition-[width,opacity] duration-200 ease-linear
									group-data-[state=collapsed]:absolute group-data-[state=collapsed]:w-0
									group-data-[state=collapsed]:opacity-0"
							>
								{section.label}
							</p>

							<span className="size-4 shrink-0 group-data-[state=collapsed]:mx-auto lg:size-5">
								<IconBox
									icon="lucide:chevron-right"
									className="size-full transition-transform in-data-open:rotate-90"
								/>
							</span>
						</Sidebar.MenuButton>
					</CollapsibleAnimated.Trigger>

					<CollapsibleAnimated.Content className="pt-2">
						<Sidebar.Menu className="gap-2">
							<For
								key={section.label}
								each={section.children}
								renderItem={(childSection) => (
									<Sidebar.MenuItem key={childSection.label}>
										<DashboardSidebarLink {...childSection} />
									</Sidebar.MenuItem>
								)}
							/>
						</Sidebar.Menu>
					</CollapsibleAnimated.Content>
				</CollapsibleAnimated.Root>
			)}
		</Sidebar.Group>
	);
}

function DashboardSidebarLink(props: DashboardNavItem) {
	const { icon, label, link } = props;

	const content = (
		<>
			<span className="size-3.5 shrink-0 group-data-[state=collapsed]:mx-auto lg:size-5">
				<IconBox icon={icon} className="size-full" />
			</span>
			<p
				className="w-fit shrink-0 overflow-hidden whitespace-nowrap opacity-100
					transition-[width,opacity] duration-200 ease-linear group-data-[state=collapsed]:absolute
					group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:opacity-0"
			>
				{label}
			</p>
		</>
	);

	const signoutMutationResult = useMutation(signoutMutation());
	const router = useRouter();
	const queryClient = useQueryClient();

	const onSignout = () => {
		signoutMutationResult.mutate(undefined, {
			onSuccess: () => {
				queryClient.clear();
				router.replace("/");
			},
		});
	};

	const pathname = usePathname();

	return (
		<Sidebar.MenuButton
			tooltip={label}

			classNames={{
				base: `h-9 gap-3 rounded-[12px] p-0 px-5 text-[12px] text-cedar-white
				group-data-[state=collapsed]:px-0 hover:bg-cedar-white/8 lg:h-12 lg:text-[14px]
				data-active:bg-cedar-red data-active:text-cedar-white hover:data-active:bg-cedar-red/80`,
				tooltipArrow: "fill-cedar-black",
				tooltipContent: "bg-cedar-black",
			}}
			asChild={true}
		>
			{link === null ?
				<Button unstyled="none" onClick={onSignout}>
					{content}
				</Button>
			:	<NavLink
					href={link}
					data-active={
						pathname === link || (link !== "/admin/dashboard" && pathname.startsWith(link))
					}
				>
					{content}
				</NavLink>
			}
		</Sidebar.MenuButton>
	);
}

export { DashboardSidebar };
