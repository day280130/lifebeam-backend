import { authCheck } from "@/middlewares/auth";
import { Router } from "express";
import { foodHandler } from "./handlers";

export const foodRouters = Router();

const BASE_ENDPOINT = "/food";

foodRouters.post(`${BASE_ENDPOINT}`, authCheck, foodHandler.postFood);
foodRouters.get(`${BASE_ENDPOINT}/:id`, authCheck, foodHandler.getFood);
foodRouters.put(`${BASE_ENDPOINT}/:id`, authCheck, foodHandler.putFood);
foodRouters.delete(`${BASE_ENDPOINT}/:id`, authCheck, foodHandler.deleteFood);
