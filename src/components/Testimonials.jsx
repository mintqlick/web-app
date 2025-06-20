import React from 'react'
import Image from 'next/image'

const Testimonials = () => {
  return (
    <div className="w-full h-auto max-w-7xl bg-white overflow-hidden mt-[128px] mx-auto px-4">
      <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800 text-center mb-8">
        Testimonials
      </h2>

      <div className="w-full flex items-center justify-center bg-gray-200 rounded-2xl p-6 mt-6">
        <div className="flex flex-col lg:flex-row items-center w-full gap-8">
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="/images/Testimonial.png"
              alt="Hero"
              width={500}
              height={200}
              className="rounded-lg object-contain max-w-full h-auto"
            />
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="text-xl md:text-2xl font-semibold text-black">
              Received my first contribution payout in 7 days
            </h3>
            <p className="mt-4 text-base md:text-lg text-gray-600 max-w-xl">
            “I joined with a simple contribution, and in 7 days, the community supported me back. The system works!”
            – Verified Member, Estonia 

            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
