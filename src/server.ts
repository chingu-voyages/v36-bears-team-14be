require("dotenv").config();
const bodyParser = require("body-parser");
import express from "express";
import cors from "cors";
import connectDB from "./database.config";
import authentication from "./routes/authentication";
import passport from "passport";
const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
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
