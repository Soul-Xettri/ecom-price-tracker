import express from "express";
import handleValidationErrors from "../middleware/handleValidationErrors";
import { DiscordServerDto, UpdateDiscordServerDto } from "../dto/discord.dto";
import DiscordController from "../controllers/discord.controller";
const router = express.Router();

router.post(
  "/save-server",
  DiscordServerDto,
  handleValidationErrors(),
  DiscordController.saveServer
);

router.get("/fetch-servers", DiscordController.fetchServersByUserId);
router.get("/:serverId", DiscordController.fetchServerById);
router.put(
  "/:serverId",
  UpdateDiscordServerDto,
  handleValidationErrors(),
  DiscordController.updateServer
);
router.delete("/:serverId", DiscordController.deleteServer);

export default router;
