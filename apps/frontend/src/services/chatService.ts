/**
 * API helpers for tutoring sessions.
 */

import type { TutorConfig, TutorSession, TutorSessionSummary, TutorStrictness } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8010/api';

interface RawTutorMessage {
  id: string;
  role: 'student' | 'tutor' | 'system';
  content: string;
  created_at: string;
}

interface RawTutorSession {
  id: string;
  title: string;
  problem: string;
  strictness: TutorStrictness;
  max_hints: number;
  revealed_count: number;
  status: string;
  created_at: string;
  messages: RawTutorMessage[];
  can_request_next: boolean;
}

interface RawTutorSummary {
  id: string;
  title: string;
  strictness: TutorStrictness;
  max_hints: number;
  revealed_count: number;
  status: string;
  created_at: string;
}

interface RawTutorConfig {
  default_strictness: TutorStrictness;
  default_max_hints: number;
  hard_max_hints: number;
  solver_model: string;
  hint_model: string;
  followup_model: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await readError(response);
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json();
}

async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.detail || '';
  } catch {
    return response.statusText;
  }
}

function networkError(error: unknown): Error {
  const message = error instanceof Error ? error.message : 'Unknown network error';
  return new Error(
    `${message}. Check that the backend is running at ${API_URL.replace('/api', '')}.`
  );
}

function mapSession(raw: RawTutorSession): TutorSession {
  return {
    id: raw.id,
    title: raw.title,
    problem: raw.problem,
    strictness: raw.strictness,
    maxHints: raw.max_hints,
    revealedCount: raw.revealed_count,
    status: raw.status,
    createdAt: new Date(raw.created_at),
    canRequestNext: raw.can_request_next,
    messages: raw.messages.map(message => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: new Date(message.created_at),
    })),
  };
}

function mapSummary(raw: RawTutorSummary): TutorSessionSummary {
  return {
    id: raw.id,
    title: raw.title,
    strictness: raw.strictness,
    maxHints: raw.max_hints,
    revealedCount: raw.revealed_count,
    status: raw.status,
    createdAt: new Date(raw.created_at),
  };
}

const chatService = {
  async getConfig(): Promise<TutorConfig> {
    let raw: RawTutorConfig;
    try {
      raw = await request<RawTutorConfig>('/config');
    } catch (error) {
      throw networkError(error);
    }
    return {
      defaultStrictness: raw.default_strictness,
      defaultMaxHints: raw.default_max_hints,
      hardMaxHints: raw.hard_max_hints,
      solverModel: raw.solver_model,
      hintModel: raw.hint_model,
      followupModel: raw.followup_model,
    };
  },

  async listSessions(): Promise<TutorSessionSummary[]> {
    let raw: RawTutorSummary[];
    try {
      raw = await request<RawTutorSummary[]>('/sessions');
    } catch (error) {
      throw networkError(error);
    }
    return raw.map(mapSummary);
  },

  async getSession(id: string): Promise<TutorSession> {
    try {
      return mapSession(await request<RawTutorSession>(`/sessions/${id}`));
    } catch (error) {
      throw networkError(error);
    }
  },

  async createSession(problem: string, strictness: TutorStrictness, maxHints: number): Promise<TutorSession> {
    try {
      return mapSession(await request<RawTutorSession>('/sessions', {
        method: 'POST',
        body: JSON.stringify({
          problem,
          strictness,
          max_hints: maxHints,
        }),
      }));
    } catch (error) {
      throw networkError(error);
    }
  },

  async nextHint(id: string): Promise<TutorSession> {
    try {
      return mapSession(await request<RawTutorSession>(`/sessions/${id}/next-hint`, {
        method: 'POST',
      }));
    } catch (error) {
      throw networkError(error);
    }
  },

  async followUp(id: string, message: string): Promise<TutorSession> {
    try {
      return mapSession(await request<RawTutorSession>(`/sessions/${id}/follow-up`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      }));
    } catch (error) {
      throw networkError(error);
    }
  },

  async deleteSession(id: string): Promise<void> {
    try {
      await request(`/sessions/${id}`, { method: 'DELETE' });
    } catch (error) {
      throw networkError(error);
    }
  },
};

export default chatService;
