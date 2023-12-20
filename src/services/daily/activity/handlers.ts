import { PrismaClientKnownRequestError, prisma } from "@/lib/prisma";
import { responseMessages, type ReqHandler } from "@/lib/utils";
import { activitySchemas } from "@/services/daily/activity/schemas";
import { dailySchemas } from "@/services/daily/schemas";

const postActivity: ReqHandler = async (req, res, next) => {
  try {
    if (!req.token) {
      return res.status(401).json({
        message: responseMessages.error.unAuthorized,
      });
    }
    const userId = req.token.decoded.uid;

    const reqBody = activitySchemas.postBody.safeParse(req.body);
    if (!reqBody.success) {
      return res.status(400).json({
        message: responseMessages.error.reqBody,
      });
    }

    await prisma.activity.create({
      data: {
        userId,
        dateTime: reqBody.data.dateTime,
        exercises: {
          create: reqBody.data.activities,
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
        if (error.meta?.field_name === "exercise_id") {
          field = "some of the exercises are";
        }
        return res.status(400).json({
          message: `${field} not registered in database`,
          error,
        });
      }
      if (error.code === "P2002") {
        return res.status(400).json({
          message:
            "activity entry for this user at provided dateTime has already registered in database",
          error,
        });
      }
    }
    next(error);
  }
};

const putActivity: ReqHandler = async (req, res, next) => {
  try {
    const reqParams = dailySchemas.params.safeParse(req.params);
    if (!reqParams.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    const reqBody = activitySchemas.putBody.safeParse(req.body);
    if (!reqBody.success) {
      return res.status(400).json({
        message: responseMessages.error.reqBody,
      });
    }

    const currentActivity = await prisma.activity.findFirst({
      where: reqParams.data.id,
      select: {
        user: {
          select: { uid: true, gender: true, age: true, role: true },
        },
        dateTime: true,
        exercises: {
          select: {
            amount: true,
            exercise: { select: { id: true, name: true, unit: true, calorieBurned: true } },
          },
        },
      },
    });
    if (!currentActivity) {
      return res.status(404).json({
        message: responseMessages.error.notFound,
      });
    }

    const reqBodyExerciseIds = reqBody.data.activities.map(entry => entry.exerciseId);

    const deletedExerciseEntries = currentActivity.exercises.filter(
      entry => !reqBodyExerciseIds.includes(entry.exercise.id)
    );

    const upserts = reqBody.data.activities.map(entry =>
      prisma.exerciseOnActivity.upsert({
        where: {
          userId_dateTime_exerciseId: {
            exerciseId: entry.exerciseId,
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

    if (upsertResults.filter(upsert => upsert.status === "rejected").length > 0) {
      const rollbacks = currentActivity.exercises.map(entry =>
        prisma.exerciseOnActivity.upsert({
          where: {
            userId_dateTime_exerciseId: {
              exerciseId: entry.exercise.id,
              userId: reqParams.data.id.userId,
              dateTime: reqParams.data.id.dateTime,
            },
          },
          update: { amount: entry.amount },
          create: {
            exerciseId: entry.exercise.id,
            amount: entry.amount,
            ...reqParams.data.id,
          },
        })
      );
      await Promise.allSettled(rollbacks);
      return res.status(400).json({
        message: "some of the exercises are not registered in database",
      });
    }

    await prisma.activity.update({
      where: {
        dateTime_userId: reqParams.data.id,
      },
      data: {
        exercises: {
          deleteMany: {
            exerciseId: { in: deletedExerciseEntries.map(entry => entry.exercise.id) },
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

const deleteActivity: ReqHandler = async (req, res, next) => {
  try {
    const reqParams = dailySchemas.params.safeParse(req.params);
    if (!reqParams.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    await prisma.activity.delete({ where: { dateTime_userId: reqParams.data.id } });

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

export const activityHandlers = { postActivity, putActivity, deleteActivity };
