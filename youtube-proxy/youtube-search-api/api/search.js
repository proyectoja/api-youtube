const ytsr = require('ytsr');

module.exports = async (req, res) => {
  // Agregar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permite todos los orígenes
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder a preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const query = req.query.q;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: 'Falta el parámetro ?q=' });
  }

  try {
    const result = await ytsr(query, { limit: 50 });

    const videos = result.items
      .filter(item => item.type === 'video')
      .map(video => ({
        id: video.id,
        title: video.title,
        url: video.url,
        thumbnail: video.bestThumbnail.url,
        duration: video.duration,
        views: video.views,
        uploadedAt: video.uploadedAt,
        channel: {
          name: video.author?.name || null,
          url: video.author?.url || null,
          verified: video.author?.verified || false
        }
      }));

    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar', detail: err.message });
  }
};
