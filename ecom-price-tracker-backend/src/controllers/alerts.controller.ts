import asyncWrapper from "../middleware/catchAsyncErrors";
import AlertService from "../services/alerts.service";

const AlertController = {
  fetch: asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const alerts = await AlertService.fetch(userId);
    return res.status(200).json({
      status: "success",
      data: {
        message: "Alerts fetched successfully",
        alerts: alerts,
      },
    });
  }),
};

export default AlertController;
