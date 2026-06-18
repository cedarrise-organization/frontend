"use client";

import { dataAttr, toArray } from "@zayne-labs/toolkit-core";
import { createCustomContext, useControllableState } from "@zayne-labs/toolkit-react";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Command from "@/components/ui/command";
import { shadcnButtonVariants, type ShadcnButtonProps } from "@/components/ui/constants";
import * as Popover from "@/components/ui/popover";
import { cnMerge } from "@/lib/utils/cn";
import { IconBox } from "../common/IconBox";

type ComboboxData = {
	label: string;
	value: string;
};

type ComboboxMode = "multiple" | "single";
type ComboboxValue = string | string[];

type ComboboxContextType = {
	data: ComboboxData[];
	inputValue: string;
	mode: ComboboxMode;
	onOpenChange: (open: boolean) => void;
	onValueChange: (value: ComboboxValue) => void;
	open: boolean;
	setInputValue: (value: string) => void;
	setWidth: (width: number) => void;
	shouldCloseOnSelect?: boolean;
	type: string;
	value: ComboboxValue;
	width: number;
};

const [ComboboxContextProvider, useComboboxContext] = createCustomContext<ComboboxContextType>({
	name: "ComboboxContext",
});

const getDerivedContextValues = (options: Pick<ComboboxContextType, "data" | "value">) => {
	const { data, value } = options;

	const selectedValues = toArray(value || []);
	const selectedOptions = data.filter((item) => selectedValues.includes(item.value));

	return {
		selectedOptions,
		selectedValues,
	};
};

type ComboboxBaseProps = Pick<ComboboxContextType, "data" | "shouldCloseOnSelect" | "type">
	& React.ComponentProps<typeof Popover.Root> & {
		onOpenChange?: (open: boolean) => void;
		open?: boolean;
	};

type ComboboxSingleProps = ComboboxBaseProps & {
	defaultValue?: string;
	mode?: "single";
	onValueChange?: (value: string) => void;
	value?: string;
};

type ComboboxMultipleProps = ComboboxBaseProps & {
	defaultValue?: string[];
	mode: "multiple";
	onValueChange?: (value: string[]) => void;
	value?: string[];
};

type ComboboxProps = ComboboxMultipleProps | ComboboxSingleProps;

function ComboboxRoot(props: ComboboxProps) {
	const {
		data,
		defaultOpen = false,
		defaultValue,
		mode = "single",
		onOpenChange: onOpenChangeProp,
		onValueChange: onValueChangeProp,
		open: openProp,
		shouldCloseOnSelect,
		type,
		value: valueProp,
		...restOfProps
	} = props;

	const [value, onValueChange] = useControllableState<ComboboxValue>({
		defaultProp: defaultValue ?? (mode === "multiple" ? [] : ""),
		onChange: (newValue) => {
			const resolvedValues = toArray(newValue);
			if (mode === "multiple") {
				onValueChangeProp?.(resolvedValues as never);
				return;
			}

			onValueChangeProp?.((toArray(newValue)[0] ?? "") as never);
		},
		prop: valueProp,
	});

	const [open, onOpenChange] = useControllableState({
		defaultProp: defaultOpen,
		onChange: onOpenChangeProp,
		prop: openProp,
	});

	const [width, setWidth] = useState(200);

	const [inputValue, setInputValue] = useState("");

	const contextValue = useMemo(
		() => ({
			data,
			inputValue,
			mode,
			onOpenChange,
			onValueChange,
			open,
			setInputValue,
			setWidth,
			shouldCloseOnSelect: shouldCloseOnSelect ?? mode === "single",
			type,
			value,
			width,
		}),
		[shouldCloseOnSelect, data, inputValue, mode, onOpenChange, onValueChange, open, type, value, width]
	);

	return (
		<ComboboxContextProvider value={contextValue}>
			<Popover.Root {...restOfProps} open={open} onOpenChange={onOpenChange} />
		</ComboboxContextProvider>
	);
}

function ComboboxContext(props: {
	children: (
		ctx: ComboboxContextType & {
			selectedOptions: ComboboxData[];
			selectedValues: string[];
		}
	) => React.ReactNode;
}) {
	const { children } = props;

	const contextValues = useComboboxContext();

	const derivedContextValues = getDerivedContextValues(contextValues);

	return children({
		...contextValues,
		...derivedContextValues,
	});
}

function ComboboxTrigger(
	props: ShadcnButtonProps & {
		classNames?: { base?: string; icon?: string };
		icon?: string;
		placeholder?: string | ((ctx: Pick<ComboboxContextType, "type">) => string);
	}
) {
	const { children, className, classNames, icon, placeholder, ...restOfProps } = props;

	const { data, setWidth, type, value } = useComboboxContext();

	const { selectedOptions, selectedValues } = getDerivedContextValues({ data, value });

	const elementRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		// Create a ResizeObserver to detect width changes
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const newWidth = (entry.target as HTMLElement).offsetWidth;

				if (!newWidth) continue;

				setWidth(newWidth);
			}
		});

		if (elementRef.current) {
			resizeObserver.observe(elementRef.current);
		}

		// Clean up the observer when component unmounts
		return () => {
			resizeObserver.disconnect();
		};
	}, [setWidth]);

	const resolvedPlaceholder =
		isFunction(placeholder) ? placeholder({ type }) : (placeholder ?? `Select ${type}...`);

	const resolvedValue = selectedValues.length > 0 ? selectedOptions[0]?.label : resolvedPlaceholder;

	return (
		<Popover.Trigger asChild={true}>
			<button
				type="button"
				data-placeholder={dataAttr(selectedValues.length === 0)}
				{...restOfProps}
				className={cnMerge(shadcnButtonVariants({ className, variant: "outline" }), classNames?.base)}
				ref={elementRef}
			>
				{children ?? (
					<>
						<p>{resolvedValue}</p>

						<IconBox
							// eslint-disable-next-line ts-eslint/no-unnecessary-condition
							icon={(icon as never) ?? "lucide:chevrons-up-down"}
							className={cnMerge("size-4 shrink-0 text-shadcn-muted-foreground", classNames?.icon)}
						/>
					</>
				)}
			</button>
		</Popover.Trigger>
	);
}

