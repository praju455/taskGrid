import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, DollarSign, Star, Users, Bookmark, Share2, ArrowRightLeft } from "lucide-react";
import { Link } from "wouter";
import type { Job, User } from "@shared/schema";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

interface JobCardProps {
  job: Job & { client?: User; _count?: { applications: number } };
}

export function JobCard({ job }: JobCardProps) {
  const formatDeadline = (deadline: Date) => {
    const date = new Date(deadline);
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  return (
    <Card className="hover-elevate" data-testid={`card-job-${job.id}`}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl line-clamp-2">{job.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0" data-testid={`badge-budget-${job.id}`}>
            {job.budget} {job.currency}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-base">
          {job.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs" data-testid={`skill-${job.id}-${index}`}>
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 4} more
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={job.client?.avatar || ""} />
            <AvatarFallback className="text-xs">
              {job.client?.username?.[0]?.toUpperCase() || "C"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {job.client?.username || "Client"}
          </span>
          {job.client?.rating && (
            <div className="flex items-center gap-1 ml-auto">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{job.client.rating}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDeadline(job.deadline)}</span>
          </div>
          {job._count && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{job._count.applications} applicants</span>
            </div>
          )}
        </div>

        <Link href={`/jobs/${job.id}`}>
          <Button size="sm" data-testid={`button-view-job-${job.id}`}>
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
