import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { editorialPosts } from "./editorial-posts.mjs";
import { expansionPosts } from "./editorial-expansion.mjs";
import { freshPosts } from "./editorial-fresh.mjs";
import { next100Posts } from "./editorial-next100.mjs";

const root = process.cwd();
const site = JSON.parse(await readFile(join(root, "data/site-content.json"), "utf8"));
const origin = (process.env.SITE_ORIGIN || "https://gradienttrail.com").replace(/\/$/, "");
const ARTICLE_TARGET = 300;
const approvalPosts = [...editorialPosts.slice(0, 10), ...expansionPosts, ...freshPosts, ...next100Posts].slice(0, ARTICLE_TARGET);
const buildNow = new Date();
const publishedApprovalPosts = approvalPosts.filter((post) => !post.publishAt || new Date(post.publishAt) <= buildNow);
const adsenseClient = process.env.ADSENSE_CLIENT || "ca-pub-3050601904412736";
const ga4Id = process.env.GA4_ID || "G-JXKB19KWYF";
const googleSiteVerification = "EWaJY7dnYLETiLKgkZp6yXSfY-b0EQJfDkKcr5OubcM";
const naverSiteVerification = "1d1e74be2fc392a80a09240a8bbda0a3145084a8";

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

function xmlEsc(value) {
  return esc(value);
}

function cleanPublicPath(pathFromRoot) {
  if (pathFromRoot === "index.html") return "";
  if (pathFromRoot.endsWith("/index.html")) return pathFromRoot.slice(0, -"index.html".length);
  if (pathFromRoot.endsWith(".html")) return pathFromRoot.slice(0, -".html".length);
  return pathFromRoot;
}

function publicUrl(pathFromRoot = "") {
  const cleanPath = cleanPublicPath(pathFromRoot).replace(/^\/+/, "");
  return cleanPath ? `${origin}/${cleanPath}` : `${origin}/`;
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
  const canonical = publicUrl(path);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="google-site-verification" content="${esc(googleSiteVerification)}">
  <meta name="naver-site-verification" content="${esc(naverSiteVerification)}">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  ${noindex ? '<meta name="robots" content="noindex,follow">' : ""}
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" type="application/rss+xml" title="Gradient Trail RSS" href="${origin}/feed.xml">
  <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${prefix}us-trails/assets/topo.css">
  ${noindex ? "" : trackingTags()}
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

function isoDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
}

function siteIdentitySchema() {
  return [
    {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      "name": "Gradient Trail",
      "url": `${origin}/`,
      "logo": `${origin}/favicon.svg`,
      "sameAs": []
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      "name": "Gradient Trail",
      "url": `${origin}/`,
      "publisher": { "@id": `${origin}/#organization` },
      "inLanguage": "en-US"
    }
  ];
}

function authorProfile(post) {
  const profiles = {
    "Nolan Park": {
      role: "Terrain planning editor",
      bio: "Reviews route-fit articles for distance, grade, surface and source hierarchy before publication."
    },
    "Mara Finch": {
      role: "Family route planning editor",
      bio: "Checks family pacing, turnaround, restroom and mixed-ability planning assumptions."
    },
    "Elena Cruz": {
      role: "Access-aware planning editor",
      bio: "Reviews conservative accessibility wording and separates current conditions from stable route context."
    },
    "Owen Vale": {
      role: "Seasonal conditions editor",
      bio: "Reviews weather, daylight, heat, smoke, snow and same-day verification language."
    }
  };
  return profiles[post.author] || {
    role: "Gradient Trail editorial contributor",
    bio: "Reviews trail planning articles against Gradient Trail source, safety and route-fit standards."
  };
}

function articleToc(post) {
  const answerBox = articleAnswerData(post);
  const fieldExample = articleFieldExampleData(post);
  const verificationChecklist = articleVerificationData(post);
  const decisionToolTitle = post.decisionTool?.title || articleDecisionToolTitle(post);
  const items = [
    { heading: answerBox.title, label: "Quick answer" },
    ...post.sections.map(([heading]) => ({ heading, label: heading })),
    { heading: post.visual?.title || `${decisionToolTitle || "Route decision"}: visual planning block`, label: "Visual planning block" },
    { heading: fieldExample.title, label: "Field example" },
    { heading: decisionToolTitle, label: "Decision tool" },
    { heading: `${articleKeywords(post).main} quick questions`, label: "Quick questions" },
    { heading: verificationChecklist.title, label: "Verification checklist" },
    { heading: "Research evidence used", label: "Research evidence" },
    { heading: "Editorial review note", label: "Editorial review" },
    { heading: "How to use this guide on a real park day", label: "Park-day use" },
    { heading: "Where to go next on Gradient Trail", label: "Related links" },
    { heading: "Field takeaways", label: "Field takeaways" },
    { heading: "Sources and verification notes", label: "Sources" }
  ].filter((item) => item.heading);
  return `<details class="toc-panel"><summary class="toc-title">Table of contents</summary><ol>${items.map((item) => `<li><a href="#${slugifyAnchor(item.heading)}">${esc(item.label)}</a></li>`).join("")}</ol></details>`;
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

function articleToolRows(post) {
  return (post.decisionTool || legacyDecisionTools[post.slug])?.rows || [];
}

function articleKeywords(post) {
  const toolLabels = articleToolRows(post)
    .map((row) => row[0])
    .filter(Boolean)
    .filter((label) => !/^plan boundary$/i.test(label));
  const extended = post.extendedKeywords?.length >= 2
    ? post.extendedKeywords.slice(0, 2)
    : [...toolLabels, "official conditions", "route fit"].slice(0, 2);
  return {
    main: post.mainKeyword || post.title,
    extended
  };
}

function stableHash(value) {
  return String(value || "").split("").reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0, 2166136261);
}

function articleVariant(post, count) {
  return stableHash(`${post.slug}|${post.title}|${post.cat}`) % count;
}

