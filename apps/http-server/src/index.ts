import express from "express";
import { HTTP_PORT } from "@repo/backend-common";
import cors from "cors";
import authRouter from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/room");

app.listen(HTTP_PORT, () => {
  console.log(`HTTP Server is running on ${HTTP_PORT}`);
});
