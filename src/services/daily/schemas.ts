import { z } from "zod";

const params = z.object({
  id: z
    .string()
    .refine(val => /^[a-zA-Z0-9]{1,36}-\d{4}-\d{2}-\d{2}$/.test(val))
    .transform(val => {
      const idSplitted = val.split("-");
      const userId = idSplitted[0] ?? "";
      idSplitted.splice(0, 1);
      const dateTime = idSplitted.join("-");
      return { userId, dateTime };
    }),
});

export const dailySchemas = { params };
