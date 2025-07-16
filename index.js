// index.js
const ytsr = require("ytsr");

module.exports = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Falta el parámetro ?q=" });
  }

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

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar videos", detail: error.message });
  }
};
