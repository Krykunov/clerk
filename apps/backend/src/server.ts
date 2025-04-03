import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
// import { clerkMiddleware } from "@clerk/express";
import { clerkClient } from "@clerk/express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// app.use(clerkMiddleware());

const signupSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

app.post("/api/signup", async (req: Request, res: Response) => {
  try {
    const data = signupSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const query = `
      INSERT INTO users (firstname, lastname, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const values = [data.firstname, data.lastname, data.email, hashedPassword];

    const result = await db.query(query, values);
    const dbUserId = result.rows[0].id.toString();

    console.log("User created in DB with ID:", dbUserId);

    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [data.email],
      firstName: data.firstname,
      lastName: data.lastname,
      externalId: dbUserId,
      password: hashedPassword,
    });

    if (!clerkUser) {
      throw new Error("Clerk user creation failed");
    }

    res.status(201).json({ id: dbUserId, message: "User created successfully" });
  } catch (err) {
    console.error("Error processing signup ❌", err);
    res.status(400).json({ error: "Invalid data or database error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
