export type Question = {
  id: string;
  question: string;
  question_type: 'text' | 'image' | 'video';
  category: string;
  value: number;
  alternatives: string[];
  correct: string;
  state: 'unasked' | 'right' | 'wrong';
}

export type QuestionCategory = {
  name: string;
  questions: Question[];
  isChosen: boolean;
}

export const questionCategories: QuestionCategory[] = [
  {
    name: 'General Knowledge',
    questions: [
      {
        id: 'gk-1',
        question: 'What is the capital of France?',
        question_type: 'text',
        category: 'General Knowledge',
        value: 100,
        alternatives: ['Paris', 'Rome', 'Berlin', 'Madrid'],
        correct: 'Paris',
        state: 'unasked',
      },
      {
        id: 'gk-2',
        question: 'How many continents are there on Earth?',
        question_type: 'text',
        category: 'General Knowledge',
        value: 200,
        alternatives: ['5', '6', '7', '8'],
        correct: '7',
        state: 'unasked',
      },
      {
        id: 'gk-3',
        question: 'What gas do plants absorb from the atmosphere?',
        question_type: 'text',
        category: 'General Knowledge',
        value: 300,
        alternatives: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        correct: 'Carbon Dioxide',
        state: 'unasked',
      },
      {
        id: 'gk-4',
        question: 'Which ocean is the largest?',
        question_type: 'text',
        category: 'General Knowledge',
        value: 400,
        alternatives: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
        correct: 'Pacific',
        state: 'unasked',
      },
      {
        id: 'gk-5',
        question: 'What is the boiling point of water at sea level (°C)?',
        question_type: 'text',
        category: 'General Knowledge',
        value: 500,
        alternatives: ['90', '95', '100', '110'],
        correct: '100',
        state: 'unasked',
      },
    ],
    isChosen: false,
  },
  {
    name: 'Movies & TV',
    questions: [
      {
        id: 'mtv-1',
        question: 'Who played Iron Man in the Marvel movies?',
        question_type: 'text',
        category: 'Movies & TV',
        value: 100,
        alternatives: [
          'Chris Evans',
          'Robert Downey Jr.',
          'Chris Hemsworth',
          'Mark Ruffalo',
        ],
        correct: 'Robert Downey Jr.',
        state: 'unasked',
      },
      {
        id: 'mtv-2',
        question: 'Which TV show is set in the fictional town of Hawkins?',
        question_type: 'text',
        category: 'Movies & TV',
        value: 200,
        alternatives: [
          'Dark',
          'Stranger Things',
          'The X-Files',
          'Riverdale',
        ],
        correct: 'Stranger Things',
        state: 'unasked',
      },
      {
        id: 'mtv-3',
        question: 'Which movie features the quote “I’ll be back”?',
        question_type: 'text',
        category: 'Movies & TV',
        value: 300,
        alternatives: [
          'Rocky',
          'Die Hard',
          'The Terminator',
          'Predator',
        ],
        correct: 'The Terminator',
        state: 'unasked',
      },
      {
        id: 'mtv-4',
        question: 'What animated movie features a clownfish named Nemo?',
        question_type: 'text',
        category: 'Movies & TV',
        value: 400,
        alternatives: [
          'Shark Tale',
          'Finding Nemo',
          'The Little Mermaid',
          'Moana',
        ],
        correct: 'Finding Nemo',
        state: 'unasked',
      },
      {
        id: 'mtv-5',
        question: 'Which streaming service produced the series “The Crown”?',
        question_type: 'text',
        category: 'Movies & TV',
        value: 500,
        alternatives: ['Hulu', 'Netflix', 'Amazon Prime', 'HBO'],
        correct: 'Netflix',
        state: 'unasked',
      },
    ],
    isChosen: false,
  },
];
