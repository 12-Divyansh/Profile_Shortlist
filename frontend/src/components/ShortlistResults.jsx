import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, AlertCircle, Save, MessageSquare } from 'lucide-react';
import { api } from '../utils/api';

const ShortlistResults = ({ candidates, isAiMode, jobSkills, onSave }) => {
  const [questionsMap, setQuestionsMap] = useState({});
  const [loadingQuestions, setLoadingQuestions] = useState(null);

  if (!candidates || candidates.length === 0) {
    return <div className="card"><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}><AlertCircle size={18} /> No matching candidates found.</div></div>;
  }

  // Take top 5 for the chart
  const chartData = candidates.slice(0, 5).map(c => ({
    name: c.name.split(' ')[0],
    score: c.matchScore
  }));

  const handleGenerateQuestions = async (candidateId, candidateSkills) => {
    setLoadingQuestions(candidateId);
    try {
      const data = await api.generateInterviewQuestions(candidateSkills, jobSkills);
      setQuestionsMap(prev => ({ ...prev, [candidateId]: data }));
    } catch (err) {
      alert('Failed to generate interview questions.');
    }
    setLoadingQuestions(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn" onClick={onSave} style={{ backgroundColor: 'var(--success)' }}>
          <Save size={18} /> Save Shortlist
        </button>
      </div>

      <div className="chart-container">
        <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Top Candidates Match Score</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
            <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#8b5cf6' : '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="candidate-grid" style={{ marginTop: 0 }}>
        {candidates.map((candidate, idx) => (
          <div key={candidate._id || idx} className="candidate-card" style={{ borderColor: idx === 0 && isAiMode ? '#c084fc' : '' }}>
            
            {idx === 0 && isAiMode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontWeight: 'bold', fontSize: '0.875rem' }}>
                <Sparkles size={16} /> Top AI Pick
              </div>
            )}
            
            <div className="candidate-header">
              <div>
                <div className="candidate-name">{candidate.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Exp: {candidate.experience} Yrs</div>
              </div>
              <div className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontSize: '1rem' }}>
                {candidate.matchScore}% Match
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Matched Skills</div>
              <div className="skills-list">
                {candidate.matchedSkills && candidate.matchedSkills.length > 0 ? (
                   candidate.matchedSkills.map((skill, i) => (
                    <span key={i} className="skill-tag matched">{skill}</span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>None</span>
                )}
              </div>
            </div>
            
            {isAiMode && candidate.aiExplanation && (
              <div className="ai-explanation">
                <strong>AI Analysis:</strong> {candidate.aiExplanation}
                
                <div style={{ marginTop: '1rem' }}>
                  {questionsMap[candidate._id] ? (
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '0.5rem' }}>Recommended Interview Questions:</strong>
                      <ol style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem' }}>
                        {Array.isArray(questionsMap[candidate._id]) && questionsMap[candidate._id].map((q, i) => (
                          <li key={i} style={{ marginBottom: '0.5rem' }}>
                            {q.question}
                            <br/>
                            <span style={{ color: 'var(--success)' }}>Expects: {q.expectedAnswer}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', width: '100%' }}
                      onClick={() => handleGenerateQuestions(candidate._id, candidate.skills)}
                      disabled={loadingQuestions === candidate._id}
                    >
                      <MessageSquare size={14} /> 
                      {loadingQuestions === candidate._id ? 'Generating...' : 'Generate Interview Questions'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortlistResults;
