import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CheckCircle2,
  CircleHelp,
  FileSpreadsheet,
  FileText,
  Globe2,
  GraduationCap,
  Landmark,
  Layers3,
  Lightbulb,
  LineChart,
  ListChecks,
  MessageSquareQuote,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Store,
  ChevronUp,
  Users2,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const trustBadges = [
  "Bangladesh-focused guidance",
  "English & Bangla support",
  "Built for founders, freelancers, and SMEs",
  "Knowledge-base powered answers",
];

const problemCards = [
  {
    title: "Too many scattered rules",
    description:
      "Registration, tax, banking, payment setup, and compliance information often live in separate places with different wording.",
  },
  {
    title: "Unclear registration steps",
    description:
      "Founders lose time trying to figure out what should come first, what documents matter, and which authority handles each step.",
  },
  {
    title: "No single startup roadmap",
    description:
      "Most early operators need one practical workspace that turns business questions into an ordered, realistic action plan.",
  },
];

const journeySteps = [
  {
    number: "01",
    title: "Describe your business",
    description:
      "Share what you want to launch, where you will operate, and what stage you are in.",
  },
  {
    number: "02",
    title: "Get localized AI guidance",
    description:
      "Receive practical guidance for trade license, eTIN, VAT/BIN, RJSC, finance, and payments.",
  },
  {
    number: "03",
    title: "Follow your checklist",
    description:
      "Turn advice into a clear sequence of tasks, documents, and next decisions tailored to Bangladesh.",
  },
  {
    number: "04",
    title: "Save and continue later",
    description:
      "Keep your chats, revisit past answers, and continue planning as your business grows.",
  },
];

const featureCards = [
  {
    icon: Sparkles,
    title: "AI Business Advisor",
    description:
      "Ask business questions in English or Bangla and get practical answers grounded in local startup and compliance context.",
  },
  {
    icon: ListChecks,
    title: "Startup Journey Builder",
    description:
      "Break a complex launch plan into a personalized sequence of steps, documents, registrations, and checkpoints.",
  },
  {
    icon: SearchCheck,
    title: "Knowledge Base Search",
    description:
      "Get retrieval-backed responses from curated guidance, business references, templates, and operational notes.",
  },
  {
    icon: FileSpreadsheet,
    title: "Excel Knowledge Upload",
    description:
      "Admins can import structured CSV or Excel knowledge so the assistant can answer from a stronger local dataset.",
  },
  {
    icon: FileText,
    title: "Business Templates & Tools",
    description:
      "Access planning prompts, payment setup references, compliance checklists, calculators, and practical starter assets.",
  },
  {
    icon: BookOpenCheck,
    title: "User Workspace & History",
    description:
      "Save conversations, reopen business threads, and keep planning work organized instead of restarting from scratch.",
  },
];

const useCases = [
  {
    icon: Rocket,
    title: "First-time founders",
    description:
      "Understand what to do first, which registrations matter, and how to avoid early-stage compliance confusion.",
  },
  {
    icon: WalletCards,
    title: "Freelancers",
    description:
      "Get help with eTIN, payment collection, pricing setup, and operating more professionally with clients.",
  },
  {
    icon: Store,
    title: "Online sellers",
    description:
      "Plan trade license basics, payment gateways, bookkeeping habits, and low-cost growth decisions for commerce.",
  },
  {
    icon: Building2,
    title: "SME owners",
    description:
      "Use Start Koro AI as a practical support layer for tax questions, operational planning, and business process clarity.",
  },
  {
    icon: GraduationCap,
    title: "Student entrepreneurs",
    description:
      "Validate ideas, estimate setup needs, and move from side-project thinking into an actionable business roadmap.",
  },
  {
    icon: Users2,
    title: "Incubators & startup teams",
    description:
      "Support portfolio founders with a reusable knowledge system for common questions, workflows, and local business basics.",
  },
];

