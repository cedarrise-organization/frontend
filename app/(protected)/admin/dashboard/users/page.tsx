"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { DialogAnimated } from "@/components/animated/ui";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import type { QueryKeys } from "@/components/ui/data-table/data-table-types";
import { useDataTable } from "@/components/ui/data-table/use-data-table";
import {
	adminListUsersQuery,
	adminUserRolesQuery,
	type AdminListUsersQuery,
} from "@/lib/react-query/queryOptions";
import {
	DashboardDataTable,
	DashboardDataTableQueryToolbar,
	useDashboardDataTableQueryState,
} from "../-components/DashboardDataTableShared";
import { EMPTY_VALUE_PLACEHOLDER } from "../-components/constants";
import { Main } from "../-components/Main";

type UsersQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof adminListUsersQuery>["queryFn"]>>
>;

type UserRecord = UsersQueryResult["data"][number];

const USERS_TABLE_QUERY_KEYS = {
	filters: "usersFilters",
	joinOperator: "usersJoinOperator",
	page: "usersPage",
	perPage: "usersPerPage",
	search: "usersSearch",
	sort: "usersSort",
} as const satisfies QueryKeys;

const USERS_TABLE_INITIAL_STATE = {
	pagination: { pageIndex: 0, pageSize: 10 },
};

