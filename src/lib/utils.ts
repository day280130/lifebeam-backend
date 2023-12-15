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
