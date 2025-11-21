import React, { useState, useEffect, useCallback } from 'react';
import { Subject, Difficulty, QuizQuestion } from '../types';
import { generateQuizQuestions, getEncouragement } from '../services/geminiService';
import { Button } from './Button';

interface QuizArenaProps {
  subject: Subject;
  difficulty: Difficulty;
  topic?: string;
  onExit: () => void;
  onComplete: (score: number) => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({ subject, difficulty, topic, onExit, onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const qs = await generateQuizQuestions(subject, difficulty, topic);
      setQuestions(qs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [subject, difficulty, topic]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswer = async (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const currentQ = questions[currentIndex];
    const isCorrect = answer === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    const msg = await getEncouragement(isCorrect, subject);
    setFeedbackMessage(msg);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setHintUsed(false);
      setFeedbackMessage('');
    } else {
      onComplete(score + (selectedAnswer === questions[currentIndex].correctAnswer ? 1 : 0)); // Add last point if correct
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-brand-purple/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-brand-purple rounded-full animate-spin border-t-transparent"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-700 animate-pulse">Consulting the Oracle...</h2>
        <p className="text-gray-500">Getting your {topic ? topic : subject} challenge ready!</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
       <div className="text-center p-8">
         <h2 className="text-xl font-bold mb-4">Something went wrong loading the quiz.</h2>
         <Button onClick={onExit}>Go Back</Button>
       </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm">
        <button onClick={onExit} className="text-gray-400 hover:text-brand-red font-bold">
          Quit
        </button>
        <div className="flex-1 mx-6">
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-purple transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="font-bold text-brand-purple">
          {currentIndex + 1}/{questions.length}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative min-h-[400px] flex flex-col">
        <div className="p-8 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="inline-block bg-brand-teal/10 text-brand-teal font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wider">
              {subject}
            </div>
            {topic && (
              <div className="inline-block bg-brand-orange/10 text-brand-orange font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wider">
                {topic}
              </div>
            )}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-8 leading-tight">
            {currentQ.questionText}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options.map((option, idx) => {
              let btnStyle = "bg-gray-50 hover:bg-brand-purple/5 border-2 border-gray-200 text-gray-700";
              
              if (showFeedback) {
                 if (option === currentQ.correctAnswer) {
                   btnStyle = "bg-brand-green text-white border-brand-green ring-4 ring-brand-green/30";
                 } else if (option === selectedAnswer) {
                   btnStyle = "bg-brand-red text-white border-brand-red opacity-50";
                 } else {
                   btnStyle = "bg-gray-50 text-gray-300 border-gray-100";
                 }
              } else if (selectedAnswer === option) {
                btnStyle = "bg-brand-purple text-white border-brand-purple";
              }

              return (
                <button
                  key={idx}
                  disabled={showFeedback}
                  onClick={() => handleAnswer(option)}
                  className={`
                    p-6 rounded-2xl text-lg font-bold text-left transition-all duration-200
                    ${btnStyle}
                  `}
                >
                  <span className="mr-3 opacity-50">{(idx + 10).toString(36).toUpperCase()}.</span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hint & Feedback Area */}
        <div className="bg-gray-50 p-6 border-t border-gray-100">
          {!showFeedback ? (
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setHintUsed(true)}
                className={`flex items-center gap-2 text-brand-orange font-bold hover:underline ${hintUsed ? 'opacity-50 cursor-default' : ''}`}
                disabled={hintUsed}
              >
                <span className="text-xl">💡</span> {hintUsed ? currentQ.hint : "Need a hint?"}
              </button>
            </div>
          ) : (
            <div className="animate-float">
              <div className={`flex items-start gap-4 mb-4 ${selectedAnswer === currentQ.correctAnswer ? 'text-brand-green' : 'text-brand-red'}`}>
                <div className="text-3xl">
                  {selectedAnswer === currentQ.correctAnswer ? '🎉' : '🤔'}
                </div>
                <div>
                  <h3 className="font-black text-xl mb-1">
                    {feedbackMessage}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={nextQuestion} size="lg">
                  {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question →"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};