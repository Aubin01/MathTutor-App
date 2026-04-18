/**
 * Sidebar for tutor sessions, search, and theme settings.
 */
import { useState, useMemo } from 'react';
import styles from './SettingsSidebar.module.css';
import { Settings, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen, SquarePen, Search, X, Trash2 } from 'lucide-react';
import { useDarkMode } from '../../hooks/useTheme';
import type { TutorSessionSummary } from '../../types';
import TutorLogo from '../TutorLogo';
import katex from 'katex';

interface PillSwitchProps {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  ariaLabel: string;
}

function PillSwitch({ label, enabled, onToggle, ariaLabel }: PillSwitchProps) {
  return (
    <div className={styles.settingRow}>
      <span className={styles.settingLabel}>{label}</span>
      <button
        className={styles.pillSwitch}
        onClick={onToggle}
        aria-label={ariaLabel}
        title={ariaLabel}
        type="button"
      >
        <span className={`${styles.track} ${enabled ? styles.on : ''}`}>
          <span className={`${styles.thumb} ${enabled ? styles.thumbOn : ''}`} />
        </span>
      </button>
    </div>
  );
}

interface SettingsSidebarProps {
  chatHistory: TutorSessionSummary[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onLoadSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onClose?: () => void;
}

interface DateGroup {
  label: string;
  sessions: TutorSessionSummary[];
}

function groupByDate(sessions: TutorSessionSummary[]): DateGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const last7 = new Date(today.getTime() - 7 * 86400000);

  const groups: Record<string, TutorSessionSummary[]> = {
    Today: [],
    Yesterday: [],
    'Previous 7 days': [],
    Older: [],
  };

  for (const s of sessions) {
    const d = new Date(s.createdAt);
    if (d >= today) groups['Today'].push(s);
    else if (d >= yesterday) groups['Yesterday'].push(s);
    else if (d >= last7) groups['Previous 7 days'].push(s);
    else groups['Older'].push(s);
  }

  return Object.entries(groups)
    .filter(([, list]) => list.length > 0)
    .map(([label, list]) => ({ label, sessions: list }));
}

/** Normalize delimiters to $...$ / $$...$$ and close any truncated math blocks. */
function normalizeTitleMath(text: string): string {
  let result = text
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');

  // Count unmatched $ — if odd, the title was truncated mid-math, so close it
  const dollars = result.match(/\$\$/g);
  if (dollars && dollars.length % 2 !== 0) {
    result = result.replace(/\.{3}$/, '\\ldots') + '$$';
  }
  const singles = result.replace(/\$\$/g, '').match(/\$/g);
  if (singles && singles.length % 2 !== 0) {
    result = result.replace(/\.{3}$/, '\\ldots') + '$';
  }
  return result;
}

