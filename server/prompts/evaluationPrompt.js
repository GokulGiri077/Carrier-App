/**
 * Prompt Template for AI Final Project Evaluation
 */
module.exports = function buildEvaluationPrompt(projectTitle, submissionContent, careerGoal) {
  return `
You are a senior tech lead and AI code evaluator. Evaluate the student's submitted project for career track: "${careerGoal}".
Project Title: "${projectTitle}"
Submission Content:
"""
${submissionContent}
"""

Evaluate against 5 core criteria (0 to 20 points each, total 100 points):
1. Code Quality & Formatting
2. Architectural Design & Structure
3. Feature Completeness & Functionality
4. Usability & User Experience
5. Industry Best Practices & Documentation

Passing score threshold is 70 / 100.

Return ONLY a valid JSON object matching the structure:
{
  "overallScore": 88,
  "passed": true,
  "summary": "Strong implementation of full-stack requirements with clean architecture.",
  "rubricBreakdown": {
    "codeQuality": { "score": 18, "max": 20, "feedback": "Clean modular functions with clear variable names." },
    "architecture": { "score": 17, "max": 20, "feedback": "Well-separated routes, controllers, and state management." },
    "completeness": { "score": 19, "max": 20, "feedback": "All primary weekly milestone features delivered." },
    "usability": { "score": 17, "max": 20, "feedback": "Responsive layout and smooth user interaction." },
    "bestPractices": { "score": 17, "max": 20, "feedback": "Included comprehensive README and basic error handling." }
  },
  "strengths": [
    "Modular architecture",
    "Comprehensive feature implementation"
  ],
  "improvements": [
    "Add more unit test coverage",
    "Optimize bundle size for production"
  ]
}
`;
};
