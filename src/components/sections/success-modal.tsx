import React from "react";
import ExplorerLink from "@/components/link/explorer-link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Coins, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/providers/modal-provider";

interface SuccessModalProps {
  mintPublicKey: string;
  signature: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = React.memo(
  ({ mintPublicKey, signature }) => {
    const { closeModal } = useModal();

    return (
      <Card className="w-full overflow-hidden shadow-lg">
        <div className="bg-secondary p-8 text-center">
          <CheckCircle2 className="mx-auto h-20 w-20" />
          <CardTitle className="mt-6 text-4xl font-bold">
            Token Created Successfully
          </CardTitle>
        </div>
        <CardContent className="space-y-6 p-8">
          <div className="rounded-lg bg-secondary p-5 shadow-md">
            <h4 className="mb-3 flex items-center text-lg font-semibold text-secondary-foreground">
              <Coins className="mr-3 h-5 w-5 text-primary" />
              Mint Public Key
            </h4>
            <ExplorerLink
              type="token"
              address={mintPublicKey}
              className="text-sm transition-colors hover:text-primary"
            />
          </div>
          <div className="rounded-lg bg-secondary p-5 shadow-md">
            <h4 className="mb-3 flex items-center text-lg font-semibold text-secondary-foreground">
              <FileSignature className="mr-3 h-5 w-5 text-primary" />
              Transaction Signature
            </h4>
            <ExplorerLink
              type="tx"
              address={signature}
              className="text-sm transition-colors hover:text-primary"
            />
          </div>
          <Button
            onClick={closeModal}
            className="hover:bg-primary-dark w-full bg-primary transition-colors"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    );
  },
);

SuccessModal.displayName = "SuccessModal";
