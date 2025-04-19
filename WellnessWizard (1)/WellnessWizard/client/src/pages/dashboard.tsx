import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityForm from "@/components/activity-form";
import DashboardStats from "@/components/dashboard-stats";
import WorkoutPlan from "@/components/workout-plan";
import SymptomLogger from "@/components/symptom-logger";
import HealthPrediction from "@/components/health-prediction";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.username}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview">
          <TabsList className="w-full justify-start mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Log Activity</TabsTrigger>
            <TabsTrigger value="health">Health Analysis</TabsTrigger>
            <TabsTrigger value="workouts">Workout Plans</TabsTrigger>
            <TabsTrigger value="symptoms">Health Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityForm />
          </TabsContent>

          <TabsContent value="health">
            <HealthPrediction />
          </TabsContent>

          <TabsContent value="workouts">
            <WorkoutPlan />
          </TabsContent>

          <TabsContent value="symptoms">
            <SymptomLogger />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}