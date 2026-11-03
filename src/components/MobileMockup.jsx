import React from 'react'
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'

export default function MobileMockup({
  imageSrc = '/vajione-app-screen.jpg',
  tilt = 'right',
  deviceStyle = 'iphone',
  altText = 'VajiOne App Screenshot',
  showPoweredBy = true,
  poweredByLogo = '/Hippo_Logo_Black.png',
}) {
  const tiltDeg = tilt === 'right' ? 6 : -6

  const deviceConfig = {
    iphone: {
      frameBorderRadius: '12px',
      screenBorderRadius: '10px',
      notchWidth: '38%',
      notchHeight: '16px',
      buttonStyles: {
        power: { top: '75px', height: '32px' },
        volume: { top: ['60px', '95px'], height: '26px' },
      },
      frameGradient: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0d0d0d 100%)',
      dynamicIsland: true,
    },
    android: {
      frameBorderRadius: '12px',
      screenBorderRadius: '10px',
      notchWidth: '22%',
      notchHeight: '10px',
      buttonStyles: {
        power: { top: '78px', height: '35px' },
        volume: { top: ['62px', '98px'], height: '24px' },
      },
      frameGradient: 'linear-gradient(145deg, #1f1f1f 0%, #151515 100%)',
      dynamicIsland: false,
    },
  }

  const config = deviceConfig[deviceStyle] || deviceConfig.iphone

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, x: 80, rotate: tiltDeg - 4, scale: 0.85 }}
        animate={{
          opacity: 1,
          x: 0,
          rotate: tiltDeg,
          scale: 1,
          y: [0, -10, 0],
        }}
        transition={{
          opacity: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
          x: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
          rotate: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.85 },
        }}
        whileHover={{ scale: 1.04, rotate: tiltDeg * 0.5 }}
      >
        {/* Device Chassis */}
        <Box
          sx={{
            position: 'relative',
            width: { xs: 155, sm: 180, md: 205, lg: 220 },
            height: { xs: 300, sm: 350, md: 400, lg: 430 },
            borderRadius: config.frameBorderRadius,
            background: config.frameGradient,
            boxShadow: `
              0 28px 55px rgba(0,0,0,0.45),
              0 10px 22px rgba(0,0,0,0.25),
              inset 0 1px 2px rgba(255,255,255,0.18),
              ${tilt === 'right' ? '12px' : '-12px'} 20px 40px rgba(0,0,0,0.3)
            `,
            p: '8px',
          }}
        >
          {/* Side Power Button */}
          <Box
            sx={{
              position: 'absolute',
              right: '-3px',
              top: config.buttonStyles.power.top,
              width: '3px',
              height: config.buttonStyles.power.height,
              background: '#1a1a1a',
              borderRadius: '0 2px 2px 0',
            }}
          />

          {/* Volume Buttons */}
          {config.buttonStyles.volume.top.map((top, idx) => (
            <Box
              key={idx}
              sx={{
                position: 'absolute',
                left: '-3px',
                top: top,
                width: '3px',
                height: config.buttonStyles.volume.height,
                background: '#1a1a1a',
                borderRadius: '2px 0 0 2px',
              }}
            />
          ))}

          {/* Screen Wrapper */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: config.screenBorderRadius,
              background: '#000',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Top Notch / Dynamic Island */}
            {config.dynamicIsland ? (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: config.notchWidth,
                  height: config.notchHeight,
                  background: '#000',
                  borderRadius: '0 0 16px 16px',
                  zIndex: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <Box sx={{ width: '6px', height: '6px', background: '#1a1a1a', borderRadius: '50%' }} />
                <Box sx={{ width: '3px', height: '3px', background: '#1a1a1a', borderRadius: '50%' }} />
              </Box>
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  top: '6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '22px',
                  height: '22px',
                  background: '#000',
                  borderRadius: '50%',
                  zIndex: 100,
                }}
              />
            )}

            {/* Inner App Screenshot Content */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                pt: config.dynamicIsland ? '16px' : '10px',
                overflow: 'hidden',
                position: 'relative',
                bgcolor: '#FFFDF5',
              }}
            >
              {imageSrc ? (
                <Box
                  component="img"
                  src={imageSrc}
                  alt={altText}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(160deg, #FFF9E6 0%, #FFFDF5 100%)',
                    color: '#5C5A3C',
                    fontSize: '10px',
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  VajiOne App Screenshot
                </Box>
              )}

              {/* Powered by Hippo Clouds Footer inside the mobile mockup directly */}
              {showPoweredBy && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.85) 70%, rgba(255,255,255,0) 100%)',
                    backdropFilter: 'blur(6px)',
                    pt: 1.6,
                    pb: '14px',
                    px: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    zIndex: 90,
                    pointerEvents: 'none',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: { xs: '7.5px', sm: '8.5px', md: '9px' },
                      fontWeight: 700,
                      color: '#222222',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                    }}
                  >
                    Powered by
                  </Typography>
                  <Box
                    component="img"
                    src={poweredByLogo}
                    alt="Hippo Clouds"
                    sx={{
                      height: { xs: '12px', sm: '14px', md: '16px' },
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Bottom Bar indicator */}
          {deviceStyle === 'iphone' && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '38%',
                height: '3px',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '2px',
                zIndex: 100,
              }}
            />
          )}

          {/* Screen Light Sheen Reflection */}
          <Box
            sx={{
              position: 'absolute',
              inset: '7px',
              borderRadius: config.screenBorderRadius,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />
        </Box>

        {/* Soft Drop Shadow Below Phone */}
        <Box
          sx={{
            width: '70%',
            height: '20px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, transparent 70%)',
            mx: 'auto',
            mt: 0.8,
            borderRadius: '50%',
          }}
        />
      </motion.div>
    </Box>
  )
}

