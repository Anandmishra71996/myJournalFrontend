"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X, AlertTriangle } from "lucide-react";
import { Goal } from "@/constants/goal.constants";
import {
  aiTemplateService,
  TemplateGenerationResult,
} from "@/services/aiTemplate.service";
import { journalTemplateService } from "@/services/journalTemplate.service";
import { toastService } from "@/services/toast.service";

interface GoalTemplateAssistantModalProps {
  goals: Goal[];
  onClose: () => void;
  onUpdated: () => void;
}

type Step = "select" | "loading" | "result" | "updating";

interface GoalTemplateRunResult {
  goalTitles: string[];
  result: TemplateGenerationResult;
}

export default function GoalTemplateAssistantModal({
  goals,
  onClose,
  onUpdated,
}: GoalTemplateAssistantModalProps) {
  const router = useRouter();
  const activeGoals = useMemo(
    () => goals.filter((goal) => goal.status === "active"),
    [goals],
  );

  const [step, setStep] = useState<Step>("select");
  const [mode, setMode] = useState<"unified" | "separate">("unified");
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>(
    activeGoals.map((goal) => goal._id),
  );
  const [results, setResults] = useState<GoalTemplateRunResult[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  const selectedGoals = useMemo(
    () => activeGoals.filter((goal) => selectedGoalIds.includes(goal._id)),
    [activeGoals, selectedGoalIds],
  );
  const selectedResult = results[selectedResultIndex] || null;

  const buildGoalNarrative = (goal: Goal) => {
    const details: string[] = [
      `Goal Title: ${goal.title}`,
      `Type: ${goal.type}`,
      `Category: ${goal.category}`,
    ];

    if (goal.why) {
      details.push(`Motivation: ${goal.why}`);
    }
    if (goal.successDefinition) {
      details.push(`Success Definition: ${goal.successDefinition}`);
    }
    if (goal.trackingMethods?.length) {
      details.push(`Tracking Methods: ${goal.trackingMethods.join(", ")}`);
    }
    if (goal.milestones?.length) {
      details.push(
        `Milestones: ${goal.milestones.map((m) => m.title).join(" | ")}`,
      );
    }
    if (goal.actionSteps?.length) {
      details.push(
        `Action Steps: ${goal.actionSteps.map((s) => s.title).join(" | ")}`,
      );
    }

    return details.join("\n");
  };

  const buildUnifiedPrompt = (goalsToProcess: Goal[]) => {
    const goalSections = goalsToProcess
      .map((goal, index) => `Goal ${index + 1}\n${buildGoalNarrative(goal)}`)
      .join("\n\n");

    return [
      "Create ONE unified journaling template that helps track progress across all of these goals.",
      "Infer measurable and reflective tracking fields from the full context.",
      "Avoid duplicate fields.",
      "Prioritize fields that make progress review actionable.",
      "",
      goalSections,
    ].join("\n");
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoalIds((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId],
    );
  };

  const handleAnalyze = async () => {
    if (selectedGoalIds.length === 0) {
      toastService.error("Select at least one goal");
      return;
    }

    setStep("loading");
    try {
      if (mode === "unified") {
        const prompt = buildUnifiedPrompt(selectedGoals);
        const response = await aiTemplateService.generateTemplate(prompt);
        setResults([
          {
            goalTitles: selectedGoals.map((goal) => goal.title),
            result: response.data,
          },
        ]);
      } else {
        const separateResults = await Promise.all(
          selectedGoals.map(async (goal) => {
            const prompt = buildGoalNarrative(goal);
            const response = await aiTemplateService.generateTemplate(prompt);
            return {
              goalTitles: [goal.title],
              result: response.data,
            };
          }),
        );
        setResults(separateResults);
      }

      setSelectedResultIndex(0);
      setStep("result");
    } catch (error: any) {
      toastService.error(
        "Failed to generate template",
        error.response?.data?.error || "Please try again",
      );
      setStep("select");
    }
  };

  const ensureUserTemplateId = async (template: any) => {
    const templateId = template?._id;
    if (!templateId) return null;

    if (template.createdBy === "user") {
      return templateId;
    }

    const cloneResponse = await journalTemplateService.cloneTemplate(
      templateId,
      {
        name: `${template.name} (Goals)`,
      },
    );

    return cloneResponse.data._id;
  };

  const handleUseTemplate = async (template: any) => {
    if (!template?._id) {
      toastService.info("Open Templates to review this generated draft");
      onClose();
      router.push("/templates");
      return;
    }

    setStep("updating");
    try {
      const templateId = await ensureUserTemplateId(template);
      if (!templateId) {
        throw new Error("Unable to resolve template");
      }

      await journalTemplateService.setDefaultTemplate(templateId);
      toastService.success("Template activated for journaling");
      onUpdated();
      onClose();
    } catch (error: any) {
      toastService.error(
        "Failed to activate template",
        error.response?.data?.error || "Please try again",
      );
      setStep("result");
    }
  };

  const handleOpenTemplates = () => {
    onClose();
    router.push("/templates");
  };

  const renderSelectStep = () => (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          Select goals to generate from
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          We will send selected goals as long-form context to the Template
          Agent, then return either an existing match or a new generated
          template.
        </p>
      </div>

      <div className="grid gap-2">
        {activeGoals.length === 0 && (
          <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] p-3 text-sm text-[var(--color-text-secondary)]">
            No active goals found. Create at least one active goal first.
          </div>
        )}
        {activeGoals.map((goal) => {
          const selected = selectedGoalIds.includes(goal._id);
          return (
            <button
              key={goal._id}
              type="button"
              onClick={() => toggleGoal(goal._id)}
              className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                selected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                  : "border-[var(--color-outline-variant)] bg-[var(--color-surface-low)]"
              }`}
            >
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {goal.title}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {goal.type} • {goal.category}
              </p>
            </button>
          );
        })}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
          Template strategy
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("unified")}
            className={`rounded-xl border px-3 py-2 text-sm ${
              mode === "unified"
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text-primary)]"
                : "border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] text-[var(--color-text-secondary)]"
            }`}
          >
            One unified template
          </button>
          <button
            type="button"
            onClick={() => setMode("separate")}
            className={`rounded-xl border px-3 py-2 text-sm ${
              mode === "separate"
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text-primary)]"
                : "border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] text-[var(--color-text-secondary)]"
            }`}
          >
            Separate recommendations
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[var(--color-outline-variant)] px-4 py-2 text-sm text-[var(--color-text-primary)]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={selectedGoalIds.length === 0 || activeGoals.length === 0}
          className="rounded-lg bg-gradient-to-br from-[var(--color-secondary-dark)] to-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-[var(--color-goal-cta-text)] disabled:opacity-60"
        >
          Generate Template
        </button>
      </div>
    </div>
  );

  const renderResultDetails = (runResult: GoalTemplateRunResult) => {
    const { result, goalTitles } = runResult;
    const template = result.template as any;
    const isExisting = result.type === "existing";

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] p-3">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {isExisting
              ? "Existing Template Matched"
              : "New Template Generated"}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Goals: {goalTitles.join(", ")}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Template: {template?.name || "Generated Draft"}
          </p>
          {result.message && (
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {result.message}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
            Template fields
          </p>
          {Array.isArray(template?.fields) && template.fields.length > 0 ? (
            <ul className="space-y-1">
              {template.fields.map((field: any, index: number) => (
                <li
                  key={field.id || `${field.label}-${index}`}
                  className="flex items-center justify-between text-sm text-[var(--color-text-primary)]"
                >
                  <span>{field.label}</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {field.type}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              No fields available in preview.
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={handleOpenTemplates}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-outline-variant)] px-4 py-2 text-sm text-[var(--color-text-primary)]"
          >
            Open Templates
          </button>
          <button
            type="button"
            onClick={() => handleUseTemplate(template)}
            className="rounded-lg bg-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-[var(--color-goal-cta-text)]"
          >
            {isExisting
              ? "Use Existing Template"
              : "Activate Generated Template"}
          </button>
        </div>
      </div>
    );
  };

  const renderResultStep = () => {
    if (!selectedResult) {
      return (
        <div className="rounded-xl border border-[var(--color-status-warning-text)]/30 bg-[var(--color-status-warning-soft)] p-3 text-sm text-[var(--color-status-warning-text)]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            No result returned. Try again.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {results.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {results.map((resultItem, index) => (
              <button
                key={resultItem.goalTitles.join("-")}
                type="button"
                onClick={() => setSelectedResultIndex(index)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  index === selectedResultIndex
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text-primary)]"
                    : "border-[var(--color-outline-variant)] text-[var(--color-text-secondary)]"
                }`}
              >
                {resultItem.goalTitles[0] || `Goal ${index + 1}`}
              </button>
            ))}
          </div>
        )}

        {renderResultDetails(selectedResult)}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep("select")}
            className="text-sm text-[var(--color-text-secondary)] underline-offset-2 hover:underline"
          >
            Back
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-3xl rounded-t-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--color-goal-chip-surface)] p-2">
              <Sparkles className="h-5 w-5 text-[var(--color-secondary)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                Create Template for Goals
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Analyze coverage, review missing fields, then confirm updates.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "select" && renderSelectStep()}

        {(step === "loading" || step === "updating") && (
          <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] p-6 text-center">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {step === "loading"
                ? "Generating template from selected goals..."
                : "Applying template changes..."}
            </p>
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              This may take a few seconds.
            </p>
          </div>
        )}

        {step === "result" && renderResultStep()}
      </div>
    </div>
  );
}
