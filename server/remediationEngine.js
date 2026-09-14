/**
 * Adaptive Remediation Business Logic Engine
 */

const MAX_REMEDIATION_ATTEMPTS = 3;

/**
 * Evaluates a quiz attempt score.
 * If score < 50%, updates topic status to 'needs_review' and flags sub-topics needing remediation.
 */
function processQuizSubmission({ quiz, userAnswers, topic, remediationLogs = [] }) {
  let correctCount = 0;
  const totalQuestions = quiz.questions.length;
  const subTopicFailures = {};

  quiz.questions.forEach((q, idx) => {
    const isCorrect = userAnswers[idx] === q.correct_answer;
    if (isCorrect) {
      correctCount++;
    } else {
      const subTopic = q.sub_topic || 'General Practice';
      subTopicFailures[subTopic] = (subTopicFailures[subTopic] || 0) + 1;
    }
  });

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const needsRemediation = scorePercentage < 50;

  return {
    score: scorePercentage,
    correctCount,
    totalQuestions,
    needsRemediation,
    newTopicStatus: needsRemediation ? 'needs_review' : 'completed',
    failedSubTopics: Object.keys(subTopicFailures)
  };
}

/**
 * Processes student feedback ("Did this help? No") and diagnoses next steps.
 * Tracks attempt count in remediation_log.
 * Escalates to mentor if attempt_count >= 3.
 */
const { getCuratedFallback } = require('./youtubeService');

function handleRemediationFeedback({ userId, topicId, subTopic, issueType, existingLog = null }) {
  const currentAttempts = existingLog ? existingLog.attempt_count + 1 : 1;
  const escalated = currentAttempts >= MAX_REMEDIATION_ATTEMPTS;

  let suggestedResource = null;
  if (!escalated) {
    if (issueType === 'video') {
      const fallback = getCuratedFallback(subTopic, subTopic);
      suggestedResource = {
        type: 'video',
        title: `Alternative Explanation: ${subTopic} (${fallback.theory.title})`,
        platform: 'YouTube',
        videoId: fallback.theory.id,
        url: `https://www.youtube.com/embed/${fallback.theory.id}`,
        watchUrl: `https://www.youtube.com/watch?v=${fallback.theory.id}`,
        style_tag: 'theory'
      };
    } else {
      suggestedResource = {
        type: 'exercise',
        title: `Targeted Practice: ${subTopic} Hands-on Sandbox`,
        platform: 'CodeSandbox / Interactive Console',
        url: 'https://codesandbox.io/s/new',
        style_tag: 'example-based'
      };
    }
  }

  const updatedLog = {
    id: existingLog ? existingLog.id : Date.now(),
    user_id: userId,
    topic_id: topicId,
    sub_topic: subTopic,
    issue_type: issueType,
    suggested_resource: suggestedResource,
    resolved: false,
    attempt_count: currentAttempts,
    escalated: escalated
  };

  return {
    remediationLog: updatedLog,
    escalated: escalated,
    message: escalated
      ? 'You have tried multiple explanations for this topic. An 1-on-1 AI Mentor live doubt session has been scheduled!'
      : `New ${issueType === 'video' ? 'video explanation' : 'practice exercise'} generated for ${subTopic}.`
  };
}

module.exports = {
  MAX_REMEDIATION_ATTEMPTS,
  processQuizSubmission,
  handleRemediationFeedback
};
