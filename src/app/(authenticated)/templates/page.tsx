'use client';

import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { journalTemplateService } from '@/services/journalTemplate.service';
import { toastService } from '@/services/toast.service';
import type { JournalTemplate, CreateTemplateData, UpdateTemplateData } from '@/types/journalTemplate.types';
import TemplateCard from '@/components/templates/TemplateCard';
import CloneTemplateModal from '@/components/templates/CloneTemplateModal';
import ViewTemplateModal from '@/components/templates/ViewTemplateModal';
import EditTemplateModal from '@/components/templates/EditTemplateModal';
import CreateTemplateModal from '@/components/templates/CreateTemplateModal';

type TabType = 'system' | 'user';

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('system');
  const [systemTemplates, setSystemTemplates] = useState<JournalTemplate[]>([]);
  const [userTemplates, setUserTemplates] = useState<JournalTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<JournalTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<JournalTemplate | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<JournalTemplate | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
      console.error('Error loading templates:', error);
      toastService.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCloneTemplate = async (template: JournalTemplate) => {
    setSelectedTemplate(template);
    setShowCloneModal(true);
  };

  const handleCreateFromSystem = async (systemTemplate: JournalTemplate, customName?: string) => {
    try {
      const response = await journalTemplateService.cloneTemplate(
        systemTemplate._id,
        customName ? { name: customName } : undefined
      );
      if (response.success) {
        toastService.success(response.message || 'Template created successfully!');
        await loadTemplates();
        setShowCloneModal(false);
        setSelectedTemplate(null);
        setActiveTab('user');
      }
    } catch (error: any) {
      console.error('Error cloning template:', error);
      toastService.error(error.response?.data?.error || 'Failed to create template');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }
    try {
      const response = await journalTemplateService.deleteTemplate(templateId);
      if (response.success) {
        toastService.success(response.message || 'Template deleted successfully!');
        await loadTemplates();
      }
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toastService.error(error.response?.data?.error || 'Failed to delete template');
    }
  };

  const handleSetDefault = async (templateId: string) => {
    try {
      const response = await journalTemplateService.setDefaultTemplate(templateId);
      if (response.success) {
        toastService.success('Default template updated!');
        await loadTemplates();
      }
    } catch (error: any) {
      console.error('Error setting default template:', error);
      toastService.error(error.response?.data?.error || 'Failed to set default template');
    }
  };

  const handleCreateTemplate = async (data: CreateTemplateData) => {
    try {
      const response = await journalTemplateService.createTemplate(data);
      if (response.success) {
        toastService.success(response.message || 'Template created successfully!');
        await loadTemplates();
        setShowCreateModal(false);
        setActiveTab('user');
      }
    } catch (error: any) {
      console.error('Error creating template:', error);
      toastService.error(error.response?.data?.error || 'Failed to create template');
    }
  };

  const handleUpdateTemplate = async (templateId: string, updates: UpdateTemplateData) => {
    try {
      const response = await journalTemplateService.updateTemplate(templateId, updates);
      if (response.success) {
        toastService.success(response.message || 'Template updated successfully!');
        await loadTemplates();
        setShowEditModal(false);
        setEditingTemplate(null);
      }
    } catch (error: any) {
      console.error('Error updating template:', error);
      toastService.error(error.response?.data?.error || 'Failed to update template');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Journal Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Journal Templates
              </h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Create Template
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('system')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'system'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            System Templates
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'user'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            My Templates
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'system' ? (
              systemTemplates.length > 0 ? (
                systemTemplates.map((template) => (
                  <TemplateCard
                    key={template._id}
                    template={template}
                    onView={handleViewTemplate}
                    onClone={handleCloneTemplate}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                    onSetDefault={handleSetDefault}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No system templates available</p>
                </div>
              )
            ) : (
              userTemplates.length > 0 ? (
                userTemplates.map((template) => (
                  <TemplateCard
                    key={template._id}
                    template={template}
                    onView={handleViewTemplate}
                    onClone={handleCloneTemplate}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                    onSetDefault={handleSetDefault}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    You haven't created any templates yet
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Create Your First Template
                  </button>
                </div>
              )
            )}
          </div>
        )}
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
    </div>
  );
}
