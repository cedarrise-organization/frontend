"use client";

import { useQuery } from "@tanstack/react-query";
import {
	isArray,
	isBoolean,
	isNumber,
	isObjectAndNotArray,
	isString,
} from "@zayne-labs/toolkit-type-helpers";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { ScrollArea } from "@/components/ui";
import { ashStudentProfileQuery, tacotsStudentProfileQuery } from "@/lib/react-query/queryOptions";
import { cnMerge } from "@/lib/utils/cn";
import { EMPTY_VALUE_PLACEHOLDER } from "../../-components/constants";
import { Main } from "../../-components/Main";

type Program = "ash" | "tacots";
type ProfileRecord = Record<string, unknown>;

const WIDE_SECTION_NAMES = new Set<string>([
	"academicPerformance",
	"academicProgress",
	"attendance",
	"financialSupport",
]);

const SECTION_ICONS: Record<string, string> = {
	academicPerformance: "lucide:chart-no-axes-column-increasing",
	academicProgress: "lucide:chart-no-axes-column-increasing",
	attendance: "lucide:calendar-check-2",
	background: "lucide:notebook-text",
	commitments: "lucide:badge-check",
	compliance: "lucide:shield-check",
	documents: "lucide:folder-open",
	education: "lucide:graduation-cap",
	exit: "lucide:log-out",
	family: "lucide:users",
	financialSupport: "lucide:hand-coins",
	mentorship: "lucide:handshake",
	onboarding: "lucide:clipboard-check",
	profile: "lucide:user-round",
	recommendation: "lucide:file-badge",
	religiousBackground: "lucide:landmark",
	school: "lucide:school",
	serviceEngagement: "lucide:heart-handshake",
};

export function StudentProfilePage(props: { id: string; program: Program }) {
	const { id, program } = props;

	return program === "ash" ? <AshProfile id={id} /> : <TacotsProfile id={id} />;
}

function AshProfile(props: { id: string }) {
	const profileQuery = useQuery(ashStudentProfileQuery(props.id));

	return <StudentProfileContent program="ash" profileQuery={profileQuery} />;
}

function TacotsProfile(props: { id: string }) {
	const profileQuery = useQuery(tacotsStudentProfileQuery(props.id));

	return <StudentProfileContent program="tacots" profileQuery={profileQuery} />;
}

function StudentProfileContent(props: {
	profileQuery: {
		data?: { data: ProfileRecord };
		isError: boolean;
		isPending: boolean;
	};
	program: Program;
}) {
	const { profileQuery, program } = props;
	const student = profileQuery.data?.data;
	const summary = isObjectAndNotArray(student?.summary) ? student.summary : {};
	const fullName = isString(summary.fullName) ? summary.fullName : "Student Profile";
	const sections = student ? Object.entries(student).filter(([name]) => name !== "summary") : [];
	const wideSections = sections.filter(([name]) => WIDE_SECTION_NAMES.has(name));
	const compactSections = sections.filter(([name]) => !WIDE_SECTION_NAMES.has(name));

	return (
		<Main className="gap-5 lg:gap-7">
			<NavLink
				href="/admin/dashboard/student-records"
				className="flex w-fit items-center gap-2 text-[13px] font-medium text-cedar-black/64
					transition-colors hover:text-cedar-red lg:text-[14px]"
			>
				<IconBox icon="lucide:arrow-left" className="size-4" />
				Back to student records
			</NavLink>

			{profileQuery.isPending && <ProfileLoadingState />}

			{profileQuery.isError && (
				<section className="rounded-[20px] bg-cedar-white p-6 text-[14px] text-cedar-red">
					Unable to load this student profile.
				</section>
			)}

			{student && (
				<>
					<ProfileHeader fullName={fullName} program={program} summary={summary} />

					<ForWithWrapper
						as="nav"
						aria-label="Profile sections"
						className="flex scrollbar-none gap-2 overflow-x-auto rounded-[16px] bg-cedar-white p-2"
						each={sections}
						renderItem={([sectionName]) => (
							<a
								key={sectionName}
								href={`#${sectionName}`}
								className="shrink-0 rounded-[10px] px-4 py-2 text-[12px] font-medium
									text-cedar-black/64 transition-colors hover:bg-cedar-grey hover:text-cedar-black
									lg:text-[13px]"
							>
								{formatLabel(sectionName)}
							</a>
						)}
					/>

					<ForWithWrapper
						className="flex flex-col gap-5"
						each={wideSections}
						renderItem={([sectionName, sectionValue]) => (
							<ProfileSection key={sectionName} name={sectionName} value={sectionValue} />
						)}
					/>

					<ForWithWrapper
						className="columns-1 gap-5 xl:columns-2"
						each={compactSections}
						renderItem={([sectionName, sectionValue]) => (
							<ProfileSection
								key={sectionName}
								isCompact={true}
								name={sectionName}
								value={sectionValue}
							/>
						)}
					/>
				</>
			)}
		</Main>
	);
}

