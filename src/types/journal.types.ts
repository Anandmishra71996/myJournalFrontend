import { JournalTemplate } from './journalTemplate.types';

export interface VoiceRecording {
    audioUrl: string;
    audioPath: string;
    transcription?: string;
    duration?: number;
    size?: number;
    language?: string;
    recordedAt: string;
}

export interface Journal {
    _id: string;
    userId: string;
    date: string;
    type: 'morning' | 'evening' | 'anytime';
    reflection?: string;
    templateId?: string | JournalTemplate;
    customFieldValues: { [fieldId: string]: any };
    tags: string[];
    isPrivate: boolean;
    // Voice journaling (multiple recordings supported)
    voiceRecordings?: VoiceRecording[];
    createdAt: string;
    updatedAt: string;
}

export interface JournalData {
    date: Date;
    reflection?: string;
    templateId?: string;
    customFieldValues?: { [fieldId: string]: any };
}
