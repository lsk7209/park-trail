import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { editorialPosts } from "./editorial-posts.mjs";
import { expansionPosts } from "./editorial-expansion.mjs";

const root = process.cwd();
const site = JSON.parse(await readFile(join(root, "data/site-content.json"), "utf8"));
const origin = (process.env.SITE_ORIGIN || "https://www.gradienttrail.com").replace(/\/$/, "");
const approvalPosts = [...editorialPosts.slice(0, 10), ...expansionPosts].slice(0, 100);
const adsenseClient = process.env.ADSENSE_CLIENT || "ca-pub-3050601904412736";
const ga4Id = process.env.GA4_ID || "";

const filters = [
  {
    slug: "easy-flat-trails",
    label: "Easy flat trails",
    title: (park) => `Easy flat trails in ${park.name}`,
    description: "Lower-grade candidates sorted by gentleness score.",
    predicate: (trail) => trail.maxGrade <= 5.5
  },
  {
    slug: "trails-under-2-miles",
    label: "Trails under 2 miles",
    title: (park) => `Trails under 2 miles in ${park.name}`,
    description: "Short candidates for groups that want a compact route.",
    predicate: (trail) => trail.distance < 2
  },
  {
    slug: "kid-friendly",
    label: "Kid friendly trails",
    title: (park) => `Kid-friendly trails in ${park.name}`,
    description: "Routes with stronger family-fit scores and practical planning notes.",
    predicate: (trail) => trail.family >= 85
  }
];

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function relPrefix(pathFromRoot) {
  const depth = pathFromRoot.split("/").length - 1;
  return depth ? "../".repeat(depth) : "";
}

