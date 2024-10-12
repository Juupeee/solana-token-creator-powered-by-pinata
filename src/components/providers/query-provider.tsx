"use client";

import React from "react";
import {
  QueryClientProvider,
  QueryClient,
  QueryClientConfig,
} from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
  config?: QueryClientConfig;
}

const defaultQueryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
      retry: false,
      refetchInterval: 1000 * 60 * 60, // 1 hour
    },
  },
};

const QueryProvider = ({
  children,
  config = defaultQueryConfig,
}: QueryProviderProps) => {
  const [client] = React.useState(() => new QueryClient(config));

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default React.memo(QueryProvider);
