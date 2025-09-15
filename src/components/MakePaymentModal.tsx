import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Shield, 
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  DollarSign,
  Calendar,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useAccount } from 'wagmi';
import { contractHelpers } from '@/lib/contracts';
import { fheUtils } from '@/lib/fhe-utils';

interface MakePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: number;
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

export function MakePaymentModal({ isOpen, onClose, loanId, vehicle }: MakePaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState(vehicle.loanTerms.monthlyPayment);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showEncryptedData, setShowEncryptedData] = useState(false);
  const [encryptedPaymentData, setEncryptedPaymentData] = useState<any>(null);
  const [transactionHash, setTransactionHash] = useState('');
  
  const { isConnected, address } = useAccount();

  const handleMakePayment = async () => {
    if (!isConnected) {
      setErrorMessage('Please connect your wallet first');
      setPaymentStatus('error');
      return;
    }

    if (paymentAmount <= 0) {
      setErrorMessage('Payment amount must be greater than 0');
      setPaymentStatus('error');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      console.log('Starting encrypted payment process...');
      
      // Initialize FHE system if not ready
      if (!fheUtils.isReady()) {
        await fheUtils.initialize();
        console.log('FHE system initialized');
      }

      // Make payment with FHE encryption
      const result = await contractHelpers.makePayment(loanId, paymentAmount);
      
      if (result.success) {
        console.log('Payment processed successfully with FHE encryption:', result);
        
        // Store encrypted payment data for display
        setEncryptedPaymentData(result.encryptedAmount);
        
        // Set transaction hash from the result
        setTransactionHash(result.transactionHash);
        
        setPaymentStatus('success');
        
        // Show success message
        setTimeout(() => {
          onClose();
          setPaymentStatus('idle');
          setEncryptedPaymentData(null);
          setTransactionHash('');
        }, 3000);
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatEncryptedData = (data: any) => {
    if (!data) return 'No data';
    return JSON.stringify(data, null, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-primary" />
                <span>Make Encrypted Payment</span>
              </DialogTitle>
              <p className="text-muted-foreground">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
            </div>
            <Badge className="bg-gradient-primary text-primary-foreground shadow-glow-primary">
              <Shield className="w-3 h-3 mr-1" />
              FHE Encrypted
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Amount Input */}
          <Card className="p-6 bg-card-premium border-border">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <Label htmlFor="paymentAmount" className="text-lg font-semibold">
                  Payment Amount
                </Label>
              </div>
              
              <div className="relative">
                <Input
                  id="paymentAmount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  placeholder="Enter payment amount"
                  className="text-lg pr-12"
                  disabled={isProcessing}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  USD
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Monthly Payment: ${vehicle.loanTerms.monthlyPayment}</span>
                <span>APR: {vehicle.loanTerms.apr}%</span>
              </div>
            </div>
          </Card>

          {/* Payment Status */}
          {paymentStatus !== 'idle' && (
            <Card className={`p-6 border-2 ${
              paymentStatus === 'success' ? 'bg-success/10 border-success/20' :
              paymentStatus === 'error' ? 'bg-destructive/10 border-destructive/20' :
              'bg-primary/10 border-primary/20'
            }`}>
              <div className="flex items-center space-x-3">
                {paymentStatus === 'processing' && (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                )}
                {paymentStatus === 'success' && (
                  <CheckCircle className="w-6 h-6 text-success" />
                )}
                {paymentStatus === 'error' && (
                  <AlertCircle className="w-6 h-6 text-destructive" />
                )}
                
                <div>
                  {paymentStatus === 'processing' && (
                    <p className="font-semibold text-primary">Processing Encrypted Payment...</p>
                  )}
                  {paymentStatus === 'success' && (
                    <p className="font-semibold text-success">Payment Successful!</p>
                  )}
                  {paymentStatus === 'error' && (
                    <p className="font-semibold text-destructive">Payment Failed</p>
                  )}
                  
                  {errorMessage && (
                    <p className="text-sm text-destructive mt-1">{errorMessage}</p>
                  )}
                  
                  {transactionHash && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Transaction: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Encrypted Data Display */}
          {encryptedPaymentData && (
            <Card className="p-6 bg-surface border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Encrypted Payment Data</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEncryptedData(!showEncryptedData)}
                  className="border-primary/20"
                >
                  {showEncryptedData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              
              {showEncryptedData ? (
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-40">
                  {formatEncryptedData(encryptedPaymentData)}
                </pre>
              ) : (
                <div className="bg-muted p-4 rounded-lg text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Payment data encrypted with FHE technology
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Payment Security Info */}
          <Card className="p-6 bg-gradient-primary/10 border-primary/20">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Privacy Protection</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Payment amount encrypted using Fully Homomorphic Encryption</li>
                  <li>• Financial data remains private throughout the transaction</li>
                  <li>• Blockchain records only encrypted values</li>
                  <li>• No third party can access your payment details</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleMakePayment}
              disabled={isProcessing || !isConnected || paymentAmount <= 0}
              className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Make Encrypted Payment
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
