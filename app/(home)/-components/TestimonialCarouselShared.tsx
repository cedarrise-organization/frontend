"use client";

import autoplay from "embla-carousel-autoplay";
import { For } from "@/components/common/for";
import { Carousel } from "@/components/ui";
import { cnJoin, cnMerge } from "@/lib/utils/cn";

function TestimonialCarouselShared(props: {
	className?: string;
	testimonials: Array<{ quote: string; title: string }>;
}) {
	const { className, testimonials } = props;

	return (
		<Carousel.Root
			className={cnMerge("w-full", className)}
			options={{ loop: false }}
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
					each={testimonials}
					renderItem={(testimonial, index, array) => (
						<Carousel.Item
							key={index}
							className={cnJoin(
								`min-h-[180px] w-[92%] cursor-grab active:cursor-grabbing lg:min-h-[224px]
								lg:w-full lg:max-w-[586px]`,
								index === array.length - 1 && "pr-5"
							)}
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

								<p className="grow text-[12px]/5 lg:text-base/7.5">"{testimonial.quote}"</p>

								<h4 className="text-cedar-red lg:text-[20px]">{testimonial.title}</h4>
							</article>
						</Carousel.Item>
					)}
				/>
			</Carousel.Content>
		</Carousel.Root>
	);
}

export { TestimonialCarouselShared };
