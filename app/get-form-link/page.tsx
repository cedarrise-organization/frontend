"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsString, parseAsStringLiteral, useQueryState, useQueryStates } from "nuqs";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { CheckboxQuestionField, TextField } from "@/app/(home)/-components/FormPartsShared";
import { FormPageHeader } from "@/app/(home)/-components/FormStepPartsShared";
import { Main } from "@/app/(home)/-components/Main";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import {
	backendApiSchemaRoutes,
	PartnerInterestOptions,
	ProgramLinkProgramOptions,
	ProgramLinkTypeOptions,
} from "@/lib/api/callBackendApi/apiSchema";

const SendLinksInitiativeSchema = backendApiSchemaRoutes["@post/send-links/initiatives"].body;
const SendLinksPartnerSchema = backendApiSchemaRoutes["@post/send-links/partners"].body;

function GetFormLinkPageImpl() {
	const [fromQueryState] = useQueryState("from", parseAsString.withDefault("/"));

	const [programQueryState] = useQueryStates({
		program: parseAsStringLiteral([...ProgramLinkProgramOptions, "PARTNER"]).withDefault("PARTNER"),
		type: parseAsStringLiteral(ProgramLinkTypeOptions).withDefault("REGISTRATION"),
	});

	const router = useRouter();

	const form = useForm({
		defaultValues: {
			email: "",
			name: "",
		},
		resolver: zodResolver(
			(programQueryState.program === "PARTNER" ?
				SendLinksPartnerSchema
			:	SendLinksInitiativeSchema) as typeof SendLinksInitiativeSchema & typeof SendLinksPartnerSchema
		),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery(
			programQueryState.program === "PARTNER" ?
				"@post/send-links/partners"
			:	"@post/send-links/initiatives",
			{
				body: data,
				meta: {
					toast: {
						customSuccessMessage: "Request received successfully! We will contact you soon",
						success: true,
					},
				},
				onSuccess: () => {
					router.replace(fromQueryState);
				},
				query: programQueryState,
			}
		);
	});

	const namePlaceholder = (() => {
		if (programQueryState.program === "ASH") return "Student's name";

		if (programQueryState.program === "TACOTS") return "Child's name";

		return "Name";
	})();

	const formType = programQueryState.type === "REGISTRATION" ? "Registration" : "Feedback";

	return (
		<div className="flex min-h-svh w-full flex-col items-center bg-cedar-grey">
			<Main className="max-w-[1300px] items-center gap-6 pt-5 lg:gap-10">
				<FormPageHeader
					href={fromQueryState as never}
					replace={true}
					title={
						programQueryState.program === "PARTNER" ?
							`Fill this form to Partner with us`
						:	`Fill this form to get the ${programQueryState.program} ${formType} link`
					}
				/>

				<Form.Root
					form={form}
					onSubmit={(event) => void onSubmit(event)}
					className="w-full max-w-[380px] gap-5 rounded-[24px] bg-cedar-white p-5 lg:max-w-[670px]
						lg:rounded-[32px] lg:p-10"
				>
					<TextField control={form.control} name="name" placeholder={namePlaceholder} />

					<TextField control={form.control} name="email" placeholder="Email" type="email" />

					{programQueryState.program === "PARTNER" && (
						<CheckboxQuestionField
							control={form.control}
							name="option"
							question="How do you want to Partner?"
							options={PartnerInterestOptions}
						/>
					)}

					<Form.Submit asChild={true}>
						{(formState) => (
							<Button
								isLoading={formState.isSubmitting}
								isDisabled={formState.isSubmitting}
								className="mt-5 shrink-0 self-end"
							>
								{programQueryState.program === "PARTNER" ?
									"Partner with us"
								:	`Get the ${formType} link`}
							</Button>
						)}
					</Form.Submit>
				</Form.Root>
			</Main>
		</div>
	);
}

export default function GetFormLinkPage() {
	return (
		<Suspense>
			<GetFormLinkPageImpl />
		</Suspense>
	);
}
