import React, { useState, useEffect, useCallback } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateTokenValues } from "@/schemas/create-token-schema";
import { FormItem, FormControl, FormMessage } from "@/components/ui/form";

interface LogoUploadProps {
  form: UseFormReturn<CreateTokenValues>;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({ form }) => {
  const {
    control,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = form;
  const logoType = watch("logoType");
  const logoFile = watch("logoFile");
  const logoUrl = watch("logoUrl");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (logoType === "file" && logoFile instanceof File) {
      const objectUrl = URL.createObjectURL(logoFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (logoType === "url" && logoUrl) {
      setPreviewUrl(logoUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [logoType, logoFile, logoUrl]);

  const handleLogoTypeChange = useCallback(
    (checked: boolean) => {
      const newLogoType = checked ? "url" : "file";
      setValue("logoType", newLogoType, { shouldValidate: true });
      setValue("logoFile", undefined);
      setValue("logoUrl", "");
      clearErrors(["logoFile", "logoUrl"]);
      setPreviewUrl(null);
    },
    [setValue, clearErrors],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setValue("logoFile", file, { shouldValidate: true });
      }
    },
    [setValue],
  );

  const handleUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue("logoUrl", event.target.value, { shouldValidate: true });
    },
    [setValue],
  );

  return (
    <>
      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="logoType">Logo Type</Label>
          <p className="text-sm text-muted-foreground">
            Choose between file upload or URL
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="logoType"
            className={logoType === "file" ? "font-bold" : ""}
          >
            File
          </Label>
          <Controller
            name="logoType"
            control={control}
            render={({ field }) => (
              <Switch
                id="logoType"
                checked={field.value === "url"}
                onCheckedChange={handleLogoTypeChange}
                aria-label="Toggle logo type"
              />
            )}
          />
          <Label
            htmlFor="logoType"
            className={logoType === "url" ? "font-bold" : ""}
          >
            URL
          </Label>
        </div>
      </FormItem>

      {logoType === "file" && (
        <FormItem>
          <Label htmlFor="logoFile">Upload Logo</Label>
          <FormControl>
            <Input
              id="logoFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </FormControl>
          {logoFile instanceof File && (
            <p className="text-sm text-muted-foreground">
              Selected file: {logoFile.name}
            </p>
          )}
          <FormMessage>{errors.logoFile?.message?.toString()}</FormMessage>
        </FormItem>
      )}

      {logoType === "url" && (
        <FormItem>
          <Label htmlFor="logoUrl">Logo URL</Label>
          <FormControl>
            <Input
              id="logoUrl"
              type="text"
              value={logoUrl || ""}
              onChange={handleUrlChange}
              placeholder="Enter logo URL"
            />
          </FormControl>
          <FormMessage>{errors.logoUrl?.message}</FormMessage>
        </FormItem>
      )}

      {previewUrl && (
        <FormItem>
          <Label>Logo Preview</Label>
          <Avatar className="mt-2 h-24 w-24">
            <AvatarImage src={previewUrl} alt="Logo preview" />
            <AvatarFallback>Logo</AvatarFallback>
          </Avatar>
        </FormItem>
      )}
    </>
  );
};

LogoUpload.displayName = "LogoUpload";
