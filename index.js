import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { v4 } from "uuid";
import pool from "./db.js";
import { createTipsTable } from "./createTipsTable.js";
import { rateLimit } from "express-rate-limit";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

createTipsTable();

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/tips/:id", async (req, res) => {
  try {
    let uniqueId = req.params.id;
    if (!uniqueId || uniqueId === "") {
      return res.status(200).json({ messages: [] });
    }

    const result = await pool.query("SELECT * from tips where id=$1", [uniqueId]);
    return res.status(200).json({ messages: result.rows });
  } catch (error) {
    console.log("Error while getting all tips related to this id.", error);
    res.status(400).json({ error: error });
  }
});

const tipLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many tips submitted, please try again later.",
});

app.post("/tip", tipLimiter, async (req, res) => {
  try {
    const { message, id } = req.body;

    if (message === process.env.SECRET) {
      return res.redirect(`/getAll`);
    }

    let uniqueId = id;
    if (!uniqueId || uniqueId === "") {
      uniqueId = v4();
    }
    const result = await pool.query("INSERT INTO tips (id, message) VALUES ($1, $2) RETURNING *", [uniqueId, message]);
    const result2 = await pool.query("SELECT * from tips where id=$1", [uniqueId]);
    res.status(200).json({ messages: result2.rows });
  } catch (error) {
    console.log("error ", error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/getAll", async (req, res) => {
  try {
    const result = await pool.query("select * from tips");
    return res.status(200).json({ messages: result.rows });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.listen(port, () => {
  console.log("listening to port ", port);
});
