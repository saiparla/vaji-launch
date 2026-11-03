import React, { useMemo } from 'react'
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from '@mui/material'

export default function Layout({ children }) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#d32f2f',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#ffffff',
            contrastText: '#d32f2f',
          },
          background: {
            default: '#ffffff',
            paper: '#ffffff',
          },
          text: {
            primary: '#1a1a1a',
            secondary: '#555555',
          },
        },
        typography: {
          fontFamily: [
            "'Potti Sreeramulu'",
            "'Montserrat'",
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Gautami',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
        },
      }),
    []
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '@import': "url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Montserrat:wght@500;600;700;800;900&display=swap')",
          '@font-face': {
            fontFamily: 'Potti Sreeramulu',
            src: "url('/PottiSreeramulu-Regular.otf') format('opentype'), url('/Potti%20Sreeramulu%20Regular.otf') format('opentype')",
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontDisplay: 'swap',
          },
          '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
          },
          'html, body, #root': {
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            overflow: 'hidden',
          },
        }}
      />
      {children}
    </ThemeProvider>
  )
}
