import React from 'react';
import { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  icon: React.ReactNode;
  color: string;
  description: string;
  onClick: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, icon, color, description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        cursor-pointer group relative overflow-hidden rounded-3xl p-6 h-64
        transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
        flex flex-col justify-between
        ${color}
      `}
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl transition-transform group-hover:scale-150"></div>
      
      <div className="relative z-10">
        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4 text-3xl">
          {icon}
        </div>
        <h3 className="text-3xl font-black text-white mb-2 tracking-wide">{subject}</h3>
        <p className="text-white/90 font-semibold text-sm leading-relaxed">{description}</p>
      </div>

      <div className="relative z-10 flex items-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Start Training <span className="ml-2">→</span>
      </div>
    </div>
  );
};