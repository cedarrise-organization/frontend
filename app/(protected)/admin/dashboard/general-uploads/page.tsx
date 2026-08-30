"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toFormData } from "@zayne-labs/callapi/utils";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
	DateField,
	FormErrorMessageShared,
	SelectField,
	TextField,
} from "@/app/(home)/-components/FormPartsShared";
import { TabsAnimated } from "@/components/animated/ui";
import * as DropZoneInput from "@/components/common/DropZoneInput";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropZone } from "@/components/ui/drop-zone";
import { Form } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	AdminCreateUserFrontendSchema,
	AdminDeleteUserFrontendSchema,
	AdminDepartmentOptions,
	AdminRoleNameOptions,
	AdminUserRoleFrontendSchema,
	backendApiSchemaRoutes,
	GalleryFolderOptions,
	GeneralGalleryFrontendSchema,
	GeneralProjectFrontendSchema,
	GeneralReceiptFrontendSchema,
	GoogleFormFrontendSchema,
} from "@/lib/api/callBackendApi/apiSchema";
import {
	adminUsersQuery,
	ashStudentsLookupQuery,
	clientSideImpactQuery,
	generalGoogleFormQuery,
	generalMetadataQuery,
} from "@/lib/react-query/queryOptions";
import { cnMerge } from "@/lib/utils/cn";
import { EMPTY_VALUE_PLACEHOLDER } from "../-components/constants";
import { Main } from "../-components/Main";

type GeneralGoogleFormQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof generalGoogleFormQuery>["queryFn"]>>
>;

type ClientImpactQueryResult = Awaited<
	ReturnType<NonNullable<ReturnType<typeof clientSideImpactQuery>["select"]>>
>;

const GALLERY_FOLDER_OPTIONS = [
	{ label: "ASH Gallery", value: "ASH" },
	{ label: "Outreaches Gallery", value: "OUTREACHES" },
	{ label: "Capacity Building Gallery", value: "CAPACITY_BUILDING" },
] as const satisfies ReadonlyArray<{ label: string; value: (typeof GalleryFolderOptions)[number] }>;

const ADMIN_DEPARTMENT_SELECT_OPTIONS = AdminDepartmentOptions.map((department) => ({
	label: department,
	value: department,
}));

const ADMIN_ROLE_SELECT_OPTIONS = AdminRoleNameOptions.map((role) => ({
	label: role === "superadmin" ? "Super Admin" : "Admin",
	value: role,
}));

