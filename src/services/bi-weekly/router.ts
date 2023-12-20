import { authCheck } from "@/middlewares/auth";
import { Router } from "express";
import { biWeeklyHandlers } from "./handlers";

export const biWeeklyRouters = Router();

const BASE_ENDPOINT = "/logbook/bi-weekly";

biWeeklyRouters.post(`${BASE_ENDPOINT}`, authCheck, biWeeklyHandlers.postBiWeekly);
biWeeklyRouters.get(`${BASE_ENDPOINT}/:id`, authCheck, biWeeklyHandlers.getBiWeekly);
biWeeklyRouters.put(`${BASE_ENDPOINT}/:id`, authCheck, biWeeklyHandlers.putBiWeekly);
biWeeklyRouters.delete(`${BASE_ENDPOINT}/:id`, authCheck, biWeeklyHandlers.deleteBiWeekly);
