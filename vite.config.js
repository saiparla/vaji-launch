import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Dev middleware for gradual video chunk streaming (RFC 7233 / HTTP 206 Partial Content)
 * Mirrors Vercel Serverless Function behavior during development.
 */
function videoStreamPlugin() {
  return {
    name: 'vite-video-chunk-stream',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith('/api/stream-video')) {
          return next()
        }

        try {
          const url = new URL(req.url, 'http://localhost')
          const videoParam = url.searchParams.get('video')

          let filename = 'journey-75.mp4'
          if (videoParam === 'curtain' || videoParam === 'stage') {
            filename = 'curtain-stage.mp4'
          } else if (videoParam && videoParam.includes('.mp4')) {
            filename = path.basename(videoParam)
          }

          const publicDir = path.resolve(process.cwd(), 'public')
          let filePath = path.join(publicDir, filename)

          if (!fs.existsSync(filePath)) {
            if (filename === 'journey-75.mp4') {
              filePath = path.join(publicDir, '75-Years-Journey-SnapYT.App (2).mp4')
            } else if (filename === 'curtain-stage.mp4') {
              filePath = path.join(publicDir, 'Stage-red-curtain-SnapYT.App.mp4')
            }
          }

          if (!fs.existsSync(filePath)) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ error: 'Video file not found' }))
          }

          const stat = fs.statSync(filePath)
          const fileSize = stat.size
          const range = req.headers.range

          // Gradual 1MB chunk size
          const CHUNK_SIZE = 1024 * 1024

          if (range) {
            const parts = range.replace(/bytes=/, '').split('-')
            const start = parseInt(parts[0], 10)
            const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE - 1, fileSize - 1)

            if (start >= fileSize) {
              res.statusCode = 416
              res.setHeader('Content-Range', `bytes */${fileSize}`)
              return res.end()
            }

            const chunksize = end - start + 1
            const fileStream = fs.createReadStream(filePath, { start, end })

            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': 'video/mp4',
              'Cache-Control': 'no-cache',
            })

            fileStream.pipe(res)
          } else {
            const end = Math.min(CHUNK_SIZE - 1, fileSize - 1)
            const fileStream = fs.createReadStream(filePath, { start: 0, end })

            res.writeHead(206, {
              'Content-Range': `bytes 0-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': end + 1,
              'Content-Type': 'video/mp4',
            })

            fileStream.pipe(res)
          }
        } catch (e) {
          console.error('[videoStreamPlugin] Error streaming video:', e)
          res.statusCode = 500
          res.end('Streaming error')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    videoStreamPlugin(),
    vike({
      prerender: true
    })
  ],
  server: {
    host: true,
    port: 5173
  }
})
