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
			className="flex min-h-[700px] flex-col gap-3 overflow-hidden lg:gap-5"
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
		quote: "This was one of the most practical and teacher-friendly workshops I've ever attended. It inspired me to apply what I've learned and make a meaningful difference in my school and community.",
		title: "Teacher Participant, Teachers' Training ",
	},
	{
		quote: "The training changed my understanding of diabetes in children. I now know how to recognize warning signs and support affected learners with empathy.",
		title: "A. A., Teacher, Participant, Teachers' Training",
	},
		{
		quote: "CedarPrize equipped me with practical skills in fundraising, proposal writing, teamwork, conflict management, and community outreach. It has empowered me to lead initiatives with confidence.",
		title: "A. U., Participant,  CedarPrize",
	},
	{
		quote: "Having dedicated time for team bonding during camp made the experience even more meaningful.",
		title: "S. I., Participant, CedarEdge",
	},
	{
		quote: "The Digital Literacy Bootcamp made technology less intimidating. I especially enjoyed learning Excel functions and now feel much more confident using a computer and preparing for CBT exams.",
		title: "K. E., Beneficiary, E-Learning for all by Magenta Heart",
	},
	{
		quote: "The training was practical, engaging, and easy to understand. I gained valuable digital skills and would gladly recommend it to other students.",
		title: "M. O., Beneficiary, E-Learning for all by Magenta Heart",
	},
];

export function CapacityBuildingTestimonialCarousel() {
	return <TestimonialCarouselShared className="lg:mt-8" testimonials={capacityBuildingTestimonials} />;
}
