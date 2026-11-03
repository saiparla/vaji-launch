import React, { useState, useEffect, useMemo } from 'react'
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from '@mui/material'
import AVVideoPlayer from './components/AVVideoPlayer.jsx'
import StageCurtainPlayer from './components/StageCurtainPlayer.jsx'
import ChannelOverviewPlayer from './components/ChannelOverviewPlayer.jsx'

function App() {
  const BASE_URL = import.meta.env.BASE_URL

  const getCurrentRoute = () => {
    if (typeof window === 'undefined') return '/'
    const pathname = window.location.pathname
    const route = pathname.startsWith(BASE_URL)
      ? pathname.slice(BASE_URL.length)
      : pathname.slice(1)
    const normalizedRoute = route.endsWith('/') ? route.slice(0, -1) : route
    return normalizedRoute ? `/${normalizedRoute}` : '/'
  }

  const [currentPath, setCurrentPath] = useState(getCurrentRoute)

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentRoute())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#d32f2f',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#ffffff',
            contrastText: '#d32f2f',
          },
          background: {
            default: '#000000',
            paper: '#121212',
          },
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
          },
        },
        typography: {
          fontFamily: [
            "'Noto Sans Telugu'",
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Gautami',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
          button: {
            textTransform: 'none',
            fontWeight: 700,
          },
        },
      }),
    []
  )

  const navigateToStage = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `${BASE_URL}stage/`)
      setCurrentPath('/stage')
    }
  }

  const navigateToOverview = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `${BASE_URL}overview/`)
      setCurrentPath('/overview')
    }
  }

  const navigateToHome = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', BASE_URL)
      setCurrentPath('/')
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '@import': "url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Montserrat:wght@500;600;700;800;900&display=swap')",
          '@font-face': {
            fontFamily: 'Potti Sreeramulu',
            src: `url('${BASE_URL}PottiSreeramulu-Regular.otf') format('opentype'), url('${BASE_URL}Potti%20Sreeramulu%20Regular.otf') format('opentype')`,
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontDisplay: 'swap',
          },
          '*': { boxSizing: 'border-box', margin: 0, padding: 0 },
          'html, body, #root': {
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            overflow: 'hidden',
          },
        }}
      />
      {currentPath === '/overview' ? (
        <ChannelOverviewPlayer onBack={navigateToStage} />
      ) : currentPath === '/stage' ? (
        <StageCurtainPlayer onBack={navigateToHome} onNavigateToOverview={navigateToOverview} />
      ) : (
        <AVVideoPlayer onComplete={navigateToStage} />
      )}
    </ThemeProvider>
  )
}

export default App
