import { PrismaClientKnownRequestError, prisma } from "@/lib/prisma";
import { responseMessages, type ReqHandler } from "@/lib/utils";
import { dietSchemas } from "@/services/daily/diet/schemas";
import { dailySchemas } from "@/services/daily/schemas";

const postDiet: ReqHandler = async (req, res, next) => {
  try {
    if (!req.token) {
      return res.status(401).json({
        message: responseMessages.error.unAuthorized,
      });
    }
    const userId = req.token.decoded.uid;

    const reqBody = dietSchemas.postBody.safeParse(req.body);
    if (!reqBody.success) {
      return res.status(400).json({
        message: responseMessages.error.reqBody,
      });
    }

    await prisma.diet.create({
      data: {
        userId,
        dateTime: reqBody.data.dateTime,
        foods: {
          create: reqBody.data.diets,
        },
      },
    });

    return res.status(201).json({
      message: responseMessages.success.post,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        let field = "UNKNOWN FIELD is";
        if (error.meta?.target === "PRIMARY") {
          field = "user is";
        }
        if (error.meta?.field_name === "food_id") {
          field = "some of the foods are";
        }
        return res.status(400).json({
          message: `${field} not registered in database`,
          error,
        });
      }
      if (error.code === "P2002") {
        return res.status(400).json({
          message:
            "diet entry for this user at provided dateTime has already registered in database",
          error,
        });
      }
    }
    next(error);
  }
};

const putDiet: ReqHandler = async (req, res, next) => {
  try {
    const reqParams = dailySchemas.params.safeParse(req.params);
    if (!reqParams.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    const reqBody = dietSchemas.putBody.safeParse(req.body);
    if (!reqBody.success) {
      return res.status(400).json({
        message: responseMessages.error.reqBody,
      });
    }

    const currentDiet = await prisma.diet.findFirst({
      where: reqParams.data.id,
      select: {
        user: {
          select: { uid: true, gender: true, age: true, role: true },
        },
        dateTime: true,
        foods: {
          select: {
            amount: true,
            food: { select: { id: true, name: true, calorieAmount: true } },
          },
        },
      },
    });
    if (!currentDiet) {
      return res.status(404).json({
        message: responseMessages.error.notFound,
      });
    }

    const reqBodyFoodIds = reqBody.data.diets.map(entry => entry.foodId);

    const deletedFoodEntries = currentDiet.foods.filter(
      entry => !reqBodyFoodIds.includes(entry.food.id)
    );

    const upserts = reqBody.data.diets.map(entry =>
      prisma.foodOnDiet.upsert({
        where: {
          userId_dateTime_foodId: {
            foodId: entry.foodId,
            userId: reqParams.data.id.userId,
            dateTime: reqParams.data.id.dateTime,
          },
        },
        update: { amount: entry.amount },
        create: {
          ...entry,
          ...reqParams.data.id,
        },
      })
    );

    const upsertResults = await Promise.allSettled(upserts);

    if (
      upsertResults.filter(upsert => upsert.status === "rejected").length > 0
    ) {
      const rollbacks = currentDiet.foods.map(entry =>
        prisma.foodOnDiet.upsert({
          where: {
            userId_dateTime_foodId: {
              foodId: entry.food.id,
              userId: reqParams.data.id.userId,
              dateTime: reqParams.data.id.dateTime,
            },
          },
          update: { amount: entry.amount },
          create: {
            foodId: entry.food.id,
            amount: entry.amount,
            ...reqParams.data.id,
          },
        })
      );
      await Promise.allSettled(rollbacks);
      return res.status(400).json({
        message: "some of the foods are not registered in database",
      });
    }

    await prisma.diet.update({
      where: {
        dateTime_userId: reqParams.data.id,
      },
      data: {
        foods: {
          deleteMany: {
            foodId: { in: deletedFoodEntries.map(entry => entry.food.id) },
          },
        },
      },
    });

    return res.status(200).json({
      message: responseMessages.success.put,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDiet: ReqHandler = async (req, res, next) => {
  try {
    const reqParams = dailySchemas.params.safeParse(req.params);
    if (!reqParams.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    await prisma.diet.delete({ where: { dateTime_userId: reqParams.data.id } });

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

export const dietHandlers = { postDiet, putDiet, deleteDiet };
