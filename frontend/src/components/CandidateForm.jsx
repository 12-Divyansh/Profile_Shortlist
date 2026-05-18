import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../utils/api';

const CandidateForm = ({ onAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    bio: ''
  });
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
        setCurrentSkill('');
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newCandidate = {
        ...formData,
        experience: Number(formData.experience),
        skills
      };
      const saved = await api.addCandidate(newCandidate);
      if (onAdded) onAdded(saved);
      // Reset form
      setFormData({ name: '', email: '', experience: '', bio: '' });
      setSkills([]);
    } catch (err) {
      console.error(err);
      alert('Failed to add candidate');
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem' }}>Add New Candidate</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Years of Experience</label>
          <input type="number" name="experience" className="form-control" min="0" step="0.5" value={formData.experience} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Skills (Press Enter or Comma to add)</label>
          <div className="tags-input-container">
            {skills.map((skill, index) => (
              <span key={index} className="tag">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)}><X size={14} /></button>
              </span>
            ))}
            <input 
              type="text" 
              className="tags-input" 
              placeholder="e.g. React, Node.js"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleSkillKeyDown}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Bio / Projects (Optional)</label>
          <textarea name="bio" className="form-control" rows="3" value={formData.bio} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Candidate'}
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
