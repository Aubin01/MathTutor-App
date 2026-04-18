/** LibraryPanel — displays retrieved source cards in the right sidebar. */
import styles from './LibraryPanel.module.css';
import type { Source } from '../../types';
import SourceCard from '../library/SourceCard';

interface LibraryPanelProps {
  sources: Source[];
}

function LibraryPanel({ sources }: LibraryPanelProps) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Sources</h2>
      
      {sources.length === 0 ? (
        <p className={styles.empty}>No sources retrieved yet.</p>
      ) : (
        <div className={styles.list}>
          {sources.map(source => (
            source.link ? (
              <a key={source.id} href={source.link} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                <SourceCard source={source} />
              </a>
            ) : (
              <SourceCard key={source.id} source={source} />
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default LibraryPanel;