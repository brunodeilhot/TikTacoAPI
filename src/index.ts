import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
const port = process.env.PORT;

if (!fs.existsSync(path.join(__dirname, "public"))) {
  fs.mkdirSync(path.join(__dirname, "public"));
}

if (!fs.existsSync(path.join(__dirname, "public/users"))) {
  fs.mkdirSync(path.join(__dirname, "public/users"));
}

if (!fs.existsSync(path.join(__dirname, "public/recipes"))) {
  fs.mkdirSync(path.join(__dirname, "public/recipes"));
}

app.use("/images", express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
  })
);
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
