import React from "react";
import { ThemeProvider } from "next-themes";
import WalletProvider from "./wallet-provider";
import { ClusterProvider } from "@/hooks/useCluster";
import QueryProvider from "./query-provider";
import { Toaster } from "../ui/sonner";
import { TooltipProvider } from "../ui/tooltip";
import ModalProvider from "./modal-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <TooltipProvider delayDuration={0}>
        <ClusterProvider>
          <WalletProvider>
            <QueryProvider>
              <ModalProvider>{children}</ModalProvider>
            </QueryProvider>
          </WalletProvider>
        </ClusterProvider>
      </TooltipProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
};

export default Providers;
