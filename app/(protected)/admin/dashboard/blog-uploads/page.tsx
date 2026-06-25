"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { toFormData } from "@zayne-labs/callapi/utils";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
	FormErrorMessageShared,
	TextAreaField,
	TextField,
} from "@/app/(home)/-components/FormPartsShared";
import * as DropZoneInput from "@/components/common/DropZoneInput";
import { For } from "@/components/common/for";
import { Show } from "@/components/common/show";
import { DropdownMenu } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import type { QueryKeys } from "@/components/ui/data-table/data-table-types";
import { useDataTable } from "@/components/ui/data-table/use-data-table";
import { Form } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import { BlogFrontendSchema } from "@/lib/api/callBackendApi/apiSchema";
import { deleteBlogMutation } from "@/lib/react-query/mutationOptions";
import { blogsQuery, type BlogsQueryResult } from "@/lib/react-query/queryOptions";
import { EMPTY_VALUE_PLACEHOLDER } from "../-components/constants";
import {
	DashboardDataTable,
	DashboardDataTableFilterToolbar,
	useDashboardDataTableQueryState,
} from "../-components/DashboardDataTableShared";
import { Main } from "../-components/Main";

type BlogRecord = BlogsQueryResult["data"][number];

const BLOG_TABLE_QUERY_KEYS = {
	filters: "blogFilters",
	joinOperator: "blogJoinOperator",
	page: "blogPage",
	perPage: "blogPerPage",
	sort: "blogSort",
} as const satisfies QueryKeys;

const BLOG_TABLE_INITIAL_STATE = {
	pagination: { pageIndex: 0, pageSize: 10 },
};

