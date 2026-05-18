"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

function ContactForm() {
	const form = useForm({
		defaultValues: {
			email: "",
			feedback: "",
			fullName: "",
		},
	});

	return (
		<Form.Root form={form} className="flex w-full flex-col gap-4 lg:max-w-[590px] lg:gap-5">
			<Form.Field control={form.control} name="fullName">
				<Form.Input
					className="h-[54px] rounded-[12px] bg-[hsl(0,0%,94%)] px-9 text-[10px]
						placeholder:text-cedar-black/40 lg:text-[14px]"
					placeholder="Full Name"
				/>
			</Form.Field>

			<Form.Field control={form.control} name="email">
				<Form.Input
					className="h-[54px] rounded-[12px] bg-[hsl(0,0%,94%)] px-9 text-[10px]
						placeholder:text-cedar-black/40 lg:text-[14px]"
					placeholder="E-mail"
				/>
			</Form.Field>
			<Form.Field control={form.control} name="feedback">
				<Form.Label className="text-[10px] text-cedar-black/64 lg:text-[14px]">Feedback</Form.Label>
				<Form.TextArea
					className="min-h-[132px] rounded-[12px] bg-[hsl(0,0%,94%)] px-9 py-3 text-[10px]
						placeholder:text-cedar-black/40 lg:text-[14px]"
				/>
			</Form.Field>

			<Form.Submit asChild={true}>
				<Button className="px-8 lg:self-end">Submit Feedback</Button>
			</Form.Submit>
		</Form.Root>
	);
}

export { ContactForm };
