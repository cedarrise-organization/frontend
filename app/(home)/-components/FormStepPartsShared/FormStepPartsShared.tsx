"use client";

import { Steps } from "@ark-ui/react/steps";
import { tw } from "@zayne-labs/toolkit-core";
import dynamic from "next/dynamic";
import type { UseFormStateReturn } from "react-hook-form";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink, type MainAppRoutes } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cnJoin } from "@/lib/utils/cn";
import type { StepItemsArray } from "./utils";

type StepItemProps = {
	items: StepItemsArray;
};

// eslint-disable-next-line react-refresh/only-export-components
export const FormStepList = dynamic(
	() =>
		Promise.resolve((props: StepItemProps) => {
			const { items } = props;

			return (
				<Steps.List className="flex justify-center px-[60px]">
					<For
						each={items}
						renderItem={(stepItem, index) => (
							<Steps.Item
								key={stepItem.title}
								index={index}
								className={cnJoin("flex items-center", index !== 0 && "w-full")}
							>
								{index !== 0 && (
									<Steps.Separator
										className="h-0.5 w-full bg-cedar-red/40 data-current:bg-cedar-red"
									/>
								)}

								<Steps.Trigger
									className="grid size-4 place-content-center rounded-full outline-none lg:size-6"
								>
									<Steps.Indicator
										className="size-4 rounded-full border-2 border-cedar-red bg-cedar-white
											data-complete:bg-cedar-red/40 data-current:bg-cedar-red lg:size-6"
									/>
								</Steps.Trigger>
							</Steps.Item>
						)}
					/>
				</Steps.List>
			);
		}),
	{ ssr: false }
);

// eslint-disable-next-line react-refresh/only-export-components
export const FormStepMainContent = dynamic(
	() =>
		Promise.resolve((props: StepItemProps) => {
			const { items } = props;

			return (
				<For
					each={items}
					renderItem={(stepItem, index) => (
						<Steps.Content
							key={stepItem.title}
							index={index}
							className="flex flex-col gap-10"
							suppressHydrationWarning={true}
						>
							<stepItem.StepComponent />
						</Steps.Content>
					)}
				/>
			);
		}),
	{ ssr: false }
);

const onScrollToTop = () => {
	window.scrollTo({ top: 0 });
};

// eslint-disable-next-line react-refresh/only-export-components
export const FormStepFooter = dynamic(
	() =>
		Promise.resolve(
			(props?: {
				onError?: (ctx: Pick<UseFormStateReturn<Record<string, unknown>>, "errors">) => void;
				onGoToNextStep?: () => void;
				onGoToPrevStep?: () => void;
			}) => {
				const { onError, onGoToNextStep, onGoToPrevStep } = props ?? {};

				const btnClassName = tw`text-[12px]`;

				return (
					<Steps.Context>
						{(context) => (
							<div className="flex justify-end gap-3">
								{context.hasPrevStep && (
									<Steps.PrevTrigger asChild={true}>
										<Button
											className={btnClassName}
											onClick={() => {
												onGoToPrevStep?.();
												onScrollToTop();
											}}
										>
											Back
										</Button>
									</Steps.PrevTrigger>
								)}

								{context.hasNextStep && (
									<Form.Submit asChild={true}>
										{({ errors, isValid }) => (
											<Button
												className={btnClassName}
												onClick={() => {
													if (!isValid) {
														onError?.({ errors });
														return;
													}

													context.goToNextStep();
													onGoToNextStep?.();
													onScrollToTop();
												}}
											>
												Next
											</Button>
										)}
									</Form.Submit>
								)}

								{context.isCompleted && (
									<Form.Submit asChild={true}>
										{(formState) => (
											<Button
												className={btnClassName}
												isLoading={formState.isSubmitting}
												isDisabled={formState.isSubmitting}
											>
												Submit
											</Button>
										)}
									</Form.Submit>
								)}
							</div>
						)}
					</Steps.Context>
				);
			}
		),
	{ ssr: false }
);

export function FormStepComponentSectionHeader(props: { title: string }) {
	const { title } = props;

	return (
		<header className="flex items-center justify-between gap-6">
			<h2 className="shrink-0 leading-[1.2] lg:text-[24px]">{title}</h2>
			<p className="text-[8px]/3 text-cedar-black/64 max-lg:max-w-[132px] lg:text-[12px]/4">
				*Please fill information correctly according to field tag
			</p>
		</header>
	);
}

export function FormPageHeader(props: { href: MainAppRoutes; title: string }) {
	const { href, title } = props;

	return (
		<header
			className="flex w-full items-center gap-5 rounded-[12px] bg-cedar-black p-3 text-cedar-white
				lg:rounded-[20px] lg:p-5"
		>
			<Button asChild={true} theme="secondary" size="icon" className="shrink-0">
				<NavLink href={href}>
					<IconBox icon="ph:arrow-left" />
				</NavLink>
			</Button>

			<h1 className="w-full text-center text-[20px]/[1.2] lg:text-[32px]">{title}</h1>
		</header>
	);
}
