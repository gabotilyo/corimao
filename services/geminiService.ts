import { GoogleGenAI, Type } from "@google/genai";
import { Subject, Difficulty, QuizQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelId = "gemini-2.5-flash";

export const generateQuizQuestions = async (
  subject: Subject,
  difficulty: Difficulty,
  topic?: string
): Promise<QuizQuestion[]> => {
  try {
    const prompt = `
      Create a fun, engaging, and educational quiz for children.
      Subject: ${subject}
      Difficulty Level: ${difficulty}
      ${topic ? `Specific Topic: ${topic}` : ''}
      
      Generate 5 multiple-choice questions.
      The tone should be encouraging and playful.
      Ensure the 'options' array contains 4 distinct choices.
      The 'explanation' should be a short, fun fact explaining why the answer is correct, suitable for a child.
      The 'hint' should be a helpful nudge without giving the answer away.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  hint: { type: Type.STRING }
                },
                required: ["id", "questionText", "options", "correctAnswer", "explanation", "hint"]
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{"questions": []}');
    return result.questions;

  } catch (error) {
    console.error("Error generating questions:", error);
    // Fallback questions in case of API failure to prevent app crash
    return [
      {
        id: 'error-fallback',
        questionText: "Oops! The question machine is taking a nap. Can you try again later?",
        options: ["Okay", "Sure", "Alright", "Yes"],
        correctAnswer: "Okay",
        explanation: "Sometimes even robots need a break!",
        hint: "Just click Okay."
      }
    ];
  }
};

export const getEncouragement = async (isCorrect: boolean, subject: Subject): Promise<string> => {
  try {
    const prompt = isCorrect
      ? `Write a short, super enthusiastic 1-sentence celebration for a child who just got a ${subject} question right!`
      : `Write a short, kind, and encouraging 1-sentence message for a child who got a ${subject} question wrong, telling them it's okay to make mistakes.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || (isCorrect ? "Awesome job!" : "Keep trying!");
  } catch (e) {
    return isCorrect ? "Great job!" : "Don't give up!";
  }
};