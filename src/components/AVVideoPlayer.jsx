import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded'
import { navigate } from 'vike/client/router'
import { AnimatePresence, motion } from 'framer-motion'
import TributeIntro from './TributeIntro.jsx'

const BASE_URL = import.meta.env.BASE_URL

export default function AVVideoPlayer({ onComplete }) {
  const videoRef = useRef(null)
  const tributeFinishedRef = useRef(false)
  const playbackStartedRef = useRef(false)
  const hasCompletedRef = useRef(false)

  // Stage 1: Pure White Screen waiting for any key or click
  const [isStarted, setIsStarted] = useState(false)
  // Stage 2: Tribute Typing Screen
  const [showTribute, setShowTribute] = useState(true)
  // Stage 3: Fullscreen AV Playback
  const [currentTime, setCurrentTime] = useState(0)

  // Redirect to stage
  const handleRedirectToStage = useCallback(() => {
    if (hasCompletedRef.current) return
    hasCompletedRef.current = true

    if (onComplete) {
      onComplete()
    } else {
      try {
        navigate(`${BASE_URL}stage/`)
      } catch {
        window.location.href = `${BASE_URL}stage`
      }
    }
  }, [onComplete])

  // Start video playback with unmuted audio once tribute finishes
  const startVideoPlayback = useCallback(async () => {
    const video = videoRef.current
    if (!video || !tributeFinishedRef.current || playbackStartedRef.current) return

    playbackStartedRef.current = true
    video.currentTime = 0
    video.muted = false
    video.volume = 1.0

    try {
      await video.play()
      video.muted = false
      video.volume = 1.0
    } catch {
      // Robust fallback if any browser policy interferes
      video.muted = true
      try {
        await video.play()
        video.muted = false
        video.volume = 1.0
      } catch {}
    }
  }, [])

  // Start: User clicks or presses ANY key
  const handleStart = useCallback(() => {
    setIsStarted(true)

    // Unlock Web Audio Context on this trusted user gesture
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        if (!window.__vajiAudioCtx) {
          window.__vajiAudioCtx = new AudioCtx()
        }
        if (window.__vajiAudioCtx.state === 'suspended') {
          window.__vajiAudioCtx.resume()
        }
      }
    } catch {}

    // Pre-arm video element for unmuted audio
    const video = videoRef.current
    if (video) {
      video.muted = false
      video.volume = 1.0
    }
  }, [])

  // Listen for ANY key press or click on the initial white screen
  useEffect(() => {
    if (isStarted) return

    const triggerStart = () => {
      handleStart()
    }

    window.addEventListener('keydown', triggerStart)
    window.addEventListener('click', triggerStart)
    window.addEventListener('pointerdown', triggerStart)
    window.addEventListener('touchstart', triggerStart)

    return () => {
      window.removeEventListener('keydown', triggerStart)
      window.removeEventListener('click', triggerStart)
      window.removeEventListener('pointerdown', triggerStart)
      window.removeEventListener('touchstart', triggerStart)
    }
  }, [isStarted, handleStart])

  // Tribute completion -> triggers automatic unmuted video playback
  const handleTributeFinish = useCallback(() => {
    tributeFinishedRef.current = true
    setShowTribute(false)
    startVideoPlayback()
  }, [startVideoPlayback])

  // Buffer video data in the background
  useEffect(() => {
    const video = videoRef.current
    if (video && (!isStarted || showTribute)) {
      video.pause()
      video.currentTime = 0
    }
  }, [isStarted, showTribute])

  // Track video time for skip
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (video) {
      setCurrentTime(video.currentTime)
    }
  }, [])

  // Skip available after 30 seconds
  const canSkip = currentTime >= 30

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
      {/* Fullscreen 75-Years-Journey AV Video */}
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleRedirectToStage}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          display: 'block',
          backgroundColor: '#000000',
          opacity: isStarted && !showTribute ? 1 : 0,
          pointerEvents: isStarted && !showTribute ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
        }}
      >
        <source src={`${BASE_URL}journey-75.mp4`} type="video/mp4" />
        <source src={`${BASE_URL}75-Years-Journey-SnapYT.App (2).mp4`} type="video/mp4" />
        <source  type="video/mp4" />
      </video>

      {/* PHASE 1: Pure White Screen waiting for any key press or click */}
      <AnimatePresence mode="wait">
        {!isStarted && (
          <Box
            key="initial-white-screen"
            component={motion.div}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } }}
            onClick={handleStart}
            sx={{
              position: 'fixed',
              inset: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#ffffff',
              zIndex: 60,
              cursor: 'pointer',
            }}
          />
        )}
      </AnimatePresence>

      {/* PHASE 2: Telugu Tribute Typing Screen (Begins immediately after any key or click) */}
      <AnimatePresence>
        {isStarted && showTribute && (
          <TributeIntro
            key="tribute-screen"
            onFinish={handleTributeFinish}
          />
        )}
      </AnimatePresence>

      {/* PHASE 3: Skip Button after 30s of AV video */}
      {isStarted && !showTribute && canSkip && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
            zIndex: 10,
          }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={handleRedirectToStage}
            endIcon={<SkipNextRoundedIcon sx={{ fontSize: '0.95rem !important', color: '#d32f2f' }} />}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              color: '#d32f2f',
              border: '1px solid #d32f2f',
              fontWeight: 700,
              fontSize: '0.72rem',
              padding: '3px 10px',
              minWidth: 'auto',
              borderRadius: '14px',
              opacity: 0.55,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.25s ease',
              '&:hover': {
                opacity: 1,
                backgroundColor: '#d32f2f',
                color: '#ffffff',
                borderColor: '#ffffff',
                transform: 'scale(1.05)',
                '& .MuiSvgIcon-root': {
                  color: '#ffffff !important',
                },
              },
            }}
          >
            Skip
          </Button>
        </Box>
      )}
    </Box>
  )
}
