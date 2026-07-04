"use client";

import { TabsAnimated } from "@/components/animated/ui";
import { For, ForWithWrapper } from "@/components/common/for";
import { NavLink, type MainAppRoutes } from "@/components/common/NavLink";
import { Card } from "@/components/ui/card";
import { Main } from "../-components/Main";

const TRACKER_FORM_TABS = [
	{ label: "ASH", value: "ash" },
	{ label: "TACOTS", value: "tacots" },
	{ label: "Outreaches", value: "outreaches" },
	{ label: "Capacity Building", value: "capacity-building" },
] as const;

const TRACKER_FORM_SECTIONS = {
	ash: [
		{
			color: "yellow",
			description:
				"Record end-of-term academic performance, attendance summary, and progress notes for each ASH student",
			href: "/admin/dashboard/tracker-forms/ash/termly-tracking",
			title: "ASH - Termly Tracking Form",
		},
		{
			color: "yellow",
			description:
				"Log weekly attendance, participation scores, and activity completion for After School Hours sessions",
			href: "/admin/dashboard/tracker-forms/ash/weekly-activity-attendance",
			title: "ASH - Weekly activity & Attendance",
		},
		{
			color: "red",
			description:
				"Capture beneficiary exit details, reason for leaving, and final progress assessment at program completion",
			href: "/admin/dashboard/tracker-forms/ash/exit",
			title: "ASH - Exit Form",
		},
	],
	"capacity-building": [
		{
			color: "yellow",
			description:
				"Evaluate skills acquired, trainer performance, participant progress, and overall program effectiveness at cohort close",
			href: "/admin/dashboard/tracker-forms/capacity-building/program-evaluation",
			title: "Capacity Building Program Evaluation",
		},
	],
	outreaches: [
		{
			color: "yellow",
			description:
				"Track community outreach events, locations reached, beneficiaries engaged, resources distributed, and volunteer hours.",
			href: "/admin/dashboard/tracker-forms/outreaches/tracker",
			title: "Cedar Outreach Tracker",
		},
	],
	tacots: [
		{
			color: "yellow",
			description:
				"Monitor TACOTS Students reintegrated from street situations , tracking school attendance, stability, and wellbeing.",
			href: "/admin/dashboard/tracker-forms/tacots/student-tracking",
			title: "TACOTS - Student Tracking Form",
		},
		{
			color: "yellow",
			description:
				"Capture new beneficiary intake details, demographics, guardian info, program assignment, and initial assessments",
			href: "/admin/dashboard/tracker-forms/tacots/beneficiary-onboarding",
			title: "TACOTS - Beneficiary Onboarding Form",
		},
		{
			color: "red",
			description:
				"Document completion status, oucomes, and referrals when a TACOTS Student exits the program",
			href: "/admin/dashboard/tracker-forms/tacots/exit-completion",
			title: "TACOTS - Exit Completion Form",
		},
	],
} as const satisfies Record<
	(typeof TRACKER_FORM_TABS)[number]["value"],
	Array<{
		color: "red" | "yellow";
		description: string;
		href: MainAppRoutes;
		title: string;
	}>
>;

