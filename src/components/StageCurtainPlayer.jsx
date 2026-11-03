import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Box, Button, Typography, Stack } from '@mui/material'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded'
import { motion, AnimatePresence } from 'framer-motion'
import MobileMockup from './MobileMockup.jsx'

const BASE_URL = import.meta.env.BASE_URL

// Realistic 3D Balloon themes (Highlight, Main, Deep Shadow, Edge)
const BALLOON_THEMES = [
  { name: 'red', highlight: '#FF8A80', main: '#E53935', dark: '#B71C1C', edge: '#880E4F' },
  { name: 'gold', highlight: '#FFF59D', main: '#FFB300', dark: '#FF8F00', edge: '#E65100' },
  { name: 'blue', highlight: '#80D8FF', main: '#1E88E5', dark: '#0D47A1', edge: '#0A3870' },
  { name: 'green', highlight: '#A5D6A7', main: '#43A047', dark: '#1B5E20', edge: '#0D3810' },
  { name: 'purple', highlight: '#E1BEE7', main: '#8E24AA', dark: '#4A148C', edge: '#310A61' },
  { name: 'orange', highlight: '#FFCC80', main: '#FB8C00', dark: '#E65100', edge: '#BF360C' },
  { name: 'pink', highlight: '#F8BBD0', main: '#E91E63', dark: '#AD1457', edge: '#5C0834' },
  { name: 'cyan', highlight: '#B2EBF2', main: '#00ACC1', dark: '#006064', edge: '#00363A' },
]

// Default vibrant celebration confetti palette (rainbow carnival spectrum)
const DEFAULT_CONFETTI_COLORS = [
  '#FF1744', // Red
  '#2979FF', // Electric Blue
  '#FFD700', // Gold
  '#00E676', // Emerald Green
  '#FF9100', // Orange
  '#D500F9', // Purple
  '#00E5FF', // Cyan
  '#FF4081', // Pink
  '#FFEA00', // Bright Yellow
  '#FFFFFF', // White Sparkle
  '#7C4DFF', // Deep Violet
  '#00B0FF', // Sky Blue
]

