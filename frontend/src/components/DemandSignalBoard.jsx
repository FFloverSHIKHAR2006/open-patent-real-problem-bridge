import React, { useEffect, useState } from 'react';
import { BarChart3, Zap, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { API_BASE } from '../config';

export default function DemandSignalBoard({ onSeedProblem }) {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState('All');

  useEffect(() => {
    fetch(`${API_BASE}/api/demand-signals`)
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

  const sectors = ['All', ...new Set(signals.flatMap((s) => s.affected_sectors || []))];

  const filteredSignals = signals.filter((s) => {
    if (selectedSector === 'All') return true;
    return s.affected_sectors?.includes(selectedSector);
  });

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
            <BarChart3 size={18} color="var(--accent-blue)" />
            Unsolved Operational Demand Signals
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Surfacing real-world operational challenges reported by communities and field groups with high unmet patent opportunity scores.
          </p>
        </div>

        {/* Sector Filter Chips */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {sectors.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setSelectedSector(sec)}
              className={`preset-chip ${selectedSector === sec ? 'active' : ''}`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          Loading live demand signals...
        </div>
      ) : (
        <div className="grid-2">
          {filteredSignals.map((sig, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: 'var(--space-md)',
                background: '#ffffff',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span
                    style={{
                      background: sig.priority_level.includes('CRITICAL')
                        ? 'var(--accent-rose-subtle)'
                        : 'var(--accent-amber-subtle)',
                      color: sig.priority_level.includes('CRITICAL') ? 'var(--accent-rose)' : 'var(--accent-amber)',
                      border: `1px solid ${sig.priority_level.includes('CRITICAL') ? 'var(--accent-rose-border)' : 'var(--accent-amber-border)'}`,
                      fontSize: 'var(--text-2xs)',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    {sig.priority_level}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-blue)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={12} />
                    {sig.frequency_count} Field Requests
                  </span>
                </div>

                <h3 style={{ fontSize: 'var(--text-md)', marginBottom: '6px', color: 'var(--text-primary)', fontWeight: 700 }}>
                  {sig.problem_topic}
                </h3>

                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <strong>Affected Sectors:</strong> {sig.affected_sectors.join(', ')}
                </div>

                <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-hairline)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', fontSize: 'var(--text-xs)', marginBottom: '12px' }}>
                  <strong style={{ color: 'var(--accent-blue)' }}>Key Unmet Mechanism:</strong> {sig.underlying_unmet_mechanism}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--accent-emerald)', fontWeight: 500 }}>
                  {sig.candidate_patent_matches_count} Applicable Open Patents
                </span>
                {onSeedProblem && (
                  <button
                    type="button"
                    onClick={() => onSeedProblem(sig)}
                    className="btn-primary"
                    style={{ fontSize: 'var(--text-xs)', padding: '5px 10px' }}
                  >
                    <span>Test Against Patents</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