function TrackerFormsPage() {
	return (
		<Main className="gap-6 lg:gap-8">
			<header>
				<h1 className="text-[24px] font-semibold text-cedar-black lg:text-[32px]">Tracker Forms</h1>

				<p className="mt-2 max-w-[650px] text-[15px]/[1.45] text-cedar-black/64 lg:text-[18px]">
					Access and Open operational tracking forms across all CedarRise programs
				</p>
			</header>

			<TabsAnimated.Root defaultValue="ash">
				<div className="overflow-x-auto rounded-[20px] bg-cedar-white p-4 lg:p-5">
					<TabsAnimated.List
						classNames={{
							highlight: "rounded-[12px] bg-cedar-red shadow-none",
							list: "h-14 min-w-[650px] rounded-[12px] bg-cedar-grey p-1 lg:h-[62px]",
						}}
					>
						<For
							each={TRACKER_FORM_TABS}
							renderItem={(tab) => (
								<TabsAnimated.Trigger
									key={tab.value}
									value={tab.value}
									className="px-5 text-[15px] text-cedar-black/80
										data-[state=active]:text-cedar-white lg:text-[17px]"
								>
									{tab.label}
								</TabsAnimated.Trigger>
							)}
						/>
					</TabsAnimated.List>
				</div>

				<TabsAnimated.ContentList className="mt-4 lg:mt-6">
					<TabsAnimated.Content value={TRACKER_FORM_TABS[0].value}>
						<TrackerFormCardList forms={TRACKER_FORM_SECTIONS[TRACKER_FORM_TABS[0].value]} />
					</TabsAnimated.Content>

					<TabsAnimated.Content value={TRACKER_FORM_TABS[1].value}>
						<TrackerFormCardList forms={TRACKER_FORM_SECTIONS[TRACKER_FORM_TABS[1].value]} />
					</TabsAnimated.Content>

					<TabsAnimated.Content value={TRACKER_FORM_TABS[2].value}>
						<TrackerFormCardList forms={TRACKER_FORM_SECTIONS[TRACKER_FORM_TABS[2].value]} />
					</TabsAnimated.Content>

					<TabsAnimated.Content value={TRACKER_FORM_TABS[3].value}>
						<TrackerFormCardList forms={TRACKER_FORM_SECTIONS[TRACKER_FORM_TABS[3].value]} />
					</TabsAnimated.Content>
				</TabsAnimated.ContentList>
			</TabsAnimated.Root>
		</Main>
	);
}

export default TrackerFormsPage;

function TrackerFormCardList(props: {
	forms: (typeof TRACKER_FORM_SECTIONS)[keyof typeof TRACKER_FORM_SECTIONS];
}) {
	const { forms } = props;

	return (
		<ForWithWrapper
			className="flex flex-col gap-4 lg:gap-6"
			each={forms}
			renderItem={(form) => <TrackerFormCard key={form.href} form={form} />}
		/>
	);
}

function TrackerFormCard(props: {
	form: (typeof TRACKER_FORM_SECTIONS)[keyof typeof TRACKER_FORM_SECTIONS][number];
}) {
	const { form } = props;

	return (
		<Card.Root
			className="relative flex min-h-[190px] flex-col gap-8 rounded-[28px] bg-cedar-white px-8 py-7
				lg:min-h-[146px] lg:gap-7 lg:rounded-[20px] lg:px-8 lg:py-6"
		>
			<Card.Header className="flex min-w-0 flex-row gap-5 pr-12">
				<span
					className={`mt-1 h-20 w-3 shrink-0 rounded-full lg:h-12 ${
						form.color === "yellow" ? "bg-cedar-yellow" : "bg-cedar-red"
					}`}
				/>

				<div className="min-w-0">
					<Card.Title className="text-[21px]/[1.2] font-semibold text-cedar-black lg:text-[18px]">
						{form.title}
					</Card.Title>

					<Card.Description
						className="mt-4 max-w-[980px] text-[17px]/[1.35] text-cedar-black/64 lg:mt-2
							lg:text-[17px]"
					>
						{form.description}
					</Card.Description>
				</div>
			</Card.Header>

			<Card.Footer>
				<NavLink
					href={form.href}
					className="flex h-14 w-[226px] items-center justify-center rounded-[16px] bg-cedar-grey
						text-[18px] font-medium text-cedar-black/56 transition-colors hover:bg-cedar-black
						hover:text-cedar-white lg:h-12 lg:w-[150px] lg:text-[15px]"
				>
					Open Form
				</NavLink>
			</Card.Footer>

			<span
				className="absolute top-7 right-7 rounded-[8px] bg-cedar-black/12 px-3 py-1.5 text-[14px]
					text-cedar-black/56 lg:top-8 lg:right-8"
			>
				1
			</span>
		</Card.Root>
	);
}
