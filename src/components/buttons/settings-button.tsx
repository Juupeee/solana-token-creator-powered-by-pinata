import React, { useCallback, useMemo } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCluster } from "@/hooks/useCluster";
import { useConfirmationStatus } from "@/hooks/useConfirmationStatus";
import {
  clusterOptions,
  explorerOptions,
  OptionType,
} from "@/constants/cluster-data";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const confirmationOptions = [
  {
    id: "finalized",
    name: "Finalized",
    description:
      "Finalized is the most secure confirmation status, but it may take a long time to confirm.",
  },
  {
    id: "confirmed",
    name: "Confirmed",
    description:
      "Confirmed is a less secure confirmation status, but it is faster than Finalized.",
  },
];

const SettingsButton: React.FC = React.memo(() => {
  const {
    clusters,
    setCluster,
    cluster,
    defaultExplorerProvider,
    setDefaultExplorerProvider,
  } = useCluster();

  const { setConfirmed, Finalized, setFinalized } = useConfirmationStatus();

  const handleClusterChange = useCallback(
    (value: string) => {
      const data = clusters.find((c) => c.name === value);
      if (data) setCluster(data);
    },
    [clusters, setCluster],
  );

  const handleExplorerChange = useCallback(
    (value: string) => {
      setDefaultExplorerProvider(
        value === "Solana Explorer" ? "default" : "sol-scan",
      );
    },
    [setDefaultExplorerProvider],
  );

  const handleConfirmationChange = useCallback(
    (value: string) => {
      setFinalized(value === "Finalized");
      setConfirmed(value !== "Finalized");
    },
    [setConfirmed, setFinalized],
  );

  const renderOptions = useCallback(
    (
      options: OptionType[],
      currentValue: string,
      onChange: (value: string) => void,
    ) => (
      <RadioGroup value={currentValue} onValueChange={onChange}>
        <div className="space-y-2">
          {options.map((option) => (
            <SettingOption
              key={option.id}
              id={option.id}
              label={option.name}
              value={option.name}
              currentValue={currentValue}
              description={option.description}
            />
          ))}
        </div>
      </RadioGroup>
    ),
    [],
  );

  const settingSections = useMemo(
    () => [
      {
        title: "Connection",
        description: "Set the connection cluster",
        content: renderOptions(
          clusterOptions,
          cluster.name,
          handleClusterChange,
        ),
      },
      {
        title: "Explorer",
        description: "Set default explorer what you prefer",
        content: renderOptions(
          explorerOptions,
          defaultExplorerProvider === "default" ? "Solana Explorer" : "Solscan",
          handleExplorerChange,
        ),
      },
      {
        title: "Confirmation Status",
        description: "Set the confirmation status for transactions",
        content: renderOptions(
          confirmationOptions,
          Finalized ? "Finalized" : "Confirmed",
          handleConfirmationChange,
        ),
      },
    ],
    [
      cluster.name,
      defaultExplorerProvider,
      Finalized,
      handleClusterChange,
      handleExplorerChange,
      handleConfirmationChange,
      renderOptions,
    ],
  );

  const sheetContent = useMemo(
    () => (
      <SheetContent side="right" className="w-80 bg-card p-0 sm:w-96">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold">Settings</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Customize your app experience
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-8">
              {settingSections.map((section) => (
                <SettingSection
                  key={section.title}
                  title={section.title}
                  description={section.description}
                >
                  {section.content}
                </SettingSection>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    ),
    [settingSections],
  );

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            >
              <Settings2 className="h-5 w-5" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={10}>Settings</TooltipContent>
      </Tooltip>
      {sheetContent}
    </Sheet>
  );
});

SettingsButton.displayName = "SettingsButton";

interface SettingOptionProps {
  id: string;
  label: string;
  value: string;
  currentValue: string;
  description?: string;
}

const SettingOption: React.FC<SettingOptionProps> = React.memo(
  ({ id, label, value, currentValue, description }) => (
    <div className="relative overflow-hidden rounded-lg transition-all duration-200 ease-in-out hover:bg-accent/50">
      <div className="flex items-center space-x-2 p-3">
        <RadioGroupItem value={value} id={id} className="peer sr-only" />
        <label
          htmlFor={id}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between rounded-lg text-sm transition-all duration-200 ease-in-out",
            value === currentValue
              ? "font-medium text-primary"
              : "text-foreground",
          )}
        >
          <div className="space-y-1">
            <span className="font-medium">{label}</span>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {value === currentValue && (
            <Check className="h-4 w-4 min-w-fit text-primary" />
          )}
        </label>
      </div>
      <div
        className={cn(
          "absolute bottom-0 left-0 h-0.5 w-full transition-all duration-200 ease-in-out",
          value === currentValue ? "bg-primary" : "bg-transparent",
        )}
      />
    </div>
  ),
);

SettingOption.displayName = "SettingOption";

interface SettingSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = React.memo(
  ({ title, description, children }) => (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  ),
);

SettingSection.displayName = "SettingSection";

export default SettingsButton;
