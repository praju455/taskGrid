import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Search, Filter, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Job, User } from "@shared/schema";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { requireAuthRedirect } from "@/lib/auth";

const categories = [
  "All Categories",
  "Design",
  "Development",
  "Writing",
  "Marketing",
  "Video & Animation",
  "Music & Audio",
];

export default function FindWork() {
  const [, setLocation] = useLocation();
  useEffect(() => { requireAuthRedirect(setLocation); }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [budgetRange, setBudgetRange] = useState([0, 10000]);
  const [aiSuggestedOnly, setAiSuggestedOnly] = useState(false);
  const [verifiedClientsOnly, setVerifiedClientsOnly] = useState(false);

  const { data: jobs, isLoading } = useQuery<(Job & { client: User; _count: { applications: number } })[]>({
    queryKey: ["/api/jobs", { category: category === 'All Categories' ? undefined : category, search: searchQuery || undefined }],
  });

  const filteredJobs = jobs?.filter(job => {
    const matchesBudget = parseFloat(job.budget) >= budgetRange[0] && parseFloat(job.budget) <= budgetRange[1];
    return matchesBudget;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2" data-testid="text-page-title">
            Find Work
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse available jobs and start earning with blockchain-powered security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <Card className="p-6 space-y-6 sticky top-20">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Filters</h2>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Budget Range (USDC)</Label>
                <div className="px-2">
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={budgetRange}
                    onValueChange={setBudgetRange}
                    data-testid="slider-budget"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>${budgetRange[0]}</span>
                  <span>${budgetRange[1]}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <Label htmlFor="ai-suggested" className="cursor-pointer">
                      AI Suggested Jobs
                    </Label>
                  </div>
                  <Switch
                    id="ai-suggested"
                    checked={aiSuggestedOnly}
                    onCheckedChange={setAiSuggestedOnly}
                    data-testid="switch-ai-suggested"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="verified-clients" className="cursor-pointer">
                    Verified Clients Only
                  </Label>
                  <Switch
                    id="verified-clients"
                    checked={verifiedClientsOnly}
                    onCheckedChange={setVerifiedClientsOnly}
                    data-testid="switch-verified-clients"
                  />
                </div>
              </div>

              <Button variant="outline" className="w-full" data-testid="button-reset-filters">
                Reset Filters
              </Button>
            </Card>
          </aside>

          <div className="lg:col-span-3">
            {aiSuggestedOnly && (
              <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">AI-Powered Recommendations</h3>
                    <p className="text-sm text-muted-foreground">
                      These jobs match your skills and past work experience based on your on-chain NFT portfolio
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">No jobs found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or check back later for new opportunities
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                  </p>
                </div>
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
