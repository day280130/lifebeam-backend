import { authCheck } from "@/middlewares/auth";
import { predictHandler } from "@/services/predict/handlers";
import { Router } from "express";

export const predictRouters = Router();

const BASE_ENDPOINT = "/predict";

predictRouters.get(`${BASE_ENDPOINT}/:uid`, authCheck, predictHandler);
