import pool from "./db.js";

export const createTipsTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS tips (
    id UUID,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `;

  try {
    await pool.query(queryText);
    console.log("Tips table will be created if not exits.")
  } catch (error) {
    console.log("error while creating the tips table : ", error);
  }
} 