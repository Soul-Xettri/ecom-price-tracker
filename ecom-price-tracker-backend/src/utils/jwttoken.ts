import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const generateToken = (id: string) => {
  return jwt.sign({ id, type: "auth" }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default generateToken;
