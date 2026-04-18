/** TypingIndicator — animated bouncing dots shown while the assistant is "typing". */
import styles from './TypingIndicator.module.css';

function TypingIndicator() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bubble}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  );
}

export default TypingIndicator;
