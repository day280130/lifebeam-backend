import { firebaseApp } from "@/lib/firebase";
import type { ReqHandler } from "@/lib/utils";
import { getAuth } from "firebase-admin/auth";

const logout: ReqHandler = async (req, res, next) => {
  try {
    if (!req.token)
      return res.status(401).json({
        message: "illegal auth check bypass",
      });
    const auth = getAuth(firebaseApp);
    await auth.revokeRefreshTokens(req.token.decoded.uid);
    return res.status(200).json({ message: "logout successful" });
  } catch (error) {
    next(error);
  }
};

const check: ReqHandler = async (req, res, next) => {
  try {
    if (!req.token)
      return res.status(401).json({
        message: "illegal auth check bypass",
      });
    return res.status(200).json({
      message: "auth valid",
      token: req.token,
    });
  } catch (error) {
    next(error);
  }
};

export const authHandlers = {
  logout,
  check,
};
