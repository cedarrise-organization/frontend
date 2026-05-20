import Image from "next/image";
import { heroImg as blogHeroImg } from "@/assets/images/blog";
import { heroImg as blogCardImg } from "@/assets/images/capacity-building";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { Main } from "../-components/Main";

function BlogPage() {
	return (
		<Main className="gap-10 lg:gap-[64px]">
			<BlogIntroSection />
			<FeaturedPostsSection />
			<FinalCTASection />
		</Main>
	);
}

export default BlogPage;

function BlogIntroSection() {
	return (
		<section className="flex flex-col gap-5 lg:gap-10">
			<header className="flex flex-col gap-3">
				<h1 className="text-[24px]/none lg:text-[40px]">Stories, Updates & Insights</h1>
				<p className="text-[10px]/4 text-pretty max-lg:max-w-[282px] lg:text-base/7">
					Stay informed with the latest news, program updates, and impact stories from CedarRise.
				</p>
			</header>

			<div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
				<article
					className="relative isolate flex min-h-[249px] w-full items-end rounded-[24px] pb-9
						pl-[52px] lg:min-h-[344px] lg:rounded-[32px] lg:pb-8 lg:pl-[54px]"
				>
					<div className="absolute inset-0 isolate -z-1 rounded-[inherit]">
						<Image
							src={blogHeroImg}
							alt="Blog"
							priority={true}
							className="absolute inset-0 size-full rounded-[inherit] object-cover"
						/>

						<span
							className="absolute inset-x-0 bottom-0 h-3/4 rounded-b-[inherit]
								bg-[linear-gradient(180deg,theme(--color-cedar-black/0)_0%,theme(--color-cedar-black)_100%)]"
						/>
					</div>

					<h2 className="text-[48px] text-cedar-yellow lg:bottom-9 lg:left-10 lg:text-[80px]">
						Blog
					</h2>
				</article>

				<article
					className="flex w-full flex-col gap-4 rounded-[24px] bg-cedar-red p-8 text-cedar-white
						lg:max-w-[386px] lg:gap-11 lg:rounded-[32px]"
				>
					<h2 className="text-[24px]/none lg:text-[40px]/[1.25]">From Our Community</h2>
					<p className="text-[10px]/4 text-pretty lg:text-base/7">
						Explore stories, announcements, and reports that highlight our work, impact, and ongoing
						initiatives across communities.
					</p>
				</article>
			</div>
		</section>
	);
}

const featuredPosts = Array.from({ length: 6 }, (_, index) => ({
	date: "05/05/26",
	description:
		"A look into how the ASH program continues to support students academically and personally across underserved communities.",
	id: index,
	title: "Empowering 100+ Students Through ASH This Quarter",
}));

function FeaturedPostsSection() {
	return (
		<section className="flex flex-col gap-4 lg:gap-8">
			<h2 className="text-center text-[24px]/none lg:text-[40px]">Featured</h2>

			<ForWithWrapper
				className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-5"
				each={featuredPosts}
				renderItem={(post) => (
					<li
						key={post.id}
						className="flex flex-col gap-5 rounded-[24px] bg-[hsl(0,0%,94%)] p-4 lg:rounded-[32px]"
					>
						<Image
							src={blogCardImg}
							alt={post.title}
							className="h-[226px] rounded-[20px] object-cover"
						/>

						<h3 className="leading-[1.4] lg:text-[24px]">{post.title}</h3>
						<p className="text-[12px] text-cedar-black/80 lg:text-[14px]">{post.description}</p>

						<div className="flex items-center justify-between gap-4">
							<h4 className="text-cedar-red">{post.date}</h4>
							<Button className="h-12 rounded-[12px] text-[12px] lg:h-12 lg:px-9 lg:text-base">
								Read More
							</Button>
						</div>
					</li>
				)}
			/>
		</section>
	);
}

function FinalCTASection() {
	return (
		<section
			className="flex flex-col items-center rounded-[24px] bg-cedar-black p-6 text-center
				text-cedar-white lg:rounded-[32px] lg:p-[64px]"
		>
			<h2 className="text-[32px]/none text-cedar-yellow lg:text-[48px]">Stay Connected</h2>

			<p className="mt-2 text-[10px] lg:mt-4 lg:text-base">
				Follow our journey and be part of the impact we're creating.
			</p>

			<div className="mt-10 flex items-center gap-2 lg:mt-12.5 lg:gap-8.5">
				<Button className="shrink-0">Donate</Button>

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
