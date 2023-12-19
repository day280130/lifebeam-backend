import type { RequestHandler } from "express";
import { userSchemas } from "./schemas";
import { responseMessages } from "@/lib/utils";
import { PrismaClientKnownRequestError, prisma } from "@/lib/prisma";

const postUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.token)
      return res.status(401).json({
        message: responseMessages.error.unAuthorized,
      });

    const inputBody = userSchemas.postBody.safeParse(req.body);
    if (!inputBody.success) {
      return res.status(400).json({
        message: responseMessages.error.reqBody,
      });
    }

    await prisma.user.create({
      data: {
        uid: req.token.decoded.uid,
        ...inputBody.data,
      },
    });
    return res.status(201).json({
      message: responseMessages.success.post,
    });
  } catch (error) {
    next(error);
  }
};
const getUser: RequestHandler = async (req, res, next) => {
  try {
    const paramId = userSchemas.params.safeParse(req.params);
    if (!paramId.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }
    const user = await prisma.user.findFirst({
      where: { uid: paramId.data.uid },
      select: { age: true, gender: true },
    });

    if (!user) {
      return res.status(404).json({
        message: responseMessages.error.notFound,
      });
    }

    return res.status(200).json({
      message: responseMessages.success.get,
      age: user.age,
      gender: user.gender,
    });
  } catch (error) {
    next(error);
  }
};
const putUser: RequestHandler = async (req, res, next) => {
  try {
    const paramId = userSchemas.params.safeParse(req.params);
    if (!paramId.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    const inputBody = userSchemas.putBody.safeParse(req.body);
    if (!inputBody.success) {
      return res.status(400).json({
        message: responseMessages.error.reqBody,
      });
    }
    await prisma.user.update({
      where: { uid: paramId.data.uid },
      data: inputBody.data,
    });
    return res.status(200).json({
      message: responseMessages.success.put,
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        message: responseMessages.error.notFound,
      });
    }
    next(error);
  }
};
const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const paramId = userSchemas.params.safeParse(req.params);
    if (!paramId.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    await prisma.user.delete({
      where: { uid: paramId.data.uid },
    });

    return res.status(200).json({
      message: responseMessages.success.delete,
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        message: responseMessages.error.notFound,
      });
    }
    next(error);
  }
};

export const userHandlers = {
  postUser,
  getUser,
  putUser,
  deleteUser,
};
