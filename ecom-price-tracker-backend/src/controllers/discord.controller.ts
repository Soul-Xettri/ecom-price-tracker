import asyncWrapper from "../middleware/catchAsyncErrors";
import DiscordService from "../services/discord.service";

const DiscordController = {
  saveServer: asyncWrapper(async (req, res) => {
    const dto = req.body;
    const userId = req.user.id;
    const server = await DiscordService.saveServer(userId, dto);
    return res.status(201).json({
      status: "success",
      data: {
        message: "Discord server saved successfully",
        server: server,
      },
    });
  }),

  fetchServersByUserId: asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const servers = await DiscordService.fetchServersByUserId(userId);
    return res.status(200).json({
      status: "success",
      data: {
        message: "Discord servers fetched successfully",
        servers: servers,
      },
    });
  }),

  fetchServerById: asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const serverId = req.params.serverId;
    const server = await DiscordService.fetchServerById(userId, serverId);
    return res.status(200).json({
      status: "success",
      data: {
        message: "Discord server fetched successfully",
        server: server,
      },
    });
  }),

  updateServer: asyncWrapper(async (req, res) => {
    const dto = req.body;
    const serverId = req.params.serverId;
    const updatedServer = await DiscordService.updateServer(serverId, dto);
    return res.status(200).json({
      status: "success",
      data: {
        message: "Discord server updated successfully",
        server: updatedServer,
      },
    });
  }),
};

export default DiscordController;
