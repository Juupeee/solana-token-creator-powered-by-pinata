"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useCluster } from "@/hooks/useCluster";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import CopyButton from "@/components/buttons/copy-button";

interface ExplorerLinkProps {
  address: string;
  type: "token" | "tx" | "account";
  isEllipsis?: boolean;
  sizeEllipsis?: number;
  className?: string;
}

const ExplorerLink: React.FC<ExplorerLinkProps> = React.memo(
  ({ address, type, isEllipsis = false, sizeEllipsis = 4, className = "" }) => {
    const { getExplorerUrl } = useCluster();
    const [link, setLink] = useState<string>("");

    const getPath = useCallback(
      (providerName: string) => {
        if (
          providerName === "default" &&
          (type === "account" || type === "token")
        ) {
          return "address";
        }
        return type;
      },
      [type],
    );

    useEffect(() => {
      const checkProvider = getExplorerUrl(address);
      const path = getPath(checkProvider.name);
      const { url } = getExplorerUrl(`${path}/${address}`);
      setLink(url);
    }, [address, getExplorerUrl, getPath]);

    const displayAddress = useMemo(() => {
      if (isEllipsis) {
        return `${address.slice(0, sizeEllipsis)}..${address.slice(-sizeEllipsis)}`;
      }
      return address;
    }, [address, isEllipsis, sizeEllipsis]);

    return (
      <div className={`flex flex-row items-center gap-1 ${className}`}>
        <CopyButton text={address} />
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {displayAddress}
        </Link>
        <ExternalLink className="h-4 w-4 min-w-fit" />
      </div>
    );
  },
);

ExplorerLink.displayName = "ExplorerLink";

export default ExplorerLink;
