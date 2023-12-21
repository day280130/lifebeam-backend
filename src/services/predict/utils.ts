export const isCalorieOffsetObj = (obj: unknown): obj is { calorieOffset: number } => {
  if (typeof obj !== "object") return false;
  if (obj === null || obj === undefined) return false;
  if (!("calorieOffset" in obj)) return false;
  if (typeof obj.calorieOffset !== "number") return false;
  return true;
};

export const isDayLeftObj = (obj: unknown): obj is { dayLeft: number } => {
  if (typeof obj !== "object") return false;
  if (obj === null || obj === undefined) return false;
  if (!("dayLeft" in obj)) return false;
  if (typeof obj.dayLeft !== "number") return false;
  return true;
};

export type userStatus = "UNDERWEIGHT" | "NORMAL" | "OBESE";
