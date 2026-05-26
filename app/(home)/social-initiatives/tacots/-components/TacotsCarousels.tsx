"use client";

import { tw } from "@zayne-labs/toolkit-core";
import autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { approachSectionImg, heroImg } from "@/assets/images/social-initiatives/tacots";
import { For } from "@/components/common/for";
import { Carousel } from "@/components/ui";
import { cnJoin } from "@/lib/utils/cn";

type GalleryItem = {
	image: string;
	size: string;
};

const galleryRows: GalleryItem[][] = [
	[
		{ image: heroImg, size: tw`w-[60%]` },
		{ image: approachSectionImg, size: tw`w-[40%]` },
	],
	[
		{ image: approachSectionImg, size: tw`w-[30%]` },
		{ image: heroImg, size: tw`w-[40%]` },
		{ image: approachSectionImg, size: tw`w-[30%]` },
	],
];

function TacotsMomentsCarousel() {
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
											"h-[240px] cursor-grab active:cursor-grabbing lg:h-[300px]",
											galleryRowItem.size,
											galleryRowItemIndex === galleryRow.length - 1 && "pr-5"
										)}
									>
										<Image
											src={galleryRowItem.image}
											alt="TACOTS moment"
											className="size-full rounded-[12px] object-cover lg:rounded-[16px]"
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

const stories = [
	{
		quote: "My daughter's discipline and sense of responsibility have improved greatly. She reads more and makes us proud at home.",
		title: "L.L, Parent of Beneficiary",
	},
	{
		quote: "The sponsorship has lifted a financial burden from my family and has given me confidence to continue learning even when things are difficult.",
		title: "R.A, JSS1, Holy Rosary High School, Awgu",
	},
	{
		quote: "What out-of-school children need most is someone who believes they can still have a future. TACOTS gave that hope back.",
		title: "TACOTS Volunteer",
	},
];

function TacotsStoriesCarousel() {
	return (
		<Carousel.Root
			className="w-full"
			options={{ loop: true }}
			plugins={[
				autoplay({
					delay: 2600,
					stopOnFocusIn: true,
					stopOnInteraction: false,
					stopOnMouseEnter: true,
				}),
			]}
		>
			<Carousel.Content className="-mr-3 gap-3 select-none lg:-mr-5 lg:gap-5">
				<For
					each={stories}
					renderItem={(story, index, array) => (
						<Carousel.Item
							key={index}
							className={cnJoin(
								`min-h-[172px] w-[92%] cursor-grab active:cursor-grabbing lg:min-h-[224px]
								lg:w-full lg:max-w-[590px]`,
								index === array.length - 1 && "pr-5"
							)}
						>
							<article
								className="flex size-full flex-col gap-5 rounded-[16px] bg-[hsl(0,0%,94%)] py-6
									pr-5 pl-6.5"
							>
								<div className="flex items-center gap-4 lg:gap-6">
									<span
										className="grid h-11 w-[55px] shrink-0 place-content-center rounded-[20px]
											bg-cedar-yellow text-[64px] text-cedar-red"
									>
										<svg
											width="22"
											height="19"
											viewBox="0 0 22 19"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M-0.000238419 0.000179291V3.20018C3.26376 4.03218 4.86376 5.95218 4.92776 9.98418H-0.000238419V18.6242H8.83176V12.0962C8.83176 4.86418 6.65576 1.40818 -0.000238419 0.000179291ZM12.3518 0.000179291V3.20018C15.6158 4.03218 17.2158 5.95218 17.2798 9.98418H12.3518V18.6242H21.1838V12.0962C21.1838 4.86418 19.0078 1.40818 12.3518 0.000179291Z"
												fill="currentColor"
											/>
										</svg>
									</span>

									<h3 className="leading-[1.2] text-cedar-red lg:text-[20px]">{story.title}</h3>
								</div>

								<p className="text-[12px]/[1.2] text-pretty lg:text-base">"{story.quote}"</p>
							</article>
						</Carousel.Item>
					)}
				/>
			</Carousel.Content>
		</Carousel.Root>
	);
}

export { TacotsMomentsCarousel, TacotsStoriesCarousel };
