"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tw } from "@zayne-labs/toolkit-core";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	ComposedChart,
	Line,
	LineChart,
	Pie,
	PieChart,
	Rectangle,
	XAxis,
	YAxis,
	type BarShapeProps,
} from "recharts";
import type { RectRadius } from "recharts/types/shape/Rectangle";
import { ProgressAnimated } from "@/components/animated/ui";
import { For, ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Carousel, Chart, ScrollArea, Skeleton } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DashboardChartDataset, DashboardLineData } from "@/lib/api/callBackendApi/apiSchema";
import {
	dashboardProjectStatusMutation,
	dismissDashboardNotificationMutation,
} from "@/lib/react-query/mutationOptions";
import {
	dashboardCardsQuery,
	dashboardEnrollmentQuery,
	dashboardInstitutionalEffectivenessQuery,
	dashboardNotificationsQuery,
	dashboardProjectsQuery,
	dashboardStudentPerformanceQuery,
	type DashboardProjectsQueryResult,
} from "@/lib/react-query/queryOptions";
import { cnJoin, cnMerge } from "@/lib/utils/cn";
import { EMPTY_VALUE_PLACEHOLDER } from "./-components/constants";
import { Main } from "./-components/Main";

const chartScopesByTitle = {
	"Acceptance Rate - by Programme": "ASH + TACOTS",
	"Application Numbers Over Time": "ASH + TACOTS",
	"At-risk vs Low-risk Students": "ASH",
	"Attendance Trend - Monthly Sessions": "ASH",
	"Average Mentorship Hours": "TACOTS",
	"Average Spend per Student": "TACOTS",
	"Class/Age Distribution": "ASH",
	"Dropout Trend - Monthly": "ASH",
	"Gender Diversity": "ASH + TACOTS",
	"Geographic Distribution - Top States": "ASH",
	"Graduation Rate Trend": "ASH",
	"Pre/Mid/Post-test Scores by Term": "ASH",
	"Students Meeting Benchmark": "TACOTS",
	"TACOTS Mid-term & End-of-term Scores": "TACOTS",
	"Total Accumulated Mentorship Hours": "TACOTS",
	"Total Community Service Hours": "TACOTS",
} as const satisfies Record<string, "ASH" | "ASH + TACOTS" | "TACOTS">;

const notificationSeverityClassNames = {
	critical: tw`bg-cedar-red`,
	high: tw`bg-cedar-red`,
	low: tw`bg-cedar-yellow`,
	medium: tw`bg-cedar-black`,
} as const;

type ChartTitles = keyof typeof chartScopesByTitle;

