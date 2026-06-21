"use client";

import { useQuery } from "@tanstack/react-query";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { sessionQuery } from "@/lib/react-query/queryOptions";

function ProtectedTemplate({ children }: LayoutProps<"/">) {
	const sessionQueryResult = useQuery(sessionQuery());

	if (!sessionQueryResult.data) {
		return <LoadingScreen />;
	}

	return children;
}

export default ProtectedTemplate;
