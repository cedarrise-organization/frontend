/* eslint-disable unicorn/filename-case -- File does not follow expected naming convention. */
"use client";

import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink, NavLinkEphemeral } from "@/components/common/NavLink";
import { Show } from "@/components/common/show";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";

type FinalCTAAction = {
	href: InferProps<typeof NavLink>["href"];
	icon?: string;
	kind?: "button" | "icon-link" | "outline-button";
	label: string;
};

const defaultActions: FinalCTAAction[] = [
	{ href: "/donate", label: "Donate Now" },
	{ href: "/get-involved/partner", kind: "icon-link", label: "Get Involved" },
];

function FinalCTASection(props: {
	actionLayout?: "row" | "stack-mobile";
	actions?: FinalCTAAction[];
	description?: string;
	title?: string;
	tone?: "dark" | "light";
}) {
	const {
		actionLayout = "row",
		actions = defaultActions,
		description = "Join us in shaping a better future for the next generation",
		title = "Be Part of the Change",
		tone = "dark",
	} = props;

	return (
		<section
			className={cnJoin(
				"flex w-full flex-col items-center px-10 py-6 text-center lg:px-[50px] lg:py-[64px]",
				tone === "dark" && "bg-cedar-black text-cedar-white",
				tone === "light" && "bg-cedar-grey text-cedar-black"
			)}
		>
			<h2
				className={cnJoin(
					"text-[32px]/[1.2] lg:text-[48px]",
					tone === "dark" && "text-cedar-yellow",
					tone === "light" && "text-cedar-black"
				)}
			>
				{title}
			</h2>

			<p
				className={cnJoin(
					"mt-2 text-[14px]/[1.2] max-lg:max-w-[284px] lg:mt-4 lg:text-base",
					tone === "dark" && "text-cedar-white/80"
				)}
			>
				{description}.
			</p>

			<ForWithWrapper
				className={cnJoin(
					"mt-10 flex gap-2 lg:mt-12.5 lg:gap-8.5",
					actionLayout === "stack-mobile" && "flex-col gap-5 lg:flex-row lg:gap-8.5"
				)}
				each={actions}
				renderItem={(action, index) => <FinalCTAActionItem key={index} action={action} />}
			/>
		</section>
	);
}

function FinalCTAActionItem(props: { action: FinalCTAAction }) {
	const { action } = props;

	return (
		<li className={cnJoin(action.kind === "icon-link" && "self-center")}>
			<Show.Root when={action.kind === "icon-link"}>
				<Show.Content>
					<NavLink href={action.href} className="flex items-center gap-4">
						<p className="text-[14px] font-medium lg:text-[20px]">{action.label}</p>

						<Button theme="secondary" size="icon" className="shrink-0">
							<IconBox icon={action.icon ?? "solar:arrow-right-up-outline"} />
						</Button>
					</NavLink>
				</Show.Content>

				<Show.Fallback>
					<NavLinkEphemeral href={action.href}>
						<Button
							{...(action.kind === "outline-button" && { theme: "none" })}
							className={cnJoin(
								"shrink-0 max-lg:w-full",
								action.kind === "outline-button"
									&& "border border-cedar-white bg-transparent text-cedar-white"
							)}
						>
							{action.label}
						</Button>
					</NavLinkEphemeral>
				</Show.Fallback>
			</Show.Root>
		</li>
	);
}

export { FinalCTASection };