function DashboardPage() {
	const cardsQueryResult = useQuery(dashboardCardsQuery());
	const projectsQueryResult = useQuery(dashboardProjectsQuery());
	const studentPerformanceQueryResult = useQuery(dashboardStudentPerformanceQuery());
	const enrollmentQueryResult = useQuery(dashboardEnrollmentQuery());
	const institutionalEffectivenessQueryResult = useQuery(dashboardInstitutionalEffectivenessQuery());

	const cards = cardsQueryResult.data;
	const studentPerformance = studentPerformanceQueryResult.data;
	const enrollment = enrollmentQueryResult.data;
	const institutionalEffectiveness = institutionalEffectivenessQueryResult.data;

	return (
		<Main className="gap-6 lg:gap-8">
			<section className="grid grow gap-3 md:grid-cols-2 xl:grid-cols-3">
				<DashboardStatCard
					icon="solar:user-check-rounded-outline"
					title="Volunteers"
					stats={[
						{ label: "Applied", value: cards?.volunteer.applied },
						{ label: "Accepted", value: cards?.volunteer.accepted },
						{ label: "Partners", value: cards?.volunteer.Partners },
						{ label: "Current volunteers", value: cards?.volunteer.currentVolunteers },
						{ label: "Sponsors", value: cards?.volunteer.sponsors },
					]}
				/>

				<DashboardStatCard
					icon="solar:document-add-outline"
					title="Capacity Building"
					stats={[
						{ label: "Impacted", value: cards?.capacityBuilding.participantsImpacted },
						{
							label: "Organizations",
							value: cards?.capacityBuilding.organizationsPartneredWith,
						},
						{ label: "Volunteers", value: cards?.capacityBuilding.volunteersEngaged },
						{ label: "Workshops", value: cards?.capacityBuilding.workshopsConducted },
					]}
				/>

				<DashboardStatCard
					icon="solar:map-point-wave-outline"
					title="Outreaches"
					stats={[
						{ label: "Communities", value: cards?.outreaches.communitiesEngaged },
						{ label: "Beneficiaries", value: cards?.outreaches.beneficiariesReached },
						{ label: "Partners", value: cards?.outreaches.partners },
						{ label: "Volunteers", value: cards?.outreaches.volunteers },
						{ label: "Events", value: cards?.outreaches.outreachEvents },
					]}
				/>

				<DashboardStatCard
					icon="solar:book-bookmark-outline"
					title="ASH"
					stats={[
						{ label: "Students", value: cards?.ash.studentsEnrolled },
						{ label: "Volunteers", value: cards?.ash.volunteers },
						{ label: "Communities", value: cards?.ash.communitiesEngaged },
						{ label: "Improved grades", suffix: "%", value: cards?.ash.improvedGrades },
						{ label: "Beneficiaries", value: cards?.ash.currentBeneficiaries },
						{ label: "Graduated", value: cards?.ash.graduated },
						{ label: "Drop outs", value: cards?.ash.dropOuts },
					]}
				/>

				<DashboardStatCard
					icon="solar:shield-star-outline"
					title="TACOTS"
					stats={[
						{ label: "Enrolled", value: cards?.tacots.enrolled },
						{ label: "In schools", value: cards?.tacots.currentlyInSchools },
						{ label: "Partner schools", value: cards?.tacots.partnerSchools },
						{ label: "Benefactors", value: cards?.tacots.benefactors },
						{ label: "Sponsors", value: cards?.tacots.sponsors },
						{ label: "Partners", value: cards?.tacots.partners },
						{ label: "Graduated", value: cards?.tacots.graduated },
					]}
				/>

				<AlertsPanel />
			</section>

			<section className="flex min-w-0 flex-col gap-3 overflow-hidden">
				<SectionHeader
					title="Ongoing Projects"
					description={`${projectsQueryResult.data?.length ?? 0} active community initiatives`}
				/>

				<Carousel.Root options={{ align: "start", loop: false }}>
					<Carousel.Content className="-mr-3 gap-3 select-none lg:-mr-5 lg:gap-5">
						<For
							each={projectsQueryResult.data ?? []}
							renderItem={(project, index, array) => (
								<Carousel.Item
									key={project.id}
									className={cnJoin(
										"w-full max-w-[300px] cursor-grab active:cursor-grabbing lg:max-w-[528px]",
										index === array.length - 1 && "pr-3 lg:pr-0"
									)}
								>
									<ProjectCard project={project} />
								</Carousel.Item>
							)}
						/>
					</Carousel.Content>
				</Carousel.Root>
			</section>

			<MetricsSection title="Student Performance & Success Metrics">
				<article className="flex w-full min-w-0 flex-col gap-3 lg:flex-row">
					<DashboardChartCard
						title="Graduation Rate Trend"
						description="ASH beneficiary completion against drop-outs"
						dataset={studentPerformance?.c_graduationRate}
					/>
					<DashboardChartCard
						title="Attendance Trend - Monthly Sessions"
						description="Total student attendance across sessions"
						dataset={studentPerformance?.c_attendanceTrend}
					/>
				</article>

				<article className="flex w-full min-w-0 flex-col gap-3 lg:flex-row">
					<DashboardChartCard
						title="Pre/Mid/Post-test Scores by Term"
						description="Average test performance by term"
						dataset={studentPerformance?.c_testScores}
					/>
					<DashboardChartCard
						title="TACOTS Mid-term & End-of-term Scores"
						description="Average TACOTS student score by assessment period"
						dataset={studentPerformance?.c_tacots_scores}
					/>
				</article>

				<article className="flex w-full min-w-0 flex-col gap-3 lg:flex-row">
					<DashboardChartCard
						title="Dropout Trend - Monthly"
						description="Dropouts captured by month"
						dataset={studentPerformance?.c_dropoutTrend}
					/>
					<DashboardChartCard
						title="At-risk vs Low-risk Students"
						description="Risk split from latest post-test average"
						dataset={studentPerformance?.c_risk}
					/>
				</article>
			</MetricsSection>

			<MetricsSection title="Enrollment & Recruitment">
				<DashboardChartCard
					title="Application Numbers Over Time"
					description="ASH and TACOTS application trend"
					dataset={enrollment?.c_applicationNumbers}
				/>

				<article className="flex w-full min-w-0 flex-col gap-3 lg:flex-row">
					<LineDataCard
						title="Acceptance Rate - by Programme"
						description="Current application conversion"
						items={enrollment?.c_acceptanceRate}
						variant="programmes"
					/>
					<DashboardChartCard
						title="Gender Diversity"
						description="Current gender split"
						dataset={enrollment?.c_genderDiversity}
					/>
				</article>

				<article className="flex w-full min-w-0 flex-col gap-3 lg:flex-row">
					<DashboardChartCard
						title="Class/Age Distribution"
						description="Student spread by education band"
						dataset={enrollment?.c_classDistribution}
					/>
					<LineDataCard
						title="Geographic Distribution - Top States"
						description="Student concentration by state"
						items={enrollment?.c_geographicalDistribution}
					/>
				</article>
			</MetricsSection>

			<MetricsSection title="Institutional Effectiveness">
				<DashboardChartCard
					title="Total Community Service Hours"
					description="Community service hours (TACOTS)"
					dataset={institutionalEffectiveness?.c_communityServiceHours}
				/>

				<article className="flex w-full min-w-0 flex-col gap-3 lg:flex-row">
					<DashboardChartCard
						title="Average Mentorship Hours"
						description="Mentorship time per beneficiary"
						dataset={institutionalEffectiveness?.c_averageMentorshipHours}
					/>
					<LineDataCard
						title="Total Accumulated Mentorship Hours"
						description="Session-level recorded mentorship"
						items={institutionalEffectiveness?.c_totalAccHours}
					/>
				</article>

				<article className="flex w-full min-w-0 flex-col gap-3 lg:flex-row">
					<DashboardChartCard
						title="Students Meeting Benchmark"
						description="Academic benchmark progress"
						dataset={institutionalEffectiveness?.c_studentBenchMark}
					/>
					<DashboardChartCard
						title="Average Spend per Student"
						description="Average programme spend by category"
						dataset={institutionalEffectiveness?.c_spendPerstudent}
					/>
				</article>
			</MetricsSection>
		</Main>
	);
}

