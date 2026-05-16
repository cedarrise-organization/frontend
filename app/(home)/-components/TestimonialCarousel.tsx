"use client";

import autoplay from "embla-carousel-autoplay";
import { For } from "@/components/common/for";
import { Carousel } from "@/components/ui";

const testimonials: Array<{ description: string; title: string }> = [
	{
		description:
			"After losing my husband, I could not imagine how to train my daughter, but this sponsorship came as God's answer to my prayers. Chisom has changed positively - she's calmer, listens to corrections, and reads more, though still playful as a child. I am deeply thankful to the sponsors for remembering families like mine and pray that God strengthens and blesses them for all they have done",
		title: "Mother of a TACOTS Beneficiary",
	},
	{
		description:
			"This sponsorship has helped my parents by paying my school fees, and I am happy to be in JSS2. I thank my sponsors for supporting me, and I always keep them in prayers.",
		title: "TACOTS Beneficiary",
	},
	{
		description:
			"This scholarship reduced my family's financial burden and allowed my sister to be trained in catering school. Thank you very much, and I promise to make you proud next term.",
		title: "TACOTS Beneficiary",
	},
	{
		description:
			"Seeing that this project was pioneered by undergraduates, I would like to commend them because I know it wasn't easy. I'm happy that my sisters have people out there who are also intentional about their growth. I'm extremely thankful.",
		title: "Guardian. ASH Beneficiary",
	},
	{
		description:
			"This scholarship reduced my family's financial burden and allowed my sister to be trained in catering school. Thank you very much, and I promise to make you proud next term.",
		title: "TACOTS Beneficiary",
	},
];

function TestimonialCarousel() {
	return (
		<Carousel.Root className="w-full lg:mt-12" plugins={[autoplay({ delay: 3000 })]}>
			<Carousel.Content className="gap-3 select-none lg:gap-5">
				<For
					each={testimonials}
					renderItem={(testimonial, index) => (
						<Carousel.Item
							key={index}
							className="min-h-[318px] w-[92%] cursor-grab active:cursor-grabbing lg:min-h-[336px]
								lg:w-full lg:max-w-[586px]"
						>
							<article
								className="flex size-full flex-col gap-5 rounded-[24px] bg-[hsl(0,0%,94%)] py-6
									pr-5 pl-6.5"
							>
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

								<p className="grow text-[12px]/5 lg:text-base/7.5">"{testimonial.description}"</p>

								<h4 className="text-cedar-red lg:text-[20px]">{testimonial.title}</h4>
							</article>
						</Carousel.Item>
					)}
				/>
			</Carousel.Content>
		</Carousel.Root>
	);
}

export { TestimonialCarousel };
