import { create } from 'zustand';
import api from '@/lib/api';

interface Document {
    _id: string;
    name: string;
    description?: string;
    originalName: string;
    mimeType: string;
    size: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    chunkCount?: number;
    createdAt: string;
}

interface DocumentState {
    documents: Document[];
    loading: boolean;

    fetchDocuments: () => Promise<void>;
    uploadDocument: (file: File, name?: string, description?: string) => Promise<void>;
    deleteDocument: (id: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set) => ({
    documents: [],
    loading: false,

    fetchDocuments: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/documents');
            set({ documents: response.data.data.documents });
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            set({ loading: false });
        }
    },

    uploadDocument: async (file: File, name?: string, description?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        if (name) formData.append('name', name);
        if (description) formData.append('description', description);

        try {
            const response = await api.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            set((state) => ({
                documents: [response.data.data, ...state.documents],
            }));

            // Poll for processing status
            const documentId = response.data.data._id;
            const pollStatus = setInterval(async () => {
                try {
                    const statusResponse = await api.get(`/documents/${documentId}`);
                    const doc = statusResponse.data.data;

                    set((state) => ({
                        documents: state.documents.map((d) =>
                            d._id === documentId ? doc : d
                        ),
                    }));

                    if (doc.status === 'completed' || doc.status === 'failed') {
                        clearInterval(pollStatus);
                    }
                } catch (error) {
                    clearInterval(pollStatus);
                }
            }, 3000);
        } catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    },

    deleteDocument: async (id: string) => {
        try {
            await api.delete(`/documents/${id}`);
            set((state) => ({
                documents: state.documents.filter((doc) => doc._id !== id),
            }));
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    },
}));
