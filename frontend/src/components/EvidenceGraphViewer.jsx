import React, { useState } from 'react';
import { GitFork, ShieldCheck, ExternalLink, ChevronRight, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function EvidenceGraphViewer({ evidenceGraph, problemText }) {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);

  if (!evidenceGraph || evidenceGraph.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
        <GitFork size={28} color="var(--accent-blue)" style={{ margin: '0 auto var(--space-sm) auto' }} />
        <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>Evidence Provenance Graph</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: 'var(--text-sm)' }}>
          Run a Problem Bridge Search to generate a traceable, verifiable evidence graph with zero hallucinated citations.
        </p>
      </div>
    );
  }

  const activeNode = evidenceGraph[selectedNodeIndex] || evidenceGraph[0];

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <GitFork size={18} color="var(--accent-blue)" />
            Trust & Provenance Evidence Graph
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Traceable lineage connecting Operational Problem → Mechanism → Patent Source → Verified Claim → Recommendation
          </p>
        </div>
        <span
          style={{
            background: 'var(--accent-blue-subtle)',
            border: '1px solid var(--accent-blue-border)',
            color: 'var(--accent-blue)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {evidenceGraph.length} Verified Lineage Nodes
        </span>
      </div>

      {/* Root Node: Operational Problem */}
      <div
        style={{
          background: '#F8FAFC',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-md)',
          marginBottom: 'var(--space-md)',
        }}
      >
        <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Root Node • Real-World Operational Context
        </div>
        <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
          "{problemText}"
        </div>
      </div>

      {/* Interactive 2-Column Inspector: Nodes List (left) + Deep Inspection (right) */}
      <div className="grid-2">
        {/* Left: Node Branching List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            Click an evidence node to inspect verified claims:
          </div>

          {evidenceGraph.map((ev, idx) => {
            const isSelected = selectedNodeIndex === idx;
            return (
              <div
                key={ev.id || idx}
                onClick={() => setSelectedNodeIndex(idx)}
                style={{
                  background: isSelected ? 'var(--accent-blue-subtle)' : '#FFFFFF',
                  border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-hairline)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isSelected ? '0 2px 6px rgba(37, 99, 235, 0.1)' : 'var(--shadow-card)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span className="badge-patent">{ev.patent_or_paper_id}</span>
                  <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    {Math.round(ev.confidence * 100)}% Confidence
                  </span>
                </div>

                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)', marginBottom: '4px' }}>
                  {ev.document_title}
                </div>

                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Mechanism: <span style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>{ev.extracted_mechanism}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Node Detail Inspector */}
        {activeNode && (
          <div
            className="glass-panel"
            style={{
              padding: 'var(--space-md)',
              background: '#FFFFFF',
              border: '1px solid var(--border-hairline)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge-patent" style={{ fontSize: 'var(--text-xs)' }}>
                  {activeNode.patent_or_paper_id}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-emerald)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> Verified Lineage Node
                </span>
              </div>

              <h3 style={{ fontSize: 'var(--text-md)', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {activeNode.document_title}
              </h3>

              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <strong>Source:</strong> {activeNode.source}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', fontWeight: 600 }}>
                  Verified Section & Claim:
                </div>
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid var(--border-hairline)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '12px',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: 'var(--accent-blue)' }}>{activeNode.section}: </strong>
                  "{activeNode.claim_or_finding}"
                </div>
              </div>

              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                <strong>Extracted Mechanism:</strong> {activeNode.extracted_mechanism}
              </div>

              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-amber)', background: 'var(--accent-amber-subtle)', padding: '6px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--accent-amber-border)' }}>
                <strong>Boundaries / Limitations:</strong> {activeNode.limitations}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '14px', textAlign: 'right' }}>
              <a
                href={activeNode.patent_or_paper_id?.startsWith('US') ? `https://patents.google.com/patent/${activeNode.patent_or_paper_id}/en` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ fontSize: 'var(--text-xs)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>View Full Document</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
