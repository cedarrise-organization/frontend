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
		quote: "Education is one of the greatest gifts we can give a child. I deeply appreciate your hard work and dedication to ensuring these young girls have access to learning and opportunities that will shape their future.",
		title: "ASH Beneficiary's Father",
	},
	{
		quote: "Volunteering with this initiative has helped me become more confident in public speaking. It's been incredibly fulfilling to contribute to the growth and development of younger girls while growing personally through the experience.",
		title: "R. E., Volunteer, ASH",
	},
	{
		quote: "Beyond paying my school fees, this sponsorship has given me extra academic support that has helped me become a better student. Thank you for changing my life.",
		title: "J. M., JSS2 Student, Beneficiary, TACOTS",
	},
	{
		quote: "Since receiving this scholarship, my daughter's attitude has changed remarkably. She is more respectful, responsible, and committed to her studies. I am grateful for the positive impact this has had on our family.",
		title: "U. I., Mother of a Beneficiary, TACOTS",
	},
	{
		quote: "I'm grateful for this programme. Everything was well organized, and no one had to pay for consultations or medications. It was truly a blessing to our community.",
		title: "Awlaw Medical Outreach Beneficiary ",
	},
	{
		quote: "Volunteering was both fulfilling and beautiful. It reminded me of the impact we can make when we serve together.",
		title: " V. O., Volunteer, Awlaw Outreach",
	},
	{
		quote: "The Digital Literacy Bootcamp made technology less intimidating. I especially enjoyed learning Excel functions and now feel much more confident using a computer and preparing for CBT exams.",
		title: " K. E., Beneficiary, E-Learning for all by Magenta Heart",
	},
	{
		quote: "This was one of the most practical and teacher-friendly workshops I've ever attended. It inspired me to apply what I've learned and make a meaningful difference in my school and community.",
		title: "Teacher Participant, Teachers' Training ",
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
