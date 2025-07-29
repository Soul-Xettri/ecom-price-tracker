import express from "express";
import AuthController from "../controllers/auth.controller";
const router = express.Router();

router.post("/save-user", AuthController.saveUser);

export default router;
