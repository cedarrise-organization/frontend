"use client";

// import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
// import { blogCardImg, heroImg } from "@/assets/images/blog";
import { heroImg } from "@/assets/images/blog";
// import { ForWithWrapper } from "@/components/common/for";
// import { Switch } from "@/components/common/switch";
// import { Button } from "@/components/ui/button";
// import { blogsQuery } from "@/lib/react-query/queryOptions";
import { FinalCTASection } from "../-components/FinalCTASectionShared";
import { Main } from "../-components/Main";

function BlogPage() {
	return (
		<Main layout="fill" className="gap-10 lg:gap-[64px]">
			{() => (
				<>
					<BlogHeroSection />

					{/* <div className={ctx.constrainedClassName}>
						<FeaturedPostsSection />
					</div> */}

					<FinalCTASection
						title="Stay Connected"
						description="Follow our journey and be part of the impact we’re creating"
						actions={[
							{ href: "/donate", label: "Donate" },
							{ href: "/get-involved/partner", kind: "icon-link", label: "Get Involved" },
						]}
					/>
				</>
			)}
		</Main>
	);
}

export default BlogPage;

function BlogHeroSection() {
	return (
		<section
			className="relative isolate flex h-[402px] w-full items-center justify-center px-6 text-center
				text-cedar-white lg:h-[610px] lg:px-[50px]"
		>
			<header className="flex flex-col items-center gap-4 lg:gap-8">
				<a
					target="_blank"
					rel="noreferrer"
					href="#"
					className="text-[40px]/[1.1] lg:text-[80px]/[1.1]"
				>
					Latest from CedarRise
				</a>

				<p className="text-[10px]/4 text-pretty max-lg:max-w-[284px] lg:text-base/7">
					Stay updated with our latest news, upcoming events, impact stories, and announcements from
					across our programmes
				</p>
			</header>

			<div className="absolute inset-0 isolate -z-1">
				<Image src={heroImg} alt="Blog" priority={true} className="size-full object-cover" />

				<span
					className="absolute inset-0
						bg-linear-[270deg,theme(--color-cedar-black/0.56)_0%,theme(--color-cedar-black/0.56)_100%]"
				/>
			</div>
		</section>
	);
}

// function FeaturedPostsSection() {
// 	const blogsQueryResult = useQuery(blogsQuery());
// 	const records = blogsQueryResult.data?.data;

// 	return (
// 		<section className="flex flex-col gap-5 lg:gap-10">
// 			<h2 className="text-center text-[24px]/[1.2] lg:text-[40px]">Featured</h2>

// 			<Switch.Root>
// 				<Switch.Match when={blogsQueryResult.isPending}>
// 					<ForWithWrapper
// 						className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-5"
// 						each={3}
// 						renderItem={(item) => (
// 							<li
// 								key={item}
// 								className="flex animate-pulse flex-col gap-5 rounded-[24px] bg-cedar-grey p-4
// 									lg:rounded-[32px]"
// 							>
// 								<span className="h-[226px] rounded-[20px] bg-cedar-black/8" />
// 								<span className="h-7 rounded-[8px] bg-cedar-black/8" />
// 								<span className="h-16 rounded-[8px] bg-cedar-black/8" />
// 								<span className="h-12 rounded-[12px] bg-cedar-black/8" />
// 							</li>
// 						)}
// 					/>
// 				</Switch.Match>

// 				<Switch.Match when={records?.length === 0}>
// 					<p className="text-center text-[14px] text-cedar-black/64">
// 						No blog posts have been published yet.
// 					</p>
// 				</Switch.Match>

// 				<Switch.Match when={records}>
// 					{(definedRecords) => (
// 						<ForWithWrapper
// 							className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-5"
// 							each={definedRecords}
// 							renderItem={(post) => (
// 								<li
// 									key={post.id}
// 									className="flex flex-col gap-5 rounded-[24px] bg-cedar-grey p-4
// 										lg:rounded-[32px]"
// 								>
// 									<Image
// 										src={post.documentUrl.replace(
// 											"/upload/",
// 											"/upload/pg_1/f_jpg,w_400,h_250,c_fill/"
// 										)}
// 										alt={post.title}
// 										width={400}
// 										height={250}
// 										className="rounded-[20px] object-cover"
// 									/>

// 									<h3 className="leading-[1.4] lg:text-[24px]">{post.title}</h3>
// 									<p className="text-[12px] text-cedar-black/80 lg:text-[14px]">
// 										{post.description ?? "Read the latest update from CedarRise."}
// 									</p>

// 									<div className="flex items-center justify-between gap-4">
// 										<h4 className="text-cedar-red">
// 											{new Intl.DateTimeFormat("en", {
// 												day: "2-digit",
// 												month: "2-digit",
// 												year: "2-digit",
// 											}).format(new Date(post.date))}
// 										</h4>
// 										<Button
// 											as="a"
// 											href={post.documentUrl}
// 											target="_blank"
// 											rel="noreferrer"
// 											className="h-12 rounded-[12px] text-[12px] lg:h-12 lg:px-9 lg:text-base"
// 										>
// 											Read More
// 										</Button>
// 									</div>
// 								</li>
// 							)}
// 						/>
// 					)}
// 				</Switch.Match>
// 			</Switch.Root>
// 		</section>
// 	);
// }
