import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Award, 
  Briefcase, 
  DollarSign, 
  Edit3, 
  ExternalLink,
  Shield
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { User, WorkNft } from "@shared/schema";

export default function Profile() {
  const [, params] = useRoute("/profile/:wallet?");
  const walletAddress = params?.wallet || "0x742d35Cc6634C0532925a3b844Bc9e7595E8f3";

  const { data: user, isLoading } = useQuery<User & { nfts: (WorkNft & { client: User })[] }>({
    queryKey: ["/api/users", walletAddress],
  });

  const mockUser = {
    id: "1",
    walletAddress,
    username: "alexweb3",
    bio: "Full-stack developer specializing in Web3 and blockchain applications. 5 years of experience building decentralized platforms.",
    avatar: "",
    skills: ["React", "TypeScript", "Solidity", "Node.js", "Web3.js", "UI/UX Design"],
    reputationScore: 95,
    totalEarned: "2450.50",
    totalSpent: "0",
    completedJobs: 12,
    rating: "4.8",
    createdAt: new Date(),
    nfts: [],
  };

  const displayUser = user || mockUser;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <Card className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={displayUser.avatar || ""} />
                    <AvatarFallback className="text-3xl">
                      {displayUser.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2" data-testid="text-username">
                          {displayUser.username}
                        </h1>
                        <p className="text-sm text-muted-foreground font-mono mb-2" data-testid="text-wallet">
                          {displayUser.walletAddress.slice(0, 6)}...{displayUser.walletAddress.slice(-4)}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{displayUser.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({displayUser.completedJobs} jobs)
                            </span>
                          </div>
                          <Badge variant="secondary" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Verified
                          </Badge>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="gap-2" data-testid="button-edit-profile">
                        <Edit3 className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>

                    {displayUser.bio && (
                      <p className="text-muted-foreground mb-4" data-testid="text-bio">
                        {displayUser.bio}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Total Earned</p>
                          <p className="font-semibold">${displayUser.totalEarned}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Completed</p>
                          <p className="font-semibold">{displayUser.completedJobs} jobs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Reputation</p>
                          <p className="font-semibold">{displayUser.reputationScore}/100</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="skills" className="space-y-6">
              <TabsList>
                <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
                <TabsTrigger value="nfts" data-testid="tab-nfts">Work NFTs</TabsTrigger>
                <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {displayUser.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm" data-testid={`skill-${index}`}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nfts">
                {!displayUser.nfts || displayUser.nfts.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 mx-auto flex items-center justify-center">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">No Work NFTs Yet</h3>
                      <p className="text-muted-foreground">
                        Complete jobs to earn proof-of-work NFTs
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayUser.nfts.map((nft) => (
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
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {new Date(nft.createdAt).toLocaleDateString()}
                            </span>
                            {nft.polygonScanUrl && (
                              <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                                <ExternalLink className="h-3 w-3" />
                                View
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 pb-4 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">John Doe</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Excellent work on the landing page! Very professional and delivered on time.
                        </p>
                        <p className="text-xs text-muted-foreground">2 weeks ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">Sarah Miller</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Great communication and quality work. Would hire again!
                        </p>
                        <p className="text-xs text-muted-foreground">1 month ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
