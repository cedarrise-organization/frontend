"use client";

import autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { For } from "@/components/common/for";
import { Carousel } from "@/components/ui";
import { cnJoin } from "@/lib/utils/cn";

type GalleryRowItem = {
	image: {
		public_id: string;
		url: string;
	};
	size?: string;
	style?: React.CSSProperties;
};

type MomentsCarouselSharedProps = {
	galleryRow: GalleryRowItem[];
	galleryRowIndex: number;
	imageAlt: string;
};

function MomentsCarouselShared(props: MomentsCarouselSharedProps) {
	const { galleryRow, galleryRowIndex, imageAlt } = props;

	return (
		<Carousel.Root
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
							key={galleryRowItem.image.public_id}
							className={cnJoin(
								"h-[240px] cursor-grab active:cursor-grabbing lg:h-[300px]",
								galleryRowItem.size,
								galleryRowItemIndex === galleryRow.length - 1 && "pr-5"
							)}
							style={galleryRowItem.style}
						>
							<Image
								id={galleryRowItem.image.public_id}
								src={galleryRowItem.image.url}
								width={100}
								height={100}
								alt={imageAlt}
								className="size-full rounded-[24px] object-cover lg:rounded-[32px]"
							/>
						</Carousel.Item>
					)}
				/>
			</Carousel.Content>
		</Carousel.Root>
	);
}

export { MomentsCarouselShared };
