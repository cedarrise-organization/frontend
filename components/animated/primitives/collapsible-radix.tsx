/* eslint-disable react/no-unstable-default-props */
"use client";

import { createCustomContext, useCallbackRef, useControllableState } from "@zayne-labs/toolkit-react";
import { AnimatePresence, motion, type HTMLMotionProps, type Transition } from "motion/react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { useMemo } from "react";
import { cnMerge } from "@/lib/utils/cn";

type ContextValue = {
	isOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	setOpen: (open: boolean) => void;
};

const [CollapsibleContextProvider, useCollapsibleContext] = createCustomContext<ContextValue>();

function CollapsibleRoot(props: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
	const {
		defaultOpen: defaultOpenProp,
		// eslint-disable-next-line ts-eslint/unbound-method
		onOpenChange: onOpenChangeProp,
		open: openProp,
		...restOfProps
	} = props;

	const [isOpen, setOpen] = useControllableState({
		defaultProp: defaultOpenProp,
		onChange: onOpenChangeProp,
		prop: openProp,
	});

	const onClose = useCallbackRef(() => setOpen(false));
	const onOpen = useCallbackRef(() => setOpen(true));

	const contextValue = useMemo(
		() => ({ isOpen, onClose, onOpen, setOpen }) satisfies ContextValue,
		[onClose, onOpen, isOpen, setOpen]
	);

	return (
		<CollapsibleContextProvider value={contextValue}>
			<CollapsiblePrimitive.Root
				{...restOfProps}
				data-slot="collapsible-root"
				open={isOpen}
				onOpenChange={setOpen}
			/>
		</CollapsibleContextProvider>
	);
}

function CollapsibleTrigger(props: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
	const { className, ...restOfProps } = props;

	return (
		<CollapsiblePrimitive.Trigger
			data-slot="collapsible-trigger"
			className={cnMerge("flex w-full items-center justify-between", className)}
			{...restOfProps}
		/>
	);
}

function CollapsibleContent(
	props: HTMLMotionProps<"li">
		& React.ComponentProps<typeof CollapsiblePrimitive.Content> & {
			keepRendered?: boolean;
			transition?: Transition;
		}
) {
	const {
		children,
		keepRendered = false,
		transition = { duration: 0.35, ease: "easeInOut" },
		...restOfProps
	} = props;

	const { isOpen } = useCollapsibleContext();

	return (
		<AnimatePresence>
			{keepRendered ?
				<CollapsiblePrimitive.Content asChild={true} forceMount={true}>
					<motion.div
						key="collapsible-content"
						data-slot="collapsible-content"
						layout={true}
						initial={{ height: 0, opacity: 0, overflow: "hidden", y: 20 }}
						animate={
							isOpen ?
								{ height: "auto", opacity: 1, overflow: "hidden", y: 0 }
							:	{ height: 0, opacity: 0, overflow: "hidden", y: 20 }
						}
						transition={transition}
						{...restOfProps}
					>
						{children}
					</motion.div>
				</CollapsiblePrimitive.Content>
			:	isOpen && (
					<CollapsiblePrimitive.Content asChild={true} forceMount={true}>
						<motion.div
							key="collapsible-content"
							data-slot="collapsible-content"
							layout={true}
							initial={{ height: 0, opacity: 0, overflow: "hidden", y: 20 }}
							animate={{ height: "auto", opacity: 1, overflow: "hidden", y: 0 }}
							exit={{ height: 0, opacity: 0, overflow: "hidden", y: 20 }}
							transition={transition}
							{...restOfProps}
						>
							{children}
						</motion.div>
					</CollapsiblePrimitive.Content>
				)
			}
		</AnimatePresence>
	);
}

export {
	CollapsibleRoot as Root,
	CollapsibleTrigger as Trigger,
	CollapsibleContent as Content,
	// eslint-disable-next-line react-refresh/only-export-components
	useCollapsibleContext,
};
