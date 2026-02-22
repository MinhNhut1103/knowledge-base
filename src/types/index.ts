export interface Link {
    url: string;
    label?: string;
}

export interface KnowledgeCard {
    id: string;
    title: string;
    content: string;
    links: Link[];
    category: string;
    color: string;
    userId: string; // ID of the user who created the card
    createdAt: number;
    updatedAt: number;
}

export type Role = 'admin' | 'member';

export interface User {
    id: string;
    username: string;
    password?: string; // Optional when listed, required for login/creation
    fullName: string;
    role: Role;
}

export type Category = string;

export const PRESET_COLORS = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#eab308', // yellow-500
    '#22c55e', // green-500
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#d946ef', // fuchsia-500
    '#64748b', // slate-500
];

export const DEFAULT_CATEGORIES = [
    'General',
    'Work',
    'Personal',
    'Ideas',
    'Resources'
];
