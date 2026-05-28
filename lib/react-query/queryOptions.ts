import { queryOptions } from "@tanstack/react-query";
import { callBackendApiForQuery } from "../api/callBackendApi";

export const capacityBuildingCarouselsQuery = () => {
	return queryOptions({
		queryFn: () => {
			return callBackendApiForQuery("@get/carousels/capacity-building", {
				query: { limit: 80 },
			});
		},
		queryKey: ["carousels", "capacity-building"],
		staleTime: Infinity,
	});
};

export const ashCarouselsQuery = () => {
	return queryOptions({
		queryFn: () => {
			return callBackendApiForQuery("@get/carousels/ash", {
				query: { limit: 80 },
			});
		},
		queryKey: ["carousels", "ash"],
		staleTime: Infinity,
	});
};

export const outreachesCarouselsQuery = () => {
	return queryOptions({
		queryFn: () => {
			return callBackendApiForQuery("@get/carousels/outreaches", {
				query: { limit: 80 },
			});
		},
		queryKey: ["carousels", "outreaches"],
		staleTime: Infinity,
	});
};

export const tacotsCarouselsQuery = () => {
	return queryOptions({
		queryFn: () => {
			return callBackendApiForQuery("@get/carousels/tacots", {
				query: { limit: 80 },
			});
		},
		queryKey: ["carousels", "tacots"],
		staleTime: Infinity,
	});
};