function header(prefix, active = "") {
  const nav = [
    ["Trails", "us-trails/trails.html", "trails"],
    ["Parks", "us-trails/parks.html", "parks"],
    ["Calculator", "us-trails/calculator.html", "calculator"],
    ["Compare", "us-trails/compare.html", "compare"],
    ["Blog", "blog/index.html", "blog"]
  ].map(([label, href, key]) => `<a href="${prefix}${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `<header class="site-head"><div class="wrap"><a class="brand" href="${prefix}index.html"><span class="brand-mark" aria-hidden="true">&#9651;</span><span>Gradient Trail <span class="brand-sub">National park trail fit</span></span></a><nav class="nav" aria-label="Primary">${nav}</nav></div></header>`;
}

function footer(prefix) {
  return `<footer class="site-foot trust"><div class="wrap"><div><b>Gradient Trail</b><br>Terrain-first national park trail planning. Always verify current official park conditions before visiting.</div><nav class="foot-links" aria-label="Footer"><a href="${prefix}about.html">About</a><a href="${prefix}contact.html">Contact</a><a href="${prefix}privacy.html">Privacy</a><a href="${prefix}terms.html">Terms</a><a href="${prefix}editorial-policy.html">Editorial Policy</a><a href="${prefix}disclaimer.html">Disclaimer</a></nav></div></footer>`;
}

function schemaTag(schema) {
  return schema ? `\n  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>` : "";
}

function trackingTags() {
  const adsense = adsenseClient ? `\n  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(adsenseClient)}" crossorigin="anonymous"></script>` : "";
  const ga4 = /^G-[A-Z0-9]+$/.test(ga4Id) ? `\n  <script async src="https://www.googletagmanager.com/gtag/js?id=${esc(ga4Id)}"></script>\n  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${esc(ga4Id)}");</script>` : "";
  return `${adsense}${ga4}`;
}

function doc({ path, title, description, active, body, noindex = false, schema }) {
  const prefix = relPrefix(path);
  const canonical = `${origin}/${path}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex,follow">' : ""}
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${prefix}us-trails/assets/topo.css">
  ${trackingTags()}
  ${schemaTag(schema || {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": canonical
  })}
</head>
<body class="topo-bg">
  ${header(prefix, active)}
  ${body(prefix)}
  ${footer(prefix)}
</body>
</html>
`;
}

function trailUrl(trail) {
  return `us-trails/parks/${trail.parkSlug}/trails/${trail.slug}.html`;
}

function parkUrl(park) {
  return `us-trails/parks/${park.slug}.html`;
}

function metricCards(trail) {
  return `<div class="card-grid">
    <article class="site-card"><div class="site-card-body"><h3>${trail.gentle}/100 gentleness</h3><p>Calculated from short distance, low gain, max grade and route shape.</p></div></article>
    <article class="site-card"><div class="site-card-body"><h3>${trail.family}/100 family fit</h3><p>Weights route length, climb and simple logistics for mixed-age groups.</p></div></article>
    <article class="site-card"><div class="site-card-body"><h3>${trail.difficulty}/100 difficulty</h3><p>Objective terrain difficulty, not a subjective review rating.</p></div></article>
  </div>`;
}

function slugifyAnchor(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function articleToc(post) {
  const headings = [
    ...post.sections.map(([heading]) => heading),
    post.decisionTool?.title || articleDecisionToolTitle(post),
    "How to use this guide on a real park day",
    "Where to go next on Gradient Trail",
    "Field takeaways",
    "Sources and verification notes"
  ].filter(Boolean);
  return `<nav class="toc-panel" aria-label="Article table of contents"><div class="toc-title">Table of contents</div><ol>${headings.map((heading) => `<li><a href="#${slugifyAnchor(heading)}">${esc(heading)}</a></li>`).join("")}</ol></nav>`;
}

function articleDecisionToolTitle(post) {
  const tool = legacyDecisionTools[post.slug];
  return tool?.title;
}

const legacyDecisionTools = {
    "choose-gentle-national-park-trail": {
      title: "Easy-label audit before you trust a trail",
      intro: "Use this quick audit when a park page, map app or travel article calls a route easy. The goal is to turn a vague label into a decision you can defend for your specific group.",
      rows: [
        ["Distance", "Is the mileage comfortable for the slowest person after stops and the return leg?", "Keep only if the total outing still fits the day."],
        ["Grade", "Is there a short steep pitch that the word easy hides?", "Check max grade, not just total gain."],
        ["Surface", "Is the route paved, boardwalk, gravel, sand, roots, rock or mixed?", "Match surface to shoes, stroller, mobility needs and fatigue."],
        ["Current condition", "Could alerts, weather, closures or shuttle changes override the plan?", "Use the official park page as the final check."]
      ]
    },
    "gentle-national-park-trails-first-time-visitors": {
      title: "First-visit trail scorecard",
      intro: "A first park hike should reduce friction. Give each factor a simple yes/no before you choose the route.",
      rows: [
        ["Clear start", "Trailhead or shuttle stop is easy to identify.", "Reduces arrival stress."],
        ["Obvious reward", "Waterfall, lake, rim, meadow, geology or historic feature.", "Keeps the route emotionally worth it."],
        ["Simple exit", "Out-and-back turnaround or short loop with few confusing junctions.", "Protects tired groups."],
        ["Official status checked", "Current conditions and alerts reviewed the same day.", "Prevents stale-plan mistakes."]
      ]
    },
    "elevation-gain-family-hike-guide": {
      title: "How gain usually translates for families",
      intro: "These bands are planning prompts, not rules. Heat, altitude, surface and ability can move a route into a harder band.",
      rows: [
        ["0-50 ft", "Often gentle when distance is short.", "Still check surface and exposure."],
        ["50-150 ft", "Usually manageable if grade is gradual.", "Plan one or two breaks with kids."],
        ["150-300 ft", "Can feel like a real climb for casual groups.", "Check where the climb occurs on the route."],
        ["300+ ft", "No longer a casual family assumption.", "Needs a more deliberate plan and backup route."]
      ]
    },
    "gentle-trails-big-views": {
      title: "Where big views hide without big climbs",
      intro: "The best low-climb scenic routes often use landscape position rather than elevation gain.",
      rows: [
        ["Rim walk", "Views come from an existing edge.", "Watch exposure, heat and crowding."],
        ["Lake loop", "Reflection and open sightlines create reward.", "Check mud, snow and shoreline surface."],
        ["Meadow path", "Wide views without a summit objective.", "Check sun exposure and seasonal closures."],
        ["River corridor", "Sound, shade and movement create interest.", "Check flood alerts and bridge closures."]
      ]
    },
    "conservative-accessibility-national-park-trails": {
      title: "Access wording precision table",
      intro: "Use the most precise claim the evidence supports. Do not upgrade a weak signal into a strong promise.",
      rows: [
        ["Paved", "Surface material only.", "Does not prove grade, width or current condition."],
        ["Boardwalk", "Constructed surface.", "May still include slopes, gaps, closures or crowding."],
        ["Stroller-friendly", "Family convenience claim.", "Not the same as wheelchair accessibility."],
        ["Wheelchair accessible", "Strong access claim.", "Should rely on official or clearly documented access information."]
      ]
    },
    "national-park-hike-with-kids-planning": {
      title: "Family hike preflight checklist",
      intro: "A good family route is the one that still works when energy, heat and timing are less perfect than expected.",
      rows: [
        ["Turnaround plan", "Know where you can stop without drama.", "Protects mood and safety."],
        ["Shade and heat", "Check exposed sections and time of day.", "Short trails can still be hot."],
        ["Facilities", "Restrooms, water and parking are known.", "Reduces preventable stress."],
        ["Attention span", "Route has small rewards before the final destination.", "Keeps kids engaged."]
      ]
    },
    "short-national-park-trails-real-hike": {
      title: "Short-route quality test",
      intro: "A short route earns its place when it feels complete, not when it merely pads an itinerary.",
      rows: [
        ["Immersion", "The route quickly leaves the parking-lot feeling.", "Creates a real trail memory."],
        ["Scene change", "Forest, water, meadow, geology or view evolves.", "Prevents the walk from feeling like an errand."],
        ["Route continuity", "The path has a clear arc or loop.", "Makes short mileage feel intentional."],
        ["Low hidden friction", "No surprise staircase, sand slog or confusing junction.", "Keeps the route compact in practice."]
      ]
    },
    "trail-surface-matters-distance": {
      title: "Surface impact guide",
      intro: "Surface can change effort more than distance does. Pair this table with grade before deciding.",
      rows: [
        ["Pavement", "Predictable underfoot.", "Still check slope and heat."],
        ["Compacted gravel", "Often comfortable when dry and maintained.", "Can be loose after weather or repairs."],
        ["Sand", "Short mileage can feel slow.", "Harder for strollers and tired legs."],
        ["Roots, rocks, steps", "Adds attention and tripping risk.", "May make a gentle grade feel technical."]
      ]
    },
    "how-to-read-national-park-trail-page": {
      title: "Official page reading order",
      intro: "Read official pages in the order that protects the decision, not in the order that feels most exciting.",
      rows: [
        ["Alerts", "Closures, hazards, road status, shuttle changes.", "Can cancel the route before details matter."],
        ["Current conditions", "Weather, snow, heat, smoke, construction.", "Turns stable terrain into today's decision."],
        ["Accessibility", "Official route-specific access notes.", "Controls mobility-dependent planning."],
        ["Map and facilities", "Parking, restrooms, water, distance to trailhead.", "Determines the whole outing, not just the path."]
      ]
    },
    "gentle-trails-not-boring": {
      title: "Memorability lens for low-grade trails",
      intro: "If a gentle route has at least two of these qualities, it can feel like a chosen experience rather than a compromise.",
      rows: [
        ["Water", "Creek, lake, waterfall, shoreline or river sound.", "Adds movement and sensory reward."],
        ["Texture", "Forest edge, meadow, boardwalk, geology, historic feature.", "Creates distinct moments."],
        ["Pacing", "Room to pause, talk, photograph or read signs.", "Makes the route shared rather than rushed."],
        ["Fit", "Matches the group's energy and constraints.", "Lets the park experience stay positive."]
      ]
    }
};

function articleDecisionTool(post) {
  const tool = post.decisionTool || legacyDecisionTools[post.slug];
  if (!tool) return "";
  return `<article class="panel"><h2 id="${slugifyAnchor(tool.title)}">${esc(tool.title)}</h2><p>${esc(tool.intro)}</p><table class="compare-table"><thead><tr><th>Signal</th><th>Question</th><th>Decision use</th></tr></thead><tbody>${tool.rows.map((row) => `<tr><td>${esc(row[0])}</td><td>${esc(row[1])}</td><td>${esc(row[2])}</td></tr>`).join("")}</tbody></table></article>`;
}

function articleInternalLinks(post, prefix) {
  const links = [
    ["Methodology", `${prefix}us-trails/methodology.html`, "How Gradient Trail separates terrain metrics from current conditions."],
    ["Trail Finder", `${prefix}us-trails/trails.html`, "Use the sample finder to compare distance, gain, grade and gentle score."],
    ["Hiking Time Calculator", `${prefix}us-trails/calculator.html`, "Estimate time after choosing a candidate route."],
    ["Compare Trails", `${prefix}us-trails/compare.html`, "Put two route profiles side by side before deciding."]
  ];
  if (post.cat === "access") {
    links[1] = ["Accessibility guide", `${prefix}us-trails/articles/conservative-accessibility-national-park-trails.html`, "Review conservative access language before relying on route signals."];
  }
  if (post.cat === "family") {
    links[1] = ["Family hike planning", `${prefix}us-trails/articles/national-park-hike-with-kids-planning.html`, "Check the family planning framework before choosing a route."];
  }
  return `<aside class="panel"><h2 id="where-to-go-next-on-gradient-trail">Where to go next on Gradient Trail</h2><div class="card-grid">${links.map(([label, href, text]) => `<a class="site-card" href="${href}"><div class="site-card-body"><h3>${esc(label)}</h3><p>${esc(text)}</p></div></a>`).join("")}</div></aside>`;
}

function trailRows(trails, prefix) {
  if (!trails.length) {
    return `<div class="panel"><h2>No qualifying routes yet</h2><p>This page stays thin until enough route-relation records clear the publishing threshold.</p></div>`;
  }
  return `<div class="listing">${trails.map((trail) => `<a class="list-row" href="${prefix}${trailUrl(trail)}">
    <div><h3>${esc(trail.name)}</h3><p>${esc(trail.park)}, ${esc(trail.state)} <span class="dot-sep"></span>${esc(trail.type)} <span class="dot-sep"></span>${esc(trail.access)}</p></div>
    <div><b>${trail.distance} mi</b><p>Distance</p></div>
    <div><b>${trail.gain} ft</b><p>Gain</p></div>
    <div><b>${trail.maxGrade}%</b><p>Max grade</p></div>
    <div class="score"><b>${trail.gentle}/100 gentle</b><div class="bar"><span style="--w:${trail.gentle}%"></span></div></div>
  </a>`).join("")}</div>`;
}

async function write(pathFromRoot, contents) {
  const abs = join(root, pathFromRoot);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, contents);
}

const jsData = `window.SITE = ${JSON.stringify(site, null, 2)};\n`;
await write("us-trails/assets/site-data.js", jsData);
await write("us-trails/assets/sample-data.js", `window.SAMPLE = ${JSON.stringify({
  catOrder: ["all", "data", "guide", "family", "access", "parks", "seasonal"],
  catTints: {
    all: { c: "#18231c", label: "All posts" },
    data: { c: "#4f7f8f", label: "Data" },
    guide: { c: "#8a9d5e", label: "Guide" },
    family: { c: "#d7a84f", label: "Family" },
    access: { c: "#c8643b", label: "Access" },
    parks: { c: "#608a70", label: "Parks" },
    seasonal: { c: "#9f7651", label: "Seasonal" }
  },
  posts: approvalPosts.map((post) => ({
    title: post.title,
    dek: post.dek,
    cat: post.cat,
    catLabel: post.catLabel,
    tint: post.tint,
    seed: post.seed,
    href: `articles/${post.slug}.html`,
    author: post.author,
    date: post.date,
    read: post.read,
    featured: Boolean(post.featured)
  }))
}, null, 2)};\n`);

for (const park of site.parks) {
  const trails = site.trails.filter((trail) => trail.parkSlug === park.slug).sort((a, b) => b.gentle - a.gentle);
  await write(parkUrl(park), doc({
    path: parkUrl(park),
    title: `${park.name} gentle trails | Gradient Trail`,
    description: park.summary,
    active: "parks",
    noindex: true,
    body: (prefix) => `<main>
      <section class="page-head wrap">
        <p class="eyebrow">Park hub</p>
        <h1>${esc(park.name)} gentle trails</h1>
        <p class="lead">${esc(park.summary)}</p>
        <div class="mini-meta"><span>${esc(park.state)}</span><span>${park.count} mapped candidates</span><span>Official alert check: ${esc(park.alert)}</span></div>
      </section>
      <section class="section tight wrap">
        <div class="section-head"><div><p class="eyebrow">Long-tail filters</p><h2>Planning pages for ${esc(park.name)}</h2></div><p>These pages model the pSEO inventory: useful filters first, no empty-list publishing.</p></div>
        <div class="card-grid">${filters.map((filter) => `<a class="site-card" href="${prefix}us-trails/parks/${park.slug}/${filter.slug}.html"><div class="site-card-body"><h3>${esc(filter.title(park))}</h3><p>${esc(filter.description)}</p></div></a>`).join("")}</div>
      </section>
      <section class="section tight wrap">
        <div class="section-head"><div><p class="eyebrow">Top candidates</p><h2>Gentlest routes in this sample</h2></div></div>
        ${trailRows(trails, prefix)}
      </section>
    </main>`
  }));

  for (const filter of filters) {
    const filtered = trails.filter(filter.predicate).sort((a, b) => b.gentle - a.gentle);
    const path = `us-trails/parks/${park.slug}/${filter.slug}.html`;
    await write(path, doc({
      path,
      title: `${filter.title(park)} | Gradient Trail`,
      description: `${filter.description} Includes transparent terrain metrics and conservative access notes.`,
      active: "parks",
      noindex: true,
      body: (prefix) => `<main>
        <section class="page-head wrap">
          <p class="eyebrow">Computed filter</p>
          <h1>${esc(filter.title(park))}</h1>
          <p class="lead">${esc(filter.description)} Lists are generated from route metrics and should be held if too few records qualify.</p>
          <div class="mini-meta"><span>Noindex until editorial approval</span><span>${filtered.length} qualifying sample route${filtered.length === 1 ? "" : "s"}</span><span>${esc(park.alert)}</span></div>
        </section>
        <section class="section tight wrap">${trailRows(filtered, prefix)}</section>
      </main>`
    }));
  }
}

for (const trail of site.trails) {
  const park = site.parks.find((p) => p.slug === trail.parkSlug);
  const path = trailUrl(trail);
  await write(path, doc({
    path,
    title: `${trail.name} terrain notes | Gradient Trail`,
    description: `${trail.name} in ${trail.park}: ${trail.distance} miles, ${trail.gain} feet gain and ${trail.maxGrade}% max grade.`,
    active: "trails",
    noindex: true,
    body: (prefix) => `<main>
      <section class="page-head wrap">
        <p class="eyebrow">Trail detail</p>
        <h1>${esc(trail.name)}</h1>
        <p class="lead">${esc(trail.bestFor)}</p>
        <div class="mini-meta"><span><a href="${prefix}${parkUrl(park)}">${esc(park.name)}</a></span><span>${trail.distance} mi</span><span>${trail.gain} ft gain</span><span>${trail.maxGrade}% max grade</span></div>
      </section>
      <section class="section tight wrap">${metricCards(trail)}</section>
      <section class="section tight wrap">
        <div class="result-panel">
          <div class="panel"><h2>Terrain notes</h2><p>This page is generated from the local route record. In production, geometry comes from route relations, elevation from DEM profiles and scores from deterministic L2 metrics.</p><div class="mini-meta"><span>${esc(trail.type)}</span><span>${esc(trail.feature)}</span><span>${esc(trail.source)}</span></div></div>
          <div class="panel"><h2>Access caution</h2><p>${esc(trail.accessNote)}</p><p class="trust">Always check official park alerts and current trail conditions before visiting.</p></div>
        </div>
      </section>
      <section class="section tight wrap">
        <div class="section-head"><div><p class="eyebrow">Internal links</p><h2>Related planning pages</h2></div></div>
        <div class="card-grid">
          <a class="site-card" href="${prefix}us-trails/calculator.html"><div class="site-card-body"><h3>Estimate time</h3><p>Use this route's distance and gain in the calculator.</p></div></a>
          <a class="site-card" href="${prefix}us-trails/compare.html"><div class="site-card-body"><h3>Compare with another route</h3><p>Put the grade and gentleness score next to another option.</p></div></a>
          <a class="site-card" href="${prefix}us-trails/methodology.html"><div class="site-card-body"><h3>Read methodology</h3><p>See how gentleness and access signals are treated.</p></div></a>
        </div>
      </section>
    </main>`
  }));
}

function articleSchema(post, path) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.subtitle,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": { "@type": "Organization", "name": post.author },
    "publisher": { "@type": "Organization", "name": "Gradient Trail" },
    "mainEntityOfPage": `${origin}/${path}`
  };
}

