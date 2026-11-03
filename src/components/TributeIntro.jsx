import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Box, Typography, Container } from '@mui/material'
import { motion } from 'framer-motion'

// Text lines for tribute
const LINES = [
  { id: 'salutation', text: 'ప్రత్యేక కృతజ్ఞతలు' },
  { id: 'honorific', text: 'గౌరవనీయులు ఆంధ్రప్రదేశ్ రాష్ట్ర ముఖ్యమంత్రివర్యులు' },
  { id: 'ncbn', text: 'శ్రీ నారా చంద్రబాబు నాయుడు గారికి', isNCBN: true },
  { id: 'body1', text: 'మీ అమూల్యమైన మార్గదర్శకత్వానికి, ప్రోత్సాహానికి మరియు అభివృద్ధి పట్ల మీ దార్శనికతకు మా హృదయపూర్వక కృతజ్ఞతలు.' },
  { id: 'body2', text: 'మీ ఆశీస్సులు, ప్రోత్సాహం మా ప్రస్థానానికి స్ఫూర్తిదాయకం.' },
  { id: 'closing', text: 'ధన్యవాదములతో...' },
  { id: 'signatory', text: 'గణపతినీడి శ్రీనివాసరావు,' },
  { id: 'company_te', text: 'గణపతినీడి టెక్నాలజీస్ ప్రైవేట్ లిమిటెడ్' },
]

