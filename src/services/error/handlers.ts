import type { ErrorRequestHandler } from "express";

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
  res,
  _next
) => {
  // catch nodejs error
  if (isErrnoException(error)) {
    return res.json({
      status: "error",
      message: "internal nodejs error",
    });
  }

  // last fallback, catch unknown error
  return res.json({
    status: "error",
    message: "unknown internal error",
  });
};
