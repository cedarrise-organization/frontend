import { isBrowser, on } from "@zayne-labs/toolkit-core";
import { useLayoutEffect, useState } from "react";

const useIsMobile = (options?: { enable?: boolean; mobileBreakpoint?: number }) => {
	const { enable = true, mobileBreakpoint = 768 } = options ?? {};

	const [isMobile, setIsMobile] = useState(
		() => enable && isBrowser() && window.innerWidth < mobileBreakpoint
	);

	useLayoutEffect(() => {
		if (!enable) return;

		const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);

		// eslint-disable-next-line react/set-state-in-effect
		const onChange = () => setIsMobile(window.innerWidth < mobileBreakpoint);

		const cleanup = on(mql, "change", onChange);

		onChange();

		return () => cleanup();
	}, [mobileBreakpoint, enable]);

	return isMobile;
};

export { useIsMobile };
