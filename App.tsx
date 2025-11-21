import React, { useState } from 'react';
import { Subject, Difficulty } from './types';
import { SubjectCard } from './components/SubjectCard';
import { QuizArena } from './components/QuizArena';
import { Button } from './components/Button';

const SUBJECT_TOPICS: Record<Subject, { id: string; name: string; icon: string; desc: string }[]> = {
  [Subject.MATH]: [
    { id: 'addition', name: 'Fun Addition', icon: '➕', desc: 'Add numbers together!' },
    { id: 'subtraction', name: 'Super Subtraction', icon: '➖', desc: 'Take away numbers!' },
    { id: 'multiplication', name: 'Magic Multiplication', icon: '✖️', desc: 'Multiply and grow!' },
    { id: 'geometry', name: 'Shapes & Geometry', icon: '🔺', desc: 'Learn about shapes!' },
    { id: 'money', name: 'Money Math', icon: '💰', desc: 'Count coins and bills!' },
    { id: 'logic', name: 'Logic Puzzles', icon: '🧩', desc: 'Train your brain!' }
  ],
  [Subject.SCIENCE]: [
    { id: 'animals', name: 'Amazing Animals', icon: '🦁', desc: 'Learn about wildlife!' },
    { id: 'space', name: 'Space Explorers', icon: '🚀', desc: 'Explore the stars!' },
    { id: 'plants', name: 'Plant Power', icon: '🌱', desc: 'How do plants grow?' },
    { id: 'human_body', name: 'Human Body', icon: '🦴', desc: 'How your body works!' },
    { id: 'weather', name: 'Wild Weather', icon: '🌪️', desc: 'Rain, sun, and snow!' },
    { id: 'experiments', name: 'Fun Experiments', icon: '🧪', desc: 'Science in action!' }
  ],
  [Subject.ENGLISH]: [
    { id: 'vocabulary', name: 'Word Wizard', icon: '📖', desc: 'Learn new words!' },
    { id: 'grammar', name: 'Grammar Guru', icon: '✍️', desc: 'Fix the sentences!' },
    { id: 'spelling', name: 'Spelling Bee', icon: '🐝', desc: 'Spell it right!' },
    { id: 'reading', name: 'Reading Time', icon: '📚', desc: 'Story adventures!' },
    { id: 'rhymes', name: 'Rhyme Time', icon: '🎵', desc: 'Match the sounds!' },
    { id: 'storytelling', name: 'Storytelling', icon: '🐉', desc: 'Create your own tale!' }
  ]
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'topics' | 'quiz' | 'results'>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [lastScore, setLastScore] = useState(0);

  const subjects = [
    {
      id: Subject.MATH,
      icon: '📐',
      color: 'bg-gradient-to-br from-brand-orange to-red-500',
      desc: 'Master numbers, shapes, and logic puzzles!'
    },
    {
      id: Subject.SCIENCE,
      icon: '🧬',
      color: 'bg-gradient-to-br from-brand-green to-teal-600',
      desc: 'Explore nature, space, and how things work!'
    },
    {
      id: Subject.ENGLISH,
      icon: '📚',
      color: 'bg-gradient-to-br from-brand-blue to-brand-purple',
      desc: 'Become a wizard of words and storytelling!'
    }
  ];

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setView('topics');
  };

  const startQuiz = (topic?: string) => {
    setSelectedTopic(topic);
    setView('quiz');
  };

  const handleQuizComplete = (score: number) => {
    setLastScore(score);
    setView('results');
  };

  const resetApp = () => {
    setView('home');
    setSelectedSubject(null);
    setSelectedTopic(undefined);
    setLastScore(0);
  };

  const backToTopics = () => {
    setView('topics');
    setSelectedTopic(undefined);
    setLastScore(0);
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-indigo-50/50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
            <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
              ✨
            </div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">
              CoriMao <span className="text-brand-purple">Academy</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm font-bold text-gray-500">
              Junior Explorer
            </span>
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-md overflow-hidden">
               <img src="https://picsum.photos/seed/student/200/200" alt="Profile" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'home' && (
          <div className="space-y-12 animate-float">
            {/* Hero Section */}
            <div className="text-center space-y-4 mt-8">
              <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-4">
                Ready to learn something <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-teal">amazing?</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose a subject and train your brain with our AI-powered tutors!
              </p>

              {/* Difficulty Selector */}
              <div className="flex justify-center mt-8 mb-12">
                <div className="bg-white p-1 rounded-full shadow-md inline-flex">
                  {Object.values(Difficulty).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`
                        px-6 py-2 rounded-full text-sm font-bold transition-all duration-200
                        ${selectedDifficulty === diff 
                          ? 'bg-brand-purple text-white shadow-sm' 
                          : 'text-gray-500 hover:text-brand-purple'
                        }
                      `}
                    >
                      {diff.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subjects.map((sub) => (
                <SubjectCard
                  key={sub.id}
                  subject={sub.id}
                  icon={sub.icon}
                  color={sub.color}
                  description={sub.desc}
                  onClick={() => handleSubjectSelect(sub.id)}
                />
              ))}
            </div>
            
            {/* Daily Fact */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-12">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-6xl">🦕</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Did you know?</h3>
                  <p className="text-gray-600">
                    The Stegosaurus had a brain the size of a walnut, but it was still one of the coolest dinosaurs ever! Keep learning to grow your brain much bigger than that!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'topics' && selectedSubject && (
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => setView('home')} 
              className="mb-8 flex items-center text-gray-500 hover:text-brand-purple font-bold transition-colors"
            >
              ← Back to Subjects
            </button>
            
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
                 {selectedSubject} Challenges
               </h2>
               <p className="text-lg text-gray-600">
                 Pick a mission to start your training!
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div 
                onClick={() => startQuiz()}
                className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm border-2 border-dashed border-brand-purple/30 hover:border-brand-purple hover:bg-brand-purple/5 transition-all group flex items-center gap-4"
              >
                 <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                   🎲
                 </div>
                 <div>
                   <h3 className="font-bold text-lg text-gray-800">Surprise Me!</h3>
                   <p className="text-sm text-gray-500">Mixed questions from all topics</p>
                 </div>
              </div>

              {SUBJECT_TOPICS[selectedSubject].map((topic) => (
                <div 
                  key={topic.id}
                  onClick={() => startQuiz(topic.name)}
                  className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group flex items-center gap-4"
                >
                   <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                     {topic.icon}
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-gray-800 group-hover:text-brand-purple transition-colors">{topic.name}</h3>
                     <p className="text-sm text-gray-500">{topic.desc}</p>
                   </div>
                   <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-brand-purple font-bold">
                     →
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'quiz' && selectedSubject && (
          <QuizArena
            subject={selectedSubject}
            difficulty={selectedDifficulty}
            topic={selectedTopic}
            onExit={backToTopics}
            onComplete={handleQuizComplete}
          />
        )}

        {view === 'results' && (
          <div className="max-w-lg mx-auto text-center pt-10">
             <div className="mb-8 text-8xl animate-bounce-slow">
               {lastScore >= 3 ? '🏆' : '🌟'}
             </div>
             <h2 className="text-4xl font-black text-gray-800 mb-4">
               Training Complete!
             </h2>
             <p className="text-xl text-gray-600 mb-8">
               You scored <span className="font-bold text-brand-purple text-2xl">{lastScore}</span> out of 5
             </p>
             
             <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
               <h3 className="font-bold text-gray-800 mb-2">Instructor's Note:</h3>
               <p className="text-gray-600 italic">
                 "{lastScore === 5 ? "Absolute perfection! You're a genius!" : 
                   lastScore >= 3 ? "Great work! You're getting smarter every second." : 
                   "Nice try! Practice makes perfect. Let's go again!"}"
               </p>
             </div>

             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button variant="secondary" onClick={backToTopics}>Choose Another Topic</Button>
               <Button onClick={() => startQuiz(selectedTopic)}>Try Again</Button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;