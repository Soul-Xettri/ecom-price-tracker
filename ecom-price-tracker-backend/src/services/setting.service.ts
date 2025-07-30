import DataNotFoundError from "../errors/DataNotFoundError";
import { Setting } from "../models/settings";

class SettingService {
  static async upsert(
    userId: string,
    dto: {
      frequency?: string;
      emailAlert?: boolean;
    }
  ) {
    const setting = await Setting.findOneAndUpdate(
      { userId },
      { $set: dto },
      { new: true, upsert: true }
    );
    return setting;
  }

  static async fetch(userId: string) {
    const setting = await Setting.findOne({ userId });
    if (!setting) {
      return {
        userId,
        frequency: "daily",
        emailAlert: false,
      };
    }
    return setting;
  }
}

export default SettingService;
