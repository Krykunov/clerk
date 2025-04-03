import { db } from "../lib/db";

export async function createUserInDb(email: string, firstname: string, lastname: string, hashedPassword: string) {
  const result = await db.query(
    `INSERT INTO users(email, firstname, lastname, password) VALUES ($1, $2, $3, $4) RETURNING id`,
    [email, firstname, lastname, hashedPassword]
  );
  return result.rows[0].id;
}
