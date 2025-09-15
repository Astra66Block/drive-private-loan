import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Shield, 
  Coins, 
  ArrowRight, 
  CheckCircle, 
  Lock,
  Calculator,
  FileText,
  CreditCard
} from "lucide-react";
import { useState } from "react";

interface TokenizeFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    make: string;
    model: string;
    year: number;
    price: number;
    loanTerms: {
      apr: number;
      term: number;
      monthlyPayment: number;
    };
  };
}

export function TokenizeFinanceModal({ isOpen, onClose, vehicle }: TokenizeFinanceModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    downPayment: 5000,
    loanAmount: vehicle.price - 5000,
    creditScore: "",
    income: "",
    employmentType: ""
  });

  const steps = [
    { number: 1, title: "Loan Details", icon: Calculator },
    { number: 2, title: "Credit Check", icon: FileText },
    { number: 3, title: "Tokenization", icon: Coins },
    { number: 4, title: "Complete", icon: CheckCircle }
  ];

  const progress = (step / steps.length) * 100;

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Configure Your Loan</h3>
              <p className="text-muted-foreground">Set your down payment and review terms</p>
            </div>
            
            <Card className="p-4 bg-surface border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Car className="w-5 h-5 text-primary" />
                  <span className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</span>
                </div>
                <span className="text-lg font-bold">${vehicle.price.toLocaleString()}</span>
              </div>
            </Card>

            <div className="space-y-4">
              <div>
                <Label htmlFor="downPayment">Down Payment</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={formData.downPayment}
                  onChange={(e) => setFormData({
                    ...formData,
                    downPayment: parseInt(e.target.value),
                    loanAmount: vehicle.price - parseInt(e.target.value)
                  })}
                  className="bg-surface border-border"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-surface rounded-lg border">
                <div>
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="text-lg font-semibold">${formData.loanAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Est. Monthly</p>
                  <p className="text-lg font-semibold text-primary">${vehicle.loanTerms.monthlyPayment}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Credit Information</h3>
              <p className="text-muted-foreground">We need some details for pre-approval</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="creditScore">Credit Score Range</Label>
                <select 
                  className="w-full p-2 bg-surface border border-border rounded-md"
                  value={formData.creditScore}
                  onChange={(e) => setFormData({...formData, creditScore: e.target.value})}
                >
                  <option value="">Select range</option>
                  <option value="excellent">750+ (Excellent)</option>
                  <option value="good">700-749 (Good)</option>
                  <option value="fair">650-699 (Fair)</option>
                  <option value="poor">600-649 (Poor)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="income">Annual Income</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="75000"
                  value={formData.income}
                  onChange={(e) => setFormData({...formData, income: e.target.value})}
                  className="bg-surface border-border"
                />
              </div>

              <div>
                <Label htmlFor="employment">Employment Type</Label>
                <select 
                  className="w-full p-2 bg-surface border border-border rounded-md"
                  value={formData.employmentType}
                  onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                >
                  <option value="">Select type</option>
                  <option value="fulltime">Full-time Employee</option>
                  <option value="selfemployed">Self-employed</option>
                  <option value="contract">Contract Worker</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>

            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Secure Credit Check</p>
                  <p className="text-xs text-muted-foreground">
                    Soft inquiry only - won't affect your credit score
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Asset Tokenization</h3>
              <p className="text-muted-foreground">Converting your vehicle to RWA tokens</p>
            </div>

            <div className="space-y-4">
              <Card className="p-6 bg-gradient-primary/10 border-primary/20 text-center">
                <Coins className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Generating RWA Tokens</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Creating {(formData.loanAmount / 50).toFixed(0)} RWA tokens for your vehicle
                </p>
                <Progress value={85} className="mb-2" />
                <p className="text-xs text-muted-foreground">Processing blockchain transaction...</p>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface rounded-lg border text-center">
                  <Lock className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-sm font-medium">Encrypted Loan Terms</p>
                  <p className="text-xs text-muted-foreground">Zero-knowledge privacy</p>
                </div>
                <div className="p-4 bg-surface rounded-lg border text-center">
                  <Shield className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="text-sm font-medium">Secure Ownership</p>
                  <p className="text-xs text-muted-foreground">Blockchain verified</p>
                </div>
              </div>
            </div>

            <Badge className="w-full justify-center py-2 bg-gradient-primary text-primary-foreground">
              <CheckCircle className="w-4 h-4 mr-2" />
              Pre-approved for {vehicle.loanTerms.apr}% APR
            </Badge>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Financing Complete!</h3>
              <p className="text-muted-foreground">
                Your vehicle has been successfully tokenized and financing approved
              </p>
            </div>

            <Card className="p-6 bg-surface border-border">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RWA Tokens</span>
                  <span className="font-medium text-primary">{(formData.loanAmount / 50).toFixed(0)} RWA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Payment</span>
                  <span className="font-medium text-accent">${vehicle.loanTerms.monthlyPayment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">APR</span>
                  <span className="font-medium">{vehicle.loanTerms.apr}%</span>
                </div>
              </div>
            </Card>

            <div className="flex space-x-3">
              <Button className="flex-1 bg-gradient-primary">
                <CreditCard className="w-4 h-4 mr-2" />
                Make First Payment
              </Button>
              <Button variant="outline" className="flex-1">
                View Dashboard
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-center">Vehicle Tokenization & Financing</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-between mb-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.number} className="flex flex-col items-center space-y-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s.number 
                    ? 'bg-gradient-primary text-primary-foreground' 
                    : 'bg-surface border border-border text-muted-foreground'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs ${step >= s.number ? 'text-primary' : 'text-muted-foreground'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        <Progress value={progress} className="mb-6" />

        {renderStepContent()}

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            disabled={step === 3}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-gradient-primary"
            disabled={step === 2 && (!formData.creditScore || !formData.income || !formData.employmentType)}
          >
            {step === steps.length ? 'Done' : 'Continue'}
            {step < steps.length && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}