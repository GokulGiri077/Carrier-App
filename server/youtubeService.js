/**
 * YouTube Data API v3 Search Service
 * Dynamically queries YouTube for relevant, high-quality educational videos
 * based on roadmap topic and subtopic names.
 *
 * Includes:
 * - Query construction tailored for conceptual theory and hands-on coding
 * - In-memory TTL caching to conserve YouTube API quota (100 units/search)
 * - HTML entity decoding for clean video titles
 * - Curated fallback library of real, verified tech tutorials if API key is unset or quota exhausted
 */

// Simple in-memory cache to prevent burning daily quota: query -> { data, expiresAt }
const searchCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Decodes common HTML entities returned by YouTube API snippet titles
 */
function decodeHtmlEntities(text = '') {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
}

/**
 * Strips cosmetic suffixes like "(Part 1)", "(Part 2)" for cleaner search queries
 */
function sanitizeTopicName(name = '') {
  return name.replace(/\s*\(Part\s*\d+\)/gi, '').trim();
}

/**
 * Curated repository of verified, high-quality YouTube tutorial videos
 * Used as high-reliability fallback if YOUTUBE_API_KEY is missing or quota is exceeded.
 */
const VERIFIED_FALLBACK_CATALOG = {
  html_css: {
    theory: {
      id: 'pQN-pnXPaVg',
      title: 'HTML Full Course - Build a Website Tutorial',
      channel: 'freeCodeCamp.org',
      duration: '2 hours',
      style_tag: 'theory'
    },
    practical: {
      id: 'ieTHC78jcEc',
      title: 'CSS Grid Crash Course - Complete Guide with Examples',
      channel: 'Traversy Media',
      duration: '35 mins',
      style_tag: 'example-based'
    }
  },
  javascript_async: {
    theory: {
      id: 'W6NZfCO5SIk',
      title: 'JavaScript Tutorial for Beginners: Complete Fundamentals',
      channel: 'Programming with Mosh',
      duration: '48 mins',
      style_tag: 'theory'
    },
    practical: {
      id: 'PoRJizFvM7s',
      title: 'Async JS Crash Course - Callbacks, Promises, Async Await',
      channel: 'Traversy Media',
      duration: '25 mins',
      style_tag: 'example-based'
    }
  },
  react: {
    theory: {
      id: 'bMknfKXIFA8',
      title: 'React Course - Beginner to Advanced Components & Architecture',
      channel: 'freeCodeCamp.org',
      duration: '2 hours',
      style_tag: 'theory'
    },
    practical: {
      id: 'w7ejDZ8SWv8',
      title: 'React JS Crash Course - State, Hooks & Projects',
      channel: 'Traversy Media',
      duration: '1.5 hours',
      style_tag: 'example-based'
    }
  },
  node_express: {
    theory: {
      id: 'fBNz5xF-Kx4',
      title: 'Node.js & Express REST API Architecture Explained',
      channel: 'Traversy Media',
      duration: '1.5 hours',
      style_tag: 'theory'
    },
    practical: {
      id: 'pKd0Rpw7O48',
      title: 'Build a Complete REST API with Node.js and Express',
      channel: 'freeCodeCamp.org',
      duration: '2 hours',
      style_tag: 'example-based'
    }
  },
  database_sql: {
    theory: {
      id: 'HXV3zeQKqGY',
      title: 'SQL Tutorial - Full Database Course for Beginners',
      channel: 'freeCodeCamp.org',
      duration: '4 hours',
      style_tag: 'theory'
    },
    practical: {
      id: 'qw--VYLpxG4',
      title: 'PostgreSQL Crash Course & Relational Database Design',
      channel: 'Traversy Media',
      duration: '50 mins',
      style_tag: 'example-based'
    }
  },
  python_ai: {
    theory: {
      id: 'rfscVS0vtbw',
      title: 'Python for Beginners - Full Theory & Practical Course',
      channel: 'freeCodeCamp.org',
      duration: '4.5 hours',
      style_tag: 'theory'
    },
    practical: {
      id: 'QUT1VHiLmmI',
      title: 'NumPy & Pandas Crash Course for Data Science & ML',
      channel: 'freeCodeCamp.org',
      duration: '1 hour',
      style_tag: 'example-based'
    }
  },
  machine_learning: {
    theory: {
      id: 'i_LwzRVP7bg',
      title: 'Machine Learning for Everybody - Full Course',
      channel: 'freeCodeCamp.org',
      duration: '3.5 hours',
      style_tag: 'theory'
    },
    practical: {
      id: '7eh4d6sabA0',
      title: 'Python Machine Learning Tutorial & Scikit-Learn Models',
      channel: 'Programming with Mosh',
      duration: '1 hour',
      style_tag: 'example-based'
    }
  },
  general_tech: {
    theory: {
      id: 'zOjov-2OZ0E',
      title: 'Computer Science & Software Engineering Core Principles',
      channel: 'freeCodeCamp.org',
      duration: '1.5 hours',
      style_tag: 'theory'
    },
    practical: {
      id: '1rsUV1O25i4',
      title: 'Full Stack Development - Hands-on Project Implementation',
      channel: 'JavaScript Mastery',
      duration: '2 hours',
      style_tag: 'example-based'
    }
  }
};