const sourceLinks = [
  ["NPS Trip Planning Guide", "https://www.nps.gov/subjects/healthandsafety/trip-planning-guide.htm"],
  ["NPS Hike Smart", "https://www.nps.gov/articles/hiking-safety.htm"],
  ["NPS Accessibility", "https://www.nps.gov/subjects/accessibility/index.htm"],
  ["Leave No Trace Seven Principles", "https://lnt.org/why/7-principles/"],
  ["USGS 3D Elevation Program", "https://www.usgs.gov/3d-elevation-program"]
];

const blogCategories = [...new Map(approvalPosts.map((post) => [post.cat, post.catLabel])).entries()];
await write("blog/index.html", doc({
  path: "blog/index.html",
  title: "Gradient Trail Blog | Gentle national park trail guides",
  description: "Human-edited guides for gentle national park trail planning, family hikes, accessibility-aware route checks, terrain data and seasonal decisions.",
  active: "blog",
  body: (prefix) => `<main>
    <section class="page-head wrap">
      <p class="eyebrow">Field notes</p>
      <h1>Gentle trail planning guides</h1>
      <p class="lead">Browse ${approvalPosts.length} human-edited articles built around real reader decisions: choosing easier routes, checking access wording, planning with kids, reading terrain and verifying official conditions before a park day.</p>
      <div class="mini-meta"><span>${approvalPosts.length} articles</span><span>Decision tools included</span><span>Official-source habits</span></div>
    </section>
    <section class="section tight wrap blog-index-intro">
      <div class="panel"><h2>Use the archive by planning job</h2><p>Start with the constraint that matters most: family pacing, mobility-aware access, route surface, seasonal conditions, park-specific planning or data literacy. Each card links to a full article with a table of contents, route decision tool, internal links and source notes.</p></div>
      <div class="blog-category-row" aria-label="Blog categories">${blogCategories.map(([cat, label]) => `<a href="#${esc(cat)}">${esc(label)}</a>`).join("")}</div>
    </section>
    ${blogCategories.map(([cat, label]) => {
      const posts = approvalPosts.filter((post) => post.cat === cat);
      return `<section class="section tight wrap blog-category" id="${esc(cat)}"><div class="section-head"><div><p class="eyebrow">${esc(label)}</p><h2>${esc(label)} articles</h2></div><p>${posts.length} guide${posts.length === 1 ? "" : "s"} for this planning lane.</p></div><div class="post-index-grid">${posts.map((post) => `<a class="site-card post-index-card" href="${prefix}us-trails/articles/${post.slug}.html"><div class="site-card-body"><span class="cat-badge" style="--post-tint:${esc(post.tint)}">${esc(post.catLabel)}</span><h3>${esc(post.title)}</h3><p>${esc(post.dek || post.subtitle)}</p><div class="mini-meta"><span>${esc(post.author)}</span><span>${esc(post.date)}</span><span>${esc(post.read)}</span></div></div></a>`).join("")}</div></section>`;
    }).join("")}
  </main>`
}));

