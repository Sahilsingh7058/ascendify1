import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export type Experience = "Basic" | "Medium" | "Advanced";

const SKILL_OPTIONS = [
  "Cloud Computing",
  "AI / Machine Learning",
  "Data Science",
  "Full Stack Development (Java)",
  "Full Stack Development (DotNet)",
] as const;

const TAGS_BY_SKILL: Record<string, string[]> = {
  "AI / Machine Learning": [
    "TensorFlow",
    "PyTorch",
    "Scikit-Learn",
    "Pandas",
    "NLP",
    "Computer Vision",
  ],
  "Cloud Computing": [
    "AWS",
    "Azure",
    "GCP",
    "CI/CD",
    "Kubernetes",
    "Terraform",
  ],
  "Data Science": [
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "SQL",
    "Statistics",
  ],
  "Full Stack Development (Java)": [
    "Spring Boot",
    "Hibernate",
    "REST APIs",
    "Docker",
    "PostgreSQL",
    "Microservices",
  ],
  "Full Stack Development (DotNet)": [
    ".NET Core",
    "Entity Framework",
    "REST APIs",
    "Azure",
    "SQL Server",
    "Microservices",
  ],
};

const ROADMAPS_BY_SKILL: Record<string, string> = {
  "AI / Machine Learning": "/roadmaps/ml",
  "Cloud Computing": "/roadmaps/aws",
  "Data Science": "/roadmaps/datascience",
  "Full Stack Development (Java)": "/roadmaps/java",
  "Full Stack Development (DotNet)": "/roadmaps/dotnet",
};

interface MultiStepAssessmentModalProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}

export default function MultiStepAssessmentModal({ open, onOpenChange }: MultiStepAssessmentModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [skill, setSkill] = useState<string>("");
  const [experience, setExperience] = useState<Experience | "">("");
  const [tags, setTags] = useState<string[]>([]);
  
  const tagsForSkill = useMemo(() => TAGS_BY_SKILL[skill] || [], [skill]);
  const progress = ((step - 1) / 4) * 100;

  function resetAll() {
    setStep(1);
    setName("");
    setSkill("");
    setExperience("");
    setTags([]);
  }

  function handleClose(next: boolean) {
    onOpenChange(next);
    if (!next) {
      resetAll();
    }
  }

  function nextStep() {
    setStep((s) => Math.min(5, s + 1));
  }
  function prevStep() {
    setStep((s) => Math.max(1, s - 1));
  }

  const canNext = useMemo(() => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return !!skill;
    if (step === 3) return !!experience;
    if (step === 4) return true;
    return true;
  }, [step, name, skill, experience]);

  function toggleTag(t: string) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  // Helper function to map skill to roadmap path
  const getRoadmapPath = (selectedSkill: string) => {
    switch (selectedSkill) {
      case "Full Stack Development (Java)":
        return "/roadmaps/java";
      case "Cloud Computing":
        return "/roadmaps/aws";
      case "AI / Machine Learning":
        return "/roadmaps/ml";
      case "Data Science":
        return "/roadmaps/datascience";
      case "Full Stack Development (DotNet)":
        return "/roadmaps/dotnet";
      default:
        return "/roadmaps";
    }
  };

  function submit() {
    if (experience === "Basic") {
      // Get the specific roadmap path based on the selected skill
      const roadmapPath = getRoadmapPath(skill);
      // Navigate to the specific roadmap page
      navigate(roadmapPath);
      onOpenChange(false);
      return;
    }

    // Otherwise, proceed to the quiz
    navigate('/quiz', { state: { skill, difficulty: experience, name, tags } });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center">Career Assessment</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center border",
                    i <= step ? "bg-blue-600 text-white border-blue-600" : "bg-background text-foreground/60",
                  )}
                >
                  {i}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 h-1 w-full rounded bg-muted overflow-hidden">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-xl font-semibold text-center">What should we call you?</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="hover:border-blue-300 focus-visible:ring-blue-600" />
                </div>
              </motion.div>
            ) : step === 2 ? (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-xl font-semibold text-center">Choose your main skill</h3>
                <div className="space-y-2">
                  <Label>Skill</Label>
                  <Select value={skill} onValueChange={setSkill}>
                    <SelectTrigger className="hover:border-blue-300 focus-visible:ring-blue-600">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            ) : step === 3 ? (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-xl font-semibold text-center">Select your experience level</h3>
                <RadioGroup value={experience} onValueChange={(v) => setExperience(v as Experience)} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  {["Basic", "Medium", "Advanced"].map((lvl) => (
                    <label key={lvl} className={cn("flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-colors", experience === lvl ? "border-blue-600 bg-blue-600/10" : "hover:border-blue-300")}>
                      <RadioGroupItem value={lvl} id={`exp-${lvl}`} />
                      <span className="text-sm">{lvl}</span>
                    </label>
                  ))}
                </RadioGroup>
              </motion.div>
            ) : step === 4 ? (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-xl font-semibold text-center">Choose your focus areas</h3>
                <div className="text-xs text-muted-foreground text-center">{skill ? `Based on ${skill}` : "Select a skill first (previous step)."}</div>
                <div className="mt-2 flex flex-wrap gap-2 justify-center">
                  {(tagsForSkill.length ? tagsForSkill : ["General"]).map((t) => {
                    const active = tags.includes(t);
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => toggleTag(t)}
                        className={cn(
                          "px-3 py-1.5 rounded-full border text-sm transition-colors",
                          active ? "bg-blue-600 text-white border-blue-600" : "hover:border-blue-300",
                        )}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                <h3 className="text-xl font-semibold text-center">Review & Submit</h3>
                <div className="rounded-md border p-4 text-sm">
                  <div><span className="font-medium">Name:</span> {name || "—"}</div>
                  <div><span className="font-medium">Skill:</span> {skill || "—"}</div>
                  <div><span className="font-medium">Experience:</span> {experience || "—"}</div>
                  <div><span className="font-medium">Tags:</span> {tags.length ? tags.join(", ") : "—"}</div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={submit}>
                  Start Quiz
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={prevStep} disabled={step === 1 || step === 5}>
            Back
          </Button>
          {step < 5 ? (
            <Button onClick={nextStep} disabled={!canNext} className={cn("bg-blue-600 hover:bg-blue-700 text-white", !canNext && "opacity-50")}>Next</Button>
          ) : (
            <Button onClick={submit} className="bg-blue-600 hover:bg-blue-700 text-white">
              {experience === "Basic" ? "Go to Roadmaps" : "Start Quiz"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}