function GeneralUploadsPage() {
	const metadataQuery = useQuery(generalMetadataQuery());
	const usersQuery = useQuery(adminUsersQuery());
	const googleFormQuery = useQuery(generalGoogleFormQuery());
	const ashStudentsQuery = useQuery(ashStudentsLookupQuery());
	const clientImpactQuery = useQuery(clientSideImpactQuery());

	const stats = [
		{
			label: "Photos Uploaded",
			value: metadataQuery.data?.data.photosUploaded ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "Active projects",
			value: metadataQuery.data?.data.activeProjects ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{
			label: "Receipts logged",
			value: metadataQuery.data?.data.receiptsLogged ?? EMPTY_VALUE_PLACEHOLDER,
		},
		{ label: "System users", value: metadataQuery.data?.data.systemUsers ?? EMPTY_VALUE_PLACEHOLDER },
	] as const;

	const queryClient = useQueryClient();

	const invalidateGeneralData = () => {
		void queryClient.invalidateQueries({ queryKey: generalMetadataQuery().queryKey });
		void queryClient.invalidateQueries({ queryKey: generalGoogleFormQuery().queryKey });
		void queryClient.invalidateQueries({ queryKey: adminUsersQuery().queryKey });
	};

	return (
		<Main className="gap-6 lg:gap-8">
			<header className="flex flex-col gap-2">
				<h1 className="text-[24px] font-semibold text-cedar-black lg:text-[32px]">
					Content Management
				</h1>

				<p className="max-w-[640px] text-[15px]/[1.45] text-cedar-black/64 lg:text-[18px]">
					Control hub for media, project, receipt, user, form uploads and assigning ASH mentors to
					students
				</p>
			</header>

			<StatsGrid stats={stats} />

			<section className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
				<PhotoUploadCard
					onUploaded={() => {
						invalidateGeneralData();
					}}
				/>

				<ProjectUploadCard
					onUploaded={() => {
						invalidateGeneralData();
					}}
				/>

				<ReceiptUploadCard
					onUploaded={() => {
						invalidateGeneralData();
					}}
				/>

				<UserManagementCard users={usersQuery.data?.data ?? []} onMutated={invalidateGeneralData} />

				<GoogleFormCard
					formRecord={googleFormQuery.data?.data}
					onSaved={() => {
						invalidateGeneralData();
						void queryClient.invalidateQueries({ queryKey: generalGoogleFormQuery().queryKey });
					}}
				/>

				<AssignAshMentorCard
					students={ashStudentsQuery.data ?? []}
					onAssigned={() => {
						void queryClient.invalidateQueries({ queryKey: ashStudentsLookupQuery().queryKey });
					}}
				/>

				<ImpactMetricsCard
					impact={clientImpactQuery.data}
					onSaved={() =>
						void queryClient.invalidateQueries({ queryKey: clientSideImpactQuery().queryKey })
					}
				/>
			</section>
		</Main>
	);
}

function ImpactMetricsCard(props: { impact: ClientImpactQueryResult | undefined; onSaved: () => void }) {
	const { impact, onSaved } = props;
	const form = useForm({
		resolver: zodResolver(backendApiSchemaRoutes["@patch/dashboard/clientsidedata"].body),
		values: {
			ashCommunitiesEngaged: impact?.ash.communitiesEngaged ?? 0,
			ashImprovedGrades: impact?.ash.improvedGrades ?? 0,
			ashStudentsEnrolled: impact?.ash.studentsEnrolled ?? 0,
			ashVolunteers: impact?.ash.volunteers ?? 0,
			capacityOrganizationsPartneredWith: impact?.capacityBuilding.organizationsPartneredWith ?? 0,
			capacityParticipantsImpacted: impact?.capacityBuilding.participantsImpacted ?? 0,
			capacityVolunteersEngaged: impact?.capacityBuilding.volunteersEngaged ?? 0,
			capacityWorkshopsConducted: impact?.capacityBuilding.workshopsConducted ?? 0,
			communitiesImpacted: impact?.home.communitiesImpacted ?? 0,
			outreachesBeneficiariesReached: impact?.outreaches.beneficiariesReached ?? 0,
			outreachesCommunitiesEngaged: impact?.outreaches.communitiesEngaged ?? 0,
			outreachesPartners: impact?.outreaches.partners ?? 0,
			outreachesVolunteers: impact?.outreaches.volunteers ?? 0,
			outreachEvents: impact?.outreaches.outreachEvents ?? 0,
			tacotsCurrentlyInSchools: impact?.tacots.currentlyInSchools ?? 0,
			tacotsEnrolled: impact?.tacots.enrolled ?? 0,
			tacotsGraduated: impact?.tacots.graduated ?? 0,
			tacotsPartnerSchools: impact?.tacots.partnerSchools ?? 0,
			totalBeneficiaries: impact?.home.totalBeneficiaries ?? 0,
			volunteersEngaged: impact?.home.volunteersEngaged ?? 0,
			yearsOfImpact: impact?.home.yearsOfImpact ?? 0,
		},
	});

	const fields = [
		[
			"Home",
			[
				["totalBeneficiaries", "Total Beneficiaries"],
				["communitiesImpacted", "Communities Impacted"],
				["yearsOfImpact", "Years of Impact"],
				["volunteersEngaged", "Volunteers Engaged"],
			],
		],
		[
			"ASH",
			[
				["ashStudentsEnrolled", "Students Enrolled"],
				["ashVolunteers", "Volunteers"],
				["ashCommunitiesEngaged", "Communities Engaged"],
				["ashImprovedGrades", "Improved Grades (%)"],
			],
		],
		[
			"TACOTS",
			[
				["tacotsEnrolled", "Students Enrolled"],
				["tacotsCurrentlyInSchools", "Currently in Schools"],
				["tacotsPartnerSchools", "Partner Schools"],
				["tacotsGraduated", "Graduated"],
			],
		],
		[
			"Outreaches",
			[
				["outreachEvents", "Outreach Events"],
				["outreachesVolunteers", "Volunteers"],
				["outreachesBeneficiariesReached", "Beneficiaries Reached"],
				["outreachesPartners", "Partners"],
				["outreachesCommunitiesEngaged", "Communities Engaged"],
			],
		],
		[
			"Capacity Building",
			[
				["capacityParticipantsImpacted", "Participants Impacted"],
				["capacityWorkshopsConducted", "Workshops Conducted"],
				["capacityVolunteersEngaged", "Volunteers Engaged"],
				["capacityOrganizationsPartneredWith", "Organizations Partnered With"],
			],
		],
	] as const;

	const onSubmit = form.handleSubmit(async (body) => {
		await callBackendApiForQuery("@patch/dashboard/clientsidedata", {
			body,
			meta: { toast: { success: true } },
			onSuccess: onSaved,
		});
	});

	return (
		<UploadCard
			className="lg:col-span-2"
			color="yellow"
			description="Update the impact numbers displayed across the public website"
			title="Client Impact Numbers"
		>
			<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="gap-6">
				<For
					each={fields}
					renderItem={([section, sectionFields]) => (
						<section key={section} className="rounded-[16px] bg-cedar-grey p-4 lg:p-5">
							<h3 className="mb-4 text-[15px] font-semibold text-cedar-black">{section}</h3>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								<For
									each={sectionFields}
									renderItem={([name, label]) => (
										<TextField
											key={name}
											control={form.control}
											name={name}
											label={label}
											placeholder="0"
											type="number"
											min={0}
										/>
									)}
								/>
							</div>
						</section>
					)}
				/>
				<Form.Submit asChild={true}>
					{(formState) => (
						<Button
							theme="secondary"
							size="small"
							isLoading={formState.isSubmitting}
							isDisabled={formState.isSubmitting}
							className="mt-auto ml-auto"
						>
							Save Impact Numbers
						</Button>
					)}
				</Form.Submit>
			</Form.Root>
		</UploadCard>
	);
}

export default GeneralUploadsPage;

function StatsGrid(props: { stats: ReadonlyArray<{ label: string; value: number | string }> }) {
	const { stats } = props;

	return (
		<section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
			<For
				each={stats}
				renderItem={(stat) => (
					<Card.Root
						key={stat.label}
						className="rounded-[20px] border border-cedar-black/10 bg-cedar-white px-5 py-4
							lg:min-h-[132px] lg:px-7 lg:py-6"
					>
						<Card.Content>
							<Card.Title className="text-[28px] font-semibold text-cedar-black lg:text-[38px]">
								{stat.value}
							</Card.Title>

							<Card.Description className="mt-1 text-[13px] text-cedar-black/64 lg:text-[16px]">
								{stat.label}
							</Card.Description>
						</Card.Content>
					</Card.Root>
				)}
			/>
		</section>
	);
}

function PhotoUploadCard(props: { onUploaded: () => void }) {
	const { onUploaded } = props;

	const form = useForm({
		defaultValues: {
			folder: undefined,
			photos: [],
		},
		resolver: zodResolver(GeneralGalleryFrontendSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/general/gallery", {
			body: toFormData(data),
			meta: { toast: { success: true } },
			onSuccess: () => {
				form.reset();
				onUploaded();
			},
			query: { folder: data.folder },
		});
	});

	return (
		<UploadCard color="yellow" description="Media library images" title="Photo Upload">
			<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="h-full gap-5">
				<Form.FieldWithController
					control={form.control}
					name="photos"
					render={({ field }) => (
						<>
							<DropZone.Root
								allowedFileTypes={["image/png", "image/jpg", "image/jpeg", "image/webp"]}
								maxFileCount={10}
								multiple={true}
								onValidationSuccess={(ctx) => {
									toast.success("Success", { description: ctx.message });
								}}
								onValidationError={(ctx) => {
									toast.error("Error", { description: ctx.message });
								}}
								onFilesChange={(ctx) => {
									field.onChange(ctx.fileStateArray.map((fileState) => fileState.file));
								}}
							>
								<DropZone.Area
									classNames={{
										container: `h-[96px] rounded-[14px] border border-dashed
										border-cedar-black/12 bg-cedar-grey text-cedar-black/56
										data-drag-over:bg-cedar-red/10`,
									}}
								>
									<p className="text-[12px] font-medium text-cedar-black/80">
										Drag & Drop or click to upload
									</p>
									<p className="text-[10px] text-cedar-black/40">
										JPG, PNG, WEBP up to 20MB each
									</p>
								</DropZone.Area>

								<DropZone.FileList className="mt-3 grid grid-cols-3 gap-3">
									{(ctx) => (
										<DropZone.FileItem
											key={ctx.fileState.id}
											fileState={ctx.fileState}
											className="relative min-h-[64px] rounded-[12px] border border-dashed
												border-cedar-black/12 bg-cedar-grey p-3"
										>
											<DropZone.FileItemPreview
												className="flex items-center gap-3"
												renderPreview={{
													image: {
														node: (
															<Image
																src={ctx.fileState.preview ?? ""}
																alt={ctx.fileState.file.name ?? "image-preview"}
																className="size-full object-cover"
																width={50}
																height={50}
															/>
														),
													},
												}}
											/>

											<DropZone.FileItemMetadata className="text-[10px] text-cedar-black/64" />

											<DropZone.FileItemDelete className="absolute top-2 right-2">
												<IconBox icon="lucide:x" className="size-4 text-cedar-red" />
											</DropZone.FileItemDelete>
										</DropZone.FileItem>
									)}
								</DropZone.FileList>
							</DropZone.Root>

							<FormErrorMessageShared />
						</>
					)}
				/>

				<SelectField
					label="Photo Location"
					control={form.control}
					name="folder"
					options={GALLERY_FOLDER_OPTIONS}
					placeholder="Photo Location"
				/>

				<Form.Submit asChild={true}>
					{(formState) => (
						<Button
							theme="secondary"
							size="small"
							isLoading={formState.isSubmitting}
							isDisabled={formState.isSubmitting}
							className="mt-auto ml-auto"
						>
							Upload Photo(s)
						</Button>
					)}
				</Form.Submit>
			</Form.Root>
		</UploadCard>
	);
}