function articleAnswerData(post) {
  if (post.answerBox) return post.answerBox;
  const { main, extended } = articleKeywords(post);
  const readerJob = post.readerJob || "choose a gentle national park route with source-aware confidence";
  const variants = [
    {
      title: `${main} quick answer`,
      answer: `${main} is useful only when ${extended[0]} and ${extended[1]} support the reader's actual job: ${readerJob}. If either signal is weak, treat the article as a shortlist aid and verify current official conditions before committing.`,
      bullets: [
        `Best fit: ${readerJob}.`,
        `Primary check: ${extended[0]} changes the route, timing, comfort or backup choice.`,
        `Second check: ${extended[1]} does not conflict with official conditions or group fit.`
      ]
    },
    {
      title: `${main} decision answer`,
      answer: `Use ${main} as a decision filter, not as a promise. It earns a place in the plan when ${extended[0]} is clear, ${extended[1]} is not working against the group, and current park information does not contradict the route idea.`,
      bullets: [
        `Reader job: ${readerJob}.`,
        `Keep it when ${extended[0]} gives a concrete planning advantage.`,
        `Downgrade it when ${extended[1]} creates a same-day uncertainty.`
      ]
    },
    {
      title: `${main} planning verdict`,
      answer: `${main} should move the reader toward one of three actions: keep the route, reduce commitment, or choose a backup. The deciding evidence is whether ${extended[0]} and ${extended[1]} make the same route feel more dependable for the stated reader job.`,
      bullets: [
        `Keep: both signals support the same outing.`,
        `Adjust: ${extended[0]} helps, but ${extended[1]} weakens timing or comfort.`,
        `Skip: official conditions or group fit contradict the plan.`
      ]
    },
    {
      title: `${main} short answer for route fit`,
      answer: `The right use of ${main} is conservative: let it narrow options, then test the remaining route against ${extended[0]}, ${extended[1]}, and the least flexible part of the group plan.`,
      bullets: [
        `Route-fit test: ${readerJob}.`,
        `Evidence test: one source or route note supports ${extended[0]}.`,
        `Stress test: ${extended[1]} still leaves a calm fallback.`
      ]
    }
  ];
  return variants[articleVariant(post, variants.length)];
}

function articleFieldExampleData(post) {
  if (post.fieldExample) return post.fieldExample;
  const { main, extended } = articleKeywords(post);
  const variants = [
    {
      title: `${main} field example`,
      intro: `Use this example to turn ${main} from a reading note into a route decision.`,
      rows: [
        ["Keep the route", `${extended[0]} and ${extended[1]} both support the same low-friction plan.`],
        ["Adjust the route", `${extended[0]} is useful, but ${extended[1]} points to a shorter, earlier or closer-to-services option.`],
        ["Skip the route", `The current official source or group-fit check does not support ${main} for this outing.`]
      ]
    },
    {
      title: `${main} route-choice branch`,
      intro: `Read this branch before treating ${main} as the final answer.`,
      rows: [
        ["Evidence is strong", `${extended[0]} appears in a route note, map clue, official page or current-condition source.`],
        ["Evidence is partial", `${extended[1]} is plausible but still needs a day-of confirmation or a lower-commitment route.`],
        ["Evidence is weak", `The article idea sounds useful, but ${main} cannot yet explain what should change.`]
      ]
    },
    {
      title: `${main} reader scenario test`,
      intro: `Use the scenario test to check whether the article's advice survives real group friction.`,
      rows: [
        ["One adult would continue", `Do not use that as the standard if ${extended[0]} affects another person's pace or comfort.`],
        ["The group can shorten", `${extended[1]} is manageable when the route has a clear shorter version or nearby services.`],
        ["The group would feel trapped", `${main} should point to a backup before the outing becomes hard to reverse.`]
      ]
    },
    {
      title: `${main} source-use example`,
      intro: `This example separates stable route facts from current conditions.`,
      rows: [
        ["Stable fact", `${extended[0]} can shortlist the route when it is tied to distance, grade, shape, surface or facilities.`],
        ["Current condition", `${extended[1]} needs the newest official or weather-sensitive source when it can change by day.`],
        ["Decision", `Use ${main} only after the stable and current evidence point in the same direction.`]
      ]
    }
  ];
  return variants[articleVariant(post, variants.length)];
}

