import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use("/images", express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());
app.use(routes);

const database = process.env.MONGODB_URL;

mongoose.connect(database);

mongoose.connection.on("error", (err) =>
  console.log("[error]: Error connecting to database: " + err.messages)
);
mongoose.connection.once("open", () => {
  app.listen(port);
});
