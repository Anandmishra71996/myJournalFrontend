"use client";

import { useState } from "react";
import {
  Sparkles,
  X,
  ChevronRight,
  CheckCircle2,
  Circle,
  Calendar,
  Zap,
  Target,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import {
  GOAL_CATEGORIES_OPTIONS,
  GOAL_TYPES_OPTIONS,
} from "@/constants/goal.constants";
import {
  goalBreakdownService,
  GoalBreakdownResult,
  GoalBreakdownPlan,
} from "@/services/goalBreakdown.service";

interface GoalBreakdownModalProps {
  onClose: () => void;
  onPlanCreated: () => void;
}

type Step =
  | "input"
  | "loading"
  | "clarification"
  | "generating"
  | "result"
  | "error";

const CATEGORY_EXAMPLES: Record<string, string[]> = {
  Health: [
    "Improve physical fitness",
    "Build consistent sleep routine",
    "Run a 5K",
  ],
  Career: [
    "Get promoted to senior role",
    "Launch a side project",
    "Build a portfolio",
  ],
  Learning: [
    "Learn Spanish basics",
    "Read 12 books this year",
    "Master TypeScript",
  ],
  Mindset: [
    "Build a daily meditation habit",
    "Practice gratitude journaling",
    "Reduce anxiety",
  ],
  Relationships: [
    "Spend more quality time with family",
    "Expand my professional network",
  ],
  Personal: [
    "Declutter my home",
    "Save $5,000 emergency fund",
    "Travel to 3 new places",
  ],
};

export default function GoalBreakdownModal({
  onClose,
  onPlanCreated,
}: GoalBreakdownModalProps) {
  const [step, setStep] = useState<Step>("input");
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState("Health");
  const [type, setType] = useState<"weekly" | "monthly" | "yearly">("monthly");

  // Clarification state
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [clarificationIteration, setClarificationIteration] = useState(0);

  // Result state
  const [result, setResult] = useState<GoalBreakdownPlan | null>(null);
  const [resultMessage, setResultMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Phase 1 call
  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setError(null);
    setStep("loading");

    try {
      const response = await goalBreakdownService.generateBreakdown({
        goal: goal.trim(),
        category,
        type,
        clarificationIteration,
      });
      if (!response.success) throw new Error("Generation failed");

      const data: GoalBreakdownResult = response.data;

      if (data.clarificationNeeded && data.clarifyingQuestions?.length) {
        setClarifyingQuestions(data.clarifyingQuestions);
        const initialAnswers: Record<string, string> = {};
        data.clarifyingQuestions.forEach((q) => {
          initialAnswers[q] = "";
        });
        setAnswers(initialAnswers);
        setClarificationIteration((prev) => prev + 1);
        setStep("clarification");
      } else if (data.goalPlan) {
        setResult(data.goalPlan);
        setResultMessage(data.message);
        setStep("result");
        onPlanCreated();
      } else {
        throw new Error(data.message || "Unexpected response");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to generate breakdown. Please try again.";
      setError(msg);
      setStep("error");
    }
  };

  // Phase 2 call (with clarification answers)
  const handleSubmitAnswers = async () => {
    const unanswered = clarifyingQuestions.filter((q) => !answers[q]?.trim());
    if (unanswered.length > 0) return;

    setStep("generating");
    setError(null);

    try {
      const response = await goalBreakdownService.generateBreakdown({
        goal: goal.trim(),
        category,
        type,
        clarificationAnswers: answers,
        clarificationIteration,
      });
      if (!response.success) throw new Error("Generation failed");

      const data: GoalBreakdownResult = response.data;
      if (data.clarificationNeeded && data.clarifyingQuestions?.length) {
        setClarifyingQuestions(data.clarifyingQuestions);
        const nextAnswers: Record<string, string> = {};
        data.clarifyingQuestions.forEach((q) => {
          nextAnswers[q] = answers[q] || "";
        });
        setAnswers(nextAnswers);
        setClarificationIteration((prev) => prev + 1);
        setStep("clarification");
      } else if (data.goalPlan) {
        setResult(data.goalPlan);
        setResultMessage(data.message);
        setStep("result");
        onPlanCreated();
      } else {
        throw new Error(data.message || "Plan generation failed");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to generate plan.";
      setError(msg);
      setStep("error");
    }
  };

  const handleReset = () => {
    setStep("input");
    setGoal("");
    setCategory("Health");
    setType("monthly");
    setClarifyingQuestions([]);
    setAnswers({});
    setClarificationIteration(0);
    setResult(null);
    setError(null);
  };

  const allAnswered = clarifyingQuestions.every((q) => answers[q]?.trim());

  // ── Render helpers ───────────────────────────────────────────────────────

  const renderInputStep = () => (
    <div className="space-y-5">
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--color-text-secondary)" }}
        >
          What's your goal?
        </label>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. Improve physical health, learn Spanish, get promoted…"
          rows={3}
          maxLength={500}
          className="w-full px-4 py-2.5 rounded-xl resize-none focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            color: "var(--color-text-primary)",
            outline:
              "1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
          }}
        />
        <p
          className="text-xs mt-1 text-right"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {goal.length}/500
        </p>
      </div>

      {/* Quick examples */}
      {CATEGORY_EXAMPLES[category] && (
        <div>
          <p
            className="text-xs font-medium mb-2"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Quick examples:
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_EXAMPLES[category].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setGoal(ex)}
                className="px-3 py-1 text-xs rounded-full transition-colors"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 14%, transparent)",
                  color: "var(--color-primary)",
                  outline:
                    "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)",
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl"
            style={{
              backgroundColor: "var(--color-surface-container-lowest)",
              color: "var(--color-text-primary)",
              outline:
                "1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
            }}
          >
            {GOAL_CATEGORIES_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Timeframe
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl"
            style={{
              backgroundColor: "var(--color-surface-container-lowest)",
              color: "var(--color-text-primary)",
              outline:
                "1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
            }}
          >
            {GOAL_TYPES_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl transition-colors font-medium"
          style={{
            border:
              "1px solid color-mix(in srgb, var(--color-outline-variant) 40%, transparent)",
            color: "var(--color-text-secondary)",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleGenerate}
          disabled={!goal.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
            color: "white",
          }}
        >
          <Sparkles className="w-4 h-4" />
          Generate Plan
        </button>
      </div>
    </div>
  );

  const renderLoadingStep = (message: string) => (
    <div className="py-8 text-center">
      <Sparkles
        className="w-12 h-12 animate-pulse mx-auto mb-4"
        style={{ color: "var(--color-primary)" }}
      />
      <p
        className="font-semibold mb-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        {message}
      </p>
      <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
        The AI is crafting a realistic plan for you. This usually takes 5–15
        seconds.
      </p>
      <div className="mt-6 flex justify-center">
        <div
          className="animate-spin rounded-full h-10 w-10 border-b-2"
          style={{ borderColor: "var(--color-primary)" }}
        />
      </div>
    </div>
  );

  const renderClarificationStep = () => (
    <div className="space-y-5">
      <div
        className="flex items-start gap-3 rounded-xl p-4"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 10%, transparent)",
          outline:
            "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)",
        }}
      >
        <AlertCircle
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          style={{ color: "var(--color-primary)" }}
        />
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            A few quick questions
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Your goal is a bit broad. Answer these to get a precise, actionable
            plan.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {clarifyingQuestions.map((question, i) => (
          <div key={i}>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {i + 1}. {question}
            </label>
            <input
              type="text"
              value={answers[question] || ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [question]: e.target.value }))
              }
              placeholder="Your answer…"
              className="w-full px-4 py-2.5 rounded-xl"
              style={{
                backgroundColor: "var(--color-surface-container-lowest)",
                color: "var(--color-text-primary)",
                outline:
                  "1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={handleReset}
          className="flex-1 px-4 py-2.5 rounded-xl transition-colors font-medium"
          style={{
            border:
              "1px solid color-mix(in srgb, var(--color-outline-variant) 40%, transparent)",
            color: "var(--color-text-secondary)",
          }}
        >
          Start Over
        </button>
        <button
          onClick={handleSubmitAnswers}
          disabled={!allAnswered}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
            color: "white",
          }}
        >
          Generate Plan
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderResultStep = () => {
    if (!result) return null;
    return (
      <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
        {/* Success banner */}
        <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              Plan saved to your goals!
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
              {resultMessage}
            </p>
          </div>
        </div>

        {/* Goal title */}
        <div>
          <h3
            className="text-base font-bold flex items-center gap-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            <Target
              className="w-4 h-4"
              style={{ color: "var(--color-primary)" }}
            />
            {result.title}
          </h3>
        </div>

        {/* Milestones */}
        {result.milestones?.length > 0 && (
          <div>
            <h4
              className="text-sm font-semibold mb-2 flex items-center gap-1.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: "var(--color-secondary)" }}
              />
              Milestones ({result.milestones.length})
            </h4>
            <div className="space-y-2">
              {result.milestones.map((m, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg p-3"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-secondary) 12%, transparent)",
                  }}
                >
                  <Circle
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: "var(--color-secondary)" }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {m.title}
                    </p>
                    {m.description && (
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        {m.description}
                      </p>
                    )}
                    {m.targetDate && (
                      <p
                        className="text-xs mt-1 flex items-center gap-1"
                        style={{ color: "var(--color-secondary)" }}
                      >
                        <Calendar className="w-3 h-3" />
                        {new Date(m.targetDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Plan */}
        {result.weeklyPlan?.length > 0 && (
          <div>
            <h4
              className="text-sm font-semibold mb-2 flex items-center gap-1.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
              Weekly Plan (first {Math.min(result.weeklyPlan.length, 4)} weeks)
            </h4>
            <div className="space-y-2">
              {result.weeklyPlan.slice(0, 4).map((week) => (
                <div
                  key={week.weekNumber}
                  className="rounded-lg p-3"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-primary) 18%, transparent)",
                        color: "var(--color-primary)",
                      }}
                    >
                      Week {week.weekNumber}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {week.focus}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {week.actions.map((action, ai) => (
                      <li
                        key={ai}
                        className="text-xs flex items-center gap-1.5"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Steps */}
        {result.actionSteps?.length > 0 && (
          <div>
            <h4
              className="text-sm font-semibold mb-2 flex items-center gap-1.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <span className="w-2 h-2 rounded-full inline-block bg-green-500" />
              Daily & Weekly Actions
            </h4>
            <div className="space-y-2">
              {result.actionSteps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg p-3"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, #22c55e 10%, transparent)",
                  }}
                >
                  <Zap className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {step.title}
                      </p>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          step.frequency === "daily"
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                            : "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                        }`}
                      >
                        {step.frequency}
                      </span>
                      {step.estimatedMinutes && (
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          {step.estimatedMinutes} min
                        </span>
                      )}
                    </div>
                    {step.journalSignals && step.journalSignals.length > 0 && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        📓 Journal signals: {step.journalSignals.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          className="flex gap-3 pt-2 sticky bottom-0 pb-1"
          style={{ backgroundColor: "var(--color-surface-elevated)" }}
        >
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm"
            style={{
              border:
                "1px solid color-mix(in srgb, var(--color-outline-variant) 40%, transparent)",
              color: "var(--color-text-secondary)",
            }}
          >
            <RotateCcw className="w-4 h-4" />
            New Goal
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl transition-all font-medium text-sm"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
              color: "white",
            }}
          >
            View Goals ✓
          </button>
        </div>
      </div>
    );
  };

  const renderErrorStep = () => (
    <div className="py-6 text-center space-y-4">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-error) 18%, transparent)",
        }}
      >
        <AlertCircle
          className="w-6 h-6"
          style={{ color: "var(--color-error)" }}
        />
      </div>
      <div>
        <p
          className="font-semibold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          Something went wrong
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          {error}
        </p>
      </div>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl transition-colors font-medium"
          style={{
            border:
              "1px solid color-mix(in srgb, var(--color-outline-variant) 40%, transparent)",
            color: "var(--color-text-secondary)",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors font-medium"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
            color: "white",
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );

  // ── Step title map ───────────────────────────────────────────────────────
  const stepTitles: Record<Step, string> = {
    input: "Generate and Break Down Goal with AI",
    loading: "Analyzing your goal…",
    clarification: "Tell us more",
    generating: "Building your plan…",
    result: "Your Goal Plan is Ready 🎉",
    error: "Generation Failed",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-elevated)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom:
              "1px solid color-mix(in srgb, var(--color-outline-variant) 25%, transparent)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {stepTitles[step]}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        {(step === "input" ||
          step === "clarification" ||
          step === "result") && (
          <div className="flex items-center gap-1.5 px-6 pt-4 pb-0">
            {(["input", "clarification", "result"] as const).map((s, i) => (
              <div
                key={s}
                className="h-1 rounded-full flex-1 transition-all"
                style={{
                  backgroundColor:
                    s === step
                      ? "var(--color-primary)"
                      : i <
                          (
                            ["input", "clarification", "result"] as const
                          ).indexOf(step)
                        ? "color-mix(in srgb, var(--color-primary) 45%, transparent)"
                        : "var(--color-surface-container-high)",
                }}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5">
          {step === "input" && renderInputStep()}
          {step === "loading" && renderLoadingStep("Analyzing your goal…")}
          {step === "clarification" && renderClarificationStep()}
          {step === "generating" &&
            renderLoadingStep("Building your personalized plan…")}
          {step === "result" && renderResultStep()}
          {step === "error" && renderErrorStep()}
        </div>
      </div>
    </div>
  );
}
