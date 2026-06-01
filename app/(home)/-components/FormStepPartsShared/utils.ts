import { defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";
import type { z } from "zod";

export type StepItemsArray = ReadonlyArray<{
	StepComponent: React.FunctionComponent;
	title: string;
	validator: z.ZodObject;
}>;

export const defineFormStepItems = <const TStepItems extends StepItemsArray>(items: TStepItems) => {
	return defineEnumDeep(items);
};
