import React from 'react';
import { Sparkles, BookOpen, Layers } from 'lucide-react';

export default function MechanismMatchCard({ match, onSelectRecipe }) {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF', border: '1px solid var(--border-hairline)', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge-patent">{match.patent_id}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{match.source}</span>
        </div>
        <span
          style={{
            background: 'var(--accent-blue-subtle)',
            border: '1px solid var(--accent-blue-border)',
            color: 'var(--accent-blue)',
            fontSize: 'var(--text-2xs)',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {Math.round(match.score * 100)}% Mechanism Match
        </span>
      </div>

      <h3 style={{ fontSize: 'var(--text-md)', marginBottom: '8px', color: 'var(--text-primary)' }}>
        {match.title}
      </h3>

      {match.cross_domain_flag && (
        <div
          style={{
            background: 'var(--accent-purple-subtle)',
            border: '1px solid var(--accent-purple-border)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '10px',
            fontSize: 'var(--text-xs)',
            color: 'var(--accent-purple)',
          }}
        >
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} /> Cross-Domain Transfer Detected
          </div>
          <div style={{ fontSize: 'var(--text-2xs)', marginTop: '2px', color: 'var(--text-secondary)' }}>
            {match.cross_domain_explanation}
          </div>
        </div>
      )}

      <div style={{ background: '#F8FAFC', border: '1px solid var(--border-hairline)', padding: '10px', borderRadius: 'var(--radius-xs)', marginBottom: '10px' }}>
        <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.04em' }}>
          Underlying Physical / Chemical Mechanism:
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {match.core_mechanism}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px', fontSize: 'var(--text-2xs)', textAlign: 'center' }}>
        <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-hairline)' }}>
          <div style={{ color: 'var(--text-tertiary)' }}>Mechanism</div>
          <div style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{Math.round(match.mechanism_similarity * 100)}%</div>
        </div>
        <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-hairline)' }}>
          <div style={{ color: 'var(--text-tertiary)' }}>Applicability</div>
          <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{Math.round(match.technical_applicability * 100)}%</div>
        </div>
        <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-hairline)' }}>
          <div style={{ color: 'var(--text-tertiary)' }}>Confidence</div>
          <div style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>{Math.round(match.confidence * 100)}%</div>
        </div>
      </div>

      {match.evidence_snippets && match.evidence_snippets.length > 0 && (
        <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)', marginBottom: '14px', fontStyle: 'italic', background: '#F1F5F9', padding: '8px 10px', borderRadius: 'var(--radius-xs)', borderLeft: '2px solid var(--accent-blue)' }}>
          "<strong>{match.evidence_snippets[0].section}:</strong> {match.evidence_snippets[0].text.substring(0, 110)}..."
        </div>
      )}

      <div style={{ marginTop: 'auto' }}>
        <button
          type="button"
          onClick={() => onSelectRecipe(match.patent_id)}
          className="btn-secondary"
          style={{ width: '100%', fontSize: 'var(--text-xs)', justifyContent: 'center' }}
        >
          <BookOpen size={13} />
          <span>View Prototype Recipe & BOM</span>
        </button>
      </div>
    </div>
  );
}
