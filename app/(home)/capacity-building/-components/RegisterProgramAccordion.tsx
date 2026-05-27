"use client";

import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink, type MainAppRoutes } from "@/components/common/NavLink";
import { Accordion } from "@/components/ui";
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
		<Accordion.Root type="single" collapsible={true} className="flex flex-col gap-4 lg:gap-5">
			<Accordion.Item value="register-program">
				<Accordion.Trigger
					className="mx-auto flex w-fit items-center justify-center gap-2 lg:gap-7.5"
					classNames={{ icon: "hidden" }}
				>
					<h2
						className="text-[24px]/[1.2] underline underline-offset-5 lg:text-[40px] lg:decoration-1"
					>
						Register for a Program
					</h2>

					<Button as="span" size="icon" className="lg:text-[30px]">
						<IconBox icon="lucide:chevron-down" className="transition-transform duration-200" />
					</Button>
				</Accordion.Trigger>

				<Accordion.Content className="pt-6 lg:pt-10">
					<ForWithWrapper
						className="flex flex-col gap-3 lg:gap-5"
						each={registrationLinks}
						renderItem={(registrationLink) => (
							<li
								key={registrationLink.label}
								className="flex min-h-[96px] items-center justify-between gap-5 rounded-[24px]
									bg-cedar-black py-3 pr-3 pl-5 text-cedar-white lg:min-h-[128px]
									lg:rounded-[32px] lg:py-5 lg:pr-5 lg:pl-10"
							>
								<NavLink
									href={registrationLink.href}
									className="text-[18px]/[1.25] underline underline-offset-4 lg:text-[32px]"
								>
									{registrationLink.label}
								</NavLink>

								<NavLink href={registrationLink.href} className="contents">
									<Button
										size="icon"
										className="size-14 shrink-0 rounded-[20px] text-[24px] lg:size-[76px]
											lg:rounded-[24px] lg:text-[32px]"
									>
										<IconBox icon="solar:arrow-right-up-outline" />
									</Button>
								</NavLink>
							</li>
						)}
					/>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	);
}

export { RegisterProgramAccordion };
