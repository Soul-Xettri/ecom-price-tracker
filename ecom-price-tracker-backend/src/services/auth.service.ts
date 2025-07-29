import { User } from "../models/User";

class AuthService {
  static async saveUser(dto: {
    discordId: string;
    name: string;
    email: string;
    avatar: string;
  }) {
    const { discordId, name, email, avatar } = dto;

    const user = await User.findOneAndUpdate(
      { discordId },
      { name, email, avatar, lastLogin: new Date() },
      { upsert: true, new: true }
    );

    return user;
  }
}

export default AuthService;
