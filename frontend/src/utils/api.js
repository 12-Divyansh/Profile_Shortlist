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
  },

  async generateInterviewQuestions(candidateSkills, jobSkills) {
    const res = await fetch(`${API_BASE_URL}/ai/interview-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateSkills, jobSkills })
    });
    if (!res.ok) throw new Error('Failed to generate questions');
    return res.json();
  },

  async saveJob(jobData) {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    if (!res.ok) throw new Error('Failed to save job');
    return res.json();
  }
};
