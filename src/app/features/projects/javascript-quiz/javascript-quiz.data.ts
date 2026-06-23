export interface QuizQuestion {
  id: string;
  questionKey: string;
  optionKeys: readonly [string, string, string, string];
  correctOption: number;
  explanationKey: string;
}

interface QuizQuestionDefinition {
  id: string;
  translationKey: string;
  correctOption: number;
}

export const QUIZ_SESSION_SIZE = 6;

const QUESTION_DEFINITIONS: readonly QuizQuestionDefinition[] = [
  { id: 'assignment', translationKey: 'ASSIGNMENT', correctOption: 1 },
  { id: 'return-object', translationKey: 'RETURN_OBJECT', correctOption: 0 },
  { id: 'this-context', translationKey: 'THIS_CONTEXT', correctOption: 2 },
  { id: 'reverse-array', translationKey: 'REVERSE_ARRAY', correctOption: 1 },
  { id: 'closure', translationKey: 'CLOSURE', correctOption: 3 },
  { id: 'fibonacci', translationKey: 'FIBONACCI', correctOption: 2 },
  { id: 'variable-name', translationKey: 'VARIABLE_NAME', correctOption: 2 },
  { id: 'null-undefined', translationKey: 'NULL_UNDEFINED', correctOption: 1 },
  { id: 'remainder', translationKey: 'REMAINDER', correctOption: 0 },
  { id: 'push-pop', translationKey: 'PUSH_POP', correctOption: 3 },
  { id: 'shift-unshift', translationKey: 'SHIFT_UNSHIFT', correctOption: 1 },
  { id: 'slice', translationKey: 'SLICE', correctOption: 2 },
  { id: 'splice', translationKey: 'SPLICE', correctOption: 0 },
  { id: 'call-apply', translationKey: 'CALL_APPLY', correctOption: 3 },
  { id: 'missing-property', translationKey: 'MISSING_PROPERTY', correctOption: 1 },
  { id: 'json', translationKey: 'JSON_SYNTAX', correctOption: 2 },
  { id: 'function-expression', translationKey: 'FUNCTION_EXPRESSION', correctOption: 0 },
  { id: 'first-class-functions', translationKey: 'FIRST_CLASS_FUNCTIONS', correctOption: 3 },
  { id: 'prototype-chain', translationKey: 'PROTOTYPE_CHAIN', correctOption: 1 },
  { id: 'spread-array', translationKey: 'SPREAD_ARRAY', correctOption: 2 },
  { id: 'rest-parameters', translationKey: 'REST_PARAMETERS', correctOption: 0 },
  { id: 'destructuring', translationKey: 'DESTRUCTURING', correctOption: 3 },
  { id: 'map', translationKey: 'MAP', correctOption: 1 },
  { id: 'set', translationKey: 'SET', correctOption: 2 },
  { id: 'var-hoisting', translationKey: 'VAR_HOISTING', correctOption: 0 },
  { id: 'strict-mode', translationKey: 'STRICT_MODE', correctOption: 3 }
];

export const JAVASCRIPT_QUIZ_QUESTIONS: readonly QuizQuestion[] = QUESTION_DEFINITIONS.map(
  ({ id, translationKey, correctOption }) => {
    const baseKey = `JAVASCRIPT_QUIZ.QUESTIONS.${translationKey}`;

    return {
      id,
      questionKey: `${baseKey}.TEXT`,
      optionKeys: [
        `${baseKey}.OPTIONS.A`,
        `${baseKey}.OPTIONS.B`,
        `${baseKey}.OPTIONS.C`,
        `${baseKey}.OPTIONS.D`
      ],
      correctOption,
      explanationKey: `${baseKey}.EXPLANATION`
    };
  }
);

export function createQuizSession(
  questionCount = QUIZ_SESSION_SIZE,
  random: () => number = Math.random
): readonly QuizQuestion[] {
  return shuffle([...JAVASCRIPT_QUIZ_QUESTIONS], random)
    .slice(0, Math.min(questionCount, JAVASCRIPT_QUIZ_QUESTIONS.length))
    .map((question) => shuffleQuestionOptions(question, random));
}

function shuffleQuestionOptions(question: QuizQuestion, random: () => number): QuizQuestion {
  const shuffledOptions = shuffle(
    question.optionKeys.map((key, originalIndex) => ({ key, originalIndex })),
    random
  );

  return {
    ...question,
    optionKeys: shuffledOptions.map(({ key }) => key) as [string, string, string, string],
    correctOption: shuffledOptions.findIndex(({ originalIndex }) => originalIndex === question.correctOption)
  };
}

function shuffle<T>(values: T[], random: () => number): T[] {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }

  return values;
}
