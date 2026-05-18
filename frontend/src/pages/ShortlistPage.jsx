import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { api } from '../utils/api';
import ShortlistResults from '../components/ShortlistResults';

const ShortlistPage = () => {
  const [formData, setFormData] = useState({
    minExperience: 1
  });
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);

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

  const handleMatch = async (useAi) => {
    if (skills.length === 0) {
      alert("Please add at least one required skill.");
      return;
    }
    
    setLoading(true);
    setIsAiMode(useAi);
    
    const reqData = {
      requiredSkills: skills,
      minExperience: Number(formData.minExperience)
    };

    try {
      const matched = useAi 
        ? await api.aiShortlist(reqData)
        : await api.basicMatch(reqData);
        
      setResults(matched);
    } catch (err) {
      console.error(err);
      alert(useAi ? 'AI Match failed. Check API key.' : 'Match failed.');
    }
    
    setLoading(false);
  };

  const handleSaveShortlist = async () => {
    try {
      setLoading(true);
      await api.saveJob({
        title: `Shortlist - ${skills.join(', ')}`,
        requiredSkills: skills,
        minExperience: Number(formData.minExperience)
      });
      alert('Shortlist saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save shortlist.');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Job Requirements</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Minimum Experience (Years)</label>
            <input type="number" name="minExperience" className="form-control" min="0" step="0.5" value={formData.minExperience} onChange={handleChange} required />
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Required Skills</label>
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
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => handleMatch(false)} disabled={loading}>
            {loading && !isAiMode ? 'Matching...' : 'Run Basic Match'}
          </button>
          <button className="btn" style={{ background: 'linear-gradient(to right, #8b5cf6, #d946ef)' }} onClick={() => handleMatch(true)} disabled={loading}>
            <Sparkles size={18} />
            {loading && isAiMode ? 'AI Thinking...' : 'AI Shortlist'}
          </button>
        </div>
      </div>

      {results && (
        <ShortlistResults 
          candidates={results} 
          isAiMode={isAiMode} 
          jobSkills={skills} 
          onSave={handleSaveShortlist} 
        />
      )}
    </div>
  );
};

export default ShortlistPage;
