import fs from 'node:fs';
import path from 'node:path';

/**
 * Vercel Serverless Function for Gradual Video Streaming (HTTP 206 Partial Content)
 * Prevents Vercel's 4.5MB Serverless Function payload limit by serving videos
 * in small, progressive chunks (e.g., 1MB) as the video plays.
 */
export default function handler(req, res) {
  try {
    const { video } = req.query;

    let filename = 'journey-75.mp4';
    if (video === 'curtain' || video === 'stage') {
      filename = 'curtain-stage.mp4';
    } else if (video && video.includes('.mp4')) {
      filename = path.basename(video);
    }

    const publicDir = path.join(process.cwd(), 'public');
    let filePath = path.join(publicDir, filename);

    if (!fs.existsSync(filePath)) {
      // Fallback check for original filenames
      if (filename === 'journey-75.mp4') {
        filePath = path.join(publicDir, '75-Years-Journey-SnapYT.App (2).mp4');
      } else if (filename === 'curtain-stage.mp4') {
        filePath = path.join(publicDir, 'Stage-red-curtain-SnapYT.App.mp4');
      }
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Video file not found', requested: filename });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Gradual chunk size: 1MB chunk prevents hitting Vercel 4.5MB payload limit
    const CHUNK_SIZE = 1024 * 1024; // 1 MB

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

      if (start >= fileSize) {
        res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
        return res.end();
      }

      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      });

      fileStream.pipe(res);
    } else {
      // Progressive fallback: return first chunk rather than entire file
      const end = Math.min(CHUNK_SIZE - 1, fileSize - 1);
      const fileStream = fs.createReadStream(filePath, { start: 0, end });

      res.writeHead(206, {
        'Content-Range': `bytes 0-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end + 1,
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=86400',
      });

      fileStream.pipe(res);
    }
  } catch (err) {
    console.error('Video streaming error:', err);
    res.status(500).json({ error: 'Internal server error while streaming video' });
  }
}

