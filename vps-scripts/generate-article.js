'use strict';
const https = require('https');

function resolvedModel(role, fallback) {
  try {
    const cfg = JSON.parse(require('fs').readFileSync('/etc/llm_models.resolved.json', 'utf8'));
    return cfg[role] || fallback;
  } catch {
    return fallback;
  }
}

const GROQ_KEY     = process.env.GROQ_API_KEY || '';
const RESEND_KEY   = '<REDACTED_RESEND_KEY>';
const GITHUB_TOKEN = '<REDACTED_GITHUB_TOKEN>';
const REPO         = 'KlickifyAgency/missloulocal';
const DATA_PATH    = 'src/app/articles/data';
// Model id is NOT hardcoded on purpose. /etc/llm_models.resolved.json is
// refreshed daily by /usr/local/bin/llm_model_guard.py from Groq's live /models
// list. Groq retired llama-3.3-70b-versatile on 2026-08-16 and this cron died
// silently every Friday for three weeks because the id was baked into this line.
// The second argument is only a last-resort fallback if that file is unreadable.
const MODEL        = resolvedModel('groq_large', 'openai/gpt-oss-120b');

const TOPICS = [
  { slug: 'natchez-trace-parkway-visitor-guide',          title: 'Natchez Trace Parkway — Complete Visitor Guide',              category: 'tourism'  },
  { slug: 'antebellum-homes-natchez-ms',                  title: 'Antebellum Homes in Natchez MS — Visitor Guide',             category: 'tourism'  },
  { slug: 'ghost-tours-natchez-ms',                       title: 'Ghost Tours in Natchez MS — Everything to Know',             category: 'tourism'  },
  { slug: 'moving-to-natchez-mississippi',                title: 'Moving to Natchez Mississippi — Relocation Guide',           category: 'living'   },
  { slug: 'natchez-pilgrimage-guide',                     title: 'Natchez Pilgrimage — Complete Guide to Home Tours',          category: 'events'   },
  { slug: 'under-the-hill-natchez-history',               title: 'Under-the-Hill Natchez — History & What to See Today',      category: 'history'  },
  { slug: 'best-bbq-natchez-ms',                          title: 'Best BBQ in Natchez MS — Smoked Meats & Local Joints',      category: 'food'     },
  { slug: 'natchez-state-park-guide',                     title: 'Natchez State Park — Hiking Trails & Outdoor Activities',   category: 'outdoors' },
  { slug: 'weekend-getaway-natchez-ms',                   title: 'Weekend Getaway to Natchez MS — Perfect 2-Day Itinerary',   category: 'tourism'  },
  { slug: 'natchez-ms-history-overview',                  title: 'History of Natchez MS — From 1716 to Today',               category: 'history'  },
  { slug: 'fishing-natchez-ms-mississippi-river',         title: 'Fishing in Natchez MS — Mississippi River & Beyond',       category: 'outdoors' },
  { slug: 'best-breakfast-brunch-natchez-ms',             title: 'Best Breakfast & Brunch in Natchez MS',                    category: 'food'     },
  { slug: 'natchez-wedding-venues',                       title: 'Best Wedding Venues in Natchez MS — Mansions & More',      category: 'events'   },
  { slug: 'natchez-national-historical-park',             title: 'Natchez National Historical Park — Visitor Guide',          category: 'tourism'  },
  { slug: 'pet-friendly-natchez-ms',                      title: 'Pet-Friendly Natchez MS — Hotels, Parks & Activities',     category: 'living'   },
  { slug: 'cost-of-living-natchez-ms',                    title: 'Cost of Living in Natchez MS — Is It Affordable?',         category: 'living'   },
  { slug: 'best-coffee-shops-natchez-ms',                 title: 'Best Coffee Shops in Natchez MS',                          category: 'food'     },
  { slug: 'natchez-ms-annual-events-calendar',            title: 'Natchez MS Annual Events — Complete Calendar',             category: 'events'   },
  { slug: 'cycling-natchez-trace-parkway',                title: 'Cycling the Natchez Trace Parkway — What to Know',         category: 'outdoors' },
  { slug: 'family-activities-natchez-ms',                 title: 'Best Family Activities in Natchez MS',                     category: 'tourism'  },
  { slug: 'natchez-ms-day-trips',                         title: 'Best Day Trips from Natchez MS — Within 2 Hours',          category: 'tourism'  },
  { slug: 'real-estate-market-natchez-ms-2026',           title: 'Natchez MS Real Estate Market — 2026 Overview',            category: 'living'   },
  { slug: 'historic-cemeteries-natchez-ms',               title: 'Historic Cemeteries in Natchez MS — A Walking Guide',      category: 'history'  },
  { slug: 'natchez-under-the-hill-restaurants-bars',      title: 'Restaurants & Bars Under-the-Hill Natchez MS',             category: 'food'     },
  { slug: 'african-american-history-natchez-ms',          title: 'African American History in Natchez MS — A Deep Dive',    category: 'history'  },
  { slug: 'best-catfish-natchez-ms',                      title: 'Best Catfish in Natchez MS — Where to Find It',            category: 'food'     },
  { slug: 'natchez-ms-neighborhoods-guide',               title: 'Neighborhoods in Natchez MS — Guide for New Residents',    category: 'living'   },
  { slug: 'spring-in-natchez-ms',                         title: 'Spring in Natchez MS — Events, Blooms & Things to Do',     category: 'tourism'  },
  { slug: 'stanton-hall-natchez-history',                 title: 'Stanton Hall Natchez — History, Tours & What to Expect',  category: 'history'  },
  { slug: 'longwood-octagon-house-natchez',               title: 'Longwood — The Unfinished Octagon Mansion of Natchez MS', category: 'history'  },
  { slug: 'natchez-ms-job-market-economy',                title: 'Jobs & Economy in Natchez MS — What to Know',             category: 'living'   },
  { slug: 'best-steakhouse-natchez-ms',                   title: 'Best Steakhouses in Natchez MS',                           category: 'food'     },
  { slug: 'natchez-trace-camping-guide',                  title: 'Camping on the Natchez Trace — Guide & Campsite List',    category: 'outdoors' },
  { slug: 'vidalia-louisiana-miss-lou-guide',             title: 'Vidalia LA — The Louisiana Side of the Miss-Lou Area',    category: 'living'   },
  { slug: 'natchez-ms-schools-education-guide',           title: 'Schools in Natchez MS — Public, Private & Higher Ed',     category: 'living'   },
  { slug: 'historic-silver-street-natchez',               title: "Silver Street Natchez MS — History & What's There Now",   category: 'history'  },
  { slug: 'natchez-ms-fall-autumn-guide',                 title: 'Fall in Natchez MS — Events, Colors & Things to Do',      category: 'tourism'  },
  { slug: 'best-fried-chicken-natchez-ms',                title: 'Best Fried Chicken in Natchez MS — Local Favorites',      category: 'food'     },
  { slug: 'natchez-ms-healthcare-hospitals',              title: 'Healthcare in Natchez MS — Hospitals, Clinics & Doctors', category: 'living'   },
  { slug: 'christmas-holidays-natchez-ms',                title: 'Christmas & Holidays in Natchez MS — Events & Lights',   category: 'events'   },
  { slug: 'dunleith-historic-inn-natchez',                title: 'Dunleith Historic Inn Natchez — Review & What to Expect', category: 'tourism'  },
  { slug: 'natchez-ms-photography-spots',                 title: 'Best Photography Spots in Natchez MS',                    category: 'tourism'  },
  { slug: 'miss-lou-area-guide',                          title: 'Miss-Lou Area Guide — Natchez MS & Vidalia LA',           category: 'living'   },
  { slug: 'natchez-ms-nightlife-bars',                    title: 'Nightlife in Natchez MS — Bars, Live Music & More',       category: 'food'     },
  { slug: 'alcorn-state-university-guide',                title: 'Alcorn State University — Guide for Prospective Students',category: 'living'   },
  { slug: 'natchez-ms-hidden-gems',                       title: 'Hidden Gems in Natchez MS — What Locals Know',            category: 'tourism'  },
  { slug: 'rosalie-mansion-natchez-guide',                title: 'Rosalie Mansion Natchez — History, Tours & Visitor Tips', category: 'history'  },
  { slug: 'hiking-trails-near-natchez-ms',                title: 'Best Hiking Trails Near Natchez MS',                      category: 'outdoors' },
  { slug: 'natchez-ms-volunteer-community',               title: 'Volunteering & Community Organizations in Natchez MS',    category: 'living'   },
  { slug: 'visiting-natchez-on-a-budget',                 title: 'Visiting Natchez MS on a Budget — Free & Cheap Things',  category: 'tourism'  },
  { slug: 'retiring-in-natchez-ms',                       title: 'Retiring in Natchez MS — Is It a Good Choice?',          category: 'living'   },
  { slug: 'natchez-ms-arts-culture-scene',                title: 'Arts & Culture Scene in Natchez MS',                     category: 'tourism'  },
];

