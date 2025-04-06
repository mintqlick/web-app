import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import React from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#ffffff] overflow-auto">
      <Header />
      <HeroSection />
      <WhyChooseUs />
    </div>
  )
}


  

