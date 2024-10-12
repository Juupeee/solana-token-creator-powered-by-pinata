import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConfirmationStatusState {
  Confirmed: boolean;
  Finalized: boolean;
  setConfirmed: (value: boolean) => void;
  setFinalized: (value: boolean) => void;
}

export const useConfirmationStatus = create(
  persist<ConfirmationStatusState>(
    (set) => ({
      Confirmed: false,
      Finalized: true,
      setConfirmed: (value: boolean) =>
        set({ Confirmed: value, Finalized: !value }),
      setFinalized: (value: boolean) =>
        set({ Finalized: value, Confirmed: !value }),
    }),
    {
      name: "confirmation-status-storage",
    },
  ),
);
