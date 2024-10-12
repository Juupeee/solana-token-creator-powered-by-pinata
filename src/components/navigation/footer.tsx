"use client";

import React, { useMemo, useEffect, useState } from "react";
import { HeartIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

const Footer: React.FC = React.memo(() => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pinataLogo = useMemo(() => {
    return theme === "dark" ? "/logo/pinata.svg" : "/logo/pinata_black.svg";
  }, [theme]);

  if (!mounted) return null;

  return (
    <footer className="bg-background py-4 text-sm text-muted-foreground">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} Solana Token Creator. All rights reserved.</p>
        <div className="mt-2 flex items-center justify-center">
          <span>Made with</span>
          <HeartIcon className="mx-1 h-4 w-4 text-red-500" />
          <span>powered by</span>
          <Link
            href="https://www.pinata.cloud/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 flex items-center font-bold hover:underline"
          >
            <Image
              src={pinataLogo}
              alt="Pinata"
              width={80}
              height={10}
              priority={false}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
