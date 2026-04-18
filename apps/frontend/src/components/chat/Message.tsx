/**
 * Message — renders a single chat bubble (user or assistant).
 * User math messages are rendered via KaTeX; assistant messages
 * go through MathRenderer for inline/display math + markdown.
 */
import { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import styles from './Message.module.css';
import type { Message as MessageType } from '../../types';
import { formatDate } from '../../utils/formatDate';
import MathRenderer from './MathRenderer';

interface MessageProps {
  message: MessageType;
  onRetry?: (message: MessageType) => void;
}

function Message({ message, onRetry }: MessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = message.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.messageInner}>
        <div className={styles.roleLabel}>{isUser ? 'You' : 'Tutor'}</div>
        <div className={styles.bubble}>
          <MathRenderer content={message.content} />
        </div>
        <div className={styles.meta}>
          <span className={styles.timestamp}>{formatDate(message.timestamp)}</span>
          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy message'}
              aria-label="Copy message"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
            {!isUser && onRetry && (
              <button
                className={styles.actionBtn}
                onClick={() => onRetry(message)}
                title="Retry"
                aria-label="Retry"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;