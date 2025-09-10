// backend-node/server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const multer = require("multer");
const pdfParse = require("pdf-parse");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../frontend')));

const AI_SERVICE = "http://localhost:5001";
const upload = multer({ storage: multer.memoryStorage() });

// ---- Text Endpoint ----
app.post("/api/text", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    const r = await axios.post(`${AI_SERVICE}/api/text`, { text });
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- PDF Endpoint ----
app.post("/api/pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    const r = await axios.post(`${AI_SERVICE}/api/text`, { text });
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- YouTube Endpoint ----
app.post("/api/youtube", async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) return res.status(400).json({ error: "No videoId provided" });

    const r = await axios.post(`${AI_SERVICE}/api/youtube`, { videoId });
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Start Node Server ----
app.listen(5000, () => console.log("Node backend running on http://localhost:5000"));
