import Image from "next/image";
import {
	ctaOneImg,
	heroImg,
	programmeFour,
	programmeOne,
	programmeThree,
	programmeTwo,
} from "@/assets/images/landing";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import {
	communityOutReachIcon,
	educationIcon,
	humanDevelopmentIcon,
	mentorshipIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";
import { ContactForm } from "./-components/ContactForm";
import { Main } from "./-components/Main";
import { TestimonialCarousel } from "./-components/TestimonialCarousel";

function HomePage() {
	return (
		<Main className="gap-12 lg:gap-[80px]">
			<HeroSection />
			<WhatWeDoSection />
			<OurProgrammesSection />
			<TestimonialsSection />
			<CtaSectionOne />
			<FinalCTASection />
			<ContactSection />
		</Main>
	);
}

export default HomePage;

const stats: Array<{ count: string; label: string }> = [
	{ count: "500", label: "Children Impacted" },
	{ count: "10", label: "Communities Reached" },
	{ count: "120", label: "Volunteers Engaged" },
	{ count: "1000", label: "Hours of Mentorship" },
];

function HeroSection() {
	return (
		<section className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-[85px]">
			<article className="lg:max-w-[553px]">
				<h1 className="text-[40px]/12 lg:text-[64px]/[72px]">
					Nurturing Minds, Transforming Communities
				</h1>

				<p className="mt-4 text-[10px]/[1.4] text-cedar-black/80 lg:mt-5 lg:text-base">
					CedarRise Initiative for Human Development is a transformative organization dedicated to
					empowering individuals and communities through education, mentorship, and skill-Building.
				</p>

				<div className="mt-12 flex items-center gap-4.5 lg:mt-20 lg:gap-11">
					<Button className="h-[64px] shrink-0 text-base">Donate Now</Button>

					<NavLink href="#" className="flex items-center gap-4.5">
						<p className="font-medium lg:text-[20px]">Get Involved</p>

						<Button
							theme="secondary"
							size="icon"
							className="size-[64px] shrink-0 max-lg:text-[20px]"
						>
							<IconBox icon="solar:arrow-right-up-outline" />
						</Button>
					</NavLink>
				</div>
			</article>

			<article className="relative h-[444px] w-full lg:h-[472px] lg:max-w-[562px] lg:self-center">
				<Image
					src={heroImg}
					width={380}
					height={444}
					alt="Hero image"
					priority={true}
					className="size-full rounded-[24px] object-cover lg:rounded-[32px]"
				/>

				<ForWithWrapper
					className="absolute inset-y-0 right-4 flex flex-col justify-center gap-4 lg:right-6
						lg:gap-5"
					each={stats}
					renderItem={(stat) => (
						<li
							key={stat.label}
							className="flex h-[92px] w-[102px] flex-col justify-center gap-1 rounded-[16px]
								bg-cedar-black px-4 text-cedar-yellow lg:w-[124px] lg:rounded-[12px] lg:px-7"
						>
							<h4 className="text-[32px]/[1.2]">{stat.count}+</h4>
							<p className="text-[10px]/4 lg:text-[12px]">{stat.label}</p>
						</li>
					)}
				/>
			</article>
		</section>
	);
}

const offers: Array<{ description: string; icon: string; title: string }> = [
	{
		description: "Providing structured academic guidance and learning opportunities.",
		icon: educationIcon,
		title: "Education Support",
	},
	{
		description: "Connecting young minds with mentors for guidance and growth",
		icon: mentorshipIcon,
		title: "Mentorship",
	},
	{
		description: "Reaching deserved communities with impactful initiatives",
		icon: communityOutReachIcon,
		title: "Community Outreach",
	},
	{
		description: "Equipping individuals with practical and vocational skills",
		icon: humanDevelopmentIcon,
		title: "Human Development",
	},
];

function WhatWeDoSection() {
	return (
		<section
			className="rounded-[24px] bg-cedar-black px-5 pt-7.5 pb-9.5 lg:mt-10 lg:w-fit lg:rounded-[40px]
				lg:px-[80px] lg:pt-11 lg:pb-[96px]"
		>
			<h2 className="text-center leading-[1.2] text-cedar-yellow lg:text-[24px]">What we do</h2>
			<h3 className="mt-2 text-center text-[20px]/[1.2] text-cedar-white lg:mt-3 lg:text-[40px]">
				Dismantling barriers, building futures.
			</h3>

			<ForWithWrapper
				className="mt-9.5 grid grid-cols-2 gap-2 lg:mt-[52px]
					lg:grid-cols-[repeat(4,min(100%/4,245px))] lg:justify-center lg:gap-5"
				each={offers}
				renderItem={(offer, index) => {
					const offerCount = index + 1;

					const totalColumns = 2;

					const rowNumber = Math.ceil(offerCount / totalColumns);

					const columnPlacement = offerCount % totalColumns;

					const colNumber = columnPlacement === 0 ? totalColumns : columnPlacement;

					const isEvenRow = rowNumber % 2 === 0;

					const swappedColNumber = isEvenRow ? totalColumns + 1 - colNumber : colNumber;

					const isOfferCountEven = offerCount % 2 === 0;

					// NOTE - FIX FOR HOVER ISSUES:
					// We use a static wrapper (li) as the hover "hit box" and apply a `group` class to it.
					// Since the wrapper never rotates, its physical boundaries never change.
					// The inner div uses `group-hover` to perform the actual rotation, which prevents the endless loop where rotating an element moves it out from under the cursor, losing the hover state.
					return (
						<li
							data-order={offerCount}
							key={offer.title}
							className={cnJoin(
								"group min-h-[148px] lg:min-h-[252px]",
								isEvenRow && "max-lg:[grid-area:var(--grid-area)]"
							)}
							style={
								isEvenRow ?
									({ "--grid-area": `${rowNumber}/${swappedColNumber}` } as React.CSSProperties)
								:	undefined
							}
						>
							<div
								className={cnJoin(
									`flex size-full flex-col gap-3 rounded-[16px] bg-[hsl(240,5%,5%)] p-2
									transition-[rotate] duration-500 ease-[cubic-bezier(0.34,2,0.64,1)] lg:gap-5
									lg:rounded-[20px] lg:pt-4 lg:pr-3.5 lg:pb-6 lg:pl-4`,
									isOfferCountEven ? "lg:group-hover:rotate-6" : "lg:group-hover:-rotate-6"
								)}
							>
								<span
									className={cnJoin(
										"w-fit rounded-[12px] p-3.5 lg:rounded-[20px] lg:p-6",
										isOfferCountEven ? "bg-cedar-yellow" : "bg-cedar-red"
									)}
								>
									<Image
										width={20}
										height={20}
										src={offer.icon}
										alt="icon"
										className="size-5 lg:size-8"
									/>
								</span>
								<h4 className="leading-[1.2] text-cedar-white lg:text-[24px]">{offer.title}</h4>
								<p className="text-[10px]/[1.4] text-pretty text-cedar-white/80 lg:text-[14px]">
									{offer.description}
								</p>
							</div>
						</li>
					);
				}}
			/>
		</section>
	);
}

const initiatives: Array<{ description: string; image: string; title: string }> = [
	{
		description: "Supporting students with academic excellence beyond the classroom.",
		image: programmeOne,
		title: "ASH (After School Hours)",
	},
	{
		description: "Taking children off the streets and guiding them toward purpose.",
		image: programmeTwo,
		title: "TACOTS (Take a Child Off The Streets)",
	},
	{
		description: "Community-driven initiatives creating real impact.",
		image: programmeThree,
		title: "Outreaches",
	},
	{
		description: "Transformative learning experiences designed to meet real-world needs.",
		image: programmeFour,
		title: "Capacity Building",
	},
];

function OurProgrammesSection() {
	return (
		<section className="flex flex-col gap-6 lg:gap-12">
			<header className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:gap-9.5">
				<h2 className="shrink-0 text-[24px]/[1.2] lg:text-[48px]">Our Programmes</h2>
				<p className="max-w-[825px] text-[12px]/5 text-black lg:text-base/7">
					At CedarRise, our social initiatives focus on expanding opportunity for underserved
					communities, particularly children and young people who face barriers to education,
					mentorship, and personal development. Through targeted programs and community outreach, we
					work to restore access, strengthen support systems, and create pathways for long-term
					growth.
					<br />
					Our social impact work is driven by three key initiatives:
				</p>
			</header>

			<ForWithWrapper
				className="grid grid-cols-1 gap-4 lg:grid-cols-[repeat(2,min(100%/2,590px))] lg:justify-center
					lg:gap-5"
				each={initiatives}
				renderItem={(initiative) => (
					<li
						key={initiative.title}
						className="relative isolate flex min-h-[320px] flex-col justify-between rounded-[24px]
							pb-9 lg:min-h-[416px]"
					>
						<div className="absolute inset-0 isolate -z-1 rounded-[inherit]">
							<Image
								src={initiative.image}
								alt="Initiative"
								className="absolute inset-0 size-full rounded-[inherit] object-cover
									mix-blend-multiply"
							/>
							<span
								className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-[inherit]
									bg-[linear-gradient(180deg,theme(--color-cedar-black/0)_0%,theme(--color-cedar-black)_100%)]
									mix-blend-multiply lg:h-3/4"
							/>
						</div>

						<Button theme="secondary" size="icon" className="mt-3 mr-3 self-end lg:mt-4 lg:mr-4">
							<IconBox icon="solar:arrow-right-up-outline" />
						</Button>

						<div className="flex flex-col gap-2 px-10 text-cedar-white lg:gap-2.5">
							<h3 className="text-[24px] lg:text-[36px]">{initiative.title}</h3>
							<p className="max-w-[237px] text-[10px] text-pretty lg:max-w-[330px] lg:text-[14px]">
								{initiative.description}
							</p>
						</div>
					</li>
				)}
			/>
		</section>
	);
}

function TestimonialsSection() {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-center leading-[1.2] text-cedar-yellow lg:text-[24px]">Testimonials</h2>
			<h3 className="text-center text-[24px]/[1.2] lg:text-[40px]">Our Impact So Far</h3>

			<TestimonialCarousel />
		</section>
	);
}