export default DashboardPage;

function SectionHeader(props: { description?: string; title: string }) {
	const { description, title } = props;

	return (
		<header className="flex flex-col gap-1">
			<h2 className="text-[20px]/[1.2] lg:text-[24px]">{title}</h2>
			{description && <p className="text-[12px] text-cedar-black/56">{description}</p>}
		</header>
	);
}

function MetricsSection(props: { children: React.ReactNode; title: string }) {
	const { children, title } = props;

	return (
		<section className="flex flex-col gap-3">
			<SectionHeader title={title} />
			{children}
		</section>
	);
}

function DashboardStatCard(props: {
	icon: string;
	stats: Array<{ label: string; suffix?: string; value: number | undefined }>;
	title: string;
}) {
	const { icon, stats, title } = props;

	return (
		<Card.Root
			className="flex flex-col gap-5 rounded-[20px] bg-cedar-white p-5
				shadow-[0_1px_0_hsl(0,0%,0%,0.04)]"
		>
			<Card.Header
				className="inline-flex w-fit items-center gap-2 rounded-[8px] bg-cedar-yellow/16 p-2
					text-cedar-yellow lg:p-2.5"
			>
				<span className="size-4 lg:size-5">
					<IconBox icon={icon} className="size-full" />
				</span>
				<Card.Title className="text-base/[1.2] lg:text-[20px]">{title}</Card.Title>
			</Card.Header>

			<Card.Content className="grid grid-cols-3 justify-items-center gap-3">
				<For
					each={stats}
					renderItem={(stat) => (
						<div
							key={stat.label}
							className="flex h-[64px] w-full flex-col items-center justify-center gap-2
								rounded-[12px] bg-cedar-grey/24 p-2 text-center lg:h-[96px]"
						>
							<h3 className="text-[32px]/[1]">
								{formatNumber(stat.value)}
								{stat.suffix}
							</h3>
							<p className="text-[10px]/[1.2] text-cedar-black/64 lg:text-[12px]">{stat.label}</p>
						</div>
					)}
				/>
			</Card.Content>
		</Card.Root>
	);
}

function AlertsPanel() {
	const notificationsQueryResult = useQuery(
		dashboardNotificationsQuery({ limit: 20, page: 1, status: "active" })
	);

	const dismissNotificationMutation = useMutation(dismissDashboardNotificationMutation());

	const queryClient = useQueryClient();

	const onDismissNotification = (id: string) => {
		dismissNotificationMutation.mutate(id, {
			onSuccess: () => {
				void queryClient.invalidateQueries({ queryKey: dashboardNotificationsQuery().queryKey });
			},
		});
	};

	const notifications = notificationsQueryResult.data?.data ?? [];

	return (
		<Card.Root
			className="flex flex-col gap-5 rounded-[20px] bg-cedar-white p-4
				shadow-[0_1px_0_hsl(0,0%,0%,0.04)]"
		>
			<Card.Header
				className="flex items-center justify-center gap-3 rounded-[10px] bg-cedar-red px-8 py-3
					text-cedar-white lg:rounded-[12px]"
			>
				<span className="size-4 shrink-0 lg:size-5">
					<IconBox icon="lucide:bell" className="size-full" />
				</span>
				<Card.Title className="shrink-0 text-center text-base/[1.2] lg:text-[24px]">
					Alerts & Notifications
				</Card.Title>
			</Card.Header>

			<Card.Content>
				<ScrollArea.Root classNames={{ base: "h-[276px]", viewport: "overscroll-contain" }}>
					{notificationsQueryResult.isPending && (
						<ForWithWrapper
							className="flex flex-col gap-5"
							each={4}
							renderItem={(index) => (
								<li key={index} className="flex items-center gap-3">
									<Skeleton className="h-12 w-1 rounded-full" />
									<div className="flex grow flex-col gap-2">
										<Skeleton className="h-3 w-4/5" />
										<Skeleton className="h-2.5 w-3/5" />
									</div>
								</li>
							)}
						/>
					)}

					{!notificationsQueryResult.isPending && notifications.length === 0 && (
						<p className="py-8 text-center text-[12px] text-cedar-black/48">
							No active notifications.
						</p>
					)}

					<ForWithWrapper
						className="flex flex-col gap-5"
						each={notifications}
						renderItem={(notification) => (
							<li
								key={notification.id}
								className="grid grid-cols-[4px_1fr_24px] items-center gap-3"
							>
								<span
									className={cnJoin(
										"h-full min-h-10 rounded-full",
										notificationSeverityClassNames[notification.severity]
									)}
								/>

								<div className="flex min-w-0 flex-col gap-1">
									<p className="text-[12px]/[1.35] text-cedar-black lg:text-[14px]">
										{notification.title}
									</p>
									<p className="text-[10px]/[1.4] text-cedar-black/48 lg:text-[11px]">
										{notification.message} -{` `}
										{formatDistanceToNowStrict(new Date(notification.createdAt), {
											addSuffix: true,
										})}
									</p>
								</div>

								<Button
									unstyled={true}
									aria-label={`Dismiss ${notification.title}`}
									isDisabled={
										dismissNotificationMutation.isPending
										&& dismissNotificationMutation.variables === notification.id
									}
									className="grid size-6 place-content-center text-cedar-black transition-opacity
										hover:opacity-56"
									onClick={() => onDismissNotification(notification.id)}
								>
									<IconBox icon="lucide:x" className="size-5" />
								</Button>
							</li>
						)}
					/>
				</ScrollArea.Root>
			</Card.Content>
		</Card.Root>
	);
}

