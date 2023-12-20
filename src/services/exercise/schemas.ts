import { z } from "zod";

const base = z.object({
  id: z.string().uuid(),
  name: z.string(),
  unit: z.string(),
  calorieBurned: z.number(),
});

const postBody = base.omit({ id: true });

const putBody = base.omit({ id: true }).partial();

const params = base.pick({ id: true });

const queries = z.object({
  limit: z.coerce.number().default(Number.MAX_SAFE_INTEGER),
  page: z.coerce.number().default(0),
});

export const exerciseSchemas = { base, postBody, putBody, params, queries };
