export const getKeyName = (...args: string[]) => {
	return `bites:${args.join(":")}`;
};