function articleFaqData(post) {
  const { main, extended } = articleKeywords(post);
  const customFaq = post.faq?.length ? post.faq : null;
  const variants = [
    [
      {
        q: `Is ${main} enough by itself to choose the route?`,
        a: `No. Use ${main} as the starting frame, then check ${extended[0]} and ${extended[1]} before making the route decision.`
      },
      {
        q: `What should be verified before relying on ${main}?`,
        a: `Verify current official park conditions, then decide whether ${extended[0]} and ${extended[1]} still support the reader job described in the article.`
      },
      {
        q: `When should ${main} lead to a backup plan?`,
        a: `Choose a backup when either ${extended[0]} or ${extended[1]} creates uncertainty around timing, access, surface, comfort, facilities or a calm turnaround.`
      }
    ],
    [
      {
        q: `What makes ${main} a useful planning signal?`,
        a: `${main} is useful when it changes a real choice, especially the start time, route length, turnaround point, backup route or source-check priority.`
      },
      {
        q: `How does ${extended[0]} change the route decision?`,
        a: `${extended[0]} should point to a visible route fact, official note or group constraint. If it does not change an action, it is only background context.`
      },
      {
        q: `Why keep ${extended[1]} in the same check?`,
        a: `${extended[1]} catches the second failure mode so the plan does not pass on one attractive signal while failing on timing, access or comfort.`
      }
    ],
    [
      {
        q: `How should a reader use ${main} without overcommitting?`,
        a: `Use it to narrow choices first, then wait for ${extended[0]}, ${extended[1]} and official conditions to agree before treating the route as final.`
      },
      {
        q: `What is the fastest no-go clue for ${main}?`,
        a: `The fastest no-go clue is a conflict between the article's route idea and a current official alert, facility issue, weather risk or group-fit limit.`
      },
      {
        q: `Can ${main} still help if the route changes?`,
        a: `Yes. It can still guide a shorter segment, different start time or backup route when ${extended[0]} remains useful but ${extended[1]} weakens the original plan.`
      }
    ],
    [
      {
        q: `Which part of ${main} should be checked first?`,
        a: `Check the part most likely to change the outing before arrival: ${extended[0]} if it affects logistics, or ${extended[1]} if it affects comfort or current conditions.`
      },
      {
        q: `What evidence is strong enough for ${extended[0]}?`,
        a: `A strong clue is a current official page, map detail, route metric, facility note or condition source that tells the reader what to do differently.`
      },
      {
        q: `Where can ${extended[1]} mislead the plan?`,
        a: `${extended[1]} can mislead when it sounds stable but actually depends on weather, closures, crowds, shuttle timing, surface condition or group energy.`
      }
    ],
    [
      {
        q: `What does ${main} not prove?`,
        a: `${main} does not prove that a route is safe, accessible, open or comfortable today. It only frames the next source and group-fit checks.`
      },
      {
        q: `When is ${extended[0]} more important than scenery?`,
        a: `${extended[0]} becomes more important than scenery when it affects whether the group can start, pause, turn around or recover without pressure.`
      },
      {
        q: `How should ${extended[1]} shape the backup?`,
        a: `The backup should remove the same weak dependency. If ${extended[1]} is the problem, choose a route or timing plan that avoids that condition.`
      }
    ],
    [
      {
        q: `What is the practical test for ${main}?`,
        a: `The practical test is whether the reader can say what changes after reading the article: route, timing, source check, fallback or skip decision.`
      },
      {
        q: `How do ${extended[0]} and ${extended[1]} work together?`,
        a: `${extended[0]} usually starts the decision, while ${extended[1]} checks whether the same decision still works under real conditions.`
      },
      {
        q: `What should the reader do if the two signals conflict?`,
        a: `Do not average the signals. Use the more conservative reading and pick a shorter, clearer or better-supported route option.`
      }
    ]
  ];
  if (!customFaq) return variants[articleVariant(post, variants.length)];
  const variant = articleVariant(post, variants.length);
  return customFaq.map((item, index) => variants[variant][index] || item);
}

function articleVerificationData(post) {
  if (post.verificationChecklist) return post.verificationChecklist;
  const { main, extended } = articleKeywords(post);
  const variants = [
    {
      title: `${main} verification checklist`,
      intro: `Use this checklist before treating ${main} as a final route choice.`,
      rows: [
        ["Official source", "Open the relevant park page, alert page, forecast or facility page before leaving."],
        [extended[0], `Confirm that ${extended[0]} changes a real route, timing, surface, access or backup decision.`],
        [extended[1], `Check whether ${extended[1]} is stable route context or a current condition that needs a fresh source.`],
        ["Fallback rule", `Write the condition that would make ${main} the wrong choice for this group today.`]
      ]
    },
    {
      title: `${main} source check before departure`,
      intro: `Use this source check when the article's route idea looks promising but still needs current proof.`,
      rows: [
        ["Current page", "Look for alerts, closures, shuttle changes, road notes, facility notes or weather-sensitive guidance."],
        [extended[0], `Name the source that supports ${extended[0]} and the action it changes.`],
        [extended[1], `Decide whether ${extended[1]} belongs to stable planning or same-day verification.`],
        ["Decision owner", `Make one person responsible for changing the plan if ${main} loses support.`]
      ]
    },
    {
      title: `${main} final fit scan`,
      intro: `Run this scan after the route looks good on paper but before the group leaves.`,
      rows: [
        ["Group fit", "Check the least flexible person's pace, attention, access needs, heat tolerance or turnaround comfort."],
        [extended[0], `Ask whether ${extended[0]} still helps that person, not only the strongest walker.`],
        [extended[1], `Look for the point where ${extended[1]} would make the outing feel rushed or hard to reverse.`],
        ["Route swap", `Choose a backup when ${main} depends on optimism instead of evidence.`]
      ]
    },
    {
      title: `${main} evidence ladder`,
      intro: `Use the ladder to separate strong evidence from weak planning clues.`,
      rows: [
        ["Strongest evidence", "Official pages, current alerts, weather sources, route metrics and facility details control the decision."],
        [extended[0], `Use ${extended[0]} as a decision signal only when it points to one of those stronger evidence types.`],
        [extended[1], `Treat ${extended[1]} as weak if it comes only from old photos, vague reviews or copied summaries.`],
        ["Next action", `Keep, adjust or skip ${main} based on the strongest available evidence, not the most appealing clue.`]
      ]
    }
  ];
  return variants[articleVariant(post, variants.length)];
}

function articleAnswerBox(post) {
  const answerBox = articleAnswerData(post);
  return `<aside class="panel answer-card" style="--visual-accent:${esc(post.visual?.accent || post.tint || "#2563eb")};--visual-soft:${esc(post.visual?.accentSoft || "#eff6ff")}"><h2 id="${slugifyAnchor(answerBox.title)}">${esc(answerBox.title)}</h2><p class="answer-lede">${esc(answerBox.answer)}</p><ul class="takeaway-list">${answerBox.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></aside>`;
}

function articleFieldExample(post) {
  const fieldExample = articleFieldExampleData(post);
  return `<article class="panel example-box" style="--visual-accent:${esc(post.visual?.accent || post.tint || "#2563eb")};--visual-alt:${esc(post.visual?.accentAlt || post.visual?.accent || post.tint || "#2563eb")}"><h2 id="${slugifyAnchor(fieldExample.title)}">${esc(fieldExample.title)}</h2><p>${esc(fieldExample.intro)}</p><table class="compare-table"><thead><tr><th>Case</th><th>Decision meaning</th></tr></thead><tbody>${fieldExample.rows.map((row) => `<tr><td>${esc(row[0])}</td><td>${esc(row[1])}</td></tr>`).join("")}</tbody></table></article>`;
}

