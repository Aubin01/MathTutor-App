/**
 * ModelSelector — inline pill buttons to choose the input mode
 */
import styles from './ModelSelector.module.css';
import type { InputMode } from '../../types';

interface ModelSelectorProps {
  value: InputMode;
  onChange: (mode: InputMode) => void;
}

const modes: { value: InputMode; label: string }[] = [
  { value: 'explore', label: 'Explore' },
  { value: 'solve', label: 'Solve' },
  { value: 'prove', label: 'Prove' },
];

function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className={styles.pills}>
      {modes.map(mode => (
        <button
          key={mode.value}
          type="button"
          className={`${styles.pill} ${mode.value === value ? styles.active : ''}`}
          onClick={() => onChange(mode.value)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

export default ModelSelector;
