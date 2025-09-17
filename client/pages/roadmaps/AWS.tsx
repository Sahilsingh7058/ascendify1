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
      "Cloud Computing: Definition, benefits, and pay-as-you-go pricing model",
      "Deployment Models: Public, Private, Hybrid, and Multi-Cloud",
      "Service Models: IaaS (EC2, VPC, S3), PaaS (Elastic Beanstalk, RDS), SaaS (WorkMail, Chime)",
      "The Shared Responsibility Model: Security of the Cloud vs. Security in the Cloud",
      "Basic Economics: CAPEX vs. OPEX, Total Cost of Ownership (TCO)",
      "Essential Tools: AWS Management Console, AWS CLI, SDKs",
      "Core AWS Services: EC2, S3, VPC, IAM, RDS",
      "Hands-on Practice: Launching an EC2 instance, creating an S3 bucket, setting up a VPC, configuring IAM users, and creating an RDS database",
    ],
  },
  {
    step: "Basic",
    title: "Core Cloud Concepts",
    items: [
      "What is Cloud Computing?: Differences from traditional IT infrastructure",
      "Types of Cloud Services: IaaS, PaaS, SaaS",
      "Key Terminology: Regions, Availability Zones, Edge Locations",
      "Networking Basics: VPC, Subnets, Route Tables, Internet Gateway, NAT Gateway",
      "Security Basics: IAM, Security Groups, Network ACLs",
      "Storage Basics: S3, EBS, EFS, Storage Gateway",
      "Compute Basics: EC2, Lambda, Elastic Beanstalk",
      "Database Basics: RDS, DynamoDB, Redshift",
      "Implementation: AWS Free Tier for hands-on practice",
    ],
  },
  {
    step: "Intermediate",
    title: "Advanced Cloud Services",
    items: [
      "High Availability & Fault Tolerance: Multi-AZ deployments, Auto Scaling, Load Balancers (ELB/ALB)",
      "Scalability & Elasticity: Vertical vs. Horizontal scaling, Auto Scaling Groups",
      "Core Networking: Subnets, Route Tables, Security Groups, NACLs, VPNs, Direct Connect",
      "Advanced Security: Encryption (KMS), IAM Roles, Policies, AssumeRole, AWS Organizations",
      "Serverless Architecture: AWS Lambda, API Gateway, DynamoDB, Step Functions",
      "Containers: Amazon ECS, EKS, and Fargate",
      "Message Queues: SQS, SNS",
      "Advanced Databases: Aurora, DynamoDB Streams, DAX, ElastiCache",
    ],
  },
  {
    step: "Intermediate",
    title: "Cloud Architecture & DevOps",
    items: [
      "Advanced Validation Techniques: Multi-AZ deployments, Blue/Green deployments",
      "Infrastructure as Code (IaC): AWS CloudFormation, Terraform",
      "CI/CD Pipelines: AWS CodePipeline, CodeBuild, CodeDeploy, GitHub Actions",
      "Monitoring & Logging: CloudWatch, CloudTrail, AWS Config",
      "Cost Optimization: Reserved Instances, Spot Instances, Savings Plans",
      "Disaster Recovery: Backup strategies, Pilot Light, Warm Standby, Multi-Site Active-Active",
      "Microservices Architecture: Designing and deploying microservices using ECS, Lambda, API Gateway",
      "Implementation: Building a full-stack application using multiple AWS services",
    ],
  },
  {
    step: "Advanced",
    title: "Cloud Solutions Architecture",
    items: [
      "Advanced Design Patterns: Event-driven architecture, Microservices, Data Lakes, Disaster Recovery strategies",
      "Well-Architected Framework: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization",
      "Multi-account Strategies: AWS Organizations, Service Control Policies (SCPs), Consolidated Billing",
      "Advanced Networking: Transit Gateway, PrivateLink, Direct Connect, VPN CloudHub",
      "Hybrid Cloud: AWS Outposts, Storage Gateway, DataSync",
      "Serverless at Scale: Optimizing Lambda functions, Step Functions, EventBridge",
      "Big Data & Analytics: EMR, Athena, Redshift, Kinesis, Glue, QuickSight",
      "Machine Learning: SageMaker, Rekognition, Lex, Polly, Comprehend",
    ],
  },
  {
    step: "Advanced",
    title: "DevOps, Security & Specializations",
    items: [
      "Advanced CI/CD: Blue/Green Deployments, Canary Deployments, Infrastructure Testing",
      "Configuration Management: Ansible, Chef, Puppet",
      "Observability: CloudWatch Logs Insights, X-Ray, Prometheus, Grafana",
      "Security: Zero-Trust Networks, AWS Network Firewall, GuardDuty, Inspector, Macie",
      "Compliance & Governance: AWS Config, AWS Artifact, AWS Control Tower, AWS Security Hub",
      "Penetration Testing: Ethical hacking in the cloud (with AWS approval)",
      "Data & Machine Learning: Building, training, and deploying ML models using SageMaker",
      "MLOps: Model deployment, management, and monitoring using SageMaker, MLflow, Kubeflow",
      "Cloud-Native Development: Developing and deploying cloud-native applications using containers and serverless",
    ],
  },
  {
    step: "Advanced",
    title: "Advanced Cloud Topics & Specializations",
    items: [
      "Generative AI: Using AWS services like Bedrock, SageMaker JumpStart for generative AI models",
      "Advanced Analytics: Real-time analytics with Kinesis, batch processing with Glue, data lakes with Lake Formation",
      "IoT: AWS IoT Core, IoT Greengrass, IoT Analytics",
      "Edge Computing: AWS Local Zones, Wavelength, Outposts",
      "Blockchain: Amazon Managed Blockchain, Quantum Ledger Database (QLDB)",
      "Robotics: AWS RoboMaker",
      "Space: AWS Ground Station",
      "Advanced Certifications: AWS Solutions Architect Professional, DevOps Engineer Professional, Security Specialty",
      "Reading Research Papers: AWS Whitepapers, re:Invent sessions, AWS Blogs",
      "Contributing to Open Source: AWS CDK, AWS SAM, Open-Source AWS tools",
      "Specializations: Security, Networking, Data Analytics, Machine Learning, DevOps",
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
  segH = 300,
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

  const viewBox = { w, h: y + 150 };
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
    const segmentHeight = isMobile ? 60 : 360;
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
              AWS Cloud Computing
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl">
            A comprehensive learning path from cloud fundamentals to advanced
            AWS architecture and specialized services.
          </p>
        </div>
      </div>

      {/* Roadmap */}
      <section className="relative mx-auto px-2 sm:px-4">
        <div
          className="relative"
          style={{ height: `${viewBox.h * (isMobile ? 0.4 : 0.6)}px` }}
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
              🚀 Complete your AWS cloud journey
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
