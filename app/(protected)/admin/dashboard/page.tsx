"use client";

import { useQuery } from "@tanstack/react-query";
import { tw } from "@zayne-labs/toolkit-core";
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
	Sector,
	XAxis,
	YAxis,
	type BarShapeProps,
	type PieSectorDataItem,
} from "recharts";
import { For, ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Carousel, Chart, Skeleton } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DashboardChartDataset, DashboardLineData } from "@/lib/api/callBackendApi/apiSchema";
import {
	dashboardCardsQuery,
	dashboardEnrollmentQuery,
	dashboardInstitutionalEffectivenessQuery,
	dashboardProjectsQuery,
	dashboardStudentPerformanceQuery,
} from "@/lib/react-query/queryOptions";
import { cnJoin, cnMerge } from "@/lib/utils/cn";
import { Main } from "./-components/Main";

const chartColorGroups = {
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
	"Class/Age Distribution": chartColorGroups.single,
	"Dropout Trend - Monthly": chartColorGroups.single,
	"Gender Diversity": chartColorGroups.redBlack,
	"Graduation Rate Trend": chartColorGroups.yellowRed,
	"Pre/Mid/Post-test Scores by Term": chartColorGroups.blackRedYellow,
	"Students Meeting Benchmark": ["hsl(350, 43%, 68%)", "hsl(350, 43%, 56%)", "var(--color-cedar-red)"],
	"Total Community Service Hours": chartColorGroups.redYellow,
	"Total Spend per TACOTS Student": chartColorGroups.blackRedYellow,
} as const satisfies Record<string, readonly string[]>;