const popularQuestions = [
  "How do I get a trade license in Dhaka?",
  "Do freelancers in Bangladesh need eTIN?",
  "When should I register a private limited company with RJSC?",
  "What documents are needed for VAT/BIN registration?",
  "How much capital do I need to start an online clothing shop?",
  "Which payment gateways work for small online sellers?",
];

const resources = [
  { name: "RJSC", note: "Company registration and corporate filings", href: "https://www.roc.gov.bd/" },
  { name: "NBR", note: "Tax authority information and taxpayer services", href: "https://nbr.gov.bd/" },
  { name: "VAT Online", note: "VAT registration and related digital services", href: "https://vat.gov.bd/" },
  { name: "BIDA", note: "Investment and business facilitation support", href: "https://bida.gov.bd/" },
  { name: "Bangladesh Bank", note: "Financial system references and regulatory notices", href: "https://www.bb.org.bd/" },
  { name: "ICT Division", note: "Digital ecosystem and innovation initiatives", href: "https://ictd.gov.bd/" },
  { name: "Startup Bangladesh", note: "Startup ecosystem programs and funding initiatives", href: "https://startupbangladesh.vc/" },
  { name: "SME Foundation", note: "Small business support, training, and resources", href: "https://www.smef.gov.bd/" },
];

const toolkits = [
  {
    label: "Payments",
    title: "Digital Payments for Online Sellers",
    description: "Understand gateway options, collection flow, settlement expectations, and customer trust considerations.",
  },
  {
    label: "Hiring",
    title: "Hiring Basics for Early Startups",
    description: "Get lightweight guidance for your first hires, role clarity, and realistic startup operating structure.",
  },
  {
    label: "Planning",
    title: "Lean Business Plan Template",
    description: "Turn a rough idea into a clear offer, customer segment, cost view, and early traction plan.",
  },
  {
    label: "Compliance",
    title: "Compliance Calendar",
    description: "Track recurring filing, tax, registration, and operational reminders in one simple planning framework.",
  },
  {
    label: "Finance",
    title: "Cost Calculator",
    description: "Estimate startup costs, recurring expenses, and basic launch runway before making early commitments.",
  },
  {
    label: "Operations",
    title: "Bookkeeping Starter Sheet",
    description: "Start recording sales, costs, and cash movement with a simple structure that is easy to maintain.",
  },
];

const testimonials = [
  {
    name: "Nusrat Jahan",
    role: "Founder, boutique ecommerce brand",
    quote:
      "It helped me turn a vague business idea into a clear checklist for licensing, payments, and first-month operations.",
  },
  {
    name: "Arif Hossain",
    role: "Freelance consultant",
    quote:
      "Instead of searching five different places, I could ask one question and get a practical answer that actually fit Bangladesh.",
  },
  {
    name: "Tahmid Rahman",
    role: "Startup program manager",
    quote:
      "The structure feels useful for early founders who need direction, not theory. It shortens the time between confusion and action.",
  },
];

const faqs = [
  {
    question: "Can this replace a lawyer or tax advisor?",
    answer:
      "No. Start Koro AI is designed for educational and operational guidance. For legal, tax, regulatory, or high-stakes decisions, users should verify with qualified professionals or official authorities.",
  },
  {
    question: "Does it support Bangla?",
    answer:
      "Yes. The product direction supports both English and Bangla so entrepreneurs can work in the language that is more practical for them.",
  },
  {
    question: "Can admins upload Excel FAQ data?",
    answer:
      "Yes. Admins can import structured CSV or Excel knowledge so the assistant can answer from curated rows of business Q&A.",
  },
  {
    question: "Is it suitable for early-stage founders?",
    answer:
      "Yes. The platform is especially useful for founders, freelancers, online sellers, and small teams who need clarity on what to do first.",
  },
  {
    question: "How does the AI use the knowledge base?",
    answer:
      "The assistant retrieves relevant chunks from curated knowledge before generating an answer, so responses can be grounded in your stored business references and admin-uploaded content.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
        <BadgeCheck className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">{description}</p>
    </div>
  );
}