function ComboboxContent(
	props: React.ComponentProps<typeof Command.Root> & {
		popoverOptions?: React.ComponentProps<typeof Popover.Content>;
	}
) {
	const { className, popoverOptions, ...restOfProps } = props;
	const { width } = useComboboxContext();

	return (
		<Popover.Content className={cnMerge("p-0", className)} style={{ width }} {...popoverOptions}>
			<Command.Root {...restOfProps} />
		</Popover.Content>
	);
}

function ComboboxInput(
	props: Omit<React.ComponentProps<typeof Command.Input>, "placeholder"> & {
		defaultValue?: string;
		onValueChange?: (value: string) => void;
		placeholder?: string | ((ctx: Pick<ComboboxContextType, "type">) => string);
		value?: string;
	}
) {
	const {
		defaultValue,
		onValueChange: onValueChangeProp,
		placeholder,
		value: valueProp,
		...restOfProps
	} = props;

	const { inputValue, setInputValue, type } = useComboboxContext();

	const [value, onValueChange] = useControllableState({
		defaultProp: defaultValue ?? inputValue,
		onChange: (newValue) => {
			setInputValue(newValue);
			onValueChangeProp?.(newValue);
		},
		prop: valueProp,
	});

	const resolvedPlaceholder =
		isFunction(placeholder) ? placeholder({ type }) : (placeholder ?? `Search ${type}...`);

	return (
		<Command.Input
			onValueChange={onValueChange}
			placeholder={resolvedPlaceholder}
			value={value}
			{...restOfProps}
		/>
	);
}

function ComboboxList(props: React.ComponentProps<typeof Command.List>) {
	return <Command.List {...props} />;
}

function ComboboxEmpty(
	props: Omit<React.ComponentProps<typeof Command.Empty>, "children"> & {
		children?: string | ((ctx: Pick<ComboboxContextType, "type">) => string);
	}
) {
	const { children, ...restOfProps } = props;

	const { type } = useComboboxContext();

	const resolvedChildren = isFunction(children) ? children({ type }) : (children ?? `No ${type} found.`);

	return <Command.Empty {...restOfProps}>{resolvedChildren}</Command.Empty>;
}

function ComboboxGroup(props: React.ComponentProps<typeof Command.Group>) {
	return <Command.Group {...props} />;
}

function getNextComboboxValue(
	params: Pick<ComboboxContextType, "data" | "mode" | "value"> & {
		selectedValue: string;
	}
) {
	const { data, mode, selectedValue, value } = params;

	if (mode === "multiple") {
		const { selectedValues } = getDerivedContextValues({ data, value });

		const resolvedValues =
			selectedValues.includes(selectedValue) ?
				selectedValues.filter((v) => v !== selectedValue)
			:	[...selectedValues, selectedValue];

		return resolvedValues;
	}

	return selectedValue;
}

function ComboboxItem(props: React.ComponentProps<typeof Command.Item> & { shouldSetValue?: boolean }) {
	const { onSelect, shouldSetValue = true, ...restOfProps } = props;

	const { data, mode, onOpenChange, onValueChange, shouldCloseOnSelect, value } = useComboboxContext();

	return (
		<Command.Item
			onSelect={(selectedValue) => {
				if (!shouldSetValue) {
					onSelect?.(selectedValue);
					return;
				}

				const nextValue = getNextComboboxValue({ data, mode, selectedValue, value });

				onValueChange(nextValue);

				if (shouldCloseOnSelect) {
					onOpenChange(false);
				}

				onSelect?.(selectedValue);
			}}
			{...restOfProps}
		/>
	);
}

function ComboboxSeparator(props: React.ComponentProps<typeof Command.Separator>) {
	return <Command.Separator {...props} />;
}

type ComboboxCreateNewProps = {
	children?: (inputValue: string) => React.ReactNode;
	className?: string;
	onCreateNew: (value: string) => void;
};

function ComboboxCreateNew(props: ComboboxCreateNewProps) {
	const { children, className, onCreateNew } = props;

	const { inputValue, onOpenChange, onValueChange, type } = useComboboxContext();

	if (!inputValue.trim()) {
		return null;
	}

	const handleCreateNew = () => {
		onCreateNew(inputValue.trim());
		onValueChange(inputValue.trim());
		onOpenChange(false);
	};

	return (
		<button
			className={cnMerge(
				`relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm
				outline-none select-none aria-selected:bg-shadcn-accent
				aria-selected:text-shadcn-accent-foreground data-disabled:pointer-events-none
				data-disabled:opacity-50`,
				className
			)}
			onClick={handleCreateNew}
			type="button"
		>
			{children ?
				children(inputValue)
			:	<>
					<IconBox icon="lucide:plus" className="size-4 text-shadcn-muted-foreground" />
					<span>{`Create new ${type}: "${inputValue}"`}</span>
				</>
			}
		</button>
	);
}

export {
	ComboboxContent as Content,
	ComboboxContext as Context,
	ComboboxCreateNew as CreateNew,
	ComboboxEmpty as Empty,
	ComboboxGroup as Group,
	ComboboxInput as Input,
	ComboboxItem as Item,
	ComboboxList as List,
	ComboboxRoot as Root,
	ComboboxSeparator as Separator,
	ComboboxTrigger as Trigger,
};
