"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ----- React/Next -----
import { useState, useEffect, useRef } from "react";
// ----- Icons -----
import { Menu, X } from "lucide-react";
// ----- Components -----
import Logo from "./Logo";
import NavLinks from "./NavLinks";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setIsMenuOpen(false);

  // click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // resize to close menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) closeMenu();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />

        <div className="hidden md:flex md:items-center md:gap-6">
          <NavLinks onClose={closeMenu} />
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg p-4 flex flex-col gap-3 z-40"
        >
          <NavLinks onClose={closeMenu} />
        </div>
      )}
    </nav>
  );
}
