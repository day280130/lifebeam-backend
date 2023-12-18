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

export const exerciseSchemas = { base, postBody, putBody, params };