export default function TributeIntro({ onFinish }) {
  // Split each line into true grapheme clusters using Intl.Segmenter
  const graphemeLines = useMemo(() => {
    const segmenter =
      typeof Intl !== 'undefined' && Intl.Segmenter
        ? new Intl.Segmenter('te', { granularity: 'grapheme' })
        : null

    return LINES.map((item) => {
      if (segmenter) {
        return Array.from(segmenter.segment(item.text), (s) => s.segment)
      }
      return item.text.split('')
    })
  }, [])

  // State tracking typed characters per line
  const [typedCounts, setTypedCounts] = useState(() => LINES.map(() => 0))
  const [activeLineIndex, setActiveLineIndex] = useState(0)

  const activeLineRef = useRef(0)
  const currentCountRef = useRef(0)
  const isPausedRef = useRef(false)

  useEffect(() => {
    activeLineRef.current = 0
    currentCountRef.current = 0
    isPausedRef.current = false

    // Steady, graceful typing speed
    const TYPING_SPEED_MS = 48

    const interval = setInterval(() => {
      if (isPausedRef.current) return

      const lineIdx = activeLineRef.current

      // All lines completed
      if (lineIdx >= graphemeLines.length) {
        clearInterval(interval)
        // Hold for 1 second after typing finishes, then transition directly to video
        setTimeout(() => {
          onFinish?.()
        }, 1000)
        return
      }

      const totalCharsInLine = graphemeLines[lineIdx].length

      if (currentCountRef.current < totalCharsInLine) {
        currentCountRef.current += 1
        const updatedCount = currentCountRef.current
        setTypedCounts((prev) => {
          const next = [...prev]
          next[lineIdx] = updatedCount
          return next
        })
      } else {
        // Line completed
        // When NCBN's name (index 2) completes, pause for 750ms before starting body text
        if (lineIdx === 2) {
          isPausedRef.current = true
          setTimeout(() => {
            isPausedRef.current = false
            activeLineRef.current = 3
            currentCountRef.current = 0
            setActiveLineIndex(3)
          }, 750)
        } else {
          activeLineRef.current += 1
          currentCountRef.current = 0
          setActiveLineIndex(activeLineRef.current)
        }
      }
    }, TYPING_SPEED_MS)

    return () => clearInterval(interval)
  }, [graphemeLines, onFinish])

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } }}
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, sm: 3, md: 4 },
        overflow: 'hidden',
        userSelect: 'none',
        fontFamily: "'Potti Sreeramulu', 'Segoe UI', 'Gautami', sans-serif",
      }}
    >
      {/* Decorative Red Top Line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          background: 'linear-gradient(90deg, #b71c1c 0%, #d32f2f 50%, #b71c1c 100%)',
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 2.5, sm: 3.5, md: 5, lg: 7 },
        }}
      >
        {/* Cinematic Entrance Transition for CBN Portrait without Border + Rich Box Shadow */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          sx={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src="/chandrababu-naidu.jfif"
            alt="శ్రీ నారా చంద్రబాబు నాయుడు గారు"
            onError={(e) => {
              e.currentTarget.src = '/nara%20chandrababu%20naidu.jfif'
            }}
            sx={{
              width: { xs: 190, sm: 230, md: 275, lg: 305 },
              height: { xs: 230, sm: 280, md: 335, lg: 375 },
              objectFit: 'cover',
              borderRadius: '22px',
              display: 'block',
              boxShadow:
                '0 24px 60px -10px rgba(0, 0, 0, 0.18), 0 12px 28px -6px rgba(211, 47, 47, 0.16), 0 0 1px rgba(0, 0, 0, 0.12)',
            }}
          />
        </Box>

        {/* Stable Non-Wobbling Text Container */}
        <Box
          sx={{
            width: { xs: '100%', md: 680, lg: 760 },
            textAlign: { xs: 'center', md: 'left' },
            fontFamily: "'Potti Sreeramulu', 'Segoe UI', 'Gautami', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          {/* Top Heading: ప్రత్యేక కృతజ్ఞతలు (Center Aligned, No Border, Bold Font Weight 800) */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Typography
              sx={{
                textAlign: 'center',
                fontFamily: "'Potti Sreeramulu', sans-serif",
                color: '#000000',
                fontWeight: 500,
                fontSize: { xs: '1.35rem', sm: '1.65rem', md: '2.05rem' },
                lineHeight: 1.35,
                letterSpacing: '0.08em',
                wordSpacing: '0.2em',
                display: 'inline-block',
                mb: 5
              }}
            >
              {graphemeLines[0].slice(0, typedCounts[0]).join('')}
              {activeLineIndex === 0 && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: '3px',
                    height: '1.1em',
                    backgroundColor: '#000000',
                    ml: 0.5,
                    verticalAlign: 'text-bottom',
                    animation: 'blink 0.7s infinite',
                  }}
                />
              )}
            </Typography>
          </Box>

          {/* Line 2: గౌరవనీయులు ఆంధ్రప్రదేశ్ రాష్ట్ర ముఖ్యమంత్రివర్యులు */}
          <Box sx={{ minHeight: { xs: 24, sm: 28, md: 30 }, mt: 0.4, mb: 0.3 }}>
            <Typography
              sx={{
                fontFamily: "'Potti Sreeramulu', sans-serif",
                color: '#000000',
                fontWeight: 500,
                fontSize: { xs: '0.95rem', sm: '1.12rem', md: '1.28rem' },
                letterSpacing: '0.07em',
                wordSpacing: '0.18em',
                lineHeight: 1.35,
                mb: 2
              }}
            >
              {graphemeLines[1].slice(0, typedCounts[1]).join('')}
              {activeLineIndex === 1 && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: '3px',
                    height: '1.1em',
                    backgroundColor: '#000000',
                    ml: 0.5,
                    verticalAlign: 'text-bottom',
                    animation: 'blink 0.7s infinite',
                  }}
                />
              )}
            </Typography>
          </Box>

          {/* Line 3: శ్రీ నారా చంద్రబాబు నాయుడు గారికి (NCBN in Red) */}
          <Box sx={{ minHeight: { xs: 36, md: 46 }, mb: { xs: 1.2, md: 1.6 } }}>
            <Typography
              sx={{
                fontFamily: "'Potti Sreeramulu', sans-serif",
                color: '#d32f2f',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.45rem', lg: '2.7rem' },
                lineHeight: 1.2,
                letterSpacing: '0.07em',
                wordSpacing: '0.18em',
                textShadow: '0 2px 10px rgba(211, 47, 47, 0.12)',
              }}
            >
              {graphemeLines[2].slice(0, typedCounts[2]).join('')}
              {activeLineIndex === 2 && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: '4px',
                    height: '1.1em',
                    backgroundColor: '#d32f2f',
                    ml: 0.5,
                    verticalAlign: 'text-bottom',
                    animation: 'blink 0.7s infinite',
                  }}
                />
              )}
            </Typography>
          </Box>

          {/* Line 4: మీ అమూల్యమైన మార్గదర్శకత్వానికి... */}
          <Box sx={{ minHeight: { xs: 40, md: 50 }, mb: 0.8 }}>
            <Typography
              sx={{
                fontFamily: "'Potti Sreeramulu', sans-serif",
                color: '#000000',
                fontWeight: 500,
                fontSize: { xs: '0.95rem', sm: '1.12rem', md: '1.24rem' },
                lineHeight: 1.75,
                letterSpacing: '0.07em',
                wordSpacing: '0.18em',
              }}
            >
              {graphemeLines[3].slice(0, typedCounts[3]).join('')}
              {activeLineIndex === 3 && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: '3px',
                    height: '1em',
                    backgroundColor: '#000000',
                    ml: 0.5,
                    verticalAlign: 'text-bottom',
                    animation: 'blink 0.7s infinite',
                  }}
                />
              )}
            </Typography>
          </Box>

          {/* Line 5: మీ ఆశీస్సులు, ప్రోత్సాహం మా ప్రస్థానానికి స్ఫూర్తిదాయకం. */}
          <Box sx={{ minHeight: { xs: 26, md: 32 }, mb: 1.2 }}>
            <Typography
              sx={{
                fontFamily: "'Potti Sreeramulu', sans-serif",
                color: '#000000',
                fontWeight: 500,
                fontSize: { xs: '0.92rem', sm: '1.08rem', md: '1.2rem' },
                lineHeight: 1.7,
                letterSpacing: '0.07em',
                wordSpacing: '0.18em',
              }}
            >
              {graphemeLines[4].slice(0, typedCounts[4]).join('')}
              {activeLineIndex === 4 && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: '3px',
                    height: '1em',
                    backgroundColor: '#000000',
                    ml: 0.5,
                    verticalAlign: 'text-bottom',
                    animation: 'blink 0.7s infinite',
                  }}
                />
              )}
            </Typography>
          </Box>

          {/* Concluding Signature Section - Right Aligned */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-end' },
              textAlign: { xs: 'center', md: 'right' },
              mt: 1.0,
            }}
          >
            {/* Line 6: ధన్యవాదములతో... (Regular Font Weight 400) */}
            <Box sx={{ minHeight: { xs: 24, md: 28 }, mb: 0.3 }}>
              <Typography
                sx={{
                  fontFamily: "'Potti Sreeramulu', sans-serif",
                  color: '#000000',
                  fontWeight: 400,
                  fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.35rem' },
                  letterSpacing: '0.08em',
                  wordSpacing: '0.18em',
                }}
              >
                {graphemeLines[5].slice(0, typedCounts[5]).join('')}
                {activeLineIndex === 5 && (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: '3px',
                      height: '1.1em',
                      backgroundColor: '#000000',
                      ml: 0.5,
                      verticalAlign: 'text-bottom',
                      animation: 'blink 0.7s infinite',
                    }}
                  />
                )}
              </Typography>
            </Box>

            {/* Line 7: గణపతినీడి శ్రీనివాసరావు, (Regular Font Weight 400) */}
            <Box sx={{ minHeight: { xs: 26, md: 32 }, mb: 0.2 }}>
              <Typography
                sx={{
                  fontFamily: "'Potti Sreeramulu', sans-serif",
                  color: '#000000',
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.42rem' },
                  letterSpacing: '0.07em',
                  wordSpacing: '0.18em',
                }}
              >
                {graphemeLines[6].slice(0, typedCounts[6]).join('')}
                {activeLineIndex === 6 && (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: '3px',
                      height: '1.1em',
                      backgroundColor: '#000000',
                      ml: 0.5,
                      verticalAlign: 'text-bottom',
                      animation: 'blink 0.7s infinite',
                    }}
                  />
                )}
              </Typography>
            </Box>

            {/* Line 8: గణపతినీడి టెక్నాలజీస్ ప్రైవేట్ లిమిటెడ్ (Regular Font Weight 400) */}
            <Box sx={{ minHeight: { xs: 24, md: 28 } }}>
              <Typography
                sx={{
                  fontFamily: "'Potti Sreeramulu', sans-serif",
                  color: '#000000',
                  fontWeight: 400,
                  fontSize: { xs: '0.95rem', sm: '1.08rem', md: '1.22rem' },
                  letterSpacing: '0.06em',
                  wordSpacing: '0.16em',
                }}
              >
                {graphemeLines[7].slice(0, typedCounts[7]).join('')}
                {activeLineIndex === 7 && (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: '3px',
                      height: '1.1em',
                      backgroundColor: '#000000',
                      ml: 0.5,
                      verticalAlign: 'text-bottom',
                      animation: 'blink 0.7s infinite',
                    }}
                  />
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Blinking cursor keyframes style */}
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}
      </style>
    </Box>
  )
}
