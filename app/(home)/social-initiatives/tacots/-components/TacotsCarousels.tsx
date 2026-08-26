"use client";

import { TestimonialCarouselShared } from "@/app/(home)/-components/CarouselsShared";

const stories = [
	{
		quote: "This opportunity transformed my daughter's life. She has become more disciplined, focused, and enthusiastic about learning. We truly believe this support was a blessing sent at the right time.",
		title: "E. O., Mother of a Beneficiary, TACOTS",
	},
	{
		quote: "Since joining the program, my son has become more eager to learn and continues to seek opportunities to improve himself. Thank you for believing in his potential.",
		title: "N. C., Father of a Beneficiary, TACOTS",
	},
	{
		quote: "This sponsorship has lifted the burden of my school fees and made it possible for me to continue my education. I am deeply grateful to my sponsors for believing in me, and I keep them in my prayers.",
		title: "C. E., JSS2 Student, Beneficiary, TACOTS",
	},
	{
		quote: "The scholarship has eased my family's financial burden and given me a better environment to learn and grow. I sincerely appreciate everyone who made this possible.",
		title: "P. A., JSS2 Student, Beneficiary, TACOTS ",
	},
	{
		quote: "This scholarship lifted a heavy burden from my mother's shoulders and gave me the opportunity to continue my education. I am sincerely thankful for your support.",
		title: "A. P., JSS2 Student, Beneficiary, TACOTS",
	},
	{
		quote: "Words cannot fully express how much this scholarship has helped my family. It has brought us hope, relief, and joy. May God richly bless everyone who made it possible.",
		title: "S. I., Mother of a Beneficiary, TACOTS",
	},
];

function TacotsStoriesCarousel() {
	return <TestimonialCarouselShared testimonials={stories} />;
}

export { TacotsStoriesCarousel };
