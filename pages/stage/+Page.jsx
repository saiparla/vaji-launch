import React from 'react'
import StageCurtainPlayer from '../../src/components/StageCurtainPlayer.jsx'
import { navigate } from 'vike/client/router'

export default function Page() {
  const navigateToOverview = () => {
    try {
      navigate('/overview')
    } catch {
      window.location.href = '/overview'
    }
  }

  return <StageCurtainPlayer onNavigateToOverview={navigateToOverview} />
}