function UsersPage() {
	const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
	const [search] = useQueryState(USERS_TABLE_QUERY_KEYS.search, parseAsString.withDefault(""));

	const usersQuery = useDashboardDataTableQueryState({
		pageKey: USERS_TABLE_QUERY_KEYS.page,
		perPageKey: USERS_TABLE_QUERY_KEYS.perPage,
		sortableColumnIds: [],
		sortKey: USERS_TABLE_QUERY_KEYS.sort,
	});

	const query = {
		limit: usersQuery.limit,
		orderBy: usersQuery.orderBy,
		page: usersQuery.page,
		...(search && { search }),
	} satisfies AdminListUsersQuery;

	const usersQueryResult = useQuery(adminListUsersQuery(query));
	const records = usersQueryResult.data?.data ?? [];
	const pagination = usersQueryResult.data?.meta?.pagination;

	const columns = useMemo<Array<ColumnDef<UserRecord>>>(() => {
		return [
			{
				accessorFn: (row) => row.name,
				cell: ({ row }) => (
					<span className="text-[13px] font-semibold text-cedar-black capitalize">
						{row.original.name}
					</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="USER NAME" />,
				id: "name",
			},
			{
				cell: ({ row }) => (
					<Button
						unstyled={true}
						className="text-[13px] text-cedar-black/64 hover:text-cedar-red"
						onClick={() => setSelectedUser(row.original)}
					>
						View roles
					</Button>
				),
				enableHiding: false,
				header: "VIEW ROLES",
				id: "roles",
			},
			{
				accessorFn: (row) => row.email,
				cell: ({ row }) => (
					<span className="text-[13px] text-cedar-black/64">{row.original.email}</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="E-MAIL" />,
				id: "email",
			},
			{
				accessorFn: (row) => row.department,
				cell: ({ row }) => (
					<span className="text-[13px] text-cedar-black/64 capitalize">
						{row.original.department.toLowerCase()}
					</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="DEPARTMENT" />,
				id: "department",
			},
		];
	}, []);

	const table = useDataTable<UserRecord>({
		clearOnDefault: true,
		columns,
		data: records,
		getRowId: (row) => row.id,
		initialState: USERS_TABLE_INITIAL_STATE,
		pageCount: pagination?.totalPages ?? 1,
		queryKeys: USERS_TABLE_QUERY_KEYS,
		sortableColumnIds: [],
	});

	return (
		<Main className="pt-[64px] lg:pt-[130px]">
			<DashboardDataTable isLoading={usersQueryResult.isPending} table={table.table}>
				<DashboardDataTableQueryToolbar
					searchPlaceholder="search Users"
					sortOptions={[]}
					table={table.table}
				/>
			</DashboardDataTable>

			<UserRolesDialog selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
		</Main>
	);
}

export default UsersPage;

function UserRolesDialog(props: {
	selectedUser: UserRecord | null;
	setSelectedUser: (user: UserRecord | null) => void;
}) {
	const { selectedUser, setSelectedUser } = props;

	const rolesQueryResult = useQuery({
		...adminUserRolesQuery(selectedUser?.id ?? ""),
		enabled: Boolean(selectedUser),
	});

	return (
		<DialogAnimated.Root
			open={Boolean(selectedUser)}
			onOpenChange={(open) => {
				!open && setSelectedUser(null);
			}}
		>
			<DialogAnimated.Content
				withCloseButton={false}
				className="flex max-h-[92vh] w-[min(calc(100vw-32px),560px)] flex-col overflow-hidden
					rounded-[28px] border-0 bg-cedar-white p-0"
			>
				<DialogAnimated.Header
					className="shrink-0 flex-row items-start justify-between gap-6 border-b
						border-cedar-black/10 px-7 pt-7 pb-6 text-left"
				>
					<div className="flex min-w-0 items-center gap-4">
						<span
							className="flex size-14 shrink-0 items-center justify-center rounded-[16px]
								bg-cedar-yellow text-[20px] font-semibold text-cedar-white"
						>
							{selectedUser?.name
								.split(" ")
								.map((name) => name[0])
								.join("")
								.slice(0, 2)
								.toUpperCase()}
						</span>

						<div className="min-w-0">
							<DialogAnimated.Title className="truncate text-[22px] text-cedar-black capitalize">
								{selectedUser?.name}
							</DialogAnimated.Title>
							<DialogAnimated.Description className="mt-1 truncate text-[15px] text-cedar-black/64">
								{selectedUser?.email}
							</DialogAnimated.Description>
						</div>
					</div>

					<DialogAnimated.Close
						className="flex size-10 shrink-0 items-center justify-center rounded-full
							text-cedar-black/56 transition-colors hover:bg-cedar-grey hover:text-cedar-black"
					>
						<IconBox icon="lucide:x" className="size-5" />
					</DialogAnimated.Close>
				</DialogAnimated.Header>

				<div className="grow overflow-y-auto px-7 py-5">
					<div className="grid grid-cols-2 gap-4 border-b border-cedar-black/10 pb-5">
						<div>
							<p className="text-[12px] font-medium text-cedar-black/48 uppercase">Department</p>
							<p className="mt-1 truncate text-[15px] font-semibold text-cedar-black capitalize">
								{selectedUser?.department.toLowerCase()}
							</p>
						</div>

						<div>
							<p className="text-[12px] font-medium text-cedar-black/48 uppercase">
								Assigned roles
							</p>
							<p className="mt-1 text-[15px] font-semibold text-cedar-black">
								{rolesQueryResult.data?.data.length ?? EMPTY_VALUE_PLACEHOLDER}
							</p>
						</div>
					</div>

					{rolesQueryResult.isPending && (
						<For
							each={3}
							renderItem={(index) => (
								<div
									key={index}
									className="h-[76px] animate-pulse border-b border-cedar-black/10"
								/>
							)}
						/>
					)}

					{!rolesQueryResult.isPending && rolesQueryResult.data?.data.length === 0 && (
						<div className="flex flex-col items-center gap-3 py-10 text-center">
							<span
								className="flex size-12 items-center justify-center rounded-full bg-cedar-grey
									text-cedar-black/48"
							>
								<IconBox icon="lucide:shield-question" className="size-6" />
							</span>
							<p className="text-[15px] font-semibold text-cedar-black">No roles assigned</p>
							<p className="max-w-[300px] text-[14px] text-cedar-black/56">
								This user does not currently have any system roles.
							</p>
						</div>
					)}

					<For
						each={rolesQueryResult.data?.data ?? []}
						renderItem={(role) => (
							<article
								key={role.id}
								className="flex items-start gap-4 border-b border-cedar-black/10 py-4
									last:border-b-0"
							>
								<span
									className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-[12px]
										bg-cedar-yellow/16 text-cedar-yellow"
								>
									<IconBox
										icon={role.isDefault ? "lucide:user-check" : "lucide:shield"}
										className="size-5"
									/>
								</span>

								<div className="min-w-0 flex-1">
									<div className="flex items-center justify-between gap-3">
										<p className="truncate text-[15px] font-semibold text-cedar-black capitalize">
											{role.name}
										</p>
										{role.isDefault && (
											<span
												className="rounded-full bg-cedar-yellow/16 px-3 py-1 text-[11px]
													font-semibold text-cedar-yellow"
											>
												Default
											</span>
										)}
									</div>

									<p className="mt-1 text-[14px]/5 text-cedar-black/56">
										{role.description ?? "No description provided for this role."}
									</p>
								</div>
							</article>
						)}
					/>
				</div>

				<DialogAnimated.Footer className="shrink-0 border-t border-cedar-black/10 px-7 pt-5 pb-7">
					<DialogAnimated.Close
						className="h-12 rounded-[12px] border border-cedar-red px-6 text-[15px] font-medium
							text-cedar-red transition-colors hover:bg-cedar-red hover:text-cedar-white"
					>
						Close
					</DialogAnimated.Close>
				</DialogAnimated.Footer>
			</DialogAnimated.Content>
		</DialogAnimated.Root>
	);
}
