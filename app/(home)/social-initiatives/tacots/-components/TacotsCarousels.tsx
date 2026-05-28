"use client";

import { useQuery } from "@tanstack/react-query";
import { tw } from "@zayne-labs/toolkit-core";
import { MomentsCarouselShared } from "@/app/(home)/-components/MomentsCarouselShared";
import { TestimonialCarouselShared } from "@/app/(home)/-components/TestimonialCarouselShared";
import { ForWithWrapper } from "@/components/common/for";
import { tacotsCarouselsQuery } from "@/lib/react-query/queryOptions";
import { chunkArray } from "@/lib/utils/common";

function TacotsMomentsCarousel() {
	const tacotsCarouselsQueryResult = useQuery(tacotsCarouselsQuery());

	const galleryRows = chunkArray(tacotsCarouselsQueryResult.data?.data, 3).map((chunk) =>
		chunk.map((image) => ({
			image,
			size: tw`w-(--image-width)`,
			style: { "--image-width": `30%` } as React.CSSProperties,
		}))
	);

	return (
		<ForWithWrapper
			className="flex flex-col gap-3 overflow-hidden lg:gap-5"
			each={galleryRows}
			renderItem={(galleryRow, galleryRowIndex) => (
				<MomentsCarouselShared
					key={galleryRowIndex}
					galleryRow={galleryRow}
					galleryRowIndex={galleryRowIndex}
					imageAlt="TACOTS moment"
				/>
			)}
		/>
	);
}

const stories = [
	{
		quote: "This scholarship has helped my family in countless ways I cannot fully express. I am overjoyed and grateful, and I pray that the sponsors are blessed in all they do, with abundant rewards and protection from the Lord.",
		title: "E.O (Mother of Beneficiary)",
	},
	{
		quote: "Since my son began this scholarship, I have seen remarkable changes in him—he has grown, is eager to learn, and even asked to join a holiday learning program. I am grateful to God and the sponsors, and I pray they are blessed with good health and more opportunities to do good",
		title: "N.C (Father of Beneficiary)",
	},
	{
		quote: "After losing my husband, I could not imagine how to train my daughter, but this scholarship came as God’s answer to my prayers. My daughter has changed positively—she is calmer, listens to corrections, and reads more, though still playful as a child. I am deeply thankful to the sponsors for remembering families like mine and pray that God strengthens and blesses them for all they have done.",
		title: "A.I (Mother of Beneficiary)",
	},
	{
		quote: "This sponsorship has helped my parents by paying my school fees, and I am happy to be in JSS2. I thank my sponsors for supporting me, and I always keep them in my prayers.",
		title: "C. E (Student, St. Vincent de Paul Seminary, JSS2)",
	},
	{
		quote: "The sponsorship has lifted a financial burden from my family and has given me a better academic environment to grow in. I thank the sponsors sincerely and pray God blesses them with long life and endless favor.",
		title: "P.A (Student, Holy Rosary High School, JSS2)",
	},
	{
		quote: "This scholarship has lifted the heavy financial load from my mother, leaving her only with minor costs. I am very happy and thankful, and I pray that the good Lord blesses the sponsors for all they’ve done.",
		title: "A.P  (Student, St. Vincent de Paul Seminary, JSS2)",
	},
];

function TacotsStoriesCarousel() {
	return <TestimonialCarouselShared testimonials={stories} />;
}

export { TacotsMomentsCarousel, TacotsStoriesCarousel };
