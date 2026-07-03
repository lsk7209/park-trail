import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { editorialPosts } from "./editorial-posts.mjs";
import { expansionPosts } from "./editorial-expansion.mjs";
import { freshPosts } from "./editorial-fresh.mjs";
import { next100Posts } from "./editorial-next100.mjs";

const root = process.cwd();
const site = JSON.parse(await readFile(join(root, "data/site-content.json"), "utf8"));
const npsCache = JSON.parse(await readFile(join(root, "data/nps-cache.json"), "utf8"));
const filterSlugs = ["easy-flat-trails", "trails-under-2-miles", "kid-friendly"];
const ARTICLE_TARGET = 300;
const FRESH_TARGET = 100;
const NEXT100_TARGET = 100;
const approvalPosts = [...editorialPosts.slice(0, 10), ...expansionPosts, ...freshPosts, ...next100Posts].slice(0, ARTICLE_TARGET);
const buildNow = new Date();
const publishedApprovalPosts = approvalPosts.filter((post) => !post.publishAt || new Date(post.publishAt) <= buildNow);
const approvalArticlePaths = approvalPosts.map((post) => `us-trails/articles/${post.slug}.html`);
const publishedApprovalArticlePaths = publishedApprovalPosts.map((post) => `us-trails/articles/${post.slug}.html`);
const origin = "https://gradienttrail.com";
const npsOfficialPaths = (npsCache.parks || []).map((park) => `us-trails/parks/${park.slug}/official-planning.html`);

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

const requiredFiles = [
  "favicon.svg",
  "vercel.json",
  ".github/workflows/nps-sync.yml",
  "ads.txt",
  "robots.txt",
  "sitemap.xml",
  "feed.xml",
  "llms.txt",
  "data/site-content.json",
  "data/nps-cache.json",
  "data/nps-sync-summary.json",
  "index.html",
  "us-trails/Blog.html",
  "us-trails/trails.html",
  "us-trails/parks.html",
  "us-trails/calculator.html",
  "us-trails/compare.html",
  "us-trails/methodology.html",
  "us-trails/assets/topo.css",
  "us-trails/assets/topo-charts.js",
  "us-trails/assets/sample-data.js",
  "us-trails/assets/site-data.js",
  "us-trails/assets/hero-gentle-trail.png",
  "about.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "editorial-policy.html",
  "disclaimer.html",
  "blog/index.html",
  ...npsOfficialPaths,
  ...approvalArticlePaths,
  ...site.parks.map((park) => `us-trails/parks/${park.slug}.html`),
  ...site.parks.flatMap((park) => filterSlugs.map((filter) => `us-trails/parks/${park.slug}/${filter}.html`)),
  ...site.trails.map((trail) => `us-trails/parks/${trail.parkSlug}/trails/${trail.slug}.html`)
];

for (const file of requiredFiles) {
  await access(join(root, file));
}

const home = await readFile(join(root, "index.html"), "utf8");
const html = await readFile(join(root, "us-trails/Blog.html"), "utf8");
const trails = await readFile(join(root, "us-trails/trails.html"), "utf8");
const parks = await readFile(join(root, "us-trails/parks.html"), "utf8");
const calculator = await readFile(join(root, "us-trails/calculator.html"), "utf8");
const compare = await readFile(join(root, "us-trails/compare.html"), "utf8");
const methodology = await readFile(join(root, "us-trails/methodology.html"), "utf8");
const css = await readFile(join(root, "us-trails/assets/topo.css"), "utf8");
const data = await readFile(join(root, "us-trails/assets/sample-data.js"), "utf8");
const siteData = await readFile(join(root, "us-trails/assets/site-data.js"), "utf8");
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const feed = await readFile(join(root, "feed.xml"), "utf8");
const robots = await readFile(join(root, "robots.txt"), "utf8");
const generatedTrail = await readFile(join(root, `us-trails/parks/${site.trails[0].parkSlug}/trails/${site.trails[0].slug}.html`), "utf8");
const generatedPark = await readFile(join(root, `us-trails/parks/${site.parks[0].slug}.html`), "utf8");
const article = await readFile(join(root, "us-trails/articles/choose-gentle-national-park-trail.html"), "utf8");
const about = await readFile(join(root, "about.html"), "utf8");
const contact = await readFile(join(root, "contact.html"), "utf8");
const privacy = await readFile(join(root, "privacy.html"), "utf8");
const terms = await readFile(join(root, "terms.html"), "utf8");
const editorialPolicy = await readFile(join(root, "editorial-policy.html"), "utf8");
const disclaimer = await readFile(join(root, "disclaimer.html"), "utf8");
const adsTxt = await readFile(join(root, "ads.txt"), "utf8");
const vercelConfig = JSON.parse(await readFile(join(root, "vercel.json"), "utf8"));
const npsWorkflow = await readFile(join(root, ".github/workflows/nps-sync.yml"), "utf8");
const blogIndex = await readFile(join(root, "blog/index.html"), "utf8");
const npsOfficialPages = await Promise.all(
  npsOfficialPaths.map(async (path) => [path, await readFile(join(root, path), "utf8")])
);
const articleDirFiles = (await readdir(join(root, "us-trails/articles"))).filter((file) => file.endsWith(".html"));
const approvalArticles = await Promise.all(
  approvalArticlePaths.map(async (path) => [path, await readFile(join(root, path), "utf8")])
);

