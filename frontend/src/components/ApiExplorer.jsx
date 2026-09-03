import React from 'react';

export default function ApiExplorer() {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem' }}>⚡ Developer API Explorer</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Integrate the Open-Patent to Real Problem Bridge directly into your innovation pipeline or platform via REST API endpoints.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ background: 'hsla(222, 47%, 9%, 0.7)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ background: 'var(--accent-emerald)', color: '#000', fontWeight: 700, fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>POST</span>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontSize: '0.9rem' }}>/api/search</code>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Accepts natural language operational problem and constraints; returns mechanism matches, solution fusion, prototype recipes, and provenance evidence graph.
          </p>
          <pre style={{ background: '#090d16', padding: '12px', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--accent-cyan)', overflowX: 'auto' }}>
{`{
  "problem": "Low-cost food-safe moisture desiccant for grain storage in high humidity",
  "desired_outcome": "Prevent mold infestation and grain loss",
  "constraints": {
    "budget": "low",
    "materials": ["bentoclay", "silica gel"],
    "location": "rural humid",
    "scale": "small farm"
  }
}`}
          </pre>
        </div>

        <div style={{ background: 'hsla(222, 47%, 9%, 0.7)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ background: 'var(--accent-cyan)', color: '#000', fontWeight: 700, fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>POST</span>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontSize: '0.9rem' }}>/api/prior-art</code>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Reverse prior-art search: validates user prototype idea against open patent corpus and returns novelty analysis and engineering improvements.
          </p>
        </div>

        <div style={{ background: 'hsla(222, 47%, 9%, 0.7)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ background: 'var(--accent-purple)', color: '#fff', fontWeight: 700, fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>GET</span>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontSize: '0.9rem' }}>/api/demand-signals</code>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Retrieves trending operational demand signals and unmet patent opportunity scores.
          </p>
        </div>

        <div style={{ background: 'hsla(222, 47%, 9%, 0.7)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ background: 'var(--accent-amber)', color: '#000', fontWeight: 700, fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>GET</span>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontSize: '0.9rem' }}>/api/patents</code>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Returns full curated patent disclosures database including claims, mechanisms, and evidence snippets.
          </p>
        </div>
      </div>
    </div>
  );
}
