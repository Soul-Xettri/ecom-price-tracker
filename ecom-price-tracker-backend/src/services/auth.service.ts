import { User } from "../models/User";
import generateToken from "../utils/jwttoken";

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

    return {
      user: user,
      token: generateToken(user._id),
    };
  }
}

export default AuthService;
