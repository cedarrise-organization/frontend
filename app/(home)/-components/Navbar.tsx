"use client";

import { useScrollObserver, useToggle } from "@zayne-labs/toolkit-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { CollapsibleAnimated } from "@/components/animated/ui";
import { For, ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Logo } from "@/components/common/Logo";
import { NavLink, type MainAppRoutes } from "@/components/common/NavLink";
import { hamburgerIcon, xIcon } from "@/components/icons";
import { DropdownMenu } from "@/components/ui";
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
				`sticky top-0 isolate z-10 flex w-full scrollbar-thin items-center justify-between gap-10
				overflow-x-auto bg-cedar-white px-4 py-3 transition-shadow duration-300 ease-[ease]
				lg:bg-cedar-white/90 lg:px-[100px] lg:py-5 lg:backdrop-blur-2xl`,
				isScrolled && "shadow-[0_2px_4px_hsl(0,0%,0%,0.05)]"
			)}
		>
			<Logo />

			<DesktopNavigation className="max-lg:hidden" />

			<MobileNavigation className="lg:hidden" />
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
				renderItem={(linkItem) => (
					<Fragment key={linkItem.label}>
						{linkItem.link && (
							<NavLink
								href={linkItem.link}
								className="inline-flex h-[56px] shrink-0 items-center justify-center rounded-[20px]
									p-5 transition-colors hover:bg-[hsl(0,0%,94%)] hover:text-cedar-red
									data-[active=true]:bg-cedar-yellow data-[active=true]:text-cedar-white"
							>
								{linkItem.label}
							</NavLink>
						)}

						{linkItem.children && (
							<DropdownMenu.Root modal={false}>
								<DropdownMenu.Trigger
									data-active={linkItem.children.some(
										(childLinkItem) => childLinkItem.link === pathname
									)}
									className="inline-flex h-[56px] shrink-0 items-center justify-center
										rounded-[20px] p-5 transition-colors hover:bg-[hsl(0,0%,94%)]
										hover:text-cedar-red data-[active=true]:bg-cedar-yellow
										data-[active=true]:text-cedar-white"
								>
									{linkItem.label}
								</DropdownMenu.Trigger>

								<DropdownMenu.Content
									align="start"
									sideOffset={6}
									className="min-w-[288px] rounded-[24px] border-cedar-black/5 bg-cedar-white/90
										p-3 shadow-[0_8px_24px_theme(--color-cedar-black/0.06)] backdrop-blur-xl"
								>
									<DropdownMenu.Group className="flex flex-col gap-1.5">
										<For
											each={linkItem.children}
											renderItem={(childLinkItem) => (
												<DropdownMenu.Item
													asChild={true}
													key={childLinkItem.label}
													className="group flex min-h-[54px] items-center justify-between
														gap-4 rounded-[18px] p-0 px-4 text-[14px] transition-colors
														focus:bg-[hsl(0,0%,84%)] focus:text-cedar-red
														data-[active=true]:bg-cedar-black
														data-[active=true]:text-cedar-white"
												>
													<NavLink href={childLinkItem.link}>
														<div className="flex items-center gap-3">
															<span
																className="size-2 rounded-full bg-cedar-yellow opacity-0
																	transition-opacity group-hover:opacity-100
																	group-data-[active=true]:opacity-100"
															/>
															<p>{childLinkItem.label}</p>
														</div>

														<span
															className="grid size-7 place-content-center rounded-full
																bg-cedar-yellow text-cedar-white opacity-0
																transition-opacity group-hover:opacity-100
																group-data-[active=true]:opacity-100"
														>
															<IconBox
																icon="solar:arrow-right-up-outline"
																className="size-3.5"
															/>
														</span>
													</NavLink>
												</DropdownMenu.Item>
											)}
										/>
									</DropdownMenu.Group>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						)}
					</Fragment>
				)}
			/>
		</section>
	);
}

function MobileNavigation(props: { className?: string }) {
	const { className } = props;

	const [isNavShow, toggleNavShow] = useToggle(false);

	const pathname = usePathname();

	return (
		<>
			<section
				className={cnMerge(
					`fixed inset-[0_0_0_auto] flex flex-col items-center gap-7 overflow-x-hidden pt-3
					transition-[width] ease-[cubic-bezier(0.32,0.72,0,1)]`,
					isNavShow ?
						"w-full bg-cedar-white/80 backdrop-blur-3xl duration-500"
					:	"w-0 bg-cedar-white duration-750",
					className
				)}
				onClick={(event) => {
					const element = event.target as HTMLElement;

					element.tagName === "A" && toggleNavShow();
				}}
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
									key={linkItem.label}
									href={linkItem.link}
									className="group flex h-10 items-center justify-between gap-4 rounded-[14px]
										px-4 transition-colors hover:bg-[hsl(0,0%,94%)] hover:text-cedar-red
										data-[active=true]:bg-cedar-black data-[active=true]:text-cedar-white"
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
										className="flex h-10 w-full items-center justify-between rounded-[14px] px-4
											hover:bg-[hsl(0,0%,94%)] hover:text-cedar-red
											data-[active=true]:bg-cedar-yellow data-[active=true]:text-cedar-white"
									>
										<span>{linkItem.label}</span>
										<IconBox
											icon="lucide:chevron-right"
											className="size-5 transition-transform duration-200
												group-data-[state=open]/collapsible:rotate-90"
										/>
									</CollapsibleAnimated.Trigger>

									<CollapsibleAnimated.Content className="mt-2 flex flex-col gap-1 pl-5">
										<For
											each={linkItem.children}
											renderItem={(childItem) => (
												<NavLink
													key={childItem.label}
													href={childItem.link}
													className="group flex h-9 items-center gap-3 rounded-[12px] px-4
														transition-colors hover:bg-[hsl(0,0%,94%)] hover:text-cedar-red
														data-[active=true]:bg-cedar-black
														data-[active=true]:text-cedar-white"
												>
													<span
														className="size-2 rounded-full bg-cedar-yellow opacity-0
															group-data-[active=true]:opacity-100"
													/>
													<p>{childItem.label}</p>
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

			<Button unstyled={true} className={cnMerge("z-10 size-5", className)} onClick={toggleNavShow}>
				<Image
					src={isNavShow ? xIcon : hamburgerIcon}
					alt={isNavShow ? "X" : "Hamburger"}
					width={20}
					height={20}
					priority={true}
					className="size-full"
				/>
			</Button>
		</>
	);
}
