import { body, param, validationResult } from "express-validator";

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
export const newRecipeValidator = (): any[] => {
  return [
    body("name").not().isEmpty().trim().escape(),
    body("description").not().isEmpty().trim().escape(),
    body("ingredients").isArray(),
    body("directions").isArray(),
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
