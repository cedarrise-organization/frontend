"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextAreaField, TextField } from "./FormPartsShared";

function ContactForm() {
	const form = useForm({
		defaultValues: {
			email: "",
			feedback: "",
		},
	});

	return (
		<Form.Root form={form} className="flex w-full flex-col gap-4 lg:max-w-[590px] lg:gap-5">
			<TextField control={form.control} name="email" type="email" placeholder="E-mail" />

			<TextAreaField control={form.control} name="feedback" label="Feedback" />

			<Form.Submit asChild={true}>
				<Button className="px-8 lg:self-end">Submit Feedback</Button>
			</Form.Submit>
		</Form.Root>
	);
}

export { ContactForm };