function ProjectUploadCard(props: { onUploaded: () => void }) {
	const { onUploaded } = props;

	const form = useForm({
		defaultValues: {
			description: "",
			file: undefined,
			title: "",
		},
		resolver: zodResolver(GeneralProjectFrontendSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/general/projects", {
			body: toFormData(data),
			meta: { toast: { success: true } },
			onSuccess: () => {
				form.reset();

				onUploaded();
			},
		});
	});

	return (
		<UploadCard color="red" description="Dashboard project cards" title="Project Upload">
			<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="h-full gap-5">
				<div className="flex flex-col gap-4 lg:flex-row lg:gap-7">
					<Form.FieldWithController
						control={form.control}
						name="file"
						render={({ field }) => (
							<>
								<DropZoneInput.Root
									className="w-full"
									allowedFileTypes={["image/png", "image/jpg", "image/jpeg", "image/webp"]}
									maxFileCount={1}
									multiple={false}
									onChange={field.onChange}
								>
									<DropZoneInput.Area
										classNames={{
											container: `min-h-[140px] rounded-[14px] border border-dashed
											border-cedar-black/12 bg-cedar-grey text-cedar-black/56 transition-colors
											data-drag-over:bg-cedar-red/10`,
										}}
									>
										<p className="text-[12px] font-medium text-cedar-black/80">
											Project image (optional)
										</p>
										<p className="text-[10px] text-cedar-black/40">
											JPG, PNG, WEBP up to 20MB each
										</p>
									</DropZoneInput.Area>

									<DropZoneInput.ImagePreview
										classNames={{
											listContainer: "border-none",
											listItem: "rounded-[12px] border border-dashed border-cedar-black/12",
										}}
									/>
								</DropZoneInput.Root>

								<FormErrorMessageShared />
							</>
						)}
					/>

					<div className="flex w-full flex-col justify-center gap-3">
						<TextField control={form.control} name="title" placeholder="Project Name/Title..." />

						<TextField
							control={form.control}
							name="description"
							placeholder="Short Project Description..."
						/>
					</div>
				</div>

				<Form.Submit asChild={true}>
					{(formState) => (
						<Button
							theme="secondary"
							size="small"
							isLoading={formState.isSubmitting}
							isDisabled={formState.isSubmitting}
							className="mt-auto ml-auto"
						>
							Add Project
						</Button>
					)}
				</Form.Submit>
			</Form.Root>
		</UploadCard>
	);
}

