import { authCheck } from "@/middlewares/auth";
import { authHandlers } from "@/services/auth/handlers";
import { Router } from "express";

export const authRouters = Router();

const BASE_ENDPOINT = "/auth";

authRouters.post(`${BASE_ENDPOINT}/logout`, authCheck, authHandlers.logout);
authRouters.get(`${BASE_ENDPOINT}/check`, authCheck, authHandlers.check);
