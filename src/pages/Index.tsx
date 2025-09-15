import { useState } from "react";
import { VehicleCard } from "@/components/VehicleCard";
import { WalletConnect } from "@/components/WalletConnect";
import { FinancingDashboard } from "@/components/FinancingDashboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Shield, 
  Car, 
  TrendingUp,
  Lock,
  Zap
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"marketplace" | "dashboard">("marketplace");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample vehicle data
  const vehicles = [
    {
      id: "1",
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      price: 45000,
      tokenValue: 892.45,
      loanTerms: {
        apr: 4.2,
        term: 60,
        monthlyPayment: 750
      },
      isTokenized: true
    },
    {
      id: "2", 
      make: "BMW",
      model: "i4 M50",
      year: 2024,
      price: 67000,
      tokenValue: 0,
      loanTerms: {
        apr: 3.9,
        term: 72,
        monthlyPayment: 985
      },
      isTokenized: false
    },
    {
      id: "3",
      make: "Mercedes",
      model: "EQS 450",
      year: 2023,
      price: 89000,
      tokenValue: 1456.78,
      loanTerms: {
        apr: 4.5,
        term: 84,
        monthlyPayment: 1250
      },
      isTokenized: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">RWA Finance</h1>
                <p className="text-sm text-muted-foreground">Drive Your Car, Keep Your Data Private</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Shield className="w-3 h-3 mr-1" />
                Encrypted
              </Badge>
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-background/60 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-3">
          <div className="flex space-x-1">
            <Button
              variant={activeTab === "marketplace" ? "default" : "ghost"}
              onClick={() => setActiveTab("marketplace")}
              className={activeTab === "marketplace" ? "bg-gradient-primary shadow-glow-primary" : ""}
            >
              <Car className="w-4 h-4 mr-2" />
              Vehicle Marketplace
            </Button>
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              onClick={() => setActiveTab("dashboard")}
              className={activeTab === "dashboard" ? "bg-gradient-primary shadow-glow-primary" : ""}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              My Financing
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === "marketplace" ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Tokenized Vehicle Financing
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  With Complete Privacy
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Finance premium vehicles through encrypted RWA tokens. 
                Your loan terms stay private while your assets appreciate.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-card-premium border-border text-center">
                <div className="flex justify-center mb-3">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">100%</h3>
                <p className="text-muted-foreground">Encrypted Transactions</p>
              </Card>
              
              <Card className="p-6 bg-card-premium border-border text-center">
                <div className="flex justify-center mb-3">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">24/7</h3>
                <p className="text-muted-foreground">Instant Tokenization</p>
              </Card>
              
              <Card className="p-6 bg-card-premium border-border text-center">
                <div className="flex justify-center mb-3">
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">3.9%</h3>
                <p className="text-muted-foreground">Starting APR</p>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search vehicles by make, model, or year..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-surface border-border"
                />
              </div>
              <Button variant="outline" className="border-border">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} {...vehicle} />
              ))}
            </div>
          </div>
        ) : (
          <FinancingDashboard />
        )}
      </main>
    </div>
  );
};

export default Index;
