"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import {
  BIGGEST_CONSTRAINT_OPTIONS,
  FOCUS_AREAS_OPTIONS,
  INSIGHT_FREQUENCY_OPTIONS,
  INSIGHT_STYLE_OPTIONS,
  LIFE_PHASE_OPTIONS,
  WHY_USING_APP_OPTIONS,
  type InsightFrequency,
  type InsightStyle,
  type ProfileFormData,
} from "@/constants/profile.constants";

type ProfileFormVariant = "setup" | "dashboard";

interface ProfileFormProps {
  variant?: ProfileFormVariant;
  onSaved?: () => void;
}

const inputClassName =
  "w-full rounded-xl border border-[color:var(--color-outline-variant)]/25 bg-[color:var(--color-surface-container-high)]/92 px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-primary)]/55 focus:ring-2 focus:ring-[color:var(--color-primary)]/20";

const selectClassName =
  "w-full rounded-xl border border-[color:var(--color-outline-variant)]/25 bg-[color:var(--color-surface-container-high)]/92 px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition focus:border-[color:var(--color-primary)]/55 focus:ring-2 focus:ring-[color:var(--color-primary)]/20";

const cardClassName =
  "rounded-3xl border border-[color:var(--color-outline-variant)]/14 bg-[color:var(--color-surface-container-low)]/88 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.16)] backdrop-blur-sm sm:p-6";

