import { useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { TokenMetadata, uploadImage, uploadMetadata } from "@/lib/pinata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import useUmi from "@/hooks/useUmi";
import {
  createAndMint,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  toWeb3JsInstruction,
  toWeb3JsKeypair,
} from "@metaplex-foundation/umi-web3js-adapters";
import { TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { useConfirmationStatus } from "@/hooks/useConfirmationStatus";
import _ from "lodash";

interface CreateTokenParams {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  logoType: "file" | "url";
  logoFile?: File;
  logoUrl?: string;
  description?: string;
}

const useCreateSplToken = (
  onSuccess?: (mintPublicKey: string, signature: string) => void,
) => {
  const [isCreating, setIsCreating] = useState(false);
  const { connected, publicKey, sendTransaction } = useWallet();
  const umi = useUmi();
  const { connection } = useConnection();
  const { Confirmed, Finalized } = useConfirmationStatus();

  const createTokenDebounced = _.debounce(async (params: CreateTokenParams) => {
    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsCreating(true);
    const toastId = toast.loading("Initiating token creation...");

    try {
      toast.loading("Processing logo...", { id: toastId });
      const base64Image =
        params.logoType === "file" && params.logoFile
          ? await imageToBase64(params.logoFile)
          : params.logoUrl;

      const metadata: TokenMetadata = _.pick(params, [
        "name",
        "symbol",
        "description",
      ]) as TokenMetadata;
      metadata.image = base64Image as string;

      toast.loading("Uploading image to IPFS...", { id: toastId });
      const res = await uploadImage({
        type: params.logoType,
        image: base64Image as string,
        tokenMetadata: metadata,
      });

      toast.loading("Uploading metadata to IPFS...", { id: toastId });
      const metadataUri = await uploadMetadata(res as TokenMetadata);

      toast.loading("Preparing transaction...", { id: toastId });
      const mint = generateSigner(umi);
      const createAndMintIx = createAndMint(umi, {
        mint,
        authority: umi.identity,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadataUri,
        sellerFeeBasisPoints: percentAmount(0),
        decimals: params.decimals,
        amount: BigInt(params.supply) * BigInt(10 ** params.decimals),
        tokenOwner: umi.identity.publicKey,
        tokenStandard: TokenStandard.Fungible,
      });

      const instructions = _.map(
        createAndMintIx.getInstructions(),
        toWeb3JsInstruction,
      );

      const latestBlockhash = await connection.getLatestBlockhash();
      const messageV0 = new TransactionMessage({
        payerKey: publicKey!,
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
      }).compileToV0Message();

      const tx = new VersionedTransaction(messageV0);

      tx.sign([toWeb3JsKeypair(mint)]);

      toast.loading("Sending transaction...", { id: toastId });
      const txSignature = await sendTransaction(tx, connection);

      toast.loading("Confirming transaction...", { id: toastId });
      const confirmTx = await connection.confirmTransaction(
        { signature: txSignature, ...latestBlockhash! },
        Confirmed ? "confirmed" : Finalized ? "finalized" : "confirmed",
      );

      if (_.get(confirmTx, "value.err")) {
        throw new Error("Transaction failed");
      }

      toast.success("Token created successfully!", { id: toastId });
      if (onSuccess) {
        onSuccess(mint.publicKey.toString(), txSignature);
      }
      return {
        mintPublicKey: mint.publicKey.toString(),
        signature: txSignature,
      };
    } catch (error: unknown) {
      console.error("Error in createToken:", error);
      toast.error(_.get(error, "message", "Something went wrong"), {
        id: toastId,
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, 300);

  const createToken = useCallback(
    (params: CreateTokenParams) => createTokenDebounced(params),
    [createTokenDebounced],
  );

  return { createToken, isCreating };
};

const imageToBase64 = _.memoize((file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result.split(",")[1]);
      } else {
        reject(new Error("Failed to convert image to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
});

export default useCreateSplToken;
