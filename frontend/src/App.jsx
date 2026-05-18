import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Briefcase, Users } from 'lucide-react';
import CandidatesPage from './pages/CandidatesPage';
import ShortlistPage from './pages/ShortlistPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <Briefcase size={32} color="#818cf8" />
          <h1>AI Shortlist</h1>
        </header>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} />
              Candidates
            </div>
          </NavLink>
          <NavLink to="/shortlist" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} />
              Shortlist Jobs
            </div>
          </NavLink>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<CandidatesPage />} />
            <Route path="/shortlist" element={<ShortlistPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
