import React, { useEffect, useMemo, useRef, useState } from "react";

// Data structure for the roadmap
type Section = {
  step: "Basic" | "Intermediate" | "Advanced";
  title: string;
  items: string[];
};

const sections: Section[] = [
  {
    step: "Basic",
    title: "The Foundation",
    items: [
      "Programming: Python (syntax, data structures, control flow, functions, libraries)",
      "Mathematics: Linear Algebra (vectors, matrices, operations)",
      "Mathematics: Calculus (derivatives, gradients)",
      "Mathematics: Statistics & Probability (mean, median, variance, probability)",
      "Essential Tools: Virtual environments, NumPy, Pandas, Matplotlib/Seaborn",
      "Core ML Concepts: Types of ML, key terminology",
      "ML Project Workflow: Data collection, preprocessing, model training, evaluation",
      "First Algorithms: Linear Regression, Logistic Regression, k-NN, k-Means",
    ],
  },
  {
    step: "Basic",
    title: "Core Machine Learning",
    items: [
      "What is Machine Learning? Difference from traditional programming",
      "Types of ML: Supervised, Unsupervised, Reinforcement Learning",
      "Key Terminology: Features, labels, training, testing, prediction",
      "Data Preprocessing: Handling missing values, encoding categorical data",
      "Feature Scaling: Normalization, Standardization",
      "Model Training & Evaluation: Training/testing splits, overfitting/underfitting",
      "Evaluation Metrics: MAE, MSE, R-squared, Accuracy, Precision, Recall",
      "Implementation: scikit-learn for algorithms",
    ],
  },
  {
    step: "Intermediate",
    title: "Advanced Data Handling",
    items: [
      "Advanced Feature Engineering: Creating new features, polynomial features",
      "Dimensionality Reduction: PCA, LDA",
      "Handling Imbalanced Datasets: SMOTE, undersampling, oversampling",
      "Tree-Based Models: Decision Trees, Random Forest",
      "Ensemble Methods: Bagging, Boosting (GBM, XGBoost, LightGBM, CatBoost)",
      "Support Vector Machines: Maximum margin classifiers, kernels",
      "Naive Bayes: Based on Bayes' Theorem",
    ],
  },
  {
    step: "Intermediate",
    title: "Model Evaluation & Optimization",
    items: [
      "Advanced Validation Techniques: k-Fold CV, Stratified k-Fold",
      "Hyperparameter Tuning: GridSearchCV, RandomizedSearchCV",
      "More Evaluation Metrics: F1-Score, ROC-AUC curves, Adjusted R-squared",
      "Introduction to Neural Networks: Perceptron, Multi-Layer Perceptrons",
      "Activation Functions: Sigmoid, Tanh, ReLU",
      "Training Neural Networks: Backpropagation, Optimizers (SGD, Adam, RMSprop)",
      "Loss Functions: Cross-Entropy, MSE",
      "Deep Learning Frameworks: TensorFlow or PyTorch",
    ],
  },
  {
    step: "Advanced",
    title: "Deep Learning Architectures",
    items: [
      "Convolutional Neural Networks: Convolutions, pooling, padding",
      "CNN Architectures: LeNet, AlexNet, VGG, ResNet, Inception",
      "Applications: Image classification, object detection, segmentation",
      "Recurrent Neural Networks: Handling sequential data, hidden states",
      "RNN Architectures: LSTMs, GRUs",
      "Applications: Time series forecasting, text generation",
      "Transformers & Attention Mechanisms: BERT, GPT models",
      "Applications: NLP translation, summarization, Q&A",
    ],
  },
  {
    step: "Advanced",
    title: "Advanced Topics & Specializations",
    items: [
      "Generative Models: GANs, VAEs, Diffusion Models",
      "Reinforcement Learning: Agent, environment, actions, rewards, policy",
      "RL Algorithms: Q-Learning, Deep Q-Networks, Policy Gradients",
      "Unsupervised & Self-Supervised Learning: Techniques for unlabeled data",
      "Model Deployment: APIs with FastAPI/Flask, Docker containerization",
      "Model Management: MLflow, Weights & Biases",
      "Cloud ML Services: AWS SageMaker, Google Vertex AI, Azure ML",
    ],
  },
  {
    step: "Advanced",
    title: "MLOps & Deployment",
    items: [
      "Model Deployment: Creating APIs, Containerizing with Docker",
      "Model Management: Tracking experiments, packaging code",
      "Cloud ML Services: AWS SageMaker, Google Vertex AI, Azure ML",
      "Building and deploying pipelines",
      "Monitoring & Maintenance: Data drift, concept drift",
      "Reading Research Papers: NeurIPS, ICML, CVPR",
      "Contributing to Open Source: scikit-learn, TensorFlow, PyTorch",
      "Specializations: Computer Vision, NLP, Reinforcement Learning",
    ],
  },
];

