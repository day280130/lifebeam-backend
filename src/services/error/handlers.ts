import { isFirebaseError } from "@/lib/firebase";
import type { DefaultResponseBody } from "@/lib/utils";
import type { ErrorRequestHandler, Response } from "express";

type ArbitraryObject = { [key: string]: unknown };

const isArbitraryObject = (
  potentialObject: unknown
): potentialObject is ArbitraryObject => {
  return typeof potentialObject === "object" && potentialObject !== null;
};

const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  return (
    isArbitraryObject(error) &&
    error instanceof Error &&
    (typeof error.errno === "number" || typeof error.errno === "undefined") &&
    (typeof error.code === "string" || typeof error.code === "undefined") &&
    (typeof error.path === "string" || typeof error.path === "undefined") &&
    (typeof error.syscall === "string" || typeof error.syscall === "undefined")
  );
};

export const errorHandler: ErrorRequestHandler = (
  error: NodeJS.ErrnoException | Error,
  req,
  res: Response<DefaultResponseBody>,
  _next
) => {
  // set response status code to 500
  res.status(500);

  // catch firebase error
  if (isFirebaseError(error)) {
    return res.json({
      message: "unknown firebase error",
      error: error.toJSON(),
    });
  }

  // catch nodejs error
  if (isErrnoException(error)) {
    return res.json({
      message: "internal nodejs error",
    });
  }

  // last fallback, catch unknown error
  return res.json({
    message: "unknown internal error",
  });
};
