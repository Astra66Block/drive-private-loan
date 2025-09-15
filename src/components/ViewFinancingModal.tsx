import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, 
  Shield, 
  Coins, 
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  CreditCard,
  Download,
  Settings,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
import { useState } from "react";
import { MakePaymentModal } from "./MakePaymentModal";
import { PaymentHistory } from "./PaymentHistory";

interface ViewFinancingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
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
  };
}

export function ViewFinancingModal({ isOpen, onClose, vehicle }: ViewFinancingModalProps) {
  const [showPrivateData, setShowPrivateData] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const loanData = {
    totalLoan: vehicle.price * 0.85, // Assuming 15% down payment
    paidAmount: vehicle.price * 0.85 * 0.35, // 35% paid
    remainingBalance: vehicle.price * 0.85 * 0.65,
    nextPaymentDate: "2024-10-15",
    termRemaining: Math.floor(vehicle.loanTerms.term * 0.65),
    tokenAppreciation: 8.5,
    totalTokens: (vehicle.price * 0.85) / 50 // $50 per token
  };

  // Mock payment history with encrypted data
  const paymentHistory = [
    {
      id: "001",
      amount: "850.00",
      date: "2024-09-15T10:30:00Z",
      status: "completed" as const,
      transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
      blockNumber: 50000001,
      gasUsed: 75000,
      encryptedData: {
        ciphertext: "fhe_ct_850_1694778600000_abc123",
        publicKey: "fhe_pub_key_1694778600000",
        metadata: {
          algorithm: "FHE-BFV",
          timestamp: 1694778600000,
          dataType: "payment_amount"
        }
      }
    },
    {
      id: "002",
      amount: "850.00",
      date: "2024-08-15T10:30:00Z",
      status: "completed" as const,
      transactionHash: "0x2345678901bcdef1234567890abcdef123456789",
      blockNumber: 49950001,
      gasUsed: 72000,
      encryptedData: {
        ciphertext: "fhe_ct_850_1692096600000_def456",
        publicKey: "fhe_pub_key_1692096600000",
        metadata: {
          algorithm: "FHE-BFV",
          timestamp: 1692096600000,
          dataType: "payment_amount"
        }
      }
    },
    {
      id: "003",
      amount: "850.00",
      date: "2024-07-15T10:30:00Z",
      status: "completed" as const,
      transactionHash: "0x3456789012cdef1234567890abcdef1234567890",
      blockNumber: 49900001,
      gasUsed: 71000,
      encryptedData: {
        ciphertext: "fhe_ct_850_1689414600000_ghi789",
        publicKey: "fhe_pub_key_1689414600000",
        metadata: {
          algorithm: "FHE-BFV",
          timestamp: 1689414600000,
          dataType: "payment_amount"
        }
      }
    }
  ];

  const paymentProgress = (loanData.paidAmount / loanData.totalLoan) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Vehicle Financing Overview</DialogTitle>
              <p className="text-muted-foreground">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            </div>
            <Badge className="bg-gradient-primary text-primary-foreground shadow-glow-primary">
              <Coins className="w-3 h-3 mr-1" />
              Tokenized
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="tokens">RWA Tokens</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Privacy Toggle */}
            <Card className="p-4 bg-surface border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Encrypted Financial Data</p>
                    <p className="text-sm text-muted-foreground">Toggle to view sensitive information</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrivateData(!showPrivateData)}
                  className="border-primary/20"
                >
                  {showPrivateData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </Card>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card-premium border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Remaining Balance</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {showPrivateData ? `$${loanData.remainingBalance.toLocaleString()}` : "••••••"}
                </p>
                <div className="mt-3">
                  <Progress value={paymentProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {paymentProgress.toFixed(1)}% paid off
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-card-premium border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Next Payment</span>
                </div>
                <p className="text-2xl font-bold text-accent">
                  {showPrivateData ? `$${vehicle.loanTerms.monthlyPayment}` : "•••"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Due {new Date(loanData.nextPaymentDate).toLocaleDateString()}
                </p>
              </Card>

              <Card className="p-6 bg-card-premium border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">Token Value</span>
                </div>
                <p className="text-2xl font-bold text-success">
                  {showPrivateData ? `${vehicle.tokenValue.toFixed(2)} RWA` : "••••••"}
                </p>
                <p className="text-sm text-success mt-2">+{loanData.tokenAppreciation}% this year</p>
              </Card>
            </div>

            {/* Loan Terms */}
            <Card className="p-6 bg-card-premium border-border">
              <h3 className="text-lg font-semibold mb-4">Loan Terms</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">APR</p>
                  <p className="text-xl font-semibold text-primary">
                    {showPrivateData ? `${vehicle.loanTerms.apr}%` : "•••%"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Term Remaining</p>
                  <p className="text-xl font-semibold">
                    {showPrivateData ? `${loanData.termRemaining} mo` : "•• mo"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Original Loan</p>
                  <p className="text-xl font-semibold">
                    {showPrivateData ? `$${loanData.totalLoan.toLocaleString()}` : "$••,•••"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Paid to Date</p>
                  <p className="text-xl font-semibold text-success">
                    {showPrivateData ? `$${loanData.paidAmount.toLocaleString()}` : "$••,•••"}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment History</h3>
              <Button 
                className="bg-gradient-primary"
                onClick={() => setShowPaymentModal(true)}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Make Payment
              </Button>
            </div>

            <PaymentHistory payments={paymentHistory} />
          </TabsContent>

          <TabsContent value="tokens" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card-premium border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <Coins className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Total RWA Tokens</span>
                </div>
                <p className="text-3xl font-bold text-primary mb-2">
                  {showPrivateData ? `${loanData.totalTokens.toFixed(0)}` : "•••"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Representing your vehicle ownership
                </p>
              </Card>

              <Card className="p-6 bg-card-premium border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">Token Performance</span>
                </div>
                <p className="text-3xl font-bold text-success mb-2">+{loanData.tokenAppreciation}%</p>
                <p className="text-sm text-muted-foreground">
                  Annual appreciation rate
                </p>
              </Card>
            </div>

            <Card className="p-6 bg-gradient-primary/10 border-primary/20">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold">Blockchain Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Your RWA tokens are secured on the blockchain with immutable ownership records
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="space-y-4">
              {[
                { name: "Loan Agreement", date: "2024-01-15", encrypted: true },
                { name: "Vehicle Title", date: "2024-01-15", encrypted: true },
                { name: "Insurance Policy", date: "2024-01-20", encrypted: false },
                { name: "RWA Token Certificate", date: "2024-01-15", encrypted: true },
                { name: "Payment Schedule", date: "2024-01-15", encrypted: true }
              ].map((doc, index) => (
                <Card key={index} className="p-4 bg-card-premium border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {doc.encrypted ? (
                        <Lock className="w-5 h-5 text-primary" />
                      ) : (
                        <Download className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.encrypted && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          Encrypted
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              className="bg-gradient-primary"
              onClick={() => setShowPaymentModal(true)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Make Payment
            </Button>
          </div>
        </div>
      </DialogContent>
      
      {/* Make Payment Modal */}
      <MakePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        loanId={1} // This would come from the actual loan data
        vehicle={vehicle}
      />
    </Dialog>
  );
}