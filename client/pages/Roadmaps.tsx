import React from "react";
import { BookOpen, Cpu, Code2, Briefcase } from "lucide-react"; // Icons

const roadmaps = [
  {
    title: "Web Development",
    description: "Learn HTML, CSS, JavaScript, React, and backend development.",
    icon: <Code2 className="w-8 h-8 text-blue-500" />,
    link: "#",
  },
  {
    title: "AI / Machine Learning",
    description: "Master Python, ML algorithms, deep learning, and deployment.",
    icon: <Cpu className="w-8 h-8 text-green-500" />,
    link: "#",
  },
  {
    title: "Data Science",
    description:
      "Build skills in statistics, data analysis, visualization, and big data tools.",
    icon: <BookOpen className="w-8 h-8 text-purple-500" />,
    link: "#",
  },
  {
    title: "Career Growth",
    description:
      "Resume building, freelancing, internships, and job preparation guides.",
    icon: <Briefcase className="w-8 h-8 text-orange-500" />,
    link: "#",
  },
];

export default function Roadmaps() {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold text-center mb-4">
        🚀 Explore Roadmaps
      </h1>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
        Choose a roadmap to start your learning journey. Each roadmap is designed
        step-by-step to take you from beginner to advanced.
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map((roadmap, index) => (
          <div
            key={index}
            className="p-6 border rounded-2xl shadow hover:shadow-lg transition bg-white dark:bg-gray-900"
          >
            <div className="flex items-center gap-4 mb-4">
              {roadmap.icon}
              <h2 className="text-xl font-semibold">{roadmap.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {roadmap.description}
            </p>
            <a
              href={roadmap.link}
              className="inline-block px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Start Learning →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
