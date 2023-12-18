import { exerciseSchemas } from "@/services/exercise/schemas";
import { z } from "zod";

const postBody = z.object({
  dateTime: z.string().refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val)),
  activities: z.array(
    z.object({
      exerciseId: exerciseSchemas.base.shape.id,
      amount: z.number(),
    })
  ),
});

const putBody = postBody.omit({ dateTime: true });

export const dietSchemas = { postBody, putBody };