/** Renders a chat title with optional LaTeX math via KaTeX. */
function MathTitle({ title }: { latex?: string; title: string }) {
  const html = useMemo(() => {
    const normalized = normalizeTitleMath(title);
    const parts = normalized.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
    if (parts.length === 1) return '';

    return parts
      .map((part) => {
        let math = '';
        if (part.startsWith('$$') && part.endsWith('$$')) {
          math = part.slice(2, -2);
        } else if (part.startsWith('$') && part.endsWith('$')) {
          math = part.slice(1, -1);
        }

        if (math) {
          try {
            return katex.renderToString(math, { displayMode: false, throwOnError: false });
          } catch {
            return part;
          }
        }
        // Escape HTML in plain text segments
        return part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      })
      .join('');
  }, [title]);

  if (!html) return <>{title}</>;

  return (
    <span className={styles.mathTitle} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function SettingsSidebar({ chatHistory, activeSessionId, onNewChat, onLoadSession, onDeleteSession, onClose }: SettingsSidebarProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleCollapse = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile && onClose) {
      onClose();
    } else {
      setCollapsed(true);
    }
  };

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return chatHistory;
    const q = searchQuery.toLowerCase();
    return chatHistory.filter(s => s.title.toLowerCase().includes(q));
  }, [chatHistory, searchQuery]);

  const dateGroups = useMemo(() => groupByDate(filteredHistory), [filteredHistory]);

  const handleSearchToggle = () => {
    setIsSearching(prev => !prev);
    setSearchQuery('');
  };

  if (collapsed) {
    return (
      <div className={`${styles.sidebar} ${styles.collapsed}`}>
        <div className={styles.collapsedActions}>
          <button
            className={styles.collapsedLogo}
            onClick={() => setCollapsed(false)}
            aria-label="Open sidebar"
            title="Open sidebar"
            type="button"
          >
            <span className={styles.logoDefault}><TutorLogo size={28} /></span>
            <span className={styles.logoHover}><PanelLeftOpen size={18} /></span>
          </button>
          <button
            className={styles.iconButton}
            onClick={onNewChat}
            aria-label="New chat"
            title="New chat"
            type="button"
          >
            <SquarePen size={18} />
          </button>
          <button
            className={styles.iconButton}
            onClick={() => { setCollapsed(false); setIsSearching(true); }}
            aria-label="Search chats"
            title="Search chats"
            type="button"
          >
            <Search size={18} />
          </button>
        </div>
        <div className={styles.collapsedFooter}>
          <button
            className={styles.iconButton}
            onClick={() => { setCollapsed(false); setSettingsOpen(true); }}
            aria-label="Settings"
            title="Settings"
            type="button"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandLogo}>
          <TutorLogo size={24} />
          <h1 className={styles.brandTitle}>MathTutor</h1>
        </div>
        <button
          className={styles.collapseToggle}
          onClick={handleCollapse}
          aria-label="Close sidebar"
          title="Close sidebar"
          type="button"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className={styles.actions}>
        <button className={styles.newChatButtonFull} type="button" onClick={() => { onNewChat(); onClose?.(); }}>
          <SquarePen size={16} />
          <span>New Problem</span>
        </button>
        <button className={styles.searchButtonFull} type="button" onClick={handleSearchToggle} aria-label="Search chats" title="Search chats">
          <Search size={16} />
          <span>Search Sessions</span>
        </button>
      </div>

      {isSearching && (
        <div className={styles.searchBar}>
          <Search size={14} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button
            className={styles.searchClear}
            onClick={handleSearchToggle}
            aria-label="Close search"
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className={styles.historySection}>
        {filteredHistory.length === 0 ? (
          <p className={styles.emptyHistory}>
            {searchQuery ? 'No matching sessions' : 'No tutoring history yet'}
          </p>
        ) : (
          <div className={styles.historyList}>
            {dateGroups.map(group => (
              <div key={group.label} className={styles.dateGroup}>
                <span className={styles.dateLabel}>{group.label}</span>
                {group.sessions.map(session => (
                  <div
                    key={session.id}
                    className={`${styles.historyItem} ${session.id === activeSessionId ? styles.historyItemActive : ''}`}
                  >
                    <button
                      className={styles.historyButton}
                      type="button"
                      onClick={() => onLoadSession(session.id)}
                      title={session.title}
                    >
                      <MathTitle title={session.title} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                      aria-label="Delete chat"
                      title="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.settingsFooter}>
        <button
          className={styles.sectionHeader}
          onClick={() => setSettingsOpen(o => !o)}
          type="button"
        >
          <Settings size={16} className={styles.sectionIcon} />
          <span className={styles.sectionTitle}>Settings</span>
          {settingsOpen ? (
            <ChevronDown size={14} className={styles.chevron} />
          ) : (
            <ChevronRight size={14} className={styles.chevron} />
          )}
        </button>
        {settingsOpen && (
          <div className={styles.sectionContent}>
            <PillSwitch
              label="Dark mode"
              enabled={isDarkMode}
              onToggle={toggleDarkMode}
              ariaLabel={isDarkMode ? 'Disable dark mode' : 'Enable dark mode'}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsSidebar;
