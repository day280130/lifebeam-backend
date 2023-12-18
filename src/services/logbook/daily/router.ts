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
    diets: [
      {
        food: {
          id: randomUUID(),
          name: "sate",
          calorieAmount: 1000,
        },
        amount: 3,
      },
      {
        food: {
          id: randomUUID(),
          name: "sayur kangkung",
          calorieAmount: 100,
        },
        amount: 2,
      },
    ],
    activities: [
      {
        exercise: {
          id: randomUUID(),
          name: "cycling",
          unit: "hour",
          calorieBurned: 2000,
        },
        amount: 3,
      },
      {
        exercise: {
          id: randomUUID(),
          name: "archery",
          unit: "hour",
          calorieBurned: 900,
        },
        amount: 2,
      },
    ],
  });
};

export const dailyRouters = Router();

const BASE_ENDPOINT = "/logbook/daily";
dailyRouters.get(`${BASE_ENDPOINT}/:id`, authCheck, mockGet);
