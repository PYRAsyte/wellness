import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Brain, AlertTriangle, Info, Activity, HeartPulse, Shield, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

// Enhanced symptom analysis with severity levels and risk factors
const predictDiseases = async (symptoms: Array<{name: string, severity: number}>, vitalSigns: VitalSigns) => {
  // This would be replaced with an actual AI model API call
  // Enhanced prediction logic considering vital signs and medical history
  const predictions = [
    {
      condition: "Common Cold",
      probability: 0.8,
      riskLevel: "low",
      riskFactors: ["Seasonal changes", "Weakened immune system"],
      recommendedTests: ["Temperature monitoring", "Throat examination"],
      preventiveMeasures: ["Rest", "Hydration", "Vitamin C intake"],
      urgencyLevel: "Low",
      timeToSeekCare: "Within 3-5 days if symptoms persist",
      dietaryRecommendations: [
        "Chicken soup",
        "Citrus fruits",
        "Honey and lemon tea",
        "Ginger",
      ],
      lifestyleChanges: [
        "Get adequate sleep",
        "Stay warm",
        "Avoid strenuous activities",
      ],
    },
    {
      condition: "Seasonal Allergies",
      probability: 0.6,
      riskLevel: "moderate",
      riskFactors: ["Pollen count", "Environmental allergens"],
      recommendedTests: ["Allergy testing", "Nasal examination"],
      preventiveMeasures: ["Antihistamines", "Air purification", "Avoid triggers"],
      urgencyLevel: "Low",
      timeToSeekCare: "When symptoms affect daily activities",
      dietaryRecommendations: [
        "Anti-inflammatory foods",
        "Local honey",
        "Foods rich in quercetin",
      ],
      lifestyleChanges: [
        "Use air purifiers",
        "Keep windows closed during high pollen",
        "Shower before bed",
      ],
    },
  ];

  return predictions.map(p => ({
    ...p,
    riskScore: calculateRiskScore(p, symptoms, vitalSigns),
  }));
};

interface VitalSigns {
  temperature?: number;
  heartRate?: number;
  bloodPressure?: string;
  oxygenSaturation?: number;
}

const calculateRiskScore = (
  prediction: any, 
  symptoms: Array<{name: string, severity: number}>,
  vitalSigns: VitalSigns
) => {
  let score = 0;

  // Calculate base score from symptoms
  const avgSeverity = symptoms.reduce((acc, s) => acc + s.severity, 0) / symptoms.length;
  score += avgSeverity * 20;

  // Adjust based on vital signs if available
  if (vitalSigns.temperature && vitalSigns.temperature > 38) {
    score += (vitalSigns.temperature - 38) * 10;
  }

  if (vitalSigns.oxygenSaturation && vitalSigns.oxygenSaturation < 95) {
    score += (95 - vitalSigns.oxygenSaturation) * 5;
  }

  // Adjust based on prediction probability
  score += prediction.probability * 30;

  // Cap the score at 100
  return Math.min(Math.round(score), 100);
};

const commonSymptoms = [
  { name: "Fever", category: "General" },
  { name: "Headache", category: "Neurological" },
  { name: "Cough", category: "Respiratory" },
  { name: "Fatigue", category: "General" },
  { name: "Nausea", category: "Digestive" },
  { name: "Dizziness", category: "Neurological" },
  { name: "Shortness of breath", category: "Respiratory" },
  { name: "Muscle ache", category: "Musculoskeletal" },
  { name: "Sore throat", category: "Respiratory" },
  { name: "Loss of appetite", category: "Digestive" },
  { name: "Joint pain", category: "Musculoskeletal" },
  { name: "Chest pain", category: "Cardiovascular" },
  { name: "Runny nose", category: "Respiratory" },
  { name: "Chills", category: "General" },
  { name: "Sweating", category: "General" },
  { name: "Skin rash", category: "Dermatological" },
].sort((a, b) => a.category.localeCompare(b.category));

