const assert = require('assert');
const { processQuizSubmission, handleRemediationFeedback, MAX_REMEDIATION_ATTEMPTS } = require('../remediationEngine');

console.log('🧪 Running Remediation Engine Tests...\n');

// Mock quiz data
const mockQuiz = {
  questions: [
    { id: 1, correct_answer: 0, sub_topic: 'State Management' },
    { id: 2, correct_answer: 1, sub_topic: 'State Management' },
    { id: 3, correct_answer: 2, sub_topic: 'API Integration' },
    { id: 4, correct_answer: 3, sub_topic: 'Routing' }
  ]
};

// Test 1: Quiz score >= 50% passes without remediation
console.log('Test 1: Quiz Score >= 50% Marks Topic Completed');
const passAnswers = [0, 1, 2, 0]; // 3/4 correct = 75%
const passResult = processQuizSubmission({ quiz: mockQuiz, userAnswers: passAnswers, topic: { id: 101 } });
assert.strictEqual(passResult.score, 75);
assert.strictEqual(passResult.needsRemediation, false);
assert.strictEqual(passResult.newTopicStatus, 'completed');
console.log('  ✅ Passed (75% score -> status: completed)\n');

// Test 2: Quiz score < 50% triggers needs_review and identifies failed sub-topics
console.log('Test 2: Quiz Score < 50% Triggers Needs Review & Sub-topic Tagging');
const failAnswers = [3, 0, 2, 0]; // 1/4 correct = 25%
const failResult = processQuizSubmission({ quiz: mockQuiz, userAnswers: failAnswers, topic: { id: 101 } });
assert.strictEqual(failResult.score, 25);
assert.strictEqual(failResult.needsRemediation, true);
assert.strictEqual(failResult.newTopicStatus, 'needs_review');
assert(failResult.failedSubTopics.includes('State Management'));
assert(failResult.failedSubTopics.includes('Routing'));
console.log('  ✅ Passed (25% score -> status: needs_review, failedSubTopics: State Management, Routing)\n');

// Test 3: Video-level issue suggests new video resource
console.log('Test 3: Video-level issue suggests alternative video explanation');
const videoFeedback = handleRemediationFeedback({
  userId: 1,
  topicId: 101,
  subTopic: 'State Management',
  issueType: 'video',
  existingLog: null
});
assert.strictEqual(videoFeedback.remediationLog.attempt_count, 1);
assert.strictEqual(videoFeedback.remediationLog.issue_type, 'video');
assert.strictEqual(videoFeedback.remediationLog.suggested_resource.type, 'video');
assert.strictEqual(videoFeedback.escalated, false);
console.log('  ✅ Passed (Attempt 1 video recommendation generated)\n');

// Test 4: Attempt count escalates to mentor after 3 attempts
console.log('Test 4: Attempt count >= 3 escalates to Human Mentor');
let logState = videoFeedback.remediationLog;
// Attempt 2
const attempt2 = handleRemediationFeedback({
  userId: 1,
  topicId: 101,
  subTopic: 'State Management',
  issueType: 'application',
  existingLog: logState
});
assert.strictEqual(attempt2.remediationLog.attempt_count, 2);
assert.strictEqual(attempt2.escalated, false);

// Attempt 3 -> Should trigger mentor escalation!
const attempt3 = handleRemediationFeedback({
  userId: 1,
  topicId: 101,
  subTopic: 'State Management',
  issueType: 'video',
  existingLog: attempt2.remediationLog
});
assert.strictEqual(attempt3.remediationLog.attempt_count, 3);
assert.strictEqual(attempt3.escalated, true);
assert(attempt3.message.includes('Mentor'));
console.log('  ✅ Passed (Attempt 3 escalated to AI/Human Mentor)\n');

console.log('🎉 All Remediation Engine Tests Passed Successfully!\n');
