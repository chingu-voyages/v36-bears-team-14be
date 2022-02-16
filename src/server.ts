require("dotenv").config();
const bodyParser = require("body-parser");
import express from "express";
import cors from "cors";
import connectDB from "./database.config";
import authentication from "./routes/authentication";
import user from "./routes/user";
import recipe from "./routes/recipe";
import passport from "passport";
import { validateAPIToken } from "./middleware/verify-api-token";
import {
  checkEnvironmentVariables,
  IS_PRODUCTION,
} from "./check-environment-variables";
const cookieSession = require("cookie-session");
const app = express();

checkEnvironmentVariables();

const DOMAIN = IS_PRODUCTION
  ? process.env.PRODUCTION_COOKIE_DOMAIN
  : process.env.DEV_COOKIE_DOMAIN;

if (IS_PRODUCTION) {
  app.set("trust proxy", 1);
}
console.log("Production mode?", IS_PRODUCTION);
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
IS_PRODUCTION && app.use(validateAPIToken);

const cookieKeys = IS_PRODUCTION
  ? [process.env.PRODUCTION_COOKIE1, process.env.PRODUCTION_COOKIE2]
  : [process.env.DEV_COOKIE1, process.env.DEV_COOKIE2];
const cookieOptions = {
  maxAge: 24 * 60 * 60 * 1000, // Day
  name: "recipe",
  keys: cookieKeys,
  domain: DOMAIN,
};

app.use(
  IS_PRODUCTION
    ? cookieSession({ ...cookieOptions, secure: true, sameSite: "none" })
    : cookieSession(cookieOptions)
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set("port", process.env.PORT || 5000);
app.get("/", (_req, res) => {
  res.send("API Running");
});
const port = app.get("port");

app.use("/api/authentication", authentication);
app.use("/api/user", user);
app.use("/api/recipe", recipe);
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);
connectDB();
export default server;
