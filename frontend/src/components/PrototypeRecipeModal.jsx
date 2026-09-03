import React from 'react';

export default function PrototypeRecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(recipe, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.recipe_id}_prototype_recipe.json`;
    a.click();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(3, 17, 30, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '30px',
          border: '1px solid var(--accent-cyan)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <span className="patent-badge" style={{ marginBottom: '6px', display: 'inline-block' }}>
              {recipe.recipe_id}
            </span>
            <h2 style={{ fontSize: '1.4rem' }}>{recipe.title}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Addressing: "{recipe.problem_addressed}"
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.6rem',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Real-World Impact Statement Banner */}
        <div
          style={{
            background: 'linear-gradient(90deg, hsla(152, 76%, 48%, 0.15), hsla(187, 85%, 53%, 0.15))',
            borderLeft: '4px solid var(--accent-emerald)',
            padding: '14px',
            borderRadius: '6px',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
            🌍 Real-World Impact Statement:
          </div>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', marginTop: '4px' }}>
            {recipe.real_world_impact_statement}
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '20px' }}>
          <div style={{ background: 'hsla(222, 47%, 9%, 0.6)', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Underlying Patent Mechanism
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{recipe.underlying_mechanism}</p>
          </div>
          <div style={{ background: 'hsla(222, 47%, 9%, 0.6)', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Source Patent / Technical Disclosures
            </h4>
            <ul style={{ fontSize: '0.85rem', paddingLeft: '16px', color: 'var(--text-main)' }}>
              {recipe.source_technologies.map((src, idx) => (
                <li key={idx}>{src}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bill of Materials Table */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--text-main)' }}>
            📦 Bill of Materials (BOM) & Local Substitutions
          </h3>
          <table className="bom-table">
            <thead>
              <tr>
                <th>Component / Material</th>
                <th>Purpose</th>
                <th>Est. Cost</th>
                <th>Local Field Alternative</th>
              </tr>
            </thead>
            <tbody>
              {recipe.bill_of_materials.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{item.item}</td>
                  <td>{item.purpose}</td>
                  <td>{item.estimated_cost}</td>
                  <td style={{ color: 'var(--accent-emerald)' }}>{item.local_alternative}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Step by step build guide */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--text-main)' }}>
            🛠️ Plain-Language Step-by-Step Prototype Recipe
          </h3>
          <ol className="steps-list">
            {recipe.step_by_step_instructions.map((step, idx) => (
              <li key={idx}>
                <strong>Step {idx + 1}:</strong> {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Constraint Adaptations & Risks */}
        <div className="grid-2" style={{ marginBottom: '24px' }}>
          <div style={{ background: 'hsla(38, 92%, 50%, 0.1)', border: '1px solid hsla(38, 92%, 50%, 0.3)', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', marginBottom: '8px', textTransform: 'uppercase' }}>
              ⚠️ Technical Risks & Field Warnings
            </h4>
            <ul style={{ fontSize: '0.82rem', paddingLeft: '16px', color: 'var(--text-main)' }}>
              {recipe.risk_factors.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'hsla(187, 85%, 53%, 0.1)', border: '1px solid hsla(187, 85%, 53%, 0.3)', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '8px', textTransform: 'uppercase' }}>
              ⚙️ Applied Constraint Adaptations
            </h4>
            <ul style={{ fontSize: '0.82rem', paddingLeft: '16px', color: 'var(--text-main)' }}>
              {recipe.constraint_adaptations.map((adapt, idx) => (
                <li key={idx}>{adapt}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Evidence Provenance Footer */}
        {recipe.evidence_provenance && recipe.evidence_provenance.length > 0 && (
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '10px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', marginBottom: '8px', textTransform: 'uppercase' }}>
              📜 Verified Evidence Provenance Track
            </h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong>Patent Claim Quote:</strong> "{recipe.evidence_provenance[0].claim_or_finding}"
              <br />
              <span style={{ color: 'var(--accent-cyan)' }}>
                Source: {recipe.evidence_provenance[0].source} ({recipe.evidence_provenance[0].patent_or_paper_id}), Section: {recipe.evidence_provenance[0].section}
              </span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Feasibility Score: <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{recipe.feasibility_score}/100</span> | Confidence: <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{Math.round(recipe.confidence_score * 100)}%</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={handleExportJSON} className="btn-secondary">
              📥 Export JSON
            </button>
            <button type="button" onClick={handlePrint} className="btn-primary">
              🖨️ Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
