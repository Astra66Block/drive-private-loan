import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Shield, ChevronRight, CheckCircle } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export function WalletConnect() {
  const { isConnected, address } = useAccount();

  if (isConnected && address) {
    return (
      <Card className="p-4 bg-card-premium border-success/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-success">Wallet Connected</p>
              <p className="text-sm text-muted-foreground font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Active
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card-premium border-border hover:shadow-premium transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Connect Your Wallet</h3>
            <p className="text-sm text-muted-foreground">
              Secure access to RWA vehicle financing
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-primary" />
          <span>End-to-end encrypted transactions</span>
        </div>

        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button 
                        onClick={openConnectModal}
                        className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group"
                      >
                        Connect Wallet
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button 
                        onClick={openChainModal}
                        className="w-full bg-destructive hover:bg-destructive/90"
                      >
                        Wrong network
                      </Button>
                    );
                  }

                  return (
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={openChainModal}
                        className="flex items-center space-x-2"
                        variant="outline"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </Button>

                      <Button onClick={openAccountModal} variant="outline">
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </Button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </Card>
  );
}