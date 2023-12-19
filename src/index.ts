import "dotenv-safe/config.js";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "@/services/error/handlers";
import { authRouters } from "@/services/auth/router";
import { foodRouters } from "./services/food/router";
import { exerciseRouters } from "./services/exercise/router";
import { userRouters } from "./services/user/router";

// create express instance
const app = express();

// global middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTION",
    allowedHeaders: "X-PINGOTHER, authorization, Content-Type, Accept",
  })
); // enables cors
app.use(helmet()); // use protection :)
app.use(express.urlencoded({ extended: true })); // parses urlencoded request body
app.use(express.json()); // parses json request body
app.use(compression()); // compresses request and response

// routers
app.use(authRouters);
app.use(foodRouters);
app.use(exerciseRouters);
app.use(userRouters);

// basic endpoints
app.get("/", (_req, res) =>
  res.status(200).json({
    message: "api ok!",
  })
);
app.use("*", (req, res) =>
  res.status(404).json({
    message: `endpoint ${req.originalUrl} doesn't exists!`,
  })
);

// global internal error handler
app.use(errorHandler);

// run express
const port = parseInt(process.env.PORT ?? "0");
if (port === 0) {
  throw new Error(
    "PORT not defined. Please define port in environment variables"
  );
}
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
