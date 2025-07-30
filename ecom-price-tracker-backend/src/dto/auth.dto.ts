import { body } from "express-validator";

export const AuthDto = [
  body("discordId", "Discord ID is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("Discord ID must be a string"),

  body("name", "Name is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("Name must be a string"),

  body("email", "Email is required")
    .exists()
    .notEmpty()
    .isEmail()
    .withMessage("Email must be a valid email address"),

  body("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string if provided"),

  body("exp", "Expiration time is required")
    .exists()
    .notEmpty()
    .isISO8601()
    .withMessage("Expiration time must be a valid ISO8601 date"),
];
