import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Activity, Clock, Dumbbell } from "lucide-react";

export default function WorkoutPlan() {
  const { user } = useAuth();

  const getWorkoutPlan = () => {
    const goals = user?.healthProfile?.goals || [];
    if (goals.includes("weight loss")) {
      return cardioFocusedPlan;
    } else if (goals.includes("muscle gain")) {
      return strengthFocusedPlan;
    }
    return balancedPlan;
  };

  const plan = getWorkoutPlan();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plan.map((workout, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                {workout.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {workout.duration} minutes
                </div>
                <div className="space-y-2">
                  {workout.exercises.map((exercise, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span>
                        {exercise.name} - {exercise.sets}x{exercise.reps}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const cardioFocusedPlan = [
  {
    title: "Monday - HIIT",
    duration: 45,
    exercises: [
      { name: "Jump Rope", sets: 4, reps: "1 min" },
      { name: "Burpees", sets: 4, reps: 15 },
      { name: "Mountain Climbers", sets: 4, reps: 30 },
      { name: "Jumping Jacks", sets: 4, reps: 30 },
    ],
  },
  {
    title: "Wednesday - Cardio",
    duration: 40,
    exercises: [
      { name: "Running", sets: 1, reps: "30 min" },
      { name: "Cycling", sets: 1, reps: "10 min" },
    ],
  },
  {
    title: "Friday - Circuit",
    duration: 50,
    exercises: [
      { name: "Squat Jumps", sets: 3, reps: 15 },
      { name: "Push-ups", sets: 3, reps: 12 },
      { name: "High Knees", sets: 3, reps: "30 sec" },
      { name: "Plank", sets: 3, reps: "1 min" },
    ],
  },
];

const strengthFocusedPlan = [
  {
    title: "Monday - Upper Body",
    duration: 60,
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8 },
      { name: "Rows", sets: 4, reps: 10 },
      { name: "Shoulder Press", sets: 3, reps: 12 },
      { name: "Bicep Curls", sets: 3, reps: 12 },
    ],
  },
  {
    title: "Wednesday - Lower Body",
    duration: 60,
    exercises: [
      { name: "Squats", sets: 4, reps: 8 },
      { name: "Deadlifts", sets: 4, reps: 8 },
      { name: "Lunges", sets: 3, reps: 12 },
      { name: "Calf Raises", sets: 3, reps: 15 },
    ],
  },
  {
    title: "Friday - Full Body",
    duration: 50,
    exercises: [
      { name: "Pull-ups", sets: 3, reps: 8 },
      { name: "Dips", sets: 3, reps: 10 },
      { name: "Romanian Deadlifts", sets: 3, reps: 12 },
      { name: "Core Work", sets: 3, reps: "1 min" },
    ],
  },
];

const balancedPlan = [
  {
    title: "Monday - Full Body",
    duration: 45,
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: 15 },
      { name: "Push-ups", sets: 3, reps: 10 },
      { name: "Walking Lunges", sets: 3, reps: 10 },
      { name: "Plank", sets: 3, reps: "30 sec" },
    ],
  },
  {
    title: "Wednesday - Cardio",
    duration: 30,
    exercises: [
      { name: "Brisk Walking", sets: 1, reps: "20 min" },
      { name: "Light Jogging", sets: 1, reps: "10 min" },
    ],
  },
  {
    title: "Friday - Strength",
    duration: 40,
    exercises: [
      { name: "Dumbbell Rows", sets: 3, reps: 12 },
      { name: "Glute Bridges", sets: 3, reps: 15 },
      { name: "Wall Sits", sets: 3, reps: "30 sec" },
      { name: "Crunches", sets: 3, reps: 15 },
    ],
  },
];