function ProfileHeader(props: { fullName: string; program: Program; summary: ProfileRecord }) {
	const { fullName, program, summary } = props;
	const summaryEntries = Object.entries(summary).filter(
		([key]) => !["fullName", "id", "passportPhotoUrl"].includes(key)
	);
	const initials = fullName
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();

	return (
		<header className="overflow-hidden rounded-[20px] bg-cedar-white">
			<div className="h-2 bg-cedar-red" />
			<div className="flex flex-col gap-6 p-5 lg:p-7">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
					<div
						className="grid size-14 shrink-0 place-items-center rounded-full bg-cedar-yellow
							text-[18px] font-semibold text-cedar-black lg:size-16 lg:text-[21px]"
					>
						{initials}
					</div>

					<div className="min-w-0">
						<div className="mb-1 flex flex-wrap items-center gap-2">
							<p className="text-[11px] font-semibold text-cedar-red uppercase lg:text-[12px]">
								{program} student record
							</p>
							<span className="size-1 rounded-full bg-cedar-black/20" />
							<p className="text-[11px] font-medium text-cedar-black/48">Complete profile</p>
						</div>
						<h1 className="text-[22px] font-semibold text-cedar-black lg:text-[28px]">{fullName}</h1>
					</div>
				</div>

				{summaryEntries.length > 0 && (
					<ForWithWrapper
						className="grid gap-x-6 gap-y-4 border-t border-cedar-black/8 pt-5 sm:grid-cols-2
							xl:grid-cols-4"
						each={summaryEntries}
						renderItem={([key, value]) => (
							<div key={key} className="min-w-0">
								<p className="mb-1 text-[11px] font-medium text-cedar-black/48 lg:text-[12px]">
									{formatLabel(key)}
								</p>
								<p
									className="truncate text-[13px] font-semibold text-cedar-black/85
										lg:text-[14px]"
								>
									{formatValue(value)}
								</p>
							</div>
						)}
					/>
				)}
			</div>
		</header>
	);
}

function ProfileSection(props: { isCompact?: boolean; name: string; value: unknown }) {
	const { isCompact = false, name, value } = props;

	return (
		<section
			id={name}
			className={cnMerge(
				"scroll-mt-5 overflow-hidden rounded-[20px] bg-cedar-white",
				isCompact && "mb-5 break-inside-avoid"
			)}
		>
			<header className="flex items-center gap-3 border-b border-cedar-black/8 px-5 py-4 lg:px-6">
				<span className="grid size-9 place-items-center rounded-[10px] bg-cedar-red/8 text-cedar-red">
					<IconBox icon={SECTION_ICONS[name] ?? "lucide:layout-list"} className="size-[18px]" />
				</span>
				<h2 className="text-[16px] font-semibold text-cedar-black lg:text-[18px]">
					{formatLabel(name)}
				</h2>
			</header>

			<div className="p-5 lg:p-6">
				<ProfileValue value={value} />
			</div>
		</section>
	);
}

function ProfileValue(props: { value: unknown }) {
	const { value } = props;

	if (isArray(value)) {
		return <ProfileArray value={value} />;
	}

	if (isObjectAndNotArray(value)) {
		return (
			<ForWithWrapper
				className="grid gap-x-8 gap-y-5 sm:grid-cols-2"
				each={Object.entries(value)}
				renderItem={([key, nestedValue]) => {
					const isNested =
						isObjectAndNotArray(nestedValue)
						|| (isArray(nestedValue) && nestedValue.some((element) => isObjectAndNotArray(element)));

					return (
						<div
							key={key}
							className={cnMerge(
								"min-w-0",
								isNested && "border-t border-cedar-black/8 pt-5 sm:col-span-2"
							)}
						>
							<p className="mb-1.5 text-[11px] font-medium text-cedar-black/48 lg:text-[12px]">
								{formatLabel(key)}
							</p>
							<div
								className="text-[13px] leading-relaxed font-medium text-cedar-black/82
									lg:text-[14px]"
							>
								{isNested ?
									<ProfileValue value={nestedValue} />
								:	<ProfileScalar name={key} value={nestedValue} />}
							</div>
						</div>
					);
				}}
			/>
		);
	}

	return (
		<p className="text-[13px] font-medium text-cedar-black/82 lg:text-[14px]">{formatValue(value)}</p>
	);
}

