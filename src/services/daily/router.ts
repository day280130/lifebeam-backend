import { authCheck } from "@/middlewares/auth";
import { activityHandlers } from "@/services/daily/activity/handlers";
import { dietHandlers } from "@/services/daily/diet/handlers";
import { dailyHandlers } from "@/services/daily/handlers";
import { Router } from "express";

export const dailyRouters = Router();

const BASE_ENDPOINT = "/logbook/daily";

// daily logbook endpoints
dailyRouters.get(`${BASE_ENDPOINT}/:id`, authCheck, dailyHandlers.get);

// diet endpoints
dailyRouters.post(`${BASE_ENDPOINT}/diet`, authCheck, dietHandlers.postDiet);
dailyRouters.put(`${BASE_ENDPOINT}/diet/:id`, authCheck, dietHandlers.putDiet);
dailyRouters.delete(`${BASE_ENDPOINT}/diet/:id`, authCheck, dietHandlers.deleteDiet);

// activity endpoints
dailyRouters.post(`${BASE_ENDPOINT}/activity`, authCheck, activityHandlers.postActivity);
dailyRouters.put(`${BASE_ENDPOINT}/activity/:id`, authCheck, activityHandlers.putActivity);
dailyRouters.delete(`${BASE_ENDPOINT}/activity/:id`, authCheck, activityHandlers.deleteActivity);
