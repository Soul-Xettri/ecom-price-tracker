import BaseError from "./BaseError";

class SubscriptionError extends BaseError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "SubscriptionError";
    this.statusCode = 403;
  }
}

export default SubscriptionError;
