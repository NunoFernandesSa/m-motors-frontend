/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ----- React & Next.js -----
import Link from "next/link";

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
