import { body } from "express-validator";
import BadRequestError from "../errors/BadRequestError";
import e from "express";

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
          throw new BadRequestError(
            "URL must be from www.ebay.com for ecommercePlatform 'ebay'"
          );
        }
      } else if (platform === "flipkart") {
        if (!/^https?:\/\/(www\.)?flipkart\.com\//.test(value)) {
          throw new BadRequestError(
            "URL must be from https://www.flipkart.com/ for ecommercePlatform 'flipkart'"
          );
        }
      } else if (platform === "daraz") {
        if (!/^https?:\/\/(www\.)?daraz\.com\.np\//.test(value)) {
          throw new BadRequestError(
            "URL must be from https://www.daraz.com.np for ecommercePlatform 'daraz'"
          );
        }
      } else if (platform === "bestbuy") {
        if (!/^https?:\/\/(www\.)?bestbuy\.com\//.test(value)) {
          throw new BadRequestError(
            "URL must be from https://www.bestbuy.com/ for ecommercePlatform 'bestbuy'"
          );
        }
      } else if (platform === "wallmart") {
        if (!/^https?:\/\/(www\.)?walmart\.com\//.test(value)) {
          throw new BadRequestError(
            "URL must be from https://www.walmart.com/ for ecommercePlatform 'wallmart'"
          );
        } else if (platform === "amazon") {
          if (!/^https?:\/\/(www\.)?amazon\.com\//.test(value)) {
            throw new BadRequestError(
              "URL must be from https://www.amazon.com/ for ecommercePlatform 'amazon'"
            );
          }
        }
      }
      return true;
    }),
  body("ecommercePlatform", "E-commerce Platform is required")
    .exists()
    .notEmpty()
    .isString()
    .withMessage("E-commerce Platform must be a string")
    .isIn(["daraz", "ebay", "flipkart", "bestbuy", "wallmart", "amazon"])
    .withMessage(
      "E-commerce Platform must be one of: daraz, ebay, flipkart, bestbuy, wallmart"
    ),
  body("zipCode")
    .optional()
    .isString()
    .withMessage("Zip Code must be a string")
    .isLength({ min: 5, max: 10 })
    .withMessage("Zip Code must be between 5 and 10 characters long")
    .custom((value, { req }) => {
      if (req.body.ecommercePlatform === "amazon" && !value) {
        throw new BadRequestError("Zip Code is required for Amazon products");
      }
      return true;
    }),
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
