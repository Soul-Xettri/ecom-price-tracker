import { User } from "../models/User";
import generateToken from "../utils/jwttoken";
import SettingService from "./setting.service";

class AuthService {
  static async saveUser(dto: {
    discordId: string;
    name: string;
    email: string;
    avatar: string;
    exp: Date;
  }) {
    const { discordId, name, email, avatar, exp } = dto;

    const user = await User.findOneAndUpdate(
      { discordId },
      { name, email, avatar, exp, lastLogin: new Date() },
      { upsert: true, new: true }
    );

    await SettingService.upsert(user._id, {
      frequency: "daily",
      emailAlert: false,
    });

    return {
      user: user,
      token: generateToken(user._id),
    };
  }
}

export default AuthService;
