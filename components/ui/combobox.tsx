"use client";

import { dataAttr } from "@zayne-labs/toolkit-core";
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

type ComboboxContextType = {
	data: ComboboxData[];
	inputValue: string;
	onOpenChange: (open: boolean) => void;
	onValueChange: (value: string) => void;
	open: boolean;
	setInputValue: (value: string) => void;
	setWidth: (width: number) => void;
	type: string;
	value: string;
	width: number;
};

const [ComboboxContextProvider, useComboboxContext] = createCustomContext<ComboboxContextType>({
	name: "ComboboxContext",
});

type ComboboxProps = React.ComponentProps<typeof Popover.Root> & {
	data: ComboboxData[];
	defaultValue?: string;
	onOpenChange?: (open: boolean) => void;
	onValueChange?: (value: string) => void;
	open?: boolean;
	type: string;
	value?: string;
};

function ComboboxRoot(props: ComboboxProps) {
	const {
		data,
		defaultOpen = false,
		defaultValue,
		onOpenChange: onOpenChangeProp,
		onValueChange: onValueChangeProp,
		open: openProp,
		type,
		value: valueProp,
		...restOfProps
	} = props;

	const [value, onValueChange] = useControllableState({
		defaultProp: defaultValue,
		onChange: onValueChangeProp,
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
			onOpenChange,
			onValueChange,
			open,
			setInputValue,
			setWidth,
			type,
			value,
			width,
		}),
		[data, inputValue, onOpenChange, onValueChange, open, type, value, width]
	);

	return (
		<ComboboxContextProvider value={contextValue}>
			<Popover.Root {...restOfProps} open={open} onOpenChange={onOpenChange} />
		</ComboboxContextProvider>
	);
}

function ComboboxTrigger(
	props: ShadcnButtonProps & {
		children?:
			| React.ReactNode
			| ((ctx: {
					resolvedValue: string | undefined;
					selectedOption: ComboboxData | undefined;
			  }) => React.ReactNode);
		classNames?: { base?: string; icon?: string };
		icon?: string;
		placeholder?: string | ((ctx: Pick<ComboboxContextType, "type">) => string);
	}
) {
	const { children, className, classNames, icon, placeholder, ...restOfProps } = props;

	const { data, setWidth, type, value } = useComboboxContext();

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

	const selectedOption = data.find((item) => item.value === value);

	const resolvedPlaceholder =
		isFunction(placeholder) ? placeholder({ type }) : (placeholder ?? `Select ${type}...`);

	const resolvedValue = value ? selectedOption?.label : resolvedPlaceholder;

	const resolvedChildren = isFunction(children) ? children({ resolvedValue, selectedOption }) : children;

	return (
		<Popover.Trigger asChild={true}>
			<button
				type="button"
				data-placeholder={dataAttr(!value)}
				{...restOfProps}
				className={cnMerge(shadcnButtonVariants({ className, variant: "outline" }), classNames?.base)}
				ref={elementRef}
			>
				{resolvedChildren ?? (
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

function ComboboxItem(props: React.ComponentProps<typeof Command.Item>) {
	const { onSelect, ...restOfProps } = props;

	const { onOpenChange, onValueChange } = useComboboxContext();

	return (
		<Command.Item
			onSelect={(currentValue) => {
				onValueChange(currentValue);
				onOpenChange(false);
				onSelect?.(currentValue);
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
	ComboboxRoot as Root,
	ComboboxTrigger as Trigger,
	ComboboxContent as Content,
	ComboboxInput as Input,
	ComboboxList as List,
	ComboboxEmpty as Empty,
	ComboboxGroup as Group,
	ComboboxItem as Item,
	ComboboxSeparator as Separator,
	ComboboxCreateNew as CreateNew,
};
