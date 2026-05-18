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

  const handleCandidateAdded = (newCandidate) => {
    setCandidates([newCandidate, ...candidates]);
    setShowForm(false);
  };

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

      {loading ? (
        <div>Loading candidates...</div>
      ) : (
        <CandidateList candidates={candidates} />
      )}
    </div>
  );
};

export default CandidatesPage;
