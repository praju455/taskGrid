import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyJobs() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <h1 className="text-2xl font-heading font-bold">My Jobs</h1>
        <Card>
          <CardHeader><CardTitle>Posted Jobs</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Jobs you post will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