function ReceiptUploadCard(props: { onUploaded: () => void }) {
	const { onUploaded } = props;

	const form = useForm({
		defaultValues: {
			amount: "",
			description: "",
			file: undefined,
			name: "",
		},
		resolver: zodResolver(GeneralReceiptFrontendSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/general/receipts", {
			body: toFormData(data),
			meta: { toast: { success: true } },
			onSuccess: () => {
				form.reset();

				onUploaded();
			},
		});
	});

	return (
		<UploadCard color="red" description="Financial records log" title="Receipt Upload">
			<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="h-full gap-5">
				<TextField
					label="Receipt name"
					control={form.control}
					name="name"
					placeholder="eg: Nov Stationery purchase..."
				/>

				<div className="flex gap-4">
					<TextField
						label={"Amount (#)"}
						control={form.control}
						name="amount"
						placeholder="0.00"
						type="number"
					/>

					<TextField
						label="Description"
						control={form.control}
						name="description"
						placeholder="What was this expense for..."
					/>
				</div>

				<Form.FieldWithController
					control={form.control}
					name="file"
					render={({ field }) => (
						<>
							<DropZoneInput.Root
								allowedFileTypes={[
									"image/png",
									"image/jpg",
									"image/jpeg",
									"image/webp",
									"application/pdf",
								]}
								maxFileCount={1}
								multiple={false}
								onChange={field.onChange}
							>
								<DropZoneInput.Area
									classNames={{
										container: `h-[104px] rounded-[14px] border border-dashed
										border-cedar-black/12 bg-cedar-grey text-cedar-black/56 transition-colors
										data-drag-over:bg-cedar-red/10`,
									}}
								>
									<p className="text-[12px] font-medium text-cedar-black/80">
										Receipt image or PDF
									</p>
									<p className="text-[12px] text-cedar-black/40">JPG, PNG, or PDF</p>
								</DropZoneInput.Area>

								<DropZoneInput.ImagePreview
									classNames={{
										listContainer: "border-none",
										listItem: "rounded-[12px] border border-dashed border-cedar-black/12",
									}}
								/>
							</DropZoneInput.Root>

							<FormErrorMessageShared />
						</>
					)}
				/>

				<Form.Submit asChild={true}>
					{(formState) => (
						<Button
							theme="secondary"
							size="small"
							isLoading={formState.isSubmitting}
							isDisabled={formState.isSubmitting}
							className="mt-auto ml-auto"
						>
							Log Receipt
						</Button>
					)}
				</Form.Submit>
			</Form.Root>
		</UploadCard>
	);
}