export function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 480);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="relative h-full overflow-auto bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_26%),radial-gradient(circle_at_right,_rgba(59,130,246,0.10),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#f7fafc_42%,_#ffffff_100%)]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(17,94,89,0.92)_45%,_rgba(79,70,229,0.88)_100%)] px-6 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:px-10 md:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_28%)]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_480px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-100 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                AI workspace for Bangladeshi business operators
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Launch and grow your business in Bangladesh with AI-guided support
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
                Get practical guidance for trade license, eTIN, VAT, RJSC, finance, payments,
                compliance, and startup planning in one localized AI workspace built for founders,
                freelancers, online sellers, and SMEs.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-11 border-0 bg-[linear-gradient(135deg,_#34d399,_#22c55e)] px-6 text-slate-950 shadow-[0_12px_30px_rgba(52,211,153,0.30)] hover:opacity-95"
                >
                  <Link to="/chat">
                    Ask Start Koro AI <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="h-11 border-white/20 bg-white/8 px-6 text-white backdrop-blur hover:bg-white/14 hover:text-white"
                >
                  <a href="#journey">Plan My Business Journey</a>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {trustBadges.map((badge) => (
                  <div
                    key={badge}
                    className="rounded-full border border-white/12 bg-white/10 px-3 py-2 text-sm text-slate-100 backdrop-blur"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[28px] bg-emerald-400/20 blur-3xl" />
              <div className="relative rounded-[28px]  bg-white/12  backdrop-blur-xl">
                <div className="rounded-[24px] border border-white/15 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="text-sm font-semibold text-white">Start Koro AI</div>
                      <div className="mt-1 text-xs text-slate-300">
                        Localized business planning and compliance guidance
                      </div>
                    </div>
                    <div className="rounded-full border border-emerald-400/25 bg-emerald-400/12 px-3 py-1 text-xs font-medium text-emerald-200">
                      Knowledge-backed
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="ml-auto max-w-[84%] rounded-2xl rounded-br-md bg-[linear-gradient(135deg,_rgba(45,212,191,0.85),_rgba(59,130,246,0.88))] px-4 py-3 text-sm leading-7 text-white shadow-lg">
                      I want to start an online clothing business in Dhaka. What should I do first?
                    </div>
                    <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-white/10 bg-white/8 px-4 py-4 text-sm leading-7 text-slate-100">
                      Start with your business structure, trade license, eTIN, payment setup, and
                      basic bookkeeping. I can prepare a step-by-step checklist based on your
                      business type, location, and budget.
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        Suggested first steps
                      </div>
                      <div className="mt-2 text-sm text-slate-300">
                        Trade license, eTIN, payment method, cost plan
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <Globe2 className="h-4 w-4 text-sky-300" />
                        Localized output
                      </div>
                      <div className="mt-2 text-sm text-slate-300">
                        Bangladesh-focused guidance with practical action order
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            {
              icon: Landmark,
              title: "Registration clarity",
              text: "Understand trade license, eTIN, RJSC, VAT/BIN, and other starting requirements in a simpler flow.",
            },
            {
              icon: WalletCards,
              title: "Finance and payments",
              text: "Get support for pricing, gateway choices, startup costing, and basic bookkeeping habits.",
            },
            {
              icon: ShieldCheck,
              title: "Trustworthy guidance",
              text: "Use curated knowledge and practical context instead of chasing scattered answers across random links.",
            },
            {
              icon: Layers3,
              title: "Workspace continuity",
              text: "Keep your planning, questions, and next steps in one reusable AI-powered business workspace.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur"
              >
                <div className="inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            );
          })}
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div>
            <SectionHeading
              eyebrow="Why it matters"
              title="Bangladesh founders often need guidance before they need complexity"
              description="Starting a business should not require guessing your way through registrations, taxes, payments, and compliance. Start Koro AI is designed to reduce uncertainty and organize what comes next."
            />

            <div className="mt-6 rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,_rgba(236,253,245,0.95),_rgba(255,255,255,0.92))] p-6 shadow-[0_16px_50px_rgba(16,185,129,0.10)]">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-emerald-600 p-3 text-white">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">What Start Koro AI solves</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    It takes scattered startup and compliance questions and turns them into
                    localized, practical guidance you can actually act on. Instead of information
                    overload, you get clearer decisions, better sequencing, and a more confident
                    path from idea to operation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {problemCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
              >
                <h3 className="text-lg font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="journey" className="mt-20">
          <SectionHeading
            eyebrow="How it works"
            title="A practical workflow for turning business questions into action"
            description="The product is built to help founders move from uncertainty to ordered execution without losing context between sessions."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {journeySteps.map((step) => (
              <div
                key={step.number}
                className="group rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="text-sm font-semibold tracking-[0.18em] text-emerald-600">{step.number}</div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workspace" className="mt-20">
          <SectionHeading
            eyebrow="Core features"
            title="A polished founder workspace, not just a basic chat box"
            description="Start Koro AI combines assistant guidance, structured knowledge, and reusable business tools into a more complete operating layer for entrepreneurs in Bangladesh."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-slate-200/80 bg-white/92 p-6 shadow-[0_16px_44px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_18px_54px_rgba(15,23,42,0.10)]"
                >
                  <div className="inline-flex rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 p-3 text-slate-900">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading
            eyebrow="Use cases"
            title="Designed for the people who actually build businesses"
            description="Whether you are launching your first idea or supporting multiple early-stage operators, Start Koro AI is designed to be useful in real founder workflows."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200/80 bg-white/92 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
                >
                  <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading
            eyebrow="Popular questions"
            title="The kinds of startup and compliance questions people ask first"
            description="These are common questions founders, freelancers, and online sellers can use as a starting point inside the AI assistant."
          />

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {popularQuestions.map((question) => (
              <Link
                key={question}
                to="/chat"
                className="group rounded-2xl border border-slate-200/80 bg-white/92 px-5 py-4 text-sm text-slate-700 shadow-[0_10px_32px_rgba(15,23,42,0.05)] transition-colors hover:border-emerald-200 hover:text-slate-950"
              >
                <div className="flex items-start gap-3">
                  <CircleHelp className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span className="leading-7">{question}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="knowledge-base" className="mt-20">
          <SectionHeading
            eyebrow="Trusted resources"
            title="Keep official ecosystem references within reach"
            description="Start Koro AI can help you navigate next steps, but official authorities and qualified advisors should be used to verify legal, tax, and regulatory matters."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {resources.map((resource, index) => {
              const icons = [Building2, Landmark, Globe2, Banknote];
              const Icon = icons[index % icons.length];

              return (
                <a
                  key={resource.name}
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-3xl border border-slate-200/80 bg-white/92 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition-transform hover:-translate-y-1"
                >
                  <div className="inline-flex rounded-2xl bg-sky-50 p-3 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-lg font-semibold text-slate-950">{resource.name}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-600">{resource.note}</div>
                </a>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm leading-7 text-amber-900">
            Legal, tax, regulatory, and licensing matters should be verified with official
            authorities or qualified professionals before final action.
          </div>
        </section>

        <section id="tools" className="mt-20">
          <SectionHeading
            eyebrow="Business toolkits"
            title="Useful starter assets for operating with more confidence"
            description="Toolkits help users move from abstract advice into practical execution with planning, finance, compliance, and operating support."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {toolkits.map((toolkit, index) => {
              const toolkitIcons = [WalletCards, BriefcaseBusiness, FileText, ShieldCheck, Calculator, LineChart];
              const Icon = toolkitIcons[index % toolkitIcons.length];

              return (
                <div
                  key={toolkit.title}
                  className="rounded-3xl border border-slate-200/80 bg-white/92 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-white">
                      {toolkit.label}
                    </span>
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950">{toolkit.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{toolkit.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading
            eyebrow="Founder feedback"
            title="Built to feel useful, not abstract"
            description="The product should help operators move faster on practical decisions without pretending to replace professional judgment."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-3xl border border-slate-200/80 bg-white/92 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
              >
                <MessageSquareQuote className="h-6 w-6 text-emerald-600" />
                <p className="mt-4 text-sm leading-7 text-slate-700">“{testimonial.quote}”</p>
                <div className="mt-6">
                  <div className="font-semibold text-slate-950">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-20 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div>
            <SectionHeading
              eyebrow="Responsible AI"
              title="Clear guidance, with responsible limits"
              description="Start Koro AI is meant to make business planning and operational guidance more accessible. It should be used as a practical assistant, not as a substitute for regulated professional advice."
            />
          </div>

          <div className="space-y-4">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-3xl border border-slate-200/80 bg-white/92 p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)]"
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-950">
                  <div className="flex items-center justify-between gap-4">
                    <span>{item.question}</span>
                    <span className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-20 overflow-hidden rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,_rgba(16,185,129,0.10),_rgba(59,130,246,0.08),_rgba(255,255,255,0.96))] px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:px-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700 backdrop-blur">
                <Rocket className="h-3.5 w-3.5" />
                Ready to start?
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Ready to turn your business idea into a clear action plan?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                Ask Start Koro AI your first question and get a practical roadmap tailored for
                Bangladesh, your business type, and your next real decision.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="h-11 border-0 bg-[linear-gradient(135deg,_#10b981,_#2563eb)] px-6 shadow-[0_14px_34px_rgba(37,99,235,0.18)]"
              >
                <Link to="/chat">
                  Start Asking AI <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-11 px-6">
                <a href="#knowledge-base">Explore Knowledge Base</a>
              </Button>
            </div>
          </div>
        </section>

        <footer className="mt-16 rounded-[28px] border border-slate-200/80 bg-white/88 px-6 py-8 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_repeat(3,minmax(0,1fr))]">
            <div>
              <div className="text-lg font-semibold text-slate-950">Start Koro AI</div>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
                An AI-powered business assistant for Bangladeshi entrepreneurs, startups, SMEs,
                freelancers, and online sellers who need clearer next steps.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Product
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <Link to="/chat" className="hover:text-slate-950">
                    AI Assistant
                  </Link>
                </div>
                <div>
                  <a href="#journey" className="hover:text-slate-950">
                    Journey
                  </a>
                </div>
                <div>
                  <a href="#tools" className="hover:text-slate-950">
                    Toolkits
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Resources
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <a href="#knowledge-base" className="hover:text-slate-950">
                    Knowledge Base
                  </a>
                </div>
                <div>
                  <a href="#faq" className="hover:text-slate-950">
                    FAQ
                  </a>
                </div>
                <div>
                  <a href="https://bida.gov.bd/" target="_blank" rel="noreferrer" className="hover:text-slate-950">
                    BIDA
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Notes
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Guidance is educational and operational in nature. Users should verify legal, tax,
                and regulated matters with qualified professionals or official authorities.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-500">
            Powered by Preneur Lab
          </div>
        </footer>
      </div>

      {showScrollTop ? (
        <Button
          type="button"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 z-30 h-11 w-11 rounded-full border-0 bg-[linear-gradient(135deg,_#10b981,_#14b8a6_45%,_#2563eb)] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] hover:opacity-95 sm:bottom-8 sm:right-8"
          title="Take me to top"
        >
          <ChevronUp className="h-5 w-5" />
          <span className="sr-only">Take me to top</span>
        </Button>
      ) : null}
    </div>
  );
}
