import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [role, setRole] = useState<'freelancer' | 'poster'>("freelancer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const r = localStorage.getItem('tg_role') as 'freelancer' | 'poster' | null;
    if (r) setRole(r);
  }, []);

  const submit = () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }
    const emailRoleMapRaw = localStorage.getItem("tg_email_role_map") || "{}";
    const emailRoleMap = JSON.parse(emailRoleMapRaw) as Record<string, string>;
    const existingRole = emailRoleMap[email];
    if (mode === 'signup' && existingRole && existingRole !== role) {
      alert(`This email is already registered as ${existingRole}. Use a different email.`);
      return;
    }
    if (mode === 'signup') {
      emailRoleMap[email] = role;
      localStorage.setItem("tg_email_role_map", JSON.stringify(emailRoleMap));
    } else {
      if (existingRole && existingRole !== role) {
        alert(`This email is registered as ${existingRole}. Switch role to continue.`);
        return;
      }
      if (!existingRole) {
        alert("No account found for this email. Please sign up.");
        return;
      }
    }
    localStorage.setItem('tg_auth_user', JSON.stringify({ email, role }));
    localStorage.setItem('tg_role', role);
    if (role === 'freelancer') {
      setLocation('/onboarding/freelancer');
    } else {
      setLocation('/onboarding/poster');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{mode === 'signup' ? 'Create your account' : 'Sign in'}</CardTitle>
            <CardDescription>Choose your role and continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant={role === 'freelancer' ? 'default' : 'outline'} onClick={() => setRole('freelancer')} className="flex-1">Freelancer</Button>
              <Button variant={role === 'poster' ? 'default' : 'outline'} onClick={() => setRole('poster')} className="flex-1">Job Poster</Button>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={submit}>{mode === 'signup' ? 'Sign Up' : 'Sign In'}</Button>
              <Button variant="outline" className="flex-1" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
                {mode === 'signup' ? 'Have an account? Sign In' : 'New here? Sign Up'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


