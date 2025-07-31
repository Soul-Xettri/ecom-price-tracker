import express from "express";
import AlertController from "../controllers/alerts.controller";
const router = express.Router();

router.get("/", AlertController.fetch);

export default router;
