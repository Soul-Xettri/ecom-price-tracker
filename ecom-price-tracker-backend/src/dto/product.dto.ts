import { body } from "express-validator";

export const scrapeProductDto = [
  body("url", "URL is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("URL must be a string"),
  body("ecommercePlatform", "E-commerce Platform is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("E-commerce Platform must be a string")
    .isIn(["daraz", "amazon", "flipkart"])
    .withMessage("E-commerce Platform must be one of: daraz, amazon, flipkart"),
  body("desiredPrice", "Desired Price is required")
    .exists()
    .notEmpty()
    .isNumeric()
    .withMessage("Desired Price must be a number"),
];
