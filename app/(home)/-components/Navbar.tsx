"use client";

import { useToggle } from "@zayne-labs/toolkit-react";
import Image from "next/image";
import { ForWithWrapper } from "@/components/common/for";
import { Logo } from "@/components/common/Logo";
import { NavLink, type MainAppRoutes } from "@/components/common/NavLink";
import { hamburgerIcon, xIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cnMerge } from "@/lib/utils/cn";

function NavBar() {
	return (
		<header
			className="relative isolate z-500 flex w-full items-center justify-between gap-12 px-4 py-5
				lg:px-[100px] lg:py-10"
		>
			<Logo />

			<DesktopNavigation className="max-lg:hidden" />

			<MobileNavigation className="lg:hidden" />
		</header>
	);
}

export { NavBar };

const navLinkItems = [
	{ href: "/", title: "Home" },
	{ href: "/about", title: "About" },
	{ href: "/capacity-building", title: "Capacity Building" },
	// { href: "/social-initiatives", title: "Social Initiatives" },
	{ href: "/blog", title: "Blog" },
	// { href: "/get-involved", title: "Get Involved" },
	{ href: "/donate", title: "Donate" },
] satisfies Array<{ href: MainAppRoutes; title: string }>;

function DesktopNavigation(props: { className?: string }) {
	const { className } = props;

	return (
		<section className={cnMerge("flex w-full", className)}>
			<ForWithWrapper
				as="nav"
				className="flex min-w-fit gap-4"
				each={navLinkItems}
				renderItem={(linkItem) => (
					<NavLink
						key={linkItem.title}
						href={linkItem.href}
						className="inline-flex h-[56px] shrink-0 items-center justify-center rounded-[20px] p-5
							data-[active=true]:bg-cedar-yellow data-[active=true]:text-cedar-white"
					>
						{linkItem.title}
					</NavLink>
				)}
			/>
		</section>
	);
}

function MobileNavigation(props: { className?: string }) {
	const { className } = props;

	const [isNavShow, toggleNavShow] = useToggle(false);

	return (
		<>
			<section
				className={cnMerge(
					`fixed inset-[0_0_0_auto] flex flex-col items-center gap-12 overflow-x-hidden
					bg-cedar-white/50 pt-10 backdrop-blur-3xl transition-[width] ease-[ease]`,
					isNavShow ? "w-full duration-350" : "w-0 duration-500",
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
					className="flex flex-col items-center gap-5 text-[14px] text-nowrap"
					each={navLinkItems}
					renderItem={(linkItem) => (
						<NavLink key={linkItem.title} href={linkItem.href}>
							{linkItem.title}
						</NavLink>
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
