/**
 * MessageList — scrollable list of chat messages with auto-scroll
 * and a "scroll to bottom" button when the user scrolls up.
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import styles from './MessageList.module.css';
import type { Message as MessageType } from '../../types';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: MessageType[];
  isTyping?: boolean;
}

function MessageList({ messages, isTyping }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = listRef.current;
    if (!el) return;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => scrollToBottom());
  }, [messages.length, isTyping, scrollToBottom]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const handleScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(distFromBottom > 120);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  if (messages.length === 0 && !isTyping) {
    return null;
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.list} ref={listRef}>
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {showScrollBtn && (
        <button
          className={styles.scrollBtn}
          onClick={() => scrollToBottom()}
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          <ArrowDown size={16} />
        </button>
      )}
    </div>
  );
}

export default MessageList;