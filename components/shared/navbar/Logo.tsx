/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 * @description: This file contains the Logo component for the M-Motors application.
 */

// ----- React & Next.js Imports -----
import Image from "next/image";
import Link from "next/link";
// ----- Image Imports -----
const logo = "/images/logo.png";

/**
 * M-Motors Logo Component
 *
 * This component renders the M-Motors logo, which consists of an image and the company name.
 */
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
      <Image
        src={logo}
        alt="M-Motors Logo"
        width={40}
        height={40}
        className="h-8 w-auto"
        priority
      />
      <span className="hidden sm:inline">M-Motors</span>
    </Link>
  );
}

export default Logo;
