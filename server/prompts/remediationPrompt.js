/**
 * Prompt Template for Adaptive Remediation Diagnostic & Recommendation
 */
module.exports = function buildRemediationPrompt(subTopic, issueType, userContext = {}) {
  return `
You are an adaptive AI learning assistant. A student is struggling with the sub-topic: "${subTopic}".
Issue Type diagnosed: ${issueType === 'video' ? 'Explanation / Clarity level (needs a different perspective or format)' : 'Application / Practical level (needs targeted practice hands-on exercise)'}.
Student context: Career Goal "${userContext.careerGoal || 'Software Engineer'}", attempt count ${userContext.attemptCount || 1}.

Return ONLY a valid JSON object matching the structure:
{
  "subTopic": "${subTopic}",
  "issueType": "${issueType}",
  "title": "Remediation Resource Title",
  "recommendationType": "${issueType === 'video' ? 'video' : 'exercise'}",
  "platform": "YouTube / CodeSandbox / Interactive Quiz",
  "resource_url": "https://www.youtube.com/watch?v=2LhktLMf3fU",
  "description": "Explanation of why this resource will bridge the gap.",
  "practiceTask": ${issueType === 'application' ? '"Implement a function that solves X using sub-topic concept."' : 'null'}
}
`;
};
