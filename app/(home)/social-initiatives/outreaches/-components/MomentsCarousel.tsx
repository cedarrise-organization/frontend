"use client";

import { tw } from "@zayne-labs/toolkit-core";
import autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { heroImg, impactSectionImg } from "@/assets/images/social-initiatives/outreaches";
import { For } from "@/components/common/for";
import { Carousel } from "@/components/ui";
import { cnJoin } from "@/lib/utils/cn";

type GalleryItem = {
	image: string;
	size: string;
};

const galleryRows: GalleryItem[][] = [
	[
		{ image: heroImg, size: tw`w-1/3` },
		{ image: impactSectionImg, size: tw`w-2/3` },
		{ image: heroImg, size: tw`w-1/3` },
	],
	[
		{ image: impactSectionImg, size: tw`w-1/4` },
		{ image: heroImg, size: tw`w-3/4` },
		{ image: impactSectionImg, size: tw`w-2/4` },
	],
	[
		{ image: heroImg, size: tw`w-[40%]` },
		{ image: impactSectionImg, size: tw`w-[60%]` },
	],
];

function MomentsCarousel() {
	return (
		<div className="flex flex-col gap-3 overflow-hidden lg:gap-5">
			<For
				each={galleryRows}
				renderItem={(galleryRow, galleryRowIndex) => (
					<Carousel.Root
						key={galleryRowIndex}
						className="w-full"
						options={{ loop: true }}
						plugins={[
							autoplay({
								delay: 2000 + galleryRowIndex * 400,
								stopOnFocusIn: true,
								stopOnInteraction: false,
								stopOnMouseEnter: true,
							}),
						]}
					>
						<Carousel.Content className="-mr-3 gap-3 select-none lg:-mr-5 lg:gap-5">
							<For
								each={galleryRow}
								renderItem={(galleryRowItem, galleryRowItemIndex) => (
									<Carousel.Item
										key={galleryRowItemIndex}
										className={cnJoin(
											"h-[240px] cursor-grab active:cursor-grabbing lg:h-[305px]",
											galleryRowItem.size,
											galleryRowItemIndex === galleryRow.length - 1 && "pr-5"
										)}
									>
										<Image
											src={galleryRowItem.image}
											alt="Outreach moment"
											className="size-full rounded-[24px] object-cover lg:rounded-[32px]"
										/>
									</Carousel.Item>
								)}
							/>
						</Carousel.Content>
					</Carousel.Root>
				)}
			/>
		</div>
	);
}

export { MomentsCarousel };
