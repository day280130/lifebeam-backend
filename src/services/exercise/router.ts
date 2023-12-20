import { authCheck } from "@/middlewares/auth";
import { Router } from "express";
import { exerciseHandlers } from "./handlers";
import { adminCheck } from "@/middlewares/role";

export const exerciseRouters = Router();

const BASE_ENDPOINT = "/exercise";

exerciseRouters.post(`${BASE_ENDPOINT}`, authCheck, adminCheck, exerciseHandlers.postExercise);
exerciseRouters.get(`${BASE_ENDPOINT}`, authCheck, exerciseHandlers.getExercises);
exerciseRouters.get(`${BASE_ENDPOINT}/:id`, authCheck, exerciseHandlers.getExercise);
exerciseRouters.put(`${BASE_ENDPOINT}/:id`, authCheck, adminCheck, exerciseHandlers.putExercise);
exerciseRouters.delete(
  `${BASE_ENDPOINT}/:id`,
  authCheck,
  adminCheck,
  exerciseHandlers.deleteExercise
);
