import { authCheck } from "@/middlewares/auth";
import { Router } from "express";
import { userHandlers } from "./handlers";

export const userRouters = Router();

const BASE_ENDPOINT = "/user";

userRouters.post(`${BASE_ENDPOINT}`, authCheck, userHandlers.postUser);
userRouters.get(`${BASE_ENDPOINT}/:uid`, authCheck, userHandlers.getUser);
userRouters.put(`${BASE_ENDPOINT}/:uid`, authCheck, userHandlers.putUser);
userRouters.delete(`${BASE_ENDPOINT}/:uid`, authCheck, userHandlers.deleteUser);
