import React from 'react'

function Background() {
  return (
    <div>
      <div
        className={`area bg-gradient-to-l from-[#4e54c8] to-[#8f94fb] dark:bg-gradient-to-l dark:from-[#3e3e3e] dark:to-[#1d1d1d] transition-colors duration-500`}
      >
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  )
}

export default Background