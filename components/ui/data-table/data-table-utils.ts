import type { Column } from "@tanstack/react-table";
import { dataTableConfig } from "./data-table-config";
import type { ExtendedColumnFilter, FilterOperator, FilterVariant } from "./data-table-types";

export function getColumnPinningStyle<TData>({
	column,
	withBorder = false,
}: {
	column: Column<TData>;
	withBorder?: boolean;
}): React.CSSProperties {
	const isPinned = column.getIsPinned();
	const isLastLeftPinnedColumn = isPinned === "left" && column.getIsLastColumn("left");
	const isFirstRightPinnedColumn = isPinned === "right" && column.getIsFirstColumn("right");
	const boxShadow =
		withBorder && isLastLeftPinnedColumn ? "-4px 0 4px -4px var(--border) inset"
			// eslint-disable-next-line unicorn/no-nested-ternary
		: withBorder && isFirstRightPinnedColumn ? "4px 0 4px -4px var(--border) inset"
		: undefined;

	return {
		background: "var(--background)",
		boxShadow,
		left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
		opacity: isPinned ? 0.97 : 1,
		position: isPinned ? "sticky" : "relative",
		right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
		width: column.getSize(),
		zIndex: isPinned ? 1 : undefined,
	};
}

export function getFilterOperators(filterVariant: FilterVariant) {
	const operatorMap: Record<FilterVariant, Array<{ label: string; value: FilterOperator }>> = {
		boolean: dataTableConfig.booleanOperators,
		date: dataTableConfig.dateOperators,
		dateRange: dataTableConfig.dateOperators,
		multiSelect: dataTableConfig.multiSelectOperators,
		number: dataTableConfig.numericOperators,
		range: dataTableConfig.numericOperators,
		select: dataTableConfig.selectOperators,
		text: dataTableConfig.textOperators,
	};

	// eslint-disable-next-line ts-eslint/no-unnecessary-condition
	return operatorMap[filterVariant] ?? dataTableConfig.textOperators;
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
	const operators = getFilterOperators(filterVariant);

	return operators[0]?.value ?? (filterVariant === "text" ? "iLike" : "eq");
}

export function getValidFilters<TData>(
	filters: Array<ExtendedColumnFilter<TData>>
): Array<ExtendedColumnFilter<TData>> {
	return filters.filter((filter) => {
		if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") return true;

		if (Array.isArray(filter.value)) return filter.value.length > 0;

		// eslint-disable-next-line ts-eslint/no-unnecessary-condition
		return filter.value !== "" && filter.value !== null && filter.value !== undefined;
	});
}
