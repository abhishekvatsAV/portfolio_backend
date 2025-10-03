import pkg from "pg";
const {Pool} = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // required for Supabase SSL
  },
});

pool.on("connect", () => {
  console.log("connection pool establised with Database");
})


export default pool;
