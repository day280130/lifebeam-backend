import { firebaseApp, isFirebaseError } from "@/lib/firebase";
import type { ReqHandler } from "@/lib/utils";
import { getAuth } from "firebase-admin/auth";
import { z } from "zod";

const errorMessages = {
  TOKEN_NOT_VALID: "access supplied token not valid",
};

export const authCheck: ReqHandler = async (req, res, next) => {
  try {
    // check access token presence in header
    const accessTokenHeader = z
      .string()
      .safeParse(req.headers["authorization"]);
    // console.log(accessTokenHeader);
    if (!accessTokenHeader.success)
      throw new Error(errorMessages.TOKEN_NOT_VALID);
    const authorizationStrings = accessTokenHeader.data.split(" ");

    // check access token header string format
    if (
      authorizationStrings.length !== 2 ||
      (authorizationStrings[0] ?? "").toLowerCase() !== "bearer"
    )
      throw new Error(errorMessages.TOKEN_NOT_VALID);

    // check access token
    const accessToken = authorizationStrings[1] ?? "";
    const auth = getAuth(firebaseApp);
    const verifiedToken = await auth.verifyIdToken(accessToken);
    req.token = {
      raw: accessToken,
      decoded: verifiedToken,
    };

    // all check pass
    next();
  } catch (error) {
    // return response immediately if error is known
    if (
      error instanceof Error &&
      error.message === errorMessages.TOKEN_NOT_VALID
    ) {
      return res.status(401).json({
        message: error.message,
      });
    }
    if (isFirebaseError(error) && error.code.startsWith("auth/")) {
      return res.status(401).json({
        message: `Firebase Auth: ${error.message}`,
      });
    }

    // pass to global error handler if error is unknown
    next(error);
  }
};
