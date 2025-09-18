import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  Code2,
  Book,
  CheckCircle,
  Clock,
  User,
  Database,
  Settings,
  Play,
  Terminal,
  Lightbulb,
  Target,
  ChevronDown,
  BookOpen,
  Zap,
  X,
  ListTree
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { getDoc } from "firebase/firestore";
import { doc as firestoreDoc, updateDoc, increment, setDoc } from "firebase/firestore";
type SectionContent = {
  [key: string]: string | string[] | { [key: string]: any };
};

type Section = {
  sectionTitle?: string;
  content?: SectionContent;
  name?: string;
  title?: string;
  what?: string;
  why?: string[] | string;
  syntax?: string;
  example?: { code?: string; output?: string[] };
  topics?: any[];
  subtopics?: any[];
  methods?: string[];
  [key: string]: any;
};

type MLDoc = {
  _id: string;
  title: string;
  goal: string;
  sections?: Section[];
  level?: string;
  topic?: string;
  subsections?: Section[];
  what?: string;
  why?: string[] | string;
  types?: { [key: string]: any };
  example?: { code?: string; output?: string[] };
  [key: string]: any;
};

type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
};

const MLCourseLearningPage: React.FC = () => {
  const [docs, setDocs] = useState<MLDoc[]>([]);
  const [selected, setSelected] = useState<{ docIdx: number; sectionIdx: number }>({ docIdx: 0, sectionIdx: 0 });
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showLevelPopup, setShowLevelPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [completedDocs, setCompletedDocs] = useState<string[]>([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [activeQuizLevel, setActiveQuizLevel] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [pendingQuizLevel, setPendingQuizLevel] = useState<string | null>(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null);
  const [quizViolated, setQuizViolated] = useState(false);
  const [progressCounts, setProgressCounts] = useState<{ basic?: number; intermediate?: number; advanced?: number }>({});
  // state additions
const [visitedKeys, setVisitedKeys] = useState<Set<string>>(new Set());
const [highestVisitedByDoc, setHighestVisitedByDoc] = useState<Record<number, number>>({});
const [userLevel, setUserLevel] = useState<"basic" | "intermediate" | "advanced" | null>(null);


const handleStartLevelQuiz = (level: string) => {
  setPendingQuizLevel(level);
  setShowViolationWarning(true);
};

// Always reset timer to 10 minutes when quiz modal opens
useEffect(() => {
  if (showQuizModal) {
    setQuizTimeLeft(10 * 60);
    setQuizStartedAt(Date.now());
  }
  // No cleanup needed
}, [showQuizModal]);

const confirmStartQuiz = async () => {
  if (!pendingQuizLevel) return;
  setShowViolationWarning(false);
  setQuizViolated(false);
  setQuizTimeLeft(10 * 60); // Always 10 minutes
  setQuizStartedAt(Date.now());
  setActiveQuizLevel(pendingQuizLevel);
  setSelectedAnswers({});
  setCurrentQuestionIdx(0);
  setQuizResult(null);
  const questions = await fetchQuizQuestions(pendingQuizLevel);
  setQuizQuestions(questions);
  setShowQuizModal(true);
  setPendingQuizLevel(null);
};
useEffect(() => {
  if (!showQuizModal || quizResult || quizViolated || quizQuestions.length === 0) return;
  if (quizTimeLeft <= 0) {
    setQuizResult({ score: 0, total: quizQuestions.length });
    return;
  }
  const timer = setInterval(() => setQuizTimeLeft((t) => t - 1), 1000);
  return () => clearInterval(timer);
}, [showQuizModal, quizTimeLeft, quizResult, quizViolated, quizQuestions.length]);

useEffect(() => {
  if (!showQuizModal) return;

  const handleBlur = () => {
    setQuizViolated(true);
    setShowQuizModal(false);
  };
  const handleContextMenu = (e: MouseEvent) => e.preventDefault();
  const handleCopy = (e: ClipboardEvent) => e.preventDefault();

  window.addEventListener("blur", handleBlur);
  window.addEventListener("contextmenu", handleContextMenu);
  window.addEventListener("copy", handleCopy);

  return () => {
    window.removeEventListener("blur", handleBlur);
    window.removeEventListener("contextmenu", handleContextMenu);
    window.removeEventListener("copy", handleCopy);
  };
}, [showQuizModal]);


// parse selected level from URL; remove authed logic
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const lvl = params.get("level");
  if (lvl === "basic" || lvl === "intermediate" || lvl === "advanced") {
    setUserLevel(lvl);
  }
}, [location.search]);

// helper: map doc.level -> progress field name
const levelKeyForDoc = (docLevel?: string) => {
  const k = (docLevel || "basic").toLowerCase();
  if (k === "basic") return "basic";
  if (k === "intermediate") return "intermediate";
  return "advanced";
};

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  });

  return () => unsubscribe();
}, []);

