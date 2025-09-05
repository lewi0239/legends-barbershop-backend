import app from "./app.js"; // ESM + nodenext: use .js in import
import "tsconfig-paths/register";
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
