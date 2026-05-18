import React from 'react';

const CandidateList = ({ candidates }) => {
  if (!candidates || candidates.length === 0) {
    return <div style={{ color: 'var(--text-secondary)' }}>No candidates found.</div>;
  }

  return (
    <div className="candidate-grid">
      {candidates.map((candidate) => (
        <div key={candidate._id} className="candidate-card">
          <div className="candidate-header">
            <div>
              <div className="candidate-name">{candidate.name}</div>
              <div className="candidate-email">{candidate.email}</div>
            </div>
            <div className="badge badge-accent">{candidate.experience} Yrs</div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Skills</div>
            <div className="skills-list">
              {candidate.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
          
          {candidate.bio && (
            <div style={{ fontSize: '0.875rem', marginTop: 'auto' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Bio: </span>
              {candidate.bio.length > 60 ? candidate.bio.substring(0, 60) + '...' : candidate.bio}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CandidateList;
