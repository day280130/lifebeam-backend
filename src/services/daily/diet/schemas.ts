import { foodSchemas } from "@/services/food/schemas";
import { z } from "zod";

const postBody = z.object({
  dateTime: z.string().refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val)),
  diets: z.array(
    z.object({
      foodId: foodSchemas.base.shape.id,
      amount: z.number(),
    })
  ),
});

const putBody = postBody.omit({ dateTime: true });

export const dietSchemas = { postBody, putBody };
