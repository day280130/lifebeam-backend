import type { ReqHandler } from "@/lib/utils";
import { authCheck } from "@/middlewares/auth";
import { randomUUID } from "crypto";
import { Router } from "express";

const mockGet: ReqHandler = (req, res) => {
  if (!req.token)
    return res.status(401).json({
      message: "illegal auth check bypass",
    });
  return res.status(200).json({
    message: "datas found",
    foods: [
      {
        id: randomUUID(),
        name: "sate",
        calorieAmount: 1000,
      },
      {
        id: randomUUID(),
        name: "sayur kangkung",
        calorieAmount: 100,
      },
      {
        id: randomUUID(),
        name: "ayam",
        calorieAmount: 1500,
      },
    ],
    pagination: {
      limit: 3,
      page: 0,
      maxPage: 1,
    },
  });
};

export const foodRouters = Router();

const BASE_ENDPOINT = "/food";
foodRouters.get(`${BASE_ENDPOINT}`, authCheck, mockGet);
