"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { heroImg as blogHeroImg } from "@/assets/images/blog";
import { heroImg as blogCardImg } from "@/assets/images/capacity-building";
import { ForWithWrapper } from "@/components/common/for";
import { Switch } from "@/components/common/switch";
import { Button } from "@/components/ui/button";
import { blogsQuery } from "@/lib/react-query/queryOptions";
import { FinalCTASection } from "../-components/FinalCTASectionShared";
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
				<h1 className="text-[24px]/[1.2] lg:text-[40px]">Stories, Updates & Insights</h1>
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
					<h2 className="text-[24px]/[1.2] lg:text-[40px]/[1.25]">From Our Community</h2>
					<p className="text-[10px]/4 text-pretty lg:text-base/7">
						Explore stories, announcements, and reports that highlight our work, impact, and ongoing
						initiatives across communities.
					</p>
				</article>
			</div>
		</section>
	);
}

function FeaturedPostsSection() {
	const blogsQueryResult = useQuery(blogsQuery());
	const records = blogsQueryResult.data?.data;

	return (
		<section className="flex flex-col gap-4 lg:gap-8">
			<h2 className="text-center text-[24px]/[1.2] lg:text-[40px]">Featured</h2>

			<Switch.Root>
				<Switch.Match when={blogsQueryResult.isPending}>
					<ForWithWrapper
						className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-5"
						each={3}
						renderItem={(item) => (
							<li
								key={item}
								className="flex animate-pulse flex-col gap-5 rounded-[24px] bg-cedar-grey p-4
									lg:rounded-[32px]"
							>
								<span className="h-[226px] rounded-[20px] bg-cedar-black/8" />
								<span className="h-7 rounded-[8px] bg-cedar-black/8" />
								<span className="h-16 rounded-[8px] bg-cedar-black/8" />
								<span className="h-12 rounded-[12px] bg-cedar-black/8" />
							</li>
						)}
					/>
				</Switch.Match>

				<Switch.Match when={records?.length === 0}>
					<p className="text-center text-[14px] text-cedar-black/64">
						No blog posts have been published yet.
					</p>
				</Switch.Match>

				<Switch.Match when={records}>
					{(definedRecords) => (
						<ForWithWrapper
							className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-5"
							each={definedRecords}
							renderItem={(post) => (
								<li
									key={post.id}
									className="flex flex-col gap-5 rounded-[24px] bg-cedar-grey p-4
										lg:rounded-[32px]"
								>
									<Image
										src={blogCardImg}
										alt={post.title}
										className="h-[226px] rounded-[20px] object-cover"
									/>

									<h3 className="leading-[1.4] lg:text-[24px]">{post.title}</h3>
									<p className="text-[12px] text-cedar-black/80 lg:text-[14px]">
										{post.description ?? "Read the latest update from CedarRise."}
									</p>

									<div className="flex items-center justify-between gap-4">
										<h4 className="text-cedar-red">
											{new Intl.DateTimeFormat("en", {
												day: "2-digit",
												month: "2-digit",
												year: "2-digit",
											}).format(new Date(post.date))}
										</h4>
										<Button
											as="a"
											href={post.documentUrl}
											target="_blank"
											rel="noreferrer"
											className="h-12 rounded-[12px] text-[12px] lg:h-12 lg:px-9 lg:text-base"
										>
											Read More
										</Button>
									</div>
								</li>
							)}
						/>
					)}
				</Switch.Match>
			</Switch.Root>
		</section>
	);
}
