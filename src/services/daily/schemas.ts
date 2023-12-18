import { z } from "zod";

export const params = z.object({
  id: z
    .string()
    .refine(val => /^[a-zA-Z0-9]{1,36}-\d{4}-\d{2}-\d{2}$/.test(val))
    .transform(val => {
      const userId = val.split("-")[0] ?? "";
      const weekTime = val.split("-").splice(0, 1).join("-");
      return { userId, weekTime };
    }),
});
