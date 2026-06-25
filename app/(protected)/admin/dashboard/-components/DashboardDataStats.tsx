import { For } from "@/components/common/for";
import { Card } from "@/components/ui/card";

export function DashboardDataStats(props: {
	stats: ReadonlyArray<{ label: string; value: number | string }>;
}) {
	const { stats } = props;

	return (
		<section className="grid gap-4 lg:grid-cols-4 lg:gap-6">
			<For
				each={stats}
				renderItem={(stat) => (
					<Card.Root
						key={stat.label}
						className="rounded-[18px] border border-cedar-black/10 bg-cedar-white p-7
							lg:min-h-[140px] lg:px-8 lg:py-9"
					>
						<Card.Content>
							<Card.Title className="text-[30px] font-semibold text-cedar-black lg:text-[40px]">
								{stat.value}
							</Card.Title>
							<Card.Description className="mt-2 text-[14px] text-cedar-black/64 lg:text-[18px]">
								{stat.label}
							</Card.Description>
						</Card.Content>
					</Card.Root>
				)}
			/>
		</section>
	);
}
