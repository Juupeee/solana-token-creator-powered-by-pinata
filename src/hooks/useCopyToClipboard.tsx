"use client";

import { useCallback } from "react";

interface UseCopyToClipboard {
  copy: (text: string) => void;
}

const useCopyToClipboard = (): UseCopyToClipboard => {
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return { copy };
};

export default useCopyToClipboard;