function ProjectCard(props: { project: DashboardProjectsQueryResult[number] }) {
	const { project } = props;
	const isCompleted = project.status === "completed";
	const projectStatusMutation = useMutation(dashboardProjectStatusMutation(project.id));
	const queryClient = useQueryClient();
	const projectDate =
		project.createdAt ?
			new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(
				new Date(project.createdAt)
			)
		:	EMPTY_VALUE_PLACEHOLDER;

	return (
		<Card.Root
			className="flex w-full flex-col gap-4 rounded-[12px] bg-cedar-white p-4
				shadow-[0_1px_0_hsl(0,0%,0%,0.04)] lg:flex-row lg:gap-5"
		>
			<Card.Header
				className="flex h-[144px] w-full shrink-0 items-center justify-center overflow-hidden
					rounded-[12px] bg-cedar-black/8 lg:max-w-[184px]"
			>
				{project.imageUrl ?
					<Image
						src={project.imageUrl}
						alt="Project Image"
						width={300}
						height={170}
						className="size-full object-cover"
					/>
				:	<IconBox icon="solar:gallery-outline" className="size-8 text-cedar-black/32" />}
			</Card.Header>

			<Card.Content className="flex flex-col justify-center">
				<Card.Title className="line-clamp-1 text-[20px]/[1.2]">{project.title}</Card.Title>

				<Card.Description className="mt-2 line-clamp-2 text-[12px]/[1.2] text-cedar-black/56">
					{project.description ?? "No project description has been added yet."}
				</Card.Description>

				<Card.Footer className="mt-6 flex items-center gap-4">
					<p className="shrink-0 text-[12px] text-cedar-black">{projectDate}</p>

					<div className="flex h-7 grow items-center rounded-[8px] bg-cedar-yellow/18">
						<Button
							unstyled={true}
							type="button"
							isDisabled={projectStatusMutation.isPending}
							className={cnMerge(
								`flex size-full items-center justify-center rounded-[8px] px-3 text-[14px]
								font-medium text-cedar-yellow`,
								!isCompleted && "bg-cedar-yellow text-cedar-white"
							)}
							onClick={() =>
								projectStatusMutation.mutate("ongoing", {
									onSuccess: () => {
										void queryClient.invalidateQueries({
											queryKey: dashboardProjectsQuery().queryKey,
										});
									},
								})
							}
						>
							Ongoing
						</Button>
						<Button
							unstyled={true}
							type="button"
							isDisabled={projectStatusMutation.isPending}
							className={cnMerge(
								`flex size-full items-center justify-center rounded-[8px] px-3 text-[14px]
								font-medium text-cedar-yellow`,
								isCompleted && "bg-cedar-black text-cedar-white"
							)}
							onClick={() =>
								projectStatusMutation.mutate("completed", {
									onSuccess: () => {
										void queryClient.invalidateQueries({
											queryKey: dashboardProjectsQuery().queryKey,
										});
									},
								})
							}
						>
							Completed
						</Button>
					</div>
				</Card.Footer>
			</Card.Content>
		</Card.Root>
	);
}

function DashboardChartCard(props: {
	className?: string;
	dataset: DashboardChartDataset | undefined;
	description: string;
	title: ChartTitles;
}) {
	const { className, dataset, description, title } = props;

	return (
		<Card.Root
			className={cnMerge(
				`flex w-full min-w-0 flex-col gap-3 rounded-[18px] bg-cedar-white p-4
				shadow-[0_1px_0_hsl(0,0%,0%,0.04)]`,
				className
			)}
		>
			<Card.Header className="flex flex-row items-start justify-between gap-3">
				<div className="flex flex-col gap-1">
					<Card.Title className="text-[13px]/[1.2] lg:text-[14px]">{title}</Card.Title>
					<Card.Description className="text-[10px] text-cedar-black/48">
						{description}
					</Card.Description>
				</div>
				<Badge className="border-0 bg-cedar-yellow/16 px-2 py-1 text-[9px] text-cedar-yellow">
					{chartScopesByTitle[title]}
				</Badge>
			</Card.Header>

			<Card.Content className="min-w-0 overflow-hidden">
				<ScrollArea.Root
					orientation="horizontal"
					classNames={{
						base: "w-full overflow-hidden",
						scrollbar: "h-1",
						thumb: "bg-cedar-grey",
						viewport: "w-full pb-3",
					}}
				>
					{renderChart({ dataset, title })}
				</ScrollArea.Root>
			</Card.Content>
		</Card.Root>
	);
}

