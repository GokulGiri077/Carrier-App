const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'carrier_database.json');

// Initial Schema State
const initialSchema = {
  users: [], // { id, name, email, password_hash, career_goal, created_at }
  roadmaps: [], // { id, user_id, career_goal, roadmap_json, created_at }
  topics: [], // { id, roadmap_id, week_number, topic_name, status }
  videos: [], // { id, topic_id, platform, url, style_tag, order }
  quizzes: [], // { id, topic_id, week_number, questions_json, user_id }
  quiz_attempts: [], // { id, quiz_id, user_id, score, sub_topic_breakdown_json, violation_flags, submitted_at }
  remediation_log: [], // { id, user_id, topic_id, issue_type, suggested_resource, resolved, attempt_count }
  final_projects: [], // { id, user_id, roadmap_id, submission_url, ai_evaluation_json, status, submitted_at }
  certificates: [] // { id, user_id, project_id, certificate_url, issued_at }
};

function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    saveDb(initialSchema);
    return JSON.parse(JSON.stringify(initialSchema));
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading DB, resetting schema:', err);
    saveDb(initialSchema);
    return JSON.parse(JSON.stringify(initialSchema));
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const db = {
  get: () => loadDb(),
  save: (data) => saveDb(data),
  
  // Helper ID generator
  nextId: (table) => {
    const data = loadDb();
    const items = data[table] || [];
    return items.length > 0 ? Math.max(...items.map(i => i.id || 0)) + 1 : 1;
  }
};

module.exports = db;
