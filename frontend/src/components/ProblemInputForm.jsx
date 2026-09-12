import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CornerDownLeft,
  Sparkles,
  Layers,
  Wrench,
  DollarSign,
  RotateCcw
} from 'lucide-react';

const PRESETS = [
  {
    id: 'eldercare',
    label: 'Elder Care Telehealth',
    category: 'IoT / Healthcare',
    problem:
      'Sole earners living in different cities struggle to coordinate the daily care of aging parents who live elsewhere. Medical appointments, medicines, emergencies, home assistance, transportation, and updates are handled through fragmented phone calls, family members, and local services.',
    desiredOutcome:
      'Coordinate reliable remote elder care, medication, appointments, emergencies, and regular health/status updates from one system.',
    domain: 'Elder Care / Remote Telehealth',
    budget: 'low',
    materials: 'microcontroller, PIR sensor, reed switch, pill box',
    location: 'Urban / semi-urban',
    scale: 'Household',
    tooling: 'basic',
  },
  {
    id: 'grain',
    label: 'Desiccant Grain Silos',
    category: 'Post-Harvest Agri',
    problem:
      'We need a low-cost, food-safe moisture desiccant for bulk grain storage in high humidity without electrical grid power.',
    desiredOutcome: 'Prevent mold infestation and grain spoilage in humid climate.',
    domain: 'Post-Harvest Agriculture',
    budget: 'low',
    materials: 'silica gel, calcium chloride, canvas, bamboo',
    location: 'Off-grid humid rural storage',
    scale: 'Small farm (500kg grain)',
    tooling: 'basic',
  },
  {
    id: 'vaccine',
    label: 'Off-Grid Vaccine Chiller',
    category: 'Thermodynamics',
    problem:
      'Off-grid low-power cooling container for vaccine temperature maintenance in rural health clinics during power outages.',
    desiredOutcome: 'Maintain temperature strictly between 2°C and 8°C during 6-hour power outages.',
    domain: 'Thermal Management / Healthcare',
    budget: 'medium',
    materials: 'peltier module, paraffin wax, polyurethane foam, aluminum plate',
    location: 'Off-grid rural clinic',
    scale: 'Clinic level (10 liters)',
    tooling: 'basic',
  },
  {
    id: 'desal',
    label: 'Passive Solar Still',
    category: 'Clean Water',
    problem:
      'Coastal artisanal communities lack reliable electricity and drinkable water, requiring affordable passive solar evaporation without costly membrane replacements.',
    desiredOutcome: 'Produce 5L/day potable freshwater from seawater using ambient sunlight.',
    domain: 'Water Treatment / Renewable',
    budget: 'low',
    materials: 'black acrylic, tempered glass, wick fabric, PVC pipe',
    location: 'Coastal tropical island',
    scale: 'Household (5L/day)',
    tooling: 'basic',
  },
  {
    id: 'cache',
    label: 'Distributed Cache Invalidation',
    category: 'Distributed Systems',
    problem:
      'High traffic microservices experience database bottlenecks and stale reads because distributed in-memory cache nodes become desynchronized during rapid data updates.',
    desiredOutcome: 'Eliminate stale reads and prevent database stampedes under 50,000 req/sec while bounding key remapping.',
    domain: 'Distributed Systems / In-Memory Caching',
    budget: 'medium',
    materials: 'Redis cluster, consistent hash ring, pub-sub invalidation bus',
    location: 'Cloud multi-region',
    scale: 'Enterprise production (50k req/s)',
    tooling: 'container runtime',
  },
  {
    id: 'circuit',
    label: 'Resilient Microservice Gateway',
    category: 'Software Architecture',
    problem:
      'Downstream services suffer cascading timeouts and thread starvation when third-party APIs fail or traffic spikes exceed capacity, bringing down the entire user application.',
    desiredOutcome: 'Prevent cascading outages with sub-millisecond circuit breaking and atomic token-bucket rate limiting.',
    domain: 'Software Architecture / API Gateways',
    budget: 'low',
    materials: 'Envoy proxy, Redis Lua token bucket, sliding-window circuit breaker',
    location: 'Edge proxy / Kubernetes',
    scale: 'Production API cluster',
    tooling: 'standard devops',
  },
];