for (const post of approvalPosts) {
  const path = `us-trails/articles/${post.slug}.html`;
  await write(path, doc({
    path,
    title: `${post.title} | Gradient Trail`,
    description: post.subtitle,
    active: "blog",
    schema: articleSchema(post, path),
    body: (prefix) => `<main>
      <section class="page-head wrap">
        <p class="eyebrow">${esc(post.catLabel)}</p>
        <h1>${esc(post.title)}</h1>
        <p class="lead">${esc(post.subtitle)}</p>
        <div class="mini-meta"><span>${esc(post.author)}</span><span>${esc(post.date)}</span><span>${esc(post.read)}</span><span>Reader job: ${esc(post.readerJob)}</span></div>
      </section>
      <section class="section tight wrap article-body">
        ${articleToc(post)}
        ${post.sections.map(([heading, paragraphs]) => `<article class="panel"><h2 id="${slugifyAnchor(heading)}">${esc(heading)}</h2>${paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}</article>`).join("")}
        ${articleDecisionTool(post)}
        <article class="panel"><h2 id="how-to-use-this-guide-on-a-real-park-day">How to use this guide on a real park day</h2><p>Use this article as a planning layer, not as the final authority. Start with the terrain idea explained here, compare it with the route's distance, gain, grade and surface, then open the official park page before you leave. If current alerts, weather, shuttle status, construction or accessibility details conflict with a comfortable plan, choose the official information and adjust the route.</p><p>For families and mixed-ability groups, make the decision at the pace of the least flexible person in the group. A route that looks efficient for one adult may still be the wrong choice if it has a hot return, uncertain surface, poor bailout options or facilities that do not match the day. The goal is not to collect a trail name. The goal is to arrive with a route that still makes sense when real conditions, energy and timing are considered together.</p></article>
        ${articleInternalLinks(post, prefix)}
        <aside class="panel"><h2 id="field-takeaways">Field takeaways</h2><ul class="takeaway-list">${post.takeaways.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></aside>
        <aside class="panel"><h2 id="sources-and-verification-notes">Sources and verification notes</h2><p>Gradient Trail articles are planning aids, not official park guidance. Check current park alerts, weather, road status and accessibility information before visiting.</p><ul class="source-list">${sourceLinks.map(([label, href]) => `<li><a href="${href}">${esc(label)}</a></li>`).join("")}</ul><div class="mini-meta"><span><a href="${prefix}us-trails/methodology.html">Methodology</a></span><span><a href="${prefix}disclaimer.html">Safety disclaimer</a></span><span><a href="${prefix}editorial-policy.html">Editorial policy</a></span></div></aside>
      </section>
    </main>`
  }));
}

