import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Experience = "Basic" | "Medium" | "Advanced";

const SKILL_OPTIONS = [
  "Cloud Computing",
  "AI / Machine Learning",
  "Data Science",
  "Full Stack Development (Java)",
  "Full Stack Development (DotNet)",
] as const;

export default function Assessment() {
  const navigate = useNavigate(); // Initialize the navigate hook
  const [skill, setSkill] = useState<string>("");
  const [experience, setExperience] = useState<Experience | "">("");

  const canStartQuiz = useMemo(() => !!skill && !!experience, [skill, experience]);

  const handleStartQuiz = () => {
    if (canStartQuiz) {
      // Navigate to the quiz page and pass the selected data via state
      navigate('/quiz', { state: { skill, difficulty: experience } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle>Start Your Career Assessment</CardTitle>
          <CardDescription>
            Choose your skill and experience level to begin the quiz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select a Skill</label>
            <Select value={skill} onValueChange={setSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a skill" />
              </SelectTrigger>
              <SelectContent>
                {SKILL_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Experience Level</label>
            <Select value={experience} onValueChange={(val) => setExperience(val as Experience | "")}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a level" />
              </SelectTrigger>
              <SelectContent>
                {["Basic", "Medium", "Advanced"].map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleStartQuiz} disabled={!canStartQuiz} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}