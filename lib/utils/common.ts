export const capitalize = (value: string | undefined) => {
	if (!value) {
		return value;
	}

	return `${value[0]?.toUpperCase()}${value.slice(1)}`;
};