function UserManagementCard(props: {
	onMutated: () => void;
	users: Array<{ department: string; email: string; id: string; name: string }>;
}) {
	const { onMutated, users } = props;

	const userOptions = users.map((user) => ({
		label: user.name,
		value: user.id,
	}));

	return (
		<UploadCard color="yellow" description="Add/Update users" title="User Management">
			<TabsAnimated.Root defaultValue="add-user">
				<TabsAnimated.List
					classNames={{
						highlight: "rounded-[8px] bg-cedar-grey shadow-none",
						list: "h-[64px] w-full rounded-[20px] border border-cedar-black/8 bg-cedar-white p-3",
					}}
				>
					<TabsAnimated.Trigger value="add-user" className="h-10 text-[12px] text-cedar-black/70">
						Add User
					</TabsAnimated.Trigger>
					<TabsAnimated.Trigger value="update-role" className="h-10 text-[12px] text-cedar-black/70">
						Update role
					</TabsAnimated.Trigger>
					<TabsAnimated.Trigger value="delete-user" className="h-10 text-[12px] text-cedar-black/70">
						Delete user
					</TabsAnimated.Trigger>
				</TabsAnimated.List>

				<TabsAnimated.ContentList className="mt-5">
					<TabsAnimated.Content value="add-user" className="flex min-h-[380px] flex-col">
						<AddUserForm onCreated={onMutated} />
					</TabsAnimated.Content>

					<TabsAnimated.Content value="update-role" className="flex min-h-[380px] flex-col">
						<UpdateRoleForm onUpdated={onMutated} userOptions={userOptions} />
					</TabsAnimated.Content>

					<TabsAnimated.Content value="delete-user" className="flex min-h-[380px] flex-col">
						<DeleteUserForm onDeleted={onMutated} userOptions={userOptions} />
					</TabsAnimated.Content>
				</TabsAnimated.ContentList>
			</TabsAnimated.Root>
		</UploadCard>
	);
}

