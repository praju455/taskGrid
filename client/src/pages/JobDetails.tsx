import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Calendar, DollarSign, Star, Shield, Users, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Job, User, Application } from "@shared/schema";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { requireAuthRedirect } from "@/lib/auth";

export default function JobDetails() {
  const [, setLocation] = useLocation();
  useEffect(() => { requireAuthRedirect(setLocation); }, []);
  const [, params] = useRoute("/jobs/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [proposal, setProposal] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");

  const { data: job, isLoading } = useQuery<Job & { client: User; applications: (Application & { freelancer: User })[] }>({
    queryKey: ["/api/jobs", params?.id],
    enabled: !!params?.id,
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/applications", {
        jobId: params?.id,
        freelancerId: "demo-freelancer-id",
        proposal,
        estimatedDelivery,
        portfolioLink: portfolioLink || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs", params?.id] });
      toast({
        title: "Application Submitted!",
        description: "The client will review your proposal and get back to you.",
      });
      setIsApplyDialogOpen(false);
      setProposal("");
      setEstimatedDelivery("");
      setPortfolioLink("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApply = () => {
    if (!proposal.trim() || !estimatedDelivery.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    applyMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground">This job may have been removed or doesn't exist.</p>
          </Card>
        </div>
      </div>
    );
  }

  const formatDeadline = (deadline: Date) => {
    return new Date(deadline).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl sm:text-3xl mb-2" data-testid="text-job-title">
                      {job.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="secondary">{job.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {formatDeadline(job.deadline)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="default" className="text-lg px-4 py-2 shrink-0" data-testid="badge-budget">
                    {job.budget} {job.currency}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-description">
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" data-testid={`skill-${index}`}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {job.escrowFunded && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Escrow Funded</h4>
                          <p className="text-sm text-muted-foreground">
                            Funds are securely locked in a smart contract on Polygon
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {job.applications && job.applications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Applications ({job.applications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.applications.map((app) => (
                    <Card key={app.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={app.freelancer.avatar || ""} />
                          <AvatarFallback>
                            {app.freelancer.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{app.freelancer.username}</h4>
                            {app.freelancer.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{app.freelancer.rating}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{app.proposal}</p>
                          <p className="text-xs text-muted-foreground">
                            Estimated delivery: {app.estimatedDelivery}
                          </p>
                        </div>
                        <Badge variant={app.status === "accepted" ? "default" : "secondary"}>
                          {app.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={job.client.avatar || ""} />
                    <AvatarFallback>
                      {job.client.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold" data-testid="text-client-name">
                      {job.client.username}
                    </h3>
                    {job.client.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{job.client.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({job.client.completedJobs} jobs)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jobs Posted</span>
                    <span className="font-medium">{job.client.completedJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Spent</span>
                    <span className="font-medium">${job.client.totalSpent}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full gap-2" data-testid="button-apply">
                  <Send className="h-4 w-4" />
                  Apply for this Job
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Submit Your Proposal</DialogTitle>
                  <DialogDescription>
                    Explain why you're the best fit for this job
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="proposal">Proposal *</Label>
                    <Textarea
                      id="proposal"
                      placeholder="Describe your approach, relevant experience, and why you're a great fit..."
                      className="min-h-32 resize-none"
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      data-testid="input-proposal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery">Estimated Delivery Time *</Label>
                    <Input
                      id="delivery"
                      placeholder="e.g., 5 days, 2 weeks"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                      data-testid="input-delivery"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio Link (Optional)</Label>
                    <Input
                      id="portfolio"
                      type="url"
                      placeholder="https://your-portfolio.com"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      data-testid="input-portfolio"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsApplyDialogOpen(false)}
                    data-testid="button-cancel-apply"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleApply}
                    disabled={applyMutation.isPending}
                    data-testid="button-submit-proposal"
                  >
                    {applyMutation.isPending ? "Submitting..." : "Submit Proposal"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Card className="p-4 bg-muted/30">
              <h3 className="font-semibold text-sm mb-3">Job Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary">{job.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applications</span>
                  <span className="font-medium">{job.applications?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted</span>
                  <span className="font-medium">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
