import type { ReqHandler } from "@/lib/utils";
import { authCheck } from "@/middlewares/auth";
import { Router } from "express";

const mockGet: ReqHandler = (req, res) => {
  if (!req.token)
    return res.status(401).json({
      message: "illegal auth check bypass",
    });
  return res.status(200).json({
    message: "datas found",
    height: 178.5,
    weight: 69.69,
  });
};

export const exerciseRouters = Router();

const BASE_ENDPOINT = "/logbook/bi-weekly";
exerciseRouters.get(`${BASE_ENDPOINT}/:id`, authCheck, mockGet);
