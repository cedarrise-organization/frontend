import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { Logo } from "@/components/common/Logo";
import { NavLink, type MainAppRoutes } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";

const quickLinks = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/social-initiatives/ash", label: "Social Initiatives" },
	{ href: "/capacity-building", label: "Capacity Building" },
	{ href: "/blog", label: "Blog" },
] satisfies Array<{ href: MainAppRoutes; label: string }>;

const socialInitiatives = [
	{ href: "/social-initiatives/ash", label: "After School Hours (ASH)" },
	{ href: "/social-initiatives/tacots", label: "TACOTS" },
	{ href: "/social-initiatives/outreaches", label: "Community Outreach" },
	{ href: "#", label: "Workshops" },
] satisfies Array<{ href: MainAppRoutes; label: string }>;

const contactInfo = [
	{ icon: "ph:map-pin-fill", text: "SouthEast Nigeria" },
	{ icon: "ri:mail-fill", text: "info@cedarriseinitiative" },
	{ icon: "ph:phone-fill", text: "09039377669" },
	{ icon: "ph:instagram-logo", text: "cedarriseinitiative" },
];

function Footer() {
	return (
		<footer
			className="flex w-full flex-col items-center gap-10 bg-cedar-white px-4 py-8 lg:gap-20
				lg:px-[100px] lg:py-[60px]"
		>
			<section className="flex w-full justify-center gap-9 lg:justify-between">
				<header className="flex flex-col">
					<Logo />

					<p
						className="mt-6 max-w-[160px] text-[10px]/[1.5] text-cedar-black/80 lg:mt-9
							lg:max-w-[318px] lg:text-base"
					>
						Empowering underserved communities through education, mentorship, and sustainable
						development.
					</p>

					<Button
						theme="secondary"
						className="mt-[50px] h-8.5 rounded-[12px] px-6 text-[10px] lg:h-10 lg:rounded-[12px]
							lg:px-6 lg:text-[14px]"
					>
						Admin
					</Button>
				</header>

				<article className="flex flex-wrap gap-x-4 gap-y-5 lg:mt-6 lg:gap-x-10">
					<div className="flex flex-col gap-2 lg:gap-3.5">
						<h3 className="text-[12px] font-medium lg:text-[20px]">Quick Links</h3>

						<ForWithWrapper
							className="flex flex-col gap-4 text-[8px] font-light lg:text-[14px]"
							each={quickLinks}
							renderItem={(link) => (
								<NavLink key={link.label} href={link.href}>
									{link.label}
								</NavLink>
							)}
						/>
					</div>

					<div className="flex flex-col gap-2 lg:gap-3.5">
						<h3 className="text-[12px] font-medium lg:text-[20px]">Social Initiatives</h3>

						<ForWithWrapper
							as="nav"
							className="flex flex-col gap-4 text-[8px] font-light lg:text-[14px]"
							each={socialInitiatives}
							renderItem={(link) => (
								<NavLink key={link.label} href={link.href}>
									{link.label}
								</NavLink>
							)}
						/>
					</div>

					<div className="flex flex-col gap-2 lg:gap-3.5">
						<h4 className="text-[12px] font-medium lg:text-[20px]">Contact Us</h4>

						<ForWithWrapper
							as="nav"
							className="flex flex-col gap-4 text-[8px] font-light lg:text-[14px]"
							each={contactInfo}
							renderItem={(info) => (
								<li key={info.text} className="flex items-center gap-0.5">
									<span
										className="grid size-3 place-content-center rounded-full bg-cedar-yellow
											text-cedar-white lg:size-5"
									>
										<IconBox icon={info.icon} className="size-2 lg:size-3" />
									</span>
									<span>:</span>
									<p className="ml-1">{info.text}</p>
								</li>
							)}
						/>
					</div>
				</article>
			</section>

			<section className="flex w-full flex-col gap-4 text-center lg:gap-8">
				<h4 className="text-[24px] font-medium text-cedar-yellow lg:-ml-12 lg:text-[32px]">
					Rooted in purpose. Rising for impact.
				</h4>

				<p className="text-[8px] lg:text-[14px]">© 2026 CedarRise Initiative. All rights reserved.</p>
			</section>
		</footer>
	);
}

export { Footer };
