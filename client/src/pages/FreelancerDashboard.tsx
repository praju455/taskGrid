import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { requireAuthRedirect, getAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { JobCard } from "@/components/JobCard";
import { useQuery } from "@tanstack/react-query";
import type { Job, User } from "@shared/schema";

export default function FreelancerDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("browse");
  const auth = getAuth();

  useEffect(() => { requireAuthRedirect(setLocation); }, []);

  const { data: jobs } = useQuery<(Job & { client: User; _count: { applications: number } })[]>({
    queryKey: ["/api/jobs"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Freelancer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant={activeTab === 'browse' ? 'default' : 'outline'} className="w-full" onClick={() => setActiveTab('browse')}>Browse Jobs</Button>
                <Button variant={activeTab === 'applications' ? 'default' : 'outline'} className="w-full" onClick={() => setActiveTab('applications')}>My Applications</Button>
                <Button variant={activeTab === 'profile' ? 'default' : 'outline'} className="w-full" onClick={() => setActiveTab('profile')}>My Profile</Button>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="hidden" />

              <TabsContent value="browse" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-heading font-bold">Browse Jobs</h1>
                  <Link href="/find-work"><Button variant="outline">Open Filters</Button></Link>
                </div>
                <div className="space-y-4">
                  {jobs && jobs.length > 0 ? jobs.map(j => (
                    <JobCard key={j.id} job={j} />
                  )) : (
                    <Card className="p-8 text-center"><p>No jobs yet. Check back soon.</p></Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="applications" className="space-y-4">
                <Card className="p-8 text-center"><p>Applications will appear here after you apply.</p></Card>
              </TabsContent>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Email: {auth?.email || "-"}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}


