import {
  body,
  checkSchema,
  param,
  validationResult,
  query,
} from "express-validator";
import mongoose from "mongoose";
import { RecipeQueryContext } from "../../models/recipe/recipe.types";
import { UserModel } from "../../models/user/user.schema";
import { isURLValid } from "../../utils/url-valid";

export const validate = (req: any, res: any, next: any): any => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  next();
};

export const loginAuthenticationValidator = (): any[] => {
  return [
    body("email").not().isEmpty().trim().escape(),
    body("password").not().isEmpty(),
  ];
};
export const newRecipeBasicValidator = (): any[] => {
  return [
    body("name").not().isEmpty().trim().escape(),
    body("description").not().isEmpty().trim().escape(),
    body("cookTimeMinutes").isNumeric().exists(),
    body("prepTimeMinutes").isNumeric().exists(),
  ];
};

export const newRecipeDirectionsValidator = (): any[] => {
  return [
    checkSchema({
      directions: {
        isArray: true,
        exists: true,
        errorMessage: "`directions` must exist and must be an array.",
        isLength: {
          options: [{ min: 0, max: 20 }],
        },
      },
      "directions.*.description": {
        isString: true,
        exists: true,
        errorMessage: "Missing `description` property",
        isLength: {
          options: { min: 0 },
        },
      },
      "directions.*.imageUrl": {
        optional: { options: { nullable: true } },
        errorMessage: `Incorrect formatting or data for URL`,
        custom: {
          options: (value) => {
            if (value === "") return true;
            if (isURLValid(value)) {
              return true;
            }
            return false;
          },
        },
      },
      imageUrl: {
        optional: { options: { nullable: true } },
        errorMessage: `Incorrect formatting or data for image URL`,
        custom: {
          options: (value) => {
            if (value === "") return true;
            if (isURLValid(value)) {
              return true;
            }
            return false;
          },
        },
      },
    }),
  ];
};
export const newRecipeIngredientsValidator = (): any[] => {
  return [
    checkSchema({
      ingredients: {
        isArray: true,
        exists: true,
        errorMessage: "`ingredients` must exist and must be an array.",
        isLength: {
          options: { min: 0 },
        },
      },
      "ingredients.*.name": {
        isString: true,
        exists: true,
        errorMessage: "Missing/invalid `name` property",
        trim: true,
      },
      "ingredients.*.quantity": {
        isNumeric: true,
        exists: true,
        errorMessage: "Missing/invalid `quantity` property",
      },
      "ingredients.*.unit": {
        isString: true,
        exists: true,
        errorMessage: "Missing/invalid `unit` property",
        trim: true,
        isLength: {
          options: { min: 0 },
        },
      },
    }),
  ];
};
export const registerNewUserValidator = (): any[] => {
  return [
    body("email")
      .isEmail()
      .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false }),
    body("password").isLength({ min: 8 }).trim().escape(),
    body("firstName").trim().escape(),
    body("lastName").trim().escape(),
  ];
};

export const getParamIdValidator = (): any[] => {
  return [param("id").not().isEmpty().trim().escape()];
};

export const toggleLikeParamIdValidator = (): any[] => {
  return [
    param("id")
      .exists()
      .custom(async (value: string) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return Promise.reject("Recipe id is invalid");
        }
      }),
  ];
};

export const patchUserValidator = (): any[] => {
  const validateActionOptions = (value: any) => {
    if (!value) return true;
    if (value !== "delete" && value !== "update") return false;
    return true;
  };
  return [
    checkSchema({
      "favoriteFoods.action": {
        errorMessage: "The value for action should be `delete` or `update`",
        custom: {
          options: validateActionOptions,
        },
      },
      "favoriteFoods.data": {
        errorMessage: "The value for data should exist and be an array.",
        custom: {
          options: (value, { req }) => {
            if (
              req.body.favoriteFoods &&
              req.body.favoriteFoods.action === "update"
            ) {
              if (!Array.isArray(value)) return false;
              if (value.length && value.length === 0) return false;
            }
            return true;
          },
        },
      },
      "photoUrl.action": {
        errorMessage: "The value for action should be `delete` or `update`",
        custom: {
          options: validateActionOptions,
        },
      },
      "photoUrl.data": {
        errorMessage:
          "The value for data should exist and be in a URL format, pointing to some resource. If you want to delete photoUrl data, use the `delete` action",
        custom: {
          options: (value, { req }) => {
            if (req.body.photoUrl && req.body.photoUrl.action === "update") {
              if (!value) return false;
              if (!isURLValid(value)) return false;
              return true;
            }
            return true;
          },
        },
      },
      "bio.action": {
        errorMessage: "The value for action should be `delete` or `update`",
        custom: {
          options: validateActionOptions,
        },
      },
      "bio.data": {
        errorMessage:
          "The value for data should exist and be a non-empty string. If you want to delete bio data, use the `delete` action",
        custom: {
          options: (value, { req }) => {
            if (req.body.bio && req.body.bio.action === "update") {
              if (!value) return false;
              if (value.length && value.trim().length === 0) return false;
              return true;
            }
            return true;
          },
        },
      },
    }),
  ];
};

export const validateLikeQueryParams = (): any[] => {
  return [
    query("userId")
      .exists()
      .custom(async (value: string) => {
        // we'll accept the user id as me or a correct mongo _id
        if (value === "me") return Promise.resolve(true);
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return Promise.reject("Invalid userId");
        }

        const user = await UserModel.findById(value);
        if (!user) return Promise.reject("no such user");
        return Promise.resolve(true);
      })
      .trim()
      .escape(),
  ];
};

export const getRecipeQueryValidator = (): any[] => {
  return [
    query("context")
      .exists()
      .custom((value: string) => {
        return Object.values(RecipeQueryContext).includes(
          value as RecipeQueryContext
        );
      })
      .withMessage(
        "The type of query (context) specified in the query parameters is invalid and/or not supported"
      ),
    query("limit").exists().isInt(),
    query("skip").exists().isInt(),
  ];
};

export const getAllUsersInvalidateQuery = (): any[] => {
  return [
    query().custom((value) => {
      if (!value) return true;
      return false;
    }),
  ];
};

export const deleteRecipeByIdsValidator = (): any[] => {
  return [
    body("recipeIds")
      .exists()
      .isArray()
      .notEmpty()
      .withMessage(
        "Delete request must contain an array of recipe Ids. It cannot be empty or null"
      ),
  ];
};