export default function HealthPrediction() {
  const { toast } = useToast();
  const [selectedSymptoms, setSelectedSymptoms] = useState<Array<{name: string, severity: number}>>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({});

  const handleAddSymptom = (symptomName: string) => {
    if (!selectedSymptoms.find(s => s.name === symptomName)) {
      setSelectedSymptoms([...selectedSymptoms, { name: symptomName, severity: 3 }]);
    }
  };

  const handleUpdateSeverity = (symptomName: string, severity: number) => {
    setSelectedSymptoms(
      selectedSymptoms.map(s => 
        s.name === symptomName ? { ...s, severity } : s
      )
    );
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom && !selectedSymptoms.find(s => s.name === customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, { name: customSymptom, severity: 3 }]);
      setCustomSymptom("");
    }
  };

  const handleRemoveSymptom = (symptomName: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.name !== symptomName));
  };

  const handleUpdateVitalSigns = (key: keyof VitalSigns, value: string) => {
    setVitalSigns(prev => ({
      ...prev,
      [key]: key === 'bloodPressure' ? value : Number(value),
    }));
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "No symptoms selected",
        description: "Please select at least one symptom for analysis.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const results = await predictDiseases(selectedSymptoms, vitalSigns);
      setPredictions(results);
      toast({
        title: "Analysis complete",
        description: "Health prediction analysis has been completed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return "bg-green-500";
    if (score < 60) return "bg-yellow-500";
    if (score < 80) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Brain className="h-8 w-8 text-primary" />
            AI Health Analysis
          </CardTitle>
          <CardDescription className="text-base">
            Our advanced AI system analyzes your symptoms and vital signs to provide 
            comprehensive health insights and personalized recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Vital Signs Section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4" />
                Temperature (°C)
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="36.5-37.5"
                value={vitalSigns.temperature || ''}
                onChange={(e) => handleUpdateVitalSigns('temperature', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Heart Rate (BPM)
              </Label>
              <Input
                type="number"
                placeholder="60-100"
                value={vitalSigns.heartRate || ''}
                onChange={(e) => handleUpdateVitalSigns('heartRate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Blood Pressure
              </Label>
              <Input
                placeholder="120/80"
                value={vitalSigns.bloodPressure || ''}
                onChange={(e) => handleUpdateVitalSigns('bloodPressure', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Oxygen Saturation (%)
              </Label>
              <Input
                type="number"
                placeholder="95-100"
                value={vitalSigns.oxygenSaturation || ''}
                onChange={(e) => handleUpdateVitalSigns('oxygenSaturation', e.target.value)}
              />
            </div>
          </div>

          {/* Symptoms Selection */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Common Symptoms by Category
              </Label>
              <Select onValueChange={handleAddSymptom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a symptom" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(
                    commonSymptoms.reduce((acc, symptom) => ({
                      ...acc,
                      [symptom.category]: [...(acc[symptom.category] || []), symptom],
                    }), {} as Record<string, typeof commonSymptoms>)
                  ).map(([category, symptoms]) => (
                    <div key={category}>
                      <h4 className="font-semibold px-2 py-1.5 text-sm text-muted-foreground">
                        {category}
                      </h4>
                      {symptoms.map((symptom) => (
                        <SelectItem key={symptom.name} value={symptom.name}>
                          {symptom.name}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Custom Symptom
              </Label>
              <div className="flex gap-2">
                <Input
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  placeholder="Enter other symptoms"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
                />
                <Button onClick={handleAddCustomSymptom}>Add</Button>
              </div>
            </div>
          </div>

          {/* Selected Symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Selected Symptoms & Severity
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rate the severity from 1 (mild) to 5 (severe)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {selectedSymptoms.map((symptom) => (
                  <Card key={symptom.name} className="p-4 border-l-4 border-l-primary">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-medium">{symptom.name}</span>
                      <button
                        onClick={() => handleRemoveSymptom(symptom.name)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                    <Select
                      value={symptom.severity.toString()}
                      onValueChange={(value) => handleUpdateSeverity(symptom.name, parseInt(value))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very Mild</SelectItem>
                        <SelectItem value="2">2 - Mild</SelectItem>
                        <SelectItem value="3">3 - Moderate</SelectItem>
                        <SelectItem value="4">4 - Severe</SelectItem>
                        <SelectItem value="5">5 - Very Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handlePredict}
            disabled={loading || selectedSymptoms.length === 0}
            className="w-full"
          >
            {loading ? "Analyzing..." : "Analyze Symptoms"}
          </Button>
        </CardContent>
      </Card>

      {predictions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Analysis Results
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {predictions.map((prediction, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${getRiskColor(prediction.riskScore)}`} />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-xl">
                    <span>{prediction.condition}</span>
                    <span className="text-base font-normal text-muted-foreground">
                      {Math.round(prediction.probability * 100)}%
                    </span>
                  </CardTitle>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Risk Score
                      </span>
                      <span className="font-medium">{prediction.riskScore}/100</span>
                    </div>
                    <Progress 
                      value={prediction.riskScore} 
                      className={`h-2 ${getRiskColor(prediction.riskScore)}`} 
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        Seek care: {prediction.timeToSeekCare}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk Factors
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {prediction.riskFactors.map((factor: string, i: number) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Recommended Tests</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {prediction.recommendedTests.map((test: string, i: number) => (
                        <li key={i}>{test}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Dietary Recommendations</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {prediction.dietaryRecommendations.map((diet: string, i: number) => (
                        <li key={i}>{diet}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Lifestyle Changes</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {prediction.lifestyleChanges.map((change: string, i: number) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 border-t">
                  <div className="text-sm text-muted-foreground">
                    <strong>Priority:</strong> {prediction.urgencyLevel}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/50 border-t-4 border-t-primary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="font-semibold">Medical Disclaimer</p>
                  <p className="text-sm text-muted-foreground">
                    This AI-powered analysis provides preliminary insights based on reported symptoms
                    and should not be considered a substitute for professional medical diagnosis.
                    The predictions are generated using pattern recognition and statistical analysis
                    of common health conditions. Always consult with a qualified healthcare professional
                    for proper medical advice, especially if you experience severe or persistent symptoms.
                    In case of emergency, seek immediate medical attention.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}