// Multi-stage celebratory confetti canvas with realistic 3D floating balloons
function ConfettiCanvas({ active }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active || typeof window === 'undefined') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId
    const confettiParticles = []
    const balloons = []
    let balloonSpawnInterval = null

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Helper to spawn confetti bursts
    const createBurst = (x, y, count, angleRange, speedRange) => {
      for (let i = 0; i < count; i++) {
        const angle = angleRange[0] + Math.random() * (angleRange[1] - angleRange[0])
        const speed = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0])
        confettiParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 7 + Math.random() * 9,
          color: DEFAULT_CONFETTI_COLORS[Math.floor(Math.random() * DEFAULT_CONFETTI_COLORS.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 16,
          tilt: Math.random() * Math.PI,
          tiltSpeed: 0.08 + Math.random() * 0.12,
          shape: Math.random() > 0.35 ? 'rect' : 'circle',
          opacity: 1,
          gravity: 0.22 + Math.random() * 0.08,
          drag: 0.985,
        })
      }
    }

    // Helper to create a realistic 3D balloon with balanced natural sizing
    const createBalloon = (initialY) => {
      const radiusX = 26 + Math.random() * 11 // Balanced size: 26px - 37px radius (52px - 74px wide)
      const radiusY = radiusX * (1.28 + Math.random() * 0.12) // 68px - 100px tall
      const theme = BALLOON_THEMES[Math.floor(Math.random() * BALLOON_THEMES.length)]

      return {
        x: Math.random() * window.innerWidth,
        y: initialY,
        baseX: 0,
        radiusX,
        radiusY,
        theme,
        vy: -(2.2 + Math.random() * 2.4), // Graceful rising speed
        wobbleSpeed: 0.024 + Math.random() * 0.024,
        wobbleAmp: 1.5 + Math.random() * 2.5,
        rotation: (Math.random() - 0.5) * 0.12,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        seed: Math.random() * 50,
        opacity: 0.94,
      }
    }

    // Spawn initial celebratory flock of balloons across screen
    const initialBalloonCount = 42
    for (let i = 0; i < initialBalloonCount; i++) {
      // Staggered across lower screen so they immediately float upward into full view
      const y = window.innerHeight * 0.35 + Math.random() * (window.innerHeight * 0.95)
      balloons.push(createBalloon(y))
    }

    // Continuously spawn new floating balloons every 500ms to keep atmosphere festive
    balloonSpawnInterval = setInterval(() => {
      if (balloons.length < 55) {
        balloons.push(createBalloon(window.innerHeight + 40 + Math.random() * 50))
        balloons.push(createBalloon(window.innerHeight + 60 + Math.random() * 80))
      }
    }, 500)

    // Stage 1: Left & Right Cannons immediately with default multi-colors
    createBurst(window.innerWidth * 0.05, window.innerHeight * 0.95, 110, [-Math.PI * 0.45, -Math.PI * 0.15], [16, 32])
    createBurst(window.innerWidth * 0.95, window.innerHeight * 0.95, 110, [-Math.PI * 0.85, -Math.PI * 0.55], [16, 32])

    // Stage 2: Center Grand Explosion at 350ms
    const t1 = setTimeout(() => {
      createBurst(window.innerWidth * 0.5, window.innerHeight * 0.65, 150, [-Math.PI, 0], [12, 28])
    }, 350)

    // Stage 3: Follow-up Cross-Cannons at 900ms
    const t2 = setTimeout(() => {
      createBurst(window.innerWidth * 0.2, window.innerHeight * 0.9, 85, [-Math.PI * 0.45, -Math.PI * 0.2], [14, 28])
      createBurst(window.innerWidth * 0.8, window.innerHeight * 0.9, 85, [-Math.PI * 0.8, -Math.PI * 0.55], [14, 28])
    }, 900)

    let startTime = Date.now()

    const render = () => {
      const now = Date.now()
      const time = (now - startTime) * 0.001
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 1. RENDER & UPDATE BALLOONS (Rising gracefully in the background)
      for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i]

        b.y += b.vy
        b.x += Math.sin(time * 3 + b.seed) * b.wobbleAmp * 0.4
        b.rotation += Math.sin(time * 2 + b.seed) * b.rotationSpeed

        // Remove balloons that floated far above the viewport
        if (b.y < -b.radiusY * 1.6) {
          balloons.splice(i, 1)
          continue
        }

        // Draw realistic 3D balloon
        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate(b.rotation)
        ctx.globalAlpha = b.opacity

        const rx = b.radiusX
        const ry = b.radiusY

        // A. True Teardrop Balloon Body
        ctx.beginPath()
        ctx.moveTo(0, -ry)
        ctx.bezierCurveTo(rx * 1.08, -ry * 0.95, rx * 1.15, ry * 0.25, 0, ry)
        ctx.bezierCurveTo(-rx * 1.15, ry * 0.25, -rx * 1.08, -ry * 0.95, 0, -ry)
        ctx.closePath()

        // 3D Spherical Radial Gradient Shading
        const grad = ctx.createRadialGradient(
          -rx * 0.32, -ry * 0.38, rx * 0.08,
          0, 0, ry * 1.1
        )
        grad.addColorStop(0, b.theme.highlight)
        grad.addColorStop(0.32, b.theme.main)
        grad.addColorStop(0.82, b.theme.dark)
        grad.addColorStop(1, b.theme.edge)

        ctx.fillStyle = grad
        ctx.fill()

        // B. Glossy Specular Highlight (Curved oblong glare on upper-left shoulder)
        ctx.beginPath()
        ctx.ellipse(-rx * 0.36, -ry * 0.44, rx * 0.22, ry * 0.36, -Math.PI / 5.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.58)'
        ctx.fill()

        // Primary pinpoint reflection peak
        ctx.beginPath()
        ctx.arc(-rx * 0.38, -ry * 0.54, rx * 0.08, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
        ctx.fill()

        // Soft ambient rim reflection at bottom-right
        ctx.beginPath()
        ctx.ellipse(rx * 0.32, ry * 0.45, rx * 0.24, ry * 0.16, Math.PI / 4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)'
        ctx.fill()

        // C. Balloon Knot at bottom (Scaled with balloon size)
        const knotH = rx * 0.18
        ctx.beginPath()
        ctx.moveTo(-rx * 0.12, ry)
        ctx.lineTo(rx * 0.12, ry)
        ctx.lineTo(rx * 0.18, ry + knotH)
        ctx.lineTo(-rx * 0.18, ry + knotH)
        ctx.closePath()
        ctx.fillStyle = b.theme.dark
        ctx.fill()

        // D. Graceful waving ribbon string (Scaled with balloon size)
        const knotBottom = ry + knotH
        ctx.beginPath()
        ctx.moveTo(0, knotBottom)
        const wave1 = Math.sin(time * 3 + b.seed) * (rx * 0.22)
        const wave2 = Math.cos(time * 2.5 + b.seed) * (rx * 0.35)
        const wave3 = Math.sin(time * 2 + b.seed) * (rx * 0.25)
        ctx.bezierCurveTo(
          wave1, knotBottom + ry * 0.35,
          wave2, knotBottom + ry * 0.75,
          wave3, knotBottom + ry * 1.25
        )
        ctx.strokeStyle = 'rgba(160, 160, 160, 0.75)'
        ctx.lineWidth = 1.3
        ctx.stroke()

        ctx.restore()
      }

      // 2. RENDER & UPDATE CONFETTI PARTICLES (With 3D tumbling paper physics)
      for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const p = confettiParticles[i]
        p.vx *= p.drag
        p.vy = p.vy * p.drag + p.gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.tilt += p.tiltSpeed
        p.opacity -= 0.003

        if (p.opacity <= 0 || p.y > canvas.height + 25) {
          confettiParticles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color

        // 3D paper flutter scale
        const tiltScale = Math.cos(p.tilt)

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, (-p.size * tiltScale) / 4, p.size, Math.abs(p.size * tiltScale) / 2)
        } else {
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size / 2.2, Math.abs((p.size * tiltScale) / 2.2), 0, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      if (confettiParticles.length > 0 || balloons.length > 0) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      if (balloonSpawnInterval) clearInterval(balloonSpawnInterval)
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 45,
      }}
    />
  )
}

