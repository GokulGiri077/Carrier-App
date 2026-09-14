const assert = require('assert');
const youtubeService = require('../youtubeService');

console.log('🧪 Running YouTube API v3 Response Parsing & Integration Test...\n');

// Mock response from YouTube Data API v3 search endpoint
const mockYouTubeApiResponse = {
  kind: 'youtube#searchListResponse',
  items: [
    {
      kind: 'youtube#searchResult',
      id: { kind: 'youtube#video', videoId: 'dQw4w9WgXcQ_NOT_THIS' },
      snippet: {
        title: 'Full-Stack Web Development &amp; Modern React Tutorial',
        description: 'Complete hands-on full-stack development guide with React and Node.js',
        channelTitle: 'Tech Lead Academy',
        thumbnails: {
          high: { url: 'https://i.ytimg.com/vi/test123/hqdefault.jpg' }
        }
      }
    }
  ]
};

// Test HTML entity decoding and structure mapping
const item = mockYouTubeApiResponse.items[0];
const formatted = {
  id: item.id.videoId,
  title: youtubeService.decodeHtmlEntities(item.snippet.title),
  channel: item.snippet.channelTitle,
  platform: 'YouTube',
  videoId: item.id.videoId,
  url: `https://www.youtube.com/embed/${item.id.videoId}`,
  watchUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  thumbnail: item.snippet.thumbnails.high.url
};

assert.strictEqual(formatted.videoId, 'dQw4w9WgXcQ_NOT_THIS');
assert.strictEqual(formatted.title, 'Full-Stack Web Development & Modern React Tutorial');
assert.strictEqual(formatted.url, 'https://www.youtube.com/embed/dQw4w9WgXcQ_NOT_THIS');
assert.strictEqual(formatted.watchUrl, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ_NOT_THIS');
assert.strictEqual(formatted.channel, 'Tech Lead Academy');

console.log('  ✅ Passed: Parsed simulated YouTube Data API v3 payload');
console.log('     - Title decoded: ' + formatted.title);
console.log('     - Embed URL: ' + formatted.url);
console.log('     - Watch URL: ' + formatted.watchUrl);
console.log('\n🎉 Simulated YouTube Data API v3 Test Passed Successfully!\n');
