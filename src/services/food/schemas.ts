import { z } from "zod";

const base = z.object({
  id: z.string().uuid(),
  name: z.string(),
  calorieAmount: z.number(),
});

const postBody = base.omit({ id: true });

const putBody = base.omit({ id: true }).partial();

const params = base.pick({ id: true });

export const foodSchemas = { base, postBody, putBody, params };
