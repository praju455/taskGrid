import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FindWork from "@/pages/FindWork";
import PostJob from "@/pages/PostJob";
import JobDetails from "@/pages/JobDetails";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import FreelancerOnboarding from "@/pages/FreelancerOnboarding";
import PosterOnboarding from "@/pages/PosterOnboarding";
import Auth from "@/pages/Auth";
import FreelancerDashboard from "@/pages/FreelancerDashboard";
import PosterDashboard from "@/pages/PosterDashboard";
import HowItWorks from "@/pages/HowItWorks";
import ProfileEdit from "@/pages/ProfileEdit";
import Messages from "@/pages/Messages";
import Applications from "@/pages/Applications";
import MyJobs from "@/pages/MyJobs";
import CoinConverter from "@/pages/CoinConverter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-work" component={FindWork} />
      <Route path="/post-job" component={PostJob} />
      <Route path="/jobs/:id" component={JobDetails} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/freelancer" component={FreelancerDashboard} />
      <Route path="/dashboard/poster" component={PosterDashboard} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/profile/edit" component={ProfileEdit} />
      <Route path="/messages" component={Messages} />
      <Route path="/applications" component={Applications} />
      <Route path="/my-jobs" component={MyJobs} />
      <Route path="/converter" component={CoinConverter} />
      <Route path="/profile/:wallet?" component={Profile} />
      <Route path="/onboarding/freelancer" component={FreelancerOnboarding} />
      <Route path="/onboarding/poster" component={PosterOnboarding} />
      <Route path="/auth" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
