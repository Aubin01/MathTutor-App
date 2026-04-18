/** SourceCard — compact card showing a retrieved source's title, excerpt, and page number. */
import styles from './SourceCard.module.css';
import type { Source } from '../../types';

interface SourceCardProps {
  source: Source;
}

function SourceCard({ source }: SourceCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{source.title}</h3>
      <p className={styles.excerpt}>{source.excerpt}</p>
    </div>
  );
}

export default SourceCard;
