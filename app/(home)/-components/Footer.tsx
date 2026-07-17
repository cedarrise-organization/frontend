import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Logo } from "@/components/common/Logo";
import { NavLink, NavLinkEphemeral, type MainAppRoutes } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { HomeFeedbackForm } from "./HomeFeedbackForm";

const quickLinks = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/capacity-building", label: "Capacity Building" },
	{ href: "#", label: "Sustainability Initiatives" },
] satisfies Array<{ href: MainAppRoutes; label: string }>;

const socialInitiatives = [
	{ href: "/social-initiatives/ash", label: "After School Hours (ASH)" },
	{ href: "/social-initiatives/tacots", label: "TACOTS" },
	{ href: "/social-initiatives/outreaches", label: "Community Outreach" },
	{ href: "/blog", label: "Blogs" },
] satisfies Array<{ href: MainAppRoutes; label: string }>;

const socialLinks = [
	{ href: siteConfig.contact.phone.href, icon: "ph:phone-fill", label: "Phone" },
	{
		href: siteConfig.contact.email.href,
		icon: "solar:letter-linear",
		label: "Email",
	},
	{
		href: siteConfig.social.instagram,
		icon: "ph:instagram-logo-bold",
		label: "Instagram",
	},
	{
		href: siteConfig.social.linkedIn,
		icon: "ri:linkedin-fill",
		label: "LinkedIn",
	},
	{
		href: siteConfig.contact.phone.whatsAppUrl,
		icon: "ic:baseline-whatsapp",
		label: "WhatsApp",
	},
	{
		href: siteConfig.websiteUrl,
		icon: "lucide:globe",
		label: "Website",
	},
	{
		href: siteConfig.social.youTube,
		icon: "ph:youtube-logo-fill",
		label: "YouTube",
	},
	{
		href: siteConfig.social.tikTok,
		icon: "ic:baseline-tiktok",
		label: "TikTok",
	},
] satisfies Array<{ href: string; icon: string; label: string }>;

function Footer() {
	return (
		<footer
			className="flex w-full max-w-[412px] flex-col items-center gap-10 bg-cedar-white px-4 py-8
				lg:max-w-[1400px] lg:gap-20 lg:px-[50px] lg:py-[60px]"
		>
			<section className="flex w-full flex-col gap-12 lg:flex-row lg:justify-between">
				<article className="flex w-full flex-col gap-6">
					<h2 className="text-[24px]/none lg:text-[32px]">We’d Love Your Feedback</h2>
					<HomeFeedbackForm />
				</article>

				<article className="flex w-full flex-col gap-5 lg:gap-10">
					<div className="flex flex-wrap gap-12 lg:justify-between lg:gap-[90px]">
						<div className="flex flex-col gap-2 lg:gap-3.5">
							<h3 className="text-[12px] font-medium lg:text-[20px]">Quick Links</h3>

							<ForWithWrapper
								className="flex flex-col gap-4 text-[12px] font-light text-cedar-black/72
									lg:text-[16px]"
								each={quickLinks}
								renderItem={(link) => (
									<NavLink
										key={link.label}
										href={link.href}
										className="transition-colors hover:text-cedar-red"
									>
										{link.label}
									</NavLink>
								)}
							/>
						</div>

						<div className="flex flex-col gap-2 lg:gap-3.5">
							<h3 className="text-[12px] font-medium lg:text-[20px]">Social Initiatives</h3>

							<ForWithWrapper
								as="nav"
								className="flex flex-col gap-4 text-[12px] font-light text-cedar-black/72
									lg:text-[16px]"
								each={socialInitiatives}
								renderItem={(link) => (
									<NavLink
										key={link.label}
										href={link.href}
										className="transition-colors hover:text-cedar-red"
									>
										{link.label}
									</NavLink>
								)}
							/>
						</div>
					</div>

					<ForWithWrapper
						as="nav"
						className="flex flex-wrap gap-4 lg:gap-6"
						each={socialLinks}
						renderItem={(link) => (
							<a
								key={link.label}
								href={link.href}
								aria-label={link.label}
								target={link.href.startsWith("http") ? "_blank" : undefined}
								rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
								className="grid size-8 place-content-center rounded-full bg-cedar-yellow
									text-cedar-white transition-transform hover:scale-105 lg:size-12"
							>
								<IconBox icon={link.icon} className="size-5 lg:size-6" />
							</a>
						)}
					/>
				</article>
			</section>

			<section
				className="mt-[50px] flex w-full flex-col gap-10 lg:mt-[90px] lg:flex-row lg:items-center
					lg:justify-between"
			>
				<div className="flex w-full items-center gap-5 lg:justify-between lg:gap-[74px]">
					<Logo />

					<p className="text-[10px] lg:max-w-[456px] lg:text-base">
						Empowering underserved communities through education, mentorship, and sustainable
						development.
					</p>
				</div>

				<NavLinkEphemeral href="/auth/admin/signin">
					<Button
						theme="secondary"
						className="h-9 px-6 text-[10px] lg:h-10 lg:rounded-[12px] lg:px-6 lg:text-[14px]"
					>
						Admin
					</Button>
				</NavLinkEphemeral>
			</section>

			<p className="mt-8 text-[10px] lg:mt-10 lg:text-[14px]">
				© {siteConfig.copyrightYear} {siteConfig.organizationName}. All rights reserved.
			</p>
		</footer>
	);
}

export { Footer };
