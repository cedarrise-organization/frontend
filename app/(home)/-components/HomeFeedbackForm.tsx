"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import { backendApiSchemaRoutes } from "@/lib/api/callBackendApi/apiSchema";
import { TextAreaField, TextField } from "./FormPartsShared";

const HomeFeedbackFormSchema = backendApiSchemaRoutes["@post/feedback/home"].body;

function HomeFeedbackForm() {
	const form = useForm({
		defaultValues: {
			email: "",
			feedback: "",
		},
		resolver: zodResolver(HomeFeedbackFormSchema),
	});

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/feedback/home", {
			body: data,
			meta: { toast: { success: true } },
			onSuccess: () => {
				form.reset();
			},
		});
	});

	return (
		<Form.Root
			form={form}
			onSubmit={(event) => void onSubmit(event)}
			className="flex w-full max-w-[590px] flex-col gap-4 lg:gap-5"
		>
			<TextField control={form.control} name="email" type="email" placeholder="E-mail" />

			<TextAreaField control={form.control} name="feedback" label="Feedback" />

			<Form.Submit asChild={true}>
				<Button className="px-8 lg:self-start lg:px-10.5">Submit Feedback</Button>
			</Form.Submit>
		</Form.Root>
	);
}

export { HomeFeedbackForm };
