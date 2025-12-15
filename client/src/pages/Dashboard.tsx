import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  Briefcase, 
  DollarSign, 
  Award, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Star
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Job, User, WorkNft } from "@shared/schema";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { requireAuthRedirect } from "@/lib/auth";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  useEffect(() => { requireAuthRedirect(setLocation); }, []);
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: activeJobs } = useQuery<(Job & { client?: User; assignedFreelancer?: User })[]>({
    queryKey: ["/api/jobs/active"],
  });

  const { data: recentNfts } = useQuery<(WorkNft & { client: User })[]>({
    queryKey: ["/api/nfts/recent"],
  });

  const mockStats = {
    totalEarned: 2450.50,
    totalSpent: 0,
    activeContracts: 3,
    completedJobs: 12,
    reputationScore: 95,
    rating: 4.8,
  };

  const displayStats = stats || mockStats;

  const statCards = [
    {
      title: "Total Earned",
      value: `$${displayStats.totalEarned.toLocaleString()}`,
      icon: DollarSign,
      trend: "+12.5%",
      color: "text-green-500",
    },
    {
      title: "Active Contracts",
      value: displayStats.activeContracts,
      icon: Briefcase,
      trend: `${displayStats.activeContracts} in progress`,
      color: "text-primary",
    },
    {
      title: "Completed Jobs",
      value: displayStats.completedJobs,
      icon: CheckCircle2,
      trend: "+2 this week",
      color: "text-blue-500",
    },
    {
      title: "Reputation Score",
      value: displayStats.reputationScore,
      icon: Award,
      trend: `${displayStats.rating}/5 rating`,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2" data-testid="text-page-title">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your work, earnings, and reputation on TaskGrid
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/find-work">
              <Button variant="outline" data-testid="button-find-work">
                Find Work
              </Button>
            </Link>
            <Link href="/post-job">
              <Button data-testid="button-post-job">
                Post a Job
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover-elevate" data-testid={`card-stat-${index}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" data-testid="tab-active">
              Active Jobs
            </TabsTrigger>
            <TabsTrigger value="nfts" data-testid="tab-nfts">
              Work NFTs
            </TabsTrigger>
            <TabsTrigger value="activity" data-testid="tab-activity">
              Recent Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {!activeJobs || activeJobs.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">No Active Jobs</h3>
                  <p className="text-muted-foreground">
                    Start browsing available work or post a new job
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/find-work">
                      <Button variant="default">Find Work</Button>
                    </Link>
                    <Link href="/post-job">
                      <Button variant="outline">Post a Job</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeJobs.map((job) => (
                  <Card key={job.id} className="hover-elevate" data-testid={`card-active-job-${job.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-lg line-clamp-1">{job.title}</CardTitle>
                        <Badge variant="secondary">{job.status}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {job.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={job.client?.avatar || job.assignedFreelancer?.avatar || ""} />
                            <AvatarFallback className="text-xs">
                              {(job.client?.username || job.assignedFreelancer?.username)?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {job.client?.username || job.assignedFreelancer?.username || "User"}
                          </span>
                        </div>
                        <Badge variant="outline">
                          {job.budget} {job.currency}
                        </Badge>
                      </div>
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nfts" className="space-y-4">
            {!recentNfts || recentNfts.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 mx-auto flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">No Work NFTs Yet</h3>
                  <p className="text-muted-foreground">
                    Complete jobs to earn proof-of-work NFTs and build your on-chain resume
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentNfts.map((nft) => (
                  <Card 
                    key={nft.id} 
                    className="hover-elevate border-2 border-transparent hover:border-primary/20"
                    data-testid={`card-nft-${nft.id}`}
                  >
                    <CardHeader className="bg-gradient-to-br from-primary/10 to-blue-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <Award className="h-6 w-6 text-primary" />
                        <div className="flex items-center gap-1">
                          {[...Array(nft.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <CardTitle className="text-base line-clamp-2">{nft.jobTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Earned</span>
                        <Badge variant="secondary">
                          {nft.amount} {nft.currency}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={nft.client.avatar || ""} />
                          <AvatarFallback className="text-xs">
                            {nft.client.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {nft.client.username}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(nft.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Job Completed</p>
                    <p className="text-sm text-muted-foreground">
                      Successfully completed "Build Landing Page" and earned 150 USDC
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">NFT Minted</p>
                    <p className="text-sm text-muted-foreground">
                      Received proof-of-work NFT for completed project
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      Applied to "Design Mobile App UI"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
