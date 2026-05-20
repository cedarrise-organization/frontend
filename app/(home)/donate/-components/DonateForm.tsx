"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

function DonateForm() {
	const form = useForm({
		defaultValues: {
			amount: "",
			comment: "",
			email: "",
			fullName: "",
		},
	});

	return (
		<Form.Root form={form} className="gap-5">
			<Form.Field control={form.control} name="amount">
				<Form.InputGroup className="gap-4">
					<Form.Input
						inputMode="decimal"
						type="number"
						className="h-[64px] w-full rounded-[12px] bg-[hsl(0,0%,94%)] px-6 text-[10px]
							placeholder:text-cedar-black/40 lg:px-9 lg:text-[14px]"
						placeholder="Input Amount you wish to donate"
					/>

					<span
						className="grid size-[64px] shrink-0 place-content-center rounded-[12px]
							bg-[hsl(0,0%,94%)] text-[10px] text-cedar-black lg:text-[14px]"
					>
						NGN
					</span>
				</Form.InputGroup>
			</Form.Field>

			<Form.Field control={form.control} name="fullName">
				<Form.Input
					className="h-[64px] rounded-[12px] bg-[hsl(0,0%,94%)] px-6 text-[10px]
						placeholder:text-cedar-black/40 lg:px-9 lg:text-[14px]"
					placeholder="Full Name"
				/>
			</Form.Field>

			<Form.Field control={form.control} name="email">
				<Form.Input
					type="email"
					className="h-[64px] rounded-[12px] bg-[hsl(0,0%,94%)] px-6 text-[10px]
						placeholder:text-cedar-black/40 lg:px-9 lg:text-[14px]"
					placeholder="E-mail"
				/>
			</Form.Field>

			<Form.Field control={form.control} name="comment">
				<Form.TextArea
					className="min-h-[124px] rounded-[12px] bg-[hsl(0,0%,94%)] px-6 py-4 text-[10px]
						placeholder:text-cedar-black/40 lg:px-9 lg:text-[14px]"
					placeholder="Note / Comment"
				/>
			</Form.Field>

			<Form.Submit asChild={true}>
				<Button className="mt-5 self-end px-8">Donate</Button>
			</Form.Submit>
		</Form.Root>
	);
}

export { DonateForm };
