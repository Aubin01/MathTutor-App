/**
 * Shared TypeScript types for the tutor frontend.
 */

export type InputMode = 'solve' | 'prove' | 'explore';
export type TutorStrictness = 'medium' | 'strict';
export type TutorMessageRole = 'student' | 'tutor' | 'system';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    latex?: string;
    hasMath?: boolean;
    timestamp: Date;
    sources?: Source[];
}

export interface ChatSession {
    id: string;
    title: string;
    titleLatex?: string;
    messages: Message[];
    createdAt: Date;
}

export interface TutorMessage {
    id: string;
    role: TutorMessageRole;
    content: string;
    createdAt: Date;
}

export interface TutorSession {
    id: string;
    title: string;
    problem: string;
    strictness: TutorStrictness;
    maxHints: number;
    revealedCount: number;
    status: string;
    createdAt: Date;
    messages: TutorMessage[];
    canRequestNext: boolean;
}

export interface TutorSessionSummary {
    id: string;
    title: string;
    titleLatex?: string;
    strictness: TutorStrictness;
    maxHints: number;
    revealedCount: number;
    status: string;
    createdAt: Date;
}

export interface TutorConfig {
    defaultStrictness: TutorStrictness;
    defaultMaxHints: number;
    hardMaxHints: number;
    solverModel: string;
    hintModel: string;
    followupModel: string;
}

export interface Source {
    id: string;
    title: string;
    excerpt: string;
    link?: string;
}
