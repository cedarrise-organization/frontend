"use client";

import type { UrlObject } from "node:url";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction, isString } from "@zayne-labs/toolkit-type-helpers";
import type { Route } from "next";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import type { AppRoutes } from "@/.next/dev/types/routes";
import { cnMerge } from "@/lib/utils/cn";

export type MainAppRoutes<TRouteType extends string = AppRoutes> = "#" | Route<TRouteType>;

type HrefObjectType<TRouteType extends string> = Omit<UrlObject, "pathname"> & {
	pathname: MainAppRoutes<TRouteType>;
};

export function NavLink<TRouteType extends string = AppRoutes>(
	props: Omit<InferProps<typeof Link> & LinkProps<TRouteType>, "children" | "href"> & {
		children: React.ReactNode | ((ctx: { isActive: boolean }) => React.ReactNode);
		href:
			| HrefObjectType<TRouteType>
			| MainAppRoutes<TRouteType>
			| ((ctx: Pick<HrefObjectType<string>, "pathname">) => HrefObjectType<TRouteType>);
	}
) {
	const { children, href, ...restOfProps } = props;

	const pathname = usePathname();

	const resolvedHref = typeof href === "function" ? href({ pathname: pathname as never }) : href;

	const isActive =
		isString(resolvedHref) ? pathname === resolvedHref : pathname === resolvedHref.pathname;

	const resolvedChildren = isFunction(children) ? children({ isActive }) : children;

	return (
		<Link href={resolvedHref} data-active={isActive} {...restOfProps}>
			{resolvedChildren}
		</Link>
	);
}

export const NavLinkEphemeral: typeof NavLink = (props) => {
	const { className, ...restOfProps } = props;

	return <NavLink className={cnMerge("contents", className)} {...restOfProps} />;
};
