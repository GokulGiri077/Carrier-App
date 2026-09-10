/**
 * Prompt Template for AI Roadmap Generation
 */
module.exports = function buildRoadmapPrompt(careerGoal, experienceLevel = 'Beginner', durationWeeks = 6) {
  return `
You are an expert tech career mentor. Create a highly structured, week-by-week learning roadmap for a student targeting the career goal: "${careerGoal}".
Experience Level: ${experienceLevel}
Duration: ${durationWeeks} weeks.

Return ONLY a valid JSON object matching the following structure:
{
  "careerGoal": "${careerGoal}",
  "totalWeeks": ${durationWeeks},
  "summary": "High-level summary of the career journey",
  "weeklyMilestones": [
    {
      "week": 1,
      "title": "Week 1 Title",
      "objective": "Main learning objective for the week",
      "topics": [
        {
          "name": "Topic Name",
          "subTopics": ["Sub-concept 1", "Sub-concept 2"],
          "estimatedHours": 4,
          "videos": [
            {
              "title": "Theory & Fundamentals Video",
              "platform": "YouTube",
              "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              "style_tag": "theory",
              "duration": "15 mins"
            },
            {
              "title": "Hands-on Practical Guide",
              "platform": "YouTube",
              "url": "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
              "style_tag": "example-based",
              "duration": "22 mins"
            }
          ]
        }
      ]
    }
  ]
}
`;
};
