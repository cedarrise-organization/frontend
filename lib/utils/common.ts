export const chunkArray = <TArray extends unknown[]>(arr: TArray | undefined, chunkCount: number) => {
	if (!arr) {
		return [];
	}

	const numberOfItemsPerChunk = Math.ceil(arr.length / chunkCount);

	return [...Array(chunkCount).keys()].map((index) =>
		arr.slice(index * numberOfItemsPerChunk, (index + 1) * numberOfItemsPerChunk)
	) as TArray[];
};
