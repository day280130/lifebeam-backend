import { prisma } from "@/lib/prisma";
import { responseMessages, type ReqHandler } from "@/lib/utils";
import { dailySchemas } from "@/services/daily/schemas";

const get: ReqHandler = async (req, res, next) => {
  try {
    const reqParams = dailySchemas.params.safeParse(req.params);
    if (!reqParams.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    const dietEntry = await prisma.diet.findFirst({
      where: reqParams.data.id,
      select: {
        foods: {
          select: {
            amount: true,
            food: { select: { id: true, name: true, calorieAmount: true } },
          },
        },
      },
    });

    const activityEntry = await prisma.activity.findFirst({
      where: reqParams.data.id,
      select: {
        exercises: {
          select: {
            amount: true,
            exercise: {
              select: { id: true, name: true, unit: true, calorieBurned: true },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: responseMessages.success.get,
      diets: dietEntry?.foods ?? [],
      activities: activityEntry?.exercises ?? [],
    });
  } catch (error) {
    next(error);
  }
};

export const dailyHandlers = { get };
