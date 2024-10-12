"use client";

import { WalletError } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import React, { useMemo, useCallback } from "react";
import {
  PhantomWalletAdapter,
  SafePalWalletAdapter,
  MathWalletAdapter,
  ParticleAdapter,
  HuobiWalletAdapter,
  NekoWalletAdapter,
  OntoWalletAdapter,
  SpotWalletAdapter,
  BitgetWalletAdapter,
  BitpieWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  LedgerWalletAdapter,
  SalmonWalletAdapter,
  SolongWalletAdapter,
  TrezorWalletAdapter,
  CoinhubWalletAdapter,
  FractalWalletAdapter,
  KrystalWalletAdapter,
  NightlyWalletAdapter,
  HyperPayWalletAdapter,
  KeystoneWalletAdapter,
  TokenPocketWalletAdapter,
  AlphaWalletAdapter,
  AvanaWalletAdapter,
  CoinbaseWalletAdapter,
  NufiWalletAdapter,
  SaifuWalletAdapter,
  SkyWalletAdapter,
  SolflareWalletAdapter,
  TokenaryWalletAdapter,
  TorusWalletAdapter,
  TrustWalletAdapter,
  XDEFIWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";
import { useCluster } from "@/hooks/useCluster";
import { toast } from "sonner";

interface SolanaProviderProps {
  children: React.ReactNode;
}

const walletAdapters = [
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  TrustWalletAdapter,
  CoinbaseWalletAdapter,
  BitgetWalletAdapter,
  TrezorWalletAdapter,
  Coin98WalletAdapter,
  TorusWalletAdapter,
  SolongWalletAdapter,
  MathWalletAdapter,
  SafePalWalletAdapter,
  BitpieWalletAdapter,
  AlphaWalletAdapter,
  NightlyWalletAdapter,
  SalmonWalletAdapter,
  CloverWalletAdapter,
  TokenPocketWalletAdapter,
  HuobiWalletAdapter,
  ParticleAdapter,
  NekoWalletAdapter,
  OntoWalletAdapter,
  SpotWalletAdapter,
  CoinhubWalletAdapter,
  FractalWalletAdapter,
  KrystalWalletAdapter,
  HyperPayWalletAdapter,
  KeystoneWalletAdapter,
  AvanaWalletAdapter,
  NufiWalletAdapter,
  SaifuWalletAdapter,
  SkyWalletAdapter,
  TokenaryWalletAdapter,
  XDEFIWalletAdapter,
] as const;

const WalletProvider: React.FC<SolanaProviderProps> = ({ children }) => {
  const { cluster } = useCluster();
  const endpoint = useMemo(() => cluster.endpoint, [cluster]);
  const onError = useCallback((error: WalletError) => {
    toast.error("Error connecting to wallet: " + error);
  }, []);

  const wallets = useMemo(
    () => walletAdapters.map((Adapter) => new Adapter()),
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={true}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