const chartColorGroups = {
	black: ["var(--color-cedar-black)"],
	blackRedYellow: ["var(--color-cedar-black)", "var(--color-cedar-red)", "var(--color-cedar-yellow)"],
	default: ["var(--color-cedar-yellow)", "var(--color-cedar-red)", "var(--color-cedar-black)"],
	pie: ["var(--color-cedar-yellow)", "var(--color-cedar-red)"],
	preMidPost: ["var(--color-cedar-black)", "var(--color-cedar-red)", "var(--color-cedar-yellow)"],
	red: ["var(--color-cedar-red)"],
	redBlack: ["var(--color-cedar-red)", "var(--color-cedar-black)"],
	redYellow: ["var(--color-cedar-red)", "var(--color-cedar-yellow)"],
	single: ["var(--color-cedar-yellow)"],
	yellowRed: ["var(--color-cedar-yellow)", "var(--color-cedar-red)"],
} as const;

const chartColorsByTitle = {
	"Application Numbers Over Time": chartColorGroups.redYellow,
	"At-risk vs Low-risk Students": chartColorGroups.pie,
	"Attendance Trend - Monthly Sessions": chartColorGroups.red,
	"Average Mentorship Hours": chartColorGroups.red,
	"Average Spend per Student": chartColorGroups.blackRedYellow,
	"Class/Age Distribution": chartColorGroups.black,
	"Dropout Trend - Monthly": ["hsl(350, 43%, 56%)"],
	"Gender Diversity": chartColorGroups.redBlack,
	"Graduation Rate Trend": chartColorGroups.yellowRed,
	"Pre/Mid/Post-test Scores by Term": chartColorGroups.blackRedYellow,
	"Students Meeting Benchmark": [
		"hsl(351, 96%, 30%, 0.48)",
		"hsl(351, 96%, 30%, 0.64)",
		"hsl(351, 96%, 30%, 0.8)",
	],
	"TACOTS Mid-term & End-of-term Scores": chartColorGroups.redYellow,
	"Total Community Service Hours": chartColorGroups.redYellow,
} as const satisfies Partial<Record<ChartTitles, readonly string[]>>;

const CHART_BAR_RADIUS: RectRadius = [6, 6, 0, 0];

const COMMUNITY_SERVICE_LINE_DOT = { fill: "var(--color-cedar-red)", r: 4 } as const;

const DEFAULT_CHART_LEGEND_CONTENT = <Chart.LegendContent />;

const DEFAULT_CHART_TOOLTIP_CONTENT = <Chart.TooltipContent />;

const GENDER_DIVERSITY_CHART_CONFIG = {
	value: { color: "var(--color-cedar-red)", label: "Gender diversity" },
} satisfies Chart.ChartConfig;

const HIDDEN_LABEL_CHART_TOOLTIP_CONTENT = <Chart.TooltipContent hideLabel={true} />;

const MENTORSHIP_AREA_DOT = { fill: "var(--color-cedar-red)", r: 4 } as const;

const RISK_CHART_CONFIG = {
	value: { color: "var(--color-cedar-yellow)", label: "Risk split" },
} satisfies Chart.ChartConfig;

const MENTORSHIP_TOOLTIP_CONTENT = (
	<Chart.TooltipContent
		formatter={(value, name) => (
			<>
				<span className="text-shadcn-muted-foreground">{String(name)}</span>
				<span className="ml-auto font-mono font-medium tabular-nums">{String(value)} hr</span>
			</>
		)}
	/>
);

