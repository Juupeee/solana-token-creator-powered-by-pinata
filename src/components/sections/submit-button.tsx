import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubmitButtonProps {
  isCreating: boolean;
  connected: boolean;
  onSubmit: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = React.memo(
  ({ isCreating, connected, onSubmit }) => {
    const tooltipContent = useMemo(
      () =>
        !connected
          ? "Connect your wallet to create a token"
          : "Click to create your Solana token",
      [connected],
    );

    const buttonContent = useMemo(
      () => (
        <>
          {isCreating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Create Token
        </>
      ),
      [isCreating],
    );

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              disabled={isCreating || !connected}
              className="w-full"
              onClick={onSubmit}
            >
              {buttonContent}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

SubmitButton.displayName = "SubmitButton";
