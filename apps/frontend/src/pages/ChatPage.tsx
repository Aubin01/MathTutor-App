/**
 * Tutor page that manages sessions, hints, and follow-up questions.
 */

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { SquarePen } from 'lucide-react';
import styles from './ChatPage.module.css';
import type { Message, TutorSession, TutorSessionSummary, TutorStrictness } from '../types';
import ChatContainer from '../components/chat/ChatContainer';
import SettingsSidebar from '../components/layout/SettingsSidebar';
import chatService from '../services/chatService';
import TutorLogo from '../components/TutorLogo';

function ChatPage() {
  const [sessions, setSessions] = useState<TutorSessionSummary[]>([]);
  const [activeSession, setActiveSession] = useState<TutorSession | null>(null);
  const [strictness, setStrictness] = useState<TutorStrictness>('strict');
  const [maxHints, setMaxHints] = useState(5);
  const [hardMaxHints, setHardMaxHints] = useState(8);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState('');
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);
  const pendingIdRef = useRef(0);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [config, history] = await Promise.all([
          chatService.getConfig(),
          chatService.listSessions(),
        ]);
        setStrictness(config.defaultStrictness);
        setMaxHints(config.defaultMaxHints);
        setHardMaxHints(config.hardMaxHints);
        setSessions(history);
      } catch (loadError) {
        console.error(loadError);
        setError('Could not reach the tutor backend. Make sure it is running on port 8010.');
      }
    }

    loadInitialData();
  }, []);

  const messages = useMemo(() => {
    const sessionMsgs = activeSession ? activeSession.messages.map(toChatMessage) : [];
    if (pendingMessage) {
      return [...sessionMsgs, pendingMessage];
    }
    return sessionMsgs;
  }, [activeSession, pendingMessage]);

  const refreshSessions = useCallback(async () => {
    const history = await chatService.listSessions();
    setSessions(history);
  }, []);

  const handleNewChat = useCallback(() => {
    setActiveSession(null);
    setError('');
    setSidebarOpen(false);
  }, []);

  const handleLoadSession = useCallback(async (sessionId: string) => {
    setIsTyping(true);
    setError('');
    try {
      const session = await chatService.getSession(sessionId);
      setActiveSession(session);
      setStrictness(session.strictness);
      setMaxHints(session.maxHints);
      setSidebarOpen(false);
    } catch (loadError) {
      console.error(loadError);
      setError('Could not load that tutoring session.');
    } finally {
      setIsTyping(false);
    }
  }, []);

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    try {
      await chatService.deleteSession(sessionId);
      if (activeSession?.id === sessionId) {
        setActiveSession(null);
      }
      await refreshSessions();
    } catch (deleteError) {
      console.error(deleteError);
      setError('Could not delete that session.');
    }
  }, [activeSession?.id, refreshSessions]);

  const handleSendMessage = useCallback(async (content: string) => {
    const text = content;
    if (!text.trim()) return;

    // Show user message immediately (optimistic)
    pendingIdRef.current += 1;
    const optimistic: Message = {
      id: `pending-${pendingIdRef.current}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setPendingMessage(optimistic);
    setIsTyping(true);
    setError('');
    try {
      const session = activeSession
        ? await chatService.followUp(activeSession.id, text)
        : await chatService.createSession(text, strictness, maxHints);

      setActiveSession(session);
      setPendingMessage(null);
      await refreshSessions();
    } catch (sendError) {
      console.error(sendError);
      const message = sendError instanceof Error ? sendError.message : 'Tutor request failed.';
      setError(message);
      setPendingMessage(null);
    } finally {
      setIsTyping(false);
    }
  }, [activeSession, strictness, maxHints, refreshSessions]);

  const handleNextHint = useCallback(async () => {
    if (!activeSession) return;

    setIsTyping(true);
    setError('');
    try {
      const session = await chatService.nextHint(activeSession.id);
      setActiveSession(session);
      await refreshSessions();
    } catch (hintError) {
      console.error(hintError);
      setError('Could not reveal the next hint.');
    } finally {
      setIsTyping(false);
    }
  }, [activeSession, refreshSessions]);

  const handleExportChat = useCallback(() => {
    if (!activeSession) return;

    const exportData = {
      exportedAt: new Date().toISOString(),
      session: activeSession,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tutor-session-${activeSession.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [activeSession]);

  return (
    <div className={styles.page}>
      {sidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.sidebarWrapperOpen : ''}`}>
        <SettingsSidebar
          chatHistory={sessions}
          activeSessionId={activeSession?.id ?? null}
          onNewChat={handleNewChat}
          onLoadSession={handleLoadSession}
          onDeleteSession={handleDeleteSession}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <main className={styles.main}>
        <div className={styles.mobileTopBar}>
          <button
            className={styles.topBarBtn}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            type="button"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="2" x2="17" y2="2" />
              <line x1="1" y1="9" x2="12" y2="9" />
            </svg>
          </button>
          <div className={styles.topBarCenter}>
            <TutorLogo size={20} />
            <span className={styles.topBarTitle}>MathTutor</span>
          </div>
          <button
            className={styles.topBarBtn}
            onClick={handleNewChat}
            aria-label="New problem"
            type="button"
          >
            <SquarePen size={18} />
          </button>
        </div>

        <ChatContainer
          messages={messages}
          activeSession={activeSession}
          strictness={strictness}
          maxHints={maxHints}
          hardMaxHints={hardMaxHints}
          isTyping={isTyping}
          error={error}
          onSendMessage={handleSendMessage}
          onStrictnessChange={setStrictness}
          onMaxHintsChange={setMaxHints}
          onNextHint={handleNextHint}
          onNewSession={handleNewChat}
          onExportSession={handleExportChat}
        />
      </main>
    </div>
  );
}

function toChatMessage(message: TutorSession['messages'][number]): Message {
  return {
    id: message.id,
    role: message.role === 'student' ? 'user' : 'assistant',
    content: message.content,
    timestamp: message.createdAt,
  };
}

export default ChatPage;
