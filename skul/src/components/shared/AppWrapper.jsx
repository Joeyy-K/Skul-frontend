import React from 'react'
import Background from './Background'

function AppWrapper({ children }) {
  return (
    <div className="h-screen">
      <Background />
      <div className="z-10">{children}</div>
    </div>
  )
}

export default AppWrapper