function request(options, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function githubGet(path) {
  return request({
    hostname: 'api.github.com',
    path,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + GITHUB_TOKEN,
      'User-Agent': 'missloulocal-cron',
      'Accept': 'application/vnd.github+json',
    },
  });
}

function githubPut(path, body) {
  return request({
    hostname: 'api.github.com',
    path,
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + GITHUB_TOKEN,
      'User-Agent': 'missloulocal-cron',
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
  }, body);
}

async function getPublishedSlugs() {
  const res = await githubGet('/repos/' + REPO + '/contents/' + DATA_PATH);
  if (res.status !== 200 || !Array.isArray(res.body)) return [];
  return res.body
    .filter(f => f.name.endsWith('.json') && f.name !== 'index.json')
    .map(f => f.name.replace('.json', ''));
}

const MIN_DAYS_BETWEEN_ARTICLES = 7;

// Cadence lives here, not in the crontab. The cron fires daily; this decides
// whether today is a publish day. That way a failed run retries tomorrow instead
// of waiting a full week for the next Friday.
async function daysSinceLastArticle() {
  const res = await githubGet('/repos/' + REPO + '/contents/' + DATA_PATH + '/index.json');
  if (res.status !== 200 || !res.body || !res.body.content) return Infinity;
  let index;
  try {
    index = JSON.parse(Buffer.from(res.body.content, 'base64').toString());
  } catch {
    return Infinity;
  }
  if (!Array.isArray(index) || !index.length) return Infinity;
  const newest = index
    .map(a => Date.parse(a.published_at))
    .filter(t => !Number.isNaN(t))
    .sort((a, b) => b - a)[0];
  if (newest === undefined) return Infinity;
  return (Date.now() - newest) / 86400000;
}

