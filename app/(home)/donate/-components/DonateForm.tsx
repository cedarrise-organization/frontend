"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState } from "nuqs";
import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import { backendApiSchemaRoutes, DonateSupportAreaOptions } from "@/lib/api/callBackendApi/apiSchema";
import { CheckboxQuestionField, TextAreaField, TextField } from "../../-components/FormPartsShared";

const DonateFormSchema = backendApiSchemaRoutes["@post/donate"].body;

function DonateFormImpl() {
	const [messageQuery, setMessageQuery] = useQueryState("message");

	const [errorQuery, setErrorQuery] = useQueryState("error");

	useEffect(() => {
		if (messageQuery) {
			toast.success(messageQuery);
			void setMessageQuery(null);
			return;
		}

		if (errorQuery) {
			toast.error(errorQuery);
			void setErrorQuery(null);
		}
	}, [messageQuery, errorQuery, setMessageQuery, setErrorQuery]);

	const form = useForm({
		defaultValues: {
			amount: "",
			comment: "",
			email: "",
			name: "",
		},
		resolver: zodResolver(DonateFormSchema),
	});

	const router = useRouter();

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/donate", {
			body: data,
			meta: { toast: { success: true } },
			onSuccess: (ctx) => {
				router.push(ctx.data.data.data.authorization_url);
				form.reset();
			},
		});
	});

	return (
		<Form.Root form={form} onSubmit={(event) => void onSubmit(event)} className="gap-5">
			<Form.Field control={form.control} name="amount">
				<Form.Label className="text-[14px] text-cedar-black/86 lg:text-[14px]">
					Donation amount
				</Form.Label>
				<Form.InputGroup className="gap-4">
					<Form.Input
						type="number"
						className="h-[54px] rounded-[12px] bg-cedar-grey px-9 text-[14px]
							placeholder:text-cedar-black/56 lg:h-[64px] lg:text-[14px]"
					/>

					<Form.InputGroupAddon
						className="size-[54px] shrink-0 rounded-[12px] bg-cedar-grey text-[10px] text-cedar-black
							lg:size-[64px] lg:text-[14px]"
					>
						NGN
					</Form.InputGroupAddon>
				</Form.InputGroup>
			</Form.Field>

			<TextField control={form.control} name="name" placeholder="Full Name" />

			<TextField control={form.control} name="email" placeholder="E-mail" type="email" />

			<CheckboxQuestionField
				control={form.control}
				name="supportAreas"
				question="Support areas"
				options={DonateSupportAreaOptions.map((option) => ({
					label: option.replaceAll("_", " "),
					value: option,
				}))}
			/>

			<TextAreaField control={form.control} name="comment" label="Note / Comment" />

			<Form.Submit asChild={true}>
				{(formState) => (
					<Button
						isLoading={formState.isSubmitting}
						isDisabled={formState.isSubmitting}
						className="mt-5 self-end px-8"
					>
						Donate
					</Button>
				)}
			</Form.Submit>
		</Form.Root>
	);
}

function DonateForm() {
	return (
		<Suspense>
			<DonateFormImpl />
		</Suspense>
	);
}

export { DonateForm };
