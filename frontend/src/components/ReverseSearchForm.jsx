import React, { useState } from 'react';

export default function ReverseSearchForm({ onReverseSearch, loading, result }) {
  const [title, setTitle] = useState('Desiccant Grain Silo Sleeve');
  const [description, setDescription] = useState(
    'A porous fabric sleeve filled with salt-doped bentonite clay hung inside grain storage silos to passively absorb water vapor and prevent fungal mold.'
  );
  const [materials, setMaterials] = useState('bentonite clay, calcium chloride, canvas sleeve, nylon rope');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    onReverseSearch({
      idea_title: title,
      description: description,
      materials: materials.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem' }}>🔍 Reverse Prior-Art & Prototype Validator</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Have an original hardware prototype or invention idea? Check it against public open patents to discover overlapping prior art, assess novelty, and receive technical improvement suggestions.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '28px' }}>
        <div className="input-group">
          <label className="input-label">Prototype / Idea Title</label>
          <input
            type="text"
            className="text-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Solar Peltier Vaccine Chiller"
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Detailed Prototype & Mechanism Description</label>
          <textarea
            className="textarea-input"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe how your prototype works, materials used, and key components..."
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Materials Used (Comma separated)</label>
          <input
            type="text"
            className="text-input"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            placeholder="e.g. Peltier module, paraffin wax, styrofoam"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? '🔍 Analyzing Prior Art & Novelty...' : '🔍 Validate Prototype Against Prior Art'}
        </button>
      </form>

      {result && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--accent-cyan)' }}>
            📊 Prior-Art & Novelty Analysis Results
          </h3>

          {/* Overlaps */}
          <div style={{ background: 'hsla(350, 89%, 60%, 0.1)', borderLeft: '4px solid var(--accent-rose)', padding: '14px', borderRadius: '6px', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-rose)', marginBottom: '6px', textTransform: 'uppercase' }}>
              ⚠️ Detected Prior-Art Overlaps & Patent Claims
            </h4>
            <ul style={{ fontSize: '0.85rem', paddingLeft: '16px', color: 'var(--text-main)' }}>
              {result.mechanism_overlaps.map((overlap, idx) => (
                <li key={idx}>{overlap}</li>
              ))}
            </ul>
          </div>

          {/* Novelty */}
          <div style={{ background: 'hsla(152, 76%, 48%, 0.1)', borderLeft: '4px solid var(--accent-emerald)', padding: '14px', borderRadius: '6px', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', marginBottom: '6px', textTransform: 'uppercase' }}>
              ✨ Identified Novel Aspects & Innovations
            </h4>
            <ul style={{ fontSize: '0.85rem', paddingLeft: '16px', color: 'var(--text-main)' }}>
              {result.novel_aspects.map((novel, idx) => (
                <li key={idx}>{novel}</li>
              ))}
            </ul>
          </div>

          {/* Recommended Improvements */}
          <div style={{ background: 'hsla(187, 85%, 53%, 0.1)', borderLeft: '4px solid var(--accent-cyan)', padding: '14px', borderRadius: '6px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '6px', textTransform: 'uppercase' }}>
              💡 Recommended Engineering Improvements
            </h4>
            <ul style={{ fontSize: '0.85rem', paddingLeft: '16px', color: 'var(--text-main)' }}>
              {result.recommended_improvements.map((imp, idx) => (
                <li key={idx}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
