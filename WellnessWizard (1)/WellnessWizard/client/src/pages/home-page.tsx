import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import HealthSurvey from "@/components/health-survey";
import { FileText, Dumbbell, Activity, LineChart } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const hasHealthProfile = user?.healthProfile !== null;

  if (!hasHealthProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Welcome to HealthTrack</h1>
          <HealthSurvey />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome, {user.username}!</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Track Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Log your daily activities and workouts.</p>
              <Button onClick={() => setLocation("/dashboard")} variant="outline">
                Start Tracking
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                View Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Check your health and fitness progress.</p>
              <Button onClick={() => setLocation("/dashboard")} variant="outline">
                View Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Workout Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Access your personalized workout plans.</p>
              <Button onClick={() => setLocation("/dashboard")} variant="outline">
                View Plans
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Health Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Track symptoms and health concerns.</p>
              <Button onClick={() => setLocation("/dashboard")} variant="outline">
                Log Symptoms
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
