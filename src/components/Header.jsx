"use client";

import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`top-0 left-0 w-full z-50 transition-all duration-300 h-[120px] flex items-center ${
        isSticky ? "fixed bg-white shadow-md" : "relative bg-[#EDF2FC]"
      }`}
    >
      <div className="max-w-screen-xl w-full mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="Logo" width={150} height={60} />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-x-8">
            <Link
              href="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-black"
            >
              <span>About</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-black"
            >
              <span>Investments</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-black"
            >
              <span>Support</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
            <button
              onClick={() => router.push("/sign-in")}
              className="px-4 py-2 text-[10px] w-[100px] h-[30px] border border-gray-800 rounded-full hover:bg-gray-100 transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/sign-up")}
              className="px-4 py-2 text-[10px] w-[100px] h-[30px] bg-[#1860d9] text-white rounded-full hover:bg-[#164cb5] transition"
            >
              Open Account
            </button>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed top-[125px] right-4 w-1/2 h-[300px] px-6 bg-white pb-6 space-y-4 rounded-2xl shadow-md z-50"
          style={{ animation: "fadeIn 0.3s ease" }}
        >
          <Link
            href="#"
            className="block text-gray-700 text-base hover:text-blue-600 transition duration-200"
          >
            About
          </Link>
          <Link
            href="#"
            className="block text-gray-700 text-base hover:text-blue-600 transition duration-200"
          >
            Investments
          </Link>
          <Link
            href="#"
            className="block text-gray-700 text-base hover:text-blue-600 transition duration-200"
          >
            Support
          </Link>
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full border border-gray-800 rounded-full py-2 text-sm hover:bg-gray-100 transition duration-200"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/sign-up")}
            className="w-full bg-[#1860d9] text-white rounded-full py-2 text-sm hover:bg-[#164cb5] transition duration-200"
          >
            Open Account
          </button>
        </div>
      )}
    </header>
  );
}