function BlogUploadsPage() {
	const queryClient = useQueryClient();
	const [editorRecord, setEditorRecord] = useState<BlogRecord | null>(null);
	const [isEditorOpen, setIsEditorOpen] = useState(false);

	const blogQuery = useDashboardDataTableQueryState({
		pageKey: BLOG_TABLE_QUERY_KEYS.page,
		perPageKey: BLOG_TABLE_QUERY_KEYS.perPage,
		sortableColumnIds: [],
		sortKey: BLOG_TABLE_QUERY_KEYS.sort,
	});

	const blogsQueryResult = useQuery(blogsQuery({ limit: blogQuery.limit, page: blogQuery.page }));

	const records = blogsQueryResult.data?.data ?? [];

	const columns = useMemo<Array<ColumnDef<BlogRecord>>>(() => {
		return [
			{
				accessorFn: (row) => row.title,
				cell: ({ row }) => (
					<div className="flex max-w-[320px] flex-col gap-1">
						<span className="truncate text-[13px] font-semibold text-cedar-black">
							{row.original.title}
						</span>
						<span className="truncate text-[12px] text-cedar-black/56">
							{row.original.description ?? EMPTY_VALUE_PLACEHOLDER}
						</span>
					</div>
				),
				enableColumnFilter: true,
				header: ({ column }) => <DataTableColumnHeader column={column} label="TITLE" />,
				id: "title",
				meta: {
					label: "Title",
					placeholder: "search posts",
					variant: "text",
				},
			},
			{
				accessorFn: (row) => row.description,
				cell: ({ row }) => (
					<span className="block max-w-[260px] truncate text-[13px] text-cedar-black/64">
						{row.original.description ?? EMPTY_VALUE_PLACEHOLDER}
					</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="DESCRIPTION" />,
				id: "description",
			},
			{
				accessorFn: (row) => row.date,
				cell: ({ row }) => (
					<span className="text-[13px] text-cedar-black/64">
						{new Intl.DateTimeFormat("en", {
							day: "numeric",
							month: "short",
							year: "numeric",
						}).format(new Date(row.original.date))}
					</span>
				),
				header: ({ column }) => <DataTableColumnHeader column={column} label="PUBLISH DATE" />,
				id: "date",
			},
			{
				cell: ({ row }) => (
					<BlogRowActions
						record={row.original}
						onEdited={() => {
							setEditorRecord(row.original);
							setIsEditorOpen(true);
						}}
					/>
				),
				enableHiding: false,
				header: "ACTIONS",
				id: "actions",
			},
		];
	}, []);

	const table = useDataTable<BlogRecord>({
		clearOnDefault: true,
		columns,
		data: records,
		getRowId: (row) => row.id,
		initialState: BLOG_TABLE_INITIAL_STATE,
		manualFiltering: false,
		pageCount: records.length < blogQuery.limit ? blogQuery.page : blogQuery.page + 1,
		queryKeys: BLOG_TABLE_QUERY_KEYS,
		sortableColumnIds: [],
	});

	const stats = [
		{ label: "Total Posts", value: records.length },
		{ label: "Published", value: records.length },
		{ label: "Drafts", value: 0 },
		{ label: "Scheduled", value: 0 },
	] as const;

	return (
		<Main className="gap-6 lg:gap-12">
			<Show.Root when={isEditorOpen}>
				<Show.Content>
					<BlogEditor
						existingRecord={editorRecord}
						onBack={() => {
							setEditorRecord(null);
							setIsEditorOpen(false);
						}}
						onSaved={() => {
							setEditorRecord(null);
							setIsEditorOpen(false);
							void queryClient.invalidateQueries({ queryKey: blogsQuery().queryKey });
						}}
					/>
				</Show.Content>

				<Show.Fallback>
					<header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<h1 className="text-[20px] font-semibold text-cedar-black lg:text-[24px]">
								Blog Uploads
							</h1>
							<p className="mt-1 max-w-[520px] text-[12px] text-cedar-black/56 lg:text-[14px]">
								Create, manage, and publish blog posts for CedarRise's public blog page
							</p>
						</div>

						<Button
							theme="secondary"
							size="medium"
							className="h-10 rounded-[8px] px-6 text-[12px] lg:h-10 lg:rounded-[8px] lg:px-7
								lg:text-[12px]"
							onClick={() => {
								setEditorRecord(null);
								setIsEditorOpen(true);
							}}
						>
							New Post
						</Button>
					</header>

					<BlogStats stats={stats} />
				</Show.Fallback>
			</Show.Root>

			<DashboardDataTable isLoading={blogsQueryResult.isPending} table={table.table}>
				<DashboardDataTableFilterToolbar table={table.table} />
			</DashboardDataTable>
		</Main>
	);
}

export default BlogUploadsPage;

function BlogStats(props: { stats: ReadonlyArray<{ label: string; value: number }> }) {
	const { stats } = props;

	return (
		<section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
			<For
				each={stats}
				renderItem={(stat) => (
					<Card.Root
						key={stat.label}
						className="rounded-[14px] border border-cedar-black/10 bg-cedar-white px-5 py-4
							lg:min-h-[92px] lg:px-7 lg:py-5"
					>
						<Card.Content>
							<Card.Title className="text-[24px] font-semibold text-cedar-black lg:text-[30px]">
								{stat.value}
							</Card.Title>
							<Card.Description className="mt-1 text-[12px] text-cedar-black/56 lg:text-[14px]">
								{stat.label}
							</Card.Description>
						</Card.Content>
					</Card.Root>
				)}
			/>
		</section>
	);
}

function BlogEditor(props: {
	existingRecord: BlogRecord | null;
	onBack: () => void;
	onSaved: () => void;
}) {
	const { existingRecord, onBack, onSaved } = props;

	const form = useForm({
		resolver: zodResolver(BlogFrontendSchema),
		values: {
			description: existingRecord?.description ?? "",
			file: undefined,
			title: existingRecord?.title ?? "",
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		if (existingRecord) {
			await callBackendApiForQuery("@patch/blogs/:id", {
				body: toFormData(data),
				meta: { toast: { success: true } },
				onSuccess: onSaved,
				params: { id: existingRecord.id },
			});
			return;
		}

		if (!data.file) {
			form.setError("file", { message: "Upload a document." });
			return;
		}

		await callBackendApiForQuery("@post/blogs", {
			body: toFormData(data),
			meta: { toast: { success: true } },
			onSuccess: onSaved,
		});
	});

	return (
		<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="gap-5">
			<div
				className="flex items-center justify-between gap-3 rounded-[12px] border border-cedar-black/40
					p-2 lg:p-2.5"
			>
				<Button
					theme="white"
					size="medium"
					className="h-8 rounded-[8px] px-6 text-[12px] lg:h-10 lg:rounded-[8px] lg:px-7
						lg:text-[12px]"
					onClick={onBack}
				>
					Back
				</Button>

				<Form.Submit asChild={true}>
					{(formState) => (
						<Button
							theme="secondary"
							size="medium"
							className="h-8 rounded-[8px] px-7 text-[12px] lg:h-10 lg:rounded-[8px] lg:px-8
								lg:text-[12px]"
							isLoading={formState.isSubmitting}
							isDisabled={formState.isSubmitting}
						>
							Publish
						</Button>
					)}
				</Form.Submit>
			</div>

			<section className="flex w-full flex-col gap-5">
				<TextField
					control={form.control}
					name="title"
					placeholder="Post Title..."
					classNames={{
						input: `rounded-[20px] border border-cedar-black/40 bg-transparent px-5 text-base
						font-semibold lg:px-5 lg:text-[24px]`,
					}}
				/>

				<TextAreaField
					control={form.control}
					name="description"
					label="Description"
					placeholder="Write a short description"
					classNames={{
						textArea: `min-h-[80px] rounded-[20px] border border-cedar-black/40 bg-transparent px-5
						text-[18px] font-semibold lg:px-5`,
					}}
				/>

				<Form.FieldWithController
					control={form.control}
					name="file"
					render={(ctx) => (
						<>
							<DropZoneInput.Root
								allowedFileTypes={[".pdf"]}
								multiple={false}
								onChange={ctx.field.onChange}
							>
								<DropZoneInput.Area
									classNames={{
										container: `h-[80px] rounded-[20px] border border-dashed
										border-cedar-black/40 bg-cedar-white text-cedar-black/64 transition-colors
										data-drag-over:bg-cedar-red/10 lg:h-[92px]`,
									}}
								>
									<p className="text-[12px] font-medium text-cedar-black/64">Upload document</p>
								</DropZoneInput.Area>
								<DropZoneInput.ImagePreview
									classNames={{
										listContainer: "border-cedar-black/12",
										listItem: "border-cedar-black/8",
									}}
								/>
							</DropZoneInput.Root>
							<FormErrorMessageShared />
						</>
					)}
				/>
			</section>
		</Form.Root>
	);
}

function BlogRowActions(props: { onEdited: () => void; record: BlogRecord }) {
	const { onEdited, record } = props;
	const queryClient = useQueryClient();
	const deleteMutation = useMutation(deleteBlogMutation(record.id));

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className="rounded-[10px] border border-cedar-black/16 px-4 py-2 text-[13px]
					text-cedar-black/72 transition-colors hover:bg-cedar-grey"
			>
				Actions
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" className="w-[150px] rounded-[20px] p-3">
				<DropdownMenu.Item asChild={true} className="justify-center">
					<a href={record.documentUrl} target="_blank" rel="noreferrer">
						View Document
					</a>
				</DropdownMenu.Item>
				<DropdownMenu.Item className="justify-center" onClick={onEdited}>
					Edit
				</DropdownMenu.Item>
				<DropdownMenu.Item
					className="justify-center text-cedar-red focus:text-cedar-red"
					disabled={deleteMutation.isPending}
					onClick={() => {
						deleteMutation.mutate(undefined, {
							onSuccess: () =>
								void queryClient.invalidateQueries({ queryKey: blogsQuery().queryKey }),
						});
					}}
				>
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
