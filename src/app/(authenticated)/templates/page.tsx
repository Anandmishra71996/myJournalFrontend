"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { journalTemplateService } from "@/services/journalTemplate.service";
import { toastService } from "@/services/toast.service";
import type {
  JournalTemplate,
  CreateTemplateData,
  UpdateTemplateData,
} from "@/types/journalTemplate.types";
import { TemplateGenerationResult } from "@/services/aiTemplate.service";
import TemplateCard from "@/components/templates/TemplateCard";
import CloneTemplateModal from "@/components/templates/CloneTemplateModal";
import ViewTemplateModal from "@/components/templates/ViewTemplateModal";
import EditTemplateModal from "@/components/templates/EditTemplateModal";
import CreateTemplateModal from "@/components/templates/CreateTemplateModal";
import GenerateTemplateModal from "@/components/templates/GenerateTemplateModal";
import AITemplateResultModal from "@/components/templates/AITemplateResultModal";

type TabType = "system" | "user";

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("system");
  const [searchQuery, setSearchQuery] = useState("");
  const [systemTemplates, setSystemTemplates] = useState<JournalTemplate[]>([]);
  const [userTemplates, setUserTemplates] = useState<JournalTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<JournalTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] =
    useState<JournalTemplate | null>(null);
  const [viewingTemplate, setViewingTemplate] =
    useState<JournalTemplate | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  // AI generation state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [aiResult, setAiResult] = useState<TemplateGenerationResult | null>(
    null,
  );
  const [showAiResultModal, setShowAiResultModal] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const [systemRes, userRes] = await Promise.all([
        journalTemplateService.getSystemTemplates(),
        journalTemplateService.getUserTemplates(),
      ]);

      if (systemRes.success) {
        setSystemTemplates(systemRes.data);
      }
      if (userRes.success) {
        setUserTemplates(userRes.data);
      }
    } catch (error) {
      console.error("Error loading templates:", error);
      toastService.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const handleCloneTemplate = async (template: JournalTemplate) => {
    setSelectedTemplate(template);
    setShowCloneModal(true);
  };

  const handleCreateFromSystem = async (
    systemTemplate: JournalTemplate,
    customName?: string,
  ) => {
    try {
      const response = await journalTemplateService.cloneTemplate(
        systemTemplate._id,
        customName ? { name: customName } : undefined,
      );
      if (response.success) {
        toastService.success(
          response.message || "Template created successfully!",
        );
        await loadTemplates();
        setShowCloneModal(false);
        setSelectedTemplate(null);
        setActiveTab("user");
      }
    } catch (error: any) {
      console.error("Error cloning template:", error);
      toastService.error(
        error.response?.data?.error || "Failed to create template",
      );
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }
    try {
      const response = await journalTemplateService.deleteTemplate(templateId);
      if (response.success) {
        toastService.success(
          response.message || "Template deleted successfully!",
        );
        await loadTemplates();
      }
    } catch (error: any) {
      console.error("Error deleting template:", error);
      toastService.error(
        error.response?.data?.error || "Failed to delete template",
      );
    }
  };

  const handleSetDefault = async (templateId: string) => {
    try {
      const response =
        await journalTemplateService.setDefaultTemplate(templateId);
      if (response.success) {
        toastService.success("Default template updated!");
        await loadTemplates();
      }
    } catch (error: any) {
      console.error("Error setting default template:", error);
      toastService.error(
        error.response?.data?.error || "Failed to set default template",
      );
    }
  };

  const handleCreateTemplate = async (data: CreateTemplateData) => {
    try {
      const response = await journalTemplateService.createTemplate(data);
      if (response.success) {
        toastService.success(
          response.message || "Template created successfully!",
        );
        await loadTemplates();
        setShowCreateModal(false);
        setActiveTab("user");
      }
    } catch (error: any) {
      console.error("Error creating template:", error);
      toastService.error(
        error.response?.data?.error || "Failed to create template",
      );
    }
  };

  const handleUpdateTemplate = async (
    templateId: string,
    updates: UpdateTemplateData,
  ) => {
    try {
      const response = await journalTemplateService.updateTemplate(
        templateId,
        updates,
      );
      if (response.success) {
        toastService.success(
          response.message || "Template updated successfully!",
        );
        await loadTemplates();
        setShowEditModal(false);
        setEditingTemplate(null);
      }
    } catch (error: any) {
      console.error("Error updating template:", error);
      toastService.error(
        error.response?.data?.error || "Failed to update template",
      );
    }
  };

  const handleViewTemplate = (template: JournalTemplate) => {
    setViewingTemplate(template);
    setShowViewModal(true);
  };

  const handleEditTemplate = (template: JournalTemplate) => {
    setEditingTemplate(template);
    setShowEditModal(true);
  };

  // ── AI Generation handlers ───────────────────────────────────────────────

  const handleAiResult = (result: TemplateGenerationResult) => {
    setAiResult(result);
    setShowAiResultModal(true);
  };

  const handleAiReviewAndEdit = (template: JournalTemplate) => {
    setShowAiResultModal(false);
    setAiResult(null);
    setEditingTemplate(template);
    setShowEditModal(true);
    setActiveTab("user");
  };

  const handleAiUseExisting = async (template: JournalTemplate) => {
    setShowAiResultModal(false);
    setAiResult(null);
    // Clone the system/existing template into the user's collection
    try {
      const response = await journalTemplateService.cloneTemplate(template._id);
      if (response.success) {
        toastService.success("Template added to My Templates!");
        await loadTemplates();
        setActiveTab("user");
      }
    } catch (error: any) {
      toastService.error(
        error.response?.data?.error || "Failed to use template",
      );
    }
  };

  // ────────────────────────────────────────────────────────────────────────

  const filteredSystemTemplates = systemTemplates.filter((template) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      template.name.toLowerCase().includes(query) ||
      template.description?.toLowerCase().includes(query) ||
      template.fields.some((field) => field.label.toLowerCase().includes(query))
    );
  });

  const filteredUserTemplates = userTemplates.filter((template) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      template.name.toLowerCase().includes(query) ||
      template.description?.toLowerCase().includes(query) ||
      template.fields.some((field) => field.label.toLowerCase().includes(query))
    );
  });

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-28 md:pb-10">
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p
                className="text-xs uppercase tracking-[0.16em] font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                Templates Gallery
              </p>
              <h1
                className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                Journal Templates
              </h1>
              <p
                className="mt-2 text-sm md:text-base"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Explore curated systems and build your own custom reflection
                flows.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setShowGenerateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 16%, transparent)",
                  color: "var(--color-primary)",
                }}
              >
                <SparklesIcon className="w-5 h-5" />
                Generate with AI
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 90%, transparent), var(--color-primary))",
                }}
              >
                <PlusIcon className="w-5 h-5" />
                Create Template
              </button>
            </div>
          </div>
        </header>

        <section className="mb-6 md:mb-8 space-y-5">
          <div
            className="flex items-center gap-5 border-b"
            style={{
              borderColor:
                "color-mix(in srgb, var(--color-border) 40%, transparent)",
            }}
          >
            <button
              onClick={() => setActiveTab("system")}
              className="pb-3 text-sm md:text-base font-semibold border-b-2 transition-all"
              style={{
                color:
                  activeTab === "system"
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)",
                borderColor:
                  activeTab === "system"
                    ? "var(--color-primary)"
                    : "transparent",
              }}
            >
              System Templates
            </button>
            <button
              onClick={() => setActiveTab("user")}
              className="pb-3 text-sm md:text-base font-semibold border-b-2 transition-all"
              style={{
                color:
                  activeTab === "user"
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)",
                borderColor:
                  activeTab === "user" ? "var(--color-primary)" : "transparent",
              }}
            >
              My Templates
            </button>
          </div>

          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--color-border) 28%, transparent)",
            }}
          >
            <MagnifyingGlassIcon
              className="w-5 h-5"
              style={{ color: "var(--color-text-tertiary)" }}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by name, description, or field"
              className="w-full bg-transparent text-sm focus:outline-none"
              style={{ color: "var(--color-text-primary)" }}
            />
          </div>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: "var(--color-primary)" }}
            ></div>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {(activeTab === "system"
                ? filteredSystemTemplates
                : filteredUserTemplates
              ).map((template) => (
                <TemplateCard
                  key={template._id}
                  template={template}
                  onView={handleViewTemplate}
                  onClone={handleCloneTemplate}
                  onEdit={handleEditTemplate}
                  onDelete={handleDeleteTemplate}
                  onSetDefault={handleSetDefault}
                />
              ))}

              {activeTab === "system" &&
                filteredSystemTemplates.length === 0 && (
                  <div className="col-span-full text-center py-14">
                    <p style={{ color: "var(--color-text-secondary)" }}>
                      No system templates available
                    </p>
                  </div>
                )}

              {activeTab === "user" && filteredUserTemplates.length === 0 && (
                <div className="col-span-full text-center py-14">
                  <p
                    className="mb-4"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    You haven't created any templates yet
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 90%, transparent), var(--color-primary))",
                    }}
                  >
                    <PlusIcon className="w-5 h-5" />
                    Create Your First Template
                  </button>
                </div>
              )}
            </section>

            {activeTab === "system" && filteredSystemTemplates.length > 0 && (
              <section
                className="mt-10 rounded-2xl p-5 md:p-6"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-surface-elevated) 72%, transparent)",
                  border:
                    "1px solid color-mix(in srgb, var(--color-border) 24%, transparent)",
                }}
              >
                <p
                  className="text-xs uppercase tracking-[0.14em] font-semibold mb-2"
                  style={{ color: "var(--color-primary)" }}
                >
                  AI Suggestion
                </p>
                <h2
                  className="text-lg md:text-xl font-semibold mb-1"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Try “{filteredSystemTemplates[0]?.name}” this week
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Great for structured, low-friction journaling and consistent
                  weekly review.
                </p>
              </section>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-4 right-4 z-30 flex md:hidden flex-col gap-2">
        <button
          onClick={() => setShowGenerateModal(true)}
          className="inline-flex items-center justify-center h-12 w-12 rounded-full"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-primary) 18%, transparent)",
            color: "var(--color-primary)",
            border:
              "1px solid color-mix(in srgb, var(--color-primary) 24%, transparent)",
          }}
          title="Generate with AI"
        >
          <SparklesIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center h-14 w-14 rounded-full text-white"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 90%, transparent), var(--color-primary))",
            boxShadow: "0 14px 30px rgba(0,0,0,0.28)",
          }}
          title="Create Template"
        >
          <PlusIcon className="w-7 h-7" />
        </button>
      </div>

      {/* Modals */}
      {showCloneModal && selectedTemplate && (
        <CloneTemplateModal
          template={selectedTemplate}
          onClose={() => {
            setShowCloneModal(false);
            setSelectedTemplate(null);
          }}
          onClone={handleCreateFromSystem}
        />
      )}
      {showCreateModal && (
        <CreateTemplateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTemplate}
        />
      )}
      {showViewModal && viewingTemplate && (
        <ViewTemplateModal
          template={viewingTemplate}
          onClose={() => {
            setShowViewModal(false);
            setViewingTemplate(null);
          }}
          onClone={handleCloneTemplate}
          onEdit={handleEditTemplate}
        />
      )}
      {showEditModal && editingTemplate && (
        <EditTemplateModal
          template={editingTemplate}
          onClose={() => {
            setShowEditModal(false);
            setEditingTemplate(null);
          }}
          onSave={handleUpdateTemplate}
        />
      )}
      {showGenerateModal && (
        <GenerateTemplateModal
          onClose={() => setShowGenerateModal(false)}
          onResult={handleAiResult}
        />
      )}
      {showAiResultModal && aiResult && (
        <AITemplateResultModal
          result={aiResult}
          onClose={() => {
            setShowAiResultModal(false);
            setAiResult(null);
          }}
          onReviewAndEdit={handleAiReviewAndEdit}
          onUseExisting={handleAiUseExisting}
        />
      )}
    </div>
  );
}
