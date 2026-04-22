/**
 * Welcome screen with subject-grouped math topics for an educational tutor.
 */

import { useMemo } from 'react';
import katex from 'katex';
import { BookOpen, TrendingUp, Shapes, Calculator } from 'lucide-react';
import styles from './WelcomeScreen.module.css';

interface SuggestedPrompt {
  label: string;
  previewLatex: string;
  question: string;
  icon: React.ReactNode;
  subject: string;
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    subject: 'Calculus',
    label: 'Differentiate a variable-base power',
    previewLatex: 'f(x)=x^{\\sin x},\\quad f\'(x)=x^{\\sin x}\\left(\\cos x\\ln x+\\frac{\\sin x}{x}\\right)',
    question: 'Differentiate $f(x)=x^{\\sin x}$ for $x>0$ using logarithmic differentiation. Explain each step and simplify the derivative.',
    icon: <Calculator size={18} />,
  },
  {
    subject: 'Calculus',
    label: 'Classify a power series at every endpoint',
    previewLatex: '\\sum_{n=1}^{\\infty}\\frac{n(x-2)^n}{3^n\\sqrt{n+1}}',
    question: 'Find the interval of convergence for the power series $\\sum_{n=1}^{\\infty}\\frac{n(x-2)^n}{3^n\\sqrt{n+1}}$. Check both endpoints carefully.',
    icon: <TrendingUp size={18} />,
  },
  {
    subject: 'Discrete Math',
    label: 'Prove non-planarity using graph constraints',
    previewLatex: 'K_{3,3}:\\quad v=6,\\ e=9,\\ g=4',
    question: 'Prove that $K_{3,3}$ is non-planar using Euler formula and the edge bound for bipartite planar graphs.',
    icon: <BookOpen size={18} />,
  },
  {
    subject: 'Calculus',
    label: 'Evaluate an improper integral rigorously',
    previewLatex: '\\int_{0}^{\\infty}\\frac{\\ln x}{1+x^2}\\,dx',
    question: 'Evaluate the improper integral $\\int_{0}^{\\infty}\\frac{\\ln x}{1+x^2}\\,dx$. Justify the convergence and show the substitution symmetry.',
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
              onClick={() => onPromptSelect(prompt.question)}
              style={{ animationDelay: `${i * 0.08}s` }}
              type="button"
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>{prompt.icon}</span>
                <span className={styles.cardSubject}>{prompt.subject}</span>
              </div>
              <span className={styles.cardLabel}>{prompt.label}</span>
              <RenderedLatex latex={prompt.previewLatex} />
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
