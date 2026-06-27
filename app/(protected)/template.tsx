"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { sessionQuery } from "@/lib/react-query/queryOptions";

function ProtectedTemplate({ children }: LayoutProps<"/">) {
	const router = useRouter();

	const sessionQueryResult = useQuery(
		sessionQuery({
			auth: { redirectFn: (route) => router.replace(route) },
		})
	);

	if (!sessionQueryResult.data) {
		return <LoadingScreen />;
	}

	return children;
}

export default ProtectedTemplate;
