/**
 * Simple text input for the math tutor.
 */
import { useState, useRef } from 'react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function ChatInput({ onSend, placeholder = 'Paste a math problem...', disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  return (
    <div className={styles.inputContainer}>
      <textarea
        ref={inputRef}
        className={styles.textarea}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
      />
    </div>
  );
}

export default ChatInput;