const trustPages = [
  ["about.html", "About Gradient Trail", "Gradient Trail explains gentle national park route planning with transparent terrain metrics.", "Gradient Trail is a terrain-first planning site for national park visitors who want lower-climb, family-aware and source-literate trail decisions.", ["We focus on DEM-derived terrain interpretation, conservative access wording and official-source verification habits.", "The site is independently operated as an editorial and tool project. It is not affiliated with the National Park Service, OpenStreetMap, USGS or any park concessioner."]],
  ["contact.html", "Contact Gradient Trail", "Contact the Gradient Trail editorial team.", "Contact", ["For corrections, source questions or editorial feedback, email hello@gradienttrail.com. Include the page URL, the specific claim you are asking about, and any official source that should be reviewed.", "We do not accept paid placement inside trail recommendations. Sponsorship, if added later, must be clearly labeled and separated from editorial decisions."]],
  ["privacy.html", "Privacy Policy", "Privacy, cookies, analytics and advertising disclosures for Gradient Trail.", "Privacy Policy", ["Gradient Trail may use basic analytics, server logs and advertising technologies to understand site performance and support the site. If Google AdSense is enabled, Google and its partners may use cookies to serve and measure ads.", "Users can manage personalized advertising through Google ad settings and browser cookie controls. We do not sell personal trail plans or contact form messages, and editorial recommendations are not based on individual reader profiles."]],
  ["terms.html", "Terms of Use", "Terms for using Gradient Trail tools and trail planning content.", "Terms of Use", ["Gradient Trail provides educational planning information and lightweight calculators. The site does not provide professional safety, medical, accessibility or official park advice.", "You are responsible for checking current official park information, weather, closures, route conditions and your group's ability before visiting any trail."]],
  ["editorial-policy.html", "Editorial Policy", "How Gradient Trail creates and reviews trail planning content.", "Editorial Policy", ["Articles and generated route pages are built around a clear distinction between stable terrain metrics and current conditions. Stable terrain data can support planning, but official park pages control closures, alerts and accessibility details.", "We avoid claiming that a trail is wheelchair accessible unless the evidence supports that statement. When data is incomplete, we describe signals and tell readers what to verify."]],
  ["disclaimer.html", "Safety and Accessibility Disclaimer", "Safety and accessibility limitations for Gradient Trail content.", "Safety and Accessibility Disclaimer", ["Hiking involves changing outdoor conditions. Low elevation gain, short distance or a high gentleness score does not make a trail safe for every visitor or every day.", "Accessibility needs are specific and current conditions can change. Always use official park accessibility information and contact the park when a route decision depends on mobility access, surface condition, closures or facilities."]]
];

