import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { 
  Shield, 
  Zap, 
  Award, 
  Globe, 
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Users,
  TrendingUp,
  ArrowRightLeft
} from "lucide-react";
import { SiPolygon } from "react-icons/si";
import heroBackground from "@assets/generated_images/Decentralized_network_hero_background_30e1e94e.png";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [isBoot, setIsBoot] = useState(true);

  const stats = [
    { label: "Active Jobs", value: "1,247", icon: Briefcase },
    { label: "Freelancers", value: "8,492", icon: Users },
    { label: "Total Earned", value: "$2.4M", icon: TrendingUp },
  ];

  const features = [
    {
      icon: Shield,
      title: "Smart Contract Escrow",
      description: "Funds locked safely on Polygon until work is verified. No middlemen, no disputes.",
    },
    {
      icon: ArrowRightLeft,
      title: "Multi-Coin Payments via SideShift",
      description: "Pay in any cryptocurrency! All payments automatically converted to USDC using SideShift API for seamless transactions.",
    },
    {
      icon: Award,
      title: "Proof-of-Work NFTs",
      description: "Build an immutable on-chain resume with verified achievement tokens for every completed job.",
    },
    {
      icon: Zap,
      title: "Instant Crypto Payments",
      description: "Get paid in USDC instantly. Zero withdrawal delays, minimal gas fees.",
    },
    {
      icon: Globe,
      title: "Borderless & Decentralized",
      description: "Work with anyone, anywhere. No platform fees, no geographic restrictions.",
    },
  ];

  const benefits = [
    "Zero platform fees",
    "Multi-coin payments via SideShift API",
    "AI-powered job matching",
    "Verified reputation system",
    "Dispute resolution with AI",
    "Real-time encrypted chat",
    "Cross-border payments",
    "Automatic currency conversion",
  ];

  useEffect(() => {
    // On first visit to home, prompt for role selection if not set
    const storedRole = localStorage.getItem("tg_role");
    if (!storedRole) {
      setShowRoleDialog(true);
    }
    setIsBoot(false);
  }, []);

  const chooseRole = (role: "freelancer" | "poster") => {
    localStorage.setItem("tg_role", role);
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen">
      <Dialog open={showRoleDialog && !isBoot} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select your role</DialogTitle>
            <DialogDescription>
              Choose how you want to use TaskGrid. You can use one email for only one role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Freelancer</CardTitle>
                <CardDescription>Find jobs, apply, work and get paid</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => chooseRole("freelancer")}>Continue as Freelancer</Button>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Job Poster</CardTitle>
                <CardDescription>Post jobs, review applications, hire</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => chooseRole("poster")}>Continue as Job Poster</Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
      <section 
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="bg-primary/20 text-primary-foreground border-primary/30 backdrop-blur-sm" data-testid="badge-polygon">
              <SiPolygon className="h-3 w-3 mr-1" />
              Built on Polygon
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight" data-testid="text-hero-title">
              Decentralized Freelancing.
              <br />
              <span className="text-primary">Fair, Fast, and Borderless.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
              A Web3 freelance marketplace with built-in trust, escrow, and proof-of-work NFTs—powered by Polygon blockchain and SideShift API. Pay in any cryptocurrency, receive in USDC. Zero fees, instant payments, verified reputation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth">
                <Button size="lg" variant="default" className="gap-2 text-base" data-testid="button-start-freelancer">
                  Start as Freelancer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 text-base bg-background/10 backdrop-blur-sm border-white/20 text-white hover:bg-background/20" 
                  data-testid="button-start-client"
                >
                  Post a Job
                </Button>
              </Link>
              <Link href="/find-work">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="gap-2 text-base bg-background/10 backdrop-blur-sm" 
                  data-testid="button-explore-jobs"
                >
                  Explore Jobs
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-background/10 backdrop-blur-sm border border-white/10 rounded-lg p-6"
                    data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <p className="text-sm text-gray-300">{stat.label}</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4" data-testid="text-features-title">
              Why TaskGrid?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Traditional freelance platforms charge high fees, delay payments, and lack transparency. 
              TaskGrid solves this with blockchain technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <ArrowRightLeft className="h-3 w-3 mr-1" />
              Powered by SideShift API
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Multi-Currency Payment System
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              TaskGrid integrates SideShift API to enable seamless cryptocurrency conversions.
              Pay in any supported coin, receive in USDC instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>100+ Coins Supported</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Accept payments in Bitcoin, Ethereum, MATIC, and 100+ other cryptocurrencies
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Instant Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  All payments automatically converted to USDC for stability and consistency
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-Time Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get live conversion rates and execute swaps instantly through SideShift
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">
                  Powered by Polygon
                </Badge>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  <ArrowRightLeft className="h-3 w-3 mr-1" />
                  SideShift API
                </Badge>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6" data-testid="text-benefits-title">
                Everything you need for trustless freelancing
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3" data-testid={`benefit-${index}`}>
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <Link href="/find-work">
                  <Button size="lg" data-testid="button-get-started">
                    Get Started
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" data-testid="button-learn-more">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Post or Find Jobs</h3>
                    <p className="text-muted-foreground">Clients post tasks, freelancers browse opportunities</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Secure Escrow</h3>
                    <p className="text-muted-foreground">Funds locked in smart contract until work verified</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Complete & Get Paid</h3>
                    <p className="text-muted-foreground">Auto-release payment + mint proof-of-work NFT</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SiPolygon className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Powered by Polygon PoS
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 TaskGrid. Decentralized freelancing for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