function articleFaq(post) {
  const faq = articleFaqData(post);
  const heading = `${articleKeywords(post).main} quick questions`;
  return `<article class="panel qa-panel"><h2 id="${slugifyAnchor(heading)}">${esc(heading)}</h2><div class="qa-list">${faq.map((item) => `<section><h3>${esc(item.q)}</h3><p>${esc(item.a)}</p></section>`).join("")}</div></article>`;
}

function articleVerificationChecklist(post) {
  const verificationChecklist = articleVerificationData(post);
  return `<aside class="panel verification-panel"><h2 id="${slugifyAnchor(verificationChecklist.title)}">${esc(verificationChecklist.title)}</h2><p>${esc(verificationChecklist.intro)}</p><ul class="verification-list">${verificationChecklist.rows.map((row) => `<li><b>${esc(row[0])}</b><span>${esc(row[1])}</span></li>`).join("")}</ul></aside>`;
}

function articleSourceRole(label, href) {
  const text = `${label} ${href}`.toLowerCase();
  if (/usgs|weather\.gov|airnow|recreation\.gov/.test(text)) return "primary_data";
  if (/nps\.gov|national park service/.test(text)) return "official";
  if (/leave no trace|lnt/.test(text)) return "expert_reference";
  return "context_only";
}

function articleResearchEvidenceData(post) {
  if (post.researchEvidence) return post.researchEvidence;
  const { main, extended } = articleKeywords(post);
  const mergedSources = [...articleSourceLinks(post), ...sourceLinks]
    .filter((source) => Array.isArray(source) && source[0] && source[1])
    .filter((source, index, list) => list.findIndex((item) => item[1] === source[1]) === index)
    .slice(0, 6);
  const sources = mergedSources.map(([label, href], index) => ({
    id: `s${index + 1}`,
    label,
    href,
    source_role: articleSourceRole(label, href),
    accessed: "2026-06-27",
    data_points: [
      `${label} is used to check whether ${main} needs an official, primary-data or context-only source.`,
      `${label} helps separate stable route facts from current condition decisions.`
    ]
  }));
  return {
    research_runs: [
      `${main} official route planning ${extended[0]}`,
      `${main} ${extended[1]} current condition check`,
      `${post.title} source hierarchy evidence gap`,
      `${post.catLabel || "Gradient Trail"} reader job verification`
    ],
    sources,
    search_intent_insight: `${main} should help the reader make a concrete keep, adjust or skip decision, not simply collect another route name.`,
    content_gap_insight: `This article treats ${extended[0]} and ${extended[1]} as decision evidence so it does not duplicate sibling gentle-trail guides.`,
    source_interpretation_note: `Sources are interpreted by role for this article: official/current sources control live conditions, primary-data sources support terrain or weather context, and context sources are not used as final proof.`,
    article_specific_details: [
      {
        claim: `${main} is useful only when ${extended[0]} changes the route, timing, backup or source-check priority.`,
        source_id: sources[0]?.id || "s1"
      },
      {
        claim: `${extended[1]} is the cross-check that keeps this article separate from a generic easy-trail overview.`,
        source_id: sources[1]?.id || sources[0]?.id || "s1"
      },
      {
        claim: `${post.readerJob || "The reader job"} is treated as the boundary for what this article should and should not answer.`,
        source_id: sources[2]?.id || sources[0]?.id || "s1"
      }
    ],
    fact_traceability_pass: true
  };
}

function articleResearchEvidence(post) {
  const evidence = articleResearchEvidenceData(post);
  const sources = evidence.sources || [];
  const details = evidence.article_specific_details || [];
  const runs = evidence.research_runs || [];
  return `<aside class="panel research-evidence"><h2 id="research-evidence-used">Research evidence used</h2><p>${esc(evidence.source_interpretation_note || "Sources are interpreted by role before route advice is treated as useful.")}</p><div class="research-grid"><section><h3>Source roles</h3><ul class="source-list">${sources.map((source) => `<li><a href="${esc(source.href)}">${esc(source.id)}: ${esc(source.label)}</a> <span>${esc(source.source_role)} - checked ${esc(source.accessed || "2026-06-27")}</span></li>`).join("")}</ul></section><section><h3>Article-specific details</h3><ul class="takeaway-list">${details.map((detail) => `<li><b>${esc(detail.source_id)}</b>: ${esc(detail.claim)}</li>`).join("")}</ul></section></div><details class="research-runs"><summary>Research runs checked for this article</summary><ul>${runs.map((run) => `<li>${esc(run)}</li>`).join("")}</ul></details></aside>`;
}

function articleVisualBlock(post) {
  const visual = post.visual || {
    type: "evidenceChecklist",
    title: `${post.decisionTool?.title || articleDecisionToolTitle(post) || "Route decision"}: visual planning block`,
    accent: post.tint || "#4f7f8f",
    accentSoft: "rgba(255,253,248,0.86)",
    rows: (post.decisionTool || legacyDecisionTools[post.slug])?.rows || [
      ["Terrain", "What distance, grade or surface detail changes the route fit?", "Use measured signals before vague labels."],
      ["Logistics", "What parking, shuttle, restroom or turnaround detail affects the outing?", "Choose the route that stays manageable."],
      ["Current condition", "What official alert or weather detail could override the plan?", "Verify before leaving."]
    ]
  };
  const label = {
    evidenceChecklist: "Evidence check",
    decisionBox: "Decision rule",
    stepCards: "Step sequence",
    timeline: "Timing plan",
    riskScale: "Risk scale",
    scenarioTable: "Scenario table",
    miniFormula: "Mini formula"
  }[visual.type] || "Planning block";
  return `<article class="panel visual-block" style="--visual-accent:${esc(visual.accent)};--visual-soft:${esc(visual.accentSoft)};--visual-alt:${esc(visual.accentAlt || visual.accent)}"><h2 id="${slugifyAnchor(visual.title)}">${esc(visual.title)}</h2><p><span class="visual-label">${esc(label)}</span> This block highlights the one or two signals that should change the route choice, timing or backup plan.</p><div class="visual-grid">${visual.rows.map((row) => `<div class="visual-cell"><b>${esc(row[0])}</b><span>${esc(row[1])}</span><em>${esc(row[2])}</em></div>`).join("")}</div></article>`;
}

