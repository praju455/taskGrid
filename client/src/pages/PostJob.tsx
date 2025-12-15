import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertJobSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { X, Plus, DollarSign, Calendar, Zap, ArrowRightLeft, Info } from "lucide-react";
import { useLocation } from "wouter";
import { requireAuthRedirect } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Alert, AlertDescription } from "@/components/ui/alert";

const jobFormSchema = insertJobSchema.extend({
  clientId: z.string().optional(),
  deadline: z.string().min(1, "Deadline is required"),
});

const categories = [
  "Design",
  "Development",
  "Writing",
  "Marketing",
  "Video & Animation",
  "Music & Audio",
  "Other",
];

const suggestedSkills = [
  "React", "TypeScript", "Node.js", "Python", "Design", "Figma",
  "Copywriting", "SEO", "Video Editing", "3D Modeling",
];

const BASE_CURRENCY = "USDC"; // All payments are converted to this

export default function PostJob() {
  const [, setLocation] = useLocation();
  useEffect(() => { requireAuthRedirect(setLocation); }, []);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [conversionRate, setConversionRate] = useState<string | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Fetch available coins from SideShift
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

  const form = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      clientId: "demo-client-id",
      title: "",
      description: "",
      category: "",
      budget: "0",
      currency: BASE_CURRENCY,
      deadline: "",
      skills: [],
    },
  });

  const selectedCurrency = form.watch("currency");
  const budgetAmount = form.watch("budget");

  // Convert currency when currency or budget changes
  useEffect(() => {
    const convertCurrency = async () => {
      if (!budgetAmount || parseFloat(budgetAmount) <= 0 || !selectedCurrency) {
        setConversionRate(null);
        setConvertedAmount(null);
        return;
      }

      if (selectedCurrency === BASE_CURRENCY) {
        setConversionRate("1.00");
        setConvertedAmount(budgetAmount);
        return;
      }

      setIsConverting(true);
      try {
        const result = await apiRequest("POST", "/api/sideshift/convert", {
          fromCoin: selectedCurrency,
          amount: budgetAmount,
          toCoin: BASE_CURRENCY,
        });

        if (result) {
          setConversionRate(result.rate);
          setConvertedAmount(result.convertedAmount);
        }
      } catch (error) {
        console.error("Conversion error:", error);
        toast({
          title: "Conversion Error",
          description: "Could not get conversion rate. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsConverting(false);
      }
    };

    const timeoutId = setTimeout(convertCurrency, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedCurrency, budgetAmount, toast]);

  const createJobMutation = useMutation({
    mutationFn: async (data: z.infer<typeof jobFormSchema>) => {
      return await apiRequest("POST", "/api/jobs", {
        ...data,
        skills: selectedSkills,
        deadline: new Date(data.deadline).toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Job Posted Successfully!",
        description: "Your job has been created and is now visible to freelancers.",
      });
      setLocation("/dashboard");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof jobFormSchema>) => {
    if (selectedSkills.length === 0) {
      toast({
        title: "Skills Required",
        description: "Please add at least one skill requirement.",
        variant: "destructive",
      });
      return;
    }
    createJobMutation.mutate(data);
  };

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
      setSelectedSkills([...selectedSkills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2" data-testid="text-page-title">
            Post a Job
          </h1>
          <p className="text-lg text-muted-foreground">
            Create a new job and connect with talented freelancers on the blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Provide clear information about the work you need done
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Build a Landing Page"
                              {...field}
                              data-testid="input-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the work in detail..."
                              className="min-h-32 resize-none"
                              {...field}
                              data-testid="input-description"
                            />
                          </FormControl>
                          <FormDescription>
                            Be specific about deliverables, timeline, and requirements
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  placeholder="100"
                                  className="pl-9"
                                  {...field}
                                  data-testid="input-budget"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Currency</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={coinsLoading}>
                              <FormControl>
                                <SelectTrigger data-testid="select-currency">
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
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
                            <FormDescription>
                              Pay in any cryptocurrency. All payments are automatically converted to {BASE_CURRENCY} via SideShift.
                            </FormDescription>
                            {selectedCurrency !== BASE_CURRENCY && budgetAmount && parseFloat(budgetAmount) > 0 && (
                              <Alert className="mt-2">
                                <ArrowRightLeft className="h-4 w-4" />
                                <AlertDescription>
                                  {isConverting ? (
                                    "Calculating conversion..."
                                  ) : conversionRate && convertedAmount ? (
                                    <>
                                      <strong>{budgetAmount} {selectedCurrency}</strong> = <strong>{parseFloat(convertedAmount).toFixed(2)} {BASE_CURRENCY}</strong>
                                      <br />
                                      <span className="text-xs text-muted-foreground">Rate: 1 {selectedCurrency} = {parseFloat(conversionRate).toFixed(6)} {BASE_CURRENCY}</span>
                                    </>
                                  ) : (
                                    "Unable to fetch conversion rate"
                                  )}
                                </AlertDescription>
                              </Alert>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deadline</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="date"
                                className="pl-9"
                                {...field}
                                data-testid="input-deadline"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label>Required Skills</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill..."
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill(skillInput);
                            }
                          }}
                          data-testid="input-skill"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => addSkill(skillInput)}
                          data-testid="button-add-skill"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {selectedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedSkills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="gap-1" data-testid={`skill-badge-${skill}`}>
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="hover-elevate rounded-full"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-3">
                        <p className="text-sm text-muted-foreground w-full">Suggestions:</p>
                        {suggestedSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="cursor-pointer hover-elevate"
                            onClick={() => addSkill(skill)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={createJobMutation.isPending}
                      data-testid="button-submit"
                    >
                      {createJobMutation.isPending ? "Creating..." : "Create Job"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="h-5 w-5" />
                  <h3 className="font-semibold">Next Steps</h3>
                </div>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">1.</span>
                    <span>Fill out job details</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">2.</span>
                    <span>Connect wallet & fund escrow</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">3.</span>
                    <span>Review applications</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">4.</span>
                    <span>Hire & collaborate</span>
                  </li>
                </ol>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <ArrowRightLeft className="h-5 w-5" />
                  <h3 className="font-semibold">Multi-Coin Payments</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Powered by <strong>SideShift API</strong>, TaskGrid accepts payments in any cryptocurrency. 
                  All payments are automatically converted to {BASE_CURRENCY} for consistency and ease of management.
                </p>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Conversion happens automatically when you fund the escrow. 
                    You pay in your preferred coin, freelancers receive {BASE_CURRENCY}.
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-muted/30">
              <h3 className="font-semibold mb-3">Tips for Success</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be clear about deliverables</li>
                <li>• Set realistic deadlines</li>
                <li>• Specify required skills</li>
                <li>• Include examples if possible</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
