// index.js
const express = require("express");
const ytsr = require("ytsr");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/buscar", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Falta el parámetro ?q=" });

  try {
    const searchResults = await ytsr(query, { limit: 10 });

    const videos = searchResults.items
      .filter((item) => item.type === "video")
      .map((video) => ({
        title: video.title,
        videoId: video.id,
        url: video.url,
        thumbnail: video.bestThumbnail.url,
      }));

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar videos", detail: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
