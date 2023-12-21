import { prisma } from "@/lib/prisma";
import { responseMessages, type ReqHandler } from "@/lib/utils";
import { isCalorieOffsetObj, isDayLeftObj, type userStatus } from "@/services/predict/utils";
import { userSchemas } from "@/services/user/schemas";

export const predictHandler: ReqHandler = async (req, res, next) => {
  try {
    const reqParams = userSchemas.params.safeParse(req.params);
    if (!reqParams.success) {
      return res.status(400).json({
        message: responseMessages.error.reqParams,
      });
    }

    // check if user have inputted height and weight
    const biWeeklyCount = await prisma.biWeekly.count({ where: { userId: reqParams.data.uid } });
    if (biWeeklyCount < 1) {
      return res.status(409).json({
        message: "user has not inputted first bi-weekly logbook yet",
      });
    }

    const user = await prisma.user.findFirst({
      where: { uid: reqParams.data.uid },
      select: {
        age: true,
        gender: true,
        biWeeklies: {
          select: { weekTime: true, height: true, weight: true },
          orderBy: { weekTime: "desc" },
        },
        diets: {
          select: {
            dateTime: true,
            foods: { select: { amount: true, food: { select: { calorieAmount: true } } } },
          },
        },
        activities: {
          select: {
            dateTime: true,
            exercises: { select: { amount: true, exercise: { select: { calorieBurned: true } } } },
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({
        message: responseMessages.error.notFound,
      });
    }

    // number of user daily logbooks tracked by system
    const dayTracked = Math.max(user.activities.length, user.diets.length);

    // getting latest user's weight and height
    const weight = user.biWeeklies[0]?.weight ?? 0.001; // in kg
    const height = user.biWeeklies[0]?.height ?? 0.001; // in meter

    // total calories toke of all diet logbooks
    const totalCalorieIntake = user.diets.reduce((accDiets, diet) => {
      const dietCalories = diet.foods.reduce((accFoods, entry) => {
        return accFoods + entry.amount * entry.food.calorieAmount;
      }, 0);
      return accDiets + dietCalories;
    }, 0);

    // total calories spent of all activity logbooks
    const totalExerciseCalories = user.activities.reduce((accActs, act) => {
      const actCalories = act.exercises.reduce((accExers, entry) => {
        return accExers + entry.amount * entry.exercise.calorieBurned;
      }, 0);
      return accActs + actCalories;
    }, 0);

    // user body mass index (BMI)
    const BMI = weight / Math.pow(height, 2);

    // using BMI to count obesity parameters
    const obeseWeight = 25 * Math.pow(height, 2);
    const obeseWeightOffset = obeseWeight - weight;
    const calorieToObese = BMI >= 25 ? 0 : obeseWeightOffset * 7700;

    // using BMI to count underweight parameters
    const underWeight = 18.5 * Math.pow(height, 2);
    const underWeightOffset = weight - underWeight;
    const calorieToUnder = BMI <= 18.5 ? 0 : underWeightOffset * -7700;

    // user basal metabolic rate (BMR)
    const isMALE = user.gender === "MALE";
    const bmrMultipliers = {
      constant: isMALE ? 66 : 655,
      weight: isMALE ? 13.7 : 9.6,
      height: isMALE ? 5 : 1.8,
      age: isMALE ? 6.8 : 4.7,
    };
    const BMR =
      bmrMultipliers.constant +
      bmrMultipliers.weight * weight +
      bmrMultipliers.height * height -
      bmrMultipliers.age * user.age;

    // daily energy needed
    const activityFactor = 1.3;
    const energyNeeded = activityFactor * BMR;

    // average calorie intake
    const avgCalIntake = totalCalorieIntake / dayTracked;

    // average calorie burned
    const avgCalBurned = (weight * totalExerciseCalories) / dayTracked;

    const modelUrl = process.env.MODEL_URL ?? "";

    // calorie offset from machine learning
    const calOffsetReqBody = JSON.stringify({
      gender: isMALE ? 0 : 1,
      age: user.age,
      height,
      weight,
      calories: totalCalorieIntake,
      exercise: totalExerciseCalories,
      day: dayTracked,
      cno: calorieToObese,
      clu: calorieToUnder,
      bmi: BMI,
      bmr: BMR,
      cintake: isNaN(avgCalIntake) ? 0 : avgCalIntake,
      cburned: isNaN(avgCalBurned) ? 0 : avgCalBurned,
      eused: energyNeeded,
    });
    const calorieOffsetFetch = await fetch(`${modelUrl}/predict/calorie-offset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: calOffsetReqBody,
    });
    const calOffsetResponse = await calorieOffsetFetch.json();
    if (!isCalorieOffsetObj(calOffsetResponse)) {
      return res.status(500).json({
        message: "model API blew up",
      });
    }
    const calorieOffset = calOffsetResponse.calorieOffset;

    // day left prediction from machine learning
    const dayLeftReqBody = JSON.stringify({
      bmi: BMI,
      cno: calorieToObese,
      clu: calorieToUnder,
      calorieOffset,
      height,
      weight,
    });
    const dayLeftFetch = await fetch(`${modelUrl}/predict/day-left`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: dayLeftReqBody,
    });
    const dayLeftResponse = await dayLeftFetch.json();
    if (!isDayLeftObj(dayLeftResponse)) {
      return res.status(500).json({
        message: "model API blew up",
      });
    }
    const dayLeft = dayLeftResponse.dayLeft;

    let status: userStatus = "NORMAL";
    if (BMI >= 25) status = "OBESE";
    if (BMI < 18.5) status = "UNDERWEIGHT";

    let dayLeftTo: userStatus = "NORMAL";
    if (BMI >= 25) {
      if (calorieOffset <= 0) dayLeftTo = "NORMAL";
      else dayLeftTo = "OBESE";
    } else if (BMI < 18.5) {
      if (calorieOffset > 0) dayLeftTo = "NORMAL";
      else dayLeftTo = "UNDERWEIGHT";
    } else {
      if (calorieOffset > 0) dayLeftTo = "OBESE";
      else dayLeftTo = "UNDERWEIGHT";
    }

    return res.status(200).json({
      message: responseMessages.success.get,
      status,
      calorieOffset,
      dayLeft,
      dayLeftTo,
    });
  } catch (error) {
    next(error);
  }
};
