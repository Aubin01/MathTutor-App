/**
 * Welcome screen with subject-grouped math topics for an educational tutor.
 */

import { useMemo } from 'react';
import katex from 'katex';
import { BookOpen, TrendingUp, Shapes, Calculator } from 'lucide-react';
import styles from './WelcomeScreen.module.css';

interface SuggestedPrompt {
  label: string;
  latex: string;
  icon: React.ReactNode;
  subject: string;
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    subject: 'Algebra',
    label: 'Factor this expression',
    latex: 'x^2 + 5x + 6',
    icon: <Calculator size={18} />,
  },
  {
    subject: 'Calculus',
    label: 'Work through a derivative',
    latex: '\\frac{d}{dx}\\left(x^2\\sin x\\right)',
    icon: <TrendingUp size={18} />,
  },
  {
    subject: 'Algebra',
    label: 'Solve this equation',
    latex: '2x + 7 = 19',
    icon: <BookOpen size={18} />,
  },
  {
    subject: 'Geometry',
    label: 'Reason about a triangle',
    latex: 'a^2 + b^2 = c^2',
    icon: <Shapes size={18} />,
  },
];

interface WelcomeScreenProps {
  onPromptSelect: (content: string) => void;
}

function WelcomeScreen({ onPromptSelect }: WelcomeScreenProps) {
  return (
    <div className={styles.welcome}>
      <div className={styles.watermark} aria-hidden="true">
        ∫ Σ π √ Δ ∞ ± × ÷ ∂ ∇ θ λ μ α β γ ε ζ η φ ψ ω ∑ ∏ ∈ ∉ ⊂ ⊃ ∪ ∩ ≈ ≠ ≤ ≥ ∝ ∅ ⊥ ∠ ∧ ∨ ⊕ ⊗ ℝ ℤ ℕ ℂ ∫ Σ π √ Δ ∞ ± × ÷ ∂ ∇ θ λ μ α β γ ε ζ η φ ψ ω ∑ ∏ ∈ ∉ ⊂ ⊃ ∪ ∩ ≈ ≠ ≤ ≥ ∝ ∅ ⊥ ∠ ∧ ∨ ⊕ ⊗ ℝ ℤ ℕ ℂ ∫ Σ π √ Δ ∞ ± × ÷ ∂ ∇ θ λ μ α β γ ε ζ η φ ψ ω ∑ ∏ ∈ ∉ ⊂ ⊃ ∪ ∩ ≈ ≠ ≤ ≥ ∝ ∅ ⊥ ∠ ∧ ∨ ⊕ ⊗ ℝ ℤ ℕ ℂ ∫ Σ π √ Δ ∞ ± × ÷ ∂ ∇ θ λ μ α β γ ε ζ η φ ψ ω ∑ ∏ ∈ ∉ ⊂ ⊃ ∪ ∩ ≈ ≠ ≤ ≥
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.greeting}>What should we work on today?</h1>
        </header>

        <div className={styles.grid}>
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={prompt.label}
              className={styles.card}
              onClick={() => onPromptSelect(`${prompt.label}: $${prompt.latex}$`)}
              style={{ animationDelay: `${i * 0.08}s` }}
              type="button"
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>{prompt.icon}</span>
                <span className={styles.cardSubject}>{prompt.subject}</span>
              </div>
              <span className={styles.cardLabel}>{prompt.label}</span>
              <RenderedLatex latex={prompt.latex} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RenderedLatex({ latex }: { latex: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return latex;
    }
  }, [latex]);

  return (
    <span
      className={styles.cardMath}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default WelcomeScreen;
