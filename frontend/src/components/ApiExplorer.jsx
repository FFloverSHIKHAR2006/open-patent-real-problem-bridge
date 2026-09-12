import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal } from 'lucide-react';

export default function ApiExplorer() {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 1800);
  };

  const sampleSearchPayload = `{
  "problem": "Low-cost food-safe moisture desiccant for bulk grain storage in high humidity",
  "desired_outcome": "Prevent mold infestation and grain loss",
  "constraints": {
    "budget": "low",
    "materials": ["bentonite clay", "calcium chloride"],
    "location": "rural humid storage",
    "scale": "small farm (500kg)"
  }
}`;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: 'var(--space-md)' }}>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Code2 size={18} color="var(--accent-blue)" />
          Developer & Integration API Explorer
        </h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Integrate the Open-Patent to Real Problem Bridge directly into your innovation workflow or hardware pipeline via REST endpoints.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Endpoint 1 */}
        <div style={{ background: '#FFFFFF', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', borderLeft: '3px solid var(--accent-blue)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ background: 'var(--accent-blue)', color: '#FFFFFF', fontWeight: 700, fontSize: 'var(--text-2xs)', padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>POST</span>
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>/api/search</code>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(sampleSearchPayload, 'search-payload')}
              className="btn-ghost"
              style={{ fontSize: 'var(--text-xs)', padding: '4px 8px' }}
            >
              {copiedEndpoint === 'search-payload' ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
              <span>Copy Payload</span>
            </button>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Accepts natural language operational problem and constraints; returns underlying mechanisms, candidate patents, solution fusions, and evidence graph.
          </p>
          <pre style={{ background: '#F8FAFC', border: '1px solid var(--border-hairline)', padding: '12px', borderRadius: 'var(--radius-xs)', fontSize: 'var(--text-xs)', color: '#0F172A', overflowX: 'auto', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
{sampleSearchPayload}
          </pre>
        </div>

        {/* Endpoint 2 */}
        <div style={{ background: '#FFFFFF', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', borderLeft: '3px solid var(--accent-blue)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ background: 'var(--accent-blue)', color: '#FFFFFF', fontWeight: 700, fontSize: 'var(--text-2xs)', padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>POST</span>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>/api/prior-art</code>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            Reverse prior-art validator: assesses novelty and overlaps against open patents and generates engineering improvements.
          </p>
        </div>

        {/* Endpoint 3 */}
        <div style={{ background: '#FFFFFF', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', borderLeft: '3px solid var(--accent-purple)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ background: 'var(--accent-purple)', color: '#fff', fontWeight: 700, fontSize: 'var(--text-2xs)', padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>GET</span>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>/api/demand-signals</code>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            Retrieves community and operational demand signals with unmet patent opportunity scores.
          </p>
        </div>

        {/* Endpoint 4 */}
        <div style={{ background: '#FFFFFF', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', borderLeft: '3px solid var(--accent-amber)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ background: 'var(--accent-amber)', color: '#fff', fontWeight: 700, fontSize: 'var(--text-2xs)', padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>GET</span>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>/api/patents</code>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            Lists curated patent corpus entries including claims, underlying physical mechanisms, and verified evidence snippets.
          </p>
        </div>
      </div>
    </div>
  );
}
