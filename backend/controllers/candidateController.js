const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const axios = require('axios');

// Basic match logic extracted for reuse
const calculateBasicMatch = (candidates, requiredSkills, minExperience) => {
  return candidates.map(candidate => {
    // 1. Skill overlap
    const matchedSkills = candidate.skills.filter(skill =>
      requiredSkills.some(reqSkill => reqSkill.toLowerCase() === skill.toLowerCase())
    );
    const score = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 0;
    
    // 2. Experience check (could factor into score, but for now we just mark if it meets requirement)
    const meetsExperience = candidate.experience >= minExperience;
    
    return {
      ...candidate.toObject(),
      matchScore: parseFloat(score.toFixed(2)),
      matchedSkills,
      meetsExperience
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

exports.addCandidate = async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.basicMatch = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    const candidates = await Candidate.find();
    
    const matched = calculateBasicMatch(candidates, requiredSkills, minExperience);
    res.status(200).json(matched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.aiShortlist = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    const candidates = await Candidate.find();
    
    // Pre-calculate basic match to send to AI for context
    const basicMatched = calculateBasicMatch(candidates, requiredSkills, minExperience);
    
    // Format candidates for prompt
    const candidatesText = basicMatched.map((c, i) => {
      return `${i + 1}. ${c.name} - Skills: ${c.skills.join(', ')} - Experience: ${c.experience} years - Basic Match Score: ${c.matchScore}%`;
    }).join('\n');

    const prompt = `
      Job requires: ${requiredSkills.join(', ')} (${minExperience}+ years experience)
      
      Candidates:
      ${candidatesText}
      
      Analyze these candidates against the job requirements. Rank them and provide a brief explanation (2-3 sentences max) for each on why they are suitable or not suitable. Focus on the nuances beyond just keyword matching.
      Return the output as a JSON array of objects with 'id' (the candidate's original index from the list provided, e.g., 1, 2), 'aiRank' (1 being the best), and 'aiExplanation'.
      Example JSON response format:
      [
        { "id": 1, "aiRank": 1, "aiExplanation": "..." }
      ]
      DO NOT return any markdown formatting around the JSON, just the JSON array.
    `;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OpenRouter API key is missing from environment variables." });
    }

    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o",
      messages: [
        { role: "system", content: "You are an expert technical recruiter and JSON output generator." },
        { role: "user", content: prompt }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    let aiContent = response.data.choices[0].message.content;
    
    // Clean up potential markdown formatting from AI response
    if (aiContent.startsWith('```json')) {
      aiContent = aiContent.replace(/```json\n?/, '').replace(/```$/, '');
    }

    let aiRankings;
    try {
      aiRankings = JSON.parse(aiContent);
    } catch (e) {
      console.error("Failed to parse AI response as JSON", aiContent);
      return res.status(500).json({ error: "AI returned invalid format", raw: aiContent });
    }

    // Merge AI rankings with candidates
    const finalResult = basicMatched.map((candidate, index) => {
      const aiInfo = aiRankings.find(r => parseInt(r.id) === (index + 1));
      return {
        ...candidate,
        aiRank: aiInfo ? aiInfo.aiRank : 999,
        aiExplanation: aiInfo ? aiInfo.aiExplanation : "No explanation provided."
      };
    }).sort((a, b) => a.aiRank - b.aiRank);

    res.status(200).json(finalResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.generateInterviewQuestions = async (req, res) => {
    try {
        const { candidateSkills, jobSkills } = req.body;
        
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "OpenRouter API key is missing." });
        }

        const prompt = `
            The candidate has the following skills: ${candidateSkills.join(', ')}.
            The job requires: ${jobSkills.join(', ')}.
            Generate 3 technical interview questions that test the intersection of the candidate's skills and the job requirements. Provide a brief "expected answer concept" for each.
            Return ONLY a valid JSON array of objects with 'question' and 'expectedAnswer' keys.
        `;

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: process.env.OPENROUTER_MODEL || "openai/gpt-4o",
            messages: [
              { role: "system", content: "You are an expert technical interviewer and JSON output generator." },
              { role: "user", content: prompt }
            ]
          }, {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            }
          });
      
        let aiContent = response.data.choices[0].message.content;
        if (aiContent.startsWith('```json')) {
            aiContent = aiContent.replace(/```json\n?/, '').replace(/```$/, '');
        }

        res.status(200).json(JSON.parse(aiContent));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.saveJob = async (req, res) => {
    try {
        const newJob = new Job(req.body);
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