function AddUserForm(props: { onCreated: () => void }) {
	const { onCreated } = props;

	const form = useForm({
		defaultValues: {
			department: null as never,
			email: "",
			name: "",
			password: "",
		},
		resolver: zodResolver(AdminCreateUserFrontendSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/admin/users", {
			body: data,
			meta: { toast: { success: true } },
			onSuccess: () => {
				form.reset();

				onCreated();
			},
		});
	});

	return (
		<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="h-full grow gap-5">
			<TextField
				control={form.control}
				name="name"
				placeholder="e.g: Dora Akunyili"
				label="Full name"
			/>

			<TextField
				control={form.control}
				name="email"
				placeholder="user@cedarrise.org"
				type="email"
				label="Email"
			/>

			<div className="flex flex-col gap-4 lg:flex-row">
				<TextField
					control={form.control}
					name="password"
					placeholder="••••••"
					type="password"
					label="Password"
					classNames={{ base: "w-full" }}
				/>

				<SelectField
					control={form.control}
					name="department"
					options={ADMIN_DEPARTMENT_SELECT_OPTIONS}
					placeholder="Department"
					label="Department"
					classNames={{ base: "w-full" }}
				/>
			</div>

			<Form.Submit asChild={true}>
				{(formState) => (
					<Button
						theme="secondary"
						size="small"
						isLoading={formState.isSubmitting}
						isDisabled={formState.isSubmitting}
						className="mt-auto ml-auto"
					>
						Create user
					</Button>
				)}
			</Form.Submit>
		</Form.Root>
	);
}

function UpdateRoleForm(props: {
	onUpdated: () => void;
	userOptions: Array<{ label: string; value: string }>;
}) {
	const { onUpdated, userOptions } = props;

	const form = useForm({
		defaultValues: {
			roleName: null as never,
			userId: "",
		},
		resolver: zodResolver(
			AdminUserRoleFrontendSchema.extend({ action: z.literal(["assign", "revoke"]) })
		),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@patch/admin/roles/:userId/action", {
			meta: { toast: { success: true } },
			onSuccess: () => {
				form.reset();
				onUpdated();
			},
			params: {
				userId: data.userId,
			},
			query: {
				action: data.action,
				rolename: data.roleName,
			},
		});
	});

	return (
		<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="h-full grow gap-5">
			<SelectField
				control={form.control}
				name="userId"
				options={userOptions}
				placeholder="Select User"
				label="Select User"
			/>

			<SelectField
				control={form.control}
				name="roleName"
				options={ADMIN_ROLE_SELECT_OPTIONS}
				placeholder="Select Role"
				label="Select Role"
			/>

			<div className="mt-auto flex justify-end gap-3">
				<Form.Submit asChild={true}>
					{(formState) => (
						<Button
							theme="secondary-outline"
							size="small"
							isLoading={formState.isSubmitting}
							isDisabled={formState.isSubmitting}
							onClick={() => form.setValue("action", "revoke")}
						>
							Revoke Access
						</Button>
					)}
				</Form.Submit>

				<Form.Submit asChild={true}>
					{(formState) => (
						<Button
							theme="secondary"
							size="small"
							isLoading={formState.isSubmitting}
							isDisabled={formState.isSubmitting}
							onClick={() => form.setValue("action", "assign")}
						>
							Update role
						</Button>
					)}
				</Form.Submit>
			</div>
		</Form.Root>
	);
}

function DeleteUserForm(props: {
	onDeleted: () => void;
	userOptions: Array<{ label: string; value: string }>;
}) {
	const { onDeleted, userOptions } = props;

	const form = useForm({
		defaultValues: {
			userId: undefined,
		},
		resolver: zodResolver(AdminDeleteUserFrontendSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@delete/admin/users/:userId", {
			meta: { toast: { success: true } },
			onSuccess: () => {
				form.reset();
				onDeleted();
			},
			params: { userId: data.userId },
		});
	});

	return (
		<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="h-full grow gap-5">
			<SelectField
				control={form.control}
				name="userId"
				options={userOptions}
				placeholder="Select user to remove"
				label="Select user to remove"
			/>

			<div className="mt-auto flex items-end justify-between gap-4">
				<p
					className="max-w-[320px] rounded-[12px] bg-cedar-red/10 px-4 py-3 text-[12px]/[1.45]
						text-cedar-red"
				>
					Only SuperAdmins can permanently delete users. This action is irreversible.
				</p>

				<Form.Submit asChild={true}>
					{(formState) => (
						<Button
							theme="secondary"
							size="small"
							isLoading={formState.isSubmitting}
							isDisabled={formState.isSubmitting}
							className="shrink-0"
						>
							Delete User
						</Button>
					)}
				</Form.Submit>
			</div>
		</Form.Root>
	);
}

