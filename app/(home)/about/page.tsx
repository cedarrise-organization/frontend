import Image from "next/image";
import {
	aboutCoreValueDesktopImg,
	aboutCoreValueMobileImg,
	aboutHeroImg,
	teamMemberFiveImg,
	teamMemberFourImg,
	teamMemberOneImg,
	teamMemberSixImg,
	teamMemberThreeImg,
	teamMemberTwoImg,
} from "@/assets/images/about";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Card } from "@/components/ui/card";
import { FinalCTASection } from "../-components/FinalCTASectionShared";
import { Main } from "../-components/Main";

function AboutPage() {
	return (
		<Main layout="fill" className="gap-10 lg:gap-16">
			{(ctx) => (
				<>
					<HeroSection />
					<WhoWeAreSection />
					<div className={ctx.constrainedClassName}>
						<MissionVisionSection />
						<CoreValuesSection />
						<TeamSection />
					</div>
					<FinalCTASection />
				</>
			)}
		</Main>
	);
}

export default AboutPage;

function HeroSection() {
	return (
		<section className="flex flex-col items-center pt-8 text-center lg:pt-14">
			<h1 className="text-[40px]/[1.1] lg:text-[64px]/[1.1]">
				About <span className="text-cedar-red">CedarRise</span>
			</h1>

			<p className="mt-4 max-w-[560px] text-[10px]/[1.5] lg:text-base/6">
				Empowering individuals and communities through education, mentorship, and sustainable
				development.
			</p>
		</section>
	);
}

function WhoWeAreSection() {
	return (
		<section className="flex w-full flex-col lg:flex-row">
			<article className="flex w-full flex-col items-center justify-center bg-cedar-black p-6 lg:p-8">
				<div className="flex max-w-[320px] flex-col gap-6 lg:max-w-[554px]">
					<h2 className="text-[28px]/none text-cedar-white lg:text-[40px]">Who We Are</h2>

					<div className="text-[12px]/5 text-cedar-white/80 lg:text-base/7">
						<p>
							CedarRise Initiative for Human Development is a non-profit organization dedicated to
							strengthening individuals and communities through education, professional development,
							skills training, and social impact programs.
						</p>
						<p>
							Inspired by the resilience of the cedar tree, we equip people with the knowledge,
							skills, and opportunities they need to grow and thrive.
						</p>
						<p>
							Our work supports diverse groups—including students, educators, professionals, and
							underserved communities—with a strong focus on children and women.
						</p>
					</div>
				</div>
			</article>

			<div className="relative min-h-[260px] w-full lg:min-h-[420px]">
				<Image
					src={aboutHeroImg}
					alt="CedarRise participants holding certificates"
					className="size-full object-cover"
					priority={true}
				/>
				<span
					className="absolute inset-0
						bg-linear-[180deg,theme(--color-cedar-red/0)_0%,theme(--color-cedar-red/0.8)_100%]"
				/>
			</div>
		</section>
	);
}

function MissionVisionSection() {
	return (
		<section className="grid gap-4 lg:grid-cols-2 lg:gap-5">
			<article className="rounded-[20px] bg-cedar-red p-6 text-cedar-white lg:rounded-[24px] lg:p-10">
				<div className="flex items-start justify-between gap-4">
					<h2 className="text-[24px]/[1.2] lg:text-[32px]/[1.2]">Mission</h2>
					<IconBox icon="solar:target-linear" className="size-6 shrink-0 lg:size-10" />
				</div>

				<p className="mt-6 text-[12px]/[1.6] lg:text-base/7">
					To empower communities through education, skill-building, and mentorship programs that drive
					personal growth, academic excellence, and long-term impact
				</p>
			</article>

			<article className="rounded-[20px] bg-cedar-yellow p-6 text-cedar-white lg:rounded-[24px] lg:p-10">
				<div className="flex items-start justify-between gap-4">
					<h2 className="text-[24px]/[1.2] lg:text-[32px]/[1.2]">Vision</h2>
					<IconBox icon="solar:magnifer-linear" className="size-6 shrink-0 lg:size-10" />
				</div>

				<p className="mt-6 text-[12px]/[1.6] lg:text-base/7">
					To build a world where every child, youth, and woman, regardless of background, has access
					to quality education, mentorship and opportunities to thrive.
				</p>
			</article>
		</section>
	);
}

function CoreValuesSection() {
	return (
		<section className="flex flex-col items-center gap-6 lg:gap-8">
			<picture className="w-full lg:max-w-[1110px]">
				<source media="(min-width: 1000px)" srcSet={aboutCoreValueDesktopImg.src} />

				<Image
					src={aboutCoreValueMobileImg}
					alt="CedarRise core values"
					className="w-full object-contain"
				/>
			</picture>
		</section>
	);
}

const teamMembers = [
	{ image: teamMemberOneImg, name: "Philipa Onochie" },
	{ image: teamMemberTwoImg, name: "Yienor Abang" },
	{ image: teamMemberThreeImg, name: "Emmanuella Aguenu" },
	{ image: teamMemberFourImg, name: "Chiazom Ezigbo" },
	{ image: teamMemberFiveImg, name: "Ogechukwu Igwe" },
	{ image: teamMemberSixImg, name: "Uchechukwu Onyechi" },
];

function TeamSection() {
	return (
		<section className="flex flex-col gap-8 lg:gap-12">
			<header className="">
				<h2 className="text-[28px]/[1.2] lg:text-[40px]/[1.2]">Our Team</h2>

				<p className="mt-4 max-w-[338px] text-[10px]/4 lg:max-w-[568px] lg:text-[14px]/6">
					CedarRise is driven by a team of passionate individuals committed to creating impact.
					Together, we bring diverse expertise, shared values and a deep dedication to empowering
					communities.
				</p>
			</header>

			<ul className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
				<For
					each={teamMembers}
					renderItem={(member) => (
						<Card.Root
							as="li"
							key={member.name}
							className="h-full min-h-[180px] overflow-hidden rounded-[18px] p-0 text-cedar-white
								lg:min-h-[280px] lg:rounded-[24px]"
						>
							<Card.Header className="aspect-[1.12] w-full">
								<Image src={member.image} alt={member.name} className="size-full object-cover" />
							</Card.Header>

							<Card.Content className="flex flex-col gap-1 bg-cedar-black p-3 lg:p-4">
								<Card.Title className="text-[14px]/[1.2]">{member.name}</Card.Title>
							</Card.Content>
						</Card.Root>
					)}
				/>

				{/* <For
					each={6}
					renderItem={(index) => (
						<li
							key={index}
							className="min-h-[180px] rounded-[18px] bg-cedar-black lg:min-h-[280px]
								lg:rounded-[24px]"
						/>
					)}
				/> */}
			</ul>
		</section>
	);
}
