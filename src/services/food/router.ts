import { authCheck } from "@/middlewares/auth";
import { Router } from "express";
import { foodHandlers } from "./handlers";

export const foodRouters = Router();

const BASE_ENDPOINT = "/food";

foodRouters.post(`${BASE_ENDPOINT}`, authCheck, foodHandlers.postFood);
foodRouters.get(`${BASE_ENDPOINT}`, authCheck, foodHandlers.getFoods);
foodRouters.get(`${BASE_ENDPOINT}/:id`, authCheck, foodHandlers.getFood);
foodRouters.put(`${BASE_ENDPOINT}/:id`, authCheck, foodHandlers.putFood);
foodRouters.delete(`${BASE_ENDPOINT}/:id`, authCheck, foodHandlers.deleteFood);
