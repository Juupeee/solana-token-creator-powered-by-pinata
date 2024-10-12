import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { Umi } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCluster } from "./useCluster";

const useUmi = (): Umi => {
  const wallet = useWallet();
  const { cluster } = useCluster();
  const umi = createUmi(cluster.endpoint)
    .use(mplTokenMetadata())
    .use(walletAdapterIdentity(wallet));

  return umi;
};

export default useUmi;
