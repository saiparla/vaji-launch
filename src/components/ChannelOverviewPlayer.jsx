import React, { useRef, useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded'
import { motion } from 'framer-motion'

export default function ChannelOverviewPlayer() {
  const videoRef = useRef(null)
  const [showSkip, setShowSkip] = useState(false)
  const [showWebview, setShowWebview] = useState(false)

  // Unmuted autoplay on mount with session persistence
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    video.muted = false
    video.volume = 1.0

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          video.muted = false
          video.volume = 1.0
        })
        .catch(() => {
          // If browser temporarily blocks unmuted audio on cold start, fallback to muted
          video.muted = true
          video.play().catch(() => {})
        })
    }
  }, [])

  // Universal interaction observer to unmute whenever user clicks or touches
  useEffect(() => {
    const handleInteraction = () => {
      const video = videoRef.current
      if (video) {
        video.muted = false
        video.volume = 1.0
        if (video.paused) {
          video.play().catch(() => {})
        }
      }
    }

    const events = ['click', 'pointerdown', 'touchstart', 'keydown']
    events.forEach((evt) => window.addEventListener(evt, handleInteraction, { passive: true }))
    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleInteraction))
    }
  }, [])

  // 30-second timer to reveal the Skip button
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkip(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  // Track playback time as well
  const handleTimeUpdate = (e) => {
    if (e.currentTarget.currentTime >= 30 && !showSkip) {
      setShowSkip(true)
    }
  }

  // Handle Skip click -> show webview of vajione.com
  const handleSkipToWebview = () => {
    const video = videoRef.current
    if (video) video.pause()
    setShowWebview(true)
  }

  // When video completes, automatically show webview
  const handleVideoEnded = () => {
    setShowSkip(true)
    setShowWebview(true)
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Webview of vajione.com/landing#home when Skipped or Ended (pure iframe, no buttons) */}
      {showWebview ? (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          sx={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#ffffff',
            zIndex: 50,
          }}
        >
          <iframe
            src="https://www.vajione.com/landing#home"
            title="VajiOne Landing"
            style={{
              width: '100vw',
              height: '100vh',
              border: 'none',
              display: 'block',
            }}
            allow="autoplay; fullscreen; clipboard-write; encrypted-media"
          />
        </Box>
      ) : (
        <>
          {/* Fullscreen Video Player - Pure unmuted autoplay, zero overlays */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              display: 'block',
              backgroundColor: '#000000',
            }}
          >
            <source src={`${BASE_URL}journey-75.mp4`} type="video/mp4" />
            <source src={`${BASE_URL}75-Years-Journey-SnapYT.App (2).mp4`} type="video/mp4" />
            <source  type="video/mp4" />
          </video>

          {/* Skip Button - Hidden for first 30 seconds, then appears */}
          {showSkip && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{
                position: 'absolute',
                bottom: { xs: 24, sm: 32 },
                right: { xs: 20, sm: 36 },
                zIndex: 40,
              }}
            >
              <Button
                variant="contained"
                onClick={handleSkipToWebview}
                endIcon={<FastForwardRoundedIcon />}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: '#ffffff',
                  border: '1.5px solid rgba(255, 255, 255, 0.35)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  padding: { xs: '8px 20px', sm: '10px 26px' },
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: '0.82rem', sm: '0.92rem' },
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    backgroundColor: '#d32f2f',
                    borderColor: '#ffffff',
                    boxShadow: '0 8px 25px rgba(211, 47, 47, 0.6)',
                  },
                }}
              >
                SKIP
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
