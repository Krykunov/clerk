import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

db.connect()
  .then(() => console.log("Connected to Neon Postgres"))
  .catch((err) => console.error("❌ Failed to connect to DB:", err));
