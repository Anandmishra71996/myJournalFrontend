"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Brain,
  ChevronRight,
  Download,
  Flame,
  Lock,
  Pencil,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import ProfileForm from "@/components/profile/ProfileForm";
import PushNotificationSettings from "@/components/PushNotificationSettings";
import api from "@/lib/api";

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const extendedUser = user as (typeof user & { createdAt?: string }) | null;
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);

  useEffect(() => {
    useAuthStore.getState().refreshProfile();
  }, []);

  const isSetup = user?.isProfileCompleted === false;
  const aiProfile = (user as any)?.aiProfile || {};

  const heroStats = useMemo(() => {
    return [
      {
        label: "Total Reflections",
        value: aiProfile.executionConsistencyScore ?? "0",
        detail: "+12% this month",
        icon: Flame,
      },
      {
        label: "Current Streak",
        value: aiProfile.resilienceIndex ?? "0",
        detail: "Personal best: 45",
        icon: Sparkles,
      },
      {
        label: "AI Insights Generated",
        value: aiProfile.agencyScore ?? "0",
        detail: "Ready to review",
        icon: Brain,
      },
    ];
  }, [
    aiProfile.agencyScore,
    aiProfile.executionConsistencyScore,
    aiProfile.resilienceIndex,
  ]);

  const insightStyleLabel = useMemo(() => {
    const value = (user as any)?.insightStyle;
    if (value === "gentle") return "Philosophical & Reflective";
    if (value === "practical") return "Practical & Actionable";
    if (value === "analytical") return "Analytical & Direct";
    return "Not set";
  }, [user]);

  const insightFrequencyLabel = useMemo(() => {
    const value = (user as any)?.insightFrequency;
    if (value === "weekly") return "Weekly deep-dive";
    if (value === "monthly") return "Monthly review";
    if (value === "on-demand") return "After every entry";
    return "Not set";
  }, [user]);

  const focusAreas = ((user as any)?.focusAreas || []) as string[];
  const currentRole = (user as any)?.current_role || "Not set";
  const lifePhase = (user as any)?.lifePhase || "Not set";
  const biggestConstraint = (user as any)?.biggestConstraint || "Not set";

  const memberSince = extendedUser?.createdAt
    ? new Date(extendedUser.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Please fill all password fields");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setChangingPassword(true);
    try {
      await api.post("/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      const message =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.error ||
        "Password change is currently unavailable. Please use forgot password from login if needed.";
      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };

  const showPlaceholder = (message: string) => {
    toast.message(message);
  };

  if (!user) {
    return <div className="min-h-screen bg-[color:var(--color-surface)]" />;
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-surface)] text-[color:var(--color-text-primary)]">
      <div className="relative mx-auto w-full max-w-[1120px] px-4 pb-16 pt-3 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-0 top-10 h-56 w-56 rounded-full bg-[color:var(--color-primary-dark)]/16 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[color:var(--color-primary)]/10 blur-3xl" />

        {isSetup ? (
          <section className="relative mx-auto max-w-5xl pb-8 pt-2 sm:pt-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-tertiary)]">
                Profile Setup
              </p>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Complete Your Profile
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[color:var(--color-text-secondary)] sm:text-base">
                Craft your sanctuary. This information helps Nocturne tailor
                reflections and guide your archive.
              </p>
            </div>

            <div className="mt-8 rounded-[36px] bg-gradient-to-b from-[color:var(--color-surface-container-high)] to-[color:var(--color-surface-container-low)] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.22)] sm:p-8 lg:p-10">
              <ProfileForm variant="setup" />
            </div>
          </section>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            <section className="rounded-[30px] bg-gradient-to-b from-[color:var(--color-surface-container-high)] to-[color:var(--color-surface-container-low)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-[24px] border border-[color:var(--color-primary)]/20 bg-[color:var(--color-surface-container-high)] shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
                    {(user as any).avatar ? (
                      <img
                        src={(user as any).avatar}
                        alt="Profile avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[color:var(--color-primary-dark)]/60 to-[color:var(--color-primary)]/70 text-3xl font-bold text-[color:var(--color-text-primary)]">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <div>
                    <h1 className="text-[2rem] font-extrabold leading-none tracking-tight">
                      {user.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <p className="text-sm text-[color:var(--color-text-secondary)]">
                        Member since {memberSince}
                      </p>
                      <span className="rounded-full bg-[color:var(--color-primary-dark)]/75 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-primary)]">
                        Premium Member
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEditPanel(true)}
                  className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-4 py-2 text-xs font-semibold text-[color:var(--color-text-primary)] shadow-[0_12px_28px_rgba(126,81,255,0.25)]"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
                {heroStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-[18px] bg-[color:var(--color-surface-container-high)]/90 px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <Icon className="h-4 w-4 text-[color:var(--color-primary)]" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-tertiary)]">
                          {stat.detail}
                        </span>
                      </div>
                      <div className="mt-4 text-[2rem] font-extrabold leading-none">
                        {stat.value}
                      </div>
                      <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <section className="rounded-[20px] bg-[color:var(--color-surface-container-low)]/74 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.2)] sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
                  <h2 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                    Personal Information
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="rounded-[14px] bg-[color:var(--color-surface-container-high)]/88 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                      Current Role
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--color-text-primary)]">
                      {currentRole}
                    </p>
                  </div>
                  <div className="rounded-[14px] bg-[color:var(--color-surface-container-high)]/88 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                      Life Phase
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--color-text-primary)]">
                      {lifePhase}
                    </p>
                  </div>
                  <div className="rounded-[14px] bg-[color:var(--color-surface-container-high)]/88 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                      Focus Areas
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {focusAreas.length > 0 ? (
                        focusAreas.map((area) => (
                          <span
                            key={area}
                            className="rounded-full bg-[color:var(--color-surface-container-bright)]/90 px-3 py-1 text-[10px] font-medium text-[color:var(--color-text-primary)]"
                          >
                            {area}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[color:var(--color-text-secondary)]">
                          No focus areas selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[20px] bg-[color:var(--color-surface-container-low)]/74 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.2)] sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
                  <h2 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                    AI Preferences
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="rounded-[14px] bg-[color:var(--color-surface-container-high)]/88 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                      Insight Style
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--color-text-primary)]">
                      {insightStyleLabel}
                    </p>
                  </div>
                  <div className="rounded-[14px] bg-[color:var(--color-surface-container-high)]/88 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                      Frequency
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--color-text-primary)]">
                      {insightFrequencyLabel}
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-[14px] bg-[color:var(--color-surface-container-high)]/88 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[color:var(--color-text-primary)]">
                        Enable Real-time AI Coaching
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                        AI suggests prompts while you write.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowEditPanel(true)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        (user as any)?.aiEnabled
                          ? "bg-[color:var(--color-primary)]"
                          : "bg-[color:var(--color-surface-container-bright)]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          (user as any)?.aiEnabled
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </section>

              <section className="rounded-[20px] bg-[color:var(--color-surface-container-low)]/74 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.2)] sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Download className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
                  <h2 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                    Archive Settings
                  </h2>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() =>
                      showPlaceholder("Archive export is not wired yet.")
                    }
                    className="flex w-full items-center justify-between rounded-[14px] bg-[color:var(--color-surface-container-high)]/88 px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-[color:var(--color-text-primary)]">
                        Export Archive
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                        Download all data in PDF or JSON
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
                  </button>

                  <div className="flex items-center justify-between rounded-[14px] bg-[color:var(--color-surface-container-high)]/88 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[color:var(--color-text-primary)]">
                        Privacy Mode
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                        Blur sensitive titles in UI
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPrivacyMode((prev) => !prev)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        privacyMode
                          ? "bg-[color:var(--color-primary)]"
                          : "bg-[color:var(--color-surface-container-bright)]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          privacyMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      showPlaceholder(
                        "Data management tools are not wired yet.",
                      )
                    }
                    className="flex w-full items-center justify-between rounded-[14px] bg-red-500/[0.08] px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-red-300">
                        Data Management
                      </p>
                      <p className="mt-1 text-xs text-red-200/70">
                        Clear history or delete account
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-red-300" />
                  </button>
                </div>
              </section>

              <section className="rounded-[20px] bg-[color:var(--color-surface-container-low)]/74 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.2)] sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
                  <h2 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                    Security
                  </h2>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordPanel(true)}
                    className="flex w-full items-center justify-between rounded-[14px] bg-[color:var(--color-surface-container-high)]/88 px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-[color:var(--color-text-primary)]">
                        Password
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                        Last updated from your secure account settings
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
                      Change
                    </span>
                  </button>

                  <div className="rounded-[14px] bg-[color:var(--color-surface-container-high)]/88 px-4 py-4">
                    <p className="text-sm font-medium text-[color:var(--color-text-primary)]">
                      Need help securing your archive?
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          showPlaceholder("Support link is not wired yet.")
                        }
                        className="rounded-xl bg-[color:var(--color-surface-container-bright)]/92 px-3 py-2 text-xs font-medium text-[color:var(--color-text-primary)]"
                      >
                        Support
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          showPlaceholder(
                            "Documentation link is not wired yet.",
                          )
                        }
                        className="rounded-xl bg-[color:var(--color-surface-container-bright)]/92 px-3 py-2 text-xs font-medium text-[color:var(--color-text-primary)]"
                      >
                        Documentation
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      {showEditPanel && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="h-full w-full max-w-2xl overflow-y-auto bg-[color:var(--color-surface)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
                  Edit Profile
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                  Archive Settings
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowEditPanel(false)}
                className="rounded-xl border border-[color:var(--color-outline-variant)]/16 p-2 text-[color:var(--color-text-secondary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ProfileForm
              variant="dashboard"
              onSaved={() => setShowEditPanel(false)}
            />

            <section className="mt-6 rounded-[24px] bg-[color:var(--color-surface-container-low)]/74 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
                <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                  Notifications
                </h3>
              </div>
              <PushNotificationSettings />
            </section>
          </div>
        </div>
      )}

      {showPasswordPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] bg-[color:var(--color-surface)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
                  Security
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                  Change Password
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordPanel(false)}
                className="rounded-xl border border-[color:var(--color-outline-variant)]/16 p-2 text-[color:var(--color-text-secondary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={handlePasswordChange}
            >
              <div className="md:col-span-2">
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[color:var(--color-outline-variant)]/25 bg-[color:var(--color-surface-container-high)]/92 px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-primary)]/55 focus:ring-2 focus:ring-[color:var(--color-primary)]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[color:var(--color-outline-variant)]/25 bg-[color:var(--color-surface-container-high)]/92 px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-primary)]/55 focus:ring-2 focus:ring-[color:var(--color-primary)]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[color:var(--color-outline-variant)]/25 bg-[color:var(--color-surface-container-high)]/92 px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none transition placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-primary)]/55 focus:ring-2 focus:ring-[color:var(--color-primary)]/20"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordPanel(false)}
                  className="rounded-xl border border-[color:var(--color-outline-variant)]/16 px-4 py-3 text-sm font-medium text-[color:var(--color-text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="rounded-xl bg-gradient-to-r from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-5 py-3 text-sm font-semibold text-[color:var(--color-text-primary)] shadow-[0_16px_40px_rgba(126,81,255,0.32)] disabled:opacity-40"
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
