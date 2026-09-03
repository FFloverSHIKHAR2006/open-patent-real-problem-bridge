import React from 'react';

export default function MechanismMatchCard({ match, onSelectRecipe }) {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="patent-badge">{match.patent_id}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{match.source}</span>
        </div>
        <span className="score-pill">
          {Math.round(match.score * 100)}% Mechanism Match
        </span>
      </div>

      <h3 style={{ fontSize: '1.05rem', marginBottom: '10px', color: 'var(--text-main)' }}>
        {match.title}
      </h3>

      {match.cross_domain_flag && (
        <div className="cross-domain-banner">
          🚀 <strong>Cross-Domain Solution Transfer Detected!</strong>
          <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
            {match.cross_domain_explanation}
          </div>
        </div>
      )}

      <div style={{ background: 'hsla(222, 47%, 9%, 0.6)', padding: '12px', borderRadius: '8px', marginBottom: '14px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '4px' }}>
          Underlying Physical / Chemical Mechanism:
        </div>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
          {match.core_mechanism}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px', fontSize: '0.78rem', textAlign: 'center' }}>
        <div style={{ background: 'hsla(217, 33%, 20%, 0.5)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ color: 'var(--text-muted)' }}>Mechanism Sim</div>
          <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{Math.round(match.mechanism_similarity * 100)}%</div>
        </div>
        <div style={{ background: 'hsla(217, 33%, 20%, 0.5)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ color: 'var(--text-muted)' }}>Applicability</div>
          <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{Math.round(match.technical_applicability * 100)}%</div>
        </div>
        <div style={{ background: 'hsla(217, 33%, 20%, 0.5)', padding: '8px', borderRadius: '6px' }}>
          <div style={{ color: 'var(--text-muted)' }}>Confidence</div>
          <div style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>{Math.round(match.confidence * 100)}%</div>
        </div>
      </div>

      {match.evidence_snippets && match.evidence_snippets.length > 0 && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', fontStyle: 'italic' }}>
          "<strong>{match.evidence_snippets[0].section}:</strong> {match.evidence_snippets[0].text.substring(0, 110)}..."
        </div>
      )}

      <div style={{ marginTop: 'auto', textAlign: 'right' }}>
        <button
          type="button"
          onClick={() => onSelectRecipe(match.patent_id)}
          className="btn-secondary"
          style={{ width: '100%', fontSize: '0.88rem', justifyContent: 'center' }}
        >
          📖 View Prototype Recipe & BOM
        </button>
      </div>
    </div>
  );
}
