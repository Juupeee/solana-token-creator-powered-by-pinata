"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../ui/button";
import { SunIcon, MoonIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import _ from "lodash";

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const iconSize = 18;

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useMemo(
    () =>
      _.throttle(() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }, 300),
    [theme, setTheme],
  );

  const buttonContent = useMemo(() => {
    return theme === "dark" ? (
      <SunIcon size={iconSize} />
    ) : (
      <MoonIcon size={iconSize} />
    );
  }, [theme, iconSize]);

  if (!mounted) {
    return <Skeleton className="h-9 w-9" />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {buttonContent}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={10}>Theme</TooltipContent>
    </Tooltip>
  );
};

export default React.memo(ThemeButton);
