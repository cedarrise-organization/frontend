import { TestimonialCarouselShared } from "./TestimonialCarouselShared";

const testimonials: Array<{ quote: string; title: string }> = [
	{
		quote: "After losing my husband, I could not imagine how to train my daughter, but this sponsorship came as God's answer to my prayers. Chisom has changed positively - she's calmer, listens to corrections, and reads more, though still playful as a child. I am deeply thankful to the sponsors for remembering families like mine and pray that God strengthens and blesses them for all they have done",
		title: "Mother of a TACOTS Beneficiary",
	},
	{
		quote: "This sponsorship has helped my parents by paying my school fees, and I am happy to be in JSS2. I thank my sponsors for supporting me, and I always keep them in prayers.",
		title: "TACOTS Beneficiary",
	},
	{
		quote: "This scholarship reduced my family's financial burden and allowed my sister to be trained in catering school. Thank you very much, and I promise to make you proud next term.",
		title: "TACOTS Beneficiary",
	},
	{
		quote: "Seeing that this project was pioneered by undergraduates, I would like to commend them because I know it wasn't easy. I'm happy that my sisters have people out there who are also intentional about their growth. I'm extremely thankful.",
		title: "Guardian. ASH Beneficiary",
	},
	{
		quote: "This scholarship reduced my family's financial burden and allowed my sister to be trained in catering school. Thank you very much, and I promise to make you proud next term.",
		title: "TACOTS Beneficiary",
	},
];

function HomeTestimonialCarousel() {
	return <TestimonialCarouselShared className="lg:mt-12" testimonials={testimonials} />;
}

export { HomeTestimonialCarousel };
