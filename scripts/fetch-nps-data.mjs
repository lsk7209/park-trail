import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const apiBase = "https://developer.nps.gov/api/v1";
const defaultKeyPath = process.platform === "win32" ? "D:\\env\\nps_api_key.txt" : "";
const site = JSON.parse(await readFile(join(root, "data/site-content.json"), "utf8"));
const cachePath = process.env.NPS_CACHE_PATH || join(root, "data/nps-cache.json");
const summaryPath = process.env.NPS_SYNC_SUMMARY || join(root, "data/nps-sync-summary.json");
const dryRun = process.argv.includes("--dry-run");

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hash(value) {
  return createHash("sha256").update(stableJson(value)).digest("hex");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function compactText(value, max = 420) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

async function readOptional(path) {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

async function loadApiKey() {
  if (process.env.NPS_API_KEY) return process.env.NPS_API_KEY.trim();
  const filePath = process.env.NPS_API_KEY_FILE || defaultKeyPath;
  if (!filePath) return "";
  return (await readOptional(filePath)).trim();
}

function normalizePark(raw, localPark) {
  return {
    parkCode: raw.parkCode || localPark.code?.toLowerCase(),
    slug: localPark.slug,
    name: raw.fullName || localPark.name,
    localName: localPark.name,
    designation: raw.designation || "",
    states: raw.states || "",
    url: raw.url || "",
    description: compactText(raw.description, 700),
    weatherInfo: compactText(raw.weatherInfo, 700),
    directionsInfo: compactText(raw.directionsInfo, 500),
    directionsUrl: raw.directionsUrl || "",
    latLong: raw.latLong || "",
    addresses: (raw.addresses || []).map((address) => ({
      type: address.type || "",
      line1: address.line1 || "",
      city: address.city || "",
      stateCode: address.stateCode || "",
      postalCode: address.postalCode || ""
    })),
    entranceFees: (raw.entranceFees || []).slice(0, 6).map((fee) => ({
      title: fee.title || "",
      cost: fee.cost || "",
      description: compactText(fee.description, 240)
    })),
    operatingHours: (raw.operatingHours || []).slice(0, 4).map((hours) => ({
      name: hours.name || "",
      description: compactText(hours.description, 240),
      standardHours: hours.standardHours || {}
    })),
    officialImages: (raw.images || []).slice(0, 3).map((image) => ({
      title: image.title || "",
      altText: image.altText || "",
      credit: image.credit || "",
      url: image.url || ""
    }))
  };
}

function normalizeAlert(raw) {
  return {
    id: raw.id || slugify(raw.title),
    title: raw.title || "Untitled alert",
    category: raw.category || "",
    url: raw.url || "",
    description: compactText(raw.description, 700),
    lastIndexedDate: raw.lastIndexedDate || ""
  };
}

function normalizeVisitorCenter(raw) {
  return {
    id: raw.id || slugify(raw.name),
    name: raw.name || "",
    url: raw.url || "",
    description: compactText(raw.description, 500),
    directionsInfo: compactText(raw.directionsInfo, 320),
    directionsUrl: raw.directionsUrl || "",
    addresses: (raw.addresses || []).slice(0, 2).map((address) => ({
      type: address.type || "",
      line1: address.line1 || "",
      city: address.city || "",
      stateCode: address.stateCode || ""
    }))
  };
}

function normalizeCampground(raw) {
  return {
    id: raw.id || slugify(raw.name),
    name: raw.name || "",
    url: raw.url || "",
    description: compactText(raw.description, 500),
    reservationUrl: raw.reservationUrl || "",
    weatherOverview: compactText(raw.weatherOverview, 320),
    numberOfSitesReservable: raw.numberOfSitesReservable || "",
    numberOfSitesFirstComeFirstServe: raw.numberOfSitesFirstComeFirstServe || ""
  };
}

async function npsFetch(path, params, apiKey) {
  const url = new URL(`${apiBase}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  url.searchParams.set("api_key", apiKey);
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`NPS ${path} failed with HTTP ${response.status}`);
  }
  return response.json();
}

async function fetchParkBundle(localPark, apiKey) {
  const code = String(localPark.code || "").toLowerCase();
  const [parks, alerts, visitorCenters, campgrounds] = await Promise.all([
    npsFetch("parks", { parkCode: code, limit: 1 }, apiKey),
    npsFetch("alerts", { parkCode: code, limit: 50 }, apiKey),
    npsFetch("visitorcenters", { parkCode: code, limit: 20 }, apiKey),
    npsFetch("campgrounds", { parkCode: code, limit: 20 }, apiKey)
  ]);
  const park = normalizePark(parks.data?.[0] || {}, localPark);
  const official = {
    ...park,
    alerts: (alerts.data || []).map(normalizeAlert).sort((a, b) => a.title.localeCompare(b.title)),
    visitorCenters: (visitorCenters.data || []).map(normalizeVisitorCenter).sort((a, b) => a.name.localeCompare(b.name)),
    campgrounds: (campgrounds.data || []).map(normalizeCampground).sort((a, b) => a.name.localeCompare(b.name))
  };
  return {
    ...official,
    contentHash: hash({
      park: official,
      fetchedWithoutVolatileTime: true
    })
  };
}

async function main() {
  const apiKey = await loadApiKey();
  if (!apiKey) {
    throw new Error("Missing NPS API key. Set NPS_API_KEY, NPS_API_KEY_FILE, or D:\\env\\nps_api_key.txt.");
  }

  const previous = JSON.parse((await readOptional(cachePath)) || "{}");
  const parks = [];
  for (const localPark of site.parks) {
    parks.push(await fetchParkBundle(localPark, apiKey));
  }

  const previousBySlug = new Map((previous.parks || []).map((park) => [park.slug, park]));
  const changedParks = parks
    .filter((park) => previousBySlug.get(park.slug)?.contentHash !== park.contentHash)
    .map((park) => park.slug);

  const cache = {
    schemaVersion: 1,
    source: "National Park Service API",
    sourceDocs: "https://www.nps.gov/subjects/developer/api-documentation.htm",
    fetchedAt: new Date().toISOString(),
    parkCodes: site.parks.map((park) => String(park.code || "").toLowerCase()),
    changedParks,
    parks
  };

  const summary = {
    changed: changedParks.length > 0 || hash(previous.parks || []) !== hash(parks),
    changedParks,
    parkCount: parks.length,
    alertCount: parks.reduce((sum, park) => sum + park.alerts.length, 0),
    visitorCenterCount: parks.reduce((sum, park) => sum + park.visitorCenters.length, 0),
    campgroundCount: parks.reduce((sum, park) => sum + park.campgrounds.length, 0),
    dryRun,
    secretPrinted: false,
    generatedAt: cache.fetchedAt
  };

  if (!dryRun && (summary.changed || !previous.schemaVersion)) {
    await mkdir(dirname(cachePath), { recursive: true });
    await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
  }
  await mkdir(dirname(summaryPath), { recursive: true });
  await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`NPS sync ${summary.changed ? "changed" : "unchanged"}: ${parks.length} parks, ${summary.alertCount} alerts, ${summary.visitorCenterCount} visitor centers, ${summary.campgroundCount} campgrounds.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
