"use client";

import { useScrollObserver, useToggle } from "@zayne-labs/toolkit-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { CollapsibleAnimated } from "@/components/animated/ui";
import { For, ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Logo } from "@/components/common/Logo";
import { NavLink, type MainAppRoutes } from "@/components/common/NavLink";
import { HamburgerCloseIcon, HamburgerOpenIcon } from "@/components/icons/Hamburger";
import { Popover } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { cnJoin, cnMerge } from "@/lib/utils/cn";

function NavBar() {
	const { isScrolled, observedElementRef } = useScrollObserver({
		rootMargin: "0px",
	});

	return (
		<header
			ref={observedElementRef}
			className={cnJoin(
				`fixed top-0 isolate z-10 flex w-full scrollbar-thin items-center justify-between gap-10 px-4
				py-3 transition-[color,box-shadow] duration-300 ease-[ease] lg:overflow-x-auto lg:px-[50px]
				lg:py-5`,
				isScrolled ? "shadow-[0_2px_4px_hsl(0,0%,0%,0.05)]" : "text-cedar-white"
			)}
		>
			<span
				className={cnJoin(
					`absolute inset-0 -z-1 bg-cedar-white/90 backdrop-blur-2xl transition-opacity duration-300
					ease-[ease]`,
					isScrolled ? "opacity-100" : "opacity-0"
				)}
			/>

			<Logo
				variant={isScrolled ? "regular" : "yellow"}
				classNames={{
					text: "transition-colors duration-300 ease-[ease]",
				}}
			/>

			<DesktopNavigation className="max-lg:hidden" />

			<MobileNavigation className="lg:hidden">
				{(ctx) => (
					<Button
						unstyled={true}
						className={cnJoin(
							"z-10 size-5 transition-colors duration-300 ease-[ease]",
							!isScrolled && !ctx.isNavShow ? "text-cedar-white" : "text-cedar-black",
							ctx.className
						)}
						onClick={ctx.toggleNavShow}
					>
						{ctx.isNavShow ?
							<HamburgerCloseIcon className="size-full" />
						:	<HamburgerOpenIcon className="size-full" />}
					</Button>
				)}
			</MobileNavigation>
		</header>
	);
}

export { NavBar };

type RouteRecord = { label: string; link: MainAppRoutes };

const navLinkItems = [
	{ label: "Home", link: "/" },
	{ label: "About", link: "/about" },
	{ label: "Capacity Building", link: "/capacity-building" },
	{
		children: [
			{ label: "After School Hours (ASH)", link: "/social-initiatives/ash" },
			{ label: "TACOTS", link: "/social-initiatives/tacots" },
			{ label: "Community Outreaches", link: "/social-initiatives/outreaches" },
		],
		label: "Social Initiatives",
	},
	{
		children: [
			{ label: "Partner with us", link: "/get-involved/partner" },
			{ label: "Volunteer Opportunities", link: "/get-involved/volunteer" },
		],
		label: "Get Involved",
	},
	{ label: "Blog", link: "/blog" },
	{ label: "Donate", link: "/donate" },
] satisfies Array<RouteRecord | { children: RouteRecord[]; label: string }>;

function DesktopNavigation(props: { className?: string }) {
	const { className } = props;

	const pathname = usePathname();

	return (
		<section className={className}>
			<ForWithWrapper
				as="nav"
				className="flex min-w-fit gap-2"
				each={navLinkItems}
				renderItem={(item) => (
					<Fragment key={item.label}>
						{item.link && (
							<NavLink
								href={item.link}
								className="inline-flex h-[56px] shrink-0 items-center justify-center rounded-[20px]
									px-5 transition-colors hover:not-data-active:bg-cedar-grey
									hover:not-data-active:text-cedar-red data-active:bg-cedar-yellow
									data-active:text-cedar-white"
							>
								{item.label}
							</NavLink>
						)}

						{item.children && (
							<Popover.Root modal={false}>
								<Popover.Trigger
									data-active={item.children.some((childItem) => childItem.link === pathname)}
									className="group inline-flex h-[56px] shrink-0 items-center justify-center
										gap-1.5 rounded-[20px] px-5 transition-colors
										hover:not-data-active:bg-cedar-grey hover:not-data-active:text-cedar-red
										data-active:bg-cedar-yellow data-active:text-cedar-white"
								>
									{item.label}
									<span
										className="size-3.5 transition-transform duration-200
											group-data-open:rotate-180"
									>
										<IconBox icon="lucide:chevron-down" className="size-full" />
									</span>
								</Popover.Trigger>

								<Popover.Content
									align="start"
									sideOffset={6}
									className="flex min-w-[288px] flex-col gap-1.5 rounded-[24px]
										border-cedar-black/5 bg-cedar-white/90 p-3
										shadow-[0_8px_24px_theme(--color-cedar-black/0.06)] backdrop-blur-xl"
								>
									<For
										each={item.children}
										renderItem={(childItem) => (
											<NavLink
												href={childItem.link}
												key={childItem.label}
												className="group flex h-[56px] items-center justify-between gap-4
													rounded-[18px] px-4 text-[14px] transition-colors
													hover:not-data-active:bg-[hsl(0,0%,84%)]
													hover:not-data-active:text-cedar-red data-active:bg-cedar-black
													data-active:text-cedar-white"
											>
												<p>{childItem.label}</p>
												<LinkIndicator />
											</NavLink>
										)}
									/>
								</Popover.Content>
							</Popover.Root>
						)}
					</Fragment>
				)}
			/>
		</section>
	);
}

