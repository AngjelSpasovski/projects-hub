import {
  JAVASCRIPT_QUIZ_QUESTIONS,
  QUIZ_SESSION_SIZE,
  createQuizSession
} from './javascript-quiz.data';

describe('JavaScript Quiz question bank', () => {
  it('should contain unique, fully configured questions', () => {
    const ids = JAVASCRIPT_QUIZ_QUESTIONS.map((question) => question.id);

    expect(JAVASCRIPT_QUIZ_QUESTIONS.length).toBe(26);
    expect(new Set(ids).size).toBe(ids.length);
    JAVASCRIPT_QUIZ_QUESTIONS.forEach((question) => {
      expect(question.optionKeys.length).toBe(4);
      expect(question.correctOption).toBeGreaterThanOrEqual(0);
      expect(question.correctOption).toBeLessThan(4);
    });
  });

  it('should create randomized sessions with the configured size', () => {
    const firstSession = createQuizSession(QUIZ_SESSION_SIZE, () => 0);
    const secondSession = createQuizSession(QUIZ_SESSION_SIZE, () => 0.999999);

    expect(firstSession.length).toBe(QUIZ_SESSION_SIZE);
    expect(secondSession.length).toBe(QUIZ_SESSION_SIZE);
    expect(firstSession.map((question) => question.id)).not.toEqual(secondSession.map((question) => question.id));
  });

  it('should preserve the correct answer when options are shuffled', () => {
    const sourceQuestion = JAVASCRIPT_QUIZ_QUESTIONS[0];
    const sessionQuestion = createQuizSession(JAVASCRIPT_QUIZ_QUESTIONS.length, () => 0).find(
      (question) => question.id === sourceQuestion.id
    );

    expect(sessionQuestion).toBeDefined();
    expect(sessionQuestion?.optionKeys[sessionQuestion.correctOption]).toBe(
      sourceQuestion.optionKeys[sourceQuestion.correctOption]
    );
  });
});
