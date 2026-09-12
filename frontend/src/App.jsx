import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShieldCheck,
  GitFork,
  BarChart3,
  Code2,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock,
  Cpu
} from 'lucide-react';
import ProblemInputForm from './components/ProblemInputForm';
import SolutionResultView from './components/SolutionResultView';
import EvidenceGraphViewer from './components/EvidenceGraphViewer';
import ReverseSearchForm from './components/ReverseSearchForm';
import DemandSignalBoard from './components/DemandSignalBoard';
import ApiExplorer from './components/ApiExplorer';
import { API_BASE } from './config';

const PROGRESS_STAGES = [
  'Understanding problem & operational context...',
  'Extracting underlying physical & computational mechanisms...',
  'Searching verified scientific research & papers...',
  'Searching authentic public patent disclosures...',
  'Evaluating evidence & constraint compatibility...',
  'Assembling actionable prototype architecture...',
];

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [searchResponse, setSearchResponse] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [seededQuery, setSeededQuery] = useState(null);

  // Reverse search state
  const [reverseLoading, setReverseLoading] = useState(false);
  const [reverseResult, setReverseResult] = useState(null);

  const formRef = useRef(null);

  // Animate progress steps during search
  useEffect(() => {
    let interval = null;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < PROGRESS_STAGES.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 750);
    } else {
      setLoadingStep(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const handleSearch = async (inputData) => {
    setLoading(true);
    setSearchError(null);
    setSearchResponse(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch(`${API_BASE}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned ${res.status}`);
      }
      const data = await res.json();
      data.problem_input = inputData;
      setSearchResponse(data);
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Search error:', err);
      if (err.name === 'AbortError') {
        setSearchError('Search request timed out after 25s. The backend took too long to respond.');
      } else {
        setSearchError(err.message || 'Failed to connect to search engine backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReverseSearch = async (inputData) => {
    setReverseLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/prior-art`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setReverseResult(data);
    } catch (err) {
      console.error('Reverse search error:', err);
      alert('Failed to analyze prior art.');
    } finally {
      setReverseLoading(false);
    }
  };

  const handleModifyConstraints = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSeedFromDemand = (demand) => {
    setSeededQuery({
      problem: demand.problem_topic + ': ' + demand.underlying_unmet_mechanism,
      desiredOutcome: 'Overcome ' + demand.underlying_unmet_mechanism + ' for ' + demand.affected_sectors.join(', '),
      domain: demand.affected_sectors[0] || 'General Engineering',
    });
    setActiveTab('search');
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="app-container">
      {/* FSLAB Enterprise Header */}
      <header className="header-bar">
        <div className="brand-logo">
          <div className="brand-icon-wrap">
            <span>F</span>
          </div>
          <div>
            <div className="brand-title">
              BRIDGE<span style={{ color: 'var(--accent-blue)' }}>.LAB</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-blue)', background: 'var(--accent-blue-subtle)', border: '1px solid var(--accent-blue-border)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>
                AI GOVERNANCE
              </span>
            </div>
            <div className="brand-subtitle">AI Intelligence & Public Patent Verification Engine</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="header-status">
            <span className="status-dot"></span>
            <span>Zero Hallucinations Verified</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ padding: '7px 14px', fontSize: 'var(--text-xs)' }}
            onClick={() => setActiveTab('api')}
          >
            API Access
          </button>
        </div>
      </header>

      {/* FSLAB Dark Contrast Ticker Strip */}
      <div className="contrast-ticker">
        <div className="ticker-item">
          <span className="ticker-badge">PROVENANCE</span>
          <span>Every recommendation grounded in <strong>USPTO, NASA & Google Patents</strong></span>
        </div>
        <div className="ticker-item">
          <Database size={14} color="#60a5fa" />
          <span>Mechanistic Matching: <strong>Physical & Chemical Invariants</strong></span>
        </div>
        <div className="ticker-item">
          <Lock size={14} color="#34d399" />
          <span>Enterprise Compliance: <strong>Prior-Art Risk & Freedom-to-Operate</strong></span>
        </div>
      </div>

      {/* Navigation Segmented Control */}
      <nav className="nav-tabs" aria-label="Main Navigation">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Search size={15} />
          Problem Bridge
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'reverse' ? 'active' : ''}`}
          onClick={() => setActiveTab('reverse')}
        >
          <ShieldCheck size={15} />
          Prior-Art Validator
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
          onClick={() => setActiveTab('evidence')}
        >
          <GitFork size={15} />
          Provenance Graph
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'demand' ? 'active' : ''}`}
          onClick={() => setActiveTab('demand')}
        >
          <BarChart3 size={15} />
          Demand Signals
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          <Code2 size={15} />
          API Explorer
        </button>
      </nav>

      {/* Tab 1: Problem Bridge Search */}
      {activeTab === 'search' && (
        <div>
          <div ref={formRef}>
            <ProblemInputForm
              onSearch={handleSearch}
              loading={loading}
              seededData={seededQuery}
            />
          </div>

          {/* Loading Progress State */}
          {loading && (
            <div className="glass-panel progress-container animate-fade-in">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '4px' }}>
                <RefreshCw size={16} className="animate-spin" />
                {PROGRESS_STAGES[loadingStep]}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Stage {loadingStep + 1} of {PROGRESS_STAGES.length} • Grounding against verified patent disclosures
              </div>

              <div className="progress-steps">
                {PROGRESS_STAGES.map((step, idx) => {
                  const isDone = idx < loadingStep;
                  const isCurrent = idx === loadingStep;
                  return (
                    <div key={idx} className="progress-step-item">
                      <div className={`progress-step-circle ${isDone ? 'completed' : isCurrent ? 'active' : ''}`}>
                        {isDone ? <CheckCircle2 size={14} /> : idx + 1}
                      </div>
                      <div className="progress-step-label">
                        {idx === 0 && 'Problem'}
                        {idx === 1 && 'Mechanisms'}
                        {idx === 2 && 'Research'}
                        {idx === 3 && 'Patents'}
                        {idx === 4 && 'Evidence'}
                        {idx === 5 && 'Solution'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Message */}
          {searchError && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                marginTop: '16px',
                padding: '14px 18px',
                borderLeft: '4px solid var(--accent-rose)',
                background: 'var(--accent-rose-subtle)',
                color: '#9f1239',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: 'var(--text-sm)'
              }}
            >
              <AlertCircle size={18} color="var(--accent-rose)" />
              <div>
                <strong>Error: </strong> {searchError}
              </div>
            </div>
          )}

          {/* Solution Result View */}
          {searchResponse && !loading && (
            <SolutionResultView
              data={searchResponse}
              onModifyConstraints={handleModifyConstraints}
            />
          )}
        </div>
      )}

      {/* Tab 2: Reverse Prior-Art Validator */}
      {activeTab === 'reverse' && (
        <ReverseSearchForm
          onReverseSearch={handleReverseSearch}
          loading={reverseLoading}
          result={reverseResult}
        />
      )}

      {/* Tab 3: Evidence Graph Viewer */}
      {activeTab === 'evidence' && (
        <EvidenceGraphViewer
          evidenceGraph={searchResponse ? searchResponse.evidence_graph : []}
          problemText={searchResponse ? searchResponse.problem_analysis.problem_raw : 'No active query'}
        />
      )}

      {/* Tab 4: Demand Signals */}
      {activeTab === 'demand' && (
        <DemandSignalBoard onSeedProblem={handleSeedFromDemand} />
      )}

      {/* Tab 5: API Explorer */}
      {activeTab === 'api' && <ApiExplorer />}
    </div>
  );
}
