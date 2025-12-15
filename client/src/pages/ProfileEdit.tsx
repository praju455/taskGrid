import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function ProfileEdit() {
  const auth = getAuth();
  const [, setLocation] = useLocation();
  const isFreelancer = auth?.role === 'freelancer';
  const key = isFreelancer ? 'tg_freelancer_profile' : 'tg_poster_profile';
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      setForm(raw ? JSON.parse(raw) : {});
    } catch { setForm({}); }
  }, [key]);

  const save = () => {
    localStorage.setItem(key, JSON.stringify(form));
    setLocation(auth?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/poster');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={form.about || ''} onChange={(e) => setForm({ ...form, about: e.target.value })} className="min-h-24" />
            </div>
            {isFreelancer ? (
              <div>
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input id="skills" value={form.skills || ''} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              </div>
            ) : (
              <div>
                <Label htmlFor="company">Company / DAO</Label>
                <Input id="company" value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
            )}
            <Button onClick={save}>Save</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


