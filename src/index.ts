import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(routes);

const database = process.env.MONGODB_URL || "";


mongoose.connect(database);

mongoose.connection.on("error", (err) =>
  console.log("[error]: Error connecting to database: " + err.messages)
);
mongoose.connection.once("open", () => {
  console.log("[info]: Connected to the database");
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});