import React from "react";
import { BookOpen, Cpu, Code2, Briefcase } from "lucide-react"; // Icons

const roadmaps = [
  {
    title: "Cloud Computing - AWS",
    description:
      "Learn core AWS services including EC2, S3, Lambda, IAM, and build scalable cloud-based applications.",
    icon: <Code2 className="w-8 h-8 text-sky-500" />,
    link: "/roadmaps/aws",
  },
  {
    title: "AI / Machine Learning",
    description:
      "Master Python, machine learning algorithms, deep learning frameworks, and real-world model deployment.",
    icon: <Cpu className="w-8 h-8 text-sky-500" />,
    link: "/roadmaps/ml",
  },
  {
    title: "Data Science",
    description:
      "Develop expertise in statistics, data cleaning, visualization, predictive modeling, and big data tools.",
    icon: <BookOpen className="w-8 h-8 text-sky-500" />,
    link: "/roadmaps/datascience",
  },
  {
    title: "Full Stack Development in Java",
    description:
      "Gain hands-on skills in Java, Spring Boot, REST APIs, frontend frameworks, and database integration.",
    icon: <Briefcase className="w-8 h-8 text-sky-500" />,
    link: "/roadmaps/java",
  },
  {
    title: "Full Stack Development in .Net",
    description:
      "Learn C#, ASP.NET Core, MVC, Entity Framework, frontend integration, and deployment strategies.",
    icon: <Briefcase className="w-8 h-8 text-sky-500" />,
    link: "/roadmaps/dotnet",
  },
];

export default function Roadmaps() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-sky-400 drop-shadow-[0_0_18px_rgba(56,189,248,0.45)]">
        Explore Roadmaps
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground pb-5">
        Choose a roadmap to start your learning journey. Each roadmap is
        designed step-by-step to take you from beginner to advanced.
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-3">
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
