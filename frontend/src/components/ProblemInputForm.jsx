import React, { useState } from 'react';

export default function ProblemInputForm({ onSearch, loading }) {
  const [problem, setProblem] = useState(
    'Sole earners living in different cities struggle to coordinate the daily care of aging parents who live elsewhere. Medical appointments, medicines, emergencies, home assistance, transportation, and updates are handled through fragmented phone calls, family members, and local services.'
  );
  const [desiredOutcome, setDesiredOutcome] = useState(
    'Coordinate reliable remote elder care, medication, appointments, emergencies, and regular health/status updates from one system.'
  );
  const [domain, setDomain] = useState('Elder Care / Remote Telehealth');
  
  // Collapsible Constraints state
  const [showConstraints, setShowConstraints] = useState(false);
  const [budget, setBudget] = useState('low');
  const [materials, setMaterials] = useState('microcontroller, PIR sensor, reed switch, pill box');
  const [location, setLocation] = useState('Urban / semi-urban');
  const [scale, setScale] = useState('Household');
  const [tooling, setTooling] = useState('basic');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!problem.trim()) return;

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

  const handleSample = (preset) => {
    if (preset === 'eldercare') {
      setProblem(
        'Sole earners living in different cities struggle to coordinate the daily care of aging parents who live elsewhere. Medical appointments, medicines, emergencies, home assistance, transportation, and updates are handled through fragmented phone calls, family members, and local services.'
      );
      setDesiredOutcome('Coordinate reliable remote elder care, medication, appointments, emergencies, and regular health/status updates from one system.');
      setDomain('Elder Care / Remote Telehealth');
      setBudget('low');
      setMaterials('microcontroller, PIR sensor, reed switch, pill box');
      setLocation('Urban / semi-urban');
      setScale('Household');
      setTooling('basic');
    } else if (preset === 'grain') {
      setProblem('We need a low-cost, food-safe moisture desiccant for bulk grain storage in high humidity without electrical grid power.');
      setDesiredOutcome('Prevent mold infestation and grain spoilage in humid climate.');
      setDomain('Post-Harvest Agriculture');
      setBudget('low');
      setMaterials('silica gel, calcium chloride, canvas, bamboo');
      setLocation('Off-grid humid rural storage');
      setScale('Small farm (500kg grain)');
      setTooling('basic');
    } else if (preset === 'vaccine') {
      setProblem('Off-grid low-power cooling container for vaccine temperature maintenance in rural health clinics.');
      setDesiredOutcome('Maintain temperature strictly between 2°C and 8°C during 6-hour power outages.');
      setDomain('Thermal Management / Healthcare');
      setBudget('medium');
      setMaterials('peltier module, paraffin wax, polyurethane foam, aluminum plate');
      setLocation('Off-grid rural clinic');
      setScale('Clinic level (10 liters)');
      setTooling('basic');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Example Problems Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Start with an example or describe your operational problem:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleSample('eldercare')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '5px 10px' }}
          >
            👵 Elder Care Coordination
          </button>
          <button
            type="button"
            onClick={() => handleSample('grain')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '5px 10px' }}
          >
            🌾 Grain Storage
          </button>
          <button
            type="button"
            onClick={() => handleSample('vaccine')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '5px 10px' }}
          >
            ❄️ Vaccine Cooling
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Real-world operational problem */}
        <div className="input-group">
          <label className="input-label">Describe the Operational Problem</label>
          <textarea
            className="textarea-input"
            rows="3"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe the operational challenge, physical constraints, and what fails today..."
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
            <label className="input-label">Domain / Context (Optional)</label>
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
        <div style={{ margin: '12px 0 20px 0' }}>
          <button
            type="button"
            className="btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            onClick={() => setShowConstraints(!showConstraints)}
          >
            <span>{showConstraints ? '▼' : '▶'}</span>
            <strong>Operational Constraints</strong>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
              ({budget === 'low' ? '< $50' : budget}, {scale}, {tooling} tools)
            </span>
          </button>

          {showConstraints && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                marginTop: '12px',
                padding: '16px',
                background: 'rgba(10, 14, 23, 0.5)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="grid-2" style={{ marginBottom: '12px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Target Budget</label>
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
                    placeholder="e.g. sensors, wood, canvas..."
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Environment / Location</label>
                  <input
                    type="text"
                    className="text-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Urban, rural off-grid..."
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Available Tools & Skill</label>
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

        {/* Primary CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Retrieves authentic patents and research papers • Zero hallucinated citations
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching Mechanisms & Evidence...' : 'Find Solutions'}
          </button>
        </div>
      </form>
    </div>
  );
}
