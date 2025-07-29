import { createLogger, format, transport } from "winston";
import { ServerLog } from "../models/serverLogModel";
import Transport from "winston-transport";

class CustomMongoTransport extends Transport {
  constructor(opts?: any) {
    super(opts);
  }

  async log(info: any, callback: any) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const log = new ServerLog({
      message: info.message,
      ip: info.ip,
      userId: info.userId,
      businessUsername: info.businessUsername,
      additionalInfo: info.additionalInfo,
    });

    await log.save();
    callback();
  }
}

export const serverLog = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [new CustomMongoTransport()],
});
