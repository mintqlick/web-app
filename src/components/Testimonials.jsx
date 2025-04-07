import React from 'react'
import Image from 'next/image'

const Testimonials = () => {
  return (
    <div className="w-full h-auto max-w-7xl bg-white overflow-hidden mt-[128px] mx-auto">
  <h2 className="text-3xl lg:text-6xl font-bold text-gray-800 text-center mb-8">
           Testimonials
  </h2>
   <div className="w-full flex items-center justify-center bg-gray-200 rounded-2xl p-6 mt-6">
          <div className="flex flex-col lg:flex-row w-full">
          <div className="w-full lg:w-1/2 flex justify-center">
              <Image
                src="/images/Testimonial.png"
                alt="Hero"
                width={500}
                height={200}
                className="rounded-lg object-contain max-w-full h-auto"
              />
            </div>
            <div className="w-full lg:w-1/2 justify-center items-center">
              <h3  className="text-3xl  text-black flex items-center">Received my first payment in 7 days</h3>
              <p className="mt-4 text-lg text-gray-400">
                Get merged to pay or received payments within 24-48 hours,
                ensuring a smooth an reliable transaction process.
                Get merged to pay or received payments within 24-48 hours,
                ensuring a smooth an reliable transaction process.
              </p>
            </div>
            
          </div>
        </div>
</div>


  )
}

export default Testimonials