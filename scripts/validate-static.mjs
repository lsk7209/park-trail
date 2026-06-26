import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { editorialPosts } from "./editorial-posts.mjs";
import { expansionPosts } from "./editorial-expansion.mjs";

const root = process.cwd();
const site = JSON.parse(await readFile(join(root, "data/site-content.json"), "utf8"));
const filterSlugs = ["easy-flat-trails", "trails-under-2-miles", "kid-friendly"];
const approvalPosts = [...editorialPosts.slice(0, 10), ...expansionPosts].slice(0, 100);
const approvalArticlePaths = approvalPosts.map((post) => `us-trails/articles/${post.slug}.html`);
const requiredFiles = [
  "favicon.svg",
  "ads.txt",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "data/site-content.json",
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
const robots = await readFile(join(root, "robots.txt"), "utf8");
const generatedTrail = await readFile(join(root, `us-trails/parks/${site.trails[0].parkSlug}/trails/${site.trails[0].slug}.html`), "utf8");
const generatedPark = await readFile(join(root, `us-trails/parks/${site.parks[0].slug}.html`), "utf8");
const article = await readFile(join(root, "us-trails/articles/choose-gentle-national-park-trail.html"), "utf8");
const privacy = await readFile(join(root, "privacy.html"), "utf8");
const adsTxt = await readFile(join(root, "ads.txt"), "utf8");
const blogIndex = await readFile(join(root, "blog/index.html"), "utf8");
const approvalArticles = await Promise.all(
  approvalArticlePaths.map(async (path) => [path, await readFile(join(root, path), "utf8")])
);
const articleQualityFailures = approvalArticles
  .filter(([, content]) => {
    const visibleTextLength = content
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim().length;
    return visibleTextLength < 4500
      || !/compare-table/.test(content)
      || !/Table of contents/.test(content)
      || !/Where to go next on Gradient Trail/.test(content)
      || !/Sources and verification notes/.test(content)
      || !/application\/ld\+json/.test(content)
      || !/rel="canonical"/.test(content);
  })
  .map(([path]) => path);

const expectations = [
  ["home page", /Gradient Trail/.test(home) && /Find gentle trails/.test(home)],
  ["home navigation", /us-trails\/trails\.html/.test(home) && /blog\/index\.html/.test(home)],
  ["blog index", /Gentle trail planning guides/.test(blogIndex) && (blogIndex.match(/class="site-card post-index-card"/g) || []).length === approvalPosts.length],
  ["title", /The Gradient Field Notes/.test(html)],
  ["filter bar", /id="filterBar"/.test(html)],
  ["featured card", /id="featuredCard"/.test(html)],
  ["newsletter behavior", /newsletterForm/.test(html) && /You're on the list/.test(html)],
  ["trust strip", /OpenStreetMap/.test(html) && /USGS 3DEP/.test(html)],
  ["responsive grid", /grid-template-columns:\s*repeat\(3/.test(html)],
  ["trails page", /trailList/.test(trails) && /parkFilter/.test(trails)],
  ["parks page", /parkGrid/.test(parks) && /Official alert check/.test(parks)],
  ["calculator page", /calcForm/.test(calculator) && /Estimated moving time/.test(calculator)],
  ["compare page", /compareTable/.test(compare) && /Trail A/.test(compare)],
  ["methodology page", /Gentleness score/.test(methodology) && /Source attribution/.test(methodology)],
  ["generated trail detail", /Trail detail/.test(generatedTrail) && /Access caution/.test(generatedTrail)],
  ["generated park hub", /Long-tail filters/.test(generatedPark) && /Top candidates/.test(generatedPark)],
  ["generated pages noindex", /noindex,follow/.test(generatedTrail) && /noindex,follow/.test(generatedPark)],
  ["sitemap approval URLs", /blog\/index\.html/.test(sitemap) && /us-trails\/articles\/choose-gentle-national-park-trail\.html/.test(sitemap) && approvalArticlePaths.every((path) => sitemap.includes(path)) && !/127\.0\.0\.1/.test(sitemap) && !/easy-flat-trails/.test(sitemap)],
  ["robots sitemap", /Sitemap:/.test(robots)],
  ["ads txt", /google\.com, pub-3050601904412736, DIRECT, f08c47fec0942fa0/.test(adsTxt)],
  ["adsense loader", /ca-pub-3050601904412736/.test(home) && /ca-pub-3050601904412736/.test(blogIndex) && /ca-pub-3050601904412736/.test(article)],
  ["privacy ads disclosure", /Google/.test(privacy) && /cookies/.test(privacy) && /personalized advertising/.test(privacy)],
  ["article content", /Field takeaways/.test(article) && /Sources and verification notes/.test(article) && /Article/.test(article)],
  ["article quality gates", articleQualityFailures.length === 0],
  ["topo tokens", /--pine:/.test(css) && /--blaze:/.test(css)],
  ["shared layout css", /hero-shell/.test(css) && /list-row/.test(css)],
  ["sample categories", /catOrder/.test(data) && /seasonal/.test(data) && (data.match(/"href": "articles\//g) || []).length === approvalPosts.length],
  ["site data", /"trails"/.test(siteData) && /"parks"/.test(siteData)]
];

const failures = expectations.filter(([, ok]) => !ok).map(([name]) => name);
if (failures.length) {
  throw new Error(`Static validation failed: ${failures.join(", ")}`);
}

console.log(`Static validation passed: ${requiredFiles.length} files and ${expectations.length} checks.`);
