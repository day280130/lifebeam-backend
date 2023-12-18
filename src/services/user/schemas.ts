import { z } from "zod";

const base = z.object({
  uid: z.string().max(36),
  age: z.number(),
  gender: z.enum(["MALE", "FEMALE"]),
  role: z.enum(["ADMIN", "USER"]),
});

const postBody = base.pick({ age: true, gender: true });

const putBody = base.pick({ age: true, gender: true }).partial();

const params = base.pick({ uid: true });

export const userSchemas = { base, postBody, putBody, params };
