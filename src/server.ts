require("dotenv").config();
const bodyParser = require("body-parser");
import express from "express";
import cors from "cors";
import connectDB from "./database.config";
import authentication from "./routes/authentication";
import passport from "passport";
import { validateAPIToken } from "./middleware/verify-api-token";
const app = express();

const isProduction = !(
  process.env.NODE_ENV && process.env.NODE_ENV.match("development")
);

console.log("Production mode?", isProduction);
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
isProduction && app.use(validateAPIToken);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
//app.use(passport.session());
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
