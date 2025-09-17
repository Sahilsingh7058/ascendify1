import { Link } from "react-router-dom";

export default function Community() {
  return (
    <main className="relative">
      <section className="container py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-sky-400 drop-shadow-[0_0_18px_rgba(56,189,248,0.45)]">
          Community
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Learn together, grow faster. Join study groups, get mentorship,
          participate in challenges, and connect with peers.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-border/60 bg-background/60 backdrop-blur p-6  dark:bg-gray-900">
            <h2 className="text-lg font-semibold">Study Groups</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Find or create cohorts for specific roadmaps. Keep each other
              accountable and share resources.
            </p>
            <div className="mt-4">
              <Link to="#groups" className="text-sky-400 hover:underline">
                Explore study groups →
              </Link>
            </div>
          </article>
          <article className="rounded-xl border border-border/60 bg-background/60 backdrop-blur p-6  dark:bg-gray-900">
            <h2 className="text-lg font-semibold">Mentorship</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect with experienced professionals for guidance on careers,
              portfolios, and interview prep.
            </p>
            <div className="mt-4">
              <Link to="#mentorship" className="text-sky-400 hover:underline">
                See mentorship options →
              </Link>
            </div>
          </article>
          <article className="rounded-xl border border-border/60 bg-background/60 backdrop-blur p-6  dark:bg-gray-900">
            <h2 className="text-lg font-semibold">Challenges & Events</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Weekly coding challenges, live workshops, and AMAs to practice and
              learn from the community.
            </p>
            <div className="mt-4">
              <Link to="#events" className="text-sky-400 hover:underline">
                View upcoming events →
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section id="groups" className="container py-12">
        <h3 className="text-2xl font-bold">Study Groups</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Popular groups based on current roadmaps and skills.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li className="rounded-lg border border-border/60 p-4  dark:bg-gray-900">
            <div className="font-medium">Frontend Foundations</div>
            <div className="text-xs text-muted-foreground mt-1">
              HTML • CSS • JavaScript • React
            </div>
          </li>
          <li className="rounded-lg border border-border/60 p-4  dark:bg-gray-900">
            <div className="font-medium">Data Analyst Track</div>
            <div className="text-xs text-muted-foreground mt-1">
              SQL • Python • Visualization
            </div>
          </li>
          <li className="rounded-lg border border-border/60 p-4  dark:bg-gray-900">
            <div className="font-medium">System Design Prep</div>
            <div className="text-xs text-muted-foreground mt-1">
              Scalability • Architecture • Tradeoffs
            </div>
          </li>
        </ul>
      </section>

      <section id="mentorship" className="container py-12">
        <h3 className="text-2xl font-bold">Mentorship</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          One-on-one guidance for accelerating your growth.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border/60 p-4  dark:bg-gray-900">
            <div className="font-medium">Career Strategy</div>
            <div className="text-xs text-muted-foreground mt-1">
              Roadmaps • Role targeting • Job search
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4  dark:bg-gray-900">
            <div className="font-medium">Project Feedback</div>
            <div className="text-xs text-muted-foreground mt-1">
              Code reviews • Portfolio • Demos
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4  dark:bg-gray-900">
            <div className="font-medium">Interview Coaching</div>
            <div className="text-xs text-muted-foreground mt-1">
              DSA • System design • Behavioral
            </div>
          </div>
        </div>
      </section>

      <section id="events" className="container py-12">
        <h3 className="text-2xl font-bold">Challenges & Events</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Join weekly activities to practice and network.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li className="rounded-lg border border-border/60 p-4  dark:bg-gray-900">
            <div className="font-medium">Frontend Friday</div>
            <div className="text-xs text-muted-foreground mt-1">
              Build a UI from a prompt in 90 minutes
            </div>
          </li>
          <li className="rounded-lg border border-border/60 p-4 dark:bg-gray-900">
            <div className="font-medium">SQL Saturday</div>
            <div className="text-xs text-muted-foreground mt-1">
              Solve real analytics problems
            </div>
          </li>
          <li className="rounded-lg border border-border/60 p-4 dark:bg-gray-900">
            <div className="font-medium">Mock Interview Night</div>
            <div className="text-xs text-muted-foreground mt-1">
              Practice technical and behavioral rounds
            </div>
          </li>
        </ul>
      </section>

      <section className="container py-16">
        <div className="rounded-xl border border-sky-400/40 bg-sky-400/10 p-6 text-center">
          <h3 className="text-xl font-semibold text-sky-300">
            Ready to get involved?
          </h3>
          <p className="mt-2 text-sm text-sky-100/80">
            Start with a free assessment and find the best groups and mentors
            for your goals.
          </p>
          <div className="mt-4">
            <Link
              to="/assessment"
              className="text-white bg-sky-500 hover:bg-sky-400 px-4 py-2 rounded-md"
            >
              Take the Career Assessment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
