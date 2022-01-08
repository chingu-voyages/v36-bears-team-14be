require("dotenv").config();
import express from "express";
import cors from "cors";
const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.set("port", process.env.PORT || 5000);
app.get("/", (_req, res) => {
  res.send("API Running");
});

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
