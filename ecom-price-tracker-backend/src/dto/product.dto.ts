import { body } from "express-validator";

export const scrapeProductDto = [
  body("url", "URL is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("URL must be a string")
    .custom((value, { req }) => {
      const platform = req.body.ecommercePlatform;
      if (platform === "ebay") {
        if (!/^https?:\/\/(www\.)?ebay\.com\//.test(value)) {
          throw new Error(
            "URL must be from www.ebay.com for ecommercePlatform 'ebay'"
          );
        }
      } else if (platform === "flipkart") {
        if (!/^https?:\/\/(www\.)?flipkart\.com\//.test(value)) {
          throw new Error(
            "URL must be from https://www.flipkart.com/ for ecommercePlatform 'flipkart'"
          );
        }
      } else if (platform === "daraz") {
        if (!/^https?:\/\/(www\.)?daraz\.com\.np\//.test(value)) {
          throw new Error(
            "URL must be from https://www.daraz.com.np for ecommercePlatform 'daraz'"
          );
        }
      }
      return true;
    }),
  body("ecommercePlatform", "E-commerce Platform is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("E-commerce Platform must be a string")
    .isIn(["daraz", "ebay", "flipkart"])
    .withMessage("E-commerce Platform must be one of: daraz, ebay, flipkart"),
  body("desiredPrice", "Desired Price is required")
    .exists()
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("Desired Price must be a float number"),
];

export const updateDesiredPriceDto = [
  body("desiredPrice")
    .optional()
    .isNumeric()
    .withMessage("Desired Price must be a number"),
];

export const updateProductStatusDto = [
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];
