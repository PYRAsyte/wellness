import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { symptomSchema } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SymptomFormData = {
  name: string;
  severity: number;
  notes: string;
};

export default function SymptomLogger() {
  const { toast } = useToast();
  const form = useForm<SymptomFormData>({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      name: "",
      severity: 1,
      notes: "",
    },
  });

  const { data: symptoms } = useQuery({
    queryKey: ["/api/symptoms"],
  });

  const mutation = useMutation({
    mutationFn: async (data: SymptomFormData) => {
      const res = await apiRequest("POST", "/api/symptoms", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/symptoms"] });
      toast({
        title: "Symptom logged",
        description: "Your symptom has been recorded.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptom Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity (1-5)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 - Mild</SelectItem>
                      <SelectItem value="2">2 - Light</SelectItem>
                      <SelectItem value="3">3 - Moderate</SelectItem>
                      <SelectItem value="4">4 - Severe</SelectItem>
                      <SelectItem value="5">5 - Extreme</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Log Symptom"}
            </Button>
          </form>
        </Form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Symptoms</h3>
        <div className="space-y-4">
          {symptoms?.map((symptom: any) => (
            <div
              key={symptom.id}
              className="p-4 border rounded-lg bg-background/50"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{symptom.name}</h4>
                <span className="text-sm text-muted-foreground">
                  Severity: {symptom.severity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{symptom.notes}</p>
              <time className="text-xs text-muted-foreground mt-2 block">
                {new Date(symptom.date).toLocaleDateString()}
              </time>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
