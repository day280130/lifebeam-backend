import { z } from "zod";

const base = z.object({
  id: z.string().uuid(),
  name: z.string(),
  calorieAmount: z.number(),
});

const postBody = base.omit({ id: true });

const putBody = base.omit({ id: true }).partial();

const params = base.pick({ id: true });

const queries = z.object({
  limit: z.number().default(Number.MAX_SAFE_INTEGER),
  page: z.number().default(0),
});

export const foodSchemas = { base, postBody, putBody, params, queries };
