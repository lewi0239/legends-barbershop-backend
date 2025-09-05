import express from "express";
import itemRoutes from "./routes/itemRoutes.js"; // your real routes

const app = express();
const PORT = 3000;

app.use(express.json()); // for POST and PUT support
app.use("/items", itemRoutes);

app.get("/", (req, res) => {
  res.send("Legends Barber Shop API is running.");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

export default app;
