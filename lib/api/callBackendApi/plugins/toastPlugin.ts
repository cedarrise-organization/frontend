import type {
	CallApiResultErrorVariant,
	CallApiResultSuccessVariant,
	ErrorContext,
	RequestContext,
	SuccessContext,
} from "@zayne-labs/callapi";
import { definePlugin, isHTTPError } from "@zayne-labs/callapi/utils";
import { isBrowser, toArray } from "@zayne-labs/toolkit-core";
import { isArray, isFunction, isObject, isString } from "@zayne-labs/toolkit-type-helpers";
import { toast } from "sonner";
import type { MainAppRoutes } from "@/components/common/NavLink";
import type { BackendApiRouteKeys, BaseApiErrorResponse, BaseApiSuccessResponse } from "../apiSchema";
import { isPathnameMatchingRoute } from "./utils/common";

type RoutePattern = Array<`${MainAppRoutes}/**` | `${string}/**` | MainAppRoutes>;

type MessagesType = string | string[];

export type ToastPluginMeta = {
	toast?: {
		customErrorMessage?:
			| MessagesType
			| ((error: CallApiResultErrorVariant<BaseApiErrorResponse>["error"]) => MessagesType);
		customSuccessMessage?:
			| MessagesType
			| ((data: CallApiResultSuccessVariant<BaseApiSuccessResponse>["data"]) => MessagesType);
		endpointsToSkip?: Array<{
			endpoints: BackendApiRouteKeys[];
			on: "error" | "errorAndSuccess" | "success";
			routesExclude?: RoutePattern;
			routesInclude?: RoutePattern;
		}>;
		error?: boolean;
		errorAndSuccess?: boolean;
		errorsToSkip?: Array<CallApiResultErrorVariant<unknown>["error"]["name"]>;
		errorsToSkipCondition?: (
			error: CallApiResultErrorVariant<BaseApiErrorResponse>["error"]
		) => boolean | undefined;
		success?: boolean;
	};
};

const getHTTPErrorMessages = (errorData: BaseApiErrorResponse) => {
	const { details, message } = errorData.error;

	if (!isArray(details)) {
		return toArray(message);
	}

	const detailMessages = details
		.filter(
			(detail): detail is { message: string } =>
				isObject<Record<string, unknown>>(detail) && isString(detail.message)
		)
		.map((detail) => detail.message);

	return detailMessages.length > 0 ? detailMessages : toArray(message);
};

export const toastPlugin = (toastOptions?: ToastPluginMeta["toast"]) => {
	const getToastMetaAndDerivatives = (ctx: RequestContext<{ Meta: ToastPluginMeta }>) => {
		const toastMeta =
			toastOptions ? { ...toastOptions, ...ctx.options.meta?.toast } : ctx.options.meta?.toast;

		const shouldEndpointBeSkipped = (options: {
			initURL: string | undefined;
			type: "error" | "success";
		}) => {
			const { initURL, type } = options;

			return Boolean(
				toastMeta?.endpointsToSkip?.some((entry) => {
					const onMatches = entry.on === type || entry.on === "errorAndSuccess";

					if (
						!onMatches
						|| initURL == null
						|| !entry.endpoints.includes(initURL as BackendApiRouteKeys)
					) {
						return false;
					}

					const isRouteExcluded =
						entry.routesExclude ?
							entry.routesExclude.some((pattern) => isPathnameMatchingRoute(pattern))
						:	false;

					const isRouteIncluded =
						entry.routesInclude ?
							entry.routesInclude.some((pattern) => isPathnameMatchingRoute(pattern))
						:	true;

					return !isRouteExcluded && isRouteIncluded;
				})
			);
		};

		const resolveErrorToastMessages = (
			error: CallApiResultErrorVariant<BaseApiErrorResponse>["error"]
		) => {
			const { customErrorMessage } = toastMeta ?? {};

			if (customErrorMessage) {
				return isFunction(customErrorMessage) ?
						toArray(customErrorMessage(error))
					:	toArray(customErrorMessage);
			}

			if (isHTTPError(error)) {
				return getHTTPErrorMessages(error.errorData);
			}

			return toArray(error.message);
		};

		const resolveSuccessToastMessages = (
			data: CallApiResultSuccessVariant<BaseApiSuccessResponse>["data"]
		) => {
			const { customSuccessMessage } = toastMeta ?? {};

			if (customSuccessMessage) {
				return isFunction(customSuccessMessage) ?
						toArray(customSuccessMessage(data))
					:	toArray(customSuccessMessage);
			}

			return toArray(data.message);
		};

		return {
			resolveErrorToastMessages,
			resolveSuccessToastMessages,
			shouldEndpointBeSkipped,
			toastMeta,
		};
	};

	return definePlugin({
		id: "toast-plugin",
		name: "toastPlugin",

		// eslint-disable-next-line perfectionist/sort-objects
		hooks: {
			onError: (ctx: ErrorContext<{ ErrorData: BaseApiErrorResponse }>) => {
				if (!isBrowser()) return;

				const { resolveErrorToastMessages, shouldEndpointBeSkipped, toastMeta } =
					getToastMetaAndDerivatives(ctx);

				const initURL = ctx.options.initURL;

				const shouldSkipErrorToast =
					shouldEndpointBeSkipped({ initURL, type: "error" })
					|| (toastMeta?.errorsToSkip?.includes(ctx.error.name) ?? false)
					|| (toastMeta?.errorsToSkipCondition?.(ctx.error) ?? false);

				const isErrorToastEnabled = toastMeta?.error ?? toastMeta?.errorAndSuccess;

				if (shouldSkipErrorToast || !isErrorToastEnabled) return;

				const errorMessages = resolveErrorToastMessages(ctx.error);

				errorMessages.forEach((message) => toast.error(message));
			},

			onSuccess: (ctx: SuccessContext<{ Data: BaseApiSuccessResponse }>) => {
				if (!isBrowser()) return;

				const { resolveSuccessToastMessages, shouldEndpointBeSkipped, toastMeta } =
					getToastMetaAndDerivatives(ctx);

				const initURL = ctx.options.initURL;

				const shouldSkipSuccessToast = shouldEndpointBeSkipped({ initURL, type: "success" });

				const isSuccessToastEnabled = toastMeta?.success ?? toastMeta?.errorAndSuccess;

				if (shouldSkipSuccessToast || !isSuccessToastEnabled) return;

				const successMessages = resolveSuccessToastMessages(ctx.data);

				successMessages.forEach((message) => toast.success(message));
			},
		},
	});
};