function renderChart(props: { dataset: DashboardChartDataset | undefined; title: ChartTitles }) {
	const { dataset, title } = props;

	if (!dataset) {
		return <Skeleton className="mt-4 h-[220px] rounded-[14px] bg-cedar-grey" />;
	}

	const colors = chartColorsByTitle[title as keyof typeof chartColorsByTitle];

	const chartData = dataset.labels.map((label, labelIndex) => {
		const dataPoint: Record<string, number | string | null> = { label };

		if (dataset.datasets.length === 1) {
			dataPoint.fill = getSeriesColor({ colors, index: labelIndex, label, title });
		}

		for (const [dataItemIndex, dataItem] of dataset.datasets.entries()) {
			dataPoint[dataItem.label ?? `value-${dataItemIndex}`] = dataItem.data[labelIndex] ?? null;
		}

		return dataPoint;
	});

	const config = Object.fromEntries(
		dataset.datasets.map((dataItem, index) => [
			dataItem.label ?? `value-${index}`,
			{
				color: getSeriesColor({ colors, index, label: dataItem.label, title }),
				label: dataItem.label ?? `Series ${index + 1}`,
			},
		])
	);

	if (title === "At-risk vs Low-risk Students") {
		const riskData = dataset.labels.map((label, index) => ({
			fill:
				label.toLowerCase().includes("low") ? "var(--color-cedar-yellow)" : "var(--color-cedar-red)",
			label,
			value: dataset.datasets[0]?.data[index] ?? 0,
		}));

		const totalAmount = riskData.reduce((total, item) => total + item.value, 0);

		return (
			<article className="flex min-h-[160px] w-full items-center justify-between gap-4">
				<ForWithWrapper
					each={riskData}
					className="flex flex-col gap-2"
					renderItem={(item) => (
						<li key={item.label} className="grid grid-cols-[14px_1fr_auto] items-center gap-3">
							<span className="size-3.5 rounded-[3px]" style={{ backgroundColor: item.fill }} />
							<span className="text-[14px]/[1.2] text-cedar-black/56">{item.label}</span>
							<span className="text-[12px]/[1.2] font-semibold" style={{ color: item.fill }}>
								{formatNumber(item.value)} ({formatPercent(item.value, totalAmount)})
							</span>
						</li>
					)}
				/>

				<Chart.Container config={RISK_CHART_CONFIG} className="h-[150px] w-[170px] shrink-0">
					<PieChart>
						<Pie
							data={riskData}
							dataKey="value"
							nameKey="label"
							innerRadius={48}
							outerRadius={76}
							cornerRadius={10}
							paddingAngle={4}
							stroke="transparent"
						/>
					</PieChart>
				</Chart.Container>
			</article>
		);
	}

	if (title === "Gender Diversity") {
		const genderData = dataset.labels.map((label, index) => ({
			fill:
				label.toLowerCase().includes("female") ? "var(--color-cedar-red)" : "var(--color-cedar-black)",
			label,
			value: dataset.datasets[0]?.data[index] ?? 0,
		}));
		const totalAmount = genderData.reduce((total, item) => total + item.value, 0);

		return (
			<article className="flex min-h-[178px] w-full items-center justify-between gap-6">
				<ForWithWrapper
					each={genderData}
					className="flex flex-col gap-2"
					renderItem={(item) => (
						<li key={item.label} className="grid grid-cols-[14px_1fr_36px] items-center gap-2">
							<span className="size-3 rounded-[3px]" style={{ backgroundColor: item.fill }} />
							<span className="text-[14px] text-cedar-black/56">{item.label}</span>
							<span className="text-[12px] font-medium text-cedar-red">
								{formatPercent(item.value, totalAmount)}
							</span>
						</li>
					)}
				/>

				<Chart.Container
					config={GENDER_DIVERSITY_CHART_CONFIG}
					className="h-[150px] w-[180px] shrink-0"
				>
					<PieChart>
						<Pie data={genderData} dataKey="value" nameKey="label" />
					</PieChart>
				</Chart.Container>
			</article>
		);
	}

	const pieData = toPieData(dataset, colors);

	if (title === "Total Community Service Hours") {
		const totalDatasetIndex = dataset.datasets.findIndex((dataItem) => !isAverageSeries(dataItem.label));
		const averageDatasetIndex = dataset.datasets.findIndex((dataItem) =>
			isAverageSeries(dataItem.label)
		);
		const totalDataset = dataset.datasets[totalDatasetIndex] ?? dataset.datasets[0];
		const averageDataset = dataset.datasets[averageDatasetIndex] ?? dataset.datasets[1];

		const barKey = totalDataset?.label ?? `value-${Math.max(totalDatasetIndex, 0)}`;
		const lineKey = averageDataset?.label ?? `value-${Math.max(averageDatasetIndex, 1)}`;

		const barColor = "var(--color-cedar-yellow)";
		const lineColor = "var(--color-cedar-red)";

		const communityServiceConfig = {
			...config,
			[barKey]: { color: barColor, label: "Total services hrs (all students)" },
			[lineKey]: { color: lineColor, label: "Average per student" },
		} satisfies Chart.ChartConfig;

		return (
			<Chart.Container config={communityServiceConfig} className="h-[260px] w-[520px]">
				<ComposedChart data={chartData}>
					<CartesianGrid vertical={true} strokeDasharray="3 3" />
					<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
					<YAxis
						yAxisId="hours"
						tickFormatter={(value: string) => `${value}h`}
						tickLine={false}
						axisLine={false}
						width={36}
					/>
					<YAxis
						yAxisId="average"
						orientation="right"
						tickFormatter={(value: string) => `${value}h/s`}
						tickLine={false}
						axisLine={false}
						width={42}
					/>
					<Chart.Tooltip content={DEFAULT_CHART_TOOLTIP_CONTENT} />
					<Chart.Legend content={DEFAULT_CHART_LEGEND_CONTENT} verticalAlign="top" align="right" />
					<Bar
						yAxisId="hours"
						dataKey={barKey}
						fill={barColor}
						radius={CHART_BAR_RADIUS}
						shape={CommunityServiceBarShape}
					/>
					{averageDataset && (
						<Line
							yAxisId="average"
							type="monotone"
							dataKey={lineKey}
							stroke={lineColor}
							strokeWidth={2}
							dot={COMMUNITY_SERVICE_LINE_DOT}
						/>
					)}
				</ComposedChart>
			</Chart.Container>
		);
	}

	if (title === "Average Mentorship Hours") {
		const [dataItem] = dataset.datasets;
		const dataKey = dataItem?.label ?? "value-0";
		const color = colors[0];

		return (
			<Chart.Container config={config} className="h-[220px] w-[520px] lg:h-[240px]">
				<AreaChart data={chartData}>
					<CartesianGrid vertical={true} strokeDasharray="3 3" />
					<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
					<YAxis
						tickFormatter={(value) => `${String(value)} hr`}
						tickLine={false}
						axisLine={false}
						width={44}
					/>
					<Chart.Tooltip content={MENTORSHIP_TOOLTIP_CONTENT} />
					<Area
						type="monotone"
						dataKey={dataKey}
						stroke={color}
						strokeWidth={2}
						fill={color}
						fillOpacity={0.16}
						dot={MENTORSHIP_AREA_DOT}
					/>
				</AreaChart>
			</Chart.Container>
		);
	}

	if (title === "TACOTS Mid-term & End-of-term Scores") {
		return (
			<Chart.Container config={config} className="h-[220px] w-[520px] lg:h-[240px]">
				<BarChart data={chartData}>
					<CartesianGrid vertical={true} strokeDasharray="3 3" />
					<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
					<YAxis
						domain={[0, 100]}
						tickFormatter={(value: string) => `${value}%`}
						tickLine={false}
						axisLine={false}
						width={36}
					/>
					<Chart.Tooltip content={DEFAULT_CHART_TOOLTIP_CONTENT} />
					<Chart.Legend content={DEFAULT_CHART_LEGEND_CONTENT} verticalAlign="top" align="right" />
					<For
						each={dataset.datasets}
						renderItem={(dataItem, index) => (
							<Bar
								key={dataItem.label ?? index}
								dataKey={dataItem.label ?? `value-${index}`}
								fill={getSeriesColor({
									colors,
									index,
									label: dataItem.label,
									title: "TACOTS Mid-term & End-of-term Scores",
								})}
								radius={CHART_BAR_RADIUS}
							/>
						)}
					/>
				</BarChart>
			</Chart.Container>
		);
	}

	const width = (() => {
		if (title === "Average Spend per Student") {
			return 52;
		}
		if (title === "Pre/Mid/Post-test Scores by Term") {
			return 36;
		}
		return 30;
	})();

	return (
		<Chart.Container config={config} className="h-[220px] w-[520px] lg:h-[240px]">
			{dataset.type === "bar" && (
				<BarChart data={chartData}>
					<CartesianGrid vertical={false} strokeDasharray="3 3" />
					<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
					<YAxis
						tickFormatter={
							title === "Pre/Mid/Post-test Scores by Term" ?
								(value) => `${String(value)}%`
							:	undefined
						}
						tickLine={false}
						axisLine={false}
						width={width}
					/>
					<Chart.Tooltip content={DEFAULT_CHART_TOOLTIP_CONTENT} />
					<For
						each={dataset.datasets}
						renderItem={(dataItem, index) => (
							<Bar
								key={dataItem.label ?? index}
								dataKey={dataItem.label ?? `value-${index}`}
								fill={getSeriesColor({ colors, index, label: dataItem.label, title })}
								radius={CHART_BAR_RADIUS}
								shape={dataset.datasets.length === 1 ? ChartBarShape : undefined}
							/>
						)}
					/>
					{dataset.datasets.length > 1 && (
						<Chart.Legend
							content={DEFAULT_CHART_LEGEND_CONTENT}
							verticalAlign="top"
							align="right"
							iconType="square"
						/>
					)}
				</BarChart>
			)}

			{dataset.type === "line" && (
				<LineChart data={chartData}>
					<CartesianGrid vertical={false} strokeDasharray="3 3" />
					<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
					<YAxis tickLine={false} axisLine={false} width={30} />
					<Chart.Tooltip content={DEFAULT_CHART_TOOLTIP_CONTENT} />
					<For
						each={dataset.datasets}
						renderItem={(dataItem, index) => (
							<Line
								key={dataItem.label ?? index}
								type="monotone"
								dataKey={dataItem.label ?? `value-${index}`}
								stroke={getSeriesColor({ colors, index, label: dataItem.label, title })}
								strokeWidth={2}
								dot={false}
							/>
						)}
					/>
					{dataset.datasets.length > 1 && (
						<Chart.Legend
							content={DEFAULT_CHART_LEGEND_CONTENT}
							verticalAlign="top"
							align="right"
							iconType="plainline"
						/>
					)}
				</LineChart>
			)}

			{(dataset.type === "pie" || dataset.type === "doughnut") && (
				<PieChart>
					<Chart.Tooltip content={HIDDEN_LABEL_CHART_TOOLTIP_CONTENT} />
					<Pie
						data={pieData}
						dataKey="value"
						nameKey="label"
						innerRadius={dataset.type === "doughnut" ? 54 : 0}
						outerRadius={86}
						cornerRadius={dataset.type === "doughnut" ? 8 : 0}
						paddingAngle={dataset.type === "doughnut" ? 3 : 0}
						stroke="transparent"
					/>
				</PieChart>
			)}
		</Chart.Container>
	);
}

