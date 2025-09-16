import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./services/database.js"; // ✅ Import and use

import itemRoutes from "./routes/itemRoutes.js";
import barberRoutes from "./routes/barberRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to DB before routes
await connectDB(); // ❗️ CRUCIAL: must happen before using any models

// Define routes
app.use("/items", itemRoutes);
app.use("/barbers", barberRoutes);

app.get("/", (req, res) => {
  res.send("Legends Barber Shop API is running.");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

export default app;
