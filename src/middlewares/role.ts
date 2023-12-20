import { prisma } from "@/lib/prisma";
import type { ReqHandler } from "@/lib/utils";

const errorMessages = {
  NOT_REGISTERED: "this user is not registered",
  NOT_ADMIN: "admin role needed for this endpoint",
};

export const adminCheck: ReqHandler = async (req, res, next) => {
  try {
    if (!req.token)
      return res.status(401).json({
        message: "illegal auth check bypass",
      });

    const user = await prisma.user.findFirst({ where: { uid: req.token.decoded.uid } });
    if (!user) {
      return res.status(401).json({
        message: errorMessages.NOT_REGISTERED,
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: errorMessages.NOT_ADMIN,
      });
    }

    // all check pass
    next();
  } catch (error) {
    next(error);
  }
};
