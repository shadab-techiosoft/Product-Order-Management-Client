import React from 'react'
import Header from './Layouts/Header'
import HeroSection from "./Layouts/HeroSection"
const Hero = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-50">
      <Header/>
      <HeroSection/>
        </div>
    </div>
  )
}

export default Hero