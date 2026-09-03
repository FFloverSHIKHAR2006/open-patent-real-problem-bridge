import React, { useState, useEffect, useRef } from 'react';
import ProblemInputForm from './components/ProblemInputForm';
import SolutionResultView from './components/SolutionResultView';
import EvidenceGraphViewer from './components/EvidenceGraphViewer';
import ReverseSearchForm from './components/ReverseSearchForm';
import DemandSignalBoard from './components/DemandSignalBoard';
import ApiExplorer from './components/ApiExplorer';
import { API_ENDPOINTS } from './config/api';

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

    try {
      const res = await fetch(API_ENDPOINTS.search, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned ${res.status}`);
      }
      const data = await res.json();
      data.problem_input = inputData;
      setSearchResponse(data);
    } catch (err) {
      console.error('Search error:', err);
      setSearchError(err.message || 'Failed to connect to search engine backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleReverseSearch = async (inputData) => {
    setReverseLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.priorArt, {
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

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="glass-panel header-bar">
        <div className="brand-logo">
          <div className="brand-icon">⚡</div>
          <div>
            <div className="brand-title">Open-Patent to Real Problem Bridge</div>
            <div className="brand-subtitle">An Open Innovation Matching & Technical Translation Engine</div>
          </div>
        </div>
        <div className="category-badge">Open Innovation / AI Research</div>
      </header>

      {/* Navigation Tab Bar */}
      <nav className="nav-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          🚀 Problem Bridge Search
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'reverse' ? 'active' : ''}`}
          onClick={() => setActiveTab('reverse')}
        >
          🔍 Reverse Prior-Art Validator
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
          onClick={() => setActiveTab('evidence')}
        >
          🕸️ Evidence Provenance Graph
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'demand' ? 'active' : ''}`}
          onClick={() => setActiveTab('demand')}
        >
          📊 Demand Signals
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          ⚡ API Explorer
        </button>
      </nav>

      {/* Tab 1: Problem Bridge Search */}
      {activeTab === 'search' && (
        <div>
          <div ref={formRef}>
            <ProblemInputForm onSearch={handleSearch} loading={loading} />
          </div>

          {/* Loading Progress State */}
          {loading && (
            <div className="glass-panel progress-container animate-fade-in">
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-cyan-light)', marginBottom: '8px' }}>
                {PROGRESS_STAGES[loadingStep]}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Step {loadingStep + 1} of {PROGRESS_STAGES.length} • Grounding against verified patent disclosures
              </div>

              <div className="progress-steps">
                {PROGRESS_STAGES.map((step, idx) => {
                  const isDone = idx < loadingStep;
                  const isCurrent = idx === loadingStep;
                  return (
                    <div key={idx} className="progress-step-item">
                      <div className={`progress-step-circle ${isDone ? 'completed' : isCurrent ? 'active' : ''}`}>
                        {isDone ? '✓' : idx + 1}
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
                marginTop: '20px',
                padding: '16px 20px',
                borderLeft: '4px solid var(--accent-rose)',
                background: 'rgba(244, 63, 94, 0.1)',
                color: '#fecdd3',
              }}
            >
              <strong>Error: </strong> {searchError}
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
      {activeTab === 'demand' && <DemandSignalBoard />}

      {/* Tab 5: API Explorer */}
      {activeTab === 'api' && <ApiExplorer />}
    </div>
  );
}
