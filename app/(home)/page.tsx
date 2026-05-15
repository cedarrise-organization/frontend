import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import Image from "next/image";
import { heroImg } from "@/assets/images/landing";
import { IconBox } from "@/components/common/IconBox";
import { Button } from "@/components/ui/button";
import { Main } from "./-components/Main";

function HomePage() {
	return (
		<Main>
			<HeroSection />
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

				<p className="mt-4 text-[10px]/[1.4] lg:mt-5 lg:text-base">
					CedarRise Initiative for Human Development is a transformative organization dedicated to
					empowering individuals and communities through education, mentorship, and skill-Building.
				</p>

				<div className="mt-12 flex items-center gap-4.5 lg:mt-20 lg:gap-11">
					<Button className="shrink-0">Donate Now</Button>

					<span className="flex items-center gap-4.5">
						<p className="font-medium lg:text-[20px]">Get Involved</p>

						<Button theme="secondary" size="icon" className="shrink-0">
							<IconBox icon="solar:arrow-right-up-outline" />
						</Button>
					</span>
				</div>
			</article>

			<article
				className="relative h-[444px] w-full min-w-[360px] lg:h-[472px] lg:max-w-[562px]
					lg:self-center"
			>
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
							<h4 className="text-[32px]/[100%]">{stat.count}+</h4>
							<p className="text-[10px]/4 lg:text-[12px]">{stat.label}</p>
						</li>
					)}
				/>
			</article>
		</section>
	);
}
