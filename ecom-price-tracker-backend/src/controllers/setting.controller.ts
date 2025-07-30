import asyncWrapper from "../middleware/catchAsyncErrors";
import SettingService from "../services/setting.service";

const SettingController = {
  upsert: asyncWrapper(async (req, res) => {
    const dto = req.body;
    const userId = req.user.id;
    const setting = await SettingService.upsert(userId, dto);
    return res.status(201).json({
      status: "success",
      data: {
        message: "Settings saved successfully",
        setting: setting,
      },
    });
  }),

  fetch: asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const setting = await SettingService.fetch(userId);
    return res.status(200).json({
      status: "success",
      data: {
        message: "Settings fetched successfully",
        setting: setting,
      },
    });
  }),
};

export default SettingController;