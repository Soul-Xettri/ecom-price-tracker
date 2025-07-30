import TokenError from "../errors/TokenError";
import { User } from "../models/User";
import asyncWrapper from "./catchAsyncErrors";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: typeof User.prototype;
  }
}

const authMiddleware = asyncWrapper(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new TokenError("No token provided");
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      if (!decoded || typeof decoded !== "object" || !("id" in decoded))
        throw new TokenError("Invalid Token");
      const user = await User.findById((decoded as jwt.JwtPayload).id).select(
        "-password"
      );
      if (!user) {
        throw new TokenError("User not found");
      }
      const now = Date.now();
      const expires = new Date(user.exp! * 1000);
      if (expires.getTime() < now) {
        throw new TokenError("Token has expired");
      }
      req.user = user;
      next();
    } catch (error) {
      throw new TokenError("Invalid token");
    }

    // Verify token logic here
  } else {
    throw new TokenError("Authorization header is missing or invalid");
  }
});

export default authMiddleware;
