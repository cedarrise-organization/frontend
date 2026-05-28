"use client";

import { CollapsibleAnimated } from "@/components/animated/ui";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink, NavLinkEphemeral, type MainAppRoutes } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";

const registrationLinks = [
	{
		href: "#",
		label: "Capacity Building for Undergraduates Registration Form",
	},
	{
		href: "#",
		label: "Capacity Building for Secondary School Students- Registration Form",
	},
	{
		href: "#",
		label: "Capacity Building for Professionals- Registration Form",
	},
	{
		href: "#",
		label: "Form",
	},
] satisfies Array<{ href: MainAppRoutes; label: string }>;

function RegisterProgramAccordion() {
	return (
		<CollapsibleAnimated.Root className="flex flex-col gap-4 lg:gap-5">
			<CollapsibleAnimated.Trigger
				className="mx-auto flex w-fit items-center justify-center gap-2 lg:gap-7.5"
			>
				<h2 className="text-[24px]/[1.2] underline underline-offset-5 lg:text-[40px] lg:decoration-1">
					Register for a Program
				</h2>

				<Button as="span" size="icon" className="lg:text-[30px]">
					<IconBox icon="lucide:chevron-down" className="transition-transform duration-200" />
				</Button>
			</CollapsibleAnimated.Trigger>

			<CollapsibleAnimated.Content className="flex flex-col gap-3 pt-6 lg:gap-5 lg:pt-10">
				<For
					each={registrationLinks}
					renderItem={(registrationLink) => (
						<li
							key={registrationLink.label}
							className="flex min-h-12 items-center justify-between gap-5 rounded-[12px]
								bg-cedar-black py-3 pr-3 pl-5 text-cedar-white lg:min-h-[116px] lg:rounded-[24px]
								lg:py-5 lg:pr-5 lg:pl-10"
						>
							<NavLink
								href={registrationLink.href}
								className="leading-[1.2] underline underline-offset-4 lg:text-[24px]"
							>
								{registrationLink.label}
							</NavLink>

							<NavLinkEphemeral href={registrationLink.href}>
								<Button
									size="icon"
									className="size-14 shrink-0 rounded-[20px] text-[24px] lg:size-[76px]
										lg:rounded-[24px] lg:text-[32px]"
								>
									<IconBox icon="solar:arrow-right-up-outline" />
								</Button>
							</NavLinkEphemeral>
						</li>
					)}
				/>
			</CollapsibleAnimated.Content>
		</CollapsibleAnimated.Root>
	);
}

export { RegisterProgramAccordion };
