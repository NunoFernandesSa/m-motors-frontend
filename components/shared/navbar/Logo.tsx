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
    <Link href="/" className="font-bold text-xl text-blue-600">
      M-Motors
    </Link>
  );
}

export default Logo;
