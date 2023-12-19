import { z } from "zod";

const params = z.object({
  id: z
    .string()
    .refine(val => /^[a-zA-Z0-9]{1,36}-\d{4}-\d{2}-\d{2}$/.test(val))
    .transform(val => {
      const userId = val.split("-")[0] ?? "";
      const dateTime = val.split("-").splice(0, 1).join("-");
      return { userId, dateTime };
    }),
});

export const dailySchemas = { params };
