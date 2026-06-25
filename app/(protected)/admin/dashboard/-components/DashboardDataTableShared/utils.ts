import { omitKeys } from "@zayne-labs/toolkit-core";
import { isArray, isBoolean, isNumber, isString } from "@zayne-labs/toolkit-type-helpers";
import { parseAsInteger, useQueryState } from "nuqs";
import { getSortingStateParser } from "@/components/ui/data-table/data-table-parsers";
import { OrderByOptions } from "@/lib/api/callBackendApi/apiSchema";
import { EMPTY_VALUE_PLACEHOLDER } from "../constants";

export const useDashboardDataTableQueryState = <const TSortBy extends string>(props: {
	pageKey: string;
	perPageKey: string;
	sortableColumnIds: TSortBy[];
	sortKey: string;
}) => {
	const { pageKey, perPageKey, sortableColumnIds, sortKey } = props;

	const [page] = useQueryState(pageKey, parseAsInteger.withDefault(1));
	const [limit] = useQueryState(perPageKey, parseAsInteger.withDefault(10));
	const [sorting] = useQueryState(
		sortKey,
		getSortingStateParser<Record<TSortBy, unknown>>(sortableColumnIds).withDefault([])
	);

	const activeSort = sorting[0];

	return {
		limit,
		orderBy: activeSort?.desc ? OrderByOptions[1] : OrderByOptions[0],
		page,
		sortBy: activeSort?.id,
	};
};

export const formatDashboardDetailValue = (value: unknown): string => {
	if (value === null || value === undefined || value === "") {
		return EMPTY_VALUE_PLACEHOLDER;
	}

	if (isBoolean(value)) {
		return value ? "True" : "False";
	}

	if (isArray(value)) {
		return value.map((item) => formatDashboardDetailValue(item)).join(", ");
	}

	if (isNumber(value) || isString(value)) {
		return String(value);
	}

	return EMPTY_VALUE_PLACEHOLDER;
};

export const getDashboardDetailRows = <
	TRecord extends { createdAt?: unknown; deletedAt?: unknown; id?: unknown; updatedAt?: unknown },
>(
	record: TRecord | undefined
) => {
	if (!record) {
		return [];
	}

	return Object.entries(omitKeys(record, ["deletedAt", "id", "updatedAt"]))
		.filter(([key]) => !key.endsWith("PublicId"))
		.map(([key, value]) => ({
			label: key.split(/(?=[A-Z])/).join(" "),
			url: key.endsWith("Url") && isString(value) ? value : undefined,
			value: formatDashboardDetailValue(value),
		}));
};