// mark section visited and update counters once
useEffect(() => {
  const docData = docs[selected.docIdx];
  if (!docData) return;
  const secs = docData.sections || docData.subsections || [];
  if (!secs.length) return;

  const key = `${docData._id}:${selected.sectionIdx}`;
  if (visitedKeys.has(key)) return;

  setVisitedKeys(prev => new Set(prev).add(key));
  setHighestVisitedByDoc(prev => {
    const current = prev[selected.docIdx] ?? -1;
    return { ...prev, [selected.docIdx]: Math.max(current, selected.sectionIdx) };
  });

  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const lvlKey = levelKeyForDoc(docData.level); // "basic" | "intermediate" | "advanced"
  const userRef = firestoreDoc(db, "users", uid);
//visit this section
  const maxCounts = {
    basic: 5,
    intermediate: 6,
    advanced: 5
  };
  // Only increment if not at max and progress.roadmap is 'ml'
  getDoc(userRef).then((snap) => {
    if (!snap.exists() || snap.data().progress_ml?.roadmap !== 'ml') return;
    const progress = snap.exists() ? snap.data().progress_ml || {} : {};
    const current = progress[lvlKey] || 0;
    if (current < maxCounts[lvlKey]) {
      updateDoc(userRef, {
        [`progress_ml.${lvlKey}`]: increment(1),
      })
      .then(() => {
        // Optimistically update progressCounts state for instant UI feedback
        setProgressCounts(prev => ({
          ...prev,
          [lvlKey]: (prev[lvlKey] || 0) + 1
        }));
      })
      .catch(async (error) => {
        if (error.code === 'failed-precondition') {
          try {
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists() || userSnap.data().progress_ml?.roadmap !== 'ml') return;
            const currentProgress = userSnap.data()?.progress_ml || {};
            const currentCount = currentProgress[lvlKey] || 0;
            if (currentCount >= maxCounts[lvlKey]) {
              await updateDoc(userRef, {
                [`progress_ml.${lvlKey}`]: maxCounts[lvlKey]
              });
              setProgressCounts(prev => ({
                ...prev,
                [lvlKey]: maxCounts[lvlKey]
              }));
            } else {
              await updateDoc(userRef, {
                [`progress_ml.${lvlKey}`]: increment(1)
              });
              setProgressCounts(prev => ({
                ...prev,
                [lvlKey]: (prev[lvlKey] || 0) + 1
              }));
            }
          } catch (fallbackError) {
            console.error('Error in fallback progress update:', fallbackError);
          }
        }
      });
    }
  });
}, [selected, docs, visitedKeys]);

