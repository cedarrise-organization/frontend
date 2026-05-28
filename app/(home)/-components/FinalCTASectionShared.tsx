/* eslint-disable unicorn/filename-case -- File does not follow expected naming convention. */
import { IconBox } from "@/components/common/IconBox";
import { NavLink, NavLinkEphemeral } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";

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
				<NavLinkEphemeral href="/donate">
					<Button className="shrink-0">Donate Now</Button>
				</NavLinkEphemeral>

				<NavLink href="/get-involved/partner" className="flex items-center gap-2">
					<p className="text-[14px] font-medium lg:text-[20px]">Get Involved</p>

					<Button theme="secondary" size="icon" className="shrink-0">
						<IconBox icon="solar:arrow-right-up-outline" />
					</Button>
				</NavLink>
			</div>
		</section>
	);
}

export { FinalCTASection };
