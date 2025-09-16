// import React, { useEffect, useState } from "react";
// import { 
//   ChevronRight, 
//   Code2, 
//   Book, 
//   CheckCircle, 
//   Clock, 
//   User, 
//   Database, 
//   Settings, 
//   Play,
//   Terminal,
//   Lightbulb,
//   Target,
//   ChevronDown,
//   BookOpen,
//   Zap
// } from "lucide-react";
// import { useLocation } from "react-router-dom";

// type SectionContent = {
//   [key: string]: string | string[] | { [key: string]: any };
// };

// type Section = {
//   sectionTitle?: string;
//   content?: SectionContent;
//   name?: string;
//   title?: string;
//   what?: string;
//   why?: string[] | string;
//   syntax?: string;
//   example?: { code?: string; output?: string[] };
//   topics?: any[];
//   subtopics?: any[];
//   methods?: string[];
//   [key: string]: any;
// };

// type JavaDoc = {
//   _id: string;
//   title: string;
//   sections?: Section[];
//   level?: string;
//   topic?: string;
//   subsections?: Section[];
//   what?: string;
//   why?: string[] | string;
//   types?: { [key: string]: any };
//   example?: { code?: string; output?: string[] };
//   [key: string]: any;
// };

// const JavaCourseLearningPage: React.FC = () => {
//   const [docs, setDocs] = useState<JavaDoc[]>([]);
//   const [selected, setSelected] = useState<{ docIdx: number; sectionIdx: number }>({ docIdx: 0, sectionIdx: 0 });
//   const [loading, setLoading] = useState(true);
//   const [isDark, setIsDark] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const [showSignIn, setShowSignIn] = useState(false);
//   const [showLevelPopup, setShowLevelPopup] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userLevel, setUserLevel] = useState<"Basic" | "Intermediate" | null>(null);

//   // Quiz / completion state
//   const [completedDocs, setCompletedDocs] = useState<string[]>([]);
//   const [showQuizModal, setShowQuizModal] = useState(false);
//   const [activeQuizDocId, setActiveQuizDocId] = useState<string | null>(null);
//   const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
//   const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);

//   const location = useLocation();

//   // Theme toggle effect
//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [isDark]);

//   useEffect(() => {
//     // Respect pre-auth/navigation params: if navigated with ?authed=1&level=Basic then skip sign-in
//     const params = new URLSearchParams(location.search);
//     if (params.get('authed') === '1') {
//       setIsAuthenticated(true);
//       const lvl = params.get('level');
//       if (lvl === 'Basic' || lvl === 'Intermediate') {
//         setUserLevel(lvl as "Basic" | "Intermediate");
//         setShowSignIn(false);
//         setShowLevelPopup(false);
//       }
//     } else if (params.get('start') === '1') {
//       setShowSignIn(true);
//     }

//     // Simulate API call - replace with your actual MongoDB fetch
//     fetch("http://localhost:8000/api/java-course")
//       .then((res) => res.json())
//       .then((data) => {
//         setDocs(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       });
    
//   }, []);


//   // When the selected section changes, if user reached the last section of a doc mark it completed
//   useEffect(() => {
//     const doc = docs[selected.docIdx];
//     if (!doc) return;
//     const secs = doc.sections || doc.subsections || [];
//     if (secs.length && selected.sectionIdx === secs.length - 1) {
//       setCompletedDocs((prev) => (prev.includes(doc._id) ? prev : [...prev, doc._id]));
//     }
//   }, [selected, docs]);

//   // Static quiz bank (fallback when docs don't include 'quiz' property)
//   const quizBank: Record<string, { question: string; options: string[]; answer: number }[]> = {
//     "68bab08112a79dbd5316c9b6": [
//       { question: "Which command compiles Java source files?", options: ["javac", "java", "javap", "jre"], answer: 0 },
//       { question: "What is the entry point method for a Java application?", options: ["start()", "main()", "run()", "init()"], answer: 1 }
//     ],
//     "68bad01d12a79dbd5316c9b7": [
//       { question: "Which keyword declares an integer variable in Java?", options: ["int", "var", "let", "decimal"], answer: 0 }
//     ],
//     "68c09fec4fbe6a8e7816c9b5": [
//       { question: "What is a class in Java?", options: ["A function", "A blueprint for objects", "A runtime", "A package"], answer: 1 }
//     ],
//     "68c0a22b4fbe6a8e7816c9ba": [
//       { question: "Spring Boot is primarily used for?", options: ["Frontend styling", "Building stand-alone Spring applications", "Database migrations", "Design systems"], answer: 1 }
//     ]
//   };

//   const handleSignIn = () => {
//     setShowSignIn(false);
//     setIsAuthenticated(true);
//     setTimeout(() => setShowLevelPopup(true), 300); // show level popup after sign in
//   };

//   // Simulate sign up (replace with your actual sign up logic)
//   const handleSignUp = () => {
//     setShowSignIn(false);
//     setIsAuthenticated(true);
//     setTimeout(() => setShowLevelPopup(true), 300);
//   };

//   // Handle level selection
//   const handleLevelSelect = (level: "Basic" | "Intermediate") => {
//     setUserLevel(level);
//     setShowLevelPopup(false);
//   };

//   // Quiz control
//   const startQuiz = (docId: string) => {
//     setActiveQuizDocId(docId);
//     setSelectedAnswers({});
//     setCurrentQuestionIdx(0);
//     setQuizResult(null);
//     setShowQuizModal(true);
//   };

//   const startLevelQuiz = (level: string) => {
//     setActiveQuizDocId(`level:${level}`);
//     setSelectedAnswers({});
//     setCurrentQuestionIdx(0);
//     setQuizResult(null);
//     setShowQuizModal(true);
//   };

//   const getQuestionsForActiveQuiz = () => {
//     if (!activeQuizDocId) return [] as any[];
//     if (activeQuizDocId.startsWith('level:')) {
//       const level = activeQuizDocId.split(':')[1].toLowerCase();
//       const levelDocs = docs.filter((d) => (d.level || '').toLowerCase() === level);
//       const aggregated: any[] = [];
//       levelDocs.forEach((d) => {
//         if (Array.isArray((d as any).quiz)) aggregated.push(...((d as any).quiz));
//         else if (quizBank[d._id]) aggregated.push(...quizBank[d._id]);
//       });
//       return aggregated;
//     }

//     const activeDoc = docs.find((d) => d._id === activeQuizDocId);
//     return (activeDoc?.quiz as any[]) || quizBank[activeQuizDocId] || [];
//   };

//   const selectAnswer = (qIdx: number, optionIdx: number) => {
//     setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
//   };

//   const submitQuiz = () => {
//     if (!activeQuizDocId) return;
//     const questions = getQuestionsForActiveQuiz();
//     let score = 0;
//     questions.forEach((q, idx) => {
//       const sel = selectedAnswers[idx];
//       if (typeof sel === 'number' && sel === q.answer) score++;
//     });
//     setQuizResult({ score, total: questions.length });
//   };

//   const nextQuestion = () => setCurrentQuestionIdx((i) => i + 1);
//   const prevQuestion = () => setCurrentQuestionIdx((i) => Math.max(0, i - 1));


