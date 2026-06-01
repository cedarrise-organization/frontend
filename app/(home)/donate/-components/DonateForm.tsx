"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { backendApiSchemaRoutes } from "@/lib/api/callBackendApi/apiSchema";
import { TextAreaField, TextField } from "../../-components/FormPartsShared";

const DonateFormSchema = backendApiSchemaRoutes["@post/donate"].body;

function DonateForm() {
	const form = useForm({
		defaultValues: {
			amount: "",
			comment: "",
			email: "",
			name: "",
		},
		resolver: zodResolver(DonateFormSchema),
	});

	return (
		<Form.Root form={form} className="gap-5">
			<Form.Field control={form.control} name="amount">
				<Form.InputGroup className="gap-4">
					<Form.Input
						type="number"
						className="h-[54px] rounded-[12px] bg-[hsl(0,0%,94%)] px-9 text-[12px]
							placeholder:text-cedar-black/40 lg:h-[64px] lg:text-[14px]"
						placeholder="Input Amount you wish to donate"
					/>

					<Form.InputRightItem
						className="size-[54px] shrink-0 rounded-[12px] bg-[hsl(0,0%,94%)] text-[10px]
							text-cedar-black lg:size-[64px] lg:text-[14px]"
					>
						NGN
					</Form.InputRightItem>
				</Form.InputGroup>
			</Form.Field>

			<TextField control={form.control} name="name" placeholder="Full Name" />

			<TextField control={form.control} name="email" placeholder="E-mail" type="email" />

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

export { DonateForm };
