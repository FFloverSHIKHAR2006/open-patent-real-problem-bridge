import React, { useEffect } from 'react';
import { X, Printer, Download, AlertTriangle, CheckCircle2, Wrench, Sparkles, ShieldCheck } from 'lucide-react';

export default function PrototypeRecipeModal({ recipe, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          maxWidth: '860px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 'var(--space-lg)',
          border: '1px solid var(--border-hairline)',
          background: '#FFFFFF',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          borderRadius: 'var(--radius-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
          <div>
            <span className="badge-patent" style={{ marginBottom: '6px' }}>
              {recipe.recipe_id}
            </span>
            <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginTop: '2px' }}>{recipe.title}</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Target Need: "{recipe.problem_addressed}"
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Real-World Impact Statement Banner */}
        <div
          style={{
            background: 'var(--accent-emerald-subtle)',
            border: '1px solid var(--accent-emerald-border)',
            borderLeft: '3px solid var(--accent-emerald)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-md)',
          }}
        >
          <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={12} />
            Real-World Impact Statement
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
            {recipe.real_world_impact_statement}
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-hairline)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-blue)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              Underlying Patent Mechanism
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', lineHeight: 1.5 }}>{recipe.underlying_mechanism}</p>
          </div>
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-hairline)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-purple)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              Source Patent / Technical Disclosures
            </h4>
            <ul style={{ fontSize: 'var(--text-xs)', paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {recipe.source_technologies.map((src, idx) => (
                <li key={idx}>{src}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bill of Materials Table */}
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: 'var(--text-md)', marginBottom: '8px', color: 'var(--text-primary)' }}>
            Bill of Materials (BOM) & Local Substitutions
          </h3>
          <div style={{ overflowX: 'auto', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border-hairline)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '8px 12px' }}>Component / Material</th>
                  <th style={{ padding: '8px 12px' }}>Purpose</th>
                  <th style={{ padding: '8px 12px' }}>Est. Cost</th>
                  <th style={{ padding: '8px 12px' }}>Local Field Alternative</th>
                </tr>
              </thead>
              <tbody>
                {recipe.bill_of_materials.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--accent-blue)' }}>{item.item}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-primary)' }}>{item.purpose}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{item.estimated_cost}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--accent-emerald)', fontWeight: 500 }}>{item.local_alternative}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step by step build guide */}
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: 'var(--text-md)', marginBottom: '8px', color: 'var(--text-primary)' }}>
            Plain-Language Step-by-Step Prototype Recipe
          </h3>
          <ol style={{ paddingLeft: '18px', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {recipe.step_by_step_instructions.map((step, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>
                <strong>Step {idx + 1}:</strong> {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Constraint Adaptations & Risks */}
        <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{ background: 'var(--accent-amber-subtle)', border: '1px solid var(--accent-amber-border)', borderLeft: '3px solid var(--accent-amber)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-amber)', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <AlertTriangle size={13} />
              Technical Risks & Field Warnings
            </h4>
            <ul style={{ fontSize: 'var(--text-xs)', paddingLeft: '16px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {recipe.risk_factors.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'var(--accent-blue-subtle)', border: '1px solid var(--accent-blue-border)', borderLeft: '3px solid var(--accent-blue)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-blue)', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <Wrench size={13} />
              Applied Constraint Adaptations
            </h4>
            <ul style={{ fontSize: 'var(--text-xs)', paddingLeft: '16px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {recipe.constraint_adaptations.map((adapt, idx) => (
                <li key={idx}>{adapt}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-hairline)', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            Feasibility: <strong style={{ color: 'var(--accent-emerald)' }}>{recipe.feasibility_score}/100</strong> • Confidence: <strong style={{ color: 'var(--accent-blue)' }}>{Math.round(recipe.confidence_score * 100)}%</strong>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={handleExportJSON} className="btn-secondary">
              <Download size={13} />
              Export JSON
            </button>
            <button type="button" onClick={handlePrint} className="btn-primary">
              <Printer size={13} />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
