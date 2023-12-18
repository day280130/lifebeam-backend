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
    exercises: [
      {
        id: randomUUID(),
        name: "cycling",
        unit: "hour",
        calorieBurned: 2000,
      },
      {
        id: randomUUID(),
        name: "archery",
        unit: "hour",
        calorieBurned: 900,
      },
      {
        id: randomUUID(),
        name: "swimming",
        unit: "minute",
        calorieBurned: 1500,
      },
    ],
    pagination: {
      limit: 3,
      page: 0,
      maxPage: 1,
    },
  });
};

export const exerciseRouters = Router();

const BASE_ENDPOINT = "/exercise";
exerciseRouters.get(`${BASE_ENDPOINT}`, authCheck, mockGet);
