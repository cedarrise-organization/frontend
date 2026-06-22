"use client";

import { useClickOutside } from "@zayne-labs/toolkit-react";
import { For, ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { useState } from "react";
import { CollapsibleAnimated } from "@/components/animated/ui";
import { IconBox } from "@/components/common/IconBox";
import { Logo } from "@/components/common/Logo";
import { NavLink } from "@/components/common/NavLink";
import { Sidebar } from "@/components/ui";
import { useIsMobile } from "@/components/ui/useMobile";
import { dashboardNavSections, type DashboardNavItem } from "./constants";

function DashboardSidebar() {
	const isMobile = useIsMobile({ mobileBreakpoint: 1000 });
	const [isOpen, setIsOpen] = useState(!isMobile);

	const { ref: rootRef } = useClickOutside<HTMLDivElement>({
		enabled: isMobile,
		onClick: () => setIsOpen(false),
	});

	return (
		<Sidebar.Provider
			open={isOpen}
			onOpenChange={setIsOpen}
			sidebarWidth="303px"
			sidebarWidthIcon="64px"
			sidebarWidthIconDesktop="90px"
			withMobileBreakpoint={false}
			className="max-lg:max-w-(--sidebar-width-icon)"
		>
			<Sidebar.Root
				ref={rootRef}
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
							<DashboardSidebarContentSection key={section.label} section={section} />
						)}
					/>

					{/* <DashboardSidebarFooterSection /> */}
				</Sidebar.Content>

				<Sidebar.Rail className="group-data-[state=collapsed]:-translate-x-1" />
			</Sidebar.Root>
		</Sidebar.Provider>
	);
}

function DashboardSidebarHeaderSection() {
	return (
		<Sidebar.Header className="border-b border-b-cedar-white/20 px-4 pt-5.5 pb-4 lg:pt-11 lg:pb-5">
			<Sidebar.Menu>
				<Sidebar.MenuItem className="flex items-center">
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
							base: "absolute -right-6.5 size-4 lg:-right-7.5 lg:size-6",
							icon: "size-full text-cedar-yellow hover:bg-[initial] hover:text-cedar-yellow/70",
						}}
					/>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
	);
}

function DashboardSidebarContentSection(props: { section: (typeof dashboardNavSections)[number] }) {
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
							className="h-9 gap-3 rounded-[8px] px-5 text-cedar-white/64 hover:bg-cedar-white/10"
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

// function DashboardSidebarFooterSection() {
// 	return (
//  <Sidebar.Footer
// 						className="mt-5 border-t border-t-cedar-white/20 px-4 pt-5
// 							group-data-[state=collapsed]:px-2 lg:mt-[80px] lg:px-8 lg:pt-8.5"
// 					>
// 		<article
// 			className="rounded-[20px] bg-[hsl(240,4%,5%)] px-3 pt-5 pb-3 group-data-[state=collapsed]:px-1.5"
// 		>
// 			<h3 className="text-[14px] text-cedar-white group-data-[state=collapsed]:hidden lg:text-base">
// 				Impact Report 2025
// 			</h3>

// 			<p
// 				className="mt-3 text-[10px]/[1.2] text-cedar-white/64 group-data-[state=collapsed]:hidden
// 					lg:text-[12px]"
// 			>
// 				Generate your annual outreach & donor summary
// 			</p>

// 			<NavLink
// 				href={placeholderHref}
// 				className="relative mt-5 flex min-h-[126px] items-center justify-center rounded-[12px]
// 					bg-cedar-yellow px-1 py-5 text-cedar-black transition-opacity hover:opacity-90"
// 			>
// 				<IconBox
// 					icon="radix-icons:download"
// 					className="size-[88px] shrink-0 group-data-[state=collapsed]:size-10"
// 				/>
// 				<p
// 					className="absolute top-3 right-3 max-w-[50px] text-[12px]/[1.2]
// 						group-data-[state=collapsed]:hidden lg:text-[14px]"
// 				>
// 					Export Report
// 				</p>
// 			</NavLink>
// 		</article>
// </Sidebar.Footer>
// 	);
// }

function DashboardSidebarLink(props: DashboardNavItem) {
	const { icon, label, link } = props;

	return (
		<Sidebar.MenuButton
			tooltip={label}
			className="h-9 gap-3 rounded-[12px] p-0 px-5 text-[12px] text-cedar-white hover:bg-cedar-white/8
				lg:h-12 lg:text-[14px] data-active:bg-cedar-red data-active:text-cedar-white"
			asChild={true}
		>
			<NavLink href={link}>
				<span className="size-3.5 shrink-0 group-data-[state=collapsed]:mx-auto lg:size-5">
					<IconBox icon={icon} className="size-full" />
				</span>
				<p
					className="w-fit shrink-0 overflow-hidden whitespace-nowrap opacity-100
						transition-[width,opacity] duration-200 ease-linear
						group-data-[state=collapsed]:absolute group-data-[state=collapsed]:w-0
						group-data-[state=collapsed]:opacity-0"
				>
					{label}
				</p>
			</NavLink>
		</Sidebar.MenuButton>
	);
}

export { DashboardSidebar };
