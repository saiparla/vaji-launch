import React from 'react'
import StageCurtainPlayer from '../../src/components/StageCurtainPlayer.jsx'
import { navigate } from 'vike/client/router'

const BASE_URL = import.meta.env.BASE_URL

export default function Page() {
  const navigateToOverview = () => {
    try {
      navigate(`${BASE_URL}overview/`)
    } catch {
      window.location.href = `${BASE_URL}overview/`
    }
  }

  return <StageCurtainPlayer onNavigateToOverview={navigateToOverview} />
}

