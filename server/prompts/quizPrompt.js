/**
 * Prompt Template for Weekly AI Quiz Generation
 */
module.exports = function buildQuizPrompt(topicName, weekNumber, subTopics = []) {
  return `
You are an AI assessment creator. Generate a 4-question multiple choice quiz for Week ${weekNumber} Topic: "${topicName}".
Sub-topics covered: ${subTopics.join(', ')}.

CRITICAL REQUIREMENT: Each question MUST be tagged with the exact sub-topic it tests. This sub_topic tag powers the adaptive remediation engine.

Return ONLY a valid JSON array matching the structure:
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Why this answer is correct",
    "sub_topic": "Sub-concept name matching one from subTopics list"
  }
]
`;
};
