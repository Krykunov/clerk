import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { db } from "./lib/db";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (res: Response) => {
  res.send("Hello World");
});

app.post("/signup", async (res: Response) => {
  try {
    await db.query("");
  } catch (err) {
    console.error("DB connection failed ❌", err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
