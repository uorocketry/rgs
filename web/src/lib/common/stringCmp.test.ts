import { expect, test } from "vitest";
import { sum } from "./stringCmp";

test("add 2 numbers", () => {
	expect(sum(2, 3)).toEqual(5);
});
