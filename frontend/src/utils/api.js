const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async getCandidates() {
    const res = await fetch(`${API_BASE_URL}/candidates`);
    if (!res.ok) throw new Error('Failed to fetch candidates');
    return res.json();
  },
  
  async addCandidate(candidate) {
    const res = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidate)
    });
    if (!res.ok) throw new Error('Failed to add candidate');
    return res.json();
  },

  async basicMatch(jobRequirements) {
    const res = await fetch(`${API_BASE_URL}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobRequirements)
    });
    if (!res.ok) throw new Error('Failed to run basic match');
    return res.json();
  },

  async aiShortlist(jobRequirements) {
    const res = await fetch(`${API_BASE_URL}/ai/shortlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobRequirements)
    });
    if (!res.ok) throw new Error('Failed to run AI shortlist');
    return res.json();
  }
};
