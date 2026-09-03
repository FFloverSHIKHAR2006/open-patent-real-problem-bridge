import React from 'react';

export default function EvidenceGraphViewer({ evidenceGraph, problemText }) {
  if (!evidenceGraph || evidenceGraph.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
        <h3>🕸️ Evidence Provenance Graph</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Run a Problem Bridge Search to generate a traceable evidence graph.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>🕸️ Trust & Provenance Evidence Graph</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Traceable lineage connecting Operational Problem → Mechanism → Patent Source → Verified Claim → Prototype Recommendation.
          </p>
        </div>
        <span className="score-pill" style={{ background: 'hsla(187, 85%, 53%, 0.15)', color: 'var(--accent-cyan)', borderColor: 'var(--accent-cyan)' }}>
          {evidenceGraph.length} Verified Evidence Nodes
        </span>
      </div>

      {/* Root Node: Problem */}
      <div
        style={{
          background: 'linear-gradient(90deg, hsla(265, 83%, 63%, 0.2), hsla(187, 85%, 53%, 0.2))',
          border: '1px solid var(--accent-purple)',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '20px',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
          Root Node: Natural-Language Operational Problem
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginTop: '4px' }}>
          "{problemText}"
        </div>
      </div>

      {/* Lineage Branching Nodes */}
      <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px dashed var(--accent-cyan)' }}>
        {evidenceGraph.map((ev, idx) => (
          <div key={ev.id || idx} className="provenance-node">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="patent-badge">{ev.patent_or_paper_id}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {ev.document_title}
                </span>
              </div>
              <span className="score-pill" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                Confidence: {Math.round(ev.confidence * 100)}%
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '6px' }}>
              Extracted Mechanism: {ev.extracted_mechanism}
            </div>

            <div
              style={{
                background: 'hsla(222, 47%, 9%, 0.8)',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                lineHeight: '1.4',
              }}
            >
              "<strong>{ev.section}:</strong> {ev.claim_or_finding}"
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              <span>Source: {ev.source}</span>
              <span>Limitations: {ev.limitations}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
