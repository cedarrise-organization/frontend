"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tw } from "@zayne-labs/toolkit-core";
import { formatDistanceToNowStrict } from "date-fns";
import { usePathname } from "next/navigation";
import { AvatarGroupAnimated } from "@/components/animated/ui";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Avatar, Popover, ScrollArea, Skeleton } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { dismissDashboardNotificationMutation } from "@/lib/react-query/mutationOptions";
import { dashboardNotificationsQuery, sessionQuery } from "@/lib/react-query/queryOptions";
import { cnJoin } from "@/lib/utils/cn";
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
				<DashboardNotificationsPopover />

				<div
					className="flex h-full items-center gap-2 rounded-[8px] bg-cedar-grey py-1 pr-2.5 pl-1
						lg:rounded-[12px] lg:pr-8"
				>
					<AvatarGroupAnimated.Root sideOffset={10} translate="5%">
						<Avatar.Root className="size-8 rounded-[8px] lg:size-10 lg:rounded-[8px]">
							{session?.name && (
								<AvatarGroupAnimated.Tooltip
									classNames={{ arrow: "fill-cedar-black", base: "bg-cedar-black" }}
								>
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

const notificationSeverityClassNames = {
	critical: tw`bg-cedar-red`,
	high: tw`bg-cedar-red`,
	low: tw`bg-cedar-yellow`,
	medium: tw`bg-cedar-black`,
} as const;

function DashboardNotificationsPopover() {
	const notificationsQueryResult = useQuery(dashboardNotificationsQuery({ status: "active" }));
	const dismissNotificationMutation = useMutation(dismissDashboardNotificationMutation());
	const queryClient = useQueryClient();

	const notifications = notificationsQueryResult.data?.data ?? [];

	const onDismissNotification = (id: string) => {
		dismissNotificationMutation.mutate(id, {
			onSuccess: () => {
				void queryClient.invalidateQueries({
					queryKey: dashboardNotificationsQuery().queryKey.slice(0, -1),
				});
			},
		});
	};

	return (
		<Popover.Root>
			<Popover.Trigger asChild={true}>
				<Button
					unstyled={true}
					aria-label="Notifications"
					className="relative grid aspect-square h-full place-content-center rounded-[8px]
						bg-cedar-grey text-cedar-black transition-colors hover:bg-cedar-black/10
						lg:rounded-[12px]"
				>
					<IconBox icon="lucide:bell" className="size-3 lg:size-5" />
					{notifications.length > 0 && (
						<span className="absolute top-2 right-2 size-2 rounded-full bg-cedar-red" />
					)}
				</Button>
			</Popover.Trigger>

			<Popover.Content
				align="end"
				collisionPadding={16}
				sideOffset={12}
				className="flex w-[min(calc(100vw-32px),420px)] flex-col gap-5 rounded-[26px] border
					border-cedar-black/12 bg-cedar-white p-4 shadow-[0_22px_60px_hsl(0,0%,0%,0.18)]"
			>
				<header
					className="flex items-center justify-center gap-3 rounded-[16px] bg-cedar-red px-5 py-4
						text-cedar-white"
				>
					<IconBox icon="lucide:bell" className="size-4 lg:size-5" />
					<h3 className="text-[18px]/[1.2] font-semibold lg:text-[20px]">Alerts & Notifications</h3>
				</header>

				<ScrollArea.Root
					classNames={{
						base: "h-[min(420px,calc(100vh-160px))]",
						viewport: "overscroll-contain pr-2",
					}}
				>
					{notificationsQueryResult.isPending && (
						<ForWithWrapper
							className="flex flex-col gap-5"
							each={4}
							renderItem={(index) => (
								<li key={index} className="grid grid-cols-[6px_1fr_28px] items-center gap-4">
									<Skeleton className="h-14 w-1.5 rounded-full" />
									<div className="flex min-w-0 flex-col gap-2">
										<Skeleton className="h-4 w-4/5" />
										<Skeleton className="h-3 w-3/5" />
									</div>
									<Skeleton className="size-5 rounded-full" />
								</li>
							)}
						/>
					)}

					{!notificationsQueryResult.isPending && notifications.length === 0 && (
						<p className="py-10 text-center text-[12px] text-cedar-black/48">
							No active notifications.
						</p>
					)}

					<ForWithWrapper
						className="flex flex-col gap-5"
						each={notifications}
						renderItem={(notification) => (
							<li
								key={notification.id}
								className="grid grid-cols-[6px_1fr_28px] items-center gap-4"
							>
								<span
									className={cnJoin(
										"h-full min-h-16 rounded-full",
										notificationSeverityClassNames[notification.severity]
									)}
								/>

								<div className="flex min-w-0 flex-col gap-1.5">
									<p className="text-[13px]/[1.25] text-cedar-black lg:text-[14px]">
										{notification.title}
									</p>
									<p className="text-[10px]/[1.35] text-cedar-black/56 lg:text-[11px]">
										{notification.message} -{` `}
										{formatDistanceToNowStrict(new Date(notification.createdAt), {
											addSuffix: true,
										})}
									</p>
								</div>

								<Button
									unstyled={true}
									isDisabled={
										dismissNotificationMutation.isPending
										&& dismissNotificationMutation.variables === notification.id
									}
									className="grid size-7 place-content-center text-cedar-black transition-opacity
										hover:opacity-56"
									onClick={() => onDismissNotification(notification.id)}
								>
									<IconBox icon="lucide:x" className="size-5" />
								</Button>
							</li>
						)}
					/>
				</ScrollArea.Root>
			</Popover.Content>
		</Popover.Root>
	);
}