async function generateArticle(topic) {
  const systemPrompt = `You are a long-time resident of Natchez, Mississippi who writes for MissLouLocal.com — a hyperlocal directory for the Natchez and Miss-Lou area. You know this town deeply: the streets, the people, the history, the quirks.

Your writing rules — follow every one:
- Write like a real person, not a content mill. Vary your sentence length. Short punchy sentences mixed with longer ones that breathe.
- Use specific local details: real street names (Canal St, Main St, US-61, Liberty Rd), real landmarks (Stanton Hall, Emerald Mound, King's Tavern, Under-the-Hill, the bluff), real context.
- Never write: "In conclusion", "To summarize", "It's worth noting", "It's important to", "Dive into", "Delve into", "This article will", "In this guide we will", "Look no further".
- No filler sentences that say nothing. Every sentence earns its place.
- Write in second person (you/your) or first person plural (we/our) — never passive academic voice.
- Paragraphs in the sections must be prose only — no bullet lists, no numbered lists.
- Honest tone: admit when something is crowded, overpriced, seasonal, or worth skipping.
- Each section body must be at least 250 words of solid paragraph prose.
- The intro must be 120-150 words.
- Total article must exceed 1,400 words across intro + all sections + FAQs.`;

  const userPrompt = `Write a complete article for MissLouLocal.com on this topic: "${topic.title}"

Return ONLY valid JSON with no markdown fences, no extra commentary, nothing before or after the JSON object:

{
  "title": "SEO page title, under 60 characters, includes primary keyword",
  "h1": "H1 heading — can differ from title, more compelling/conversational",
  "meta_description": "Meta description 145-158 characters, includes primary keyword, ends with a reason to click",
  "intro": "120-150 words. Hook the reader. Include the primary keyword naturally. Set up what the article covers without listing it robotically. Write like you're talking to someone at a coffee shop.",
  "sections": [
    {
      "heading": "First H2 — specific and useful, includes keyword if natural",
      "body": "At least 250 words of paragraph prose. Real local details. Specific. No lists. Varied sentence rhythm. Honest."
    },
    {
      "heading": "Second H2",
      "body": "At least 250 words of paragraph prose."
    },
    {
      "heading": "Third H2",
      "body": "At least 250 words of paragraph prose."
    },
    {
      "heading": "Fourth H2",
      "body": "At least 250 words of paragraph prose."
    }
  ],
  "faqs": [
    {"q": "Question people actually search for about this topic", "a": "Direct answer, 60-90 words, specific, no fluff"},
    {"q": "Another real search query question", "a": "Direct answer, 60-90 words"},
    {"q": "Another real search query question", "a": "Direct answer, 60-90 words"},
    {"q": "Another real search query question", "a": "Direct answer, 60-90 words"},
    {"q": "Another real search query question", "a": "Direct answer, 60-90 words"}
  ],
  "keywords": ["primary keyword", "secondary keyword", "long-tail phrase 1", "long-tail phrase 2", "long-tail phrase 3", "long-tail phrase 4"]
}`;

  const res = await request({
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + GROQ_KEY,
    },
  }, {
    model: MODEL,
    max_completion_tokens: 8000,
    reasoning_effort: 'low',
    temperature: 0.75,
    response_format: { type: "json_object" },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  if (res.status !== 200) throw new Error('Groq API ' + res.status + ': ' + JSON.stringify(res.body));
  const raw = res.body.choices[0].message.content.trim();
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object in Groq response: ' + raw.slice(0, 300));
  return JSON.parse(match[0]);
}

// Rejects thin or malformed articles so we never publish a stub to a live page.
function validateArticle(a) {
  const problems = [];
  for (const f of ['title', 'h1', 'meta_description', 'intro']) {
    if (typeof a[f] !== 'string' || !a[f].trim()) problems.push('missing/empty ' + f);
  }
  if (!Array.isArray(a.sections) || a.sections.length < 3) {
    problems.push('sections: ' + (Array.isArray(a.sections) ? a.sections.length : 'not an array') + ' (need >= 3)');
  }
  if (!Array.isArray(a.faqs) || a.faqs.length < 3) {
    problems.push('faqs: ' + (Array.isArray(a.faqs) ? a.faqs.length : 'not an array') + ' (need >= 3)');
  }
  if (!Array.isArray(a.keywords) || a.keywords.length < 3) {
    problems.push('keywords: ' + (Array.isArray(a.keywords) ? a.keywords.length : 'not an array') + ' (need >= 3)');
  }
  const words = JSON.stringify(a).split(' ').length;
  if (words < 700) problems.push('too short: ~' + words + ' words (need >= 700)');
  return problems;
}

async function generateValidArticle(topic) {
  let last;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const article = await generateArticle(topic);
    const problems = validateArticle(article);
    if (!problems.length) return article;
    last = problems;
    console.log('Attempt ' + attempt + ' rejected: ' + problems.join('; '));
  }
  throw new Error('Article failed validation twice: ' + last.join('; '));
}

