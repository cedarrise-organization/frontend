"use client";

import { useQuery } from "@tanstack/react-query";
import {
	MomentsCarouselShared,
	TestimonialCarouselShared,
} from "@/app/(home)/-components/CarouselsShared";
import { ForWithWrapper } from "@/components/common/for";
import { capacityBuildingCarouselsQuery } from "@/lib/react-query/queryOptions";
import { chunkArray } from "@/lib/utils/common";

export function CapacityBuildingMomentsCarousel() {
	const capacityBuildingMomentsCarouselsQueryResult = useQuery(capacityBuildingCarouselsQuery());

	const galleryRows = chunkArray(capacityBuildingMomentsCarouselsQueryResult.data?.data, 3);

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
					imageAlt="Capacity building moment"
				/>
			)}
		/>
	);
}

const capacityBuildingTestimonials = [
	{
		quote: "I've always been a pessimist until now, this programme opened my eyes to my abilities and how much people can actually do if they put their miss to things",
		title: "I. H, Participant",
	},
	{
		quote: "Learning becomes easy when it is child-centered and made fun using technology",
		title: "S.C, Member of Management Team",
	},
	{
		quote: "I think this opportunity should be sung in the ears of the young girls, but the main problem is if they would listen. And I liked the way we were always reminded to apply the things we learnt in our everyday, it's really helpful",
		title: "A.A, Participant",
	},
	{
		quote: "The training was an eye-opener for me. I got to learn that people already suffer from some of the symptoms mentioned today yet they are unaware but being part of this training I believe I can help the society at large",
		title: "C.C, Teacher, Hillrange Primary School",
	},
	{
		quote: "I was very surprised to hear that diabetes in children is not as rare as I always thought. This training has made me realize that there can be people with this ailment around us even in my class and it's up to me as a teacher to encourage them to get medical advice.",
		title: "C.S, Teacher, Osisatech Boys’ Secondary School",
	},
	{
		quote: "I have become more participative in group activities and have even started personally planning events and projects",
		title: "L. I, Participant",
	},
];

export function CapacityBuildingTestimonialCarousel() {
	return <TestimonialCarouselShared className="lg:mt-12" testimonials={capacityBuildingTestimonials} />;
}
