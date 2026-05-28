"use client";

import { useQuery } from "@tanstack/react-query";
import { tw } from "@zayne-labs/toolkit-core";
import { MomentsCarouselShared } from "@/app/(home)/-components/MomentsCarouselShared";
import { TestimonialCarouselShared } from "@/app/(home)/-components/TestimonialCarouselShared";
import { ForWithWrapper } from "@/components/common/for";
import { ashCarouselsQuery } from "@/lib/react-query/queryOptions";
import { chunkArray } from "@/lib/utils/common";

export function AshMomentsCarousel() {
	const ashCarouselsQueryResult = useQuery(ashCarouselsQuery());

	const galleryRows = chunkArray(ashCarouselsQueryResult.data?.data, 3).map((chunk) =>
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
					imageAlt="ASH moment"
				/>
			)}
		/>
	);
}

const stories = [
	{
		quote: "Seeing that this project was pioneered by undergraduates, I would like to commend them because I know it wasn't easy. I’m happy that my sisters have people out there who are also intentional about their growth. I'm extremely thankful",
		title: "P.E. (A beneficiary's guardian)",
	},
	{
		quote: "I was amazed at the consistency and love for the girls had taken educating these girls. I encourage the girls to learn as much as they can from their teachers. I also encourage my fellow parents to follow up their children",
		title: "(A beneficiary's mother)",
	},
	{
		quote: "Education is one of the important things a growing child should be exposed to. That's why I am really grateful for your hard work and dedication to providing for these young girls",
		title: "(A beneficiary’s father)",
	},
	{
		quote: "In the course of volunteering, I've become more confident in speaking in public, and I’m happy I could be of help to the development of girls younger than me",
		title: "R. E, Volunteer",
	},
	{
		quote: "This experience has shaped me more as a person, I've learnt to be more patient, time management and self control. I see things from a different view now from what I've known all my life. For the girls, I hope they become the best version of themselves",
		title: "K. O, Volunteer",
	},
];

export function AshStoriesCarousel() {
	return <TestimonialCarouselShared testimonials={stories} />;
}
