import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5461;

// Static folders
app.use(express.static(path.join(__dirname, "../HTML")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../HTML/index.html"));
});

// Favicon fix
app.get("/favicon.ico", (req, res) => res.status(204).end());

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});