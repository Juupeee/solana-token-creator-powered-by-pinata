"use client";

import React, { useEffect, useCallback, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import {
  ArrowLeftRight,
  ClipboardCopy,
  LogOut,
  Wallet2Icon,
} from "lucide-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Skeleton } from "../ui/skeleton";
import useElipsis from "@/hooks/useElipsis";
import { toast } from "sonner";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

const WalletButton: React.FC = () => {
  const { publicKey, connected, wallet, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { makeElipsis } = useElipsis();
  const { copy } = useCopyToClipboard();
  const [mounted, setMounted] = useState(false);
  const toastDuration = 1000;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    if (publicKey) {
      disconnect();
      toast.success("Disconnected from wallet", { duration: toastDuration });
    }
  }, [disconnect, publicKey]);

  const handleCopy = useCallback(() => {
    if (publicKey) {
      copy(publicKey.toBase58());
      toast.success("Copied to clipboard", { duration: toastDuration });
    }
  }, [copy, publicKey]);

  const handleConnect = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const dropdownMenuItems = useMemo(
    () => [
      { onClick: handleCopy, icon: ClipboardCopy, label: "Copy Address" },
      { onClick: handleConnect, icon: ArrowLeftRight, label: "Change Wallet" },
      { onClick: handleDisconnect, icon: LogOut, label: "Disconnect" },
    ],
    [handleCopy, handleConnect, handleDisconnect],
  );

  const buttonContent = useMemo(
    () => (
      <>
        {wallet?.adapter.icon && (
          <Image
            src={wallet.adapter.icon}
            alt="wallet icon"
            width={20}
            height={20}
          />
        )}
        <p className="text-xs font-medium sm:text-sm">
          {makeElipsis(publicKey?.toBase58() ?? "", 4, 4, 10)}
        </p>
      </>
    ),
    [wallet, publicKey, makeElipsis],
  );

  const connectedButton = useMemo(
    () => (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            aria-label="Wallet options"
          >
            {buttonContent}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <nav aria-label="Wallet options">
            <ul role="menu">
              {dropdownMenuItems.map(({ onClick, icon: Icon, label }) => (
                <li key={label} role="none">
                  <DropdownMenuItem
                    onClick={onClick}
                    className="flex cursor-pointer items-center gap-2"
                    role="menuitem"
                  >
                    <Icon className="h-5 w-5 min-w-fit" aria-hidden="true" />
                    <span>{label}</span>
                  </DropdownMenuItem>
                </li>
              ))}
            </ul>
          </nav>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [buttonContent, dropdownMenuItems],
  );

  const disconnectedButton = useMemo(
    () => (
      <Button
        className="flex items-center space-x-2"
        onClick={handleConnect}
        aria-label="Connect wallet"
      >
        <Wallet2Icon className="h-4 w-4" aria-hidden="true" />
        <span>Connect Wallet</span>
      </Button>
    ),
    [handleConnect],
  );

  if (!mounted) {
    return (
      <Skeleton className="h-[36px] w-[120px] rounded-lg" aria-hidden="true" />
    );
  }

  return connected ? connectedButton : disconnectedButton;
};

export default React.memo(WalletButton);
