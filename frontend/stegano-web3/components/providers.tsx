// components/Providers.tsx
'use client'

import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider, NetworkName } from "@aptos-labs/wallet-adapter-react";
import { AutoConnectProvider } from "../app/contexts/AutoConnectProvider";  // Make sure path is correct
import { type ReactNode } from "react";

const wallets = [new PetraWallet()];

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AutoConnectProvider>
      <AptosWalletAdapterProvider
        plugins={wallets}  // Note: changed from wallets to plugins
        autoConnect={true}
        network={NetworkName.Mainnet}
      >
        {children}
      </AptosWalletAdapterProvider>
    </AutoConnectProvider>
  );
}