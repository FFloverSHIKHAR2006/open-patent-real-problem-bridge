import React, { useState } from 'react';
import { ShieldAlert, Sparkles, Lightbulb, Search, CheckCircle2, ArrowRight } from 'lucide-react';

const REVERSE_PRESETS = [
  {
    id: 'silo',
    title: 'Desiccant Grain Silo Sleeve',
    description:
      'A porous fabric sleeve filled with salt-doped bentonite clay hung inside grain storage silos to passively absorb water vapor and prevent fungal mold.',
    materials: 'bentonite clay, calcium chloride, canvas sleeve, nylon rope',
  },
  {
    id: 'peltier',
    title: 'Solar Peltier Cold-Box',
    description:
      'A small insulated thermoelectric container powered by a solar PV panel, utilizing paraffin wax phase-change material as a thermal battery during night or cloud cover.',
    materials: 'peltier module, paraffin wax, styrofoam box, solar panel, aluminum heat sink',
  },
  {
    id: 'acoustic',
    title: 'Piezo Ultrasonic Rodent Repeller',
    description:
      'A frequency-sweeping acoustic transducer driven by an ultra-low-power timer to repel rodents from granaries without chemical poisons.',
    materials: 'piezo buzzer, 555 timer IC, AA battery, plastic cone',
  },
];

export default function ReverseSearchForm({ onReverseSearch, loading, result }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [activePreset, setActivePreset] = useState(null);

  const handleSelectPreset = (p) => {
    setActivePreset(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setMaterials(p.materials);
  };

  const handleClear = () => {
    setActivePreset(null);
    setTitle('');
    setDescription('');
    setMaterials('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || loading) return;

    onReverseSearch({
      idea_title: title,
      description: description,
      materials: materials.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: 'var(--space-md)' }}>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Search size={18} color="var(--accent-blue)" />
          Reverse Prior-Art & Prototype Validator
        </h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Have an original hardware prototype or invention idea? Test it against public open patents to discover overlapping prior art, assess novelty, and receive technical improvement suggestions.
        </p>
      </div>

      {/* Preset Idea Chips */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Sample Prototype Ideas:</span>
        {REVERSE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelectPreset(p)}
            className={`preset-chip ${activePreset === p.id ? 'active' : ''}`}
          >
            {p.title}
          </button>
        ))}
        {(title || description || materials) && (
          <button
            type="button"
            onClick={handleClear}
            className="btn-ghost"
            style={{ padding: '4px 8px', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}
          >
            Clear
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: result ? 'var(--space-lg)' : 0 }}>
        <div className="input-group">
          <label className="input-label">Prototype / Idea Title</label>
          <input
            type="text"
            className="text-input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setActivePreset(null);
            }}
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
            onChange={(e) => {
              setDescription(e.target.value);
              setActivePreset(null);
            }}
            placeholder="Describe how your prototype operates, physical principles utilized, and key design elements..."
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Materials & Components (Comma-separated)</label>
          <input
            type="text"
            className="text-input"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            placeholder="e.g. Peltier module, paraffin wax, styrofoam"
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span>Analyzing Patent Overlaps...</span>
            ) : (
              <>
                <span>Validate Against Public Prior Art</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>

      {result && (
        <div className="animate-fade-in" style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: 'var(--space-md)' }}>
          <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>
            Prior-Art & Novelty Analysis Results
          </h3>

          {/* Overlaps */}
          <div
            style={{
              background: 'var(--accent-rose-subtle)',
              border: '1px solid var(--accent-rose-border)',
              borderLeft: '3px solid var(--accent-rose)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '12px',
            }}
          >
            <h4 style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-rose)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <ShieldAlert size={14} />
              Detected Prior-Art Overlaps & Patent Claims
            </h4>
            <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: '18px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {result.mechanism_overlaps.map((overlap, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{overlap}</li>
              ))}
            </ul>
          </div>

          {/* Novelty */}
          <div
            style={{
              background: 'var(--accent-emerald-subtle)',
              border: '1px solid var(--accent-emerald-border)',
              borderLeft: '3px solid var(--accent-emerald)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '12px',
            }}
          >
            <h4 style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-emerald)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <Sparkles size={14} />
              Identified Novel Aspects & Differentiators
            </h4>
            <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: '18px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {result.novel_aspects.map((novel, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{novel}</li>
              ))}
            </ul>
          </div>

          {/* Recommended Improvements */}
          <div
            style={{
              background: 'var(--accent-blue-subtle)',
              border: '1px solid var(--accent-blue-border)',
              borderLeft: '3px solid var(--accent-blue)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <h4 style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-blue)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <Lightbulb size={14} />
              Recommended Engineering & Mechanism Improvements
            </h4>
            <ul style={{ fontSize: 'var(--text-sm)', paddingLeft: '18px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {result.recommended_improvements.map((imp, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