//   const LevelBadge: React.FC<{ level: string }> = ({ level }) => {
//     const colors = {
//       basic: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
//       intermediate: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700", 
//       advanced: "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-700"
//     };
    
//     return (
//       <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${colors[level as keyof typeof colors] || colors.basic}`}>
//         {level?.charAt(0).toUpperCase() + level?.slice(1) || 'Basic'}
//       </span>
//     );
//   };

//   const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = "java" }) => (
//     <div className="relative group">
//       <div className="absolute top-3 right-3 z-10">
//         <div className="flex items-center gap-2 bg-sky-800/30 dark:bg-sky-700/30 backdrop-blur-sm px-3 py-1 rounded-full">
//           <Terminal className="w-3 h-3 text-gray-300" />
//           <span className="text-xs text-gray-300 font-medium">{language}</span>
//         </div>
//       </div>
//       <pre className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-100 p-6 rounded-xl overflow-x-auto border border-slate-700/50 dark:border-slate-800 shadow-2xl relative">
//         <div className="absolute top-3 left-3 flex gap-1.5">
//           <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
//           <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
//           <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
//         </div>
//         <code className="text-sm font-mono leading-relaxed mt-6 block">{code}</code>
//       </pre>
//     </div>
//   );

//   const OutputBlock: React.FC<{ output: string[] }> = ({ output }) => (
//     <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl p-4 backdrop-blur-sm">
//       <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold mb-3 flex items-center gap-2">
//         <div className="p-1 bg-emerald-600 dark:bg-emerald-500 rounded-full">
//           <Play className="w-2 h-2 text-white fill-current" />
//         </div>
//         Output:
//       </div>
//       <div className="font-mono text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
//         {output.map((line, idx) => (
//           <div key={idx} className="flex items-center gap-2">
//             <ChevronRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
//             {line}
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const ContentRenderer: React.FC<{ content: any; depth?: number }> = ({ content, depth = 0 }) => {
//     if (!content) return null;

//     const renderValue = (key: string, value: any): React.ReactNode => {
//       if (typeof value === "string") {
//         if (key.toLowerCase().includes("code") || key === "syntax") {
//           return <CodeBlock code={value} />;
//         }
//         if (key === "example" && typeof value === 'string' && value.includes("class")) {
//           return <CodeBlock code={value} />;
//         }
//         return <p className="text-foreground/80 leading-relaxed">{value}</p>;
//       }
      
//       if (Array.isArray(value)) {
//         return (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {value.map((item, idx) => (
//               <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
//                 <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
//                 <span className="text-foreground/90 text-sm font-medium">{item}</span>
//               </div>
//             ))}
//           </div>
//         );
//       }
      
//       if (typeof value === "object" && value !== null) {
//         if (value.code) {
//           return (
//             <div className="space-y-4">
//               <CodeBlock code={value.code} />
//               {value.output && <OutputBlock output={value.output} />}
//             </div>
//           );
//         }
//         return <ContentRenderer content={value} depth={depth + 1} />;
//       }
      
//       return null;
//     };

//     // Add a "Go to Course" button before the course content
//   // if (!isAuthenticated || userLevel === null) {
//   //   return (
//   //     <div className="min-h-screen flex items-center justify-center bg-background">
//   //       <div className="bg-sky-50 dark:bg-sky-900/50 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
//   //         <h1 className="text-3xl font-bold mb-6">Welcome to Java Course</h1>
//   //         <button
//   //           className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition"
//   //           onClick={() => setShowSignIn(true)}
//   //         >
//   //           Go to Course
//   //         </button>

//   //         {/* Sign In/Sign Up Popup */}
//   //         {showSignIn && (
//   //           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//   //             <div className="bg-sky-50 dark:bg-sky-900/50 rounded-2xl shadow-2xl p-8 max-w-sm w-full relative">
//   //               <button
//   //                 className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
//   //                 onClick={() => setShowSignIn(false)}
//   //               >
//   //                 ×
//   //               </button>
//   //               <h2 className="text-2xl font-bold mb-4">Sign In / Sign Up</h2>
//   //               {/* Replace below with your actual sign in/up forms or navigation */}
//   //               <button
//   //                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold mb-3"
//   //                 onClick={handleSignIn}
//   //               >
//   //                 Sign In
//   //               </button>
//   //               <button
//   //                 className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg font-semibold"
//   //                 onClick={handleSignUp}
//   //               >
//   //                 Sign Up
//   //               </button>
//   //             </div>
//   //           </div>
//   //         )}

//   //         {/* Level Selection Popup */}
//   //         {showLevelPopup && (
//   //           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//   //             <div className="bg-sky-50 dark:bg-sky-900/50 rounded-2xl shadow-2xl p-8 max-w-sm w-full relative">
//   //               <h2 className="text-2xl font-bold mb-6">Your Java understanding level?</h2>
//   //               <div className="flex flex-col gap-4">
//   //                 <button
//   //                   className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg"
//   //                   onClick={() => handleLevelSelect("Basic")}
//   //                 >
//   //                   Basic
//   //                 </button>
//   //                 <button
//   //                   className="bg-blue-400 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg"
//   //                   onClick={() => handleLevelSelect("Intermediate")}
//   //                 >
//   //                   Intermediate
//   //                 </button>
//   //               </div>
//   //             </div>
//   //           </div>
//   //         )}
//   //       </div>
//   //     </div>
//   //   );
//   // }


//     return (
//       <div className={`space-y-6 ${depth > 0 ? 'ml-6 border-l-2 border-border/30 pl-6' : ''}`}>
//         {Object.entries(content).map(([key, value]) => {
//           if (key === "_id" || key === "level") return null;
          
//           const formattedKey = key
//             .replace(/([A-Z])/g, ' $1')
//             .replace(/^./, str => str.toUpperCase())
//             .replace(/([a-z])([A-Z])/g, '$1 $2');

//           const getKeyIcon = (key: string) => {
//             if (key.toLowerCase().includes('example')) return <Play className="w-4 h-4" />;
//             if (key.toLowerCase().includes('why')) return <Target className="w-4 h-4" />;
//             if (key.toLowerCase().includes('what')) return <Lightbulb className="w-4 h-4" />;
//             return <BookOpen className="w-4 h-4" />;
//           };

//           return (
//             <div key={key} className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
//               <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-4 border-b border-border/30">
//                 <h3 className="font-semibold text-foreground flex items-center gap-3">
//                   <div className="p-2 bg-primary/20 rounded-lg">
//                     {getKeyIcon(key)}
//                   </div>
//                   {formattedKey}
//                 </h3>
//               </div>
//               <div className="p-6">
//                 {renderValue(key, value)}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   const SectionRenderer: React.FC<{ section: Section }> = ({ section }) => {
//     const sectionTitle = section.sectionTitle || section.name || section.title || "Section";
    
//     return (
//       <div className="space-y-8">
//         <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground rounded-2xl p-8 shadow-2xl relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
//           <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
//           <div className="relative z-10">
//             <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
//               <Zap className="w-8 h-8" />
//               {sectionTitle}
//             </h2>
//             {section.what && (
//               <p className="text-primary-foreground/90 leading-relaxed text-lg">{section.what}</p>
//             )}
//           </div>
//         </div>

//         {section.why && (
//           <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl p-6 backdrop-blur-sm">
//             <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-3 text-lg">
//               <div className="p-2 bg-amber-600/20 rounded-lg">
//                 <Target className="w-5 h-5" />
//               </div>
//               Why Use It?
//             </h3>
//             {Array.isArray(section.why) ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {section.why.map((reason, idx) => (
//                   <div key={idx} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-sky-900/30 rounded-lg">
//                     <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
//                     <span className="text-amber-700 dark:text-amber-300 font-medium">{reason}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-amber-700 dark:text-amber-300">{section.why}</p>
//             )}
//           </div>
//         )}

//         {section.syntax && (
//           <div className="space-y-4">
//             <h3 className="font-bold text-foreground text-xl flex items-center gap-2">
//               <Code2 className="w-5 h-5 text-primary" />
//               Syntax:
//             </h3>
//             <CodeBlock code={section.syntax} />
//           </div>
//         )}

//         {section.example && (
//           <div className="space-y-4">
//             <h3 className="font-bold text-foreground text-xl flex items-center gap-2">
//               <Play className="w-5 h-5 text-emerald-600" />
//               Example:
//             </h3>
//             <div className="space-y-4">
//               {section.example.code && <CodeBlock code={section.example.code} />}
//               {section.example.output && <OutputBlock output={section.example.output} />}
//             </div>
//           </div>
//         )}

//         {section.content && <ContentRenderer content={section.content} />}
//       </div>
//     );
//   };

//   const getIcon = (level: string) => {
//     switch (level) {
//       case 'basic': return <User className="w-5 h-5" />;
//       case 'intermediate': return <Database className="w-5 h-5" />;
//       case 'advanced': return <Settings className="w-5 h-5" />;
//       default: return <Book className="w-5 h-5" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
//             <Code2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//           </div>
//           <p className="text-muted-foreground font-semibold text-lg">Loading Java Course Content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!docs.length) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <Book className="w-20 h-20 text-muted-foreground/50 mx-auto mb-6" />
//           <p className="text-muted-foreground font-semibold text-lg">No course content available</p>
//         </div>
//       </div>
//     );
//   }

//   const { docIdx, sectionIdx } = selected;
//   const doc = docs[docIdx];
//   const sections = doc.sections || doc.subsections || [];
//   const currentSection = sections[sectionIdx];

//   return (
//     <div className="flex min-h-screen bg-background overflow-hidden">
//       {/* Enhanced Sidebar */}
//       <aside className={`${sidebarCollapsed ? 'w-20' : 'w-96'} bg-sidebar-background border-r border-sidebar-border shadow-2xl transition-all duration-300 flex flex-col h-screen overflow-hidden`}>
//         <div className="bg-gradient-to-r from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground p-6 relative overflow-hidden flex-shrink-0">
//           <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
//           <div className="flex items-center justify-between relative z-10">
//             <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
//               <div className="p-2 bg-white/20 rounded-xl">
//                 <Code2 className="w-6 h-6" />
//               </div>
//               {!sidebarCollapsed && (
//                 <div>
//                   <h1 className="text-xl font-bold">Java Course</h1>
//                   <p className="text-sidebar-primary-foreground/80 text-sm">Interactive Learning</p>
//                 </div>
//               )}
//             </div>
//             <button
//               onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//               className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//             >
//               <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
//             </button>
//           </div>
//         </div>
        
//         <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
//           {docs.map((d, dIdx) => {
//             const sections = d.sections || d.subsections || [];
//             const next = docs[dIdx + 1];
//             const currentLevel = (d.level || 'basic').toLowerCase();

//             const isLevelCompleted = (level: string) => {
//               const levelDocs = docs.filter((x) => (x.level || '').toLowerCase() === level);
//               if (!levelDocs.length) return false;
//               return levelDocs.every((x) => completedDocs.includes(x._id));
//             };

//             const shouldShowLevelTest = !sidebarCollapsed && isLevelCompleted(currentLevel) && (!next || (next.level || '').toLowerCase() !== currentLevel);

//             return (
//               <React.Fragment key={d._id}>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between p-4 bg-sidebar-accent/50 rounded-xl border border-sidebar-border/50 backdrop-blur-sm">
//                     <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
//                       <div className="p-2 bg-sidebar-primary/20 rounded-lg">
//                         {getIcon(d.level || 'basic')}
//                       </div>
//                       {!sidebarCollapsed && (
//                         <span className="font-bold text-sidebar-foreground text-sm">{d.title || d.topic}</span>
//                       )}
//                     </div>
//                     {!sidebarCollapsed && d.level && <LevelBadge level={d.level} />}
//                   </div>

//                   {!sidebarCollapsed && (
//                     <div className="space-y-2 ml-2">
//                       {sections.map((sec: Section, sIdx: number) => {
//                         const sectionTitle = sec.sectionTitle || sec.name || sec.title || `Section ${sIdx + 1}`;
//                         const isActive = docIdx === dIdx && sectionIdx === sIdx;

//                         return (
//                           <button
//                             key={sIdx}
//                             className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
//                               isActive
//                                 ? "bg-gradient-to-r from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground shadow-lg transform scale-[1.02] shadow-neon"
//                                 : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground hover:scale-[1.01]"
//                             }`}
//                             onClick={() => setSelected({ docIdx: dIdx, sectionIdx: sIdx })}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm font-medium">{sectionTitle}</span>
//                               <ChevronRight className={`w-4 h-4 transition-all duration-200 ${isActive ? 'rotate-90 text-sidebar-primary-foreground' : 'text-sidebar-foreground/50'}`} />
//                             </div>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>

//                 {shouldShowLevelTest && (
//                   <div className="flex justify-center">
//                     <button onClick={() => startLevelQuiz(currentLevel)} className="w-full text-left px-4 py-3 mt-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold">
//                       Test Yourself — {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
//                     </button>
//                   </div>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </div>
//       </aside>

//       {/* Enhanced Main Content */}
//       <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
//         <div className="max-w-5xl mx-auto p-8 min-h-full">
//           {/* Header */}
//           <div className="mb-10">
//             <div className="flex items-center gap-4 mb-6">
//               <div className="p-3 bg-card rounded-2xl shadow-lg border border-border/50">
//                 {getIcon(doc.level || 'basic')}
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
//                   {doc.title || doc.topic}
//                 </h1>
//                 <div className="flex items-center gap-3 mt-2">
//                   {doc.level && <LevelBadge level={doc.level} />}
//                   <span className="text-muted-foreground text-sm flex items-center gap-2">
//                     <Clock className="w-4 h-4" />
//                     Interactive Learning Experience
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="bg-card/30 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
//             <div className="p-10">
//               {currentSection ? (
//                 <SectionRenderer section={currentSection} />
//               ) : (
//                 <div className="space-y-8">
//                   {doc.what && (
//                     <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground rounded-2xl p-8">
//                       <h2 className="text-2xl font-bold mb-3">What is it?</h2>
//                       <p className="text-primary-foreground/90 leading-relaxed text-lg">{doc.what}</p>
//                     </div>
//                   )}
                  
//                   {doc.why && (
//                     <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
//                       <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-4">Why Use It?</h3>
//                       {Array.isArray(doc.why) ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                           {doc.why.map((reason, idx) => (
//                             <div key={idx} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-sky-900/30 rounded-lg">
//                               <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
//                               <span className="text-amber-700 dark:text-amber-300">{reason}</span>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-amber-700 dark:text-amber-300">{doc.why}</p>
//                       )}
//                     </div>
//                   )}
                  
//                   {doc.example && (
//                     <div className="space-y-4">
//                       <h3 className="font-bold text-foreground text-xl">Example:</h3>
//                       <div className="space-y-4">
//                         {doc.example.code && <CodeBlock code={doc.example.code} />}
//                         {doc.example.output && <OutputBlock output={doc.example.output} />}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Navigation Footer */}
//           <div className="flex justify-between items-center mt-10 p-6 bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50">
//             <button
//               className="flex items-center gap-2 px-6 py-3 text-primary hover:text-primary/80 disabled:text-muted-foreground/50 transition-all duration-200 disabled:cursor-not-allowed rounded-xl hover:bg-primary/10"
//               disabled={docIdx === 0 && sectionIdx === 0}
//               onClick={() => {
//                 if (sectionIdx > 0) {
//                   setSelected({ docIdx, sectionIdx: sectionIdx - 1 });
//                 } else if (docIdx > 0) {
//                   const prevDoc = docs[docIdx - 1];
//                   const prevSections = prevDoc.sections || prevDoc.subsections || [];
//                   setSelected({ docIdx: docIdx - 1, sectionIdx: prevSections.length - 1 });
//                 }
//               }}
//             >
//               <ChevronRight className="w-5 h-5 rotate-180" />
//               <span className="font-semibold">Previous</span>
//             </button>
            
//             <div className="text-center">
//               <span className="text-muted-foreground font-medium">
//                 Module {docIdx + 1} of {docs.length}
//               </span>
//               <div className="flex gap-2 mt-2">
//                 {docs.map((_, idx) => (
//                   <div
//                     key={idx}
//                     className={`w-2 h-2 rounded-full transition-all duration-200 ${
//                       idx === docIdx ? 'bg-primary w-6' : 'bg-muted'
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>
            
//             <button
//               className="flex items-center gap-2 px-6 py-3 text-primary hover:text-primary/80 disabled:text-muted-foreground/50 transition-all duration-200 disabled:cursor-not-allowed rounded-xl hover:bg-primary/10"
//               disabled={docIdx === docs.length - 1 && sectionIdx === sections.length - 1}
//               onClick={() => {
//                 if (sectionIdx < sections.length - 1) {
//                   setSelected({ docIdx, sectionIdx: sectionIdx + 1 });
//                 } else if (docIdx < docs.length - 1) {
//                   setSelected({ docIdx: docIdx + 1, sectionIdx: 0 });
//                 }
//               }}
//             >
//               <span className="font-semibold">Next</span>
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//           {/* Quiz modal */}
//           {showQuizModal && activeQuizDocId && (
//             <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//               <div className="bg-white dark:bg-sky-900/60 rounded-2xl shadow-2xl p-6 max-w-2xl w-full">
//                 <div className="flex items-start justify-between mb-4">
//                   <h3 className="text-xl font-bold">Test Yourself</h3>
//                   <div className="flex items-center gap-2">
//                     <button className="text-sm text-muted-foreground" onClick={() => setShowQuizModal(false)}>Close</button>
//                   </div>
//                 </div>
//                 <div>
//                   {(() => {
//                     const questions = getQuestionsForActiveQuiz();
//                     if (!questions.length) return <p className="text-muted-foreground">No quiz available for this module.</p>;
//                     if (quizResult) {
//                       return (
//                         <div className="text-center">
//                           <h4 className="text-2xl font-bold mb-2">You scored {quizResult.score} / {quizResult.total}</h4>
//                           <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg" onClick={() => { setShowQuizModal(false); }}>Done</button>
//                         </div>
//                       );
//                     }

//                     const q = questions[currentQuestionIdx];

//                     return (
//                       <div className="space-y-4">
//                         <div className="text-sm text-muted-foreground">Question {currentQuestionIdx + 1} of {questions.length}</div>
//                         <div className="p-4 bg-card/30 rounded-lg border border-border/50">
//                           <div className="font-semibold text-lg mb-3">{q.question}</div>
//                           <div className="grid grid-cols-1 gap-2">
//                             {q.options.map((opt: string, idx: number) => {
//                               const selected = selectedAnswers[currentQuestionIdx] === idx;
//                               return (
//                                 <button key={idx} onClick={() => selectAnswer(currentQuestionIdx, idx)} className={`text-left p-3 rounded-lg border ${selected ? 'border-blue-600 bg-blue-50' : 'border-border/40 bg-transparent'}`}>
//                                   {opt}
//                                 </button>
//                               );
//                             })}
//                           </div>
//                         </div>

//                         <div className="flex justify-between items-center">
//                           <div>
//                             <button className="px-4 py-2 bg-gray-100 rounded-lg mr-2" onClick={prevQuestion} disabled={currentQuestionIdx === 0}>Prev</button>
//                             <button className="px-4 py-2 bg-gray-100 rounded-lg" onClick={nextQuestion} disabled={currentQuestionIdx === questions.length - 1}>Next</button>
//                           </div>
//                           <div>
//                             <button className="px-5 py-2 bg-blue-600 text-white rounded-lg" onClick={submitQuiz}>Submit</button>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })()}
//                 </div>
//               </div>
//             </div>
//           )}
//       </main>
//     </div>
//   );
// };

// export default JavaCourseLearningPage;

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

type JavaDoc = {
  _id: string;
  title: string;
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

const JavaCourseLearningPage: React.FC = () => {
  const [docs, setDocs] = useState<JavaDoc[]>([]);
  const [selected, setSelected] = useState<{ docIdx: number; sectionIdx: number }>({ docIdx: 0, sectionIdx: 0 });
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showLevelPopup, setShowLevelPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userLevel, setUserLevel] = useState<"Basic" | "Intermediate" | null>(null);
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
  }, [isDark]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('authed') === '1') {
      setIsAuthenticated(true);
      const lvl = params.get('level');
      if (lvl === 'Basic' || lvl === 'Intermediate') {
        setUserLevel(lvl as "Basic" | "Intermediate");
        setShowSignIn(false);
        setShowLevelPopup(false);
      }
    } else if (params.get('start') === '1') {
      setShowSignIn(true);
    }
    fetch("http://localhost:8000/api/java-course")
      .then((res) => res.json())
      .then((data) => {
        setDocs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
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

  const handleLevelSelect = (level: "Basic" | "Intermediate") => {
    setUserLevel(level);
    setShowLevelPopup(false);
  };

  const fetchQuizQuestions = async (level: string) => {
    setLoadingQuiz(true);
    try {
      const response = await fetch('http://localhost:8000/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: level.toLowerCase(),
          num_questions: 20
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
    const questions = await fetchQuizQuestions(level);
    setQuizQuestions(questions);
    setShowQuizModal(true);
  };

  const selectAnswer = (qIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  };

  const submitQuiz = () => {
    if (!quizQuestions.length) return;
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      const selectedAnswer = selectedAnswers[idx];
      if (typeof selectedAnswer === 'number' && selectedAnswer === q.answer) {
        score++;
      }
    });
    setQuizResult({ score, total: quizQuestions.length });
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
    }, {} as Record<string, { doc: JavaDoc; originalIndex: number }[]>);
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

      // if (Array.isArray(value)) {
      //   return (
      //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      //       {value.map((item, idx) => (
      //         <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
      //           <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
      //           <span className="text-foreground/90 text-sm font-medium">{item}</span>
      //         </div>
      //       ))}
      //     </div>
      //   );
      // }

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2 border-l-2 border-primary/20 pl-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

  // Sidebar: Update section rendering to show subtopics
  const renderSidebarSections = (sections: Section[], dIdx: number) => {
    return sections.map((sec: Section, sIdx: number) => {
      const sectionTitle = sec.sectionTitle || sec.name || sec.title || `Section ${sIdx + 1}`;
      const isActive = selected.docIdx === dIdx && selected.sectionIdx === sIdx;
      const hasSubtopics = sec.content?.subtopics;
      const subtopicKey = getSubtopicKey(dIdx, sIdx);
      const isSubtopicsExpanded = expandedSubtopics[subtopicKey];

      return (
        <div key={sIdx} className="space-y-1">
          <button
            className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground shadow-lg transform scale-[1.02] shadow-neon"
                : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground hover:scale-[1.01]"
            }`}
            onClick={() => setSelected({ docIdx: dIdx, sectionIdx: sIdx })}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{sectionTitle}</span>
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
                  <h1 className="text-xl font-bold">Java Course</h1>
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
                        {renderSidebarSections(sections, dIdx)}
                      </div>
                    )}
                  </div>
                );
              });

              if (!sidebarCollapsed && levelIndex < levelOrder.length - 1 && isLevelCompleted(level)) {
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
            if (!sidebarCollapsed && levelOrder.length > 0 && isLevelCompleted(lastLevel)) {
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

        {/* Quiz Modal */}
        {showQuizModal && activeQuizLevel && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

export default JavaCourseLearningPage;
// import React, { useEffect, useState } from "react";
// import { 
//   ChevronRight, 
//   Code2, 
//   Book, 
//   CheckCircle, 
//   Clock, 
//   User, 
//   Database, 
//   Settings, 
//   Play,
//   Terminal,
//   Lightbulb,
//   Target,
//   ChevronDown,
//   BookOpen,
//   Zap
// } from "lucide-react";
// import { useLocation } from "react-router-dom";

// type SectionContent = {
//   [key: string]: string | string[] | { [key: string]: any };
// };

// type Section = {
//   sectionTitle?: string;
//   content?: SectionContent;
//   name?: string;
//   title?: string;
//   what?: string;
//   why?: string[] | string;
//   syntax?: string;
//   example?: { code?: string; output?: string[] };
//   topics?: any[];
//   subtopics?: any[];
//   methods?: string[];
//   [key: string]: any;
// };

// type JavaDoc = {
//   _id: string;
//   title: string;
//   sections?: Section[];
//   level?: string;
//   topic?: string;
//   subsections?: Section[];
//   what?: string;
//   why?: string[] | string;
//   types?: { [key: string]: any };
//   example?: { code?: string; output?: string[] };
//   [key: string]: any;
// };

// type QuizQuestion = {
//   question: string;
//   options: string[];
//   answer: number;
//   explanation?: string;
// };

// const JavaCourseLearningPage: React.FC = () => {
//   const [docs, setDocs] = useState<JavaDoc[]>([]);
//   const [selected, setSelected] = useState<{ docIdx: number; sectionIdx: number }>({ docIdx: 0, sectionIdx: 0 });
//   const [loading, setLoading] = useState(true);
//   const [isDark, setIsDark] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const [showSignIn, setShowSignIn] = useState(false);
//   const [showLevelPopup, setShowLevelPopup] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userLevel, setUserLevel] = useState<"Basic" | "Intermediate" | null>(null);

//   // Quiz / completion state
//   const [completedDocs, setCompletedDocs] = useState<string[]>([]);
//   const [showQuizModal, setShowQuizModal] = useState(false);
//   const [activeQuizLevel, setActiveQuizLevel] = useState<string | null>(null);
//   const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
//   const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
//   const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
//   const [loadingQuiz, setLoadingQuiz] = useState(false);

//   const location = useLocation();

//   // Theme toggle effect
//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [isDark]);

//   useEffect(() => {
//     // Respect pre-auth/navigation params: if navigated with ?authed=1&level=Basic then skip sign-in
//     const params = new URLSearchParams(location.search);
//     if (params.get('authed') === '1') {
//       setIsAuthenticated(true);
//       const lvl = params.get('level');
//       if (lvl === 'Basic' || lvl === 'Intermediate') {
//         setUserLevel(lvl as "Basic" | "Intermediate");
//         setShowSignIn(false);
//         setShowLevelPopup(false);
//       }
//     } else if (params.get('start') === '1') {
//       setShowSignIn(true);
//     }

//     // Fetch course data from API
//     fetch("http://localhost:8000/api/java-course")
//       .then((res) => res.json())
//       .then((data) => {
//         setDocs(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       });
    
//   }, []);

//   // When the selected section changes, if user reached the last section of a doc mark it completed
//   useEffect(() => {
//     const doc = docs[selected.docIdx];
//     if (!doc) return;
//     const secs = doc.sections || doc.subsections || [];
//     if (secs.length && selected.sectionIdx === secs.length - 1) {
//       setCompletedDocs((prev) => (prev.includes(doc._id) ? prev : [...prev, doc._id]));
//     }
//   }, [selected, docs]);

//   const handleSignIn = () => {
//     setShowSignIn(false);
//     setIsAuthenticated(true);
//     setTimeout(() => setShowLevelPopup(true), 300);
//   };

//   const handleSignUp = () => {
//     setShowSignIn(false);
//     setIsAuthenticated(true);
//     setTimeout(() => setShowLevelPopup(true), 300);
//   };

//   const handleLevelSelect = (level: "Basic" | "Intermediate") => {
//     setUserLevel(level);
//     setShowLevelPopup(false);
//   };

//   // Fetch quiz questions from API
//   const fetchQuizQuestions = async (level: string) => {
//     setLoadingQuiz(true);
//     try {
//       const response = await fetch('http://localhost:8000/api/quiz/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           level: level.toLowerCase(),
//           num_questions: 20
//         })
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data.questions || [];
//     } catch (error) {
//       console.error('Error fetching quiz questions:', error);
//       // Fallback to empty array if API fails
//       return [];
//     } finally {
//       setLoadingQuiz(false);
//     }
//   };

//   // Start level quiz
//   const startLevelQuiz = async (level: string) => {
//     setActiveQuizLevel(level);
//     setSelectedAnswers({});
//     setCurrentQuestionIdx(0);
//     setQuizResult(null);
    
//     // Fetch questions from API
//     const questions = await fetchQuizQuestions(level);
//     setQuizQuestions(questions);
//     setShowQuizModal(true);
//   };

//   const selectAnswer = (qIdx: number, optionIdx: number) => {
//     setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
//   };

//   const submitQuiz = () => {
//     if (!quizQuestions.length) return;
    
//     let score = 0;
//     quizQuestions.forEach((q, idx) => {
//       const selectedAnswer = selectedAnswers[idx];
//       if (typeof selectedAnswer === 'number' && selectedAnswer === q.answer) {
//         score++;
//       }
//     });
    
//     setQuizResult({ score, total: quizQuestions.length });
//   };

//   const nextQuestion = () => setCurrentQuestionIdx((i) => Math.min(i + 1, quizQuestions.length - 1));
//   const prevQuestion = () => setCurrentQuestionIdx((i) => Math.max(0, i - 1));

//   // Helper function to group docs by level and determine level boundaries
//   const getGroupedDocs = () => {
//     const grouped = docs.reduce((acc, doc, index) => {
//       const level = (doc.level || 'basic').toLowerCase();
//       if (!acc[level]) {
//         acc[level] = [];
//       }
//       acc[level].push({ doc, originalIndex: index });
//       return acc;
//     }, {} as Record<string, { doc: JavaDoc; originalIndex: number }[]>);

//     return grouped;
//   };

//   // Check if all docs in a level are completed
//   const isLevelCompleted = (level: string) => {
//     const levelDocs = docs.filter((doc) => (doc.level || 'basic').toLowerCase() === level);
//     return levelDocs.length > 0 && levelDocs.every((doc) => completedDocs.includes(doc._id));
//   };

//   // Get the order of levels as they appear in docs
//   const getLevelOrder = () => {
//     const levels: string[] = [];
//     const seenLevels = new Set<string>();
    
//     docs.forEach((doc) => {
//       const level = (doc.level || 'basic').toLowerCase();
//       if (!seenLevels.has(level)) {
//         levels.push(level);
//         seenLevels.add(level);
//       }
//     });
    
//     return levels;
//   };

//   const LevelBadge: React.FC<{ level: string }> = ({ level }) => {
//     const colors = {
//       basic: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
//       intermediate: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700", 
//       advanced: "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-700"
//     };
    
//     return (
//       <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${colors[level as keyof typeof colors] || colors.basic}`}>
//         {level?.charAt(0).toUpperCase() + level?.slice(1) || 'Basic'}
//       </span>
//     );
//   };

//   const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = "java" }) => (
//     <div className="relative group">
//       <div className="absolute top-3 right-3 z-10">
//         <div className="flex items-center gap-2 bg-sky-800/30 dark:bg-sky-700/30 backdrop-blur-sm px-3 py-1 rounded-full">
//           <Terminal className="w-3 h-3 text-gray-300" />
//           <span className="text-xs text-gray-300 font-medium">{language}</span>
//         </div>
//       </div>
//       <pre className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-100 p-6 rounded-xl overflow-x-auto border border-slate-700/50 dark:border-slate-800 shadow-2xl relative">
//         <div className="absolute top-3 left-3 flex gap-1.5">
//           <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
//           <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
//           <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
//         </div>
//         <code className="text-sm font-mono leading-relaxed mt-6 block">{code}</code>
//       </pre>
//     </div>
//   );

//   const OutputBlock: React.FC<{ output: string[] }> = ({ output }) => (
//     <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl p-4 backdrop-blur-sm">
//       <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold mb-3 flex items-center gap-2">
//         <div className="p-1 bg-emerald-600 dark:bg-emerald-500 rounded-full">
//           <Play className="w-2 h-2 text-white fill-current" />
//         </div>
//         Output:
//       </div>
//       <div className="font-mono text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
//         {output.map((line, idx) => (
//           <div key={idx} className="flex items-center gap-2">
//             <ChevronRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
//             {line}
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const ContentRenderer: React.FC<{ content: any; depth?: number }> = ({ content, depth = 0 }) => {
//     if (!content) return null;

//     const renderValue = (key: string, value: any): React.ReactNode => {
//       if (typeof value === "string") {
//         if (key.toLowerCase().includes("code") || key === "syntax") {
//           return <CodeBlock code={value} />;
//         }
//         if (key === "example" && typeof value === 'string' && value.includes("class")) {
//           return <CodeBlock code={value} />;
//         }
//         return <p className="text-foreground/80 leading-relaxed">{value}</p>;
//       }
      
//       if (Array.isArray(value)) {
//         return (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {value.map((item, idx) => (
//               <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
//                 <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
//                 <span className="text-foreground/90 text-sm font-medium">{item}</span>
//               </div>
//             ))}
//           </div>
//         );
//       }
      
//       if (typeof value === "object" && value !== null) {
//         if (value.code) {
//           return (
//             <div className="space-y-4">
//               <CodeBlock code={value.code} />
//               {value.output && <OutputBlock output={value.output} />}
//             </div>
//           );
//         }
//         return <ContentRenderer content={value} depth={depth + 1} />;
//       }
      
//       return null;
//     };

//     return (
//       <div className={`space-y-6 ${depth > 0 ? 'ml-6 border-l-2 border-border/30 pl-6' : ''}`}>
//         {Object.entries(content).map(([key, value]) => {
//           if (key === "_id" || key === "level") return null;
          
//           const formattedKey = key
//             .replace(/([A-Z])/g, ' $1')
//             .replace(/^./, str => str.toUpperCase())
//             .replace(/([a-z])([A-Z])/g, '$1 $2');

//           const getKeyIcon = (key: string) => {
//             if (key.toLowerCase().includes('example')) return <Play className="w-4 h-4" />;
//             if (key.toLowerCase().includes('why')) return <Target className="w-4 h-4" />;
//             if (key.toLowerCase().includes('what')) return <Lightbulb className="w-4 h-4" />;
//             return <BookOpen className="w-4 h-4" />;
//           };

//           return (
//             <div key={key} className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
//               <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-4 border-b border-border/30">
//                 <h3 className="font-semibold text-foreground flex items-center gap-3">
//                   <div className="p-2 bg-primary/20 rounded-lg">
//                     {getKeyIcon(key)}
//                   </div>
//                   {formattedKey}
//                 </h3>
//               </div>
//               <div className="p-6">
//                 {renderValue(key, value)}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   const SectionRenderer: React.FC<{ section: Section }> = ({ section }) => {
//     const sectionTitle = section.sectionTitle || section.name || section.title || "Section";
    
//     return (
//       <div className="space-y-8">
//         <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground rounded-2xl p-8 shadow-2xl relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
//           <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
//           <div className="relative z-10">
//             <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
//               <Zap className="w-8 h-8" />
//               {sectionTitle}
//             </h2>
//             {section.what && (
//               <p className="text-primary-foreground/90 leading-relaxed text-lg">{section.what}</p>
//             )}
//           </div>
//         </div>

//         {section.why && (
//           <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl p-6 backdrop-blur-sm">
//             <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-3 text-lg">
//               <div className="p-2 bg-amber-600/20 rounded-lg">
//                 <Target className="w-5 h-5" />
//               </div>
//               Why Use It?
//             </h3>
//             {Array.isArray(section.why) ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {section.why.map((reason, idx) => (
//                   <div key={idx} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-sky-900/30 rounded-lg">
//                     <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
//                     <span className="text-amber-700 dark:text-amber-300 font-medium">{reason}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-amber-700 dark:text-amber-300">{section.why}</p>
//             )}
//           </div>
//         )}

//         {section.syntax && (
//           <div className="space-y-4">
//             <h3 className="font-bold text-foreground text-xl flex items-center gap-2">
//               <Code2 className="w-5 h-5 text-primary" />
//               Syntax:
//             </h3>
//             <CodeBlock code={section.syntax} />
//           </div>
//         )}

//         {section.example && (
//           <div className="space-y-4">
//             <h3 className="font-bold text-foreground text-xl flex items-center gap-2">
//               <Play className="w-5 h-5 text-emerald-600" />
//               Example:
//             </h3>
//             <div className="space-y-4">
//               {section.example.code && <CodeBlock code={section.example.code} />}
//               {section.example.output && <OutputBlock output={section.example.output} />}
//             </div>
//           </div>
//         )}

//         {section.content && <ContentRenderer content={section.content} />}
//       </div>
//     );
//   };

//   const getIcon = (level: string) => {
//     switch (level) {
//       case 'basic': return <User className="w-5 h-5" />;
//       case 'intermediate': return <Database className="w-5 h-5" />;
//       case 'advanced': return <Settings className="w-5 h-5" />;
//       default: return <Book className="w-5 h-5" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
//             <Code2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//           </div>
//           <p className="text-muted-foreground font-semibold text-lg">Loading Java Course Content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!docs.length) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <Book className="w-20 h-20 text-muted-foreground/50 mx-auto mb-6" />
//           <p className="text-muted-foreground font-semibold text-lg">No course content available</p>
//         </div>
//       </div>
//     );
//   }

//   const { docIdx, sectionIdx } = selected;
//   const doc = docs[docIdx];
//   const sections = doc.sections || doc.subsections || [];
//   const currentSection = sections[sectionIdx];

//   return (
//     <div className="flex min-h-screen bg-background overflow-hidden">
//       {/* Enhanced Sidebar */}
//       <aside className={`${sidebarCollapsed ? 'w-20' : 'w-96'} bg-sidebar-background border-r border-sidebar-border shadow-2xl transition-all duration-300 flex flex-col h-screen overflow-hidden`}>
//         <div className="bg-gradient-to-r from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground p-6 relative overflow-hidden flex-shrink-0">
//           <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
//           <div className="flex items-center justify-between relative z-10">
//             <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
//               <div className="p-2 bg-white/20 rounded-xl">
//                 <Code2 className="w-6 h-6" />
//               </div>
//               {!sidebarCollapsed && (
//                 <div>
//                   <h1 className="text-xl font-bold">Java Course</h1>
//                   <p className="text-sidebar-primary-foreground/80 text-sm">Interactive Learning</p>
//                 </div>
//               )}
//             </div>
//             <button
//               onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//               className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//             >
//               <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
//             </button>
//           </div>
//         </div>
        
//         <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
//           {(() => {
//             const levelOrder = getLevelOrder();
//             const elements: React.ReactNode[] = [];
//             let currentLevelIndex = 0;

//             docs.forEach((d, dIdx) => {
//               const sections = d.sections || d.subsections || [];
//               const currentLevel = (d.level || 'basic').toLowerCase();
              
//               // Check if this is the start of a new level
//               const isNewLevel = dIdx === 0 || (docs[dIdx - 1].level || 'basic').toLowerCase() !== currentLevel;
              
//               // Check if this is the last doc of current level
//               const isLastOfLevel = dIdx === docs.length - 1 || (docs[dIdx + 1]?.level || 'basic').toLowerCase() !== currentLevel;
              
//               elements.push(
//                 <div key={`doc-${d._id}`} className="space-y-3">
//                   <div className="flex items-center justify-between p-4 bg-sidebar-accent/50 rounded-xl border border-sidebar-border/50 backdrop-blur-sm">
//                     <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
//                       <div className="p-2 bg-sidebar-primary/20 rounded-lg">
//                         {getIcon(d.level || 'basic')}
//                       </div>
//                       {!sidebarCollapsed && (
//                         <span className="font-bold text-sidebar-foreground text-sm">{d.title || d.topic}</span>
//                       )}
//                     </div>
//                     {!sidebarCollapsed && d.level && <LevelBadge level={d.level} />}
//                   </div>

//                   {!sidebarCollapsed && (
//                     <div className="space-y-2 ml-2">
//                       {sections.map((sec: Section, sIdx: number) => {
//                         const sectionTitle = sec.sectionTitle || sec.name || sec.title || `Section ${sIdx + 1}`;
//                         const isActive = docIdx === dIdx && sectionIdx === sIdx;

//                         return (
//                           <button
//                             key={sIdx}
//                             className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
//                               isActive
//                                 ? "bg-gradient-to-r from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground shadow-lg transform scale-[1.02] shadow-neon"
//                                 : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground hover:scale-[1.01]"
//                             }`}
//                             onClick={() => setSelected({ docIdx: dIdx, sectionIdx: sIdx })}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm font-medium">{sectionTitle}</span>
//                               <ChevronRight className={`w-4 h-4 transition-all duration-200 ${isActive ? 'rotate-90 text-sidebar-primary-foreground' : 'text-sidebar-foreground/50'}`} />
//                             </div>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );

//               // Add "Test Yourself" button after each level is completed
//               if (!sidebarCollapsed && isLastOfLevel && isLevelCompleted(currentLevel)) {
//                 elements.push(
//                   <div key={`test-${currentLevel}`} className="flex justify-center py-2">
//                     <button 
//                       onClick={() => startLevelQuiz(currentLevel)} 
//                       className="w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
//                       disabled={loadingQuiz}
//                     >
//                       {loadingQuiz ? (
//                         <div className="flex items-center gap-2">
//                           <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
//                           <span>Loading...</span>
//                         </div>
//                       ) : (
//                         <>
//                           <Target className="w-4 h-4" />
//                           Test Yourself — {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 );
//               }
//             });

//             return elements;
//           })()}
//         </div>
//       </aside>

//       {/* Enhanced Main Content */}
//       <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
//         <div className="max-w-5xl mx-auto p-8 min-h-full">
//           {/* Header */}
//           <div className="mb-10">
//             <div className="flex items-center gap-4 mb-6">
//               <div className="p-3 bg-card rounded-2xl shadow-lg border border-border/50">
//                 {getIcon(doc.level || 'basic')}
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
//                   {doc.title || doc.topic}
//                 </h1>
//                 <div className="flex items-center gap-3 mt-2">
//                   {doc.level && <LevelBadge level={doc.level} />}
//                   <span className="text-muted-foreground text-sm flex items-center gap-2">
//                     <Clock className="w-4 h-4" />
//                     Interactive Learning Experience
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="bg-card/30 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
//             <div className="p-10">
//               {currentSection ? (
//                 <SectionRenderer section={currentSection} />
//               ) : (
//                 <div className="space-y-8">
//                   {doc.what && (
//                     <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground rounded-2xl p-8">
//                       <h2 className="text-2xl font-bold mb-3">What is it?</h2>
//                       <p className="text-primary-foreground/90 leading-relaxed text-lg">{doc.what}</p>
//                     </div>
//                   )}
                  
//                   {doc.why && (
//                     <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
//                       <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-4">Why Use It?</h3>
//                       {Array.isArray(doc.why) ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                           {doc.why.map((reason, idx) => (
//                             <div key={idx} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-sky-900/30 rounded-lg">
//                               <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
//                               <span className="text-amber-700 dark:text-amber-300">{reason}</span>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-amber-700 dark:text-amber-300">{doc.why}</p>
//                       )}
//                     </div>
//                   )}
                  
//                   {doc.example && (
//                     <div className="space-y-4">
//                       <h3 className="font-bold text-foreground text-xl">Example:</h3>
//                       <div className="space-y-4">
//                         {doc.example.code && <CodeBlock code={doc.example.code} />}
//                         {doc.example.output && <OutputBlock output={doc.example.output} />}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Navigation Footer */}
//           <div className="flex justify-between items-center mt-10 p-6 bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50">
//             <button
//               className="flex items-center gap-2 px-6 py-3 text-primary hover:text-primary/80 disabled:text-muted-foreground/50 transition-all duration-200 disabled:cursor-not-allowed rounded-xl hover:bg-primary/10"
//               disabled={docIdx === 0 && sectionIdx === 0}
//               onClick={() => {
//                 if (sectionIdx > 0) {
//                   setSelected({ docIdx, sectionIdx: sectionIdx - 1 });
//                 } else if (docIdx > 0) {
//                   const prevDoc = docs[docIdx - 1];
//                   const prevSections = prevDoc.sections || prevDoc.subsections || [];
//                   setSelected({ docIdx: docIdx - 1, sectionIdx: prevSections.length - 1 });
//                 }
//               }}
//             >
//               <ChevronRight className="w-5 h-5 rotate-180" />
//               <span className="font-semibold">Previous</span>
//             </button>
            
//             <div className="text-center">
//               <span className="text-muted-foreground font-medium">
//                 Module {docIdx + 1} of {docs.length}
//               </span>
//               <div className="flex gap-2 mt-2">
//                 {docs.map((_, idx) => (
//                   <div
//                     key={idx}
//                     className={`w-2 h-2 rounded-full transition-all duration-200 ${
//                       idx === docIdx ? 'bg-primary w-6' : 'bg-muted'
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>
            
//             <button
//               className="flex items-center gap-2 px-6 py-3 text-primary hover:text-primary/80 disabled:text-muted-foreground/50 transition-all duration-200 disabled:cursor-not-allowed rounded-xl hover:bg-primary/10"
//               disabled={docIdx === docs.length - 1 && sectionIdx === sections.length - 1}
//               onClick={() => {
//                 if (sectionIdx < sections.length - 1) {
//                   setSelected({ docIdx, sectionIdx: sectionIdx + 1 });
//                 } else if (docIdx < docs.length - 1) {
//                   setSelected({ docIdx: docIdx + 1, sectionIdx: 0 });
//                 }
//               }}
//             >
//               <span className="font-semibold">Next</span>
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Quiz Modal */}
//         {showQuizModal && activeQuizLevel && (
//           <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-3">
//                   <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
//                     <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                       {activeQuizLevel.charAt(0).toUpperCase() + activeQuizLevel.slice(1)} Level Quiz
//                     </h3>
//                     <p className="text-gray-600 dark:text-gray-400">Test your knowledge with 20 questions</p>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => setShowQuizModal(false)}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
//                 >
//                   <div className="w-6 h-6 text-gray-400">×</div>
//                 </button>
//               </div>

//               <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
//                 {loadingQuiz ? (
//                   <div className="flex items-center justify-center py-12">
//                     <div className="text-center">
//                       <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 mx-auto mb-4"></div>
//                       <p className="text-gray-600 dark:text-gray-400 font-medium">Generating your quiz...</p>
//                     </div>
//                   </div>
//                 ) : quizResult ? (
//                   <div className="text-center py-8">
//                     <div className="mb-6">
//                       <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
//                         quizResult.score / quizResult.total >= 0.8 ? 'bg-green-100 dark:bg-green-900/50' : 
//                         quizResult.score / quizResult.total >= 0.6 ? 'bg-yellow-100 dark:bg-yellow-900/50' : 
//                         'bg-red-100 dark:bg-red-900/50'
//                       }`}>
//                         <CheckCircle className={`w-10 h-10 ${
//                           quizResult.score / quizResult.total >= 0.8 ? 'text-green-600 dark:text-green-400' : 
//                           quizResult.score / quizResult.total >= 0.6 ? 'text-yellow-600 dark:text-yellow-400' : 
//                           'text-red-600 dark:text-red-400'
//                         }`} />
//                       </div>
//                       <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                         {quizResult.score} / {quizResult.total}
//                       </h4>
//                       <p className="text-lg text-gray-600 dark:text-gray-400">
//                         {quizResult.score / quizResult.total >= 0.8 ? 'Excellent work!' : 
//                          quizResult.score / quizResult.total >= 0.6 ? 'Good job!' : 
//                          'Keep practicing!'}
//                       </p>
//                     </div>
//                     <button 
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl" 
//                       onClick={() => setShowQuizModal(false)}
//                     >
//                       Continue Learning
//                     </button>
//                   </div>
//                 ) : quizQuestions.length > 0 ? (
//                   <div className="space-y-6">
//                     {/* Progress Bar */}
//                     <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                       <div 
//                         className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//                         style={{ width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
//                       ></div>
//                     </div>

//                     <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
//                       <span>Question {currentQuestionIdx + 1} of {quizQuestions.length}</span>
//                       <span>{Math.round(((currentQuestionIdx + 1) / quizQuestions.length) * 100)}% Complete</span>
//                     </div>

//                     {/* Question */}
//                     <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
//                       <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
//                         {quizQuestions[currentQuestionIdx]?.question}
//                       </h4>

//                       <div className="grid grid-cols-1 gap-3">
//                         {quizQuestions[currentQuestionIdx]?.options.map((option: string, idx: number) => {
//                           const isSelected = selectedAnswers[currentQuestionIdx] === idx;
//                           return (
//                             <button
//                               key={idx}
//                               onClick={() => selectAnswer(currentQuestionIdx, idx)}
//                               className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
//                                 isSelected
//                                   ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
//                                   : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
//                               }`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
//                                   isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-500'
//                                 }`}>
//                                   {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
//                                 </div>
//                                 <span className="font-medium">{option}</span>
//                               </div>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>

//                     {/* Navigation */}
//                     <div className="flex justify-between items-center">
//                       <button
//                         className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
//                         onClick={prevQuestion}
//                         disabled={currentQuestionIdx === 0}
//                       >
//                         <ChevronRight className="w-4 h-4 rotate-180" />
//                         Previous
//                       </button>

//                       <div className="flex gap-3">
//                         {currentQuestionIdx < quizQuestions.length - 1 ? (
//                           <button
//                             className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200"
//                             onClick={nextQuestion}
//                           >
//                             Next
//                             <ChevronRight className="w-4 h-4" />
//                           </button>
//                         ) : (
//                           <button
//                             className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
//                             onClick={submitQuiz}
//                           >
//                             Submit Quiz
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="text-gray-400 dark:text-gray-500 mb-4">
//                       <Book className="w-12 h-12 mx-auto" />
//                     </div>
//                     <p className="text-gray-600 dark:text-gray-400 font-medium">
//                       No quiz questions available for this level.
//                     </p>
//                     <button 
//                       className="mt-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
//                       onClick={() => setShowQuizModal(false)}
//                     >
//                       Close
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default JavaCourseLearningPage;