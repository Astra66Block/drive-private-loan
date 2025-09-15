import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  Shield, 
  Eye, 
  EyeOff,
  ExternalLink,
  Lock
} from "lucide-react";
import { useState } from "react";

interface PaymentRecord {
  id: string;
  amount: string; // Encrypted amount
  date: string;
  status: 'completed' | 'pending' | 'failed';
  transactionHash: string;
  blockNumber: number;
  gasUsed: number;
  encryptedData: any;
}

interface PaymentHistoryProps {
  payments: PaymentRecord[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const [showEncryptedData, setShowEncryptedData] = useState<{ [key: string]: boolean }>({});

  const toggleEncryptedData = (paymentId: string) => {
    setShowEncryptedData(prev => ({
      ...prev,
      [paymentId]: !prev[paymentId]
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'failed':
        return <Shield className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="p-6 bg-card-premium border-border">
          <div className="space-y-4">
            {/* Payment Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(payment.status)}
                <div>
                  <h4 className="font-semibold">Payment #{payment.id}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString()} at {new Date(payment.date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(payment.status)}
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Shield className="w-3 h-3 mr-1" />
                  FHE Encrypted
                </Badge>
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-semibold text-lg">
                  {showEncryptedData[payment.id] ? 
                    `$${payment.amount}` : 
                    "••••••"
                  }
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Transaction Hash</p>
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-sm">
                    {payment.transactionHash.slice(0, 10)}...{payment.transactionHash.slice(-8)}
                  </p>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Block Number</p>
                <p className="font-semibold">#{payment.blockNumber.toLocaleString()}</p>
              </div>
            </div>

            {/* Encrypted Data Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <span className="font-medium">Encrypted Payment Data</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleEncryptedData(payment.id)}
                  className="border-primary/20"
                >
                  {showEncryptedData[payment.id] ? 
                    <EyeOff className="w-4 h-4" /> : 
                    <Eye className="w-4 h-4" />
                  }
                </Button>
              </div>
              
              {showEncryptedData[payment.id] ? (
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-auto max-h-32">
                    {JSON.stringify(payment.encryptedData, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-lg text-center">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Payment data encrypted with FHE technology
                  </p>
                </div>
              )}
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Gas Used</p>
                <p className="font-semibold">{payment.gasUsed.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Network</p>
                <p className="font-semibold">Ethereum Sepolia</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
