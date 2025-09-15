import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Shield, Coins, TrendingUp } from "lucide-react";
import { TokenizeFinanceModal } from "./TokenizeFinanceModal";
import { ViewFinancingModal } from "./ViewFinancingModal";
import { useState } from "react";
import { useAccount } from 'wagmi';
import { contractHelpers } from '@/lib/contracts';

interface VehicleCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  tokenValue: number;
  loanTerms: {
    apr: number;
    term: number;
    monthlyPayment: number;
  };
  isTokenized: boolean;
  image?: string;
}

export function VehicleCard({
  make,
  model,
  year,
  price,
  tokenValue,
  loanTerms,
  isTokenized,
  image
}: VehicleCardProps) {
  const [showTokenizeModal, setShowTokenizeModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const { isConnected } = useAccount();

  const vehicleData = {
    make,
    model,
    year,
    price,
    tokenValue,
    loanTerms
  };

  const handleTokenizeAndFinance = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    try {
      // Add vehicle to contract
      await contractHelpers.addVehicle(
        make,
        model,
        year,
        price,
        loanTerms.monthlyPayment * loanTerms.term,
        loanTerms.apr * 100, // Convert to basis points
        loanTerms.term
      );
      
      setShowTokenizeModal(true);
    } catch (error) {
      console.error('Error adding vehicle to contract:', error);
      alert('Failed to add vehicle to contract');
    }
  };
  return (
    <Card className="bg-card-premium border-border hover:shadow-premium transition-all duration-300 group overflow-hidden">
      {/* Vehicle Image */}
      <div className="relative h-48 bg-gradient-surface overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={`${year} ${make} ${model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-surface-elevated">
            <Car className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge 
            variant={isTokenized ? "default" : "secondary"}
            className={isTokenized 
              ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" 
              : "bg-muted text-muted-foreground"
            }
          >
            {isTokenized ? (
              <>
                <Coins className="w-3 h-3 mr-1" />
                Tokenized
              </>
            ) : (
              "Available"
            )}
          </Badge>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground">
            {year} {make} {model}
          </h3>
          <p className="text-2xl font-bold text-primary">
            ${price.toLocaleString()}
          </p>
        </div>

        {/* Token Value */}
        {isTokenized && (
          <div className="flex items-center justify-between p-3 bg-surface rounded-lg border">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Token Value</span>
            </div>
            <span className="font-semibold text-accent">
              {tokenValue.toFixed(2)} RWA
            </span>
          </div>
        )}

        {/* Loan Terms */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Encrypted Loan Terms</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">APR</p>
              <p className="font-semibold text-primary">{loanTerms.apr}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Term</p>
              <p className="font-semibold">{loanTerms.term}mo</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monthly</p>
              <p className="font-semibold text-accent">
                ${loanTerms.monthlyPayment}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
          onClick={() => isTokenized ? setShowViewModal(true) : handleTokenizeAndFinance()}
          disabled={!isConnected}
        >
          {!isConnected ? "Connect Wallet First" : isTokenized ? "View Financing" : "Tokenize & Finance"}
        </Button>
      </div>

      {/* Modals */}
      <TokenizeFinanceModal
        isOpen={showTokenizeModal}
        onClose={() => setShowTokenizeModal(false)}
        vehicle={vehicleData}
      />
      
      <ViewFinancingModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        vehicle={vehicleData}
      />
    </Card>
  );
}