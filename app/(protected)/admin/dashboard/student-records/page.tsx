"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { TabsAnimated } from "@/components/animated/ui";
import { For } from "@/components/common/for";
import { NavLink } from "@/components/common/NavLink";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import type { QueryKeys } from "@/components/ui/data-table/data-table-types";
import { useDataTable } from "@/components/ui/data-table/use-data-table";
import {
	ashStudentProfilesQuery,
	tacotsStudentProfilesQuery,
	type StudentProfilesListQuery,
} from "@/lib/react-query/queryOptions";
import {
	DashboardDataTable,
	DashboardDataTableQueryToolbar,
	useDashboardDataTableQueryState,
} from "../-components/DashboardDataTableShared";
import { Main } from "../-components/Main";

type Program = "ash" | "tacots";

type StudentRecord = {
	id: string;
	name: string;
};

const STUDENT_RECORD_TABS = [
	{ label: "ASH", value: "ash" },
	{ label: "TACOTS", value: "tacots" },
] as const;

function StudentRecordsPage() {
	return (
		<Main className="gap-6 lg:gap-12">
			<header className="flex flex-col gap-2">
				<h1 className="text-[20px] font-medium text-cedar-black lg:text-[24px]">Student Records</h1>
				<p className="max-w-[600px] text-[14px] text-cedar-black/64 lg:text-[16px]">
					View complete profiles for enrolled ASH and TACOTS students.
				</p>
			</header>

			<TabsAnimated.Root defaultValue="ash" className="gap-6">
				<div className="rounded-[20px] bg-cedar-white p-4 lg:p-5">
					<TabsAnimated.List
						classNames={{
							highlight: "rounded-[12px] bg-cedar-red",
							list: "h-12 rounded-[12px] bg-cedar-grey p-2",
						}}
					>
						<For
							each={STUDENT_RECORD_TABS}
							renderItem={(tab) => (
								<TabsAnimated.Trigger
									key={tab.value}
									value={tab.value}
									className="px-5 text-cedar-black/85 data-[state=active]:text-cedar-white"
								>
									{tab.label}
								</TabsAnimated.Trigger>
							)}
						/>
					</TabsAnimated.List>
				</div>

				<TabsAnimated.ContentList>
					<TabsAnimated.Content value="ash">
						<StudentRecordsTable program="ash" />
					</TabsAnimated.Content>
					<TabsAnimated.Content value="tacots">
						<StudentRecordsTable program="tacots" />
					</TabsAnimated.Content>
				</TabsAnimated.ContentList>
			</TabsAnimated.Root>
		</Main>
	);
}

function StudentRecordsTable(props: { program: Program }) {
	const { program } = props;
	const queryKeys = getStudentTableQueryKeys(program);
	const [search] = useQueryState(queryKeys.search, parseAsString.withDefault(""));
	const tableQuery = useDashboardDataTableQueryState({
		pageKey: queryKeys.page,
		perPageKey: queryKeys.perPage,
		sortableColumnIds: [] as string[],
		sortKey: queryKeys.sort,
	});

	const query = {
		limit: tableQuery.limit,
		orderBy: tableQuery.orderBy,
		page: tableQuery.page,
		...(search && { search }),
	} satisfies StudentProfilesListQuery;

	const queryOptions =
		program === "ash" ? ashStudentProfilesQuery(query) : tacotsStudentProfilesQuery(query);
	const queryResult = useQuery(queryOptions);
	const records = queryResult.data?.data ?? [];
	const pagination = queryResult.data?.meta.pagination;

	const columns = useMemo<Array<ColumnDef<StudentRecord>>>(() => {
		return [
			{
				accessorFn: (row) => row.name,
				cell: ({ row }) => (
					<NavLink
						href={`/admin/dashboard/student-records/${program}/${row.original.id}`}
						className="font-semibold text-cedar-black transition-colors hover:text-cedar-red"
					>
						{row.original.name}
					</NavLink>
				),
				enableSorting: false,
				header: ({ column }) => <DataTableColumnHeader column={column} label="STUDENT NAME" />,
				id: "name",
			},
			{
				cell: ({ row }) => (
					<NavLink
						href={`/admin/dashboard/student-records/${program}/${row.original.id}`}
						className="text-[13px] font-medium text-cedar-red hover:underline"
					>
						View profile
					</NavLink>
				),
				enableHiding: false,
				enableSorting: false,
				header: "ACTION",
				id: "action",
			},
		];
	}, [program]);

	const table = useDataTable<StudentRecord>({
		clearOnDefault: true,
		columns,
		data: records,
		getRowId: (row) => row.id,
		initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
		pageCount: pagination?.totalPages ?? 1,
		queryKeys,
		sortableColumnIds: [],
	});

	return (
		<DashboardDataTable isLoading={queryResult.isPending} table={table.table}>
			<DashboardDataTableQueryToolbar
				searchPlaceholder={`Search ${program.toUpperCase()} students`}
				showOrderBy={false}
				sortOptions={[]}
				table={table.table}
			/>
		</DashboardDataTable>
	);
}

function getStudentTableQueryKeys(program: Program) {
	return {
		filters: `${program}StudentFilters`,
		joinOperator: `${program}StudentJoinOperator`,
		page: `${program}StudentPage`,
		perPage: `${program}StudentPerPage`,
		search: `${program}StudentSearch`,
		sort: `${program}StudentSort`,
	} as const satisfies QueryKeys;
}

export default StudentRecordsPage;