useEffect(() => {
  const fetchProgress = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !docs.length) {
      console.log('Cannot fetch progress: missing uid or docs', { uid: !!uid, docsLength: docs.length });
      return;
    }

    try {
      const userRef = firestoreDoc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.log('User document does not exist');
        return;
      }

      const progress = userSnap.data()?.progress_ml || {};
      
      setProgressCounts({
        basic: progress.basic || 0,
        intermediate: progress.intermediate || 0,
        advanced: progress.advanced || 0,
      });
      console.log('Fetched progress and set progress counts from Firestore:', progress);
      const newVisitedKeys = new Set<string>();
      const newHighestVisitedByDoc: Record<number, number> = {};

      // For each level, get the count and mark the first N sections as visited
      const levelSectionMap: Record<string, { dIdx: number; sIdx: number; docId: string }[]> = {};

      docs.forEach((doc, dIdx) => {
        const levelKey = levelKeyForDoc(doc.level);
        const sections = doc.sections || doc.subsections || [];
        if (!levelSectionMap[levelKey]) levelSectionMap[levelKey] = [];
        for (let sIdx = 0; sIdx < sections.length; sIdx++) {
          levelSectionMap[levelKey].push({ dIdx, sIdx, docId: doc._id });
        }
      });

      Object.entries(levelSectionMap).forEach(([levelKey, sectionList]) => {
        const count = progress[levelKey] || 0;
        console.log(`Level ${levelKey}: ${count} sections completed`);
        
        for (let i = 0; i < Math.min(count, sectionList.length); i++) {
          const { dIdx, sIdx, docId } = sectionList[i];
          newVisitedKeys.add(`${docId}:${sIdx}`);
          
          if (
            typeof newHighestVisitedByDoc[dIdx] === "undefined" ||
            sIdx > newHighestVisitedByDoc[dIdx]
          ) {
            newHighestVisitedByDoc[dIdx] = sIdx;
          }
        }
      });

      console.log('Setting visited keys:', newVisitedKeys);
      console.log('Setting highest visited by doc:', newHighestVisitedByDoc);
      
      setVisitedKeys(newVisitedKeys);
      setHighestVisitedByDoc(newHighestVisitedByDoc);
      
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  // Only fetch progress after both docs are loaded and auth state is confirmed
  if (docs.length > 0 && auth.currentUser) {
    fetchProgress();
  }
}, [docs, auth.currentUser, isAuthenticated]);
  // Toggle subtopic expansion
  const toggleSubtopic = (sectionPath: string) => {
    setExpandedSubtopics(prev => ({
      ...prev,
      [sectionPath]: !prev[sectionPath]
    }));
  };

  // Helper to generate a unique key for a section's subtopics
  const getSubtopicKey = (docIdx: number, sectionIdx: number) =>
    `doc-${docIdx}-section-${sectionIdx}`;

  // Theme toggle effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // Only run on mount to set default theme

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const lvl = params.get('level');
  if (lvl === 'basic' || lvl === 'intermediate' || lvl === 'advanced') {
    setUserLevel(lvl as any);
  }
  fetch("http://localhost:8000/api/ml-course")
    .then((res) => res.json())
    .then((data) => {
      setDocs(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);

  useEffect(() => {
    const doc = docs[selected.docIdx];
    if (!doc) return;
    const secs = doc.sections || doc.subsections || [];
    if (secs.length && selected.sectionIdx === secs.length - 1) {
      setCompletedDocs((prev) => (prev.includes(doc._id) ? prev : [...prev, doc._id]));
    }
  }, [selected, docs]);

  const handleSignIn = () => {
    setShowSignIn(false);
    setIsAuthenticated(true);
    setTimeout(() => setShowLevelPopup(true), 300);
  };

  const handleSignUp = () => {
    setShowSignIn(false);
    setIsAuthenticated(true);
    setTimeout(() => setShowLevelPopup(true), 300);
  };

  const handleLevelSelect = (level: "basic" | "intermediate") => {
    setUserLevel(level);
    setShowLevelPopup(false);
  };

  const fetchQuizQuestions = async (level: string) => {
    setLoadingQuiz(true);
    try {
      const response = await fetch('http://localhost:8000/api/quiz/ml/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skill: 'machine learning',
          difficulty: level.toLowerCase(),
          num_questions: 10,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.questions || [];
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    } finally {
      setLoadingQuiz(false);
    }
  };

  const startLevelQuiz = async (level: string) => {
    setActiveQuizLevel(level);
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setQuizResult(null);
    setQuizQuestions([]);
    setShowQuizModal(true);
    setPendingQuizLevel(null);

    const questions = await fetchQuizQuestions(level);
    console.log("Fetched questions:", questions); 
    setQuizQuestions(questions);
  };

  const selectAnswer = (qIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  };

  const submitQuiz = async () => {
  if (!quizQuestions.length) return;
  let correct = 0;
  quizQuestions.forEach((q, idx) => {
    const selectedAnswer = selectedAnswers[idx];
    if (typeof selectedAnswer === 'number' && selectedAnswer === q.answer) {
      correct++;
    }
  });
  const timeUsed = quizStartedAt ? Math.floor((Date.now() - quizStartedAt) / 1000) : 10 * 60;
  const timeBonus = Math.max(0, 1 - timeUsed / (10 * 60)); // 1 if instant, 0 if full time
  const bonusPoints = Math.round(timeBonus * quizQuestions.length * 0.2); // up to 20% of total
  const score = correct + bonusPoints;
  setQuizResult({ score, total: quizQuestions.length });

  const uid = auth.currentUser?.uid;
  if (!uid || !activeQuizLevel) return;
  const pass = score / quizQuestions.length >= 0.6; // 60% threshold
  const lvl = activeQuizLevel.toLowerCase(); // "basic" | "intermediate" | "advanced"
  const userRef = firestoreDoc(db, "users", uid);

  const updates: Record<string, any> = {};
  if (lvl === "basic") {
    updates["progress_ml.basic_test_score"] = score;
    // updates["progress.basic_certificate_received"] = pass ? 1 : 0;
  } else if (lvl === "intermediate") {
    updates["progress_ml.intermediate_test_score"] = score;
    //updates["progress.intermidiate_test_score"] = score; // also set misspelled for compatibility
    // updates["progress.intermidiate_certificate_received"] = pass ? 1 : 0; // requested naming
  } else {
    updates["progress_ml.advanced_test_score"] = score;
    // updates["progress.advanced_certificate_received"] = pass ? 1 : 0;
  }

  try {
    const userSnap = await getDoc(userRef);
     if (!userSnap.exists() || userSnap.data().progress_ml?.roadmap !== 'ml') return;
     await updateDoc(userRef, {progress_ml: {...userSnap.data().progress_ml, ...updates}});
    
  } catch {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists() || userSnap.data().progress_ml?.roadmap !== 'ml') return;
    
    // ensure base structure exists if needed
    await setDoc(userRef, { progress: {} }, { merge: true });
    await updateDoc(userRef, {progress_ml: {...userSnap.data().progress_ml, ...updates}});
    
  }
};

  const nextQuestion = () => setCurrentQuestionIdx((i) => Math.min(i + 1, quizQuestions.length - 1));
  const prevQuestion = () => setCurrentQuestionIdx((i) => Math.max(0, i - 1));

  const getGroupedDocs = () => {
    const grouped = docs.reduce((acc, doc, index) => {
      const level = (doc.level || 'basic').toLowerCase();
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push({ doc, originalIndex: index });
      return acc;
    }, {} as Record<string, { doc: MLDoc; originalIndex: number }[]>);
    return grouped;
  };

  const isLevelCompleted = (level: string) => {
    const levelDocs = docs.filter((doc) => (doc.level || 'basic').toLowerCase() === level);
    return levelDocs.length > 0 && levelDocs.every((doc) => completedDocs.includes(doc._id));
  };

  const getLevelOrder = () => {
    const levels: string[] = [];
    const seenLevels = new Set<string>();
    docs.forEach((doc) => {
      const level = (doc.level || 'basic').toLowerCase();
      if (!seenLevels.has(level)) {
        levels.push(level);
        seenLevels.add(level);
      }
    });
    return levels;
  };

  const LevelBadge: React.FC<{ level: string }> = ({ level }) => {
    const colors = {
      basic: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
      intermediate: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700",
      advanced: "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-700"
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${colors[level as keyof typeof colors] || colors.basic}`}>
        {level?.charAt(0).toUpperCase() + level?.slice(1) || 'Basic'}
      </span>
    );
  };

  const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = "java" }) => (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <div className="flex items-center gap-2 bg-sky-800/30 dark:bg-sky-700/30 backdrop-blur-sm px-3 py-1 rounded-full">
          <Terminal className="w-3 h-3 text-gray-300" />
          <span className="text-xs text-gray-300 font-medium">{language}</span>
        </div>
      </div>
      <pre className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-100 p-6 rounded-xl overflow-x-auto border border-slate-700/50 dark:border-slate-800 shadow-2xl relative">
        <div className="absolute top-3 left-3 flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <code className="text-sm font-mono leading-relaxed mt-6 block">{code}</code>
      </pre>
    </div>
  );

  const OutputBlock: React.FC<{ output: string[] }> = ({ output }) => (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl p-4 backdrop-blur-sm">
      <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold mb-3 flex items-center gap-2">
        <div className="p-1 bg-emerald-600 dark:bg-emerald-500 rounded-full">
          <Play className="w-2 h-2 text-white fill-current" />
        </div>
        Output:
      </div>
      <div className="font-mono text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
        {output.map((line, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            {line}
          </div>
        ))}
      </div>
    </div>
  );

  const ContentRenderer: React.FC<{ content: any; depth?: number }> = ({ content, depth = 0 }) => {
    if (!content) return null;
    const renderValue = (key: string, value: any): React.ReactNode => {
      if (typeof value === "string") {
        if (key.toLowerCase().includes("code") || key === "syntax") {
          return <CodeBlock code={value} />;
        }
        if (key === "example" && typeof value === 'string' && value.includes("class")) {
          return <CodeBlock code={value} />;
        }
        return <p className="text-foreground/80 leading-relaxed">{value}</p>;
      }

      if (Array.isArray(value)) {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {value.map((item, idx) => {
              if (typeof item === "string" || typeof item === "number") {
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                    <span className="text-foreground/90 text-sm font-medium">{item}</span>
                  </div>
                );
              } else if (typeof item === "object" && item !== null) {
                // Render object items recursively
                return (
                  <div key={idx} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                    <ContentRenderer content={item} depth={depth + 1} />
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }

      if (typeof value === "object" && value !== null) {
        if (value.code) {
          return (
            <div className="space-y-4">
              <CodeBlock code={value.code} />
              {value.output && <OutputBlock output={value.output} />}
            </div>
          );
        }
        return <ContentRenderer content={value} depth={depth + 1} />;
      }

      return null;
    };
    return (
      <div className={`space-y-6 ${depth > 0 ? 'ml-6 border-l-2 border-border/30 pl-6' : ''}`}>
        {Object.entries(content).map(([key, value]) => {
          if (key === "_id" || key === "level") return null;

          const formattedKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/([a-z])([A-Z])/g, '$1 $2');
          const getKeyIcon = (key: string) => {
            if (key.toLowerCase().includes('example')) return <Play className="w-4 h-4" />;
            if (key.toLowerCase().includes('why')) return <Target className="w-4 h-4" />;
            if (key.toLowerCase().includes('what')) return <Lightbulb className="w-4 h-4" />;
            return <BookOpen className="w-4 h-4" />;
          };
          return (
            <div key={key} className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-4 border-b border-border/30">
                <h3 className="font-semibold text-foreground flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    {getKeyIcon(key)}
                  </div>
                  {formattedKey}
                </h3>
              </div>
              <div className="p-6">
                {renderValue(key, value)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // New component to render subtopics
  const SubtopicRenderer: React.FC<{
    subtopics: any[];
    docIdx: number;
    sectionIdx: number;
  }> = ({ subtopics, docIdx, sectionIdx }) => {
    const subtopicKey = getSubtopicKey(docIdx, sectionIdx);
    const isExpanded = expandedSubtopics[subtopicKey];

    return (
      <div className="space-y-4 mt-6">
        <button
          className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
          onClick={() => toggleSubtopic(subtopicKey)}
        >
          <ListTree className="w-5 h-5" />
          <span className="font-semibold">Subtopics</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 ml-2 border-l-2 border-primary/20 pl-4">
            {subtopics.map((subtopic, idx) => (
              <div
                key={idx}
                className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-4 hover:shadow-lg transition-all duration-200"
              >
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-primary" />
                  {subtopic.type}
                </h4>

                {subtopic.what && (
                  <p className="text-foreground/80 text-sm mb-3">{subtopic.what}</p>
                )}

                {subtopic.example && (
                  <div className="space-y-2">
                    {subtopic.example.code && (
                      <CodeBlock code={subtopic.example.code} />
                    )}
                    {subtopic.example.output && (
                      <OutputBlock output={subtopic.example.output} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Updated SectionRenderer to handle subtopics
  const SectionRenderer: React.FC<{
    section: Section;
    docIdx: number;
    sectionIdx: number;
  }> = ({ section, docIdx, sectionIdx }) => {
    const sectionTitle = section.sectionTitle || section.name || section.title || "Section";
    const hasSubtopics = section.content?.subtopics && section.content.subtopics.length > 0;

    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
              <Zap className="w-8 h-8" />
              {sectionTitle}
            </h2>
            {section.what && (
              <p className="text-primary-foreground/90 leading-relaxed text-lg">{section.what}</p>
            )}
          </div>
        </div>

        {section.why && (
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-3 text-lg">
              <div className="p-2 bg-amber-600/20 rounded-lg">
                <Target className="w-5 h-5" />
              </div>
              Why Use It?
            </h3>
            {Array.isArray(section.why) ? (
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
                {section.why.map((reason, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-sky-900/30 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <span className="text-amber-700 dark:text-amber-300 font-medium">{reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-amber-700 dark:text-amber-300">{section.why}</p>
            )}
          </div>
        )}

        {section.syntax && (
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-xl flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              Syntax:
            </h3>
            <CodeBlock code={section.syntax} />
          </div>
        )}

        {section.example && (
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-xl flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-600" />
              Example:
            </h3>
            <div className="space-y-4">
              {section.example.code && <CodeBlock code={section.example.code} />}
              {section.example.output && <OutputBlock output={section.example.output} />}
            </div>
          </div>
        )}

        {section.content && <ContentRenderer content={section.content} />}

        {hasSubtopics && (
          <SubtopicRenderer
            subtopics={Array.isArray(section.content.subtopics) ? section.content.subtopics : []}
            docIdx={docIdx}
            sectionIdx={sectionIdx}
          />
        )}
      </div>
    );
  };

  const getIcon = (level: string) => {
    switch (level) {
      case 'basic': return <User className="w-5 h-5" />;
      case 'intermediate': return <Database className="w-5 h-5" />;
      case 'advanced': return <Settings className="w-5 h-5" />;
      default: return <Book className="w-5 h-5" />;
    }
  };


  // Accepts globalSectionStart to calculate global section index for green coloring
  const renderSidebarSections = (sections: Section[], dIdx: number, level: string, globalSectionStart: number) => {
    const progressCount = progressCounts[level] || 0;
    return sections.map((sec: Section, sIdx: number) => {
      const sectionTitle = sec.sectionTitle || sec.name || sec.title || `Section ${sIdx + 1}`;
      const isActive = selected.docIdx === dIdx && selected.sectionIdx === sIdx;
      const hasSubtopics = sec.content?.subtopics;
      const subtopicKey = getSubtopicKey(dIdx, sIdx);
      const isSubtopicsExpanded = expandedSubtopics[subtopicKey];
      const globalSectionIdx = globalSectionStart + sIdx;
      const isVisited = globalSectionIdx < progressCount;
      const isUnlocked = globalSectionIdx <= progressCount; // allow navigation up to and including progressCount
      return (
        <div key={sIdx} className="space-y-1">
          <button
            className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground shadow-lg transform scale-[1.02] shadow-neon"
                : !isUnlocked
                  ? "opacity-50 cursor-not-allowed"
                  : isVisited
                    ? "text-green-800 dark:text-green-200"
                    : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground hover:scale-[1.01]"
            }`}
            onClick={() => {
              if (!isUnlocked) return;
              setSelected({ docIdx: dIdx, sectionIdx: sIdx });
            }}
            disabled={!isUnlocked}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isVisited ? "text-green-500" : ""}`}>
                {sectionTitle}
                {isVisited && " ✓"}
              </span>
              <div className="flex items-center gap-2">
                {hasSubtopics && (
                  <ListTree className="w-3 h-3 text-sidebar-foreground/60" />
                )}
                <ChevronRight className={`w-4 h-4 transition-all duration-200 ${isActive ? 'rotate-90 text-sidebar-primary-foreground' : 'text-sidebar-foreground/50'}`} />
              </div>
            </div>
          </button>
          {hasSubtopics && isActive && isSubtopicsExpanded && Array.isArray(sec.content.subtopics) && (
            <div className="ml-4 space-y-1 border-l-2 border-sidebar-border/30 pl-2">
              {sec.content.subtopics.map((subtopic: any, subIdx: number) => (
                <div
                  key={subIdx}
                  className="px-3 py-2 text-xs text-sidebar-foreground/70 bg-sidebar-background/50 rounded-lg"
                >
                  {subtopic.type}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
            <Code2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-muted-foreground font-semibold text-lg">Loading Java Course Content...</p>
        </div>
      </div>
    );
  }

  if (!docs.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Book className="w-20 h-20 text-muted-foreground/50 mx-auto mb-6" />
          <p className="text-muted-foreground font-semibold text-lg">No course content available</p>
        </div>
      </div>
    );
  }

  const { docIdx, sectionIdx } = selected;
  const doc = docs[docIdx];
  const sections = doc.sections || doc.subsections || [];
  const currentSection = sections[sectionIdx];

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Enhanced Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-96'} bg-sidebar-background border-r border-sidebar-border shadow-2xl transition-all duration-300 flex flex-col h-screen overflow-hidden`}>
        <div className="bg-gradient-to-r from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground p-6 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="p-2 bg-white/20 rounded-xl">
                <Code2 className="w-6 h-6" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold">ML Course</h1>
                  <p className="text-sidebar-primary-foreground/80 text-sm">Interactive Learning</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
          {(() => {
            const groupedDocs = getGroupedDocs();
            const levelOrder = getLevelOrder();
            const elements: React.ReactNode[] = [];

levelOrder.forEach((level, levelIndex) => {
  const levelDocs = groupedDocs[level] || [];

  const requiredCounts: Record<string, number> = {
    basic: 5,
    intermediate: 6,
    advanced: 5,
  };

  const progressCount = progressCounts[level];
  const showTestButton = progressCount >= requiredCounts[level];

  // Track the global section index for this level
  let globalSectionIdx = 0;
  levelDocs.forEach(({ doc, originalIndex: dIdx }) => {
    const sections = doc.sections || doc.subsections || [];
    const hasSubtopics = sections.some(s => s.content?.subtopics);
    elements.push(
      <div key={`doc-${doc._id}`} className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-sidebar-accent/50 rounded-xl border border-sidebar-border/50 backdrop-blur-sm">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="p-2 bg-sidebar-primary/20 rounded-lg">
              {getIcon(doc.level || 'basic')}
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-sidebar-foreground text-sm">{doc.title || doc.topic}</span>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              {doc.level && <LevelBadge level={doc.level} />}
              {hasSubtopics && !sidebarCollapsed && (
                <ListTree className="w-4 h-4 text-sidebar-foreground/60" />
              )}
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <div className="space-y-2 ml-2">
            {renderSidebarSections(sections, dIdx, level, globalSectionIdx)}
          </div>
        )}
      </div>
    );
    globalSectionIdx += sections.length;
  });

  // Show "Test Yourself" button only if level is completed
  if (!sidebarCollapsed && showTestButton) {
    elements.push(
      <div key={`test-${level}`} className="flex justify-center py-2">
        <button
          onClick={() => startLevelQuiz(level)}
          className="w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
          disabled={loadingQuiz}
        >
          {loadingQuiz ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
              <span>Loading...</span>
            </div>
          ) : (
            <>
              <Target className="w-4 h-4" />
              Test Yourself — {level.charAt(0).toUpperCase() + level.slice(1)}
            </>
          )}
        </button>
      </div>
    );
  }
});
            
            const lastLevel = levelOrder[levelOrder.length - 1];
            // Show final test button if advanced progress is at max (67)
            const advancedCount = progressCounts['advanced'] || 0;
            if (!sidebarCollapsed && levelOrder.length > 0 && (advancedCount >= 67)) {
              elements.push(
                <div key={`test-final-${lastLevel}`} className="flex justify-center py-2">
                  <button
                    onClick={() => startLevelQuiz(lastLevel)}
                    className="w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                    disabled={loadingQuiz}
                  >
                    {loadingQuiz ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        Final Test — {lastLevel.charAt(0).toUpperCase() + lastLevel.slice(1)}
                      </>
                    )}
                  </button>
                </div>
              );
            }
            return elements;
          })()}
        </div>
      </aside>

      {/* Enhanced Main Content */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="max-w-5xl mx-auto p-8 min-h-full">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-card rounded-2xl shadow-lg border border-border/50">
                {getIcon(doc.level || 'basic')}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {doc.title || doc.topic}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  {doc.level && <LevelBadge level={doc.level} />}
                  <span className="text-muted-foreground text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Interactive Learning Experience
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-card/30 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
            <div className="p-10">
              {currentSection ? (
                <SectionRenderer
                  section={currentSection}
                  docIdx={docIdx}
                  sectionIdx={sectionIdx}
                />
              ) : (
                <div className="space-y-8">
                  {doc.what && (
                    <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground rounded-2xl p-8">
                      <h2 className="text-2xl font-bold mb-3">What is it?</h2>
                      <p className="text-primary-foreground/90 leading-relaxed text-lg">{doc.what}</p>
                    </div>
                  )}

                  {doc.why && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                      <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-4">Why Use It?</h3>
                      {Array.isArray(doc.why) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {doc.why.map((reason, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-sky-900/30 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <span className="text-amber-700 dark:text-amber-300">{reason}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-amber-700 dark:text-amber-300">{doc.why}</p>
                      )}
                    </div>
                  )}

                  {doc.example && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-foreground text-xl">Example:</h3>
                      <div className="space-y-4">
                        {doc.example.code && <CodeBlock code={doc.example.code} />}
                        {doc.example.output && <OutputBlock output={doc.example.output} />}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="flex justify-between items-center mt-10 p-6 bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50">
            <button
              className="flex items-center gap-2 px-6 py-3 text-primary hover:text-primary/80 disabled:text-muted-foreground/50 transition-all duration-200 disabled:cursor-not-allowed rounded-xl hover:bg-primary/10"
              disabled={docIdx === 0 && sectionIdx === 0}
              onClick={() => {
                if (sectionIdx > 0) {
                  setSelected({ docIdx, sectionIdx: sectionIdx - 1 });
                } else if (docIdx > 0) {
                  const prevDoc = docs[docIdx - 1];
                  const prevSections = prevDoc.sections || prevDoc.subsections || [];
                  setSelected({ docIdx: docIdx - 1, sectionIdx: prevSections.length - 1 });
                }
              }}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span className="font-semibold">Previous</span>
            </button>

            <div className="text-center">
              <span className="text-muted-foreground font-medium">
                Module {docIdx + 1} of {docs.length}
              </span>
              <div className="flex gap-2 mt-2">
                {docs.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      idx === docIdx ? 'bg-primary w-6' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              className="flex items-center gap-2 px-6 py-3 text-primary hover:text-primary/80 disabled:text-muted-foreground/50 transition-all duration-200 disabled:cursor-not-allowed rounded-xl hover:bg-primary/10"
              disabled={docIdx === docs.length - 1 && sectionIdx === sections.length - 1}
              onClick={() => {
                if (sectionIdx < sections.length - 1) {
                  setSelected({ docIdx, sectionIdx: sectionIdx + 1 });
                } else if (docIdx < docs.length - 1) {
                  setSelected({ docIdx: docIdx + 1, sectionIdx: 0 });
                }
              }}
            >
              <span className="font-semibold">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        {showViolationWarning && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
      <h2 className="text-xl font-bold mb-4">Test Rules & Violation Warning</h2>
      <ul className="text-left mb-6 text-gray-700 dark:text-gray-200">
        <li>• You have 10 minutes for 10 questions.</li>
        <li>• Do not switch tabs or windows during the test.</li>
        <li>• Right-click and copy are disabled.</li>
        <li>• If you violate any rule, the test will stop and you must reattempt.</li>
        <li>• Your score is based on correct answers and speed.</li>
        <li>• You must score at least 60% to unlock the next level.</li>
      </ul>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
        onClick={confirmStartQuiz}
      >
        Start Test
      </button>
      <button
        className="ml-4 text-gray-500 hover:text-gray-900"
        onClick={() => setShowViolationWarning(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}
{quizViolated && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
      <h2 className="text-xl font-bold mb-4 text-red-600">Test Stopped Due to Violation</h2>
      <p className="mb-6">You switched tabs or tried to copy/right-click. Please reattempt the test.</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
        onClick={() => setQuizViolated(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
        {/* Quiz Modal */}
        {showQuizModal && activeQuizLevel && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onContextMenu={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {activeQuizLevel.charAt(0).toUpperCase() + activeQuizLevel.slice(1)} Level Quiz
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">Test your knowledge with 20 questions</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuizModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg text-blue-600">
                  Time Left: {Math.floor(quizTimeLeft / 60)}:{(quizTimeLeft % 60).toString().padStart(2, "0")}
                </span>
                {quizResult && (
                  <span className="font-semibold text-lg text-green-600">
                    Score: {quizResult.score} / {quizResult.total}
                  </span>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
                {loadingQuiz ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">Generating your quiz...</p>
                    </div>
                  </div>
                ) : quizResult ? (
                  <div className="text-center py-8">
                    <div className="mb-6">
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                        quizResult.score / quizResult.total >= 0.8 ? 'bg-green-100 dark:bg-green-900/50' :
                        quizResult.score / quizResult.total >= 0.6 ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                        'bg-red-100 dark:bg-red-900/50'
                      }`}>
                        <CheckCircle className={`w-10 h-10 ${
                          quizResult.score / quizResult.total >= 0.8 ? 'text-green-600 dark:text-green-400' :
                          quizResult.score / quizResult.total >= 0.6 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`} />
                      </div>
                      <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {quizResult.score} / {quizResult.total}
                      </h4>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        {quizResult.score / quizResult.total >= 0.8 ? 'Excellent work!' :
                         quizResult.score / quizResult.total >= 0.6 ? 'Good job!' :
                         'Keep practicing!'}
                      </p>
                    </div>
                        {/* Download Certificate button for final test completion */}
                    {(() => {
                      const levelOrder = getLevelOrder();
                      const isFinalLevel = activeQuizLevel && levelOrder.length > 0 && activeQuizLevel === levelOrder[levelOrder.length - 1];
                      const passedTest = quizResult.score / quizResult.total >= 0.6;
                      
                      if (isFinalLevel && passedTest) {
                        return (
                          <a
                            href={`/certificate/${encodeURIComponent("Machine Learning")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
                          >
                            Download Certificate
                          </a>
                        );
                      }
                      return null;
                    })()}
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
                      onClick={() => setShowQuizModal(false)}
                    >
                      Continue Learning
                    </button>
                  </div>
                ) : quizQuestions.length > 0 ? (
                  <div className="space-y-6">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Question {currentQuestionIdx + 1} of {quizQuestions.length}</span>
                      <span>{Math.round(((currentQuestionIdx + 1) / quizQuestions.length) * 100)}% Complete</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        {quizQuestions[currentQuestionIdx]?.question}
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {quizQuestions[currentQuestionIdx]?.options.map((option: string, idx: number) => {
                          const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => selectAnswer(currentQuestionIdx, idx)}
                              className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-500'
                                }`}>
                                  {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                <span className="font-medium">{option}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                        onClick={prevQuestion}
                        disabled={currentQuestionIdx === 0}
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Previous
                      </button>
                      <div className="flex gap-3">
                        {currentQuestionIdx < quizQuestions.length - 1 ? (
                          <button
                            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200"
                            onClick={nextQuestion}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                            onClick={submitQuiz}
                          >
                            Submit Quiz
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                      <Book className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      No quiz questions available for this level.
                    </p>
                    <button
                      className="mt-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      onClick={() => setShowQuizModal(false)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MLCourseLearningPage;