function CommunityServiceBarShape(props: BarShapeProps) {
	return <Rectangle {...props} fill="var(--color-cedar-yellow)" radius={CHART_BAR_RADIUS} />;
}

function isAverageSeries(label: string | undefined) {
	const normalizedLabel = label?.toLowerCase() ?? "";

	return normalizedLabel.includes("avg") || normalizedLabel.includes("average");
}

function ChartBarShape(props: BarShapeProps) {
	const payload = props.payload as { fill?: string } | undefined;

	return <Rectangle {...props} fill={payload?.fill ?? props.fill} radius={CHART_BAR_RADIUS} />;
}

function LineDataCard(props: {
	description: string;
	items: DashboardLineData | undefined;
	title: ChartTitles;
	variant?: "programmes";
}) {
	const { description, items, title, variant } = props;

	const maxAmount = Math.max(...(items ?? []).map((item) => item.amount), 1);

	return (
		<Card.Root
			className="flex w-full min-w-0 flex-col gap-3 rounded-[18px] bg-cedar-white p-4
				shadow-[0_1px_0_hsl(0,0%,0%,0.04)]"
		>
			<Card.Header className="flex flex-row items-start justify-between gap-3">
				<div>
					<Card.Title className="text-[13px]/[1.2] lg:text-[14px]">{title}</Card.Title>
					<Card.Description className="mt-1 text-[10px] text-cedar-black/48">
						{description}
					</Card.Description>
				</div>
				<Badge className="border-0 bg-cedar-yellow/16 px-2 py-1 text-[9px] text-cedar-yellow">
					{chartScopesByTitle[title]}
				</Badge>
			</Card.Header>

			<Card.Content>
				<ForWithWrapper
					className="mt-5 flex flex-col gap-3"
					each={items ?? []}
					renderItem={(item, index) => (
						<li key={item.title} className="grid grid-cols-[76px_1fr_36px] items-center gap-3">
							<p className="text-[10px] text-cedar-black/64">{item.title}</p>
							<ProgressAnimated.Root
								value={Math.max((item.amount / maxAmount) * 100, 4)}
								classNames={{
									base:
										variant === "programmes" ?
											getProgrammeBarTrackClassName(index)
										:	"bg-cedar-red/12",
									indicator:
										variant === "programmes" ? getProgrammeBarClassName(index) : "bg-cedar-red",
								}}
							/>
							<p className="text-right text-[11px] font-medium">
								{formatNumber(item.amount)}
								{title === "Acceptance Rate - by Programme" && "%"}
								{title === "Total Accumulated Mentorship Hours" && " hr"}
							</p>
						</li>
					)}
				/>
			</Card.Content>
		</Card.Root>
	);
}

