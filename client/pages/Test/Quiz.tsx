import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
}

interface AssessmentData {
  skill: string;
  difficulty: string;
  questions: Question[];
}

const shuffleArray = (array: string[]): string[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[currentIndex], array[randomIndex]];
  }
  return array;
};

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  
  const { skill, difficulty } = (location.state || { skill: "Java", difficulty: "Basic" }) as { skill: string, difficulty: string };

  useEffect(() => {
    // Map the user-selected difficulty to the quiz difficulty level
    let quizDifficulty = "";
    if (difficulty === "Medium") {
      quizDifficulty = "Basic";
    } else if (difficulty === "Advanced") {
      quizDifficulty = "Medium";
    } else {
      // If "Basic" was somehow selected here, we will not proceed.
      // This is an extra safeguard as the modal should already handle it.
      setError("No quiz available for 'Basic' difficulty level.");
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/quiz/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skill, difficulty: quizDifficulty }), // Use the mapped difficulty
        });

        if (!response.ok) {
          throw new Error('Failed to fetch questions.');
        }

        const data: AssessmentData = await response.json();
        setQuestions(data.questions);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [skill, difficulty]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      const correctOption = currentQuestion.options[currentQuestion.options.length - 1];
      const optionsToShuffle = [...currentQuestion.options];
      setShuffledOptions(shuffleArray(optionsToShuffle));
    }
  }, [questions, currentQuestionIndex]);

  const handleAnswerClick = (selectedOption: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctOption = currentQuestion.options[currentQuestion.options.length - 1];
    
    if (selectedOption === correctOption) {
      setScore(score + 1);
    }
    
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: selectedOption });
    
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(nextQuestionIndex);
      }, 500);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    }
  };

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

  const handleGoToRoadmap = () => {
    const roadmapPath = getRoadmapPath(skill);
    navigate(roadmapPath);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-4">
        <h2 className="text-xl font-bold mb-4">Loading Quiz...</h2>
        <div className="space-y-4 w-full max-w-xl">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-500">Error Loading Quiz</h2>
        <p className="text-sm text-center text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-4">
        <Card className="w-full max-w-xl text-center">
          <CardHeader>
            <CardTitle>Quiz Complete!</CardTitle>
            <CardDescription className="text-sm">Your score is:</CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className="text-6xl font-extrabold text-blue-600 mb-4">{score} / {questions.length}</h1>
            {score >= 6 ? (
              <div className="space-y-4">
                <p className="text-lg font-semibold text-green-600">Congratulations! You're ready to proceed to the roadmap.</p>
                <Button onClick={handleGoToRoadmap} className="bg-green-600 hover:bg-green-700 text-white">Go to Roadmap</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg font-semibold text-red-600">Better luck next time. We recommend reviewing the basics before trying again.</p>
                <Button onClick={() => window.location.reload()} variant="outline">Retake Quiz</Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center">
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
          <CardDescription className="text-lg text-center font-semibold text-foreground">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shuffledOptions.map((option, index) => (
            <Button
              key={index}
              className={`w-full text-left justify-start transition-all ${
                userAnswers[currentQuestionIndex] 
                  ? userAnswers[currentQuestionIndex] === option && option === currentQuestion.options[currentQuestion.options.length - 1]
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : userAnswers[currentQuestionIndex] === option
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
              onClick={() => handleAnswerClick(option)}
              disabled={!!userAnswers[currentQuestionIndex]}
            >
              {userAnswers[currentQuestionIndex] && (
                userAnswers[currentQuestionIndex] === option && option === currentQuestion.options[currentQuestion.options.length - 1] 
                  ? <CheckCircle2 className="mr-2 h-4 w-4" /> 
                  : userAnswers[currentQuestionIndex] === option && option !== currentQuestion.options[currentQuestion.options.length - 1]
                    ? <XCircle className="mr-2 h-4 w-4" />
                    : null
              )}
              {option}
            </Button>
          ))}
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Progress: {Math.round(((currentQuestionIndex) / questions.length) * 100)}%
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizPage;