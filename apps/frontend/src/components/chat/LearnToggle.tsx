/** LearnToggle — button to switch between Quick and Tutor response style. */
import styles from './LearnToggle.module.css';

interface LearnToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function LearnToggle({ enabled, onChange }: LearnToggleProps) {
  return (
    <button
      className={`${styles.toggle} ${enabled ? styles.on : ''}`}
      onClick={() => onChange(!enabled)}
      type="button"
      title={enabled ? 'Tutor mode: step-by-step explanations' : 'Enable tutor mode'}
    >
      Tutor
    </button>
  );
}

export default LearnToggle;
