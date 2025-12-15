import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useLocation } from "wouter";

export default function PosterOnboarding() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [whatTheyDo, setWhatTheyDo] = useState("");
  const [whatTheyWant, setWhatTheyWant] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = () => setWalletConnected(true);

  const saveProfile = () => {
    if (!email) {
      alert("Email is required");
      return;
    }
    const emailRoleMapRaw = localStorage.getItem("tg_email_role_map") || "{}";
    const emailRoleMap = JSON.parse(emailRoleMapRaw) as Record<string, string>;
    const existingRole = emailRoleMap[email];
    if (existingRole && existingRole !== "poster") {
      alert("This email is already registered as Freelancer. Use a different email.");
      return;
    }
    emailRoleMap[email] = "poster";
    localStorage.setItem("tg_email_role_map", JSON.stringify(emailRoleMap));
    localStorage.setItem("tg_role", "poster");
    localStorage.setItem("tg_poster_profile", JSON.stringify({ name, email, company, whatTheyDo, whatTheyWant }));
    setLocation("/dashboard/poster");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Job Poster Onboarding</CardTitle>
            <CardDescription>Tell us about you and what you want to hire for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="company">Company / DAO</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="wallet">Wallet</Label>
                <Button className="w-full" variant={walletConnected ? "secondary" : "default"} onClick={connectWallet}>
                  {walletConnected ? "Wallet Connected" : "Connect Wallet"}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="do">What do you do?</Label>
              <Textarea id="do" value={whatTheyDo} onChange={(e) => setWhatTheyDo(e.target.value)} className="min-h-24" />
            </div>
            <div>
              <Label htmlFor="want">What do you want to hire?</Label>
              <Textarea id="want" value={whatTheyWant} onChange={(e) => setWhatTheyWant(e.target.value)} className="min-h-24" />
            </div>

            <div className="pt-2">
              <Button className="w-full" onClick={saveProfile}>Save & Go to Post Job</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


