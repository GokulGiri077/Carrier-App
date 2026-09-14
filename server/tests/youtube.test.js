const assert = require('assert');
const youtubeService = require('../youtubeService');

console.log('🧪 Running YouTube Service & Video Recommendation Tests...\n');

// Test 1: Sanitize topic names
console.log('Test 1: Topic Name Sanitization');
const rawTopic = 'Modern JavaScript ES6+ & Async/Await (Part 1)';
const sanitized = youtubeService.sanitizeTopicName(rawTopic);
assert.strictEqual(sanitized, 'Modern JavaScript ES6+ & Async/Await');
console.log('  ✅ Passed (Cleaned "(Part 1)" suffix)\n');

// Test 2: HTML entity decoding
console.log('Test 2: HTML Entity Decoding');
const rawTitle = 'React &amp; Redux: Beginner&#39;s Complete &quot;Crash&quot; Course';
const decoded = youtubeService.decodeHtmlEntities(rawTitle);
assert.strictEqual(decoded, 'React & Redux: Beginner\'s Complete "Crash" Course');
console.log('  ✅ Passed (Decoded HTML entities correctly)\n');

// Test 3: Topic 1 - HTML & CSS
console.log('Test 3: Topic 1 Video Curation - HTML5 & CSS Grid Layouts');
(async () => {
  const topic1 = 'HTML5 & CSS Grid Layouts';
  const videos1 = await youtubeService.getVideosForTopic(topic1, ['HTML5 Semantic Elements', 'CSS Grid']);
  
  assert(videos1.length >= 2, 'Should return at least 2 videos');
  assert(!videos1.some(v => v.videoId === 'dQw4w9WgXcQ'), 'Must NOT return Rick Astley');
  assert(!videos1.some(v => v.url.includes('dQw4w9WgXcQ')), 'Embed URL must not be Rick Astley');
  assert(videos1[0].videoId && videos1[0].videoId.length > 5, 'Must have valid YouTube videoId');
  assert(videos1[0].url.startsWith('https://www.youtube.com/embed/'), 'Must have valid embed URL');
  assert(videos1[0].watchUrl.startsWith('https://www.youtube.com/watch?v='), 'Must have valid watch URL');
  console.log(`  ✅ Passed: Loaded ${videos1.length} videos`);
  console.log(`     - Theory: [${videos1[0].videoId}] "${videos1[0].title}" (${videos1[0].channel})`);
  console.log(`     - Practical: [${videos1[1].videoId}] "${videos1[1].title}" (${videos1[1].channel})\n`);

  // Test 4: Topic 2 - Modern JavaScript & Async
  console.log('Test 4: Topic 2 Video Curation - Modern JavaScript ES6+ & Async/Await');
  const topic2 = 'Modern JavaScript ES6+ & Async/Await';
  const videos2 = await youtubeService.getVideosForTopic(topic2, ['Promises & Async/Await', 'ES6 Modules']);
  
  assert(videos2.length >= 2, 'Should return at least 2 videos');
  assert(!videos2.some(v => v.videoId === 'dQw4w9WgXcQ'), 'Must NOT return Rick Astley');
  assert(videos2[0].title.toLowerCase().includes('javascript') || videos2[0].title.toLowerCase().includes('async'), 'Title must match topic');
  console.log(`  ✅ Passed: Loaded ${videos2.length} videos`);
  console.log(`     - Theory: [${videos2[0].videoId}] "${videos2[0].title}" (${videos2[0].channel})`);
  console.log(`     - Practical: [${videos2[1].videoId}] "${videos2[1].title}" (${videos2[1].channel})\n`);

  // Test 5: Topic 3 - React State Management & Components
  console.log('Test 5: Topic 3 Video Curation - React State Management & Components');
  const topic3 = 'React State Management & Components';
  const videos3 = await youtubeService.getVideosForTopic(topic3, ['Hooks & Context', 'Redux Toolkit']);
  
  assert(videos3.length >= 2, 'Should return at least 2 videos');
  assert(!videos3.some(v => v.videoId === 'dQw4w9WgXcQ'), 'Must NOT return Rick Astley');
  assert(videos3[0].title.toLowerCase().includes('react'), 'Title must match React topic');
  console.log(`  ✅ Passed: Loaded ${videos3.length} videos`);
  console.log(`     - Theory: [${videos3[0].videoId}] "${videos3[0].title}" (${videos3[0].channel})`);
  console.log(`     - Practical: [${videos3[1].videoId}] "${videos3[1].title}" (${videos3[1].channel})\n`);

  // Test 6: Topic 4 - AI/ML Python & NumPy
  console.log('Test 6: Topic 4 Video Curation - Python Data Structures & NumPy');
  const topic4 = 'Python Data Structures & NumPy';
  const videos4 = await youtubeService.getVideosForTopic(topic4, ['NumPy Arrays', 'Vectorized Operations']);
  
  assert(videos4.length >= 2, 'Should return at least 2 videos');
  assert(!videos4.some(v => v.videoId === 'dQw4w9WgXcQ'), 'Must NOT return Rick Astley');
  assert(videos4[0].title.toLowerCase().includes('python') || videos4[1].title.toLowerCase().includes('numpy'), 'Title must match Python/NumPy topic');
  console.log(`  ✅ Passed: Loaded ${videos4.length} videos`);
  console.log(`     - Theory: [${videos4[0].videoId}] "${videos4[0].title}" (${videos4[0].channel})`);
  console.log(`     - Practical: [${videos4[1].videoId}] "${videos4[1].title}" (${videos4[1].channel})\n`);

  console.log('🎉 All YouTube Video Recommendation Tests Passed Successfully!\n');
})();
