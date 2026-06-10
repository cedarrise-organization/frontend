"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TextField } from "@/app/(home)/-components/FormPartsShared";
import { FormPageHeader } from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(home)/-components/Main";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import { backendApiSchemaRoutes } from "@/lib/api/callBackendApi/apiSchema";

const AdminSignInSchema = backendApiSchemaRoutes["@post/auth/login"].body;

function AdminSignInPage() {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(AdminSignInSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/auth/login", {
			body: data,
			meta: { toast: { success: true } },
			onSuccess: () => {
				router.push("/admin/dashboard");
			},
		});
	});

	return (
		<div className="flex min-h-svh w-full flex-col items-center bg-cedar-grey">
			<Main className="items-center gap-6 lg:gap-10">
				<FormPageHeader href="/" title="Admin Login" />

				<Form.Root
					form={form}
					onSubmit={(event) => void onSubmit(event)}
					className="w-full gap-4 rounded-[24px] bg-cedar-white p-4 lg:max-w-[670px] lg:gap-5
						lg:rounded-[32px] lg:p-10"
				>
					<TextField control={form.control} name="email" placeholder="Email" type="email" />
					<TextField control={form.control} name="password" placeholder="Password" type="password" />

					<Form.Submit asChild={true}>
						{(formState) => (
							<Button
								isLoading={formState.isSubmitting}
								isDisabled={formState.isSubmitting}
								className="mt-2 self-end lg:mt-5"
							>
								Login
							</Button>
						)}
					</Form.Submit>
				</Form.Root>
			</Main>
		</div>
	);
}

export default AdminSignInPage;