function ProfileArray(props: { value: unknown[] }) {
	const { value } = props;

	if (value.length === 0) {
		return <p className="text-[13px] text-cedar-black/48">{EMPTY_VALUE_PLACEHOLDER}</p>;
	}

	if (value.every((item) => !isObjectAndNotArray(item))) {
		return (
			<ForWithWrapper
				className="flex flex-wrap gap-2"
				each={value}
				renderItem={(item, index) => (
					<span
						key={`${formatValue(item)}-${index}`}
						className="rounded-full bg-cedar-grey px-3 py-1.5 text-[12px] text-cedar-black/72"
					>
						{formatValue(item)}
					</span>
				)}
			/>
		);
	}

	const history = (
		<ForWithWrapper
			className="divide-y divide-cedar-black/8"
			each={value}
			renderItem={(item, index) => (
				<details key={index} className="group py-1" open={value.length === 1}>
					<summary
						className="flex cursor-pointer list-none items-center justify-between gap-4 py-3
							text-[13px] font-semibold text-cedar-black/80 marker:hidden lg:text-[14px]"
					>
						<span>{getRecordTitle(item, index)}</span>
						<IconBox
							icon="lucide:chevron-down"
							className="size-4 shrink-0 transition-transform group-open:rotate-180"
						/>
					</summary>
					<div className="pb-4">
						<ProfileValue value={item} />
					</div>
				</details>
			)}
		/>
	);

	if (value.length <= 4) {
		return <div className="border-y border-cedar-black/8">{history}</div>;
	}

	return (
		<ScrollArea.Root
			orientation="vertical"
			classNames={{
				base: "h-[340px] border-y border-cedar-black/8 lg:h-[420px]",
				scrollbar: "w-1.5",
				thumb: "bg-cedar-black/20",
				viewport: "pr-4",
			}}
		>
			{history}
		</ScrollArea.Root>
	);
}

function ProfileScalar(props: { name: string; value: unknown }) {
	const { name, value } = props;

	if (name.endsWith("Url") && isString(value) && value) {
		return (
			<a
				href={value}
				target="_blank"
				rel="noreferrer"
				className="inline-flex items-center gap-1.5 font-semibold text-cedar-red hover:underline"
			>
				View document
				<IconBox icon="lucide:external-link" className="size-3.5" />
			</a>
		);
	}

	return formatValue(value);
}

function ProfileLoadingState() {
	return (
		<div className="flex flex-col gap-5">
			<div className="h-[210px] animate-pulse rounded-[20px] bg-cedar-white" />
			<ForWithWrapper
				className="grid gap-5 xl:grid-cols-2"
				each={Array.from({ length: 4 })}
				renderItem={(_, index) => (
					<div key={index} className="h-[260px] animate-pulse rounded-[20px] bg-cedar-white" />
				)}
			/>
		</div>
	);
}

function formatLabel(value: string) {
	return value
		.replaceAll("_", " ")
		.split(/(?=[A-Z])/)
		.join(" ")
		.replaceAll(/\b\w/g, (character) => character.toUpperCase());
}

function formatValue(value: unknown) {
	if (value === null || value === undefined || value === "") {
		return EMPTY_VALUE_PLACEHOLDER;
	}

	if (isBoolean(value)) {
		return value ? "Yes" : "No";
	}

	if (isNumber(value) || isString(value)) {
		return String(value);
	}

	return EMPTY_VALUE_PLACEHOLDER;
}

function getRecordTitle(value: unknown, index: number) {
	if (!isObjectAndNotArray(value)) {
		return `Record ${index + 1}`;
	}

	const preferredKeys = ["academicTerm", "term", "sessionDate", "submissionDate", "date", "activityType"];
	const titleParts = preferredKeys
		.map((key) => value[key])
		.filter((item) => isString(item) || isNumber(item))
		.slice(0, 2);

	return titleParts.length > 0 ? titleParts.join(" · ") : `Record ${index + 1}`;
}
