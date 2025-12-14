import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./services/database.js";

import barberRoutes from "./routes/barberRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

await connectDB();

app.use("/barbers", barberRoutes);

app.get("/", (req, res) => {
  res.send("Legends Barber Shop API is running.");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

export default app;
