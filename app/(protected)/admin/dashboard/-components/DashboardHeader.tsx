"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { AvatarGroupAnimated } from "@/components/animated/ui";
import { IconBox } from "@/components/common/IconBox";
import { Avatar } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { sessionQuery } from "@/lib/react-query/queryOptions";
import { dashboardNavSections } from "./constants";

function DashboardHeader() {
	const pathname = usePathname();
	const sessionQueryResult = useQuery(sessionQuery());

	const session = sessionQueryResult.data;

	const title = dashboardNavSections.find((item) =>
		item.link ? item.link === pathname : item.children.some((innerItem) => innerItem.link === pathname)
	)?.label;

	const initials = session?.name
		?.split(" ")
		.map((namePart) => namePart[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<header className="flex items-center justify-between gap-4 bg-cedar-white px-5 py-4 lg:pr-12">
			<h2 className="text-[24px] font-semibold text-cedar-black lg:text-[32px]">{title}</h2>

			<div className="flex h-10 shrink-0 items-center gap-3 lg:h-12 lg:gap-5">
				<Button
					unstyled={true}
					aria-label="Notifications"
					className="grid aspect-square h-full place-content-center rounded-[8px] bg-cedar-grey
						text-cedar-black transition-colors hover:bg-cedar-black/10 lg:rounded-[12px]"
				>
					<IconBox icon="lucide:bell" className="size-3 lg:size-5" />
				</Button>

				<div
					className="flex h-full items-center gap-2 rounded-[8px] bg-cedar-grey py-1 pr-2.5 pl-1
						lg:rounded-[12px] lg:pr-8"
				>
					<AvatarGroupAnimated.Root sideOffset={10} translate="5%">
						<Avatar.Root className="size-8 rounded-[8px] lg:size-10 lg:rounded-[8px]">
							{session?.name && (
								<AvatarGroupAnimated.Tooltip classNames={{ arrow: "fill-cedar-black" }}>
									{session.name}
								</AvatarGroupAnimated.Tooltip>
							)}

							<Avatar.Fallback
								className="size-8 rounded-[8px] bg-cedar-yellow text-[12px] font-semibold
									text-cedar-white lg:size-10 lg:rounded-[8px] lg:text-base"
							>
								{initials}
							</Avatar.Fallback>
						</Avatar.Root>
					</AvatarGroupAnimated.Root>

					<div className="flex flex-col gap-1">
						<p className="text-[10px]/none font-medium text-cedar-black capitalize lg:text-[14px]">
							{session?.name ?? "Admin"}
						</p>
						<p className="text-[8px]/none text-cedar-black/40 capitalize lg:text-[12px]">
							{session?.department ?? "Department"}
						</p>
					</div>
				</div>
			</div>
		</header>
	);
}

export { DashboardHeader };