export default function StageCurtainPlayer({ onBack, onNavigateToOverview }) {
  const videoRef = useRef(null)
  const launchTimerRef = useRef(null)
  const [isLaunched, setIsLaunched] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [isCelebrationReady, setIsCelebrationReady] = useState(false)
  const [presentationStep, setPresentationStep] = useState(0)

  // Navigate to /overview (VajiNews Channel Overview AV)
  const handleGoToOverview = () => {
    if (onNavigateToOverview) {
      onNavigateToOverview()
    } else if (typeof window !== 'undefined') {
      import('vike/client/router')
        .then(({ navigate }) => navigate(`${BASE_URL}overview/`))
        .catch(() => {
          window.location.href = `${BASE_URL}overview`
        })
    }
  }

  // Current Date in Telugu & English
  const currentDate = useMemo(() => {
    const now = new Date()
    const teluguMonths = [
      'జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్',
      'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'
    ]
    const day = String(now.getDate()).padStart(2, '0')
    const monthTelugu = teluguMonths[now.getMonth()]
    const year = now.getFullYear()
    return {
      telugu: `${day} ${monthTelugu}, ${year}`,
      english: now.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })
    }
  }, [])

  // Trigger video playback on "LAUNCH NOW" click and start 3s countdown trigger
  const handleLaunchNow = () => {
    setIsLaunched(true)
    const video = videoRef.current

    if (video) {
      video.currentTime = 0
      video.muted = false
      video.volume = 1.0
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = false
          video.volume = 1.0
          video.play().catch(() => {})
        })
      }
    }

    // After clicking LAUNCH NOW, wait 1 second to start the 3 -> 2 -> 1 countdown
    if (launchTimerRef.current) {
      clearTimeout(launchTimerRef.current)
    }
    launchTimerRef.current = setTimeout(() => {
      setCountdown(3)
    }, 1000)
  }

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (launchTimerRef.current) clearTimeout(launchTimerRef.current)
    }
  }, [])

  // Manage countdown sequence: 3 -> 2 -> 1 -> Celebration
  useEffect(() => {
    if (countdown === null) return

    if (countdown === 3) {
      const timer = setTimeout(() => setCountdown(2), 1000)
      return () => clearTimeout(timer)
    }

    if (countdown === 2) {
      const timer = setTimeout(() => setCountdown(1), 1000)
      return () => clearTimeout(timer)
    }

    if (countdown === 1) {
      const timer = setTimeout(() => {
        setCountdown(null)
        setIsCelebrationReady(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Orchestrate post-launch presentation animation and auto-redirect to /overview
  useEffect(() => {
    if (!isCelebrationReady) return

    // Step 1: "We are proudly presenting" enters in center with balloons & confetti
    setPresentationStep(1)

    // Step 2 (at 2000ms): Celebration clears; Vaji logo pops up in center
    const t1 = setTimeout(() => {
      setPresentationStep(2)
    }, 2000)

    // Step 3 (at 3000ms - exactly 1s hold): Vaji logo glides smoothly from center to LEFT
    const t2 = setTimeout(() => {
      setPresentationStep(3)
    }, 3000)

    // Step 4 (at 4000ms): MobileMockup enters on RIGHT with "Powered by" Hippo Logo directly under it
    const t3 = setTimeout(() => {
      setPresentationStep(4)
    }, 4000)

    // Step 5 (at 7500ms): Automatically transition to /overview
    const t4 = setTimeout(() => {
      handleGoToOverview()
    }, 7500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [isCelebrationReady])

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
      {/* Fullscreen Curtain Video (5-6s) */}
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        onEnded={() => {
          // Keep holding on the open stage frame
        }}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          display: 'block',
          backgroundColor: '#000000',
        }}
      >
        <source  type="video/mp4" />
        <source src={`${BASE_URL}curtain-stage.mp4`} type="video/mp4" />
        <source src={`${BASE_URL}Stage-red-curtain-SnapYT.App.mp4`} type="video/mp4" />
      </video>

      {/* Borderless Cinematic Launch Screen (No Box/Card Style) */}
      {!isLaunched && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(5, 5, 10, 0.55)',
            backdropFilter: 'blur(8px)',
            zIndex: 20,
            padding: { xs: 2.5, sm: 4, md: 6 },
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 820,
            }}
          >
            {/* Main Grand Launch Title: నవ శకానికి శుభారంభం (Reduced font weight, more letter/word space) */}
            <Typography
              sx={{
                fontFamily: "'Potti Sreeramulu', sans-serif",
                color: '#ffffff',
                fontWeight: 500,
                fontSize: { xs: '2.5rem', sm: '3.6rem', md: '4.6rem', lg: '5rem' },
                lineHeight: 1.25,
                letterSpacing: '0.07em',
                wordSpacing: '0.22em',
                textShadow: '0 4px 30px rgba(211, 47, 47, 0.7), 0 2px 10px rgba(0, 0, 0, 0.9)',
                mb: 1,
              }}
            >
              నవ శకానికి శుభారంభం
            </Typography>

            {/* English Subtitle in Montserrat */}
            <Typography
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                color: 'rgba(255, 255, 255, 0.92)',
                fontWeight: 800,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)',
                mb: 3,
              }}
            >
              THE GRAND INAUGURATION
            </Typography>

            {/* Current Date Badge - Telugu Date with Small LAUNCH Variant */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.2,
                backgroundColor: 'rgba(211, 47, 47, 0.2)',
                border: '1px solid rgba(211, 47, 47, 0.5)',
                padding: '8px 20px',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
                mb: 4.5,
              }}
            >
              <CalendarTodayRoundedIcon sx={{ color: '#ffffff', fontSize: '1.05rem' }} />

              <Typography
                sx={{
                  fontFamily: "'Potti Sreeramulu', sans-serif",
                  color: '#ffffff',
                  fontWeight: 500,
                  fontSize: { xs: '0.98rem', sm: '1.12rem' },
                  letterSpacing: '0.06em',
                  wordSpacing: '0.14em',
                }}
              >
                {currentDate.telugu}
              </Typography>


            </Box>

            {/* Big Launch Now Button (No Scale Up, Clean New Luxury Red & White Styling) */}
            <Button
              variant="contained"
              size="small"
              onClick={handleLaunchNow}
              startIcon={
                <RocketLaunchRoundedIcon
                  sx={{
                    fontSize: { xs: '2rem !important', sm: '2.4rem !important', md: '2rem !important' },
                    color: '#ffffff',
                    mr: { xs: 0.5, md: 1 },
                  }}
                />
              }
              sx={{
                backgroundColor: '#d32f2f',
                color: '#ffffff',
                border: '2.5px solid #ffffff',
                borderRadius: '12px',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                // fontSize: { xs: '1.35rem', sm: '1.65rem', md: '1.95rem' },
                // padding: { xs: '14px 38px', sm: '18px 52px', md: '20px 64px' },
                minWidth: { xs: '240px', sm: '300px', md: '240px' },
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                boxShadow:
                  '0 14px 45px rgba(211, 47, 47, 0.65), 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
                transition: 'background-color 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                  borderColor: '#ffffff',
                  boxShadow:
                    '0 18px 55px rgba(211, 47, 47, 0.85), 0 6px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                },
                '&:active': {
                  backgroundColor: '#9a1010',
                },
              }}
            >
              LAUNCH NOW
            </Button>
          </motion.div>
        </Box>
      )}

      {/* Plain Red Floating Countdown Sequence: 3 -> 2 -> 1 (No Shadows, Plain Characters) */}
      <AnimatePresence mode="wait">
        {countdown !== null && (
          <Box
            key={String(countdown)}
            component={motion.div}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.25, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 35,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: { xs: '5.5rem', sm: '7rem', md: '8.5rem', lg: '10rem' },
                lineHeight: 1,
                color: '#d32f2f',
                letterSpacing: '-0.02em',
                textShadow: 'none',
                boxShadow: 'none',
              }}
            >
              {countdown}
            </Typography>
          </Box>
        )}
      </AnimatePresence>

      {/* Multi-stage Celebration Confetti Cannons & Big 3D Balloons - Active ONLY before Vaji Logo arrives */}
      <AnimatePresence>
        {isCelebrationReady && presentationStep < 2 && (
          <Box
            component={motion.div}
            key="celebration-canvas-layer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 45,
              pointerEvents: 'none',
            }}
          >
            <ConfettiCanvas active={true} />
          </Box>
        )}
      </AnimatePresence>

      {/* Pure White Background Presentation (No Text, Pure Logo & Mobile Showcase) */}
      {isCelebrationReady && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#ffffff', // PURE WHITE BACKGROUND AS REQUESTED
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: { xs: 2.5, sm: 4, md: 6 },
          }}
        >
          {/* Step 1: "We are proudly presenting" - Enters in Center, then DISAPPEARS */}
          <AnimatePresence>
            {presentationStep === 1 && (
              <Box
                component={motion.div}
                key="proudly-presenting-text"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 3,
                  zIndex: 10,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif",
                    fontWeight: 700,
                    fontSize: { xs: '1.15rem', sm: '1.55rem', md: '1.95rem', lg: '2.3rem' },
                    letterSpacing: { xs: '0.16em', sm: '0.26em' },
                    textTransform: 'uppercase',
                    color: '#b71c1c',
                    lineHeight: 1.3,
                  }}
                >
                  We Are Proudly Presenting
                </Typography>
              </Box>
            )}
          </AnimatePresence>

          {/* Step 2: Vaji Logo pops up in center */}
          {presentationStep === 2 && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 15,
                pointerEvents: 'none',
              }}
            >
              <motion.div
                layoutId="vaji-showcase-logo"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.22, 1], opacity: 1 }}
                transition={{
                  scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  layout: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                }}
              >
                <Box
                  component="img"
                  src={`${BASE_URL}Vaji-Logo-GIF.gif`}
                  alt="Vaji Logo"
                  sx={{
                    width: { xs: 220, sm: 280, md: 340, lg: 390 },
                    height: 'auto',
                    filter: 'drop-shadow(0 14px 35px rgba(211, 47, 47, 0.25))',
                  }}
                />
              </motion.div>
            </Box>
          )}

          {/* Steps 3 & 4: 2-Column Showcase (Logo on Left, Mobile on Right with wide spacing) */}
          {presentationStep >= 3 && (
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', md: 1400, lg: 1650 },
                height: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 8, sm: 12, md: 24, lg: 34 },
                position: 'relative',
                px: { xs: 3, sm: 6, md: 10, lg: 14 },
              }}
            >
              {/* LEFT SIDE: Vaji Logo glides smoothly to this left position */}
              <Box
                sx={{
                  flex: { xs: '0 0 auto', md: 1 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                }}
              >
                <motion.div
                  layoutId="vaji-showcase-logo"
                  transition={{
                    layout: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                  }}
                >
                  <Box
                    component="img"
                    src={`${BASE_URL}Vaji-Logo-GIF.gif`}
                    alt="Vaji Logo"
                    sx={{
                      width: { xs: 200, sm: 250, md: 300, lg: 350 },
                      height: 'auto',
                      filter: 'drop-shadow(0 14px 35px rgba(211, 47, 47, 0.25))',
                    }}
                  />
                </motion.div>
              </Box>

              {/* RIGHT SIDE: Reserved mobile container with MobileMockup containing Powered by Hippo Clouds directly inside */}
              <Box
                sx={{
                  flex: { xs: '0 0 auto', md: 1 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  minWidth: { xs: 155, sm: 180, md: 205, lg: 220 },
                  minHeight: { xs: 300, sm: 350, md: 400, lg: 430 },
                }}
              >
                {presentationStep >= 4 && (
                  <MobileMockup
                    imageSrc={`${BASE_URL}vajione-app-screen.jpg`}
                    tilt="right"
                    deviceStyle="iphone"
                    showPoweredBy={true}
                    poweredByLogo={`${BASE_URL}Hippo_Logo_Black.png`}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
