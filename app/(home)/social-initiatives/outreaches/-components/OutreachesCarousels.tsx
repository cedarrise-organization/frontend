"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { MomentsCarouselShared } from "@/app/(home)/-components/CarouselsShared";
import { ForWithWrapper } from "@/components/common/for";
import { outreachesCarouselsQuery } from "@/lib/react-query/queryOptions";
import { chunkArray } from "@/lib/utils/common";

function OutreachesMomentsCarousel() {
	const outreachesCarouselsQueryResult = useQuery(outreachesCarouselsQuery());

	const galleryRows = useMemo(
		() => chunkArray(outreachesCarouselsQueryResult.data?.data, 3),
		[outreachesCarouselsQueryResult.data?.data]
	);

	return (
		<ForWithWrapper
			as="article"
			className="flex flex-col gap-3 overflow-hidden lg:gap-5"
			each={galleryRows}
			renderItem={(galleryRow, galleryRowIndex) => (
				<MomentsCarouselShared
					key={galleryRowIndex}
					galleryRow={galleryRow}
					galleryRowIndex={galleryRowIndex}
					imageAlt="Outreach moment"
				/>
			)}
		/>
	);
}

export { OutreachesMomentsCarousel };
