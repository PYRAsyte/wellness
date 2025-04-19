import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useLocation } from "wouter";
import { ActivitySquare, Heart } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex">
      <div className="flex-1 flex items-center justify-center p-6">
        <Tabs defaultValue="login" className="w-full max-w-md">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm onSubmit={(data) => loginMutation.mutate(data)} />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm onSubmit={(data) => registerMutation.mutate(data)} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-primary p-12">
        <div className="max-w-lg text-primary-foreground">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="h-12 w-12" />
            <h1 className="text-4xl font-bold">HealthTrack</h1>
          </div>
          <p className="text-xl mb-6">
            Your personal health companion for tracking fitness, monitoring symptoms,
            and achieving your wellness goals.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Feature icon={ActivitySquare} title="Activity Tracking" 
              description="Log your workouts and daily activities" />
            <Feature icon={Heart} title="Health Monitoring"
              description="Track symptoms and vital signs" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSubmit }: { onSubmit: (data: InsertUser) => void }) {
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input {...form.register("username")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input type="password" {...form.register("password")} />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function RegisterForm({ onSubmit }: { onSubmit: (data: InsertUser) => void }) {
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input {...form.register("username")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input type="password" {...form.register("password")} />
          </div>
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Feature({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="h-6 w-6 shrink-0" />
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-primary-foreground/80 text-sm">{description}</p>
      </div>
    </div>
  );
}
