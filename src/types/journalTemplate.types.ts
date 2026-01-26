export type FieldType = 'text' | 'textarea' | 'number' | 'rating' | 'select' | 'multiselect' | 'boolean' | 'date' | 'time';

export interface TemplateField {
    id: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    required?: boolean;
    options?: string[];
    min?: number;
    max?: number;
    order: number;
}

export interface JournalTemplate {
    _id: string;
    name: string;
    description?: string;
    icon?: string;
    fields: TemplateField[];
    createdBy: 'system' | 'user';
    userId?: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTemplateData {
    name: string;
    description?: string;
    icon?: string;
    fields: TemplateField[];
    isDefault?: boolean;
}

export interface UpdateTemplateData {
    name?: string;
    description?: string;
    icon?: string;
    fields?: TemplateField[];
}

export interface CloneTemplateData {
    name?: string;
    description?: string;
    fields?: TemplateField[];
    isDefault?: boolean;
}

export interface CustomFieldValues {
    [fieldId: string]: any;
}
