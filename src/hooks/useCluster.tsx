"use client";

import { Connection } from "@solana/web3.js";
import { create } from "zustand";
import React from "react";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import _ from "lodash";

export interface Cluster {
  name: string;
  endpoint: string;
  network?: ClusterNetwork;
  active?: boolean;
}

export enum ClusterNetwork {
  Mainnet = "mainnet-beta",
  Testnet = "testnet",
  Devnet = "devnet",
  Custom = "custom",
}

export const defaultClusters: readonly Cluster[] = [
  {
    name: "Mainnet",
    endpoint: process.env.NEXT_PUBLIC_ENDPOINT_HELIUS_MAINNET!,
    network: ClusterNetwork.Mainnet,
  },
  {
    name: "Devnet",
    endpoint: process.env.NEXT_PUBLIC_ENDPOINT_HELIUS_DEVNET!,
    network: ClusterNetwork.Devnet,
  },
] as const;

export type ExplorerProvider = "sol-scan" | "default";

interface ClusterStore {
  cluster: Cluster;
  clusters: Cluster[];
  defaultExplorerProvider: ExplorerProvider;
  setCluster: (cluster: Cluster) => void;
  setClusters: (clusters: Cluster[]) => void;
  setDefaultExplorerProvider: (provider: ExplorerProvider) => void;
}

const useClusterStore = create(
  persist<ClusterStore>(
    (set) => ({
      cluster: _.first(defaultClusters)!,
      clusters: [...defaultClusters],
      defaultExplorerProvider: "default" as const,
      setCluster: (cluster: Cluster) => set({ cluster }),
      setClusters: (clusters: Cluster[]) => set({ clusters }),
      setDefaultExplorerProvider: (provider: ExplorerProvider) =>
        set({ defaultExplorerProvider: provider }),
    }),
    {
      name: "cluster-storage",
    },
  ),
);

export interface ClusterProviderContext extends ClusterStore {
  addCluster: (cluster: Cluster) => void;
  deleteCluster: (cluster: Cluster) => void;
  getExplorerUrl: (
    path: string,
    provider?: ExplorerProvider,
  ) => { name: string; url: string };
}

const Context = React.createContext<ClusterProviderContext | undefined>(
  undefined,
);

export function ClusterProvider({ children }: { children: React.ReactNode }) {
  const {
    cluster,
    clusters,
    defaultExplorerProvider,
    setCluster,
    setClusters,
    setDefaultExplorerProvider,
  } = useClusterStore();

  const value: ClusterProviderContext = React.useMemo(
    () => ({
      cluster,
      clusters: _.sortBy(clusters, "name"),
      defaultExplorerProvider,
      setCluster,
      setClusters,
      setDefaultExplorerProvider,
      addCluster: _.debounce((newCluster: Cluster) => {
        try {
          new Connection(newCluster.endpoint);
          setClusters(_.concat(clusters, newCluster));
        } catch (err) {
          toast.error(`${err}`);
        }
      }, 300),
      deleteCluster: (clusterToDelete: Cluster) => {
        setClusters(_.reject(clusters, ["name", clusterToDelete.name]));
      },
      getExplorerUrl: (path: string, provider?: ExplorerProvider) => {
        const selectedProvider = provider || defaultExplorerProvider;
        const baseUrl = _.cond([
          [_.matches("sol-scan"), _.constant("https://solscan.io")],
          [_.stubTrue, _.constant("https://explorer.solana.com")],
        ])(selectedProvider);
        return {
          name: selectedProvider,
          url: `${baseUrl}/${path}${getClusterUrlParam(cluster)}`,
        };
      },
    }),
    [
      cluster,
      clusters,
      defaultExplorerProvider,
      setCluster,
      setClusters,
      setDefaultExplorerProvider,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useCluster = (): ClusterProviderContext => {
  const context = React.useContext(Context);
  if (_.isUndefined(context)) {
    throw new Error("useCluster must be used within a ClusterProvider");
  }
  return context;
};

function getClusterUrlParam(cluster: Cluster): string {
  const suffixMap: Record<ClusterNetwork, string> = {
    [ClusterNetwork.Devnet]: "devnet",
    [ClusterNetwork.Mainnet]: "",
    [ClusterNetwork.Testnet]: "testnet",
    [ClusterNetwork.Custom]: `custom&customUrl=${encodeURIComponent(cluster.endpoint)}`,
  };

  const suffix = _.get(suffixMap, cluster.network || ClusterNetwork.Custom, "");
  return suffix ? `?cluster=${suffix}` : "";
}
