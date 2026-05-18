import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, AlertCircle } from 'lucide-react';

const ShortlistResults = ({ candidates, isAiMode }) => {
  if (!candidates || candidates.length === 0) {
    return <div className="card"><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}><AlertCircle size={18} /> No matching candidates found.</div></div>;
  }

  // Take top 5 for the chart
  const chartData = candidates.slice(0, 5).map(c => ({
    name: c.name.split(' ')[0],
    score: c.matchScore
  }));

  return (
    <div>
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
          <div key={candidate._id} className="candidate-card" style={{ borderColor: idx === 0 && isAiMode ? '#c084fc' : '' }}>
            
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortlistResults;
