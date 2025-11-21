export enum Subject {
  MATH = 'Mathematics',
  SCIENCE = 'Science',
  ENGLISH = 'English'
}

export enum Difficulty {
  BEGINNER = 'Beginner (Ages 5-7)',
  INTERMEDIATE = 'Intermediate (Ages 8-10)',
  ADVANCED = 'Advanced (Ages 11-13)'
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string; // Fun fact or explanation
  hint: string;
}

export interface GameState {
  score: number;
  streak: number;
  totalQuestionsAnswered: number;
  badges: string[];
}

export interface GenerateQuestionsResponse {
  questions: QuizQuestion[];
}