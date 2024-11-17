import React, { useState } from 'react';
import { ChevronDown, Star, Clock, Calendar, Moon, User, MessageCircle, Download } from 'lucide-react';
import axios from 'axios';

const MetricCard = ({ title, value, subtitle, icon: Icon }) => (
  <div className="bg-white rounded-lg p-4 flex flex-col h-full border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="text-4xl font-semibold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      {Icon && <Icon className="text-blue-500" size={20} />}
    </div>
    <h4 className="text-sm font-medium text-gray-700 mt-auto">{title}</h4>
  </div>
);

const NavTab = ({ label, active }) => (
  <button
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      active 
        ? 'bg-white text-gray-900 shadow-sm' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
    }`}
  >
    {label}
  </button>
);

const emojiScores = [
  { emoji: "😔", score: 3 },
  { emoji: "😕", score: 5 },
  { emoji: "😶", score: 6 },
  { emoji: "😃", score: 9 },
  { emoji: "😁", score: 10 }
];

const ScoreButton = ({ emoji, score, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
      selected
        ? 'bg-blue-500 scale-110 shadow-lg'
        : 'bg-gray-100 hover:bg-gray-200'
    }`}
  >
    {emoji}
  </button>
);

const ScoringSection = ({ title, weight, questions, onScoresUpdate, onFeedbackUpdate }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState('');

  const handleScoreChange = (questionIdx, score) => {
    const newScores = { ...scores, [questionIdx]: score };
    setScores(newScores);
    onScoresUpdate(title, newScores);
  };

  const handleFeedbackChange = (value) => {
    setFeedback(value);
    onFeedbackUpdate(title, value);
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-4 shadow-sm border border-gray-100">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-blue-500">Weight: {weight}%</p>
        </div>
        <ChevronDown 
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          size={24}
        />
      </div>
      
      {isOpen && (
        <div className="mt-6 space-y-8">
          {questions.map((question, idx) => (
            <div key={idx} className="space-y-4">
              <p className="text-lg text-gray-800">{question}</p>
              <div className="flex gap-3 mt-2">
                {emojiScores.map(({ emoji, score }) => (
                  <ScoreButton
                    key={score}
                    emoji={emoji}
                    score={score}
                    selected={scores[idx] === score}
                    onClick={() => handleScoreChange(idx, score)}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => handleFeedbackChange(e.target.value)}
              className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Provide constructive feedback..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

const PitchScoring = () => {
  

  const [scoringData, setScoringData] = useState({});
  const [sectionFeedback, setSectionFeedback] = useState({});
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const scoringSections = [
    {
      title: "Problem",
      weight: 10,
      questions: [
        "Is there a clear problem?",
        "Is there evidence to support the importance of the problem?",
        "Is the problem solvable?",
        "How obsessed is the team on the problem?"
      ]
    },
    {
      title: "Solution",
      weight: 10,
      questions: [
        "Does the solution make sense?",
        "Is there a clear vision of what the solution should be?",
        "Is the solution feasible to be developed by the team?"
      ]
    },
    {
      title: "Innovation",
      weight: 10,
      questions: [
        "How novel is the proposed AI application?",
        "Does it solve a problem in a new or unique way?"
      ]
    },
    {
      title: "Team",
      weight: 20,
      questions: [
        "Does the team have the necessary skills and expertise?",
        "Do they have strong leadership?",
        "Is there good team dynamics and teamwork?",
        "Does the team show agility and adaptability?"
      ]
    },
    {
      title: "Business Model",
      weight: 10,
      questions: [
        "Does the revenue or business model make sense?",
        "Is this the most effective business model for this concept?"
      ]
    },
    {
      title: "Market Opportunity",
      weight: 10,
      questions: [
        "Is there a clear market need for the proposed AI application?",
        "How large is the potential market?",
        "How does the team plan to monetize the product?"
      ]
    },
    {
      title: "Technical Feasibility",
      weight: 10,
      questions: [
        "Is the proposed AI application technically feasible?",
        "Does the team demonstrate a strong understanding of AI technology?"
      ]
    },
    {
      title: "Execution & Go To Market Strategy",
      weight: 10,
      questions: [
        "Does the team's strategy make sense at this stage?",
        "Do they have a clear idea on how to grow and scale the company?"
      ]
    },
    {
      title: "Communication / Pitch Quality",
      weight: 10,
      questions: [
        "Does the team have a clear vision?",
        "Was the pitch clear, concise, and engaging?",
        "Did the team effectively communicate their ideas?"
      ]
    }
  ];

  const handleSectionScoresUpdate = (sectionTitle, scores) => {
    setScoringData(prev => ({
      ...prev,
      [sectionTitle]: scores
    }));
  };

  const handleSectionFeedbackUpdate = (sectionTitle, feedback) => {
    setSectionFeedback(prev => ({
      ...prev,
      [sectionTitle]: feedback
    }));
  };

  const calculateSectionScore = (sectionScores) => {
    if (!sectionScores || Object.keys(sectionScores).length === 0) return 0;
    const scores = Object.values(sectionScores);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsDownloading(true);

    const handleSubmit = async () => {
      setIsSubmitting(true);
      setIsDownloading(true);
    
      const formattedData = {
        teamName: "AI Innovators",
        pitchNumber: 8,
        session: 2,
        scoringSections: scoringSections.map(section => ({
          title: section.title,
          weight: section.weight,
          score: calculateSectionScore(scoringData[section.title]),
          feedback: sectionFeedback[section.title] || '',
          questionScores: scoringData[section.title] || {}
        })),
        generalFeedback,
        timestamp: new Date().toISOString()
      };
    
      try {
        const response = await axios.post('https://ai-judge-2.onrender.com/summarize_feedback', formattedData, {
          responseType: 'blob' // Important: tells axios to expect binary data
        });
    
        // Create a blob from the response data
        const blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
    
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
    
        // Automatically trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `AI_Innovators_Pitch8_Feedback.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
      } catch (error) {
        console.error('Submission error:', error);
        // Add error notification here
      } finally {
        setIsSubmitting(false);
        setIsDownloading(false);
      }
    };
    

  };
  return (
    <div className="min-h-screen bg-[#0a1929] text-gray-900">
      <header className="bg-[#0a1929] text-white px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-xl font-semibold">Oxbridge AI Challenge 2024</h1>
        <div className="flex items-center gap-4">
          <span className="bg-blue-500/20 px-3 py-1 rounded-full text-sm">Screening Round</span>
          <Moon size={20} />
          <User size={20} />
        </div>
      </header>

      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Live Scoring</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Teams Evaluated"
              value="24"
              subtitle="4 remaining today"
              icon={Star}
            />
            <MetricCard
              title="Current Session"
              value="2"
              subtitle="of 3 sessions"
              icon={Clock}
            />
            <MetricCard
              title="Time Remaining"
              value="15"
              subtitle="minutes"
              icon={Calendar}
            />
            <MetricCard
              title="Feedback Given"
              value="18"
              subtitle="6 pending"
              icon={MessageCircle}
            />
          </div>

          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <NavTab label="Dashboard" />
            <NavTab label="Live Scoring" active />
            <NavTab label="Nominations" />
            <NavTab label="History" />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Current Team: AI Innovators</h2>
                  <p className="text-gray-500">Pitch #8 - Session 2</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl text-blue-500">12:45</span>
                  <span className="text-gray-500">Remaining</span>
                </div>
              </div>
            </div>

            {scoringSections.map((section, idx) => (
              <ScoringSection
                key={idx}
                {...section}
                onScoresUpdate={handleSectionScoresUpdate}
                onFeedbackUpdate={handleSectionFeedbackUpdate}
              />
            ))}

<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4">General Feedback</h3>
        <p className="text-gray-600 mb-4">Please provide your general feedback</p>
        <textarea
          value={generalFeedback}
          onChange={(e) => setGeneralFeedback(e.target.value)}
          className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Provide overall feedback for the team..."
        />
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 flex items-center gap-2"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <span>Submit Feedback</span>
                {isDownloading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Download size={16} />
                )}
              </>
            )}
          </button>
          <button className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Skip
          </button>
        </div>
      </div>
      
          </div>
        </div>
      </main>
    </div>
  );
};

export default PitchScoring;