/**
 * Finds the closest matching verified fallback videos for a given topic
 */
function getCuratedFallback(cleanTopic = '', cleanSubTopic = '') {
  const combined = `${cleanTopic} ${cleanSubTopic}`.toLowerCase();

  if (combined.includes('html') || combined.includes('css') || combined.includes('grid') || combined.includes('layout')) {
    return VERIFIED_FALLBACK_CATALOG.html_css;
  }
  if (combined.includes('async') || combined.includes('es6') || combined.includes('promise') || combined.includes('javascript')) {
    return VERIFIED_FALLBACK_CATALOG.javascript_async;
  }
  if (combined.includes('react') || combined.includes('component') || combined.includes('state')) {
    return VERIFIED_FALLBACK_CATALOG.react;
  }
  if (combined.includes('node') || combined.includes('express') || combined.includes('api') || combined.includes('backend')) {
    return VERIFIED_FALLBACK_CATALOG.node_express;
  }
  if (combined.includes('sql') || combined.includes('postgres') || combined.includes('database') || combined.includes('data mining')) {
    return VERIFIED_FALLBACK_CATALOG.database_sql;
  }
  if (combined.includes('machine learning') || combined.includes('deep learning') || combined.includes('pytorch') || combined.includes('scikit') || combined.includes('model')) {
    return VERIFIED_FALLBACK_CATALOG.machine_learning;
  }
  if (combined.includes('python') || combined.includes('numpy') || combined.includes('pandas') || combined.includes('data wrangling')) {
    return VERIFIED_FALLBACK_CATALOG.python_ai;
  }

  return VERIFIED_FALLBACK_CATALOG.general_tech;
}

/**
 * Formats a video item into our standardized video model
 */
function formatVideoItem({ videoId, title, channelTitle, description = '', style_tag = 'theory', subTopic = '', order = 1 }) {
  return {
    id: videoId,
    title: decodeHtmlEntities(title),
    channel: channelTitle || 'YouTube Educator',
    platform: 'YouTube',
    videoId,
    url: `https://www.youtube.com/embed/${videoId}`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    style_tag,
    subTopic: subTopic || 'Core Fundamentals',
    description: description.slice(0, 150),
    order
  };
}

/**
 * Executes a search query using YouTube Data API v3
 */
async function executeYouTubeSearch(query, maxResults = 3) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null; // Signals fallback should be used
  }

  // Check cache first
  const cacheKey = `${query}_${maxResults}`;
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const endpoint = new URL('https://www.googleapis.com/youtube/v3/search');
  endpoint.searchParams.set('part', 'snippet');
  endpoint.searchParams.set('type', 'video');
  endpoint.searchParams.set('videoEmbeddable', 'true');
  endpoint.searchParams.set('relevanceLanguage', 'en');
  endpoint.searchParams.set('maxResults', String(maxResults));
  endpoint.searchParams.set('q', query);
  endpoint.searchParams.set('key', apiKey.trim());

  const response = await fetch(endpoint.toString());

  if (!response.ok) {
    const errorText = await response.text();
    console.warn(`[YouTube API Warning] Status ${response.status}: ${errorText.slice(0, 200)}`);
    return null;
  }

  const data = await response.json();
  const items = (data.items || []).filter(item => item.id?.videoId);

  // Store in cache
  searchCache.set(cacheKey, {
    data: items,
    expiresAt: Date.now() + CACHE_TTL_MS
  });

  return items;
}

