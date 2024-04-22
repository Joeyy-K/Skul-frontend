import React from 'react'
import Background from './Background'

function AppWrapper({ children }) {
  return (
    <div className="relative h-screen">
      <Background />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default AppWrapper