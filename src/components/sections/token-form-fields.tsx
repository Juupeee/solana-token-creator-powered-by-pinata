import React, { useMemo, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateTokenValues } from "@/schemas/create-token-schema";
import { FormItem } from "@/components/ui/form";
import _ from "lodash";

interface TokenFormFieldsProps {
  form: UseFormReturn<CreateTokenValues>;
}

const TokenFormFields: React.FC<TokenFormFieldsProps> = React.memo(
  ({ form }) => {
    const {
      register,
      formState: { errors },
    } = form;

    const renderField = useCallback(
      (
        name: keyof CreateTokenValues,
        label: string,
        type: string = "text",
        placeholder: string,
      ) => (
        <FormItem key={name}>
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(
              name,
              type === "number" ? { valueAsNumber: true } : undefined,
            )}
          />
          {_.get(errors, name) && (
            <p className="text-sm text-destructive">
              {_.get(errors, `${name}.message`, "") as string}
            </p>
          )}
        </FormItem>
      ),
      [register, errors],
    );

    const fieldConfig = useMemo(
      () => [
        {
          name: "name" as const,
          label: "Token Name",
          placeholder: "Enter token name",
        },
        {
          name: "symbol" as const,
          label: "Token Symbol",
          placeholder: "Enter token symbol (e.g. BTC)",
        },
        {
          name: "decimals" as const,
          label: "Decimals",
          type: "number",
          placeholder: "Enter number of decimals",
        },
        {
          name: "supply" as const,
          label: "Initial Supply",
          type: "number",
          placeholder: "Enter initial token supply",
        },
      ],
      [],
    );

    const fields = useMemo(
      () =>
        _.map(fieldConfig, ({ name, label, type, placeholder }) =>
          renderField(name, label, type, placeholder),
        ),
      [renderField, fieldConfig],
    );

    return (
      <>
        {_.slice(fields, 0, 2)}
        <div className="grid grid-cols-2 gap-4">{_.slice(fields, 2)}</div>
        <FormItem>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Enter token description (max 1000 characters)"
            {...register("description")}
          />
          {_.get(errors, "description") && (
            <p className="text-sm text-destructive">
              {_.get(errors, "description.message", "")}
            </p>
          )}
        </FormItem>
      </>
    );
  },
);

TokenFormFields.displayName = "TokenFormFields";

export { TokenFormFields };
