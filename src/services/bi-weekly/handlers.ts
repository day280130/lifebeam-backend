import { responseMessages, type ReqHandler } from "@/lib/utils";
import { biWeeklySchemas } from "./schemas";
import { PrismaClientKnownRequestError, prisma } from "@/lib/prisma";

const postBiWeekly: ReqHandler = async (req, res, next) => {
  try {
    if (!req.token)
      return res.status(401).json({
        message: responseMessages.error.unAuthorized,
      });
    const userId = req.token.decoded.uid;

    const inputBody = biWeeklySchemas.postBody.safeParse(req.body);
    if (!inputBody.success) {
      return res.status(400).json({
        message: responseMessages.error.reqBody,
      });
    }

    await prisma.biWeekly.create({
      data: {
        ...inputBody.data,
        userId: userId,
      },
    });
    return res.status(201).json({
      message: responseMessages.success.post,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2003") {
      return res.status(400).json({
        message: "user is not registered in database",
      });
    }
    next(error);
  }
};

const getBiWeekly: ReqHandler = async (req, res, next) => {
  try {
    const paramId = biWeeklySchemas.params.safeParse(req.params);
    if (!paramId.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }
    const biWeekly = await prisma.biWeekly.findFirst({
      where: paramId.data.id,
      select: { height: true, weight: true },
    });
    if (!biWeekly) {
      return res.status(404).json({
        message: responseMessages.error.notFound,
      });
    }

    return res.status(200).json({
      message: responseMessages.success.get,
      ...biWeekly,
    });
  } catch (error) {
    next(error);
  }
};

const putBiWeekly: ReqHandler = async (req, res, next) => {
  try {
    const paramId = biWeeklySchemas.params.safeParse(req.params);
    if (!paramId.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    const inputBody = biWeeklySchemas.putBody.safeParse(req.body);
    if (!inputBody.success) {
      return res.status(400).json({
        message: responseMessages.error.reqBody,
      });
    }
    await prisma.biWeekly.update({
      where: { weekTime_userId: paramId.data.id },
      data: inputBody.data,
    });
    return res.status(200).json({
      message: responseMessages.success.put,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({
        message: responseMessages.error.notFound,
      });
    }
    next(error);
  }
};

const deleteBiWeekly: ReqHandler = async (req, res, next) => {
  try {
    const paramId = biWeeklySchemas.params.safeParse(req.params);
    if (!paramId.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    await prisma.biWeekly.delete({
      where: { weekTime_userId: paramId.data.id },
    });

    return res.status(200).json({
      message: responseMessages.success.delete,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({
        message: responseMessages.error.notFound,
      });
    }
    next(error);
  }
};

export const biWeeklyHandlers = {
  postBiWeekly,
  getBiWeekly,
  putBiWeekly,
  deleteBiWeekly,
};