function GoogleFormCard(props: {
	formRecord: GeneralGoogleFormQueryResult["data"] | undefined;
	onSaved: () => void;
}) {
	const { formRecord, onSaved } = props;

	const form = useForm({
		resolver: zodResolver(GoogleFormFrontendSchema),
		values: {
			deadline: formRecord?.deadline?.slice(0, 10) ?? "",
			description: formRecord?.description ?? "",
			title: formRecord?.title ?? "",
			url: formRecord?.src ?? "",
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/general/google-forms", {
			body: data,
			meta: { toast: { success: true } },
			onSuccess: () => {
				onSaved();
			},
		});
	});

	return (
		<UploadCard
			color="yellow"
			description="Embed forms dynamically on the capacity building client page"
			title="Google Form Integration"
		>
			<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="gap-5">
				<div className="grid gap-4 md:grid-cols-2">
					<TextField
						control={form.control}
						name="url"
						label="Google Form URL"
						placeholder="https://forms.google.com/..."
						type="url"
					/>

					<TextField
						control={form.control}
						name="title"
						label="Form title"
						placeholder="Form title"
					/>

					<DateField
						control={form.control}
						name="deadline"
						label="Duration / Deadline"
						placeholder="Duration / Deadline"
					/>

					<TextField
						control={form.control}
						name="description"
						placeholder="Description"
						label="Description"
					/>
				</div>

				<Form.Submit asChild={true}>
					{(formState) => (
						<Button
							theme="secondary"
							size="small"
							isLoading={formState.isSubmitting}
							isDisabled={formState.isSubmitting}
							className="mt-auto ml-auto"
						>
							Embed Form
						</Button>
					)}
				</Form.Submit>
			</Form.Root>
		</UploadCard>
	);
}

function AssignAshMentorCard(props: {
	onAssigned: () => void;
	students: Array<{ id: string; name: string }>;
}) {
	const { onAssigned, students } = props;
	const form = useForm({
		defaultValues: { mentor: "", studentId: "" },
		resolver: zodResolver(z.object({ mentor: z.string().min(3), studentId: z.uuid() })),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@patch/forms/ash/registration/:id/assign-mentor", {
			body: { mentor: data.mentor },
			meta: { toast: { success: true } },
			onSuccess: () => {
				form.reset();
				onAssigned();
			},
			params: { id: data.studentId },
		});
	});

	return (
		<UploadCard
			color="red"
			description="Assign or update an ASH student's mentor"
			title="ASH Mentor Assignment"
		>
			<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="h-full gap-5">
				<SelectField
					control={form.control}
					name="studentId"
					label="ASH Student"
					placeholder="Select student"
					options={students.map((student) => ({ label: student.name, value: student.id }))}
				/>

				<TextField
					control={form.control}
					name="mentor"
					label="Mentor name"
					placeholder="Enter mentor's full name"
				/>

				<Form.Submit asChild={true}>
					{(formState) => (
						<Button
							theme="secondary"
							size="small"
							isLoading={formState.isSubmitting}
							isDisabled={formState.isSubmitting}
							className="mt-auto ml-auto"
						>
							Assign Mentor
						</Button>
					)}
				</Form.Submit>
			</Form.Root>
		</UploadCard>
	);
}

function UploadCard(props: {
	children: React.ReactNode;
	className?: string;
	color: "red" | "yellow";
	description: string;
	title: string;
}) {
	const { children, className, color, description, title } = props;

	return (
		<Card.Root
			className={cnMerge(
				"flex flex-col gap-5 rounded-[24px] bg-cedar-white p-5 lg:rounded-[20px] lg:px-6 lg:py-5.5",
				className
			)}
		>
			<Card.Header className="flex flex-row items-start gap-4">
				<span
					className={cnMerge(
						"mt-0.5 h-[44px] w-2.5 shrink-0 rounded-full",
						color === "yellow" ? "bg-cedar-yellow" : "bg-cedar-red"
					)}
				/>

				<div>
					<Card.Title className="text-[18px] font-semibold text-cedar-black">{title}</Card.Title>
					<Card.Description className="mt-1 text-[12px] text-cedar-black/56">
						{description}
					</Card.Description>
				</div>
			</Card.Header>

			<Card.Content className="grow">{children}</Card.Content>
		</Card.Root>
	);
}
