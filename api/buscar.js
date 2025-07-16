const ytsr = require('ytsr');

module.exports = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Falta el parámetro ?q=' });
  }

  try {
    const result = await ytsr(query, { limit: 10 });
    const videos = result.items
      .filter(item => item.type === 'video')
      .map(video => ({
        id: video.id,
        title: video.title,
        url: video.url,
        thumbnail: video.bestThumbnail.url,
      }));

    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar', detail: err.message });
  }
};