/**
 * Fetches real, topic-specific videos for a roadmap topic.
 * Generates at least two curated recommendations:
 * 1. Theory & Fundamentals video
 * 2. Hands-on Project & Practical Live Coding video
 *
 * @param {string} topicName - e.g. "React State Management & Components"
 * @param {Array<string>} subTopics - e.g. ["Redux Toolkit", "Context API", "Hooks"]
 * @returns {Promise<Array<object>>} - List of video objects with real YouTube embed URLs
 */
async function getVideosForTopic(topicName, subTopics = []) {
  const cleanTopic = sanitizeTopicName(topicName || 'Web Development');
  const subTopic1 = subTopics[0] || 'Fundamentals';
  const subTopic2 = subTopics[1] || 'Practical Example';

  const apiKey = (process.env.YOUTUBE_API_KEY || '').trim();

  // Try fetching real videos from YouTube Data API v3 if key exists
  if (apiKey) {
    try {
      // 1. Search for Conceptual / Theory video
      const theoryQuery = `${cleanTopic} ${subTopic1} tutorial full course guide`;
      // 2. Search for Practical / Hands-on video
      const practicalQuery = `${cleanTopic} ${subTopic2} build project hands on live coding`;

      const [theoryResults, practicalResults] = await Promise.all([
        executeYouTubeSearch(theoryQuery, 2),
        executeYouTubeSearch(practicalQuery, 2)
      ]);

      const videos = [];

      if (theoryResults && theoryResults.length > 0) {
        const topTheory = theoryResults[0];
        videos.push(
          formatVideoItem({
            videoId: topTheory.id.videoId,
            title: topTheory.snippet.title,
            channelTitle: topTheory.snippet.channelTitle,
            description: topTheory.snippet.description,
            style_tag: 'theory',
            subTopic: subTopic1,
            order: 1
          })
        );
      }

      if (practicalResults && practicalResults.length > 0) {
        // Pick a video that is different from theory
        const topPractical = practicalResults.find(p => p.id.videoId !== videos[0]?.videoId) || practicalResults[0];
        videos.push(
          formatVideoItem({
            videoId: topPractical.id.videoId,
            title: topPractical.snippet.title,
            channelTitle: topPractical.snippet.channelTitle,
            description: topPractical.snippet.description,
            style_tag: 'example-based',
            subTopic: subTopic2,
            order: 2
          })
        );
      }

      // Add extra related results if available
      if (theoryResults && theoryResults.length > 1) {
        const extraTheory = theoryResults[1];
        if (!videos.some(v => v.videoId === extraTheory.id.videoId)) {
          videos.push(
            formatVideoItem({
              videoId: extraTheory.id.videoId,
              title: extraTheory.snippet.title,
              channelTitle: extraTheory.snippet.channelTitle,
              description: extraTheory.snippet.description,
              style_tag: 'deep-dive',
              subTopic: subTopic1,
              order: 3
            })
          );
        }
      }

      if (videos.length >= 2) {
        return videos;
      }
    } catch (err) {
      console.warn('[YouTube API Error] Failed searching YouTube, using verified fallback:', err.message);
    }
  }

  // Fallback: Return verified high-quality educational videos matching the topic
  const fallbackCatalog = getCuratedFallback(cleanTopic, subTopic1);

  return [
    formatVideoItem({
      videoId: fallbackCatalog.theory.id,
      title: `${cleanTopic}: ${fallbackCatalog.theory.title}`,
      channelTitle: fallbackCatalog.theory.channel,
      style_tag: 'theory',
      subTopic: subTopic1,
      order: 1
    }),
    formatVideoItem({
      videoId: fallbackCatalog.practical.id,
      title: `${cleanTopic}: ${fallbackCatalog.practical.title}`,
      channelTitle: fallbackCatalog.practical.channel,
      style_tag: 'example-based',
      subTopic: subTopic2,
      order: 2
    })
  ];
}

module.exports = {
  getVideosForTopic,
  executeYouTubeSearch,
  getCuratedFallback,
  decodeHtmlEntities,
  sanitizeTopicName
};
