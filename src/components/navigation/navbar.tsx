"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CoinsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import SettingsButton from "../buttons/settings-button";

const ThemeButton = dynamic(() => import("@/components/buttons/theme-button"), {
  ssr: false,
});

const WalletButton = dynamic(
  () => import("@/components/buttons/wallet-button"),
  {
    ssr: false,
  },
);

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-background/80 shadow-md backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <Navigation />
        </div>
      </div>
    </header>
  );
};

const Logo: React.FC = () => (
  <Link
    href="/"
    className="flex flex-shrink-0 items-center gap-2 transition-colors hover:text-primary"
  >
    <CoinsIcon size={28} className="text-primary" aria-hidden="true" />
    <span className="hidden text-xl font-bold sm:block">
      Solana Token Creator
    </span>
  </Link>
);

const Navigation: React.FC = () => (
  <nav className="flex items-center space-x-3" aria-label="Main navigation">
    <ThemeButton />
    <SettingsButton />
    <WalletButton />
  </nav>
);

export default React.memo(Navbar);