function MobileNavigation(props: {
	children: (state: {
		className: string | undefined;
		isNavShow: boolean;
		toggleNavShow: () => void;
	}) => React.ReactNode;
	className?: string;
}) {
	const { children, className } = props;

	const [isNavShow, toggleNavShow] = useToggle(false);

	const pathname = usePathname();

	const resolvedChildren = children({ className, isNavShow, toggleNavShow });

	return (
		<>
			<section
				className={cnMerge(
					`fixed inset-[0_0_0_auto] flex flex-col items-center gap-7 overflow-x-hidden
					bg-cedar-white/80 pt-8 text-cedar-black backdrop-blur-3xl transition-[width]
					ease-[cubic-bezier(0.32,0.72,0,1)]`,
					isNavShow ? "w-full duration-500" : "w-0 duration-750",
					className
				)}
			>
				<Logo />

				<ForWithWrapper
					as="nav"
					className="flex w-full max-w-[340px] flex-col gap-1 px-4 text-[12px] text-nowrap"
					each={navLinkItems}
					renderItem={(linkItem) => (
						<Fragment key={linkItem.label}>
							{linkItem.link && (
								<NavLink
									onClick={toggleNavShow}
									key={linkItem.label}
									href={linkItem.link}
									className="group flex h-12 items-center justify-between gap-4 rounded-[14px]
										px-4 transition-colors hover:not-data-active:bg-cedar-grey
										hover:not-data-active:text-cedar-red data-active:bg-cedar-black
										data-active:text-cedar-white"
								>
									{linkItem.label}
								</NavLink>
							)}

							{linkItem.children && (
								<CollapsibleAnimated.Root
									className="group/collapsible"
									defaultOpen={linkItem.children.some(
										(childLinkItem) => childLinkItem.link === pathname
									)}
								>
									<CollapsibleAnimated.Trigger
										data-active={linkItem.children.some(
											(childLinkItem) => childLinkItem.link === pathname
										)}
										className="flex h-12 w-full items-center justify-between rounded-[14px] px-4
											hover:not-data-active:bg-cedar-grey hover:not-data-active:text-cedar-red
											data-active:bg-cedar-yellow data-active:text-cedar-white"
									>
										<span>{linkItem.label}</span>
										<IconBox
											icon="lucide:chevron-right"
											className="size-5 transition-transform duration-200
												group-data-[state=open]/collapsible:rotate-90"
										/>
									</CollapsibleAnimated.Trigger>

									<CollapsibleAnimated.Content className="flex flex-col gap-1 pt-2 pl-5">
										<For
											each={linkItem.children}
											renderItem={(childItem) => (
												<NavLink
													onClick={toggleNavShow}
													key={childItem.label}
													href={childItem.link}
													className="group flex h-12 items-center justify-between gap-3
														rounded-[12px] px-4 transition-colors
														hover:not-data-active:bg-cedar-grey
														hover:not-data-active:text-cedar-red data-active:bg-cedar-black
														data-active:text-cedar-white"
												>
													<p>{childItem.label}</p>
													<LinkIndicator />
												</NavLink>
											)}
										/>
									</CollapsibleAnimated.Content>
								</CollapsibleAnimated.Root>
							)}
						</Fragment>
					)}
				/>
			</section>

			{resolvedChildren}
		</>
	);
}

function LinkIndicator() {
	return (
		<span
			className="grid size-7 place-content-center rounded-full bg-cedar-yellow text-cedar-black/64
				opacity-0 transition-opacity duration-200 ease-[ease] group-hover:opacity-100
				group-data-active:opacity-100"
		>
			<IconBox icon="solar:arrow-right-up-outline" className="size-3.5" />
		</span>
	);
}
