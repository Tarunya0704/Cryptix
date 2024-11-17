'use client'
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";

export function WalletConnect() {
  const { connected, account, connect, disconnect, wallets } = useWallet();

  if (!connected) {
    return (
      <div className="flex space-x-2">
        {wallets.map((wallet) => (
          <Button
            key={wallet.name}
            onClick={() => connect(wallet.name)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Connect {wallet.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-600">
        {account?.address?.toString().slice(0, 6)}...
        {account?.address?.toString().slice(-4)}
      </span>
      <Button
        onClick={disconnect}
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        Disconnect
      </Button>
    </div>
  );
}