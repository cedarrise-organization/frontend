"use client";

import { useQuery } from "@tanstack/react-query";
import { CollapsibleAnimated } from "@/components/animated/ui";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Button } from "@/components/ui/button";
import { generalGoogleFormQuery } from "@/lib/react-query/queryOptions";

function RegisterProgramCollapsible(props: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}) {
	const { isOpen, onOpenChange } = props;
	const generalGoogleFormQueryResult = useQuery(generalGoogleFormQuery());

	const registrationLinks = [
		{
			href: "https://docs.google.com/forms/d/e/1FAIpQLSdcP06c3YsCwTo0RPPRKz_lA1_JnESDj7phZGutnoJ8YdsOBg/viewform?usp=publish-editor",
			label: "Are you a secondary school student?",
		},
		{
			href: "https://docs.google.com/forms/d/e/1FAIpQLSe19vkUw_T1aVrwWQuYBLqKcMlZTeFJIKRQyFloQOkNvLXFhQ/viewform?usp=publish-editor",
			label: "Are you an undergraduate?",
		},
		{
			href: "https://docs.google.com/forms/d/e/1FAIpQLSfv6peEUtuOOca1PUZjPoo34j6lRnzf7iEaywZGb4A5FI-EMA/viewform?usp=publish-editor",
			label: "Are you a professional?",
		},
		{
			href: generalGoogleFormQueryResult.data?.data.src ?? "#",
			label: "Are you attending a specific program?",
		},
	] satisfies Array<{ href: string; label: string }>;

	return (
		<CollapsibleAnimated.Root
			open={isOpen}
			onOpenChange={onOpenChange}
			className="flex flex-col gap-4 lg:gap-5"
		>
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
						<a
							key={registrationLink.label}
							rel="noopener noreferrer"
							target="_blank"
							href={registrationLink.href}
							className="flex min-h-12 items-center justify-between gap-5 rounded-[12px]
								bg-cedar-black py-3 pr-3 pl-5 text-cedar-white lg:min-h-[116px] lg:rounded-[24px]
								lg:py-5 lg:pr-5 lg:pl-10"
						>
							<p className="leading-[1.2] lg:text-[24px]">{registrationLink.label}</p>

							<Button
								size="icon"
								className="size-14 shrink-0 rounded-[20px] text-[24px] lg:size-[76px]
									lg:rounded-[24px] lg:text-[32px]"
							>
								<IconBox icon="solar:arrow-right-up-outline" />
							</Button>
						</a>
					)}
				/>
			</CollapsibleAnimated.Content>
		</CollapsibleAnimated.Root>
	);
}

export { RegisterProgramCollapsible };
