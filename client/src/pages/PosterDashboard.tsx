import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { requireAuthRedirect, getAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Job } from "@shared/schema";

export default function PosterDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("post");
  const auth = getAuth();

  useEffect(() => { requireAuthRedirect(setLocation); }, []);

  const { data: myJobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs", { status: "open" }],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Job Poster</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant={activeTab === 'post' ? 'default' : 'outline'} className="w-full" onClick={() => setActiveTab('post')}>Post a Job</Button>
                <Button variant={activeTab === 'jobs' ? 'default' : 'outline'} className="w-full" onClick={() => setActiveTab('jobs')}>My Jobs</Button>
                <Button variant={activeTab === 'profile' ? 'default' : 'outline'} className="w-full" onClick={() => setActiveTab('profile')}>Profile</Button>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="hidden" />

              <TabsContent value="post" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-heading font-bold">Post a Job</h1>
                  <Link href="/post-job"><Button>Open Job Form</Button></Link>
                </div>
                <Card className="p-8 text-center"><p>Use the job form to create a posting. It will appear in Find Work.</p></Card>
              </TabsContent>

              <TabsContent value="jobs" className="space-y-4">
                {myJobs && myJobs.length > 0 ? myJobs.map(j => (
                  <Card key={j.id} className="p-4"><div className="flex items-center justify-between"><div><p className="font-semibold">{j.title}</p><p className="text-sm text-muted-foreground">{j.status}</p></div><Link href={`/jobs/${j.id}`}><Button variant="outline">Details</Button></Link></div></Card>
                )) : <Card className="p-8 text-center"><p>No jobs yet.</p></Card>}
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


