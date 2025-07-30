import UnauthorizedError from "../errors/UnauthorizedError";
import asyncWrapper from "../middleware/catchAsyncErrors";
import AuthService from "../services/auth.service";

const AuthController = {
  saveUser: asyncWrapper(async (req, res) => {
    const dto = req.body;
    if (!dto.apiKey || dto.apiKey !== process.env.BACKEND_URL_TOKEN) {
      throw new UnauthorizedError("Invalid API Key");
    }
    const user = await AuthService.saveUser(dto);
    return res.status(201).json({
      status: "success",
      data: {
        message: "User authenticated successfully",
        user: user.user,
        token: user.token,
      },
    });
  }),
};

export default AuthController;