export default function ProfileForm({
  variant = "setup",
  onSaved,
}: ProfileFormProps) {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    avatar: "",
    current_role: "",
    whyUsingApp: "Improve consistency",
    focusAreas: [],
    lifePhase: undefined,
    biggestConstraint: undefined,
    insightStyle: "gentle",
    insightFrequency: "weekly",
    aiEnabled: true,
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      name: user.name || "",
      avatar: (user as any).avatar || "",
      current_role: (user as any).current_role || "",
      whyUsingApp: (user as any).whyUsingApp || "Improve consistency",
      focusAreas: (user as any).focusAreas || [],
      lifePhase: (user as any).lifePhase,
      biggestConstraint: (user as any).biggestConstraint,
      insightStyle: (user as any).insightStyle || "gentle",
      insightFrequency: (user as any).insightFrequency || "weekly",
      aiEnabled:
        (user as any).aiEnabled !== undefined ? (user as any).aiEnabled : true,
    });
  }, [user]);

  const isSetup = variant === "setup";

  const canSubmit = useMemo(() => {
    return (
      formData.name.trim().length > 0 &&
      formData.focusAreas.length > 0 &&
      formData.focusAreas.length <= 3
    );
  }, [formData.focusAreas.length, formData.name]);

  const avatarFallback =
    formData.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const handleInputChange = <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFocusAreaToggle = (area: string) => {
    setFormData((prev) => {
      const selected = prev.focusAreas;
      const exists = selected.includes(area as any);

      if (exists) {
        return {
          ...prev,
          focusAreas: selected.filter((item) => item !== area) as any,
        };
      }

      if (selected.length >= 3) {
        return prev;
      }

      return {
        ...prev,
        focusAreas: [...selected, area] as any,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (formData.focusAreas.length === 0) {
      toast.error("Please select at least one focus area");
      return;
    }

    if (formData.focusAreas.length > 3) {
      toast.error("You can select a maximum of 3 focus areas");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put("/users/profile", {
        ...formData,
        avatar: formData.avatar?.trim() || "",
        isProfileCompleted: true,
      });

      if (response.data.success) {
        setUser(response.data.data);
        toast.success(
          isSetup ? "Welcome to your archive!" : "Profile updated successfully",
        );
        onSaved?.();
        if (isSetup) {
          router.push("/journal");
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.error ||
        "Failed to save profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderAvatarField = () => (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[28px] border border-[color:var(--color-outline-variant)]/20 bg-[color:var(--color-surface-container-high)]/92 shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
        {formData.avatar ? (
          <img
            src={formData.avatar}
            alt="Profile avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[color:var(--color-primary-dark)]/60 to-[color:var(--color-primary)]/70 text-2xl font-bold text-[color:var(--color-text-primary)]">
            {avatarFallback}
          </div>
        )}
        <div className="absolute bottom-2 right-2 rounded-full bg-[color:var(--color-primary)] p-2 text-[color:var(--color-text-primary)] shadow-[0_8px_20px_rgba(126,81,255,0.35)]">
          <Camera className="h-4 w-4" />
        </div>
      </div>

      <div className="flex-1">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
          Avatar URL
        </label>
        <input
          id="avatar"
          type="url"
          value={formData.avatar || ""}
          onChange={(e) => handleInputChange("avatar", e.target.value)}
          className={inputClassName}
          placeholder="https://example.com/avatar.jpg"
        />
        <p className="mt-2 text-xs text-[color:var(--color-text-secondary)]">
          Add an image link for your profile portrait.
        </p>
      </div>
    </div>
  );

  const renderFocusAreas = () => (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
          Main Focus Areas
        </label>
        <span className="text-xs text-[color:var(--color-text-secondary)]">
          {formData.focusAreas.length}/3
        </span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {FOCUS_AREAS_OPTIONS.map((option) => {
          const selected = formData.focusAreas.includes(option.value as any);
          const disabled = !selected && formData.focusAreas.length >= 3;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleFocusAreaToggle(option.value)}
              disabled={disabled}
              className={`rounded-full border px-3.5 py-2 text-xs font-medium transition ${
                selected
                  ? "border-[color:var(--color-primary)]/25 bg-[color:var(--color-primary-dark)] text-[color:var(--color-text-primary)] shadow-[0_8px_20px_rgba(126,81,255,0.18)]"
                  : disabled
                    ? "cursor-not-allowed border-[color:var(--color-outline-variant)]/14 bg-[color:var(--color-surface-container-high)]/70 text-[color:var(--color-text-tertiary)]"
                    : "border-[color:var(--color-outline-variant)]/18 bg-[color:var(--color-surface-container-high)]/88 text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-primary)]/22 hover:text-[color:var(--color-text-primary)]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderSetupForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-[30px] border border-[color:var(--color-primary)]/14 bg-[linear-gradient(180deg,rgba(126,81,255,0.12),rgba(126,81,255,0.03))] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-tertiary)]">
              Step 1 of 3
            </p>
            <h2 className="mt-2 text-lg font-bold text-[color:var(--color-text-primary)]">
              Complete Your Profile
            </h2>
          </div>
          <Sparkles className="h-5 w-5 text-[color:var(--color-primary)]" />
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[color:var(--color-surface-container-bright)]/80">
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)]" />
        </div>
      </div>

      <section className={cardClassName}>
        {renderAvatarField()}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
            >
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={inputClassName}
              placeholder="e.g. Julian Vesper"
              required
            />
          </div>

          <div>
            <label
              htmlFor="current_role"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
            >
              Current Role (Optional)
            </label>
            <input
              id="current_role"
              type="text"
              value={formData.current_role}
              onChange={(e) =>
                handleInputChange("current_role", e.target.value)
              }
              className={inputClassName}
              placeholder="Creative Lead, Founder, Student..."
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="whyUsingApp"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
          >
            Why are you using this app?
          </label>
          <select
            id="whyUsingApp"
            value={formData.whyUsingApp}
            onChange={(e) =>
              handleInputChange(
                "whyUsingApp",
                e.target.value as ProfileFormData["whyUsingApp"],
              )
            }
            className={selectClassName}
          >
            {WHY_USING_APP_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">{renderFocusAreas()}</div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="lifePhase"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
            >
              Life Phase
            </label>
            <select
              id="lifePhase"
              value={formData.lifePhase || ""}
              onChange={(e) =>
                handleInputChange(
                  "lifePhase",
                  (e.target.value || undefined) as ProfileFormData["lifePhase"],
                )
              }
              className={selectClassName}
            >
              <option value="">Select a life phase</option>
              {LIFE_PHASE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="biggestConstraint"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
            >
              Primary Constraint
            </label>
            <select
              id="biggestConstraint"
              value={formData.biggestConstraint || ""}
              onChange={(e) =>
                handleInputChange(
                  "biggestConstraint",
                  (e.target.value ||
                    undefined) as ProfileFormData["biggestConstraint"],
                )
              }
              className={selectClassName}
            >
              <option value="">Select a constraint</option>
              {BIGGEST_CONSTRAINT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-[color:var(--color-outline-variant)]/18 bg-[color:var(--color-surface-container-high)]/88 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                Enable AI Insights
              </p>
              <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                Nocturne will analyze your entries and tune the tone of future
                reflections.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleInputChange("aiEnabled", !formData.aiEnabled)
              }
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
                formData.aiEnabled
                  ? "bg-[color:var(--color-primary)]"
                  : "bg-[color:var(--color-surface-container-bright)]"
              }`}
              aria-label="Toggle AI insights"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                  formData.aiEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="insightStyle"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
            >
              Insight Style
            </label>
            <select
              id="insightStyle"
              value={formData.insightStyle}
              onChange={(e) =>
                handleInputChange(
                  "insightStyle",
                  e.target.value as InsightStyle,
                )
              }
              className={selectClassName}
            >
              {INSIGHT_STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="insightFrequency"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
            >
              Frequency
            </label>
            <select
              id="insightFrequency"
              value={formData.insightFrequency}
              onChange={(e) =>
                handleInputChange(
                  "insightFrequency",
                  e.target.value as InsightFrequency,
                )
              }
              className={selectClassName}
            >
              {INSIGHT_FREQUENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="w-full rounded-2xl bg-gradient-to-r from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-primary)] shadow-[0_16px_40px_rgba(126,81,255,0.32)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Saving..." : "Establish Foundation"}
      </button>
    </form>
  );

  const renderDashboardForm = () => (
    <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className={cardClassName}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
                Personal Information
              </p>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                Core identity, context, and the anchors that shape your archive.
              </p>
            </div>
          </div>

          {renderAvatarField()}

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="dashboard-name"
                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
              >
                Full Name
              </label>
              <input
                id="dashboard-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={inputClassName}
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="dashboard-current-role"
                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
              >
                Current Role
              </label>
              <input
                id="dashboard-current-role"
                type="text"
                value={formData.current_role}
                onChange={(e) =>
                  handleInputChange("current_role", e.target.value)
                }
                className={inputClassName}
                placeholder="Senior Creative Strategist"
              />
            </div>

            <div>
              <label
                htmlFor="dashboard-life-phase"
                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
              >
                Life Phase
              </label>
              <select
                id="dashboard-life-phase"
                value={formData.lifePhase || ""}
                onChange={(e) =>
                  handleInputChange(
                    "lifePhase",
                    (e.target.value ||
                      undefined) as ProfileFormData["lifePhase"],
                  )
                }
                className={selectClassName}
              >
                <option value="">Select a life phase</option>
                {LIFE_PHASE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="dashboard-biggest-constraint"
                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
              >
                Biggest Constraint
              </label>
              <select
                id="dashboard-biggest-constraint"
                value={formData.biggestConstraint || ""}
                onChange={(e) =>
                  handleInputChange(
                    "biggestConstraint",
                    (e.target.value ||
                      undefined) as ProfileFormData["biggestConstraint"],
                  )
                }
                className={selectClassName}
              >
                <option value="">Select a constraint</option>
                {BIGGEST_CONSTRAINT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>{renderFocusAreas()}</div>
          </div>
        </section>

        <section className={cardClassName}>
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
              AI Preferences
            </p>
            <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
              Control how reflections arrive and what tone your archive uses.
            </p>
          </div>

          <div>
            <label
              htmlFor="dashboard-why-using-app"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]"
            >
              Primary Goal
            </label>
            <select
              id="dashboard-why-using-app"
              value={formData.whyUsingApp}
              onChange={(e) =>
                handleInputChange(
                  "whyUsingApp",
                  e.target.value as ProfileFormData["whyUsingApp"],
                )
              }
              className={selectClassName}
            >
              {WHY_USING_APP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
              Insight Style
            </p>
            {INSIGHT_STYLE_OPTIONS.map((option) => {
              const active = formData.insightStyle === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "insightStyle",
                      option.value as InsightStyle,
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-[color:var(--color-primary)]/22 bg-[color:var(--color-primary-dark)]/85 text-[color:var(--color-text-primary)]"
                      : "border-[color:var(--color-outline-variant)]/18 bg-[color:var(--color-surface-container-high)]/88 text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-primary)]/18"
                  }`}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      active
                        ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-[color:var(--color-text-primary)]"
                        : "border-[color:var(--color-outline-variant)]/30"
                    }`}
                  >
                    {active ? <Check className="h-3 w-3" /> : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
              Frequency
            </p>
            <div className="flex flex-wrap gap-2.5">
              {INSIGHT_FREQUENCY_OPTIONS.map((option) => {
                const active = formData.insightFrequency === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      handleInputChange(
                        "insightFrequency",
                        option.value as InsightFrequency,
                      )
                    }
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                      active
                        ? "border-[color:var(--color-primary)]/22 bg-gradient-to-r from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] text-[color:var(--color-text-primary)]"
                        : "border-[color:var(--color-outline-variant)]/18 bg-[color:var(--color-surface-container-high)]/88 text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-primary)]/18"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-[color:var(--color-outline-variant)]/18 bg-[color:var(--color-surface-container-high)]/88 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                  Enable Real-time AI Coaching
                </p>
                <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                  Allow adaptive prompts and periodic reflections while you
                  journal.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleInputChange("aiEnabled", !formData.aiEnabled)
                }
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
                  formData.aiEnabled
                    ? "bg-[color:var(--color-primary)]"
                    : "bg-[color:var(--color-surface-container-bright)]"
                }`}
                aria-label="Toggle AI insights"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    formData.aiEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="rounded-2xl bg-gradient-to-r from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-primary)] shadow-[0_16px_40px_rgba(126,81,255,0.32)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );

  return isSetup ? renderSetupForm() : renderDashboardForm();
}
