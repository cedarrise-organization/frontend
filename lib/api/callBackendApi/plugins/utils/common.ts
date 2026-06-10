import type { ResponseErrorContext } from "@zayne-labs/callapi";
import { isHTTPError } from "@zayne-labs/callapi/utils";
import { hardNavigate, isBrowser } from "@zayne-labs/toolkit-core";
import type { ExtractUnion } from "@zayne-labs/toolkit-type-helpers";
import type { MainAppRoutes } from "@/components/common/NavLink";
import type { BaseApiErrorResponse } from "../../apiSchema";

export const isAuthError = (error: ResponseErrorContext["error"]) => {
	return isHTTPError(error) && error.originalError.response.status === 401;
};

const REDIRECT_AUTH_ERROR_APP_CODES = new Set(["UNAUTHORIZED"] as const);

export const isAuthErrorThatNeedsRedirect = (
	error: ResponseErrorContext<{ ErrorData: BaseApiErrorResponse }>["error"]
) => {
	if (!isAuthError(error) || !error.errorData.error.code) {
		return false;
	}

	// FIXME - error.code should be typed according to what exists in backend, not string/number
	return REDIRECT_AUTH_ERROR_APP_CODES.has(
		error.errorData.error.code as ExtractUnion<typeof REDIRECT_AUTH_ERROR_APP_CODES>
	);
};

export const redirectTo = (route: MainAppRoutes) => hardNavigate(route, "replace");

export const isPathnameMatchingRoute = (route: string) => {
	if (!isBrowser()) {
		return false;
	}

	const pathname = globalThis.location.pathname;

	const isRouteWithCatchAll = route.endsWith("/**");

	if (isRouteWithCatchAll) {
		const routeWithoutCatchAll = route.slice(0, -3);

		return pathname === routeWithoutCatchAll || pathname.startsWith(`${routeWithoutCatchAll}/`);
	}

	return pathname === route;
};
