import dotenv from "dotenv-safe";
import { test } from "@/test";
dotenv.config();
console.log(test + "testimoni");
console.log(process.env.TEST_ENV);
