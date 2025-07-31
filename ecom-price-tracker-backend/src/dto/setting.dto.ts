import { body } from "express-validator";

export const SettingDto = [
  body("frequency")
    .optional()
    .isString()
    .withMessage("Frequency must be a string")
    .isIn(["hourly", "daily", "weekly", "monthly"])
    .withMessage("Frequency must be one of: daily, weekly, monthly"),
  body("emailAlert")
    .optional()
    .isBoolean()
    .withMessage("Email Alert must be a boolean"),
];
