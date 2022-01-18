require("dotenv").config();
const bodyParser = require("body-parser");
import express from "express";
import cors from "cors";
import connectDB from "./database.config";
import authentication from "./routes/authentication";
import passport from "passport";
import { validateAPIToken } from "./middleware/verify-api-token";
const cookieSession = require("cookie-session");
const app = express();

const isProduction = !(
  process.env.NODE_ENV && process.env.NODE_ENV.match("development")
);
const DOMAIN = isProduction
  ? process.env.PRODUCTION_COOKIE_DOMAIN
  : process.env.DEV_COOKIE_DOMAIN;

console.log("Production mode?", isProduction);
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
isProduction && app.use(validateAPIToken);

const cookieOptions = {
  maxAge: 24 * 60 * 60 * 1000, // Day
  name: "recipe",
  keys: [process.env.DEV_COOKIE1, process.env.DEV_COOKIE2],
  domain: DOMAIN,
};
app.use(
  isProduction
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
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);
connectDB();
export default server;
