import { body, checkSchema, param, validationResult } from "express-validator";

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
        isURL: true,
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
