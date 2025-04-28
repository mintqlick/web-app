'use client'

import { Bell } from 'lucide-react'
import Image from 'next/image'

export default function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full flex justify-center pointer-events-none">
      <div className="w-full max-w-[95%] mt-4 mx-4 rounded-2xl bg-[#EDF2FC] shadow-md h-[70px] px-8 md:px-6 flex items-center justify-between pointer-events-auto">
        {/* Logo Section */}
        <div className="flex items-center">
          <Image
            src="/images/logo31.png"
            alt="Logo"
            width={90}
            height={45}
            className="md:w-[100px] md:h-[50px] lg:w-[220px] lg:h-[80px] object-contain"
          />
        </div>

        {/* Right Side (Notification + User) */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Notification Bell */}
          <div className="relative bg-white p-2 rounded-full shadow-md">
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] md:text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </div>

          {/* Username + Avatar */}
          <div className="flex items-center gap-2">
            {/* Username hidden on small screens */}
            <span className="hidden sm:inline text-xs md:text-sm font-medium text-gray-800">
              John Doe
            </span>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs md:text-sm font-bold text-white">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
