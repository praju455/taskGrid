import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useLocation } from "wouter";

export default function FreelancerOnboarding() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = () => {
    setWalletConnected(true);
  };

  const downloadResume = () => {
    const content = resumeText || `Name: ${name}\nEmail: ${email}\nAge: ${age}\nEducation: ${education}\nExpected Salary: ${expectedSalary}\nSkills: ${skills}\nAbout: ${about}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "resume"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveProfile = () => {
    if (!email) {
      alert("Email is required");
      return;
    }
    const emailRoleMapRaw = localStorage.getItem("tg_email_role_map") || "{}";
    const emailRoleMap = JSON.parse(emailRoleMapRaw) as Record<string, string>;
    const existingRole = emailRoleMap[email];
    if (existingRole && existingRole !== "freelancer") {
      alert("This email is already registered as Job Poster. Use a different email.");
      return;
    }
    emailRoleMap[email] = "freelancer";
    localStorage.setItem("tg_email_role_map", JSON.stringify(emailRoleMap));
    localStorage.setItem("tg_role", "freelancer");
    localStorage.setItem("tg_freelancer_profile", JSON.stringify({ name, email, age, education, expectedSalary, skills, about, hasProfilePic: !!profilePic }));
    setLocation("/dashboard/freelancer");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Freelancer Onboarding</CardTitle>
            <CardDescription>Fill your details to get personalized job matches</CardDescription>
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
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="education">Education</Label>
                <Input id="education" value={education} onChange={(e) => setEducation(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="salary">Expected Salary (USDC/MATIC)</Label>
                <Input id="salary" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="about">About</Label>
              <Textarea id="about" value={about} onChange={(e) => setAbout(e.target.value)} className="min-h-24" />
            </div>

            <div>
              <Label htmlFor="resume">Manual Resume Fill (for AI resume output)</Label>
              <Textarea id="resume" value={resumeText} onChange={(e) => setResumeText(e.target.value)} className="min-h-24" placeholder="Paste or write your resume highlights here..." />
              <div className="mt-2">
                <Button variant="outline" onClick={downloadResume}>Generate & Download Resume</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="avatar">Profile Picture</Label>
                <Input id="avatar" type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files?.[0] || null)} />
              </div>
              <div className="flex items-end">
                <Button variant={walletConnected ? "secondary" : "default"} onClick={connectWallet} className="w-full">
                  {walletConnected ? "Wallet Connected" : "Connect Wallet"}
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full" onClick={saveProfile}>Save & Go to Find Work</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