export default function ProblemInputForm({ onSearch, loading, seededData }) {
  const [activePreset, setActivePreset] = useState(null);
  const [problem, setProblem] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [domain, setDomain] = useState('');

  // Collapsible Constraints state
  const [showConstraints, setShowConstraints] = useState(false);
  const [budget, setBudget] = useState('low');
  const [materials, setMaterials] = useState('');
  const [location, setLocation] = useState('');
  const [scale, setScale] = useState('');
  const [tooling, setTooling] = useState('basic');

  // Handle external seeding (e.g. from Demand Signal Board)
  useEffect(() => {
    if (seededData) {
      if (seededData.problem) setProblem(seededData.problem);
      if (seededData.desiredOutcome) setDesiredOutcome(seededData.desiredOutcome);
      if (seededData.domain) setDomain(seededData.domain);
      setActivePreset(null);
    }
  }, [seededData]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!problem.trim() || loading) return;

    onSearch({
      problem: problem.trim(),
      desired_outcome: desiredOutcome.trim(),
      domain: domain.trim(),
      constraints: {
        budget,
        materials: materials.split(',').map((s) => s.trim()).filter(Boolean),
        location,
        scale,
        manufacturing_capability: tooling,
      },
    });
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSelectPreset = (p) => {
    setActivePreset(p.id);
    setProblem(p.problem);
    setDesiredOutcome(p.desiredOutcome);
    setDomain(p.domain);
    setBudget(p.budget);
    setMaterials(p.materials);
    setLocation(p.location);
    setScale(p.scale);
    setTooling(p.tooling);
  };

  const handleClear = () => {
    setActivePreset(null);
    setProblem('');
    setDesiredOutcome('');
    setDomain('');
    setMaterials('');
    setLocation('');
    setScale('');
    setBudget('low');
    setTooling('basic');
  };

  return (
    <div className="glass-panel" style={{ padding: 'var(--space-md)' }}>
      {/* Presets Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <Sparkles size={14} color="var(--accent-blue)" />
          <span>Curated Problem Scenarios:</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className={`preset-chip ${activePreset === p.id ? 'active' : ''}`}
            >
              <span>{p.label}</span>
              <span style={{ fontSize: '0.68rem', opacity: 0.75 }}>({p.category})</span>
            </button>
          ))}
          {(problem || desiredOutcome) && (
            <button
              type="button"
              onClick={handleClear}
              className="btn-ghost"
              style={{ padding: '4px 8px', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              title="Clear input fields for a custom problem"
            >
              <RotateCcw size={11} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Real-world operational problem */}
        <div className="input-group">
          <div className="input-label">
            <span>Operational Problem Description</span>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', textTransform: 'none', fontWeight: 400 }}>
              Press Ctrl+Enter to run search
            </span>
          </div>
          <textarea
            className="textarea-input"
            rows="3"
            value={problem}
            onChange={(e) => {
              setProblem(e.target.value);
              setActivePreset(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe the operational challenge, physical context, failure modes, and what fails today..."
            required
          />
        </div>

        {/* Step 2: Desired Outcome & Domain */}
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">Desired Outcome (Optional)</label>
            <input
              type="text"
              className="text-input"
              value={desiredOutcome}
              onChange={(e) => setDesiredOutcome(e.target.value)}
              placeholder="e.g. Prevent mold, maintain 4°C, receive daily status..."
            />
          </div>
          <div className="input-group">
            <label className="input-label">Domain / Operational Sector (Optional)</label>
            <input
              type="text"
              className="text-input"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. Elder Care, Agriculture, Energy, Water..."
            />
          </div>
        </div>

        {/* Progressive Disclosure: Collapsible Constraints Drawer */}
        <div style={{ margin: 'var(--space-xs) 0 var(--space-md) 0' }}>
          <button
            type="button"
            className="btn-ghost"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: showConstraints ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
              border: '1px solid var(--border-hairline)',
              width: '100%',
              justifyContent: 'space-between'
            }}
            onClick={() => setShowConstraints(!showConstraints)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={14} color="var(--accent-blue)" />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }}>
                Operational & Fabrication Constraints
              </span>
              <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-2xs)' }}>
                ({budget === 'low' ? '< $50' : budget}{scale ? `, ${scale}` : ''}, {tooling} tools)
              </span>
            </div>
            {showConstraints ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {showConstraints && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                marginTop: '8px',
                padding: 'var(--space-md)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-hairline)',
              }}
            >
              <div className="grid-2" style={{ marginBottom: 'var(--space-sm)' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Target Budget Envelope</label>
                  <select className="select-input" value={budget} onChange={(e) => setBudget(e.target.value)}>
                    <option value="low">Low Cost (&lt; $50)</option>
                    <option value="medium">Moderate (&lt; $250)</option>
                    <option value="commercial">Commercial (&lt; $1,000)</option>
                  </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Deployment Scale</label>
                  <input
                    type="text"
                    className="text-input"
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    placeholder="e.g. Household, Community, Small Farm"
                  />
                </div>
              </div>

              <div className="grid-3">
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Locally Available Materials</label>
                  <input
                    type="text"
                    className="text-input"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="e.g. sensors, wood, canvas, bamboo..."
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Operating Environment</label>
                  <input
                    type="text"
                    className="text-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Urban, rural off-grid..."
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Tooling & Fabrication Capability</label>
                  <select className="select-input" value={tooling} onChange={(e) => setTooling(e.target.value)}>
                    <option value="basic">Basic Hand Tools</option>
                    <option value="3d-print">3D Printing / FabLab</option>
                    <option value="machine-shop">Full Machine Shop</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Footer Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Retrieves authentic patents & papers • Zero hallucinated citations
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>Searching Mechanisms...</>
            ) : (
              <>
                <span>Match Mechanisms & Formulate Solution</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