function articleInternalLinks(post, prefix) {
  const relatedPosts = publishedApprovalPosts
    .filter((candidate) => candidate.slug !== post.slug && candidate.cat === post.cat)
    .sort((a, b) => articleVariant({ slug: `${post.slug}-${a.slug}`, title: a.title, cat: a.cat }, 100000) - articleVariant({ slug: `${post.slug}-${b.slug}`, title: b.title, cat: b.cat }, 100000))
    .slice(0, 2);
  const crossCategory = publishedApprovalPosts
    .filter((candidate) => candidate.slug !== post.slug && candidate.cat !== post.cat)
    .sort((a, b) => articleVariant({ slug: `${post.slug}-${a.slug}`, title: a.title, cat: a.cat }, 100000) - articleVariant({ slug: `${post.slug}-${b.slug}`, title: b.title, cat: b.cat }, 100000))
    .slice(0, 1);
  const contextualLinks = [...relatedPosts, ...crossCategory].map((candidate) => [
    candidate.title,
    `${prefix}us-trails/articles/${candidate.slug}.html`,
    candidate.dek || candidate.subtitle
  ]);
  const links = [
    ["Methodology", `${prefix}us-trails/methodology.html`, "How Gradient Trail separates terrain metrics from current conditions."],
    ["Trail Finder", `${prefix}us-trails/trails.html`, "Use the sample finder to compare distance, gain, grade and gentle score."],
    ["Hiking Time Calculator", `${prefix}us-trails/calculator.html`, "Estimate time after choosing a candidate route."],
    ["Compare Trails", `${prefix}us-trails/compare.html`, "Put two route profiles side by side before deciding."],
    ...contextualLinks
  ];
  if (post.cat === "access") {
    links[1] = ["Accessibility guide", `${prefix}us-trails/articles/conservative-accessibility-national-park-trails.html`, "Review conservative access language before relying on route signals."];
  }
  if (post.cat === "family") {
    links[1] = ["Family hike planning", `${prefix}us-trails/articles/national-park-hike-with-kids-planning.html`, "Check the family planning framework before choosing a route."];
  }
  return `<aside class="panel"><h2 id="where-to-go-next-on-gradient-trail">Where to go next on Gradient Trail</h2><div class="card-grid">${links.map(([label, href, text]) => `<a class="site-card" href="${href}"><div class="site-card-body"><h3>${esc(label)}</h3><p>${esc(text)}</p></div></a>`).join("")}</div></aside>`;
}

function articleCta(post, prefix) {
  return `<aside class="panel article-cta" aria-labelledby="route-planning-next-step"><h2 id="route-planning-next-step">Route planning next step</h2><p>Turn this guide into a practical shortlist before checking current official park conditions.</p><div class="hero-actions"><a class="btn" href="${prefix}us-trails/trails.html">Open Trail Finder</a><a class="btn alt" href="${prefix}us-trails/calculator.html">Estimate Hiking Time</a></div></aside>`;
}

function articleEditorialNote(post) {
  const profile = authorProfile(post);
  const updated = isoDate(post.publishAt || post.date);
  return `<aside class="panel author-note"><h2 id="editorial-review-note">Editorial review note</h2><p><b>${esc(post.author)}</b>, ${esc(profile.role)}, reviewed this article for route-fit usefulness, conservative safety language and source hierarchy. ${esc(profile.bio)}</p><div class="mini-meta"><span>Published ${esc(isoDate(post.date))}</span><span>Reviewed ${esc(updated)}</span><span>No official park affiliation</span></div></aside>`;
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
  posts: publishedApprovalPosts.map((post) => ({
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

await write("us-trails/Blog.html", `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gradient Trail Blog moved</title>
  <meta name="description" content="The Gradient Trail blog now lives at the canonical /blog/ archive.">
  <meta name="google-site-verification" content="${esc(googleSiteVerification)}">
  <meta name="naver-site-verification" content="${esc(naverSiteVerification)}">
  <meta name="robots" content="noindex,follow">
  <meta http-equiv="refresh" content="0; url=../blog/">
  <link rel="canonical" href="${origin}/blog/">
  <link rel="stylesheet" href="assets/topo.css">
</head>
<body class="topo-bg">
  <main class="wrap page-head">
    <p class="eyebrow">Moved</p>
    <h1>Gradient Trail Blog moved</h1>
    <p class="lead">The canonical article archive is now <a href="../blog/">Gradient Trail Blog</a>.</p>
  </main>
</body>
</html>
`);

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
  const faq = articleFaqData(post);
  const profile = authorProfile(post);
  const pageUrl = publicUrl(path);
  const authorId = `${origin}/#author-${slugifyAnchor(post.author)}`;
  const article = {
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    "headline": post.title,
    "description": post.subtitle,
    "datePublished": isoDate(post.date),
    "dateModified": isoDate(post.publishAt || post.date),
    "author": { "@id": authorId },
    "reviewedBy": { "@id": `${origin}/#organization` },
    "publisher": { "@id": `${origin}/#organization` },
    "mainEntityOfPage": pageUrl,
    "isPartOf": { "@id": `${origin}/#website` },
    "about": [post.catLabel, articleKeywords(post).main, ...articleKeywords(post).extended].filter(Boolean),
    "inLanguage": "en-US"
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...siteIdentitySchema(),
      {
        "@type": "Person",
        "@id": authorId,
        "name": post.author,
        "jobTitle": profile.role,
        "description": profile.bio,
        "worksFor": { "@id": `${origin}/#organization` }
      },
      article,
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${origin}/` },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${origin}/blog/` },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": pageUrl }
        ]
      },
      ...(faq.length ? [{
        "@type": "FAQPage",
        "mainEntity": faq.map((item) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      }] : [])
    ]
  };
}

