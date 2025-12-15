import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ArrowRightLeft, Zap, TrendingUp, Info, Copy, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const BASE_CURRENCY = "USDC";

export default function CoinConverter() {
  const { toast } = useToast();
  const [fromCoin, setFromCoin] = useState("MATIC");
  const [toCoin, setToCoin] = useState(BASE_CURRENCY);
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<any>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch available coins
  const { data: coinsData, isLoading: coinsLoading } = useQuery({
    queryKey: ["/api/sideshift/coins"],
    queryFn: () => apiRequest("GET", "/api/sideshift/coins"),
  });

  const availableCoins = coinsData?.coins || [
    { id: "USDC", name: "USD Coin", symbol: "USDC", network: "POLYGON" },
    { id: "MATIC", name: "Polygon", symbol: "MATIC", network: "POLYGON" },
    { id: "ETH", name: "Ethereum", symbol: "ETH", network: "ETHEREUM" },
    { id: "BTC", name: "Bitcoin", symbol: "BTC", network: "BITCOIN" },
    { id: "USDT", name: "Tether", symbol: "USDT", network: "POLYGON" },
  ];

  // Get quote when amount or coins change
  useEffect(() => {
    const fetchQuote = async () => {
      if (!amount || parseFloat(amount) <= 0 || fromCoin === toCoin) {
        setQuote(null);
        return;
      }

      setIsLoadingQuote(true);
      try {
        const result = await apiRequest("GET", "/api/sideshift/quote", {
          depositCoin: fromCoin,
          settleCoin: toCoin,
          depositAmount: amount,
        });
        setQuote(result);
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuote(null);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    const timeoutId = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [fromCoin, toCoin, amount]);

  const swapCoins = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const createShiftMutation = useMutation({
    mutationFn: async (data: { quoteId: string; settleAddress: string }) => {
      return await apiRequest("POST", "/api/sideshift/shift", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Shift Created!",
        description: `Deposit to: ${data.depositAddress}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create shift. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateShift = () => {
    if (!quote || !quote.id) {
      toast({
        title: "No Quote",
        description: "Please wait for quote to load",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you'd get this from the user's wallet
    const settleAddress = prompt("Enter your wallet address to receive funds:");
    if (!settleAddress) return;

    createShiftMutation.mutate({
      quoteId: quote.id,
      settleAddress,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            Powered by SideShift API
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">
            Cryptocurrency Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert any cryptocurrency to another instantly using SideShift
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Convert Coins</CardTitle>
                <CardDescription>
                  Get real-time quotes and convert cryptocurrencies instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* From Coin */}
                <div className="space-y-2">
                  <Label>From</Label>
                  <div className="flex gap-2">
                    <Select value={fromCoin} onValueChange={setFromCoin} disabled={coinsLoading}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCoins.map((coin: any) => (
                          <SelectItem key={coin.id} value={coin.id}>{coin.symbol} ({coin.name})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={swapCoins}
                    className="rounded-full"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Coin */}
                <div className="space-y-2">
                  <Label>To</Label>
                  <Select value={toCoin} onValueChange={setToCoin} disabled={coinsLoading}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCoins.map((coin: any) => (
                        <SelectItem key={coin.id} value={coin.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{coin.symbol}</span>
                            <span className="text-xs text-muted-foreground">({coin.name})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                    </Select>
                </div>

                {/* Quote Display */}
                {amount && parseFloat(amount) > 0 && fromCoin !== toCoin && (
                  <div className="space-y-4">
                    {isLoadingQuote ? (
                      <div className="space-y-2">
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : quote ? (
                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">You Send:</span>
                              <span>{amount} {fromCoin}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">You Receive:</span>
                              <span className="text-primary font-bold">
                                {parseFloat(quote.settleAmount || "0").toFixed(6)} {toCoin}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Rate:</span>
                              <span>1 {fromCoin} = {parseFloat(quote.rate || "0").toFixed(6)} {toCoin}</span>
                            </div>
                            {quote.expiresAt && (
                              <div className="text-xs text-muted-foreground">
                                Quote expires: {new Date(quote.expiresAt).toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <AlertDescription>
                          Unable to fetch quote. Please try again.
                        </AlertDescription>
                      </Alert>
                    )}

                    {quote && (
                      <Button
                        className="w-full"
                        onClick={handleCreateShift}
                        disabled={createShiftMutation.isPending}
                      >
                        {createShiftMutation.isPending ? "Creating..." : "Create Swap"}
                      </Button>
                    )}
                  </div>
                )}

                {createShiftMutation.data && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold">Deposit Address:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs bg-muted p-2 rounded break-all">
                            {createShiftMutation.data.depositAddress}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(createShiftMutation.data.depositAddress)}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Send {amount} {fromCoin} to this address to complete the swap
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Info className="h-5 w-5" />
                  <h3 className="font-semibold">How It Works</h3>
                </div>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">1.</span>
                    <span>Select coins and enter amount</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">2.</span>
                    <span>Get real-time conversion quote</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">3.</span>
                    <span>Create swap and get deposit address</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">4.</span>
                    <span>Send funds and receive converted coins</span>
                  </li>
                </ol>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="h-5 w-5" />
                  <h3 className="font-semibold">SideShift Integration</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  TaskGrid uses <strong>SideShift API</strong> to enable seamless cryptocurrency conversions. 
                  This allows job posters to pay in any coin while freelancers receive payments in {BASE_CURRENCY}.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