async function pushArticle(slug, article, category) {
  const filePath = DATA_PATH + '/' + slug + '.json';
  const payload = { ...article, slug, topic_category: category, published_at: new Date().toISOString() };
  const content = Buffer.from(JSON.stringify(payload, null, 2)).toString('base64');

  const existing = await githubGet('/repos/' + REPO + '/contents/' + filePath);
  const sha = existing.status === 200 ? existing.body.sha : undefined;

  const body = {
    message: 'content: auto-publish article — ' + slug,
    content,
    ...(sha ? { sha } : {}),
  };

  return githubPut('/repos/' + REPO + '/contents/' + filePath, body);
}

async function updateIndex(slug, article, category) {
  const indexPath = DATA_PATH + '/index.json';
  let index = [];

  const existing = await githubGet('/repos/' + REPO + '/contents/' + indexPath);
  let sha;
  if (existing.status === 200) {
    sha = existing.body.sha;
    try { index = JSON.parse(Buffer.from(existing.body.content, 'base64').toString()); } catch {}
  }

  index = index.filter(a => a.slug !== slug);
  index.unshift({
    slug,
    title: article.title,
    h1: article.h1,
    meta_description: article.meta_description,
    topic_category: category,
    published_at: new Date().toISOString(),
  });

  const content = Buffer.from(JSON.stringify(index, null, 2)).toString('base64');
  await githubPut('/repos/' + REPO + '/contents/' + indexPath, {
    message: 'content: update articles index — ' + slug,
    content,
    ...(sha ? { sha } : {}),
  });
}

