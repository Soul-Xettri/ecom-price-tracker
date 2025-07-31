import { Alert } from "../models/alertsModel";

class AlertService {
  static async fetch(userId: string) {
    const alerts = await Alert.find({ userId });
    return alerts;
  }
}

export default AlertService;
