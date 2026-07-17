"use client";

import autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
	homeCarousel1,
	homeCarousel2,
	homeCarousel3,
	homeCarousel4,
	homeCarousel5,
} from "@/assets/images/landing";
import { For } from "@/components/common/for";
import { Carousel } from "@/components/ui";
import { TestimonialCarouselShared } from "./CarouselsShared";

const testimonials: Array<{ quote: string; title: string }> = [
	{
		quote: "I was amazed at the consistency and how far the girls had taken educating these girls. I encourage the girls to learn as much as they can from their teachers. I also encourage my fellow parents to follow up their children.",
		title: "A beneficiary’s mother",
	},
	{
		quote: "Education is one of the important things a growing child should be exposed to. That's why I am really grateful for your hard work and dedication to providing for these young girls.",
		title: "A beneficiary’s father",
	},
	{
		quote: "I met new people, made friends that became sisters. Built my confidence and determination to complete a task despite any set backs.",
		title: "B. A, Participant",
	},
	{
		quote: "I really enjoyed the Digital Literacy & CBT Readiness Bootcamp, especially the Excel session where I learned how to use functions like SUM. The training increased my confidence in using a computer and made me more interested in pursuing tech-related skills",
		title: " K.E, Beneficiary, E-Learning for all by Magenta Heart",
	},
	{
		quote: "Without this sponsorship, I would not be able to attend Rosary High School. I am grateful to my sponsors for supporting me and others, and I pray for their long life and prosperity.",
		title: "F. A (Student, Holy Rosary High School, JSS2)",
	},
	{
		quote: "Since my son began this scholarship, I have seen remarkable changes in him—he has grown, is eager to learn, and even asked to join a holiday learning program. I am grateful to God and the sponsors, and I pray they are blessed with good health and more opportunities to do good.",
		title: "N.C (Father of Beneficiary)",
	},
];

export function HomeTestimonialCarousel() {
	return <TestimonialCarouselShared className="lg:mt-12" testimonials={testimonials} />;
}

const slideImages = [homeCarousel1, homeCarousel2, homeCarousel3, homeCarousel4, homeCarousel5];

export function HomeHeroCarousel() {
	return (
		<Carousel.Root
			className="absolute inset-0 isolate -z-1 touch-none"
			options={{ loop: false }}
			plugins={[
				autoplay({
					delay: 6000,
					stopOnInteraction: false,
				}),
			]}
		>
			<Carousel.Content className="size-full gap-0">
				<For
					each={slideImages}
					renderItem={(slide, index) => (
						<Carousel.Item key={index} className="relative isolate">
							<Image
								src={slide}
								width={412}
								height={570}
								alt=""
								className="size-full object-cover"
							/>

							<span
								className="absolute inset-0
									bg-linear-[270deg,theme(--color-cedar-black/0.4)_0%,theme(--color-cedar-black/0.8)_100%]
									mix-blend-multiply"
							/>
						</Carousel.Item>
					)}
				/>
			</Carousel.Content>
		</Carousel.Root>
	);
}
