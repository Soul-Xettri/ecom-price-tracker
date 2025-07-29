import asyncWrapper from "../middleware/catchAsyncErrors";
import AuthService from "../services/auth.service";

const AuthController = {
  saveUser: asyncWrapper(async (req, res) => {
    const dto = req.body;
    console.log("Received DTO:", dto);
    const user = await AuthService.saveUser(dto);
    return res.status(201).json({
      status: "success",
      data: {
        message: "User authenticated successfully",
        user,
      },
    });
  }),
};

export default AuthController;
