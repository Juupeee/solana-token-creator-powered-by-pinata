"use client";

import React, { useCallback, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useWallet } from "@solana/wallet-adapter-react";
import useCreateSplToken from "@/hooks/useCreateSplToken";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/components/providers/modal-provider";
import {
  createTokenSchema,
  CreateTokenValues,
} from "@/schemas/create-token-schema";
import { SuccessModal } from "./success-modal";
import { LogoUpload } from "./logo-upload";
import { SubmitButton } from "./submit-button";
import { TokenFormFields } from "./token-form-fields";

const DEFAULT_VALUES: Partial<CreateTokenValues> = {
  decimals: 9,
  supply: 1000000000,
  logoType: "file",
};

const FormCreateToken: React.FC = () => {
  const { connected } = useWallet();
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const [key, setKey] = useState(0);

  const methods = useForm<CreateTokenValues>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleSuccess = useCallback(
    (mintPublicKey: string, signature: string) => {
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
      openModal(
        <SuccessModal mintPublicKey={mintPublicKey} signature={signature} />,
      );
    },
    [queryClient, openModal],
  );

  const { createToken, isCreating } = useCreateSplToken(handleSuccess);

  const onSubmit = useCallback(
    async (data: CreateTokenValues) => {
      try {
        await createToken(data);
        methods.reset(DEFAULT_VALUES);
        setKey((prev) => prev + 1); // Force re-render
      } catch (error) {
        toast.error((error as Error).message || "Failed to create token");
      }
    },
    [createToken, methods],
  );

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Create Solana Token
        </CardTitle>
        <CardDescription>
          Fill in the details to create your custom Solana token.
        </CardDescription>
      </CardHeader>
      <FormProvider {...methods} key={key}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <TokenFormFields form={methods} />
            <LogoUpload form={methods} />
          </CardContent>
          <CardFooter>
            <SubmitButton
              isCreating={isCreating}
              connected={connected}
              onSubmit={methods.handleSubmit(onSubmit)}
            />
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
};

export default React.memo(FormCreateToken);
