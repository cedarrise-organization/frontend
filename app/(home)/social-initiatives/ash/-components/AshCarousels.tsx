"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
	MomentsCarouselShared,
	TestimonialCarouselShared,
} from "@/app/(home)/-components/CarouselsShared";
import { ForWithWrapper } from "@/components/common/for";
import { ashCarouselsQuery } from "@/lib/react-query/queryOptions";
import { chunkArray } from "@/lib/utils/common";

export function AshMomentsCarousel() {
	const ashCarouselsQueryResult = useQuery(ashCarouselsQuery());

	const galleryRows = useMemo(
		() => chunkArray(ashCarouselsQueryResult.data?.data, 3),
		[ashCarouselsQueryResult.data?.data]
	);

	return (
		<ForWithWrapper
			as="article"
			className="flex min-h-[700px] flex-col gap-3 overflow-hidden lg:gap-5"
			each={galleryRows}
			renderItem={(galleryRow, galleryRowIndex) => (
				<MomentsCarouselShared
					key={galleryRowIndex}
					galleryRow={galleryRow}
					galleryRowIndex={galleryRowIndex}
					imageAlt="ASH moment"
				/>
			)}
		/>
	);
}

const stories = [
	{
		quote: "Knowing this project is by undergraduates makes it even more inspiring. I can only imagine the dedication it took to make it a reality. I'm grateful that my sisters have mentors who are genuinely invested in their growth and future. Thank you for making such a meaningful difference.",
		title: "P. E., ASH Beneficiary's Guardian",
	},
	{
		quote: "I was truly impressed by the consistency and commitment of the volunteers in educating these girls. My encouragement to the girls is to make the most of every opportunity to learn, and I also urge fellow parents to stay actively involved in their children's educational journey.",
		title: "ASH Beneficiary's Mother",
	},
	{
		quote: "Education is one of the greatest gifts we can give a child. I deeply appreciate your hard work and dedication to ensuring these young girls have access to learning and opportunities that will shape their future.",
		title: "ASH Beneficiary's Father",
	},
	{
		quote: "Volunteering with this initiative has helped me become more confident in public speaking. It's been incredibly fulfilling to contribute to the growth and development of younger girls while growing personally through the experience.",
		title: "R. E., Volunteer, ASH",
	},
	{
		quote: "This experience has transformed me in so many ways. I've developed greater patience, improved my time management, and learned the importance of self-discipline. It has changed my perspective on life, and my hope is that every girl we serve grows into the very best version of herself.",
		title: "K. O., Volunteer, ASH",
	},
];

export function AshStoriesCarousel() {
	return <TestimonialCarouselShared testimonials={stories} />;
}