const chartScopesByTitle = {
	"Application Numbers Over Time": "ASH + TACOTS",
	"At-risk vs Low-risk Students": "ASH",
	"Attendance Trend - Monthly Sessions": "ASH",
	"Average Mentorship Hours": "TACOTS",
	"Class/Age Distribution": "ASH",
	"Dropout Trend - Monthly": "ASH",
	"Gender Diversity": "ASH + TACOTS",
	"Geographic Distribution - Top States": "ASH",
	"Graduation Rate Trend": "ASH",
	"Pre/Mid/Post-test Scores by Term": "ASH",
	"Students Meeting Benchmark": "TACOTS",
	"Total Accumulated Mentorship Hours": "TACOTS",
	"Total Community Service Hours": "TACOTS",
	"Total Spend per TACOTS Student": "TACOTS",
} as const satisfies Record<string, "ASH" | "ASH + TACOTS" | "TACOTS">;

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
		<Main>
			<div className="flex flex-col gap-6 lg:gap-8">
				<section className="grid gap-4 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_330px]">
					<div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
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
					</div>

					<AlertsPanel />
				</section>

				<section className="flex flex-col gap-3">
					<SectionHeader
						title="Ongoing Projects"
						description={`${projectsQueryResult.data?.length ?? 0} active community initiatives`}
						action="View more"
					/>

					<Carousel.Root options={{ align: "start", loop: false }}>
						<Carousel.Content className="-mr-3 gap-3 select-none lg:-mr-5 lg:gap-5">
							<For
								each={(projectsQueryResult.data ?? []).slice(0, 2)}
								renderItem={(project, index, array) => (
									<Carousel.Item
										key={project.id}
										className={cnJoin(
											"w-1/2 cursor-grab active:cursor-grabbing lg:w-full lg:max-w-[528px]",
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
					<div className="flex w-full flex-col gap-3 lg:flex-row">
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
					</div>

					<DashboardChartCard
						title="Pre/Mid/Post-test Scores by Term"
						description="Average test performance by term"
						dataset={studentPerformance?.c_testScores}
					/>

					<div className="flex w-full flex-col gap-3 lg:flex-row">
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
					</div>
				</MetricsSection>

				<MetricsSection title="Enrollment & Recruitment">
					<DashboardChartCard
						title="Application Numbers Over Time"
						description="ASH and TACOTS application trend"
						dataset={enrollment?.c_applicationNumbers}
					/>
					<div className="flex w-full flex-col gap-3 lg:flex-row">
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
					</div>
					<div className="flex w-full flex-col gap-3 lg:flex-row">
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
					</div>
				</MetricsSection>

				<MetricsSection title="Institutional Effectiveness">
					<DashboardChartCard
						title="Total Community Service Hours"
						description="Community service hours (TACOTS)"
						dataset={institutionalEffectiveness?.c_communityServiceHours}
					/>
					<div className="flex w-full flex-col gap-3 lg:flex-row">
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
					</div>
					<div className="flex w-full flex-col gap-3 lg:flex-row">
						<DashboardChartCard
							title="Students Meeting Benchmark"
							description="Academic benchmark progress"
							dataset={institutionalEffectiveness?.c_studentBenchMark}
						/>
						<DashboardChartCard
							title="Total Spend per TACOTS Student"
							description="Average programme spend by category"
							dataset={institutionalEffectiveness?.c_spendPerstudent}
						/>
					</div>
				</MetricsSection>
			</div>
		</Main>
	);
}

export default DashboardPage;

function SectionHeader(props: { action?: string; description?: string; title: string }) {
	const { action, description, title } = props;

	return (
		<header className="flex items-center justify-between gap-4">
			<div>
				<h2 className="text-[20px]/[1.2] lg:text-[24px]">{title}</h2>
				{description && <p className="mt-1 text-[11px] text-cedar-black/56">{description}</p>}
			</div>

			{action && (
				<Button
					unstyled={true}
					type="button"
					className="rounded-full border border-cedar-black/10 bg-cedar-white px-4 py-2 text-[11px]
						font-medium transition-colors hover:bg-cedar-black hover:text-cedar-white"
				>
					{action}
				</Button>
			)}
		</header>
	);
}

function MetricsSection(props: { children: React.ReactNode; title: string }) {
	const { children, title } = props;

	return (
		<section className="flex flex-col gap-3">
			<SectionHeader title={title} />
			<div className="flex flex-col gap-3">{children}</div>
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
		<article className="rounded-[20px] bg-cedar-white p-4 shadow-[0_1px_0_hsl(0,0%,0%,0.04)]">
			<header
				className="mb-5 inline-flex items-center gap-2 rounded-[8px] bg-cedar-yellow/20 px-2.5 py-1
					text-cedar-yellow"
			>
				<IconBox icon={icon} className="size-4" />
				<h3 className="text-[13px]/[1.2]">{title}</h3>
			</header>

			<ForWithWrapper
				className="grid grid-cols-3 gap-x-4 gap-y-5"
				each={stats}
				renderItem={(stat) => (
					<li key={stat.label} className="">
						<p className="text-[22px]/[1] font-medium tracking-tight">
							{formatNumber(stat.value)}
							{stat.suffix}
						</p>
						<p className="mt-1 text-[9px]/[1.2] text-cedar-black/48">{stat.label}</p>
					</li>
				)}
			/>
		</article>
	);
}

function AlertsPanel() {
	const alerts = [
		"3 students flagged for dropout risk in ASH cohort 7",
		"Low mentorship engagement in TACOTS zone B",
		"ASH impact report is ready for review",
		"Capacity building partner update due this week",
	];

	return (
		<article className="rounded-[20px] bg-cedar-white p-4 shadow-[0_1px_0_hsl(0,0%,0%,0.04)]">
			<header className="rounded-[14px] bg-cedar-red px-4 py-3 text-cedar-white">
				<h3 className="text-center text-[14px]/[1.2]">Alerts & Notifications</h3>
			</header>

			<ForWithWrapper
				className="mt-4 flex flex-col gap-3"
				each={alerts}
				renderItem={(alert, index) => (
					<li
						key={alert}
						className="border-b border-dashed border-cedar-black/10 pb-3 last:border-b-0"
					>
						<p className="text-[11px]/[1.35] text-cedar-black">{alert}</p>
						<p className="mt-1 text-[9px] text-cedar-black/40">
							{index + 1} day{index === 0 ? "" : "s"} ago
						</p>
					</li>
				)}
			/>
		</article>
	);
}

function ProjectCard(props: {
	project: {
		description?: string | null;
		id: string;
		imageUrl?: string | null;
		status: string;
		title: string;
	};
}) {
	const { project } = props;

	return (
		<article
			className="flex w-full gap-3 rounded-[18px] bg-cedar-white p-3 shadow-[0_1px_0_hsl(0,0%,0%,0.04)]"
		>
			<div
				className="grid h-[92px] w-[120px] shrink-0 place-content-center overflow-hidden rounded-[12px]
					bg-cedar-black/8"
			>
				{project.imageUrl ?
					<Image
						src={project.imageUrl}
						alt=""
						width={120}
						height={92}
						className="size-full object-cover"
					/>
				:	<IconBox icon="solar:gallery-outline" className="size-8 text-cedar-black/32" />}
			</div>

			<div className="flex grow flex-col">
				<h3 className="truncate text-[13px]/[1.2]">{project.title}</h3>
				<p className="mt-1 line-clamp-2 text-[10px]/[1.5] text-cedar-black/56">
					{project.description ?? "No project description has been added yet."}
				</p>

				<div className="mt-auto flex items-center gap-2">
					<p className="text-[9px] text-cedar-black/56">Dec 2025</p>
					<Badge
						className={cnJoin(
							"border-0 px-2 py-1 text-[9px] capitalize",
							project.status === "completed" ? "bg-cedar-black text-cedar-white" : "bg-cedar-yellow"
						)}
					>
						{project.status}
					</Badge>
				</div>
			</div>
		</article>
	);
}

function DashboardChartCard(props: {
	className?: string;
	dataset: DashboardChartDataset | undefined;
	description: string;
	title: string;
}) {
	const { className, dataset, description, title } = props;

	return (
		<article
			className={cnMerge(
				"w-full rounded-[18px] bg-cedar-white p-4 shadow-[0_1px_0_hsl(0,0%,0%,0.04)]",
				className
			)}
		>
			<header className="mb-3 flex items-start justify-between gap-3">
				<div>
					<h3 className="text-[13px]/[1.2] lg:text-[14px]">{title}</h3>
					<p className="mt-1 text-[10px] text-cedar-black/48">{description}</p>
				</div>
				<Badge className="border-0 bg-cedar-yellow/16 px-2 py-1 text-[9px] text-cedar-yellow">
					{getChartScope(title)}
				</Badge>
			</header>

			{renderChartContent({ dataset, title })}
		</article>
	);
}

function renderChartContent(props: { dataset: DashboardChartDataset | undefined; title: string }) {
	const { dataset, title } = props;

	if (!dataset) {
		return <Skeleton className="mt-4 h-[220px] rounded-[14px] bg-cedar-grey" />;
	}

	if (title === "Gender Diversity") {
		return <GenderDiversityChart dataset={dataset} />;
	}

	return renderChart(dataset, title);
}

function GenderDiversityChart(props: { dataset: DashboardChartDataset }) {
	const { dataset } = props;
	const colors = ["var(--color-cedar-red)", "var(--color-cedar-black)"];
	const pieData = toPieData(dataset, colors);
	const totalAmount = pieData.reduce((total, item) => total + item.value, 0);

	return (
		<div className="flex min-h-[178px] w-full items-center justify-between gap-6">
			<div className="min-w-[128px]">
				<Badge className="mb-5 border-0 bg-cedar-yellow/16 px-3 py-1 text-[10px] text-cedar-yellow">
					ash student + tacots recommendation
				</Badge>

				<ul className="flex flex-col gap-2">
					{pieData.map((item) => (
						<li key={item.label} className="grid grid-cols-[14px_1fr_36px] items-center gap-2">
							<span className="size-3 rounded-[3px]" style={{ backgroundColor: item.fill }} />
							<span className="text-[14px] text-cedar-black/56">{item.label}</span>
							<span className="text-[12px] font-medium text-cedar-red">
								{formatPercent(item.value, totalAmount)}
							</span>
						</li>
					))}
				</ul>
			</div>

			<Chart.Container
				config={{ value: { color: colors[0], label: "Gender diversity" } }}
				className="h-[150px] w-[180px] shrink-0"
			>
				<PieChart>
					<Pie
						data={pieData}
						dataKey="value"
						nameKey="label"
						outerRadius={70}
						shape={ChartPieShape}
						stroke="transparent"
					/>
				</PieChart>
			</Chart.Container>
		</div>
	);
}

function renderChart(dataset: DashboardChartDataset, title: string) {
	const colors = getChartColors(title);
	const chartData = toChartData(dataset, colors);
	const config = toChartConfig(dataset, colors, title);
	const pieData = toPieData(dataset, colors);

	if (title === "Total Community Service Hours") {
		return renderCommunityServiceChart({ chartData, config, dataset });
	}

	if (title === "Average Mentorship Hours") {
		return renderMentorshipAreaChart({ chartData, colors, config, dataset });
	}

	return (
		<Chart.Container config={config} className="h-[220px] w-[520px] max-w-none lg:h-[240px] lg:w-full">
			{dataset.type === "bar" && (
				<BarChart data={chartData}>
					<CartesianGrid vertical={false} strokeDasharray="3 3" />
					<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
					<YAxis tickLine={false} axisLine={false} width={30} />
					<Chart.Tooltip content={<Chart.TooltipContent />} />
					<For
						each={dataset.datasets}
						renderItem={(dataItem, index) => (
							<Bar
								key={dataItem.label ?? index}
								dataKey={dataItem.label ?? `value-${index}`}
								fill={getSeriesColor({ colors, index, label: dataItem.label, title })}
								radius={[6, 6, 0, 0]}
								shape={dataset.datasets.length === 1 ? ChartBarShape : undefined}
							/>
						)}
					/>
					{dataset.datasets.length > 1 && (
						<Chart.Legend
							content={<Chart.LegendContent />}
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
					<Chart.Tooltip content={<Chart.TooltipContent />} />
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
							content={<Chart.LegendContent />}
							verticalAlign="top"
							align="right"
							iconType="plainline"
						/>
					)}
				</LineChart>
			)}

			{(dataset.type === "pie" || dataset.type === "doughnut") && (
				<PieChart>
					<Chart.Tooltip content={<Chart.TooltipContent hideLabel={true} />} />
					<Pie
						data={pieData}
						dataKey="value"
						nameKey="label"
						innerRadius={dataset.type === "doughnut" ? 54 : 0}
						outerRadius={86}
						shape={ChartPieShape}
						stroke="transparent"
					/>
				</PieChart>
			)}
		</Chart.Container>
	);
}

function renderCommunityServiceChart(props: {
	chartData: Array<Record<string, number | string>>;
	config: Chart.ChartConfig;
	dataset: DashboardChartDataset;
}) {
	const { chartData, config, dataset } = props;

	const totalDatasetIndex = dataset.datasets.findIndex((dataItem) => !isAverageSeries(dataItem.label));
	const averageDatasetIndex = dataset.datasets.findIndex((dataItem) => isAverageSeries(dataItem.label));
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
		<Chart.Container
			config={communityServiceConfig}
			className="h-[260px] w-[760px] max-w-none lg:w-full"
		>
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
				<Chart.Tooltip content={<Chart.TooltipContent />} />
				<Chart.Legend content={<Chart.LegendContent />} verticalAlign="top" align="right" />
				<Bar
					yAxisId="hours"
					dataKey={barKey}
					fill={barColor}
					radius={[6, 6, 0, 0]}
					shape={CommunityServiceBarShape}
				/>
				{averageDataset && (
					<Line
						yAxisId="average"
						type="monotone"
						dataKey={lineKey}
						stroke={lineColor}
						strokeWidth={2}
						dot={{ fill: lineColor, r: 4 }}
					/>
				)}
			</ComposedChart>
		</Chart.Container>
	);
}

function CommunityServiceBarShape(props: BarShapeProps) {
	return <Rectangle {...props} fill="var(--color-cedar-yellow)" radius={[6, 6, 0, 0]} />;
}

function isAverageSeries(label: string | undefined) {
	const normalizedLabel = label?.toLowerCase() ?? "";

	return normalizedLabel.includes("avg") || normalizedLabel.includes("average");
}

function renderMentorshipAreaChart(props: {
	chartData: Array<Record<string, number | string>>;
	colors: readonly string[];
	config: Chart.ChartConfig;
	dataset: DashboardChartDataset;
}) {
	const { chartData, colors, config, dataset } = props;

	const [dataItem] = dataset.datasets;
	const dataKey = dataItem?.label ?? "value-0";
	const color = colors[0] ?? "var(--color-cedar-red)";

	return (
		<Chart.Container config={config} className="h-[220px] w-[520px] max-w-none lg:h-[240px] lg:w-full">
			<AreaChart data={chartData}>
				<CartesianGrid vertical={true} strokeDasharray="3 3" />
				<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
				<YAxis tickLine={false} axisLine={false} width={30} />
				<Chart.Tooltip content={<Chart.TooltipContent />} />
				<Area
					type="monotone"
					dataKey={dataKey}
					stroke={color}
					strokeWidth={2}
					fill={color}
					fillOpacity={0.16}
					dot={{ fill: color, r: 4 }}
				/>
			</AreaChart>
		</Chart.Container>
	);
}

function ChartBarShape(props: BarShapeProps) {
	const payload = props.payload as { fill?: string } | undefined;

	return <Rectangle {...props} fill={payload?.fill ?? props.fill} radius={[6, 6, 0, 0]} />;
}

function ChartPieShape(props: PieSectorDataItem) {
	const payload = props.payload as { fill?: string } | undefined;

	return <Sector {...props} fill={payload?.fill ?? props.fill} />;
}

function LineDataCard(props: {
	description: string;
	items: DashboardLineData | undefined;
	title: string;
	variant?: "programmes";
}) {
	const { description, items, title, variant } = props;

	const maxAmount = Math.max(...(items ?? []).map((item) => item.amount), 1);

	return (
		<article className="w-full rounded-[18px] bg-cedar-white p-4 shadow-[0_1px_0_hsl(0,0%,0%,0.04)]">
			<header className="mb-3 flex items-start justify-between gap-3">
				<div>
					<h3 className="text-[13px]/[1.2] lg:text-[14px]">{title}</h3>
					<p className="mt-1 text-[10px] text-cedar-black/48">{description}</p>
				</div>
				<Badge className="border-0 bg-cedar-yellow/16 px-2 py-1 text-[9px] text-cedar-yellow">
					{getChartScope(title)}
				</Badge>
			</header>

			<ForWithWrapper
				className="mt-5 flex flex-col gap-3"
				each={items ?? []}
				renderItem={(item, index) => (
					<li key={item.title} className="grid grid-cols-[76px_1fr_36px] items-center gap-3">
						<p className="text-[10px] text-cedar-black/64">{item.title}</p>
						<div
							className={cnJoin(
								"h-2 overflow-hidden rounded-full",
								variant === "programmes" ? getProgrammeBarTrackClassName(index) : "bg-cedar-red/12"
							)}
						>
							<div
								className={cnJoin(
									"h-full w-(--width) rounded-full",
									variant === "programmes" ? getProgrammeBarClassName(index) : "bg-cedar-red"
								)}
								style={
									{
										"--width": `${Math.max((item.amount / maxAmount) * 100, 4)}%`,
									} as React.CSSProperties
								}
							/>
						</div>
						<p className="text-right text-[11px] font-medium">{formatNumber(item.amount)}</p>
					</li>
				)}
			/>
		</article>
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

function toChartData(dataset: DashboardChartDataset, colors: readonly string[]) {
	return dataset.labels.map((label, labelIndex) => {
		const dataPoint: Record<string, number | string> = {
			fill: colors[labelIndex % colors.length] ?? "var(--color-cedar-yellow)",
			label,
		};

		for (const [dataItemIndex, dataItem] of dataset.datasets.entries()) {
			dataPoint[dataItem.label ?? `value-${dataItemIndex}`] = dataItem.data[labelIndex] ?? 0;
		}

		return dataPoint;
	});
}

function toPieData(dataset: DashboardChartDataset, colors: readonly string[]) {
	const firstDataSet = dataset.datasets[0];

	return dataset.labels.map((label, index) => ({
		fill: colors[index % colors.length],
		label,
		value: firstDataSet?.data[index] ?? 0,
	}));
}

function toChartConfig(dataset: DashboardChartDataset, colors: readonly string[], title?: string) {
	return Object.fromEntries(
		dataset.datasets.map((dataItem, index) => [
			dataItem.label ?? `value-${index}`,
			{
				color: getSeriesColor({ colors, index, label: dataItem.label, title }),
				label: dataItem.label ?? `Series ${index + 1}`,
			},
		])
	);
}

function getChartColors(title: string) {
	const colors = chartColorsByTitle[title as keyof typeof chartColorsByTitle];

	return colors;
}

function getChartScope(title: string) {
	return chartScopesByTitle[title as keyof typeof chartScopesByTitle];
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

	return colors[index % colors.length] ?? chartColorGroups.default[0];
}

const formatNumber = (value: number | undefined) => {
	if (value == null || Number.isNaN(value)) {
		return "--";
	}

	return Math.round(value).toLocaleString();
};

const formatPercent = (value: number, total: number) => {
	if (total === 0) {
		return "0%";
	}

	return `${Math.round((value / total) * 100)}%`;
};
