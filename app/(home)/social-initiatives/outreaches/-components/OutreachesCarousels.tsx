"use client";

import { useQuery } from "@tanstack/react-query";
import { tw } from "@zayne-labs/toolkit-core";
import { MomentsCarouselShared } from "@/app/(home)/-components/MomentsCarouselShared";
import { ForWithWrapper } from "@/components/common/for";
import { outreachesCarouselsQuery } from "@/lib/react-query/queryOptions";
import { chunkArray } from "@/lib/utils/common";

function OutreachesMomentsCarousel() {
	const outreachesCarouselsQueryResult = useQuery(outreachesCarouselsQuery());

	const galleryRows = chunkArray(outreachesCarouselsQueryResult.data?.data, 3).map((chunk) =>
		chunk.map((image) => ({
			image,
			size: tw`w-(--image-width)`,
			style: { "--image-width": `30%` } as React.CSSProperties,
		}))
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
