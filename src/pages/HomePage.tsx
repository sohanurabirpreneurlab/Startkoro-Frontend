import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronUp,
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
  Users2,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type TextCard = {
  title: string;
  description?: string;
  text?: string;
};

type NumberedStep = TextCard & {
  number: string;
};

type Resource = {
  name: string;
  note: string;
};

type Toolkit = TextCard & {
  label: string;
};

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

type Faq = {
  question: string;
  answer: string;
};

const resourceLinks = [
  "https://www.roc.gov.bd/",
  "https://nbr.gov.bd/",
  "https://vat.gov.bd/",
  "https://bida.gov.bd/",
  "https://www.bb.org.bd/",
  "https://ictd.gov.bd/",
  "https://startupbangladesh.vc/",
  "https://www.smef.gov.bd/",
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
  const { t } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const trustBadges = t("home.trustBadges", { returnObjects: true }) as string[];
  const stats = t("home.stats", { returnObjects: true }) as TextCard[];
  const problemCards = t("home.problem.cards", { returnObjects: true }) as TextCard[];
  const journeySteps = t("home.journey.steps", { returnObjects: true }) as NumberedStep[];
  const featureCards = t("home.features.items", { returnObjects: true }) as TextCard[];
  const useCases = t("home.useCases.items", { returnObjects: true }) as TextCard[];
  const popularQuestions = t("home.popularQuestions.items", { returnObjects: true }) as string[];
  const resources = t("home.resources.items", { returnObjects: true }) as Resource[];
  const toolkits = t("home.toolkits.items", { returnObjects: true }) as Toolkit[];
  const testimonials = t("home.testimonials.items", { returnObjects: true }) as Testimonial[];
  const faqs = t("home.faq.items", { returnObjects: true }) as Faq[];

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
                {t("home.hero.badge")}
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                {t("home.hero.title")}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
                {t("home.hero.subtitle")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-11 border-0 bg-[linear-gradient(135deg,_#34d399,_#22c55e)] px-6 text-slate-950 shadow-[0_12px_30px_rgba(52,211,153,0.30)] hover:opacity-95"
                >
                  <Link to="/chat">
                    {t("home.hero.primaryCta")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="h-11 border-white/20 bg-white/8 px-6 text-white backdrop-blur hover:bg-white/14 hover:text-white"
                >
                  <a href="#journey">{t("home.hero.secondaryCta")}</a>
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
              <div className="relative rounded-[28px] bg-white/12 backdrop-blur-xl">
                <div className="rounded-[24px] border border-white/15 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="text-sm font-semibold text-white">{t("home.hero.panelTitle")}</div>
                      <div className="mt-1 text-xs text-slate-300">{t("home.hero.panelSubtitle")}</div>
                    </div>
                    <div className="rounded-full border border-emerald-400/25 bg-emerald-400/12 px-3 py-1 text-xs font-medium text-emerald-200">
                      {t("home.hero.panelBadge")}
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="ml-auto max-w-[84%] rounded-2xl rounded-br-md bg-[linear-gradient(135deg,_rgba(45,212,191,0.85),_rgba(59,130,246,0.88))] px-4 py-3 text-sm leading-7 text-white shadow-lg">
                      {t("home.hero.sampleUser")}
                    </div>
                    <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-white/10 bg-white/8 px-4 py-4 text-sm leading-7 text-slate-100">
                      {t("home.hero.sampleAssistant")}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        {t("home.hero.firstStepsTitle")}
                      </div>
                      <div className="mt-2 text-sm text-slate-300">{t("home.hero.firstStepsText")}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <Globe2 className="h-4 w-4 text-sky-300" />
                        {t("home.hero.localizedTitle")}
                      </div>
                      <div className="mt-2 text-sm text-slate-300">{t("home.hero.localizedText")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          {stats.map((item, index) => {
            const icons = [Landmark, WalletCards, ShieldCheck, Layers3];
            const Icon = icons[index % icons.length];

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
              eyebrow={t("home.problem.eyebrow")}
              title={t("home.problem.title")}
              description={t("home.problem.description")}
            />

            <div className="mt-6 rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,_rgba(236,253,245,0.95),_rgba(255,255,255,0.92))] p-6 shadow-[0_16px_50px_rgba(16,185,129,0.10)]">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-emerald-600 p-3 text-white">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">{t("home.problem.solutionTitle")}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{t("home.problem.solutionText")}</p>
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
            eyebrow={t("home.journey.eyebrow")}
            title={t("home.journey.title")}
            description={t("home.journey.description")}
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
            eyebrow={t("home.features.eyebrow")}
            title={t("home.features.title")}
            description={t("home.features.description")}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature, index) => {
              const icons = [Sparkles, ListChecks, SearchCheck, FileSpreadsheet, FileText, BookOpenCheck];
              const Icon = icons[index % icons.length];

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
            eyebrow={t("home.useCases.eyebrow")}
            title={t("home.useCases.title")}
            description={t("home.useCases.description")}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item, index) => {
              const icons = [Rocket, WalletCards, Store, Building2, GraduationCap, Users2];
              const Icon = icons[index % icons.length];

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
            eyebrow={t("home.popularQuestions.eyebrow")}
            title={t("home.popularQuestions.title")}
            description={t("home.popularQuestions.description")}
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
            eyebrow={t("home.resources.eyebrow")}
            title={t("home.resources.title")}
            description={t("home.resources.description")}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {resources.map((resource, index) => {
              const icons = [Building2, Landmark, Globe2, Banknote];
              const Icon = icons[index % icons.length];

              return (
                <a
                  key={resource.name}
                  href={resourceLinks[index]}
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
            {t("home.resources.warning")}
          </div>
        </section>

        <section id="tools" className="mt-20">
          <SectionHeading
            eyebrow={t("home.toolkits.eyebrow")}
            title={t("home.toolkits.title")}
            description={t("home.toolkits.description")}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {toolkits.map((toolkit, index) => {
              const icons = [WalletCards, BriefcaseBusiness, FileText, ShieldCheck, Calculator, LineChart];
              const Icon = icons[index % icons.length];

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
            eyebrow={t("home.testimonials.eyebrow")}
            title={t("home.testimonials.title")}
            description={t("home.testimonials.description")}
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-3xl border border-slate-200/80 bg-white/92 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
              >
                <MessageSquareQuote className="h-6 w-6 text-emerald-600" />
                <p className="mt-4 text-sm leading-7 text-slate-700">&quot;{testimonial.quote}&quot;</p>
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
              eyebrow={t("home.faq.eyebrow")}
              title={t("home.faq.title")}
              description={t("home.faq.description")}
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
                {t("home.finalCta.badge")}
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                {t("home.finalCta.title")}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                {t("home.finalCta.description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="h-11 border-0 bg-[linear-gradient(135deg,_#10b981,_#2563eb)] px-6 shadow-[0_14px_34px_rgba(37,99,235,0.18)]"
              >
                <Link to="/chat">
                  {t("home.finalCta.primary")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-11 px-6">
                <a href="#knowledge-base">{t("home.finalCta.secondary")}</a>
              </Button>
            </div>
          </div>
        </section>

        <footer className="mt-16 rounded-[28px] border border-slate-200/80 bg-white/88 px-6 py-8 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_repeat(3,minmax(0,1fr))]">
            <div>
              <div className="text-lg font-semibold text-slate-950">Start Koro AI</div>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">{t("home.footer.description")}</p>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                {t("home.footer.product")}
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <Link to="/chat" className="hover:text-slate-950">
                    {t("navbar.aiAssistant")}
                  </Link>
                </div>
                <div>
                  <a href="#journey" className="hover:text-slate-950">
                    {t("home.footer.journey")}
                  </a>
                </div>
                <div>
                  <a href="#tools" className="hover:text-slate-950">
                    {t("home.footer.toolkits")}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                {t("home.footer.resources")}
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <a href="#knowledge-base" className="hover:text-slate-950">
                    {t("navbar.knowledgeBase")}
                  </a>
                </div>
                <div>
                  <a href="#faq" className="hover:text-slate-950">
                    {t("home.footer.faq")}
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
                {t("home.footer.notes")}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{t("home.footer.noteText")}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-500">
            {t("home.footer.poweredBy")}
          </div>
        </footer>
      </div>

      {showScrollTop ? (
        <Button
          type="button"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 z-30 h-11 w-11 rounded-full border-0 bg-[linear-gradient(135deg,_#10b981,_#14b8a6_45%,_#2563eb)] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] hover:opacity-95 sm:bottom-8 sm:right-8"
          title={t("home.scrollTop")}
        >
          <ChevronUp className="h-5 w-5" />
          <span className="sr-only">{t("home.scrollTop")}</span>
        </Button>
      ) : null}
    </div>
  );
}
