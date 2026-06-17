/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ----- React & Next.js -----
import Image from "next/image";
import Link from "next/link";

/**
 * M-Motors Logo Component
 *
 * This component renders the M-Motors logo, which consists of an image and the company name.
 */
function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image src="/images/logo.png" alt="M-Motors" width={58} height={58} />
      <span className="text-3xl font-extrabold text-primary">M-Motors</span>
    </Link>
  );
}

export default Logo;
