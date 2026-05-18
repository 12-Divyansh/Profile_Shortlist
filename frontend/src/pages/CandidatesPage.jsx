import React, { useState, useEffect } from 'react';
import CandidateForm from '../components/CandidateForm';
import CandidateList from '../components/CandidateList';
import { api } from '../utils/api';

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const data = await api.getCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Failed to fetch candidates', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  const handleCandidateAdded = (newCandidate) => {
    setCandidates([newCandidate, ...candidates]);
    setShowForm(false);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = skillFilter === '' || 
                         candidate.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    return matchesSearch && matchesSkill;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Candidate Database</h2>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Candidate'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '2rem' }}>
          <CandidateForm onAdded={handleCandidateAdded} />
        </div>
      )}

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', padding: '1rem 2rem' }}>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="form-control" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ flex: 2 }}
        />
        <input 
          type="text" 
          placeholder="Filter by skill (e.g. React)" 
          className="form-control" 
          value={skillFilter} 
          onChange={(e) => setSkillFilter(e.target.value)} 
          style={{ flex: 1 }}
        />
      </div>

      {loading ? (
        <div>Loading candidates...</div>
      ) : (
        <CandidateList candidates={filteredCandidates} />
      )}
    </div>
  );
};

export default CandidatesPage;
