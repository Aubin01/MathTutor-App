/**
 * Main tutoring workspace with messages, controls, and input.
 */

import { Download, Lightbulb, Plus } from 'lucide-react';
import styles from './ChatContainer.module.css';
import type { Message, TutorSession, TutorStrictness } from '../../types';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';

interface ChatContainerProps {
  messages: Message[];
  activeSession: TutorSession | null;
  strictness: TutorStrictness;
  maxHints: number;
  hardMaxHints: number;
  isTyping?: boolean;
  error?: string;
  onSendMessage: (content: string) => void;
  onStrictnessChange: (strictness: TutorStrictness) => void;
  onMaxHintsChange: (count: number) => void;
  onNextHint: () => void;
  onNewSession: () => void;
  onExportSession: () => void;
}

function ChatContainer({
  messages,
  activeSession,
  strictness,
  maxHints,
  hardMaxHints,
  isTyping,
  error,
  onSendMessage,
  onStrictnessChange,
  onMaxHintsChange,
  onNextHint,
  onNewSession,
  onExportSession,
}: ChatContainerProps) {
  const hasSession = Boolean(activeSession);
  const hintOptions = Array.from({ length: hardMaxHints }, (_, index) => index + 1);

  return (
    <div className={styles.container}>
      {hasSession || isTyping ? (
        <MessageList messages={messages} isTyping={isTyping} />
      ) : (
        <WelcomeScreen onPromptSelect={onSendMessage} />
      )}

      {error && <p className={styles.error}>{error}</p>}

      {activeSession && (
        <div className={styles.progressBar}>
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>Hint Progress</span>
            <span className={styles.progressCount}>{activeSession.revealedCount} / {activeSession.maxHints}</span>
          </div>
          <div className={styles.progressTrack}>
            {Array.from({ length: activeSession.maxHints }, (_, i) => (
              <div
                key={i}
                className={`${styles.progressStep} ${i < activeSession.revealedCount ? styles.progressStepDone : ''} ${i === activeSession.revealedCount ? styles.progressStepNext : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.inputCard}>
        {!activeSession && <span className={styles.inputLabel}>Your Problem</span>}
        <div className={styles.inputArea}>
          <ChatInput
            onSend={onSendMessage}
            placeholder={hasSession ? 'Ask about the current hint...' : 'Message MathTutor...'}
            disabled={isTyping}
          />
        </div>
        <div className={styles.controls}>
          {!activeSession && (
            <>
              <div className={styles.pillGroup}>
                <span className={styles.pillLabel}>Strictness</span>
                <div className={styles.pillToggle}>
                  {(['strict', 'medium'] as TutorStrictness[]).map(level => (
                    <button
                      key={level}
                      type="button"
                      className={`${styles.pill} ${strictness === level ? styles.pillActive : ''}`}
                      onClick={() => onStrictnessChange(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.pillGroup}>
                <span className={styles.pillLabel}>Hints</span>
                <div className={styles.pillToggle}>
                  {hintOptions.map(count => (
                    <button
                      key={count}
                      type="button"
                      className={`${styles.pill} ${maxHints === count ? styles.pillActive : ''}`}
                      onClick={() => onMaxHintsChange(count)}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeSession && (
            <>
              <button className={styles.actionButton} type="button" onClick={onNewSession}>
                <Plus size={15} />
                New problem
              </button>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={onNextHint}
                disabled={!activeSession.canRequestNext || isTyping}
              >
                <Lightbulb size={15} />
                Next Hint
              </button>
              <button
                className={styles.exportBtn}
                onClick={onExportSession}
                title="Export session as JSON"
                aria-label="Export session"
                type="button"
              >
                <Download size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
