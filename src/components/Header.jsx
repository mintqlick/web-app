 'use client'
 
import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`top-0 left-0 w-full z-50 transition-all duration-300 h-[120px] flex items-center ${
        isSticky ? 'fixed bg-white shadow-md' : 'relative bg-[#EDF2FC]'
      } ${isSticky ? 'pt-16' : ''}`} // Add top padding when sticky
    >
      <div className="max-w-screen-xl w-full mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="Logo" width={150} height={60} />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-x-8">
            <Link href="#" className="flex items-center space-x-1 text-gray-700 hover:text-black">
              <span>About</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link href="#" className="flex items-center space-x-1 text-gray-700 hover:text-black">
              <span>Investments</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link href="#" className="flex items-center space-x-1 text-gray-700 hover:text-black">
              <span>Support</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
            <button className="px-4 py-2 w-[100px] h-[30px] text-[10px] border border-gray-800 rounded-full hover:bg-gray-100">
              Login
            </button>
            <button className="px-4 py-2 w-[100px] h-[30px] text-[10px] bg-[#1860d9] text-white rounded-full">
              Open Account
            </button>
          </nav>

          {/* Mobile toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden w-full px-6 bg-white pb-4 mt-2 space-y-2">
          <Link href="#" className="block text-gray-700">About</Link>
          <Link href="#" className="block text-gray-700">Investments</Link>
          <Link href="#" className="block text-gray-700">Support</Link>
          <button className="w-full border border-gray-800 rounded-full py-2">Login</button>
          <button className="w-full bg-black text-white rounded-full py-2">Open Account</button>
        </div>
      )}
    </header>
  );
}
