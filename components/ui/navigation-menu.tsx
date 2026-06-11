import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { tv } from "tailwind-variants";
import { cnMerge } from "@/lib/utils/cn";
import { IconBox } from "../common/IconBox";

function NavigationMenuRoot(
	props: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
		viewport?: boolean;
	}
) {
	const { children, className, viewport = true, ...restOfProps } = props;

	return (
		<NavigationMenuPrimitive.Root
			data-slot="navigation-menu-root"
			data-viewport={viewport}
			className={cnMerge(
				"group/navigation-menu relative flex max-w-max grow items-center justify-center",
				className
			)}
			{...restOfProps}
		>
			{children}
			{viewport && <NavigationMenuViewport />}
		</NavigationMenuPrimitive.Root>
	);
}

function NavigationMenuList(props: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
	const { className, ...restOfProps } = props;

	return (
		<NavigationMenuPrimitive.List
			data-slot="navigation-menu-list"
			className={cnMerge("group flex grow list-none items-center justify-center gap-0", className)}
			{...restOfProps}
		/>
	);
}

function NavigationMenuItem({
	className,
	...restOfProps
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
	return (
		<NavigationMenuPrimitive.Item
			data-slot="navigation-menu-item"
			className={cnMerge("relative", className)}
			{...restOfProps}
		/>
	);
}

const navigationMenuTriggerStyle = tv({
	base: `group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5
	py-1.5 text-sm font-medium transition-all outline-none hover:bg-shadcn-muted focus:bg-shadcn-muted
	focus-visible:ring-3 focus-visible:ring-shadcn-ring/50 focus-visible:outline-1
	disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-shadcn-muted/50
	data-popup-open:hover:bg-shadcn-muted data-open:bg-shadcn-muted/50 data-open:hover:bg-shadcn-muted
	data-open:focus:bg-shadcn-muted`,
});

function NavigationMenuTrigger(props: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
	const { children, className, ...restOfProps } = props;

	return (
		<NavigationMenuPrimitive.Trigger
			data-slot="navigation-menu-trigger"
			className={cnMerge(navigationMenuTriggerStyle(), "group", className)}
			{...restOfProps}
		>
			{children}

			<IconBox
				icon="lucide:chevron-down"
				className="relative top-px ml-1 size-3 transition duration-300
					group-data-popup-open/navigation-menu-trigger:rotate-180
					group-data-open/navigation-menu-trigger:rotate-180"
				aria-hidden="true"
			/>
		</NavigationMenuPrimitive.Trigger>
	);
}

function NavigationMenuContent(props: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
	const { className, ...restOfProps } = props;

	return (
		<NavigationMenuPrimitive.Content
			data-slot="navigation-menu-content"
			className={cnMerge(
				`top-0 left-0 w-full p-1 ease-[cubic-bezier(0.22,1,0.36,1)]
				group-data-[viewport=false]/navigation-menu:top-full
				group-data-[viewport=false]/navigation-menu:mt-1.5
				group-data-[viewport=false]/navigation-menu:overflow-hidden
				group-data-[viewport=false]/navigation-menu:rounded-lg
				group-data-[viewport=false]/navigation-menu:bg-shadcn-popover
				group-data-[viewport=false]/navigation-menu:text-shadcn-popover-foreground
				group-data-[viewport=false]/navigation-menu:shadow-sm
				group-data-[viewport=false]/navigation-menu:ring-1
				group-data-[viewport=false]/navigation-menu:ring-shadcn-foreground/10
				group-data-[viewport=false]/navigation-menu:duration-300
				data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52
				data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52
				data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out
				data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0
				**:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto
				group-data-[viewport=false]/navigation-menu:data-open:animate-in
				group-data-[viewport=false]/navigation-menu:data-open:fade-in-0
				group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95
				group-data-[viewport=false]/navigation-menu:data-closed:animate-out
				group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0
				group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95`,
				className
			)}
			{...restOfProps}
		/>
	);
}

function NavigationMenuViewport(props: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
	const { className, ...restOfProps } = props;

	return (
		<div className="absolute top-full left-0 isolate z-50 flex justify-center">
			<NavigationMenuPrimitive.Viewport
				data-slot="navigation-menu-viewport"
				className={cnMerge(
					`relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full origin-center
					overflow-hidden rounded-lg bg-shadcn-popover text-shadcn-popover-foreground shadow-sm ring-1
					ring-shadcn-foreground/10 duration-100 md:w-(--radix-navigation-menu-viewport-width)
					data-open:animate-in data-open:zoom-in-90 data-closed:animate-out data-closed:zoom-out-90`,
					className
				)}
				{...restOfProps}
			/>
		</div>
	);
}

function NavigationMenuLink({
	className,
	...restOfProps
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
	return (
		<NavigationMenuPrimitive.Link
			data-slot="navigation-menu-link"
			className={cnMerge(
				`flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none
				hover:bg-shadcn-muted focus:bg-shadcn-muted focus-visible:ring-3
				focus-visible:ring-shadcn-ring/50 focus-visible:outline-1
				in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-shadcn-muted/50
				data-active:hover:bg-shadcn-muted data-active:focus:bg-shadcn-muted
				[&_svg:not([class*='size-'])]:size-4`,
				className
			)}
			{...restOfProps}
		/>
	);
}

function NavigationMenuIndicator({
	className,
	...restOfProps
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
	return (
		<NavigationMenuPrimitive.Indicator
			data-slot="navigation-menu-indicator"
			className={cnMerge(
				`top-full z-1 flex h-1.5 items-end justify-center overflow-hidden
				data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in
				data-[state=visible]:fade-in`,
				className
			)}
			{...restOfProps}
		>
			<div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-shadcn-border shadow-md" />
		</NavigationMenuPrimitive.Indicator>
	);
}

export {
	NavigationMenuRoot as Root,
	NavigationMenuList as List,
	NavigationMenuItem as Item,
	NavigationMenuContent as Content,
	NavigationMenuTrigger as Trigger,
	NavigationMenuLink as Link,
	NavigationMenuIndicator as Indicator,
	NavigationMenuViewport as Viewport,
	// eslint-disable-next-line react-refresh/only-export-components
	navigationMenuTriggerStyle,
};
