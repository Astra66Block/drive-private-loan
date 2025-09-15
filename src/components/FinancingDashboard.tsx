import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Shield, 
  Lock, 
  DollarSign, 
  Calendar,
  PieChart,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";

export function FinancingDashboard() {
  const [showDetails, setShowDetails] = useState(false);

  const loanData = {
    totalLoan: 45000,
    paidAmount: 18500,
    remainingBalance: 26500,
    monthlyPayment: 750,
    nextPaymentDate: "2024-10-15",
    apr: 4.2,
    termRemaining: 36,
    tokenValue: 892.45
  };

  const paymentProgress = (loanData.paidAmount / loanData.totalLoan) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Vehicle Financing</h2>
          <p className="text-muted-foreground">2023 Tesla Model 3 - Tokenized Asset</p>
        </div>
        <Badge className="bg-gradient-primary text-primary-foreground shadow-glow-primary">
          <Shield className="w-3 h-3 mr-1" />
          Encrypted
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Loan Balance */}
        <Card className="p-6 bg-card-premium border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Remaining Balance</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-muted-foreground hover:text-primary"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="space-y-3">
            <p className="text-2xl font-bold text-foreground">
              {showDetails ? `$${loanData.remainingBalance.toLocaleString()}` : "••••••"}
            </p>
            <Progress value={paymentProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {paymentProgress.toFixed(1)}% paid off
            </p>
          </div>
        </Card>

        {/* Monthly Payment */}
        <Card className="p-6 bg-card-premium border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">Next Payment</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold text-accent">
              {showDetails ? `$${loanData.monthlyPayment}` : "•••"}
            </p>
            <p className="text-sm text-muted-foreground">
              Due {new Date(loanData.nextPaymentDate).toLocaleDateString()}
            </p>
            <Button size="sm" className="w-full bg-gradient-secondary hover:shadow-glow-secondary">
              Make Payment
            </Button>
          </div>
        </Card>

        {/* Token Value */}
        <Card className="p-6 bg-card-premium border-border">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">RWA Token Value</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold text-success">
              {showDetails ? `${loanData.tokenValue} RWA` : "••••••"}
            </p>
            <p className="text-sm text-success">+2.4% this month</p>
          </div>
        </Card>
      </div>

      {/* Loan Details */}
      <Card className="p-6 bg-card-premium border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Encrypted Loan Terms</h3>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Privacy Protected
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">APR</p>
            <p className="text-xl font-semibold text-primary">
              {showDetails ? `${loanData.apr}%` : "•••%"}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Term Remaining</p>
            <p className="text-xl font-semibold">
              {showDetails ? `${loanData.termRemaining} mo` : "•• mo"}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Original Loan</p>
            <p className="text-xl font-semibold">
              {showDetails ? `$${loanData.totalLoan.toLocaleString()}` : "$••,•••"}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Paid to Date</p>
            <p className="text-xl font-semibold text-success">
              {showDetails ? `$${loanData.paidAmount.toLocaleString()}` : "$••,•••"}
            </p>
          </div>
        </div>
      </Card>

      {/* Privacy Notice */}
      <Card className="p-4 bg-surface border-primary/20">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-primary">Your data is encrypted</p>
            <p className="text-xs text-muted-foreground">
              All loan terms and payment data are protected with end-to-end encryption
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}