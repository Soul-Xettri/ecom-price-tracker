import { body } from "express-validator";

export const DiscordServerDto = [
  body("ownerId", "Owner ID is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("Owner ID must be a string"),
  body("serverId", "Server ID is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("Server ID must be a string"),
  body("serverName", "Server Name is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("Server Name must be a string"),
  body("serverIcon")
    .optional({ nullable: true })
    .isString()
    .withMessage("Server Icon must be a string"),
];

export const UpdateDiscordServerDto = [
  body("channelId", "Channel ID is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("Channel ID must be a string"),
  body("channelName", "Channel Name is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("Channel Name must be a string"),
  body("botAlertStatus")
    .optional()
    .isBoolean()
    .withMessage("Bot Alert Status must be a boolean"),
];