for (const [path, title, description, heading, paragraphs] of trustPages) {
  await write(path, doc({
    path,
    title: `${title} | Gradient Trail`,
    description,
    active: "",
    body: () => `<main><section class="page-head wrap"><p class="eyebrow">Trust</p><h1>${esc(heading)}</h1><p class="lead">${esc(description)}</p></section><section class="section tight wrap policy-grid"><div class="panel"><h2>Summary</h2><p>${esc(description)}</p></div><div class="article-body">${paragraphs.map((paragraph, index) => `<article class="panel"><h2>${index === 0 ? "What this means" : "Important limitation"}</h2><p>${esc(paragraph)}</p></article>`).join("")}</div></section></main>`
  }));
}

const urls = [
  "index.html",
  "us-trails/trails.html",
  "us-trails/parks.html",
  "us-trails/calculator.html",
  "us-trails/compare.html",
  "us-trails/Blog.html",
  "blog/index.html",
  "us-trails/methodology.html",
  ...trustPages.map(([path]) => path),
  ...approvalPosts.map((post) => `us-trails/articles/${post.slug}.html`)
];

await write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${origin}/${url}</loc></url>`).join("\n")}\n</urlset>\n`);
await write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await write("llms.txt", `# Gradient Trail\n\nA local MVP for DEM-first national park trail planning.\n\nKey pages:\n- /us-trails/trails.html\n- /us-trails/parks.html\n- /us-trails/calculator.html\n- /us-trails/compare.html\n- /blog/\n- /us-trails/methodology.html\n\nMethod: route-relation geometry, DEM elevation profile, deterministic gentleness/family/difficulty scores, conservative access language.\n`);
await write("ads.txt", "google.com, pub-3050601904412736, DIRECT, f08c47fec0942fa0\n");

console.log(`Generated ${urls.length} approval sitemap URLs, ${approvalPosts.length} articles, ${site.parks.length} noindex park hubs, and ${site.trails.length} noindex trail pages.`);