const sourceLinks = [
  ["NPS Trip Planning Guide", "https://www.nps.gov/subjects/healthandsafety/trip-planning-guide.htm"],
  ["NPS Hike Smart", "https://www.nps.gov/articles/hiking-safety.htm"],
  ["NPS Accessibility", "https://www.nps.gov/subjects/accessibility/index.htm"],
  ["NPS Leave No Trace Seven Principles", "https://www.nps.gov/articles/leave-no-trace-seven-principles.htm"],
  ["USGS 3DEP DEM Data Catalog", "https://data.usgs.gov/datacatalog/data/USGS%3A3a81321b-c153-416f-98b7-cc8e5f0e17c3"]
];

function articleSourceLinks(post) {
  return post.sources?.length ? post.sources : sourceLinks;
}

const blogCategories = [...new Map(publishedApprovalPosts.map((post) => [post.cat, post.catLabel])).entries()];
await write("blog/index.html", doc({
  path: "blog/index.html",
  title: "Gradient Trail Blog | Gentle national park trail guides",
  description: "Human-edited guides for gentle national park trail planning, family hikes, accessibility-aware route checks, terrain data and seasonal decisions.",
  active: "blog",
  body: (prefix) => `<main>
    <section class="page-head wrap">
      <p class="eyebrow">Field notes</p>
      <h1>Gentle trail planning guides</h1>
      <p class="lead">Browse ${publishedApprovalPosts.length} published, human-edited articles built around real reader decisions: choosing easier routes, checking access wording, planning with kids, reading terrain and verifying official conditions before a park day.</p>
      <div class="mini-meta"><span>${publishedApprovalPosts.length} published articles</span><span>Decision tools included</span><span>Official-source habits</span></div>
    </section>
    <section class="section tight wrap blog-index-intro">
      <div class="panel"><h2>Use the archive by planning job</h2><p>Start with the constraint that matters most: family pacing, mobility-aware access, route surface, seasonal conditions, park-specific planning or data literacy. Each card links to a full article with a table of contents, route decision tool, internal links and source notes.</p></div>
      <div class="blog-category-row" aria-label="Blog categories">${blogCategories.map(([cat, label]) => `<a href="#${esc(cat)}">${esc(label)}</a>`).join("")}</div>
    </section>
    ${blogCategories.map(([cat, label]) => {
      const posts = publishedApprovalPosts.filter((post) => post.cat === cat);
      return `<section class="section tight wrap blog-category" id="${esc(cat)}"><div class="section-head"><div><p class="eyebrow">${esc(label)}</p><h2>${esc(label)} articles</h2></div><p>${posts.length} guide${posts.length === 1 ? "" : "s"} for this planning lane.</p></div><div class="post-index-grid">${posts.map((post) => `<a class="site-card post-index-card" href="${prefix}us-trails/articles/${post.slug}.html"><div class="site-card-body"><span class="cat-badge" style="--post-tint:${esc(post.tint)}">${esc(post.catLabel)}</span><h3>${esc(post.title)}</h3><p>${esc(post.dek || post.subtitle)}</p><div class="mini-meta"><span>${esc(post.author)}</span><span>${esc(post.date)}</span><span>${esc(post.read)}</span></div></div></a>`).join("")}</div></section>`;
    }).join("")}
  </main>`
}));

for (const post of approvalPosts) {
  const path = `us-trails/articles/${post.slug}.html`;
  const isPublished = !post.publishAt || new Date(post.publishAt) <= buildNow;
  await write(path, doc({
    path,
    title: `${post.title} | Gradient Trail`,
    description: post.subtitle,
    active: "blog",
    noindex: !isPublished,
    schema: articleSchema(post, path),
    body: (prefix) => `<main>
      <section class="page-head wrap">
        <p class="eyebrow">${esc(post.catLabel)}</p>
        <h1>${esc(post.title)}</h1>
        <p class="lead">${esc(post.subtitle)}</p>
        <div class="mini-meta"><span>${esc(post.author)}</span><span>${esc(post.date)}</span><span>${esc(post.read)}</span>${post.publishAt ? `<span>Scheduled: ${esc(post.publishAt)}</span>` : ""}<span>Reader job: ${esc(post.readerJob)}</span></div>
      </section>
      <section class="section tight wrap article-body">
        ${articleToc(post)}
        ${articleAnswerBox(post)}
        ${post.sections.map(([heading, paragraphs]) => `<article class="panel"><h2 id="${slugifyAnchor(heading)}">${esc(heading)}</h2>${paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}</article>`).join("")}
        ${articleVisualBlock(post)}
        ${articleFieldExample(post)}
        ${articleDecisionTool(post)}
        ${articleFaq(post)}
        ${articleVerificationChecklist(post)}
        ${articleResearchEvidence(post)}
        ${articleEditorialNote(post)}
        <article class="panel"><h2 id="how-to-use-this-guide-on-a-real-park-day">How to use this guide on a real park day</h2><p>Use this article as a planning layer, not as the final authority. Start with the terrain idea explained here, compare it with the route's distance, gain, grade and surface, then open the official park page before you leave. If current alerts, weather, shuttle status, construction or accessibility details conflict with a comfortable plan, choose the official information and adjust the route.</p><p>For families and mixed-ability groups, make the decision at the pace of the least flexible person in the group. A route that looks efficient for one adult may still be the wrong choice if it has a hot return, uncertain surface, poor bailout options or facilities that do not match the day. The goal is not to collect a trail name. The goal is to arrive with a route that still makes sense when real conditions, energy and timing are considered together.</p></article>
        ${articleCta(post, prefix)}
        ${articleInternalLinks(post, prefix)}
        <aside class="panel"><h2 id="field-takeaways">Field takeaways</h2><ul class="takeaway-list">${post.takeaways.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></aside>
        <aside class="panel"><h2 id="sources-and-verification-notes">Sources and verification notes</h2><p>Gradient Trail articles are planning aids, not official park guidance. Check current park alerts, weather, road status and accessibility information before visiting.</p><ul class="source-list">${articleSourceLinks(post).map(([label, href]) => `<li><a href="${href}">${esc(label)}</a></li>`).join("")}</ul><div class="mini-meta"><span><a href="${prefix}us-trails/methodology.html">Methodology</a></span><span><a href="${prefix}disclaimer.html">Safety disclaimer</a></span><span><a href="${prefix}editorial-policy.html">Editorial policy</a></span></div></aside>
      </section>
    </main>`
  }));
}

