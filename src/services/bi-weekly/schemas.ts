import { z } from "zod";

const base = z.object({
  id: z
    .string()
    .refine(val => /^[a-zA-Z0-9]{1,36}-\d{4}-\d{2}$/.test(val))
    .transform(val => {
      const idSplitted = val.split("-");
      const userId = idSplitted[0] ?? "";
      idSplitted.splice(0, 1);
      const weekTime = idSplitted.join("-");
      return { userId, weekTime };
    }),
  height: z.number(),
  weight: z.number(),
});

const postBody = base.omit({ id: true }).extend({
  weekTime: z.string().refine(val => /^\d{4}-\d{2}$/.test(val)),
});

const putBody = base.omit({ id: true }).partial();

const params = base.pick({ id: true });

export const biWeeklySchemas = { base, postBody, putBody, params };