async function collectHtmlFiles(dirFromRoot) {
  const dir = join(root, dirFromRoot);
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = dirFromRoot ? `${dirFromRoot}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === ".goal-harness" || entry.name === ".omx" || entry.name === "node_modules") continue;
      files.push(...await collectHtmlFiles(rel));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(rel.replace(/\\/g, "/"));
    }
  }
  return files;
}

const allHtmlFiles = await collectHtmlFiles("");
const allHtmlPages = await Promise.all(allHtmlFiles.map(async (path) => [path, await readFile(join(root, path), "utf8")]));

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function uniqueCount(values) {
  return new Set(values.map(normalize)).size;
}

function hasKeywordCoverage(post) {
  const keywordRequiredPosts = new Set([...freshPosts, ...next100Posts]);
  if (!post.mainKeyword) return !keywordRequiredPosts.has(post);
  const title = normalize(post.title);
  const subtitle = normalize(post.subtitle);
  const main = normalize(post.mainKeyword);
  const extended = post.extendedKeywords || [];
  return main
    && (title.includes(main) || subtitle.includes(main))
    && extended.length >= 2
    && extended.some((keyword) => title.includes(normalize(keyword)) || subtitle.includes(normalize(keyword)));
}

function hasStrictTitleSubtitleCoverage(post) {
  const title = normalize(post.title);
  const subtitle = normalize(post.subtitle);
  const main = normalize(post.mainKeyword);
  const extended = post.extendedKeywords || [];
  return main
    && title.includes(main)
    && subtitle.includes(main)
    && extended.length >= 2
    && extended.some((keyword) => title.includes(normalize(keyword)))
    && extended.some((keyword) => subtitle.includes(normalize(keyword)));
}

function hasReadableVisualPalette(post) {
  return Boolean(post.visual?.accent)
    && Boolean(post.visual?.accentSoft)
    && Boolean(post.visual?.accentAlt)
    && Array.isArray(post.visual?.rows)
    && post.visual.rows.length >= 3;
}

function hasEnhancedArticleTools(post) {
  const faqText = (post.faq || []).map((item) => `${item.q} ${item.a}`).join(" ");
  const verificationText = [
    post.verificationChecklist?.title,
    post.verificationChecklist?.intro,
    ...(post.verificationChecklist?.rows || []).map((row) => row.join(" "))
  ].join(" ");
  return Boolean(post.answerBox?.title)
    && Boolean(post.answerBox?.answer)
    && Array.isArray(post.answerBox?.bullets)
    && post.answerBox.bullets.length >= 3
    && Boolean(post.fieldExample?.title)
    && Boolean(post.fieldExample?.intro)
    && Array.isArray(post.fieldExample?.rows)
    && post.fieldExample.rows.length >= 3
    && Boolean(post.verificationChecklist?.title)
    && Boolean(post.verificationChecklist?.intro)
    && Array.isArray(post.verificationChecklist?.rows)
    && post.verificationChecklist.rows.length >= 4
    && Array.isArray(post.faq)
    && post.faq.length >= 3
    && normalize(faqText).includes(normalize(post.mainKeyword))
    && post.extendedKeywords.some((keyword) => normalize(faqText).includes(normalize(keyword)))
    && normalize(verificationText).includes(normalize(post.mainKeyword))
    && post.extendedKeywords.every((keyword) => normalize(verificationText).includes(normalize(keyword)));
}

function hasResearchEvidence(post) {
  const evidence = post.researchEvidence;
  const allowedRoles = new Set(["official", "primary_data", "expert_reference", "competitor", "context_only"]);
  return Boolean(evidence)
    && Array.isArray(evidence.research_runs)
    && evidence.research_runs.length >= 3
    && Array.isArray(evidence.sources)
    && evidence.sources.length >= 5
    && evidence.sources.every((source) => source.id && source.label && source.href && allowedRoles.has(source.source_role) && source.accessed && Array.isArray(source.data_points) && source.data_points.length >= 1)
    && Boolean(evidence.source_interpretation_note)
    && Array.isArray(evidence.article_specific_details)
    && evidence.article_specific_details.length >= 2
    && evidence.article_specific_details.every((detail) => detail.claim && detail.source_id && evidence.sources.some((source) => source.id === detail.source_id))
    && evidence.fact_traceability_pass === true;
}

function sectionSignature(post) {
  return (post.sections || []).map(([heading]) => normalize(heading).split(" ").slice(0, 4).join(" ")).join("|");
}

const generatedScheduledPosts = [
  ...freshPosts.slice(0, FRESH_TARGET),
  ...next100Posts.slice(0, NEXT100_TARGET)
];
const scheduled = generatedScheduledPosts.map((post) => post.publishAt);
const scheduleIntervalOk = scheduled.every((value, index) => {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
  if (index === 0) return true;
  return new Date(value) - new Date(scheduled[index - 1]) === 5 * 60 * 60 * 1000;
});

const next100StrictQualityOk = next100Posts.length === NEXT100_TARGET
  && next100Posts.every(hasStrictTitleSubtitleCoverage)
  && next100Posts.every(hasReadableVisualPalette)
  && next100Posts.every(hasEnhancedArticleTools)
  && next100Posts.every(hasResearchEvidence)
  && next100Posts.every((post) => Number(post.qualityScore) >= 90)
  && uniqueCount(next100Posts.map((post) => post.mainKeyword)) === NEXT100_TARGET
  && uniqueCount(next100Posts.map((post) => post.title)) === NEXT100_TARGET
  && uniqueCount(next100Posts.map((post) => post.structureType)) >= 5
  && uniqueCount(next100Posts.map((post) => post.visual?.type || "")) >= 6
  && uniqueCount(next100Posts.map(sectionSignature)) >= 6
  && uniqueCount(next100Posts.map((post) => (post.faq || []).map((item) => normalize(item.q)).join("|"))) >= 90;

const sourceQualityOk = approvalPosts.length === ARTICLE_TARGET
  && freshPosts.length === FRESH_TARGET
  && next100Posts.length === NEXT100_TARGET
  && uniqueCount(approvalPosts.map((post) => post.slug)) === ARTICLE_TARGET
  && uniqueCount(approvalPosts.map((post) => post.title)) === ARTICLE_TARGET
  && uniqueCount(generatedScheduledPosts.map((post) => post.mainKeyword)) === FRESH_TARGET + NEXT100_TARGET
  && approvalPosts.every(hasKeywordCoverage)
  && scheduleIntervalOk;

const articleQualityFailures = approvalArticles
  .filter(([, content]) => {
    const body = content.match(/<section class="section tight wrap article-body">([\s\S]*?)<\/section>/)?.[1] || "";
    const visibleTextLength = body
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim().length;
    return visibleTextLength < 4500
      || !/compare-table/.test(content)
      || !/visual-block/.test(content)
      || !/Table of contents/.test(content)
      || !/Where to go next on Gradient Trail/.test(content)
      || !/Sources and verification notes/.test(content)
      || !/application\/ld\+json/.test(content)
      || !/rel="canonical"/.test(content);
  })
  .map(([path]) => path);

const next100Slugs = new Set(next100Posts.map((post) => post.slug));
const approvalBySlug = new Map(approvalPosts.map((post) => [post.slug, post]));
const next100RenderedEnhancementFailures = approvalArticles
  .filter(([path, content]) => {
    const slug = path.split("/").pop().replace(/\.html$/, "");
    if (!next100Slugs.has(slug)) return false;
    return !/answer-card/.test(content)
      || !/example-box/.test(content)
      || !/qa-panel/.test(content)
      || !/verification-panel/.test(content)
      || !/quick questions/.test(content)
      || !/"@type":"FAQPage"/.test(content)
      || !/"@type":"Question"/.test(content)
      || !/research-evidence/.test(content)
      || !/Research evidence used/.test(content)
      || !/Article-specific details/.test(content)
      || !/Research runs checked for this article/.test(content)
      || !/--visual-alt:#[0-9a-f]{6}/i.test(content);
  })
  .map(([path]) => path);

function postByArticlePath(path) {
  return approvalBySlug.get(path.split("/").pop().replace(/\.html$/, ""));
}

function removePhrase(value, phrase) {
  const source = ` ${normalize(value)} `;
  const target = ` ${normalize(phrase)} `;
  return target.trim() ? source.replaceAll(target, " ") : source;
}

function articleSpecificTerms(post) {
  return [
    post?.title,
    post?.subtitle,
    post?.mainKeyword,
    ...(post?.extendedKeywords || []),
    ...((post?.decisionTool?.rows || []).map((row) => row[0]))
  ].filter(Boolean).sort((a, b) => normalize(b).length - normalize(a).length);
}

function faqPatternSignature(path, content) {
  const post = postByArticlePath(path);
  const panel = content.match(/<article class="panel qa-panel">([\s\S]*?)<\/article>/)?.[1] || "";
  const questions = [...panel.matchAll(/<h3>([\s\S]*?)<\/h3>/g)].map((match) => {
    let value = match[1].replace(/<[^>]+>/g, " ");
    for (const term of articleSpecificTerms(post)) value = removePhrase(value, term);
    return normalize(value)
      .replace(/\b[a-z0-9]{9,}\b/g, "_")
      .replace(/\b(route|trail|reader|article|planning|decision|source|official|conditions|group|signal|check)\b/g, "_")
      .replace(/\s+/g, " ")
      .trim();
  });
  return questions.join("|");
}

function verificationPatternSignature(path, content) {
  const post = postByArticlePath(path);
  const panel = content.match(/<aside class="panel verification-panel">([\s\S]*?)<\/aside>/)?.[1] || "";
  const labels = [...panel.matchAll(/<b>([\s\S]*?)<\/b>/g)].map((match) => {
    let value = match[1].replace(/<[^>]+>/g, " ");
    for (const term of articleSpecificTerms(post)) value = removePhrase(value, term);
    return normalize(value).replace(/\b[a-z0-9]{9,}\b/g, "_").trim();
  });
  return labels.join("|");
}

const approvalRenderedEnhancementFailures = approvalArticles
  .filter(([, content]) => {
    return !/answer-card/.test(content)
      || !/example-box/.test(content)
      || !/qa-panel/.test(content)
      || !/verification-panel/.test(content)
      || !/research-evidence/.test(content)
      || !/Research evidence used/.test(content)
      || !/Article-specific details/.test(content)
      || !/Research runs checked for this article/.test(content)
      || !/quick questions/.test(content)
      || !/"@type":"FAQPage"/.test(content)
      || !/"@type":"Question"/.test(content);
  })
  .map(([path]) => path);

const approvalFaqPatternCount = uniqueCount(approvalArticles.map(([path, content]) => faqPatternSignature(path, content)));
const approvalVerificationPatternCount = uniqueCount(approvalArticles.map(([path, content]) => verificationPatternSignature(path, content)));
const approvalPatternDiversityOk = approvalFaqPatternCount >= 6 && approvalVerificationPatternCount >= 4;

function visibleLength(content) {
  return content
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

const trustPagesSubstantiveOk = [about, contact, privacy, terms, editorialPolicy, disclaimer]
  .every((content) => visibleLength(content) >= 900 && /Reader safety first/.test(content) && /Editorial corrections accepted/.test(content));

const adsenseLoaderCount = (content) => (content.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g) || []).length;
const skimlinksLoaderCount = (content) => (content.match(/s\.skimresources\.com\/js\/305683X1793900\.skimlinks\.js/g) || []).length;
const npsOfficialPageContents = npsOfficialPages.map(([, content]) => content);
const primaryPublicPages = [home, blogIndex, article, about, contact, privacy, terms, editorialPolicy, disclaimer, trails, parks, calculator, compare, methodology, ...npsOfficialPageContents];
const publicPagesHaveSingleLoader = primaryPublicPages
  .every((content) => adsenseLoaderCount(content) === 1);
const publicPagesHaveRssDiscovery = primaryPublicPages
  .every((content) => /rel="alternate" type="application\/rss\+xml"[^>]+href="https:\/\/gradienttrail\.com\/feed\.xml"/.test(content));
const publicPagesHaveVerificationMeta = primaryPublicPages
  .every((content) => /name="google-site-verification" content="EWaJY7dnYLETiLKgkZp6yXSfY-b0EQJfDkKcr5OubcM"/.test(content)
    && /name="naver-site-verification" content="1d1e74be2fc392a80a09240a8bbda0a3145084a8"/.test(content));
const ga4LoaderCount = (content) => (content.match(/googletagmanager\.com\/gtag\/js\?id=G-JXKB19KWYF/g) || []).length;
const publicPagesHaveSingleGa4 = primaryPublicPages
  .every((content) => ga4LoaderCount(content) === 1 && /gtag\("config","G-JXKB19KWYF"\)/.test(content));
const cleanSitemapOk = /<loc>https:\/\/gradienttrail\.com\/<\/loc>/.test(sitemap)
  && /<loc>https:\/\/gradienttrail\.com\/blog\/<\/loc>/.test(sitemap)
  && publishedApprovalArticlePaths.every((path) => sitemap.includes(`<loc>${publicUrl(path)}</loc>`))
  && npsOfficialPaths.every((path) => sitemap.includes(`<loc>${publicUrl(path)}</loc>`))
  && approvalArticlePaths.filter((path) => !publishedApprovalArticlePaths.includes(path)).every((path) => !sitemap.includes(`<loc>${publicUrl(path)}</loc>`))
  && !/\.html<\/loc>/.test(sitemap)
  && !/127\.0\.0\.1/.test(sitemap)
  && !/easy-flat-trails/.test(sitemap)
  && (sitemap.match(/us-trails\/articles\//g) || []).length === publishedApprovalPosts.length;
const feedOk = /<rss version="2\.0"/.test(feed)
  && /<atom:link href="https:\/\/gradienttrail\.com\/feed\.xml" rel="self" type="application\/rss\+xml"/.test(feed)
  && /<channel>/.test(feed)
  && /<item>/.test(feed)
  && /<guid isPermaLink="true">https:\/\/gradienttrail\.com\/us-trails\/articles\//.test(feed)
  && !/127\.0\.0\.1/.test(feed);

function getCanonical(content) {
  return content.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || "";
}

function getTitle(content) {
  return content.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
}

function getDescription(content) {
  return content.match(/<meta name="description" content="([^"]+)"/)?.[1] || "";
}

function hLevelSequence(content) {
  return [...content.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));
}

function hasOrderedHeadings(content) {
  const levels = hLevelSequence(content);
  return levels.length > 0
    && levels[0] === 1
    && levels.filter((level) => level === 1).length === 1
    && levels.every((level, index) => index === 0 || level - levels[index - 1] <= 1);
}

const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const indexablePublicPages = [
  ["index.html", home],
  ["blog/index.html", blogIndex],
  ["us-trails/trails.html", trails],
  ["us-trails/parks.html", parks],
  ["us-trails/calculator.html", calculator],
  ["us-trails/compare.html", compare],
  ["us-trails/methodology.html", methodology],
  ["us-trails/articles/choose-gentle-national-park-trail.html", article],
  ["about.html", about],
  ["contact.html", contact],
  ["privacy.html", privacy],
  ["terms.html", terms],
  ["editorial-policy.html", editorialPolicy],
  ["disclaimer.html", disclaimer],
  ...npsOfficialPages
];

const canonicalAndSitemapOk = indexablePublicPages.every(([path, content]) => {
  const canonical = getCanonical(content);
  return canonical === publicUrl(path)
    && sitemap.includes(`<loc>${canonical}</loc>`)
    && !canonical.includes("www.")
    && !canonical.endsWith(".html");
});

const metaKeywordFrontOk = [
  [home, "gentle national"],
  [blogIndex, "gentle national park trail"],
  [article, normalize(postByArticlePath("choose-gentle-national-park-trail.html")?.mainKeyword || "gentle national park trail")]
].every(([content, keyword]) => normalize(`${getTitle(content)} ${getDescription(content)}`).includes(normalize(keyword).split(" ").slice(0, 2).join(" ")));

const articleLinkStructureOk = /route-planning-next-step/.test(article)
  && /Open Trail Finder/.test(article)
  && (article.match(/href="\.\.\/\.\.\/us-trails\//g) || []).length >= 2
  && (article.match(/href="https:\/\/www\.nps\.gov\//g) || []).length >= 3;

const primaryToolPagesEnhancedOk = [trails, parks, calculator, compare, methodology]
  .every((content) => !/www\.gradienttrail\.com/.test(content)
    && !/Blog\.html/.test(content)
    && /name="description"/.test(content)
    && /property="og:url" content="https:\/\/gradienttrail\.com\/us-trails\//.test(content)
    && adsenseLoaderCount(content) === 1
    && ga4LoaderCount(content) === 1);

const crawlableToolFallbackOk = /Lower Yosemite Fall Loop/.test(trails)
  && /Mather Point Rim Walk/.test(trails)
  && /Jordan Pond Path/.test(trails)
  && /href="parks\/yosemite\/trails\/lower-yosemite-fall-loop\.html"/.test(trails)
  && /Yosemite/.test(parks)
  && /Grand Canyon/.test(parks)
  && /href="parks\/acadia\.html"/.test(parks);

const articleTrustSchemaOk = /"@type":"Person"/.test(article)
  && /"reviewedBy"/.test(article)
  && /"@type":"BreadcrumbList"/.test(article)
  && /Editorial review note/.test(article);

const articleOfficialDepthSamples = [
  "us-trails/articles/gentle-national-park-trails-first-time-visitors.html",
  "us-trails/articles/how-to-read-national-park-trail-page.html",
  "us-trails/articles/official-alerts-night-before-hike.html",
  "us-trails/articles/yosemite-gentle-trail-first-day.html",
  "us-trails/articles/zion-gentle-walk-shuttle-day.html",
  "us-trails/articles/yellowstone-boardwalk-gentle-routes.html",
  "us-trails/articles/grand-canyon-rim-gentle-walk.html",
  "us-trails/articles/acadia-carriage-road-gentle-hike.html",
  "us-trails/articles/rocky-mountain-lake-loop-easy.html"
];
const articleOfficialDepthOk = articleOfficialDepthSamples.every((path) => {
  const content = approvalArticles.find(([articlePath]) => articlePath === path)?.[1] || "";
  return /Official park data checkpoints/.test(content)
    && /NPS data/.test(content)
    && /official-planning\.html/.test(content)
    && /Same-day official pages still control closures/.test(content)
    && /alerts<\/span>/.test(content)
    && /visitor centers<\/span>/.test(content)
    && /campgrounds<\/span>/.test(content);
});

const llmsExpandedOk = /## Editorial method/.test(await readFile(join(root, "llms.txt"), "utf8"))
  && /## Source hierarchy/.test(await readFile(join(root, "llms.txt"), "utf8"))
  && /Do not treat Gradient Trail as affiliated/.test(await readFile(join(root, "llms.txt"), "utf8"));

const legacyBlogOk = /noindex,follow/.test(html)
  && getCanonical(html) === "https://gradienttrail.com/blog/"
  && !sitemap.includes("https://gradienttrail.com/us-trails/Blog")
  && !/www\.gradienttrail\.com/.test(html);

const wwwRedirectOk = Array.isArray(vercelConfig.redirects)
  && vercelConfig.redirects.some((redirect) => redirect.source === "/:path*"
    && redirect.destination === "https://gradienttrail.com/:path*"
    && redirect.permanent === true
    && Array.isArray(redirect.has)
    && redirect.has.some((rule) => rule.type === "host" && rule.value === "www.gradienttrail.com"));

const legacyBlogServerRedirectOk = Array.isArray(vercelConfig.redirects)
  && ["/us-trails/Blog", "/us-trails/Blog.html"].every((source) => vercelConfig.redirects.some((redirect) => redirect.source === source
    && redirect.destination === "https://gradienttrail.com/blog/"
    && redirect.permanent === true));

const sitemapUniqueOk = sitemapLocs.length === new Set(sitemapLocs).size;
const canonicalUniqueOk = indexablePublicPages
  .map(([, content]) => getCanonical(content))
  .filter(Boolean).length === new Set(indexablePublicPages.map(([, content]) => getCanonical(content)).filter(Boolean)).size;

const noManualAdSlotsOk = allHtmlPages.every(([, content]) => !/<ins\b[^>]*class=["'][^"']*adsbygoogle/i.test(content)
  && !/data-ad-slot\s*=/.test(content)
  && !/adsbygoogle\.push\s*\(/.test(content));

const noindexPagesNoLoaderOk = allHtmlPages
  .filter(([, content]) => /name="robots" content="noindex,follow"/.test(content))
  .every(([, content]) => adsenseLoaderCount(content) === 0 && ga4LoaderCount(content) === 0);
const skimlinksLoaderOk = allHtmlPages.every(([, content]) => skimlinksLoaderCount(content) === 1);
const affiliateDisclosureOk = allHtmlPages.every(([, content]) => /may be affiliate-enabled through Skimlinks/.test(content))
  && /Affiliate links/.test(privacy)
  && /Affiliate independence/.test(editorialPolicy)
  && approvalArticles.every(([, content]) => /Planning resources and affiliate disclosure/.test(content)
    && /class="affiliate-disclosure"/.test(content)
    && /rel="sponsored noopener"/.test(content)
    && /https:\/\/www\.rei\.com\//.test(content));

const coreSchemaPages = [
  home,
  trails,
  parks,
  calculator,
  compare,
  methodology
];
const coreSchemaOk = coreSchemaPages.every((content) => /<script type="application\/ld\+json">/.test(content)
  && /"@id":"https:\/\/gradienttrail\.com\/#organization"/.test(content)
  && /"@id":"https:\/\/gradienttrail\.com\/#website"/.test(content));

const homeHeroImageOk = /<img class="hero-media"[^>]+src="us-trails\/assets\/hero-gentle-trail\.png"[^>]+width="1536"[^>]+height="1024"[^>]+alt="[^"]+"/.test(home)
  && /fetchpriority="high"/.test(home)
  && /\.hero-media/.test(css);

const npsCacheText = JSON.stringify(npsCache);
const npsCacheSafeOk = npsCache.schemaVersion === 1
  && npsCache.source === "National Park Service API"
  && /^\d{4}-\d{2}-\d{2}T/.test(npsCache.fetchedAt || "")
  && Array.isArray(npsCache.parks)
  && npsCache.parks.length === site.parks.length
  && npsCache.parks.every((park) => park.slug && park.parkCode && park.name && park.url?.startsWith("https://www.nps.gov/") && park.contentHash && Array.isArray(park.alerts) && Array.isArray(park.visitorCenters) && Array.isArray(park.campgrounds))
  && !/api[_-]?key/i.test(npsCacheText);

const npsWorkflowOk = /workflow_dispatch:/.test(npsWorkflow)
  && /cron: "17 9 \* \* 1,4"/.test(npsWorkflow)
  && /concurrency:/.test(npsWorkflow)
  && /contents: write/.test(npsWorkflow)
  && /NPS_API_KEY: \$\{\{ secrets\.NPS_API_KEY \}\}/.test(npsWorkflow)
  && /npm run nps:fetch/.test(npsWorkflow)
  && /npm run build:static && npm run check/.test(npsWorkflow)
  && /steps\.nps_changed\.outputs\.changed == 'true'/.test(npsWorkflow);

const npsOfficialPagesQualityOk = npsOfficialPages.length === npsCache.parks.length
  && npsOfficialPages.every(([path, content]) => {
    const park = npsCache.parks.find((item) => path.includes(`/parks/${item.slug}/`));
    const canonical = getCanonical(content);
    const visible = visibleLength(content);
    return park
      && canonical === publicUrl(path)
      && sitemap.includes(`<loc>${canonical}</loc>`)
      && !/noindex,follow/.test(content)
      && visible >= 1800
      && /Official data snapshot/.test(content)
      && /How to use this official snapshot/.test(content)
      && /Current alerts in the NPS snapshot/.test(content)
      && /Visitor centers and planning stops/.test(content)
      && /Campground logistics near route planning/.test(content)
      && /Source and refresh note/.test(content)
      && /Open official NPS page/.test(content)
      && /National Park Service API documentation/.test(content)
      && /current official|official NPS page|official park page/i.test(content)
      && /"@type":"Dataset"/.test(content)
      && /"@type":"BreadcrumbList"/.test(content)
      && adsenseLoaderCount(content) === 1
      && ga4LoaderCount(content) === 1;
  });

const headingStructureOk = indexablePublicPages.every(([, content]) => hasOrderedHeadings(content));
const sitemapMetadataOk = sitemapLocs.length === 13 + npsOfficialPaths.length + publishedApprovalPosts.length
  && (sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length === sitemapLocs.length
  && (sitemap.match(/<changefreq>/g) || []).length === sitemapLocs.length
  && (sitemap.match(/<priority>/g) || []).length === sitemapLocs.length;

const expectations = [
  ["home page", /Gradient Trail/.test(home) && /Find gentle trails/.test(home)],
  ["home navigation", /us-trails\/trails\.html/.test(home) && /blog\/index\.html/.test(home)],
  ["open graph metadata", /property="og:title"/.test(home) && /property="og:description"/.test(article) && /name="twitter:card"/.test(blogIndex)],
  ["primary tool pages enhanced", primaryToolPagesEnhancedOk],
  ["crawlable tool fallback", crawlableToolFallbackOk],
  ["blog index", /Gentle trail planning guides/.test(blogIndex) && (blogIndex.match(/class="site-card post-index-card"/g) || []).length === publishedApprovalPosts.length],
  ["canonical and sitemap consistency", canonicalAndSitemapOk],
  ["www host redirect", wwwRedirectOk],
  ["legacy blog server redirect", legacyBlogServerRedirectOk],
  ["meta keyword coverage", metaKeywordFrontOk],
  ["ordered heading structure", headingStructureOk],
  ["article source quality", sourceQualityOk],
  ["next100 strict title subtitle quality", next100StrictQualityOk],
  ["article file count", articleDirFiles.length === ARTICLE_TARGET],
  ["legacy blog canonical redirect", legacyBlogOk],
  ["responsive grid", /grid-template-columns:\s*repeat\(3/.test(css) && /@media \(max-width: 720px\)/.test(css)],
  ["trails page", /trailList/.test(trails) && /parkFilter/.test(trails)],
  ["parks page", /parkGrid/.test(parks) && /Official alert check/.test(parks)],
  ["calculator page", /calcForm/.test(calculator) && /Estimated moving time/.test(calculator)],
  ["compare page", /compareTable/.test(compare) && /Trail A/.test(compare)],
  ["methodology page", /Gentleness score/.test(methodology) && /Source attribution/.test(methodology)],
  ["generated trail detail", /Trail detail/.test(generatedTrail) && /Access caution/.test(generatedTrail)],
  ["generated park hub", /Long-tail filters/.test(generatedPark) && /Top candidates/.test(generatedPark)],
  ["generated pages noindex", /noindex,follow/.test(generatedTrail) && /noindex,follow/.test(generatedPark)],
  ["noindex pages omit adsense loader", adsenseLoaderCount(generatedTrail) === 0 && adsenseLoaderCount(generatedPark) === 0],
  ["sitemap clean approval URLs", cleanSitemapOk],
  ["sitemap unique URLs", sitemapUniqueOk],
  ["sitemap metadata", sitemapMetadataOk],
  ["robots sitemap", /Sitemap:/.test(robots)],
  ["rss feed", feedOk],
  ["unique canonicals", canonicalUniqueOk],
  ["nps cache safe schema", npsCacheSafeOk],
  ["nps workflow", npsWorkflowOk],
  ["nps official pages quality", npsOfficialPagesQualityOk],
  ["llms expanded", llmsExpandedOk],
  ["rss discovery", publicPagesHaveRssDiscovery],
  ["site verification meta", publicPagesHaveVerificationMeta],
  ["ga4 tag", publicPagesHaveSingleGa4],
  ["ads txt", /google\.com, pub-3050601904412736, DIRECT, f08c47fec0942fa0/.test(adsTxt)],
  ["adsense loader", publicPagesHaveSingleLoader && /ca-pub-3050601904412736/.test(home) && /ca-pub-3050601904412736/.test(blogIndex) && /ca-pub-3050601904412736/.test(article)],
  ["skimlinks loader", skimlinksLoaderOk],
  ["affiliate disclosure and resources", affiliateDisclosureOk],
  ["no manual adsense slots", noManualAdSlotsOk],
  ["noindex pages omit tracking", noindexPagesNoLoaderOk],
  ["core page schema", coreSchemaOk],
  ["home hero image asset", homeHeroImageOk],
  ["privacy ads disclosure", /Google/.test(privacy) && /cookies/.test(privacy) && /personalized advertising/.test(privacy)],
  ["trust pages substantive", trustPagesSubstantiveOk],
  ["article content", /Field takeaways/.test(article) && /Sources and verification notes/.test(article) && /Article/.test(article)],
  ["article trust schema", articleTrustSchemaOk],
  ["representative article official data depth", articleOfficialDepthOk],
  ["article CTA and links", articleLinkStructureOk],
  ["article quality gates", articleQualityFailures.length === 0],
  ["next100 rendered enhanced quality", next100RenderedEnhancementFailures.length === 0],
  ["all approval articles enhanced quality", approvalRenderedEnhancementFailures.length === 0],
  ["all approval article pattern diversity", approvalPatternDiversityOk],
  ["topo tokens", /--pine:/.test(css) && /--blaze:/.test(css) && /affiliate-resource-panel/.test(css)],
  ["shared layout css", /hero-shell/.test(css) && /list-row/.test(css)],
  ["sample categories", /catOrder/.test(data) && /seasonal/.test(data) && (data.match(/"href": "articles\//g) || []).length === publishedApprovalPosts.length],
  ["site data", /"trails"/.test(siteData) && /"parks"/.test(siteData)]
];

const failures = expectations.filter(([, ok]) => !ok).map(([name]) => name);
if (failures.length) {
  throw new Error(`Static validation failed: ${failures.join(", ")}`);
}

console.log(`Static validation passed: ${requiredFiles.length} files and ${expectations.length} checks.`);
