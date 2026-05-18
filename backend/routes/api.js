const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// Candidate APIs
router.post('/candidates', candidateController.addCandidate);
router.get('/candidates', candidateController.getAllCandidates);

// Job Matching APIs
router.post('/match', candidateController.basicMatch);
router.post('/ai/shortlist', candidateController.aiShortlist);
router.post('/ai/interview-questions', candidateController.generateInterviewQuestions);
router.post('/jobs', candidateController.saveJob);

module.exports = router;
