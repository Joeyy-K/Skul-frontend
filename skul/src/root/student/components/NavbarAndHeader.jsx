import React, { useState } from 'react'
import Navbar from './Navbar'
import Header from './Header'

function NavbarAndHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header handleSidebar={handleSidebar} />
    </>
  )
}

export default NavbarAndHeader
