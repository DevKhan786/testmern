import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import todoRouter from "./routes/todos.js";

const PORT = 5000;
const mongoURL = process.env.MONGO_URL;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/todos", todoRouter);

mongoose
  .connect(mongoURL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB, ", err);
  });
