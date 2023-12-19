import { responseMessages, type ReqHandler } from "@/lib/utils";
import { exerciseSchemas } from "./schemas";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const postExercise: ReqHandler = async (req, res, next) => {
  try {
    const inputBody = exerciseSchemas.postBody.safeParse(req.body);
    if (!inputBody.success) {
      return res.status(400).json({
        message: responseMessages.error.reqBody,
      });
    }

    const insertResult = await prisma.exercise.create({
      data: inputBody.data,
    });

    const safeInsertResult = exerciseSchemas.base.parse(insertResult);
    return res.status(201).json({
      message: responseMessages.success.post,
      id: safeInsertResult.id,
    });
  } catch (error) {
    next(error);
  }
};

const getExercise: ReqHandler = async (req, res, next) => {
  try {
    const paramId = exerciseSchemas.params.safeParse(req.params);
    if (!paramId.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    const exercise = await prisma.exercise.findFirst({
      where: { id: paramId.data.id },
      select: { name: true, unit: true, calorieBurned: true },
    });

    if (!exercise) {
      return res.status(404).json({
        message: responseMessages.error.notFound,
      });
    }

    return res.status(200).json({
      message: responseMessages.success.get,
      name: exercise.name,
      unit: exercise.unit,
      calorieBurned: exercise.calorieBurned,
    });
  } catch (error) {
    next(error);
  }
};

const putExercise: ReqHandler = async (req, res, next) => {
  try {
    const paramId = exerciseSchemas.params.safeParse(req.params);
    if (!paramId.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    const inputBody = exerciseSchemas.postBody.safeParse(req.body);
    if (!inputBody.success) {
      return res.status(400).json({
        message: responseMessages.error.reqBody,
      });
    }

    await prisma.exercise.update({
      where: { id: paramId.data.id },
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

const deleteExercise: ReqHandler = async (req, res, next) => {
  try {
    const paramId = exerciseSchemas.params.safeParse(req.params);
    if (!paramId.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    await prisma.exercise.delete({
      where: { id: paramId.data.id },
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

export const exerciseHandlers = {
  postExercise,
  getExercise,
  putExercise,
  deleteExercise,
};
