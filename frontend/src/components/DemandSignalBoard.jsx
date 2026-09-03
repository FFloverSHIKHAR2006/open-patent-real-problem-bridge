import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

export default function DemandSignalBoard() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.demandSignals)
      .then((res) => res.json())
      .then((data) => {
        setSignals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load demand signals:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem' }}>📊 Unsolved Demand Signal Board</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Surfacing real-world operational problems reported by communities, hardware makers, and impact groups with high unmet patent opportunity scores.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading demand signals...
        </div>
      ) : (
        <div className="grid-2">
          {signals.map((sig, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '18px', background: 'hsla(222, 47%, 9%, 0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span
                  className="score-pill"
                  style={{
                    background: sig.priority_level.includes('CRITICAL')
                      ? 'hsla(350, 89%, 60%, 0.2)'
                      : 'hsla(38, 92%, 50%, 0.2)',
                    color: sig.priority_level.includes('CRITICAL') ? 'var(--accent-rose)' : 'var(--accent-amber)',
                    borderColor: sig.priority_level.includes('CRITICAL') ? 'var(--accent-rose)' : 'var(--accent-amber)',
                    fontSize: '0.75rem',
                  }}
                >
                  {sig.priority_level}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  🔥 {sig.frequency_count} Community Requests
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{sig.problem_topic}</h3>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <strong>Affected Sectors:</strong> {sig.affected_sectors.join(', ')}
              </div>

              <div style={{ background: 'hsla(217, 33%, 20%, 0.4)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '12px' }}>
                <strong>Key Unmet Mechanism:</strong> {sig.underlying_unmet_mechanism}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', textAlign: 'right' }}>
                {sig.candidate_patent_matches_count} Applicable Open Patents Available
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
