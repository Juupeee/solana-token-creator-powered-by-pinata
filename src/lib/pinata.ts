"use server";

import { PinataSDK } from "pinata-web3";

export interface TokenMetadata {
  name: string;
  symbol: string;
  description?: string;
  image: string;
}

interface UploadImage {
  type: "file" | "url";
  image: string;
  tokenMetadata?: TokenMetadata;
}

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY!,
});

const GATEWAY_URL = "https://gateway.pinata.cloud/ipfs/";

export const uploadMetadata = async (metadata: TokenMetadata) => {
  const res = await pinata.upload
    .json(metadata)
    .cidVersion(1)
    .addMetadata({
      name: `${metadata.symbol}-metadata-${Date.now()}`,
    })
    .group(process.env.PINATA_GROUP_METADATA_ID!);
  return `${GATEWAY_URL}${res.IpfsHash}`;
};

export const uploadImage = async ({
  type,
  image,
  tokenMetadata,
}: UploadImage) => {
  const uploadMethod = type === "file" ? "base64" : "url";
  const res = await pinata.upload[uploadMethod](image)
    .cidVersion(1)
    .addMetadata({
      name: `${tokenMetadata?.symbol}-logo-${Date.now()}`,
    })
    .group(process.env.PINATA_GROUP_IMAGE_ID!);

  return {
    ...tokenMetadata,
    image: `${GATEWAY_URL}${res.IpfsHash}`,
  };
};

export const listFiles = async () => {
  const res = await pinata.listFiles();
  return res.filter((file) => file.mime_type === "application/json");
};

export const getFile = async (hash: string) => {
  const res = await fetch(`${GATEWAY_URL}${hash}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch file");
  return res.json();
};

export const getFiles = async (hashes: string[]) => {
  const promises = hashes.map((hash) => getFile(hash));
  return Promise.all(promises);
};
