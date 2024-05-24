import { detectPrng, factory } from "ulid";

const prng = detectPrng(true);

export const ulid = factory(prng);