function CtaSectionOne() {
	return (
		<section
			className="grid grid-cols-1 gap-4 lg:grid-cols-[repeat(2,min(100%/2,590px))]
				lg:grid-rows-[minmax(380px,auto)_minmax(562px,auto)] lg:justify-center lg:gap-5"
		>
			<article
				className="flex flex-col gap-4 rounded-[24px] bg-cedar-red px-5 py-6 text-cedar-white
					max-lg:text-center lg:gap-5 lg:rounded-[32px]"
			>
				<h3 className="text-[24px] lg:text-[40px]">Sustainable Impact Initiatives</h3>

				<p className="grow text-[10px]/[1.5] text-pretty text-cedar-white/80 lg:text-[14px]">
					To sustain our programs and expand our impact, CedarRise operates a number of
					mission-aligned initiatives that generate income while supporting our social work. Proceeds
					from these activities are reinvested directly into our programs, particularly TACOTS and
					ASH, helping us reach more children and communities.
				</p>

				<h4 className="leading-[1.2] lg:text-[24px]">
					The ASH Online Tutorials and the Gift by CedarRise are the categories under our Social
					Enterprises
				</h4>
			</article>

			<article
				className="flex flex-col items-center gap-10 rounded-[32px] bg-[hsl(0,0%,94%)] px-6 py-7
					lg:gap-12 lg:px-10.5 lg:py-10 lg:[grid-area:2/1]"
			>
				<h3 className="text-center text-[24px]/[1.2] lg:text-[40px]">ASH Online Tutorials</h3>

				<p className="max-w-[285px] grow text-[10px]/[1.5] text-pretty lg:max-w-[456px] lg:text-[14px]">
					Learning support that empowers students and communities. ASH Online Tutorials provides
					structured academic support for students who need additional guidance outside the classroom.
					Through experienced tutors and personalized sessions, we help learners strengthen their
					understanding, confidence, and academic performance. The program also supports the broader
					ASH initiative, enabling CedarRise to extend after-school academic support and holistic
					learning opportunities to underserved youth. By enrolling in ASH Online Tutorials, families
					receive quality learning support while helping expand access to education for children in
					need.
				</p>

				<Button>Enroll now</Button>
			</article>

			<div
				className="flex flex-col items-center gap-10 rounded-[24px] max-lg:bg-[hsl(0,0%,94%)]
					max-lg:px-6 max-lg:py-7 lg:contents"
			>
				<article
					className="flex flex-col items-center gap-4 bg-[hsl(0,0%,94%)] lg:gap-5.5 lg:rounded-[32px]
						lg:px-9 lg:py-8 lg:[grid-area:2/2]"
				>
					<h3 className="text-center text-[24px]/[1.2] lg:text-[40px]">Gifts by CedarRise</h3>

					<p className="grow text-[10px]/[14px] text-pretty lg:max-w-[524px] lg:text-[16px]/[28px]">
						Gifts by CedarRise curates beautiful and thoughtful gift packages for celebrations,
						corporate events, milestones, and special occasions. Each gift is carefully assembled to
						create memorable experiences while supporting a greater cause. Every purchase contributes
						directly to TACOTS (Take A Child Off The Street), helping provide educational support and
						mentorship to vulnerable children. By choosing Gifts by CedarRise, you are not only
						celebrating life’s special moments, you are also helping a child access education and
						opportunity.
					</p>

					<div className="flex w-full items-end justify-between gap-3.5 lg:gap-8">
						<div className="flex flex-col gap-2">
							<p className="font-medium lg:text-[24px]">Contact us</p>

							<ForWithWrapper
								className="flex flex-col gap-0.5"
								each={[
									{ icon: "ph:phone-fill", info: "09090909090" },
									{ icon: "ph:instagram-logo", info: "cedarriseinitiative" },
									{ icon: "ri:mail-fill", info: "ash.cedarrise@gmail.com" },
								]}
								renderItem={(item) => (
									<li key={item.info} className="flex items-center text-[10px] lg:text-base">
										<span
											className="grid size-3.5 place-content-center rounded-full bg-cedar-yellow
												text-cedar-white lg:size-5.5"
										>
											<IconBox icon={item.icon} />
										</span>
										<span>:</span>
										<p className="ml-1 font-light">{item.info}</p>
									</li>
								)}
							/>
						</div>

						<Button className="px-5 max-lg:shrink-0">
							View Collection{" "}
							<IconBox icon="ph:arrow-right" className="size-4 shrink-0 lg:size-7.5" />
						</Button>
					</div>
				</article>

				<article
					className="relative isolate h-[235px] w-full rounded-[16px] lg:h-full lg:rounded-[32px]"
				>
					<Image
						src={ctaOneImg}
						alt="CTA"
						className="absolute inset-0 size-full rounded-[inherit] object-cover"
					/>
					<span
						className="absolute inset-x-0 bottom-0 h-4/5 rounded-b-[inherit]
							bg-[linear-gradient(180deg,theme(--color-cedar-red/0)_0%,theme(--color-cedar-red)_100%)]"
					/>
				</article>
			</div>
		</section>
	);
}

function FinalCTASection() {
	return (
		<section
			className="flex flex-col items-center rounded-[24px] bg-cedar-black p-6 text-center
				text-cedar-white lg:rounded-[32px] lg:p-[64px]"
		>
			<h2 className="text-[32px]/[1.2] text-cedar-yellow lg:text-[48px]">Be Part of the Change</h2>

			<p className="mt-2 text-[10px] lg:mt-4 lg:text-base">
				Join us in shaping a better future for the next generation.
			</p>

			<div className="mt-10 flex items-center gap-2 lg:mt-12.5 lg:gap-8.5">
				<Button className="shrink-0">Donate Now</Button>

				<NavLink href="#" className="flex items-center gap-2">
					<p className="text-[14px] font-medium lg:text-[20px]">Get Involved</p>

					<Button theme="secondary" size="icon" className="shrink-0">
						<IconBox icon="solar:arrow-right-up-outline" />
					</Button>
				</NavLink>
			</div>
		</section>
	);
}

function ContactSection() {
	return (
		<section className="flex flex-col items-center gap-6 px-4 lg:gap-10">
			<h2 className="text-center text-[32px]/[1.2] lg:text-[40px]">We’d Love Your Feedback</h2>

			<ContactForm />
		</section>
	);
}
