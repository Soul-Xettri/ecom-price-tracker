import express from "express";
import handleValidationErrors from "../middleware/handleValidationErrors";
import { SettingDto } from "../dto/setting.dto";
import SettingController from "../controllers/setting.controller";
const router = express.Router();

router.post(
  "/",
  SettingDto,
  handleValidationErrors(),
  SettingController.upsert
);

router.get("/", SettingController.fetch);

export default router;
