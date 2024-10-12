"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import Marquee from "@/components/ui/marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFiles, listFiles, TokenMetadata } from "@/lib/pinata";

const TokenCard: React.FC<TokenMetadata> = React.memo(
  ({ image, name, symbol }) => (
    <Card className="group w-72 overflow-hidden transition-all duration-300 hover:bg-accent hover:shadow-xl">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <Avatar className="group-hover:animate-float h-14 w-14 ring-2 ring-primary ring-offset-2 transition-all duration-300">
            <AvatarImage src={image} alt={`${name} logo`} />
            <AvatarFallback className="bg-primary text-lg font-bold text-primary-foreground">
              {_.take(symbol, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="gradient-text text-base font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{symbol}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Badge variant="secondary" className="animate-pulse text-xs">
            New Token
          </Badge>
        </div>
      </CardContent>
    </Card>
  ),
);

TokenCard.displayName = "TokenCard";

const SkeletonCard: React.FC = React.memo(() => (
  <Card className="w-72 overflow-hidden">
    <CardContent className="p-5">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 animate-pulse rounded-full bg-muted" />
        <div className="flex flex-col space-y-2">
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <div className="h-6 w-20 animate-pulse rounded bg-muted" />
      </div>
    </CardContent>
  </Card>
));

SkeletonCard.displayName = "SkeletonCard";

const fetchTokens = async () => {
  const files = await listFiles();
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentFiles = _.filter(
    files,
    (file) => new Date(file.date_pinned).getTime() >= oneWeekAgo,
  );
  const metadataHashes = _.map(recentFiles, "ipfs_pin_hash");
  return getFiles(metadataHashes);
};

const RunningTokens: React.FC = () => {
  const {
    data: tokens = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
  });

  const displayTokens = useMemo(
    () => (isLoading ? _.fill(Array(6), null) : tokens),
    [isLoading, tokens],
  );

  const [firstRow, secondRow] = useMemo(
    () => _.chunk(displayTokens, Math.ceil(displayTokens.length / 2)),
    [displayTokens],
  );

  if (error) return <div>Error loading tokens</div>;

  if (!isLoading && _.isEmpty(tokens)) return null;

  const renderTokens = (row: TokenMetadata[], isFirst: boolean) =>
    _.map(row, (token, index) =>
      isLoading ? (
        <SkeletonCard key={`skeleton-${isFirst ? "1" : "2"}-${index}`} />
      ) : (
        <TokenCard
          key={`token-${isFirst ? "1" : "2"}-${token.symbol}`}
          {...token}
        />
      ),
    );

  return (
    <div className="relative flex h-[350px] w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-background shadow-inner">
      <Marquee pauseOnHover className="[--duration:30s]">
        {renderTokens(firstRow, true)}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {renderTokens(secondRow, false)}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background via-background/70 to-transparent" />
    </div>
  );
};

export default React.memo(RunningTokens);