type Marker = {
  id: string;
  label: string;
  step: "Basic" | "Intermediate" | "Advanced";
  items: string[];
  t: number; // normalized 0..1 along the path
  cornerIndex: number; // which corner this marker is at
};

// Match project sky/cyan scheme
const stepColor: Record<Marker["step"], string> = {
  Basic: "#38bdf8", // sky-400
  Intermediate: "#0ea5e9", // sky-500
  Advanced: "#06b6d4", // cyan-500
};

function generatePath(
  segments: number,
  w = 1200,
  segH = 200,
  startX = 200,
  topPad = 100,
) {
  let d = `M ${startX} ${topPad}`;
  let x = startX;
  let y = topPad;
  const leftX = w * 0.15;
  const rightX = w * 0.85;
  const ctrl = w * 0.22;

  // Store corner points for precise marker placement
  const corners = [{ x: startX, y: topPad }];

  for (let i = 0; i < segments; i++) {
    const dirRight = i % 2 === 0;
    const nextX = dirRight ? rightX : leftX;
    const nextY = y + segH;
    const c1x = x + (dirRight ? ctrl : -ctrl);
    const c2x = nextX + (dirRight ? -ctrl : ctrl);
    const c1y = y + segH * 0.3;
    const c2y = y + segH * 0.7;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${nextX} ${nextY}`;
    x = nextX;
    y = nextY;
    corners.push({ x: nextX, y: nextY });
  }

  const viewBox = { w, h: y + 200 };
  return { d, viewBox, corners };
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setP(Math.max(0, Math.min(1, progress)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return p;
}

export default function CloudComputingRoadmap() {
  // Create enough segments to accommodate all sections
  const segments = sections.length;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generate path with responsive dimensions
  const { d, viewBox, corners } = useMemo(() => {
    const width = isMobile ? 800 : 1200;
    const segmentHeight = isMobile ? 100 : 300;
    const startX = isMobile ? 150 : 200;
    return generatePath(segments, width, segmentHeight, startX, 100);
  }, [segments, isMobile]);

  // Place markers at exact corner positions
  const markers: Marker[] = useMemo(() => {
    return sections.map((s, i) => {
      const cornerIndex = i; // Each section gets its own corner
      return {
        id: `${s.step}-${s.title}`.toLowerCase().replace(/\s+/g, "-"),
        label: s.title,
        step: s.step,
        items: s.items,
        t: i / Math.max(1, sections.length - 1), // For scroll animation
        cornerIndex,
      };
    });
  }, []);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [length, setLength] = useState(0);
  const [scale, setScale] = useState({ x: 1, y: 1, top: 0, left: 0 });
  const progress = useScrollProgress();

  useEffect(() => {
    const update = () => {
      if (!pathRef.current || !svgRef.current) return;
      const L = pathRef.current.getTotalLength();
      setLength(L);
      const rect = svgRef.current.getBoundingClientRect();
      setScale({
        x: rect.width / viewBox.w,
        y: rect.height / viewBox.h,
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    if (svgRef.current) ro.observe(svgRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [viewBox.w, viewBox.h]);

  // Calculate marker positions using corner coordinates
  const markerPositions = useMemo(() => {
    if (corners.length === 0 || scale.x === 0) return [];
    return markers.map((m) => {
      const corner = corners[Math.min(m.cornerIndex, corners.length - 1)];
      return {
        id: m.id,
        x: corner.x * scale.x + scale.left,
        y: corner.y * scale.y + scale.top,
        m,
      };
    });
  }, [markers, corners, scale]);

  const drawOffset = Math.max(0, length - length * progress);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-4 mb-4">
            
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-sky-400 drop-shadow-[0_0_18px_rgba(56,189,248,0.35)]">
              Artificial Intelligence and Machine Learning
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl">
            A comprehensive learning path to Machine Learning fundamentals.
          </p>
        </div>
      </div>

      {/* Roadmap */}
      <section className="relative mx-auto px-2 sm:px-4">
        <div
          className="relative"
          style={{ height: `${viewBox.h * (isMobile ? 0.4 : 0.7)}px` }}
        >
          <svg
            ref={svgRef}
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Road shadow */}
            <path
              d={d}
              stroke="#020617"
              strokeWidth={isMobile ? 50 : 70}
              fill="none"
              transform="translate(3, 3)"
              opacity={0.6}
            />
            {/* Road base */}
            <path
              d={d}
              stroke="#0b1020"
              strokeWidth={isMobile ? 40 : 60}
              fill="none"
            />
            {/* Road edges */}
            <path d={d} stroke="#1f2937" strokeWidth={2} fill="none" />
            {/* Center dashed line - animated in sky */}
            <path
              d={d}
              ref={pathRef}
              stroke="#38bdf8"
              strokeWidth={isMobile ? 2 : 3}
              fill="none"
              strokeDasharray={length}
              strokeDashoffset={drawOffset}
              style={{
                transition: "stroke-dashoffset 0.1s linear",
                filter: "drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))",
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Landmarks/Markers */}
          {markerPositions.map(({ id, x, y, m }, idx) => {
            // Determine side based on corner position and index
            const isEvenCorner = idx % 2 === 0;
            const side = isEvenCorner ? "right" : "left";

            // Responsive positioning
            const cardWidth = isMobile
              ? "w-[280px] max-w-[85vw]"
              : "w-[400px] max-w-[50vw]";
            const cardShift =
              side === "left"
                ? "-translate-x-[calc(100%+16px)] sm:-translate-x-[calc(100%+24px)]"
                : "translate-x-4 sm:translate-x-6";
            const align =
              side === "left"
                ? "items-end text-right"
                : "items-start text-left";
            const pinColor = stepColor[m.step];
            const itemsText = m.items.join(", ");

            // Responsive positioning offset
            const labelOffset =
              side === "left" ? "right-10 sm:right-14" : "left-10 sm:left-14";

            return (
              <div
                key={id}
                className="group pointer-events-auto absolute z-20"
                style={{
                  left: x - (isMobile ? 15 : 20),
                  top: y - (isMobile ? 15 : 20),
                }}
              >
                {/* Landmark Pin */}
                <div className="relative">
                  <div
                    className={`${isMobile ? "h-8 w-8" : "h-12 w-12"} rounded-full ring-2 sm:ring-4 ring-black/50 shadow-2xl transition-transform duration-200 group-hover:scale-110`}
                    style={{ backgroundColor: pinColor }}
                  >
                    <div
                      className={`absolute left-1/2 top-1/2 ${isMobile ? "h-2 w-2" : "h-3 w-3"} -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/80`}
                    />
                  </div>

                  {/* Step indicator and title */}
                  <div className={`absolute ${labelOffset} top-0`}>
                    <div className={`flex ${align} gap-1 sm:gap-2`}>
                      <div
                        className="rounded-full px-2 sm:px-3 py-1 text-xs font-bold text-black shadow-lg"
                        style={{ backgroundColor: pinColor }}
                      >
                        {m.step}
                      </div>
                    </div>
                    <div className={`mt-1 sm:mt-2 ${align}`}>
                      <div className="text-white font-bold text-sm sm:text-lg leading-tight max-w-[200px] sm:max-w-xs hover:underline">
                        {m.label}
                      </div>
                    </div>

                    {/* Tooltip */}
                    <div
                      className={`invisible absolute ${isMobile ? "top-8" : "top-10"} z-30 ${cardWidth} origin-top scale-95 rounded-xl border border-slate-700 bg-slate-900/95 p-3 sm:p-5 opacity-0 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:visible group-hover:scale-100 group-hover:opacity-100 ${cardShift}`}
                      style={{ boxShadow: `0 0 30px rgba(56, 189, 248, 0.25)` }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className="h-2 w-2 sm:h-3 sm:w-3 rounded-full"
                          style={{ backgroundColor: pinColor }}
                        />
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {m.step} Level
                        </div>
                      </div>
                      <div className="mb-2 font-semibold text-white text-sm sm:text-base">
                        {m.label}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {itemsText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer with CTA */}
      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 mt-10 sm:mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-muted-foreground">
            <p className="mb-2 text-sm sm:text-base">
              🚀 Complete your Cloud Computing & ML journey
            </p>
            <p className="text-xs sm:text-sm">
              Scroll up to explore each section • Hover over titles for detailed
              topics
            </p>
          </div>
          <div className="mt-4 sm:mt-6">
            <a
              href="#course"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Go to Course
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
