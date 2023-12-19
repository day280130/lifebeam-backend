import type {
  ParamsDictionary,
  RequestHandler,
} from "express-serve-static-core";
import type { DecodedIdToken } from "firebase-admin/auth";

export type DefaultResponseBody = {
  message: string;
  [key: string]: unknown;
};

export type UserToken =
  | {
      raw: string;
      decoded: DecodedIdToken;
    }
  | undefined;

export type ReqHandler = RequestHandler<ParamsDictionary, DefaultResponseBody>;

export const responseMessages = {
  success: {
    getAll: "datas found",
    get: "data found",
    post: "data posted",
    put: "data edited",
    delete: "data deleted",
  },
  error: {
    unAuthorized: "illegal auth check bypass",
    reqBody: "request body not valid",
    reqParams: "request parameter shape not valid",
    reqQueries: "request query shape not valid",
    notFound: "data not found",
  },
} as const;
