"use client";
import { CheckCheck, CopyIcon } from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import _ from "lodash";

interface CopyButtonProps {
  text: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = React.memo(
  ({ text, className = "" }) => {
    const [copied, setCopied] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const { copy } = useCopyToClipboard();

    const handleCopy = useCallback(() => {
      const throttledCopy = _.throttle(() => {
        try {
          copy(text);
          setCopied(true);
          toast.success("Copied to clipboard");
          _.delay(() => setCopied(false), 1500);
        } catch (error) {
          console.error("Failed to copy text:", error);
          toast.error("Failed to copy text");
        }
      }, 300);
      throttledCopy();
    }, [text, copy]);

    const iconComponent = useMemo(
      () =>
        copied ? (
          <CheckCheck className="h-4 w-4 min-w-fit text-green-500" />
        ) : (
          <CopyIcon size={16} className="min-w-fit" />
        ),
      [copied],
    );

    const handleMouseEnter = useCallback(() => {
      _.debounce(() => setShowTooltip(true), 100)();
    }, []);

    const handleMouseLeave = useCallback(() => {
      _.debounce(() => setShowTooltip(false), 100)();
    }, []);

    return (
      <TooltipProvider>
        <Tooltip open={showTooltip}>
          <TooltipTrigger asChild>
            <div
              className={`${className} cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 active:scale-90`}
              onClick={handleCopy}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="transition-opacity duration-200 ease-in-out">
                {iconComponent}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={10}>
            {copied ? "Copied!" : "Copy to clipboard"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

CopyButton.displayName = "CopyButton";

export default CopyButton;
