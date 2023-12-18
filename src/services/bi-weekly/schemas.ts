import { z } from "zod";

const base = z.object({
  id: z
    .string()
    .refine(val => /^[a-zA-Z0-9]{1,36}-\d{4}-\d{2}$/.test(val))
    .transform(val => {
      const userId = val.split("-")[0] ?? "";
      const weekTime = val.split("-").splice(0, 1).join("-");
      return { userId, weekTime };
    }),
  height: z.number(),
  weight: z.number(),
});

const postBody = base.omit({ id: true });

const putBody = base.omit({ id: true }).partial();

const params = base.pick({ id: true });

export const biWeeklySchemas = { base, postBody, putBody, params };