function getProgrammeBarClassName(index: number) {
	return [tw`bg-cedar-red`, tw`bg-cedar-yellow`, tw`bg-cedar-black`][index] ?? tw`bg-cedar-red`;
}

function getProgrammeBarTrackClassName(index: number) {
	return (
		[tw`bg-cedar-red/12`, tw`bg-cedar-yellow/16`, tw`bg-cedar-black/12`][index] ?? tw`bg-cedar-red/12`
	);
}

function toPieData(dataset: DashboardChartDataset, colors: readonly string[]) {
	const firstDataSet = dataset.datasets[0];

	return dataset.labels.map((label, index) => ({
		fill: colors[index % colors.length] ?? chartColorGroups.default[0],
		label,
		value: firstDataSet?.data[index] ?? 0,
	}));
}

function getSeriesColor(context: {
	colors: readonly string[];
	index: number;
	label?: string;
	title?: string;
}) {
	const { colors, index, label, title } = context;
	const normalizedLabel = label?.toLowerCase();

	if (title === "Graduation Rate Trend" && normalizedLabel?.includes("drop")) {
		return "var(--color-cedar-red)";
	}

	if (title === "Graduation Rate Trend" && normalizedLabel?.includes("graduat")) {
		return "var(--color-cedar-yellow)";
	}

	if (title === "Pre/Mid/Post-test Scores by Term" && normalizedLabel?.includes("pre")) {
		return "var(--color-cedar-red)";
	}

	if (title === "Pre/Mid/Post-test Scores by Term" && normalizedLabel?.includes("mid")) {
		return "var(--color-cedar-yellow)";
	}

	if (title === "Pre/Mid/Post-test Scores by Term" && normalizedLabel?.includes("post")) {
		return "var(--color-cedar-black)";
	}

	if (title === "TACOTS Mid-term & End-of-term Scores" && normalizedLabel?.includes("mid")) {
		return "var(--color-cedar-red)";
	}

	if (title === "TACOTS Mid-term & End-of-term Scores" && normalizedLabel?.includes("end")) {
		return "var(--color-cedar-yellow)";
	}

	if (title === "Average Spend per Student" && normalizedLabel?.includes("tuition")) {
		return "var(--color-cedar-black)";
	}

	if (title === "Average Spend per Student" && normalizedLabel?.includes("resource")) {
		return "var(--color-cedar-red)";
	}

	if (title === "Average Spend per Student" && normalizedLabel?.includes("sundr")) {
		return "var(--color-cedar-yellow)";
	}

	return colors[index % colors.length] ?? chartColorGroups.default[0];
}

const formatNumber = (value: number | undefined) => {
	return value == null || Number.isNaN(value) ?
			EMPTY_VALUE_PLACEHOLDER
		:	Math.round(value).toLocaleString();
};

const formatPercent = (value: number, total: number) => {
	return `${total === 0 ? "0" : Math.round((value / total) * 100)}%`;
};