async function main() {
  console.log('[' + new Date().toISOString() + '] generate-article starting');

  if (!GROQ_KEY) { console.error('ERROR: GROQ_API_KEY not set in .env'); process.exit(1); }

  const days = await daysSinceLastArticle();
  if (days < MIN_DAYS_BETWEEN_ARTICLES && !process.env.FORCE_PUBLISH) {
    console.log('Last article was ' + days.toFixed(1) + ' days ago (need ' +
                MIN_DAYS_BETWEEN_ARTICLES + ') — nothing to do today.');
    return;
  }

  const published = await getPublishedSlugs();
  console.log('Published articles:', published.length);

  const next = TOPICS.find(t => !published.includes(t.slug));
  if (!next) { console.log('All 52 topics published — restart cycle or add more topics'); return; }

  console.log('Generating:', next.slug);
  const article = await generateValidArticle(next);

  const wordCount = JSON.stringify(article).split(' ').length;
  console.log('Approximate word count:', wordCount);

  const push = await pushArticle(next.slug, article, next.category);
  if (push.status !== 201 && push.status !== 200) {
    console.error('GitHub push failed:', push.status, JSON.stringify(push.body));
    process.exit(1);
  }
  console.log('Article pushed to GitHub');

  await updateIndex(next.slug, article, next.category);

  // Trigger Vercel deploy
  await request({
    hostname: 'api.vercel.com',
    path: '/v1/integrations/deploy/prj_rK680Njb6tB4b8d2KMWRG8VOy2jM/NBpT7o7L2B',
    method: 'POST',
    headers: { 'Content-Length': 0 },
  });
  console.log('Vercel deploy triggered');
  console.log('Index updated');

  // Post to Facebook (image + caption), non-fatal if it fails
  try {
    const mllFb = require('./mll_fb_image.js');
    await mllFb.generateAndPost({
      slug: next.slug,
      h1: article.h1,
      meta_description: article.meta_description,
      topic_category: next.category,
    });
    console.log('Facebook post: OK');
  } catch (e) {
    console.log('Facebook post: SKIPPED/FAIL —', e.message);
  }

  console.log('SUCCESS —', next.slug, '— Vercel auto-deploys in ~60s');
}

function alertFailure(message) {
  return new Promise(resolve => {
    const payload = JSON.stringify({
      from: 'MissLouLocal VPS Monitor <noreply@klickifyagency.com>',
      to: 'support@klickifyagency.com',
      subject: 'MissLouLocal: weekly article cron FAILED - ' + new Date().toISOString(),
      html: '<h2>generate-article.js failed</h2><pre>' + String(message).replace(/</g, '&lt;') + '</pre>' +
            '<p>Log: /home/missloulocal-crons/generate-article.log on the VPS.</p>',
    });
    const req = https.request({
      hostname: 'api.resend.com', path: '/emails', method: 'POST', timeout: 15000,
      headers: {
        'Authorization': 'Bearer ' + RESEND_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, res => { res.on('data', () => {}); res.on('end', () => resolve(res.statusCode)); });
    req.on('error', () => resolve('send error'));
    req.on('timeout', () => { req.destroy(); resolve('send timeout'); });
    req.write(payload); req.end();
  });
}

main().catch(async err => {
  console.error('FATAL:', err.message);
  const code = await alertFailure(err.message);
  console.error('alert email status:', code);
  process.exit(1);
});
