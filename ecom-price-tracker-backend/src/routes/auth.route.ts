import express from "express";
import AuthController from "../controllers/auth.controller";
import handleValidationErrors from "../middleware/handleValidationErrors";
import { AuthDto } from "../dto/auth.dto";
const router = express.Router();

router.post(
  "/save-user",
  AuthDto,
  handleValidationErrors(),
  AuthController.saveUser
);

export default router;