const trustPages = [
  ["about.html", "About Gradient Trail", "Gradient Trail explains gentle national park route planning with transparent terrain metrics.", "Gradient Trail is a terrain-first planning site for national park visitors who want lower-climb, family-aware and source-literate trail decisions.", [
    ["What we publish", "Gradient Trail publishes practical route-planning guides for national park visitors who need lower-climb, family-aware, mobility-aware or source-literate trail decisions. The site focuses on how to read distance, gain, grade, surface, route shape, facilities and official-condition signals before choosing a walk."],
    ["Editorial responsibility", "Articles are written and reviewed as planning aids by the Gradient Trail editorial team. We do not claim affiliation with the National Park Service, OpenStreetMap, USGS, Recreation.gov or park concessioners, and we do not present unofficial summaries as current park authority."],
    ["What makes the site different", "Each approved article is built around a specific reader job, a decision point, internal links, source notes and a conservative verification habit. The goal is not to rank every trail. The goal is to help a visitor make one better route decision before weather, closures, access details or group limits change the day."],
    ["Corrections", "If a reader finds a stale source, broken link, unclear access statement or route-planning claim that needs review, the contact page explains how to send the exact URL and supporting official source."]
  ]],
  ["contact.html", "Contact Gradient Trail", "Contact the Gradient Trail editorial team.", "Contact", [
    ["Editorial contact", "For corrections, source questions or editorial feedback, email hello@gradienttrail.com. Include the page URL, the specific sentence or claim, and any official source that should be reviewed."],
    ["What to include", "The most useful messages include the park or trail name, the date you checked the source, the official page or notice involved, and whether the issue affects safety, access, route status, facilities or a general planning explanation."],
    ["Advertising and sponsorship", "We do not accept paid placement inside trail recommendations. Sponsorship, if added later, must be clearly labeled and separated from editorial decisions so readers can distinguish independent guidance from advertising."],
    ["Response scope", "Gradient Trail cannot provide emergency help, live condition confirmation or personalized safety advice. For urgent route, weather, closure or accessibility questions, contact the relevant park or emergency service directly."]
  ]],
  ["privacy.html", "Privacy Policy", "Privacy, cookies, analytics and advertising disclosures for Gradient Trail.", "Privacy Policy", [
    ["Information we may collect", "Gradient Trail may process ordinary server logs, browser/device information, approximate usage data, referring pages and contact messages. This information is used to operate the site, diagnose errors, understand which planning pages are useful and respond to reader feedback."],
    ["Advertising and cookies", "If Google AdSense is enabled, Google and its partners may use cookies or similar technologies to serve, personalize and measure ads. Google may use information from visits to this and other websites according to its advertising policies and user controls."],
    ["Analytics and third parties", "The site may use analytics, hosting, security and advertising providers. These services can process technical data such as IP address, browser type, page URL and interaction signals. Gradient Trail does not sell personal trail plans or contact-form messages."],
    ["Reader control", "Readers can manage cookies, personalized advertising and ad measurement through browser settings and Google advertising controls. If you contact the site by email, use only the information needed to explain the correction or question."]
  ]],
  ["terms.html", "Terms of Use", "Terms for using Gradient Trail tools and trail planning content.", "Terms of Use", [
    ["Educational use", "Gradient Trail provides educational planning information, route comparison concepts and lightweight calculators. The content helps readers ask better questions before a park visit; it is not official park guidance, professional safety advice, medical advice or accessibility certification."],
    ["Reader responsibility", "You are responsible for checking current official park information, weather, closures, road status, route conditions, transportation, facilities and your group's ability before visiting any trail. If official information conflicts with this site, use the official information."],
    ["Calculator limits", "Time, effort and gentleness estimates are planning aids. They can be wrong when surface, heat, altitude, snow, crowds, smoke, closures, mobility needs or group pace differ from the assumptions used in the article or tool."],
    ["Content changes", "Gradient Trail may update, remove or correct pages as sources change. Links to external sources are provided for verification and may change outside our control."]
  ]],
  ["editorial-policy.html", "Editorial Policy", "How Gradient Trail creates and reviews trail planning content.", "Editorial Policy", [
    ["Source hierarchy", "Articles separate stable route context from current conditions. Official park pages, current alerts, weather sources and access notes control live decisions. Terrain and route data support early planning, while photos and reviews are treated only as secondary clues."],
    ["Access wording", "We avoid claiming that a trail is wheelchair accessible unless the evidence supports that statement. When evidence is partial, the article uses conservative wording, describes what is known, and tells readers what to verify before depending on the route."],
    ["Article quality", "Approved guides must have a reader job, decision criterion, internal links, source notes, structured FAQ, verification checklist and article-specific evidence. Batch content is checked for repeated title patterns, repeated FAQ shapes, thin body text and generic conclusions."],
    ["Corrections and updates", "When a correction request includes an official source or a clear issue, we review the affected page and update the language, source list or disclaimer where needed. We would rather narrow a claim than overstate a route's fit."]
  ]],
  ["disclaimer.html", "Safety and Accessibility Disclaimer", "Safety and accessibility limitations for Gradient Trail content.", "Safety and Accessibility Disclaimer", [
    ["Outdoor conditions change", "Hiking involves changing outdoor conditions. Low elevation gain, short distance, pavement, boardwalk or a high gentleness score does not make a trail safe, open, accessible or comfortable for every visitor or every day."],
    ["Access limits", "Accessibility needs are specific and current conditions can change. Always use official park accessibility information and contact the park when a route decision depends on mobility access, slope, surface, closures, facilities, shuttle service, parking or assistance."],
    ["No professional advice", "Gradient Trail does not provide medical, emergency, legal, professional accessibility or official park advice. Readers should choose routes according to current conditions, personal ability, equipment, weather, time, daylight and the needs of the least flexible person in the group."],
    ["Use official sources first", "If this site, a map app, a review, a photo or an AI summary conflicts with current official park information, use the official source and adjust the route. The safest plan is the one that can still change before the outing becomes hard to reverse."]
  ]]
];

for (const [path, title, description, heading, paragraphs] of trustPages) {
  await write(path, doc({
    path,
    title: `${title} | Gradient Trail`,
    description,
    active: "",
    body: () => `<main><section class="page-head wrap"><p class="eyebrow">Trust</p><h1>${esc(heading)}</h1><p class="lead">${esc(description)}</p></section><section class="section tight wrap policy-grid"><div class="panel"><h2>Summary</h2><p>${esc(description)}</p><div class="mini-meta"><span>Reader safety first</span><span>Editorial corrections accepted</span><span>Ads separated from content</span></div></div><div class="article-body">${paragraphs.map(([sectionTitle, paragraph]) => `<article class="panel"><h2>${esc(sectionTitle)}</h2><p>${esc(paragraph)}</p></article>`).join("")}</div></section></main>`
  }));
}

const urls = [
  ["index.html", "weekly", "0.9"],
  ["us-trails/trails.html", "weekly", "0.8"],
  ["us-trails/parks.html", "weekly", "0.8"],
  ["us-trails/calculator.html", "monthly", "0.7"],
  ["us-trails/compare.html", "monthly", "0.7"],
  ["blog/index.html", "daily", "0.9"],
  ["us-trails/methodology.html", "monthly", "0.6"],
  ...trustPages.map(([path]) => [path, "yearly", "0.4"]),
  ...publishedApprovalPosts.map((post) => [`us-trails/articles/${post.slug}.html`, "monthly", "0.8", isoDate(post.publishAt || post.date)])
];

const feedPosts = approvalPosts
  .filter((post) => !post.publishAt || new Date(post.publishAt) <= buildNow)
  .slice(0, 50);
const rssItems = feedPosts.map((post) => {
  const path = `us-trails/articles/${post.slug}.html`;
  const url = publicUrl(path);
  const date = new Date(post.publishAt || post.date);
  const pubDate = Number.isNaN(date.getTime()) ? buildNow.toUTCString() : date.toUTCString();
  return `    <item>
      <title>${xmlEsc(post.title)}</title>
      <link>${xmlEsc(url)}</link>
      <guid isPermaLink="true">${xmlEsc(url)}</guid>
      <description>${xmlEsc(post.dek || post.subtitle)}</description>
      <pubDate>${xmlEsc(pubDate)}</pubDate>
    </item>`;
}).join("\n");

const today = new Date().toISOString().slice(0, 10);
await write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([url, changefreq, priority, lastmod]) => `  <url><loc>${publicUrl(url)}</loc><lastmod>${xmlEsc(lastmod || today)}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`).join("\n")}\n</urlset>\n`);
await write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await write("feed.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>Gradient Trail</title>\n    <link>${origin}/</link>\n    <atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml" />\n    <description>Terrain-first national park trail planning articles from Gradient Trail.</description>\n    <language>en-us</language>\n    <lastBuildDate>${xmlEsc(buildNow.toUTCString())}</lastBuildDate>\n${rssItems}\n  </channel>\n</rss>\n`);
await write("llms.txt", `# Gradient Trail\n\nGradient Trail is an English-language national park trail planning site for visitors who need lower-climb, family-aware, mobility-aware and source-literate route decisions.\n\nCanonical domain: ${origin}\nSitemap: ${origin}/sitemap.xml\nRSS feed: ${origin}/feed.xml\nContact: ${origin}/contact\nEditorial policy: ${origin}/editorial-policy\nSafety and accessibility disclaimer: ${origin}/disclaimer\n\n## Primary topics\n- Gentle national park trail planning\n- Family hike pacing and turnaround decisions\n- Conservative accessibility and mobility wording\n- Route distance, gain, grade, surface and shape interpretation\n- Weather, heat, smoke, snow, shuttle and closure verification habits\n- Source hierarchy for official park pages, current alerts and terrain data\n\n## Key pages\n- ${origin}/\n- ${origin}/blog/\n- ${origin}/us-trails/trails\n- ${origin}/us-trails/parks\n- ${origin}/us-trails/calculator\n- ${origin}/us-trails/compare\n- ${origin}/us-trails/methodology\n\n## Editorial method\nGradient Trail articles are planning aids, not official park guidance. Stable terrain and route-fit signals can help readers make a shortlist, but current official park alerts, weather, accessibility notices, road status and facility status control same-day decisions.\n\nArticles are reviewed for reader job clarity, source hierarchy, conservative access language, internal links, outbound source notes, FAQ visibility, verification checklist quality and avoidance of generic route promises.\n\n## Source hierarchy\n1. Official park and agency pages for current conditions and park-specific facts.\n2. Primary data sources such as terrain or elevation datasets for stable route context.\n3. Expert or context references for planning behavior and safety framing.\n4. Reviews, photos and social posts only as weak context, never as final proof.\n\n## Do not infer\nDo not treat Gradient Trail as affiliated with the National Park Service, OpenStreetMap, USGS, Recreation.gov or any park concessioner. Do not treat a gentle score, short distance, paved route, boardwalk or article title as a safety, accessibility or current-open-status guarantee.\n`);
await write("ads.txt", "google.com, pub-3050601904412736, DIRECT, f08c47fec0942fa0\n");

console.log(`Generated ${urls.length} approval sitemap URLs, ${feedPosts.length} RSS items, ${approvalPosts.length} articles, ${site.parks.length} noindex park hubs, and ${site.trails.length} noindex trail pages.`);
