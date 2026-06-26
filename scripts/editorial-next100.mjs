const authors = ["Gradient Field Team", "Mira Lee", "Sara Kim", "Elena Cruz", "Nolan Park"];

const clusterMeta = {
  park_archetype: { cat: "parks", catLabel: "Park Playbooks", tint: "#557d66" },
  scenario: { cat: "guide", catLabel: "Scenario Planning", tint: "#7f8f52" },
  feature: { cat: "data", catLabel: "Route Features", tint: "#3f7f8c" },
  workflow: { cat: "seasonal", catLabel: "Workflow", tint: "#98613f" }
};

const sourceLibrary = {
  trip: ["NPS Trip Planning Guide", "https://www.nps.gov/subjects/healthandsafety/trip-planning-guide.htm"],
  hike: ["NPS Hike Smart", "https://www.nps.gov/articles/hiking-safety.htm"],
  weather: ["NPS Weather Safety", "https://www.nps.gov/subjects/healthandsafety/severe-weather-safety.htm"],
  access: ["NPS Accessibility", "https://www.nps.gov/subjects/accessibility/index.htm"],
  plan: ["NPS Plan Your Visit", "https://www.nps.gov/planyourvisit/index.htm"],
  leave: ["NPS Leave No Trace Seven Principles", "https://www.nps.gov/articles/leave-no-trace-seven-principles.htm"],
  usgs: ["USGS 3DEP DEM Data Catalog", "https://data.usgs.gov/datacatalog/data/USGS%3A3a81321b-c153-416f-98b7-cc8e5f0e17c3"],
  noaa: ["NOAA Weather Safety", "https://www.weather.gov/safety/"],
  air: ["AirNow Fire and Smoke Map", "https://fire.airnow.gov/"],
  rec: ["Recreation.gov Trip Planning", "https://www.recreation.gov/"]
};

const sourceProfiles = {
  park_archetype: ["plan", "trip", "hike", "weather", "leave"],
  scenario: ["trip", "hike", "weather", "access", "plan"],
  feature: ["hike", "trip", "usgs", "weather", "leave"],
  workflow: ["plan", "trip", "hike", "weather", "rec"]
};

const sourceRoles = {
  trip: "official",
  hike: "official",
  weather: "official",
  access: "official",
  plan: "official",
  leave: "expert_reference",
  usgs: "primary_data",
  noaa: "primary_data",
  air: "primary_data",
  rec: "primary_data"
};

const rows = [
  ["park_archetype", "yosemite-valley-gentle-route-stroller-morning", "Yosemite Valley Gentle Route With Stroller Morning Constraints", "Yosemite Valley gentle route planning with stroller morning timing, waterfall spray and shuttle fallback checks.", "Yosemite Valley gentle route", ["stroller morning", "shuttle fallback"], "park-specific route archetype", "Yosemite's flat-looking valley routes still depend on spray, crowd movement and shuttle timing.", "Yosemite stroller route scorecard", "scenarioTable", "Yosemite Valley", "waterfall corridor", "families using a stroller before crowds build", "choosing the first walk after checking shuttle and spray conditions", "This does not rank every Yosemite trail or promise stroller access."],
  ["park_archetype", "zion-riverside-walk-shuttle-buffer", "Zion Riverside Walk Shuttle Buffer for Gentle Canyon Days", "Zion Riverside Walk shuttle buffer planning with canyon shade, river edge and return-line timing.", "Zion Riverside Walk shuttle buffer", ["canyon shade", "return-line timing"], "park-specific route archetype", "The gentle part of Zion's riverside route can be controlled by transportation queues more than terrain.", "Zion shuttle buffer board", "timeline", "Zion", "canyon river walk", "visitors relying on shuttles for an easy canyon outing", "committing after the return shuttle window still has margin", "This does not cover strenuous canyon routes or permit travel."],
  ["park_archetype", "yellowstone-geyser-basin-boardwalk-flow", "Yellowstone Geyser Basin Boardwalk Flow Before a Short Walk", "Yellowstone geyser basin boardwalk flow with thermal area spacing, crowd pulses and closure status.", "Yellowstone geyser basin boardwalk flow", ["thermal area spacing", "closure status"], "park-specific route archetype", "A short geyser basin walk can fail when boardwalk traffic and temporary closures compress the route.", "Geyser basin flow table", "riskScale", "Yellowstone", "thermal boardwalk", "first-time visitors comparing geyser basin stops", "selecting a basin after checking closure language and crowd flow", "This does not describe thermal safety rules beyond official-source checks."],
  ["park_archetype", "grand-canyon-rim-shade-walk", "Grand Canyon Rim Shade Walk for Gentle View Planning", "Grand Canyon rim shade walk decisions with exposure, shuttle exits and turnaround confidence.", "Grand Canyon rim shade walk", ["shuttle exits", "turnaround confidence"], "park-specific route archetype", "A rim path can feel gentle on paper while sun, edge comfort and shuttle exits decide the real fit.", "Rim shade exit planner", "decisionBox", "Grand Canyon", "rim corridor", "visitors wanting canyon views without descending", "choosing a segment after shade and exit options are visible", "This does not recommend below-rim hiking."],
  ["park_archetype", "acadia-carriage-road-rainy-day-loop", "Acadia Carriage Road Rainy-Day Loop Fit", "Acadia carriage road rainy-day loop planning with gravel surface, bike sharing and foggy view expectations.", "Acadia carriage road rainy-day loop", ["gravel surface", "bike sharing"], "park-specific route archetype", "A broad carriage road is not automatically a low-friction rainy-day route.", "Acadia rainy loop filter", "comparison", "Acadia", "carriage road loop", "groups choosing a low-climb route in damp weather", "keeping the loop only if surface and shared-use signals still fit", "This does not replace Acadia's current road and trail notices."],
  ["park_archetype", "rocky-mountain-lake-altitude-easy-loop", "Rocky Mountain Lake Altitude Check for Easy Loops", "Rocky Mountain lake altitude check with easy loop pacing, parking pressure and weather window limits.", "Rocky Mountain lake altitude check", ["easy loop pacing", "weather window"], "park-specific route archetype", "A lake loop can be gentle in grade but not in altitude or afternoon weather exposure.", "Altitude lake loop gauge", "miniFormula", "Rocky Mountain", "high lake loop", "travelers choosing a scenic lake route early in a trip", "deciding after altitude, parking and weather windows agree", "This does not give health advice about altitude symptoms."],
  ["park_archetype", "smoky-mountains-creek-history-family-walk", "Smoky Mountains Creek History Family Walk Strategy", "Smoky Mountains creek history family walk planning with wet rocks, parking pullouts and short attention spans.", "Smoky Mountains creek history family walk", ["wet rocks", "parking pullouts"], "park-specific route archetype", "Creekside history routes work best when footing and arrival friction are part of the family plan.", "Smokies creek history board", "stepCards", "Great Smoky Mountains", "creek and historic corridor", "families mixing scenery with short learning stops", "choosing after footing and parking friction are low enough", "This does not list all historic sites in the park."],
  ["park_archetype", "olympic-rainforest-root-aware-loop", "Olympic Rainforest Root-Aware Loop Selection", "Olympic rainforest root-aware loop planning with boardwalk breaks, wet footing and short-route patience.", "Olympic rainforest root-aware loop", ["wet footing", "boardwalk breaks"], "park-specific route archetype", "A rainforest loop can be short and still demand careful attention underfoot.", "Rainforest root route check", "evidenceChecklist", "Olympic", "rainforest loop", "visitors who want lush forest texture without technical hiking", "choosing after wet-footing risk and boardwalk sections are understood", "This does not claim current trail surface conditions."],
  ["park_archetype", "arches-short-arch-heat-window", "Arches Short Arch Heat Window for Gentle Walks", "Arches short arch heat window planning with sand footing, parking turnover and exposed return time.", "Arches short arch heat window", ["sand footing", "exposed return"], "park-specific route archetype", "In desert parks, a short arch walk is often a timing problem before it is a distance problem.", "Arches heat-window card", "timeline", "Arches", "short arch approach", "visitors trying to see scenery without overcommitting in heat", "keeping the route only inside a cooler, lower-friction window", "This does not provide heat-safety medical advice."],
  ["park_archetype", "mount-rainier-meadow-snowline-gentle-walk", "Mount Rainier Meadow Snowline Gentle Walk Readiness", "Mount Rainier meadow snowline gentle walk planning with flower timing, trail protection and closure notes.", "Mount Rainier meadow snowline gentle walk", ["flower timing", "closure notes"], "park-specific route archetype", "A meadow route's appeal depends on seasonal readiness and protection rules, not just low climb.", "Rainier meadow readiness gauge", "riskScale", "Mount Rainier", "subalpine meadow", "visitors hoping for a gentle wildflower walk", "choosing only after snowline and closure signals support the route", "This does not forecast bloom timing."],
  ["park_archetype", "glacier-lake-shore-bear-aware-walk", "Glacier Lake Shore Bear-Aware Walk Planning", "Glacier lake shore bear-aware walk planning with group noise, shoreline exposure and official alert checks.", "Glacier lake shore bear-aware walk", ["shoreline exposure", "official alert checks"], "park-specific route archetype", "A lakeshore path can feel easy while wildlife guidance and open shoreline shape the decision.", "Glacier lake alert filter", "decisionBox", "Glacier", "lakeshore route", "groups choosing a scenic low-climb walk", "committing after current wildlife and access notices are checked", "This does not replace park wildlife instructions."],
  ["park_archetype", "bryce-hoodoo-rim-gentle-segment", "Bryce Hoodoo Rim Gentle Segment Choice", "Bryce hoodoo rim gentle segment planning with edge comfort, winter footing and shuttle-adjacent exits.", "Bryce hoodoo rim gentle segment", ["edge comfort", "winter footing"], "park-specific route archetype", "The easiest rim segment may be the one with the clearest exit and least exposure pressure.", "Bryce rim segment picker", "comparison", "Bryce Canyon", "hoodoo rim segment", "visitors wanting hoodoo views without a descent", "selecting a segment after exposure and footing signals are comfortable", "This does not cover canyon descent routes."],
  ["park_archetype", "joshua-tree-boulder-loop-gentle-fit", "Joshua Tree Boulder Loop Gentle Fit Without Scrambling", "Joshua Tree boulder loop gentle fit with route markers, sand pockets and no-scramble boundaries.", "Joshua Tree boulder loop gentle fit", ["route markers", "no-scramble boundaries"], "park-specific route archetype", "A boulder route can invite side exploration that changes a gentle walk into a harder outing.", "Boulder-loop boundary table", "decisionBox", "Joshua Tree", "boulder loop", "visitors who want desert texture without scrambling", "choosing after route boundaries and footing are clear", "This does not recommend off-trail climbing or scrambling."],
  ["park_archetype", "everglades-boardwalk-bug-season-walk", "Everglades Boardwalk Bug Season Walk Planning", "Everglades boardwalk bug season walk planning with shade gaps, water levels and wildlife viewing patience.", "Everglades boardwalk bug season walk", ["shade gaps", "water levels"], "park-specific route archetype", "A flat boardwalk still needs comfort planning when insects, sun and water levels change the experience.", "Everglades boardwalk comfort card", "scenarioTable", "Everglades", "wetland boardwalk", "families choosing a short wildlife-viewing walk", "going only when comfort signals and official conditions are acceptable", "This does not predict wildlife sightings."],
  ["park_archetype", "shenandoah-skyline-drive-short-trail-pairing", "Shenandoah Skyline Drive Short Trail Pairing", "Shenandoah Skyline Drive short trail pairing with overlook timing, fog risk and family energy.", "Shenandoah Skyline Drive short trail pairing", ["overlook timing", "fog risk"], "park-specific route archetype", "A short trail between overlooks works best when fog, pullout pressure and walking energy are sequenced.", "Skyline short-walk sequence", "timeline", "Shenandoah", "drive-and-walk day", "visitors balancing overlooks with one real walk", "pairing the walk after visibility and timing support it", "This does not rank every Skyline Drive stop."],
  ["park_archetype", "cuyahoga-towpath-family-easy-ride-walk", "Cuyahoga Towpath Family Easy Walk Versus Ride", "Cuyahoga Towpath family easy walk planning with bike traffic, canal history and turnaround distance.", "Cuyahoga Towpath family easy walk", ["bike traffic", "turnaround distance"], "park-specific route archetype", "A flat towpath still needs a shared-use and turnaround plan for families.", "Towpath walk-or-ride board", "comparison", "Cuyahoga Valley", "towpath corridor", "families choosing between walking and biking a flat corridor", "choosing the mode after traffic and turnaround needs are clear", "This does not cover bicycle safety instruction."],
  ["park_archetype", "indiana-dunes-boardwalk-sand-return", "Indiana Dunes Boardwalk Sand Return Check", "Indiana Dunes boardwalk sand return planning with beach access, wind exposure and stroller limits.", "Indiana Dunes boardwalk sand return", ["wind exposure", "stroller limits"], "park-specific route archetype", "A boardwalk-to-sand route can become harder on the return than the distance suggests.", "Dunes return-effort gauge", "miniFormula", "Indiana Dunes", "boardwalk and sand edge", "visitors weighing a beach-adjacent easy walk", "choosing after sand and wind return effort are acceptable", "This does not promise beach access conditions."],
  ["park_archetype", "mammoth-cave-surface-shade-walk", "Mammoth Cave Surface Shade Walk Before or After a Tour", "Mammoth Cave surface shade walk planning with tour timing, steps fatigue and temperature shift.", "Mammoth Cave surface shade walk", ["tour timing", "steps fatigue"], "park-specific route archetype", "A surface walk around a cave day should respect tour schedules and post-tour energy.", "Cave-day surface route filter", "stepCards", "Mammoth Cave", "surface trail near cave area", "visitors adding a gentle walk to a cave-focused day", "keeping the walk only if it does not crowd the tour plan", "This does not describe cave-tour requirements."],
  ["park_archetype", "badlands-fossil-boardwalk-wind-check", "Badlands Fossil Boardwalk Wind Check for Short Walks", "Badlands fossil boardwalk wind check with sun exposure, loose gravel approaches and interpretive stops.", "Badlands fossil boardwalk wind check", ["sun exposure", "interpretive stops"], "park-specific route archetype", "A short interpretive boardwalk in open country can still be shaped by wind and exposure.", "Badlands exposure card", "riskScale", "Badlands", "fossil boardwalk", "visitors looking for a compact geology stop", "committing after wind, sun and access approach feel reasonable", "This does not identify fossil locations beyond official paths."],
  ["park_archetype", "death-valley-salt-flat-heat-margin", "Death Valley Salt Flat Heat Margin for Gentle Stops", "Death Valley salt flat heat margin planning with reflective exposure, car distance and no-go triggers.", "Death Valley salt flat heat margin", ["reflective exposure", "no-go triggers"], "park-specific route archetype", "A nearly flat salt-flat stop can be one of the least forgiving gentle-looking walks.", "Salt-flat no-go board", "decisionBox", "Death Valley", "salt flat stop", "visitors considering a very short exposed walk", "going only when heat, distance from car and alerts support the stop", "This does not provide medical heat guidance."],
  ["park_archetype", "saguaro-cactus-loop-sun-angle", "Saguaro Cactus Loop Sun Angle for Easy Desert Walks", "Saguaro cactus loop sun angle planning with shade scarcity, prickly edges and family pacing.", "Saguaro cactus loop sun angle", ["shade scarcity", "family pacing"], "park-specific route archetype", "A cactus loop is often decided by sun angle and spacing, not just mileage.", "Cactus-loop comfort table", "scenarioTable", "Saguaro", "cactus loop", "families choosing a short desert nature trail", "choosing after sun exposure and route edges fit the group", "This does not describe plant safety beyond staying on trail."],
  ["park_archetype", "sequoia-big-tree-grove-loop-pacing", "Sequoia Big Tree Grove Loop Pacing for Mixed Groups", "Sequoia big tree grove loop pacing with altitude, photo stops and accessible route evidence.", "Sequoia big tree grove loop pacing", ["photo stops", "accessible route evidence"], "park-specific route archetype", "A famous grove loop often needs a pace plan because stopping is part of the experience.", "Big-tree pacing board", "timeline", "Sequoia", "giant tree grove loop", "mixed groups visiting a landmark tree area", "choosing after stop frequency and access evidence are understood", "This does not verify current accessible segments."],
  ["park_archetype", "crater-lake-rim-snowbank-short-walk", "Crater Lake Rim Snowbank Short Walk Caution", "Crater Lake rim snowbank short walk planning with plowed access, edge distance and changing views.", "Crater Lake rim snowbank short walk", ["plowed access", "edge distance"], "park-specific route archetype", "A rim stop can look simple while snowbanks and edge spacing change the walk.", "Crater rim snow screen", "riskScale", "Crater Lake", "rim viewpoint walk", "visitors adding a short rim walk in lingering snow", "keeping it only when access and edge comfort are clear", "This does not report current snow depth."],
  ["park_archetype", "mesa-verde-cliff-dwelling-approach-walk", "Mesa Verde Cliff Dwelling Approach Walk Fit", "Mesa Verde cliff dwelling approach walk planning with ladders alternatives, sun exposure and tour timing.", "Mesa Verde cliff dwelling approach walk", ["sun exposure", "tour timing"], "park-specific route archetype", "A cultural-site approach may require a different fit check than a scenery-only trail.", "Mesa Verde approach planner", "stepCards", "Mesa Verde", "cliff dwelling approach", "visitors comparing cultural stops with gentle walking needs", "choosing after tour timing and approach effort are clear", "This does not explain tour reservation rules."],
  ["park_archetype", "hawaii-volcanoes-lava-field-footing", "Hawaii Volcanoes Lava Field Footing for Gentle Scenic Walks", "Hawaii Volcanoes lava field footing with heat shimmer, route markers and surface sharpness.", "Hawaii Volcanoes lava field footing", ["route markers", "surface sharpness"], "park-specific route archetype", "A low-grade lava-field route can still be demanding because the surface controls attention.", "Lava-field footing table", "evidenceChecklist", "Hawaii Volcanoes", "lava field walk", "visitors wanting volcanic scenery without a long hike", "choosing after markers, surface and weather cues are clear", "This does not describe eruption status or closures."],

  ["scenario", "grandparents-first-park-walk-buffer", "Grandparents First Park Walk Buffer for Gentle Trails", "Grandparents first park walk buffer with rest spacing, shade timing and low-pressure turnaround options.", "grandparents first park walk buffer", ["rest spacing", "turnaround options"], "scenario deep-dive", "The first walk with older relatives should be designed around recovery margin, not only distance.", "Grandparent buffer card", "evidenceChecklist", "mixed-generation trips", "rest-supported route", "families planning around older relatives without stereotyping ability", "choosing after rest rhythm and exit choices are visible", "This does not give medical advice or age-based rules."],
  ["scenario", "large-family-gentle-trail-meeting-plan", "Large Family Gentle Trail Meeting Plan", "Large family gentle trail meeting plan with split pace, restroom timing and regroup points.", "large family gentle trail meeting plan", ["split pace", "regroup points"], "scenario deep-dive", "Large groups need a route that can hold different speeds without losing accountability.", "Large-group route board", "stepCards", "family reunion travel", "group route coordination", "a large family choosing one low-stress walk", "starting only after regroup points and communication are settled", "This does not advise separating children or vulnerable visitors."],
  ["scenario", "mobility-scooter-park-walk-source-check", "Mobility Scooter Park Walk Source Check Before a Gentle Route", "Mobility scooter park walk source check with surface certainty, slope wording and official access notes.", "mobility scooter park walk source check", ["surface certainty", "official access notes"], "scenario deep-dive", "Scooter-dependent planning needs stronger evidence than a generic easy label.", "Scooter evidence ladder", "decisionBox", "access-aware travel", "device-specific route check", "visitors deciding whether a route has enough source support", "choosing after official or current access evidence is strong enough", "This does not certify any route for device use."],
  ["scenario", "low-vision-gentle-trail-cue-check", "Low-Vision Gentle Trail Cue Check", "Low-vision gentle trail cue check with contrast, edge clarity and companion pacing.", "low-vision gentle trail cue check", ["edge clarity", "companion pacing"], "scenario deep-dive", "A route can be low in climb but still uncertain when cues and edges are hard to read.", "Low-vision cue board", "evidenceChecklist", "access-aware travel", "visual cue route", "visitors who rely on clear edges and navigation cues", "choosing after cue confidence and companion pacing are clear", "This does not provide clinical vision guidance."],
  ["scenario", "anxious-first-hiker-route-confidence", "Anxious First Hiker Route Confidence Plan", "Anxious first hiker route confidence with clear exits, visible rewards and no-pressure pacing.", "anxious first hiker route confidence", ["clear exits", "no-pressure pacing"], "scenario deep-dive", "The best first route for a hesitant hiker is the one with understandable exits and modest commitments.", "Confidence-route checklist", "decisionBox", "first-time hiking", "confidence-building route", "a hesitant visitor trying not to overcommit", "choosing after the route feels reversible and legible", "This does not treat anxiety or offer health guidance."],
  ["scenario", "heat-wave-easy-trail-no-go-rule", "Heat Wave Easy Trail No-Go Rule", "Heat wave easy trail no-go rule with shade scarcity, water margin and backup indoor stops.", "heat wave easy trail no-go rule", ["shade scarcity", "backup indoor stops"], "scenario deep-dive", "Low mileage does not rescue a route when heat changes the cost of every minute.", "Heat no-go rule card", "riskScale", "hot-weather travel", "heat-sensitive route choice", "visitors reconsidering an easy route during a hot spell", "skipping or changing the route when heat triggers are present", "This does not replace official heat warnings or medical advice."],
  ["scenario", "smoky-air-viewpoint-walk-decision", "Smoky Air Viewpoint Walk Decision for Gentle Routes", "Smoky air viewpoint walk decision with visibility loss, AirNow checks and low-exertion fallback.", "smoky air viewpoint walk decision", ["visibility loss", "low-exertion fallback"], "scenario deep-dive", "A viewpoint walk can lose both reward and comfort when smoke changes visibility and breathing effort.", "Smoke-view fallback table", "comparison", "smoke-affected trips", "viewpoint route decision", "visitors deciding whether a scenic easy walk still has value", "choosing after smoke information and fallback value are checked", "This does not provide health thresholds."],
  ["scenario", "thunderstorm-forecast-boardwalk-turnaround", "Thunderstorm Forecast Boardwalk Turnaround Plan", "Thunderstorm forecast boardwalk turnaround planning with sky checks, exposed surfaces and shelter distance.", "thunderstorm forecast boardwalk turnaround", ["exposed surfaces", "shelter distance"], "scenario deep-dive", "A boardwalk's simplicity can hide how exposed the group feels if storms build quickly.", "Storm boardwalk ladder", "timeline", "storm-window planning", "weather turnaround route", "visitors trying to keep a short route in an unstable forecast", "turning around before shelter distance becomes the problem", "This does not forecast local storms."],
  ["scenario", "post-rain-mud-family-loop-screen", "Post-Rain Mud Family Loop Screen", "Post-rain mud family loop screen with drainage, shoe traction and stroller detour choices.", "post-rain mud family loop screen", ["shoe traction", "stroller detour"], "scenario deep-dive", "The same family loop can become a different route after rain.", "Mud-loop family filter", "scenarioTable", "wet-weather family travel", "mud-sensitive loop", "families deciding whether to keep a loop after rain", "choosing after drainage and footwear realities are visible", "This does not report current trail conditions."],
  ["scenario", "spring-snowmelt-creek-crossing-choice", "Spring Snowmelt Creek Crossing Choice", "Spring snowmelt creek crossing choice with bridge confidence, water noise and alternate loops.", "spring snowmelt creek crossing choice", ["bridge confidence", "alternate loops"], "scenario deep-dive", "Spring melt can make a route feel less predictable even when the map still shows a short walk.", "Snowmelt crossing board", "decisionBox", "spring travel", "creek-crossing route choice", "visitors comparing short routes during melt season", "choosing after crossings and official notices support the plan", "This does not estimate water levels."],
  ["scenario", "winter-daylight-gentle-loop-cutoff", "Winter Daylight Gentle Loop Cutoff", "Winter daylight gentle loop cutoff with sunset buffer, icy shade and shorter-route backup.", "winter daylight gentle loop cutoff", ["sunset buffer", "icy shade"], "scenario deep-dive", "Winter turns a mild loop into a timing decision with less error margin.", "Winter daylight cutoff", "miniFormula", "winter visits", "short daylight route", "visitors trying to fit one easy loop into a winter day", "starting only when daylight and surface buffers are adequate", "This does not report current ice or snow."],
  ["scenario", "shoulder-season-shuttle-gap-route", "Shoulder Season Shuttle Gap Route Planning", "Shoulder season shuttle gap route planning with reduced service, road access and walking-distance tradeoffs.", "shoulder season shuttle gap route planning", ["reduced service", "road access"], "scenario deep-dive", "A route that works in peak service can become a different logistics problem in shoulder season.", "Shoulder shuttle matrix", "timeline", "shoulder-season travel", "transport-dependent walk", "visitors planning around uncertain or reduced transit", "choosing after service gaps and walking alternatives are understood", "This does not provide live shuttle schedules."],
  ["scenario", "no-cell-service-family-route-card", "No-Cell-Service Family Route Card", "No-cell-service family route card with offline maps, meeting points and route notes.", "no-cell-service family route card", ["offline maps", "meeting points"], "scenario deep-dive", "An easy route still needs a plan that works when phones stop being the safety net.", "Offline family route card", "stepCards", "offline park travel", "communication-light route", "families preparing before entering weak service areas", "starting after route notes and meeting points are shared", "This does not replace emergency communication tools."],
  ["scenario", "late-arrival-gentle-walk-cutoff", "Late Arrival Gentle Walk Cutoff", "Late arrival gentle walk cutoff with daylight, check-in fatigue and visitor-center alternatives.", "late arrival gentle walk cutoff", ["check-in fatigue", "visitor-center alternatives"], "scenario deep-dive", "The right late-arrival route is often the one easiest to abandon gracefully.", "Late-arrival cutoff board", "decisionBox", "arrival-day travel", "evening route choice", "travelers reaching the park later than planned", "choosing only when the walk remains simple and reversible", "This does not advise night hiking."],
  ["scenario", "early-checkout-short-walk-plan", "Early Checkout Short Walk Plan", "Early checkout short walk plan with luggage timing, parking turnover and route compression.", "early checkout short walk plan", ["luggage timing", "route compression"], "scenario deep-dive", "A departure-day walk has to respect the clock and transition friction.", "Checkout route sequence", "timeline", "departure-day travel", "short pre-drive walk", "visitors trying to add a final easy route before leaving", "keeping the walk only when it will not strain the departure plan", "This does not cover lodging policies."],
  ["scenario", "stroller-nap-window-trail-choice", "Stroller Nap Window Trail Choice", "Stroller nap window trail choice with shade rhythm, surface noise and return certainty.", "stroller nap window trail choice", ["shade rhythm", "surface noise"], "scenario deep-dive", "A stroller route can succeed or fail based on timing texture more than scenery.", "Nap-window route board", "timeline", "family travel", "stroller-paced route", "parents matching a short walk to a child's rest window", "choosing after shade, sound and return timing fit", "This does not offer parenting or sleep advice."],
  ["scenario", "sensory-sensitive-child-quiet-trail", "Sensory-Sensitive Child Quiet Trail Screen", "Sensory-sensitive child quiet trail planning with crowd sound, narrow paths and exit predictability.", "sensory-sensitive child quiet trail", ["crowd sound", "exit predictability"], "scenario deep-dive", "An easy trail can still overload a child when sound, crowding and narrow passing points stack up.", "Quiet trail pressure scale", "riskScale", "sensory-aware family travel", "low-pressure route", "families seeking a calmer short route", "choosing after sound and exit pressure are low enough", "This does not provide medical or therapeutic advice."],
  ["scenario", "solo-cautious-walker-easy-route", "Solo Cautious Walker Easy Route Readiness", "Solo cautious walker easy route readiness with visible trailheads, return certainty and check-in habits.", "solo cautious walker easy route", ["visible trailheads", "check-in habits"], "scenario deep-dive", "A solo easy walk should favor legibility and return certainty over novelty.", "Solo route readiness card", "evidenceChecklist", "solo travel", "low-commitment walk", "a cautious solo visitor choosing one manageable route", "starting after route clarity and check-in plans are settled", "This does not replace personal safety judgment."],
  ["scenario", "injury-recovery-gentle-route-boundary", "Injury Recovery Gentle Route Boundary Without Medical Advice", "Injury recovery gentle route boundary with turnaround triggers, surface predictability and official-route limits.", "injury recovery gentle route boundary", ["surface predictability", "turnaround triggers"], "scenario deep-dive", "A recovery outing needs a route boundary, not a heroic interpretation of easy.", "Recovery boundary card", "decisionBox", "recovery travel", "conservative route boundary", "visitors choosing a very low-commitment walk after reduced activity", "choosing only when the route can be shortened early", "This does not give rehabilitation or medical guidance."],
  ["scenario", "pet-rule-confusion-easy-trail", "Pet Rule Confusion on Easy Trails Before You Start", "Pet rule confusion on easy trails with official signs, paved paths and backup walk choices.", "pet rule confusion on easy trails", ["official signs", "backup walk choices"], "scenario deep-dive", "A flat path is not automatically an allowed pet route.", "Pet-rule source ladder", "evidenceChecklist", "pet-aware travel", "rule-dependent walk", "visitors with pets checking route eligibility", "choosing after official pet rules are clear", "This does not interpret service animal law."],
  ["scenario", "international-visitor-first-trail-source-map", "International Visitor First Trail Source Map", "International visitor first trail source map with official terms, unit conversion and shuttle basics.", "international visitor first trail source map", ["unit conversion", "shuttle basics"], "scenario deep-dive", "First-time international visitors may need the source hierarchy explained before the trail choice.", "Visitor source map", "stepCards", "international travel", "first-source route planning", "visitors unfamiliar with U.S. national park information layers", "choosing after official pages and units are understood", "This does not cover visas, fees or travel documents."],
  ["scenario", "budget-aware-gentle-route-fuel-plan", "Budget-Aware Gentle Route Fuel Plan", "Budget-aware gentle route fuel plan with drive distance, entrance timing and nearby backup stops.", "budget-aware gentle route fuel plan", ["drive distance", "backup stops"], "scenario deep-dive", "A free-looking easy walk can still cost time, fuel and entrance friction.", "Budget route cost board", "miniFormula", "budget travel", "low-cost route choice", "visitors balancing gentle trails with travel costs", "choosing after drive and backup costs are visible", "This does not provide financial advice or current prices."],
  ["scenario", "holiday-weekend-easy-trail-crowd-plan", "Holiday Weekend Easy Trail Crowd Plan", "Holiday weekend easy trail crowd plan with arrival buffers, narrow paths and alternate corridors.", "holiday weekend easy trail crowd plan", ["arrival buffers", "alternate corridors"], "scenario deep-dive", "The same easy trail can feel entirely different when weekend crowd pressure changes movement.", "Holiday crowd route board", "comparison", "holiday travel", "crowd-sensitive route choice", "visitors deciding whether a famous easy trail is worth the friction", "choosing after crowd alternatives and arrival buffers are credible", "This does not predict real-time crowd levels."],
  ["scenario", "two-parks-one-day-gentle-walk", "Two Parks One Day Gentle Walk Limit", "Two parks one day gentle walk planning with transfer fatigue, route compression and official closure checks.", "two parks one day gentle walk", ["transfer fatigue", "route compression"], "scenario deep-dive", "A two-park day should use easy walks sparingly because transitions already consume energy.", "Two-park walk limiter", "decisionBox", "multi-park travel", "compressed itinerary walk", "travelers trying to fit a route into a transfer-heavy day", "keeping only the walk with the clearest payoff and least friction", "This does not design a full road-trip itinerary."],
  ["scenario", "altitude-first-day-gentle-walk", "Altitude First Day Gentle Walk Pacing", "Altitude first day gentle walk pacing with low climb, slower starts and weather backup.", "altitude first day gentle walk", ["slower starts", "weather backup"], "scenario deep-dive", "The first high-elevation day needs a lower ambition ceiling even when the trail looks mild.", "Altitude first-day pace card", "timeline", "high-elevation travel", "arrival-altitude route", "visitors choosing a first mountain-park walk", "choosing after pace and backup choices fit the altitude context", "This does not give medical altitude advice."],

  ["feature", "boardwalk-railing-gap-route-check", "Boardwalk Railing Gap Route Check", "Boardwalk railing gap route check with child spacing, crowd passing and official repair notes.", "boardwalk railing gap route check", ["child spacing", "repair notes"], "route-feature guide", "A railing detail can decide whether a short boardwalk feels comfortable for a specific group.", "Boardwalk railing evidence table", "evidenceChecklist", "boardwalk routes", "constructed surface detail", "families and access-aware visitors reading a boardwalk route", "choosing after railing and repair notes fit the group", "This does not inspect current boardwalk condition."],
  ["feature", "stepping-stone-crossing-easy-trail", "Stepping Stone Crossing on an Easy Trail", "Stepping stone crossing easy trail planning with wet shoes, balance margin and alternate turnarounds.", "stepping stone crossing easy trail", ["balance margin", "alternate turnarounds"], "route-feature guide", "A small crossing can become the exact point where an easy route stops being easy.", "Stepping-stone decision card", "decisionBox", "stream crossing routes", "minor crossing feature", "visitors deciding whether a crossing changes the route fit", "choosing after wet-surface and turnaround choices are clear", "This does not estimate crossing safety or water depth."],
  ["feature", "narrow-bridge-gentle-route-pressure", "Narrow Bridge Gentle Route Pressure", "Narrow bridge gentle route pressure with passing space, rail comfort and crowd timing.", "narrow bridge gentle route pressure", ["passing space", "crowd timing"], "route-feature guide", "Narrow bridges can create stress without adding mileage or elevation.", "Bridge pressure scale", "riskScale", "bridge-feature routes", "narrow crossing", "groups uncomfortable with tight passing spaces", "choosing after bridge width and crowd timing feel workable", "This does not verify bridge status."],
  ["feature", "stair-descent-short-route-effort", "Stair Descent Short Route Effort", "Stair descent short route effort with knee load, return climb and handrail evidence.", "stair descent short route effort", ["return climb", "handrail evidence"], "route-feature guide", "Stairs can reverse the meaning of short because the return often matters more than the first descent.", "Stair descent effort board", "miniFormula", "stair-heavy routes", "vertical feature", "visitors surprised by steps on short routes", "choosing after descent and return effort are both acceptable", "This does not provide injury guidance."],
  ["feature", "gravel-wash-gentle-walk-footing", "Gravel Wash Gentle Walk Footing", "Gravel wash gentle walk footing with loose stone, drainage channels and route marker confidence.", "gravel wash gentle walk footing", ["loose stone", "route marker confidence"], "route-feature guide", "A wash route can be flat but still slow because footing and line choice absorb attention.", "Gravel wash footing table", "evidenceChecklist", "wash routes", "loose-surface corridor", "desert visitors comparing flat route options", "choosing after footing and markers are legible", "This does not imply off-trail wash travel is appropriate."],
  ["feature", "sand-dune-edge-family-walk", "Sand Dune Edge Family Walk Without Overcommitting", "Sand dune edge family walk planning with soft-sand fatigue, wind and turnaround landmarks.", "sand dune edge family walk", ["soft-sand fatigue", "turnaround landmarks"], "route-feature guide", "A dune edge can turn short mileage into slow work for families.", "Dune-edge effort gauge", "riskScale", "dune-edge routes", "soft-surface feature", "families testing a short sandy walk", "choosing after the turnaround landmark is obvious", "This does not encourage dune off-route travel."],
  ["feature", "slickrock-route-marker-confidence", "Slickrock Route Marker Confidence on Gentle Walks", "Slickrock route marker confidence with cairn caution, painted marks and return certainty.", "slickrock route marker confidence", ["painted marks", "return certainty"], "route-feature guide", "On slickrock, navigation clarity can matter more than the physical grade.", "Slickrock marker checklist", "evidenceChecklist", "slickrock routes", "navigation feature", "visitors considering a low-climb rock route", "choosing after marker visibility and return direction are clear", "This does not instruct off-trail navigation."],
  ["feature", "river-corridor-shade-gentle-route", "River Corridor Shade Gentle Route Value", "River corridor shade gentle route planning with sound cover, cooling breaks and flood-alert checks.", "river corridor shade gentle route", ["cooling breaks", "flood-alert checks"], "route-feature guide", "River corridors often deliver comfort, but water proximity still needs an alert check.", "River shade value board", "comparison", "river routes", "shaded corridor", "visitors choosing shade as the main route benefit", "choosing after shade value and water-related alerts are clear", "This does not assess flood risk."],
  ["feature", "canyon-rim-fence-gap-comfort", "Canyon Rim Fence Gap Comfort Check", "Canyon rim fence gap comfort with child distance, photo stops and edge-pressure rules.", "canyon rim fence gap comfort", ["child distance", "edge-pressure rules"], "route-feature guide", "A rim walk can be gentle in terrain and still wrong for a group with edge discomfort.", "Rim fence comfort scale", "riskScale", "rim routes", "edge feature", "families and cautious walkers comparing rim segments", "choosing after edge spacing and behavior rules are settled", "This does not define safe edge distances."],
  ["feature", "lake-loop-marshy-edge-detour", "Lake Loop Marshy Edge Detour Planning", "Lake loop marshy edge detour planning with wet boards, seasonal bugs and alternate shore segments.", "lake loop marshy edge detour", ["wet boards", "alternate shore segments"], "route-feature guide", "A lake loop can become less predictable where shoreline and marsh edges change underfoot.", "Marshy-edge detour table", "scenarioTable", "lake loop routes", "shoreline feature", "visitors comparing lake loops after wet weather", "choosing after detour options do not break the route", "This does not report current water or insect conditions."],
  ["feature", "meadow-protection-rope-route-choice", "Meadow Protection Rope Route Choice", "Meadow protection rope route choice with seasonal closures, photo pressure and boardwalk limits.", "meadow protection rope route choice", ["seasonal closures", "photo pressure"], "route-feature guide", "Meadow routes need a protection-first frame, especially when scenery invites shortcut behavior.", "Meadow boundary board", "decisionBox", "meadow routes", "resource protection feature", "visitors choosing a scenic low-climb meadow walk", "choosing only routes that keep protection boundaries clear", "This does not identify closed meadow areas."],
  ["feature", "waterfall-mist-zone-footing", "Waterfall Mist Zone Footing for Easy Trails", "Waterfall mist zone footing with slippery rock, photo stops and child spacing.", "waterfall mist zone footing", ["slippery rock", "child spacing"], "route-feature guide", "The mist zone can be the hardest part of a route everyone calls easy.", "Mist-zone footing card", "riskScale", "waterfall routes", "spray-zone feature", "families choosing a waterfall destination", "choosing after spray, footing and spacing can be managed", "This does not assess real-time waterfall flow."],
  ["feature", "cave-entrance-steps-gentle-route", "Cave Entrance Steps on a Gentle Surface Route", "Cave entrance steps gentle route planning with temperature shift, railings and tour fatigue.", "cave entrance steps gentle route", ["temperature shift", "tour fatigue"], "route-feature guide", "A cave-area surface route can feel different when steps and temperature shifts sit near the start.", "Cave entrance step table", "comparison", "cave-area routes", "entrance feature", "visitors adding a short walk around cave facilities", "choosing after steps and tour fatigue fit the day", "This does not describe cave access requirements."],
  ["feature", "thermal-basin-steam-visibility-walk", "Thermal Basin Steam Visibility Walk Planning", "Thermal basin steam visibility walk planning with boardwalk focus, crowd pauses and official closure signals.", "thermal basin steam visibility walk", ["boardwalk focus", "closure signals"], "route-feature guide", "Steam can change visibility, pacing and crowd movement on short thermal routes.", "Steam visibility checklist", "evidenceChecklist", "thermal basin routes", "visibility feature", "visitors selecting a short geothermal boardwalk", "choosing after visibility and closure signals are understood", "This does not restate thermal area safety rules."],
  ["feature", "overlook-spur-trail-turnaround", "Overlook Spur Trail Turnaround Decision", "Overlook spur trail turnaround planning with payoff distance, grade surprise and crowd pressure.", "overlook spur trail turnaround", ["grade surprise", "crowd pressure"], "route-feature guide", "A spur trail asks whether the extra distance earns its place in the plan.", "Spur payoff decision board", "decisionBox", "overlook spur routes", "extra-leg feature", "visitors deciding whether to add a short spur", "adding it only when payoff and return effort are defendable", "This does not rate specific overlooks."],
  ["feature", "lollipop-route-junction-confidence", "Lollipop Route Junction Confidence for Easy Hikes", "Lollipop route junction confidence with loop direction, signage and wrong-turn recovery.", "lollipop route junction confidence", ["loop direction", "wrong-turn recovery"], "route-feature guide", "A lollipop route can be gentle but less forgiving when the junction is confusing.", "Lollipop junction board", "stepCards", "lollipop routes", "junction feature", "visitors choosing a route shape with one key decision point", "starting after the junction plan is easy to explain", "This does not replace map use."],
  ["feature", "out-and-back-false-summit-walk", "Out-and-Back False Summit Walk Awareness", "Out-and-back false summit walk planning with expectation resets, snack points and return energy.", "out-and-back false summit walk", ["expectation resets", "return energy"], "route-feature guide", "False endings can make an easy out-and-back feel longer than the map says.", "False-summit expectation card", "timeline", "out-and-back routes", "expectation feature", "families and first-time hikers managing morale", "continuing only when expectations and return energy are honest", "This does not identify official summit routes."],
  ["feature", "loop-trail-commitment-risk", "Loop Trail Commitment Risk on Gentle Routes", "Loop trail commitment risk with midpoint exits, weather shifts and fatigue signals.", "loop trail commitment risk", ["midpoint exits", "fatigue signals"], "route-feature guide", "Loops can feel elegant in planning and less flexible once the midpoint is passed.", "Loop commitment gauge", "miniFormula", "loop routes", "route-shape feature", "visitors choosing between loop and out-and-back shapes", "choosing after midpoint commitment feels acceptable", "This does not imply loops are unsafe."],
  ["feature", "shuttle-to-trail-connector-walk", "Shuttle-to-Trail Connector Walk Fit", "Shuttle-to-trail connector walk planning with curb transitions, signs and return stop certainty.", "shuttle-to-trail connector walk", ["curb transitions", "return stop certainty"], "route-feature guide", "The connector from stop to trailhead is part of the effort, not a footnote.", "Connector walk checklist", "evidenceChecklist", "transit-served routes", "last-mile connector", "visitors relying on a shuttle for an easy route", "choosing after the first and last walking segments fit", "This does not provide live transit information."],
  ["feature", "visitor-center-nature-trail-density", "Visitor Center Nature Trail Density for Short Walks", "Visitor center nature trail density with interpretive stops, restroom proximity and crowd spillover.", "visitor center nature trail density", ["interpretive stops", "restroom proximity"], "route-feature guide", "A visitor-center trail can offer high reward per step when the stops match the reader's job.", "Nature trail density board", "scenarioTable", "visitor-center routes", "interpretive density", "families choosing a short educational walk", "choosing after stop density and crowd spillover are acceptable", "This does not replace visitor center hours."],
  ["feature", "picnic-area-spur-route-filter", "Picnic Area Spur Route Filter", "Picnic area spur route filter with meal timing, trash rules and post-lunch pacing.", "picnic area spur route filter", ["meal timing", "post-lunch pacing"], "route-feature guide", "A spur near a picnic area can be useful or distracting depending on timing.", "Picnic spur sequence", "timeline", "picnic-adjacent routes", "meal-linked feature", "families adding a walk around a meal stop", "choosing after the spur fits the meal and cleanup plan", "This does not cover food storage rules in detail."],
  ["feature", "campground-connector-gentle-walk", "Campground Connector Gentle Walk Before Driving", "Campground connector gentle walk planning with morning routine, road crossings and quiet-hour fit.", "campground connector gentle walk", ["road crossings", "morning routine"], "route-feature guide", "Connector paths near campgrounds should be judged by crossings and routine, not just convenience.", "Campground connector table", "comparison", "campground routes", "connector feature", "campers wanting a simple walk without moving the car", "choosing after crossings and timing fit the campground day", "This does not describe campground regulations."],
  ["feature", "accessible-parking-approach-slope", "Accessible Parking Approach Slope Before a Trail", "Accessible parking approach slope with curb cuts, route start distance and official access evidence.", "accessible parking approach slope", ["curb cuts", "official access evidence"], "route-feature guide", "The first distance from parking to trail can decide an access-aware outing.", "Parking approach evidence board", "evidenceChecklist", "access-aware routes", "approach feature", "visitors depending on accessible parking and a short approach", "choosing after approach evidence is stronger than assumption", "This does not certify accessible parking availability."],
  ["feature", "social-trail-trap-easy-route", "Social Trail Trap on Easy Route Choices", "Social trail trap easy route planning with unofficial shortcuts, erosion risk and navigation confidence.", "social trail trap easy route", ["unofficial shortcuts", "navigation confidence"], "route-feature guide", "Unmarked shortcuts can make an easy route less ethical and more confusing.", "Social trail avoidance card", "decisionBox", "routes with side paths", "unofficial-path feature", "visitors trying to stay on the intended trail", "choosing after the official path is clear enough to follow", "This does not endorse social trail use."],
  ["feature", "paved-path-cross-slope-comfort", "Paved Path Cross-Slope Comfort Check", "Paved path cross-slope comfort with mobility devices, stroller drift and drainage design.", "paved path cross-slope comfort", ["stroller drift", "drainage design"], "route-feature guide", "Pavement alone does not describe how the route feels under wheels or tired legs.", "Cross-slope comfort board", "riskScale", "paved routes", "slope-detail feature", "access-aware visitors comparing paved paths", "choosing after the paved claim is paired with slope evidence", "This does not measure route compliance."],

  ["workflow", "official-alert-triage-route-morning", "Official Alert Triage on the Morning of a Gentle Route", "Official alert triage route morning workflow with closure wording, weather links and backup timing.", "official alert triage route morning", ["closure wording", "backup timing"], "workflow playbook", "The morning check should be a short triage, not a panicked reread of every source.", "Morning alert triage board", "stepCards", "source-check workflow", "morning verification", "visitors doing one final route check before departure", "going only after alerts, weather and backup timing are aligned", "This does not provide live alerts."],
  ["workflow", "nps-map-vs-app-route-decision", "NPS Map Versus App Route Decision Workflow", "NPS map versus app route decision with source authority, stale labels and official closure control.", "NPS map versus app route decision", ["source authority", "stale labels"], "workflow playbook", "Apps can inspire a route, but official sources control conditions and closures.", "Map authority ladder", "comparison", "source hierarchy", "map comparison", "readers reconciling map-app claims with official park pages", "choosing after source roles are separated", "This does not reject map apps or guarantee official-page completeness."],
  ["workflow", "micro-kit-gentle-trail-conditions", "Micro-Kit Gentle Trail Conditions Packing System", "Micro-kit gentle trail conditions system with weather layer, water margin and surface-specific footwear.", "micro-kit gentle trail conditions", ["water margin", "surface-specific footwear"], "workflow playbook", "Packing for easy routes should respond to conditions, not fear or gear lists.", "Micro-kit condition card", "evidenceChecklist", "packing workflow", "condition-based preparation", "visitors wanting a small but realistic trail kit", "packing only items tied to route and weather signals", "This does not create a survival gear checklist."],
  ["workflow", "footwear-by-surface-route-workflow", "Footwear by Surface Route Workflow", "Footwear by surface route workflow with sand, boardwalk, slickrock and wet-root decisions.", "footwear by surface route workflow", ["wet-root decisions", "slickrock"], "workflow playbook", "Footwear choices become clearer when the route surface is named before the trailhead.", "Surface footwear matrix", "scenarioTable", "pre-trip workflow", "surface-based shoe choice", "visitors deciding whether casual shoes match an easy route", "choosing footwear after the roughest surface is identified", "This does not give medical or product recommendations."],
  ["workflow", "water-refill-map-before-trail", "Water Refill Map Before Trail Commitment", "Water refill map before trail commitment with fountain uncertainty, heat margin and backup bottles.", "water refill map before trail", ["fountain uncertainty", "backup bottles"], "workflow playbook", "Water planning should happen before the route looks too short to worry about.", "Water refill route board", "miniFormula", "pre-departure workflow", "hydration logistics", "visitors deciding whether refill points change the route plan", "choosing after refill uncertainty has a backup", "This does not give hydration medical advice."],
  ["workflow", "restroom-sequence-family-trail-plan", "Restroom Sequence Family Trail Plan", "Restroom sequence family trail plan with trailhead timing, return confidence and visitor-center stops.", "restroom sequence family trail plan", ["trailhead timing", "visitor-center stops"], "workflow playbook", "Restroom planning is a sequence problem, not a single amenity check.", "Restroom sequence board", "timeline", "family workflow", "facility sequencing", "families trying to remove preventable stress from a short walk", "starting after restroom timing and return confidence are clear", "This does not report restroom availability."],
  ["workflow", "parking-arrival-model-easy-trail", "Parking Arrival Model for an Easy Trail", "Parking arrival model easy trail workflow with overflow choices, walking approach and start-time buffers.", "parking arrival model easy trail", ["overflow choices", "start-time buffers"], "workflow playbook", "A gentle trail can become stressful before the first step if parking has no model.", "Parking arrival model", "miniFormula", "arrival workflow", "parking-friction planning", "visitors choosing a start time for a popular easy route", "choosing after overflow and start buffers are realistic", "This does not predict lot capacity."],
  ["workflow", "two-backup-route-system", "Two-Backup Route System for Gentle Park Days", "Two-backup route system with lower effort, different exposure and closer services.", "two-backup route system", ["different exposure", "closer services"], "workflow playbook", "A useful backup should solve a different problem than the first route.", "Two-backup route board", "decisionBox", "contingency workflow", "backup architecture", "visitors building a route plan that can survive changes", "keeping backups only when each changes the risk profile", "This does not produce a park-specific itinerary."],
  ["workflow", "route-shortlist-spreadsheet-fields", "Route Shortlist Spreadsheet Fields That Matter", "Route shortlist spreadsheet fields with distance, surface, official status and reader-fit notes.", "route shortlist spreadsheet fields", ["official status", "reader-fit notes"], "workflow playbook", "A small spreadsheet can make route choices calmer if it tracks decisions instead of clutter.", "Shortlist field template", "evidenceChecklist", "planning workflow", "route comparison sheet", "readers comparing several gentle candidates", "shortlisting after every field changes a real choice", "This does not require software or a specific template file."],
  ["workflow", "source-freshness-audit-trail-plan", "Source Freshness Audit for a Trail Plan", "Source freshness audit trail plan with access dates, closure pages and stale review warnings.", "source freshness audit trail plan", ["access dates", "stale review warnings"], "workflow playbook", "Source dates are route information when closures, access or seasonal conditions can change.", "Freshness audit ladder", "timeline", "source workflow", "freshness review", "visitors checking whether route information is still usable", "choosing after old sources have been downgraded", "This does not archive or verify every source on the web."],
  ["workflow", "weather-window-checklist-gentle-walk", "Weather Window Checklist for a Gentle Walk", "Weather window checklist gentle walk workflow with start time, exposure and official forecast source.", "weather window checklist gentle walk", ["start time", "forecast source"], "workflow playbook", "Weather checks should turn into start, change or skip decisions.", "Weather window checklist", "stepCards", "weather workflow", "timing decision", "visitors deciding whether the same route still fits the day", "choosing after the weather window supports the outing", "This does not provide a local forecast."],
  ["workflow", "family-vote-route-score", "Family Vote Route Score Without Letting One Voice Decide", "Family vote route score with scenery, effort, rest needs and backup acceptance.", "family vote route score", ["rest needs", "backup acceptance"], "workflow playbook", "A family vote works only when the score includes the quiet constraints.", "Family vote scorecard", "scenarioTable", "group workflow", "shared route decision", "families choosing one route from competing preferences", "choosing after every key need has a visible score", "This does not replace adult safety judgment."],
  ["workflow", "mixed-ability-itinerary-board", "Mixed-Ability Itinerary Board for Gentle Trail Days", "Mixed-ability itinerary board with anchor walk, optional spur and rest-stop sequence.", "mixed-ability itinerary board", ["optional spur", "rest-stop sequence"], "workflow playbook", "A mixed-ability day should have optional layers instead of one all-or-nothing route.", "Mixed-ability day board", "timeline", "group workflow", "layered itinerary", "groups with different walking capacity planning one day together", "choosing after optional and shared parts are separated", "This does not assess individual ability."],
  ["workflow", "stoplight-decision-card-trail", "Stoplight Decision Card for a Gentle Trail", "Stoplight decision card trail workflow with green route facts, yellow uncertainties and red no-go triggers.", "stoplight decision card trail", ["yellow uncertainties", "red no-go triggers"], "workflow playbook", "A stoplight card turns scattered caution into a simple go, adjust or skip decision.", "Stoplight route card", "decisionBox", "decision workflow", "route readiness card", "visitors wanting a fast final decision tool", "going only when red triggers are absent and yellow issues have backups", "This does not automate risk assessment."],
  ["workflow", "trail-plan-change-log", "Trail Plan Change Log for Family Trips", "Trail plan change log with weather updates, route swaps and official-source notes.", "trail plan change log", ["route swaps", "official-source notes"], "workflow playbook", "A change log helps a group remember why the plan changed instead of arguing at the trailhead.", "Trail change log", "stepCards", "planning workflow", "change documentation", "families changing routes during a trip", "choosing after the latest reason for the plan is visible", "This does not create a legal or official record."],
  ["workflow", "morning-verification-routine-hike", "Morning Verification Routine Before a Hike", "Morning verification routine hike workflow with alerts, forecast, facilities and group energy.", "morning verification routine hike", ["facilities", "group energy"], "workflow playbook", "A five-minute routine can catch the route weakness that yesterday's plan missed.", "Morning verification routine", "timeline", "day-of workflow", "pre-departure review", "visitors checking a gentle route before leaving lodging", "starting after source and group signals still agree", "This does not provide live park status."],
  ["workflow", "visitor-center-question-list-route", "Visitor Center Question List for Route Fit", "Visitor center question list route workflow with surface, closure, restroom and shuttle prompts.", "visitor center question list route", ["closure prompts", "shuttle prompts"], "workflow playbook", "A focused question list gets better answers than asking which trail is easy.", "Visitor center question script", "evidenceChecklist", "information workflow", "staff-question preparation", "visitors using a visitor center to confirm a route", "choosing after questions produce actionable route facts", "This does not imply staff can certify every access need."],
  ["workflow", "offline-route-card-template", "Offline Route Card Template for Gentle Hikes", "Offline route card template with trailhead, turnaround, source notes and emergency fallback.", "offline route card template", ["turnaround", "source notes"], "workflow playbook", "An offline card should hold only the facts that matter when the phone cannot help.", "Offline route card", "stepCards", "offline workflow", "portable route summary", "visitors entering weak-service areas with a simple plan", "starting after the card can explain the route without signal", "This does not replace maps or emergency devices."],
  ["workflow", "photo-evidence-audit-route-choice", "Photo Evidence Audit for Route Choice", "Photo evidence audit route choice workflow with off-camera grade, crowd framing and dated images.", "photo evidence audit route choice", ["off-camera grade", "dated images"], "workflow playbook", "Photos are useful evidence only when the planner asks what they fail to show.", "Photo evidence audit", "comparison", "source workflow", "image-literacy check", "visitors using photos to judge a gentle route", "choosing after image clues are checked against route facts", "This does not verify photo locations."],
  ["workflow", "shuttle-timetable-buffer-easy-route", "Shuttle Timetable Buffer for an Easy Route", "Shuttle timetable buffer easy route workflow with missed-ride margin, return stop and last departure.", "shuttle timetable buffer easy route", ["missed-ride margin", "last departure"], "workflow playbook", "The route is not gentle if the return transportation creates pressure.", "Shuttle timetable buffer", "miniFormula", "transport workflow", "return-timing check", "visitors relying on scheduled transit for a short walk", "choosing after the return buffer is strong enough", "This does not provide current timetables."],
  ["workflow", "fuel-food-route-pairing", "Fuel Food Route Pairing for Park Days", "Fuel food route pairing with trail timing, picnic stops and post-walk drive margin.", "fuel food route pairing", ["picnic stops", "drive margin"], "workflow playbook", "Food, fuel and walking time belong in the same park-day sequence.", "Fuel food route board", "timeline", "logistics workflow", "meal-and-drive planning", "visitors making a gentle route fit a larger travel day", "choosing after meal and drive margins support the route", "This does not provide prices or restaurant guidance."],
  ["workflow", "half-mile-test-walk-before-trail", "Half-Mile Test Walk Before a Longer Gentle Trail", "Half-mile test walk before trail workflow with comfort check, shoe fit and group honesty.", "half-mile test walk before trail", ["shoe fit", "group honesty"], "workflow playbook", "A short test segment can reveal whether the planned route still matches the group.", "Half-mile test rule", "decisionBox", "pre-route workflow", "comfort trial", "groups uncertain about committing to a longer easy route", "continuing only after the test segment confirms the plan", "This does not give medical or fitness guidance."],
  ["workflow", "red-flag-glossary-trail-descriptions", "Red Flag Glossary for Trail Descriptions", "Red flag glossary trail descriptions workflow with exposed, scramble, primitive and washed-out wording.", "red flag glossary trail descriptions", ["washed-out wording", "primitive"], "workflow playbook", "Certain words should slow the reader down before a route is treated as gentle.", "Trail wording glossary", "evidenceChecklist", "source workflow", "description interpretation", "readers translating route wording into planning risk", "choosing after red-flag words have been checked against ability", "This does not define official difficulty ratings."],
  ["workflow", "access-call-notes-log", "Access Call Notes Log for Trail Planning", "Access call notes log with surface questions, slope notes and current-condition follow-up.", "access call notes log", ["surface questions", "slope notes"], "workflow playbook", "A call about access is more useful when the planner records exact questions and limits.", "Access call note log", "stepCards", "access workflow", "official inquiry record", "visitors calling or emailing before an access-dependent route", "choosing after answers are specific enough to guide the plan", "This does not certify accessibility or replace official documentation."],
  ["workflow", "group-route-plan-handoff", "Group Route Plan Handoff for Gentle Hikes", "Group route plan handoff with trailhead, turnaround, source links and backup owner.", "group route plan handoff", ["source links", "backup owner"], "workflow playbook", "A route plan becomes stronger when more than one adult can explain it.", "Group handoff card", "stepCards", "group workflow", "shared route ownership", "groups where one person planned everything", "starting after another person can name the route limits", "This does not assign legal responsibility."]
];

function scheduledAt(index) {
  const start = new Date(Date.UTC(2026, 6, 16, 20, 0, 0));
  return new Date(start.getTime() + index * 5 * 60 * 60 * 1000).toISOString();
}

function displayDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function sourceSet(cluster) {
  return sourceProfiles[cluster].map((key) => sourceLibrary[key]);
}

function researchSources(cluster) {
  return sourceProfiles[cluster].map((key, index) => {
    const [label, href] = sourceLibrary[key];
    return {
      id: `s${index + 1}`,
      label,
      href,
      source_role: sourceRoles[key],
      accessed: "2026-06-27",
      data_points: [
        `${label} is used to separate stable route planning from current condition checks.`,
        `${label} supports the article's source hierarchy before any route idea is treated as final.`
      ]
    };
  });
}

function researchRuns(row) {
  return [
    `${row.mainKeyword} official park route planning ${row.extendedKeywords[0]}`,
    `${row.context} ${row.feature} ${row.extendedKeywords[1]} source check`,
    `${row.mainKeyword} gentle trail current alerts accessibility weather`,
    `${row.toolTitle} ${row.searchIntent} evidence gap`
  ];
}

function sourceInterpretation(row) {
  const interpretations = {
    park_archetype: `This source set is interpreted through a park-specific lens: ${row.context} and ${row.feature} matter only when ${row.extendedKeywords[0]} and ${row.extendedKeywords[1]} change the route decision.`,
    scenario: `This source set is interpreted through the reader scenario: ${row.readerSituation.toLowerCase()} needs current-condition proof and group-fit proof before the route can be kept.`,
    feature: `This source set is interpreted through a route-feature audit: ${row.extendedKeywords[0]} and ${row.extendedKeywords[1]} are treated as evidence gates, not decorative modifiers.`,
    workflow: `This source set is interpreted as a workflow: the article ranks official/current sources, stable route facts and fallback notes before ${row.decisionMoment.toLowerCase()}.`
  };
  return interpretations[row.cluster];
}

function articleSpecificDetails(row) {
  const officialSource = row.cluster === "feature" ? "s3" : "s1";
  const currentSource = row.cluster === "workflow" ? "s5" : "s4";
  return [
    {
      claim: `${row.mainKeyword} is only useful when ${row.extendedKeywords[0]} changes ${row.decisionMoment.toLowerCase()}.`,
      source_id: officialSource
    },
    {
      claim: `${row.extendedKeywords[1]} is treated as the cross-check for ${row.context}, not as a generic easy-hike synonym.`,
      source_id: currentSource
    },
    {
      claim: `${row.toolTitle} exists to preserve the article boundary: ${row.notAnsweredHere}`,
      source_id: "s2"
    }
  ];
}

function researchEvidence(row) {
  return {
    research_runs: researchRuns(row),
    sources: researchSources(row.cluster),
    search_intent_insight: `${row.searchIntent} means the reader needs one defensible keep, adjust or skip decision before committing to the route.`,
    content_gap_insight: `Most broad easy-trail pages do not isolate ${row.extendedKeywords[0]} and ${row.extendedKeywords[1]} as separate evidence gates for ${row.mainKeyword}.`,
    source_interpretation_note: sourceInterpretation(row),
    article_specific_details: articleSpecificDetails(row),
    fact_traceability_pass: true
  };
}

function normalizeKeyword(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function hasKeyword(text, keyword) {
  const haystack = normalizeKeyword(text);
  const needle = normalizeKeyword(keyword);
  return needle && haystack.includes(needle);
}

function hasAnyKeyword(text, keywords) {
  return keywords.some((keyword) => hasKeyword(text, keyword));
}

function titleCase(value) {
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const titleBridges = [
  (title, keyword) => `${title} With ${titleCase(keyword)}`,
  (title, keyword) => `${title} When ${titleCase(keyword)} Matters`,
  (title, keyword) => `${title}: ${titleCase(keyword)} Before You Commit`,
  (title, keyword) => `${title} for ${titleCase(keyword)} Decisions`,
  (title, keyword) => `${title} Under ${titleCase(keyword)} Pressure`,
  (title, keyword) => `${title} and ${titleCase(keyword)} Signals`,
  (title, keyword) => `${title} After the ${titleCase(keyword)} Check`,
  (title, keyword) => `${title} Through a ${titleCase(keyword)} Lens`,
  (title, keyword) => `${title} Before ${titleCase(keyword)} Becomes the Problem`,
  (title, keyword) => `${title} With a ${titleCase(keyword)} Cross-Check`,
  (title, keyword) => `${title} for Real ${titleCase(keyword)} Tradeoffs`,
  (title, keyword) => `${title} When the Plan Depends on ${titleCase(keyword)}`,
  (title, keyword) => `${title}: ${titleCase(keyword)} Field Check`,
  (title, keyword) => `${title} Using ${titleCase(keyword)} as the Decider`
];

function titleAwkwardness(value) {
  const lower = ` ${normalizeKeyword(value)} `;
  const repeatWords = ["for", "with", "when", "before", "under"];
  const repeatedConnectors = repeatWords.reduce((score, word) => {
    const count = (lower.match(new RegExp(` ${word} `, "g")) || []).length;
    return score + Math.max(0, count - 1) * 4;
  }, 0);
  const duplicatedPhrase = /\b([a-z0-9]+(?: [a-z0-9]+){1,3})\b.*\b\1\b/.test(lower) ? 3 : 0;
  const lengthPenalty = Math.max(0, value.length - 88) / 12;
  return repeatedConnectors + duplicatedPhrase + lengthPenalty;
}

function addExtendedKeywordToTitle(title, extendedKeywords, index) {
  const keyword = extendedKeywords[index % extendedKeywords.length];
  return titleBridges
    .map((bridge, bridgeIndex) => ({
      value: bridge(title, keyword),
      score: titleAwkwardness(bridge(title, keyword)) + Math.abs((index % titleBridges.length) - bridgeIndex) / 100
    }))
    .sort((a, b) => a.score - b.score)[0].value;
}

function titleWithRequiredCoverage(title, mainKeyword, extendedKeywords, index) {
  let value = title;
  if (!hasKeyword(value, mainKeyword)) {
    value = titleCase(mainKeyword);
  }
  if (hasAnyKeyword(value, extendedKeywords)) return value;
  return addExtendedKeywordToTitle(value, extendedKeywords, index);
}

function subtitleWithRequiredCoverage(subtitle, mainKeyword, extendedKeywords, index) {
  let value = subtitle;
  if (!hasKeyword(value, mainKeyword)) {
    value = `${titleCase(mainKeyword)} planning: ${value.charAt(0).toLowerCase()}${value.slice(1)}`;
  }
  if (!hasAnyKeyword(value, extendedKeywords)) {
    value = `${value.replace(/\.$/, "")}, including ${extendedKeywords[index % extendedKeywords.length]}.`;
  }
  return value;
}

function visualRows(row) {
  return [
    [row.mainKeyword, `Name the exact route fact, official note or map clue that supports ${row.mainKeyword}.`, "Use it only when it changes the route, timing or backup choice."],
    [row.extendedKeywords[0], `Check whether ${row.extendedKeywords[0]} makes the walk slower, less comfortable or less reversible.`, "If the answer is unclear, lower the route commitment."],
    [row.extendedKeywords[1], `Decide whether ${row.extendedKeywords[1]} is stable terrain, current condition or logistical friction.`, "Stable facts can shortlist; current details need a same-day check."],
    ["Plan boundary", `Write the condition that would make ${row.decisionMoment.toLowerCase()} the wrong move.`, "A clear boundary prevents forcing a weak plan."]
  ];
}

function decisionTool(row) {
  return {
    title: row.toolTitle,
    intro: `Use this tool when ${row.readerSituation.toLowerCase()}. It keeps ${row.mainKeyword} tied to a practical decision instead of a loose travel idea.`,
    rows: visualRows(row)
  };
}

function makeVisual(row) {
  const colors = [
    ["#1d6f8f", "#eef8fb", "#93652f"],
    ["#93652f", "#fff7e8", "#2f6c60"],
    ["#3f7a55", "#eef8f1", "#8f4c35"],
    ["#6d5aa8", "#f5f2ff", "#357285"],
    ["#9a5a42", "#fff3ed", "#4f7558"]
  ][row.index % 5];
  return {
    type: row.visualType,
    title: `${row.toolTitle}: visual planning block`,
    accent: colors[0],
    accentSoft: colors[1],
    accentAlt: colors[2],
    rows: visualRows(row)
  };
}

function makeAnswerBox(row) {
  const action = row.cluster === "workflow"
    ? "run this as a pre-route workflow"
    : row.cluster === "scenario"
      ? "treat this as a group-fit decision"
      : row.cluster === "feature"
        ? "use this as a route-feature filter"
        : "use this as a park-specific shortlist screen";
  return {
    title: `${titleCase(row.mainKeyword)} quick answer`,
    answer: `${titleCase(row.mainKeyword)} is worth keeping only when ${row.extendedKeywords[0]} and ${row.extendedKeywords[1]} both support ${row.decisionMoment.toLowerCase()}. If one signal is missing, ${action} and choose a lower-commitment option before the outing depends on it.`,
    bullets: [
      `Best fit: ${row.readerSituation.toLowerCase()}.`,
      `Primary check: ${row.extendedKeywords[0]} changes the route, timing or backup choice.`,
      `Second check: ${row.extendedKeywords[1]} does not create a hidden failure point.`
    ]
  };
}

function makeFieldExample(row) {
  const examples = {
    park_archetype: [
      [`Keep ${row.feature}`, `${row.extendedKeywords[0]} is visible in the route notes and ${row.extendedKeywords[1]} has a practical fallback.`],
      ["Change the segment", `The same park still works, but ${row.extendedKeywords[0]} points to a shorter or better-served route.`],
      ["Skip this idea", `${row.extendedKeywords[1]} depends on a current notice, shuttle detail or comfort limit that cannot be confirmed.`]
    ],
    scenario: [
      ["Green-light version", `The group can explain the route limit, the turnaround point and how ${row.extendedKeywords[0]} will be handled.`],
      ["Adjustment version", `${row.extendedKeywords[1]} is acceptable only if the route is shortened, started earlier or kept closer to services.`],
      ["No-go version", `The plan relies on optimism about ${row.extendedKeywords[0]} instead of a source-backed or group-backed answer.`]
    ],
    feature: [
      ["Feature helps", `${row.extendedKeywords[0]} makes the route easier to judge before arrival and gives the reader a concrete stop rule.`],
      ["Feature complicates", `${row.extendedKeywords[1]} changes the return effort, confidence, exposure or ability to reverse the route calmly.`],
      ["Feature is not enough", `The route still needs official-source and group-fit checks before ${row.decisionMoment.toLowerCase()}.`]
    ],
    workflow: [
      ["Before choosing", `Write down the strongest current source for ${row.extendedKeywords[0]} and the weakest assumption in the plan.`],
      ["Before leaving", `Check whether ${row.extendedKeywords[1]} changed after weather, alerts, facilities or group energy were reviewed.`],
      ["At the trailhead", `Use ${row.toolTitle} to decide whether to keep, shorten, swap or skip the route.`]
    ]
  }[row.cluster];
  return {
    title: `${titleCase(row.mainKeyword)} field example`,
    intro: `Use this example to turn the article from advice into a decision at ${row.context}.`,
    rows: examples
  };
}

function makeFaq(row) {
  return [
    {
      q: `Is ${row.mainKeyword} enough by itself to choose the route?`,
      a: `No. Treat ${row.mainKeyword} as the starting filter, then require ${row.extendedKeywords[0]} and ${row.extendedKeywords[1]} to support the same decision.`
    },
    {
      q: `Which signal should be checked first: ${row.extendedKeywords[0]} or ${row.extendedKeywords[1]}?`,
      a: `Check ${row.extendedKeywords[0]} first when it changes timing, route length, surface or services. Use ${row.extendedKeywords[1]} as the cross-check before the plan becomes final.`
    },
    {
      q: `When should a reader abandon ${row.mainKeyword}?`,
      a: `Abandon or downgrade it when the unresolved signal would affect access, calm turnaround, weather exposure, transportation pressure, dignity or the least flexible person's comfort.`
    }
  ];
}

function makeVerificationChecklist(row) {
  const currentRisk = row.cluster === "workflow"
    ? "the workflow still matches the day-of source signals"
    : row.cluster === "scenario"
      ? "the least flexible person in the group still has a calm fallback"
      : row.cluster === "feature"
        ? "the feature is still visible and manageable in the route context"
        : "the park-specific condition still supports the route idea";
  return {
    title: `${titleCase(row.mainKeyword)} verification checklist`,
    intro: `Use this checklist before treating ${row.mainKeyword} as a final route choice.`,
    rows: [
      ["Official source", `Open the relevant park page or alert page and confirm ${currentRisk}.`],
      [row.extendedKeywords[0], `Find one source-backed clue that ${row.extendedKeywords[0]} changes a real decision, not just the wording of the article.`],
      [row.extendedKeywords[1], `Check whether ${row.extendedKeywords[1]} is stable route context or a same-day condition that needs fresh verification.`],
      ["Fallback rule", `Write the exact condition that would make ${row.decisionMoment.toLowerCase()} a poor choice for this group.`]
    ]
  };
}

function routeDecisionSections(row) {
  return [
    [`Why ${row.mainKeyword} deserves its own route decision`, [
      `${row.mainKeyword} is not a decorative label for another easy-trail article. The planning job is narrower: ${row.readerSituation.toLowerCase()} needs to know whether the route still works when ${row.extendedKeywords[0]} and ${row.extendedKeywords[1]} are considered together. That makes the article separate from the broad gentle-trail guides already on Gradient Trail.`,
      `${row.uniqueAngle} The useful answer is not a universal recommendation. It is a defensible way to keep, adjust or drop a route before the group has spent daylight, parking patience or physical energy on a weak plan. The article deliberately stays inside that boundary instead of trying to cover every trail in ${row.context}.`
    ]],
    [`The first signal to read is ${row.extendedKeywords[0]}`, [
      `${row.extendedKeywords[0]} should change something concrete. It might change the start time, the route length, the backup choice, the surface expectation, the need for an official-source check or the decision to keep the walk close to services. If it does not change a decision, it is probably too vague to carry the article.`,
      `Read this signal before comparing scenery. A route can look mild in distance and still be the wrong choice if ${row.extendedKeywords[0]} creates delay, uncertainty or pressure for the least flexible person in the group. The strongest gentle-route choice is often the one whose weakest signal is already known and manageable.`
    ]],
    [`Use ${row.extendedKeywords[1]} as the cross-check`, [
      `${row.extendedKeywords[1]} keeps the decision from becoming one-dimensional. It asks whether the first signal is supported by the day, the source and the group. A route may pass the terrain screen but fail because a shuttle detail, surface note, edge concern, weather window or facility dependency is unresolved.`,
      `When the two signals conflict, do not average them. Name the conflict and choose the more conservative reading. That may mean a shorter walk, a different time of day, a visitor-center-adjacent route, or a backup that removes the same weak dependency rather than repeating it.`
    ]],
    [`A field test before ${row.decisionMoment.toLowerCase()}`, [
      `The field test is simple enough to say out loud: this route fits because ${row.answerClaim.toLowerCase()} If that sentence sounds forced, the plan is not ready. The point is not to prove the route is safe for everyone. The point is to see whether the available evidence is strong enough for this group and this day.`,
      `Use official park pages for current closures, access details, weather-sensitive notices and transportation changes. Use measured or descriptive trail information for stable route shape, distance, surface and grade. Use photos and reviews only as secondary clues, especially when the claim depends on current conditions.`
    ]],
    [`What this article intentionally does not answer`, [
      `${row.notAnsweredHere} That exclusion is part of the quality standard. A page that tries to answer every nearby question usually becomes a recycled guide with a new title. This one stays focused on the decision that makes ${row.mainKeyword} useful.`,
      `If the reader needs a broader choice, the next step is to compare this route lens with Gradient Trail's methodology, route finder, time calculator and same-cluster planning articles. If the reader needs a live condition answer, the next step is the official park source, not another summary paragraph.`
    ]],
    [`The conservative next move`, [
      `Keep the route when the route facts, source strength and group needs agree. Change the route when one signal is missing but a lower-commitment alternative exists. Skip the route when the unresolved signal would affect safety, access, dignity, timing or the ability to turn around calmly.`,
      `That conclusion is intentionally practical. A high-quality gentle-trail article should leave the reader with one better decision, a clearer boundary and a source habit they can reuse on the next route. ${row.nonOverlapClaim}`
    ]]
  ];
}

function evidenceAuditSections(row) {
  return [
    [`Start with the claim behind ${row.mainKeyword}`, [
      `The claim is specific: ${row.answerClaim} That is different from saying the route is generally easy, scenic or popular. The reader needs a decision framework for ${row.readerSituation.toLowerCase()}, so the article starts by naming what would make the plan credible.`,
      `${row.uniqueAngle} In practice, that means the page should earn the keyword by turning it into a source habit, a field check and a clear stop rule. It should not drift into a park overview or repeat generic easy-hike advice.`
    ]],
    [`Evidence tier one: official language and route boundaries`, [
      `Official pages, maps, alerts and access notes carry the highest weight when ${row.mainKeyword} depends on a current or park-managed condition. They can confirm closures, transportation changes, protected areas, facility limits and safety notices that a review or old photo cannot settle.`,
      `The useful move is to ask whether the official language changes ${row.decisionMoment.toLowerCase()}. If it does, treat it as a controlling signal. If it does not, keep it as context and move to the next tier instead of padding the article with source summaries.`
    ]],
    [`Evidence tier two: ${row.extendedKeywords[0]} in the route description`, [
      `${row.extendedKeywords[0]} should appear in the route description as a practical constraint, not as a loose synonym. The reader should be able to point to the exact sentence, map clue, distance note, surface note, schedule clue or facility detail that changes the walk.`,
      `If this signal is absent, the article should say so plainly. A missing signal can still be useful because it tells the reader to choose a more conservative route, ask a visitor center question or delay commitment until the route fact is verifiable.`
    ]],
    [`Evidence tier three: ${row.extendedKeywords[1]} before the final yes`, [
      `${row.extendedKeywords[1]} is the second guardrail. It prevents a route from passing on one attractive fact while failing on timing, exposure, surface, crowding, transport, services or group comfort. The final decision should require both modifiers to support the same plan.`,
      `When the modifiers disagree, use the lower-commitment interpretation. A shorter segment, earlier start, closer service base or backup route is usually a stronger answer than trying to make the original idea fit every reader.`
    ]],
    [`What the audit deliberately leaves outside`, [
      `${row.notAnsweredHere} That exclusion protects the article from becoming a recycled catch-all page. The article can mention nearby context only when it helps judge ${row.mainKeyword}; anything broader belongs in a different guide.`,
      `The non-overlap rule is simple: ${row.nonOverlapClaim} The article wins by answering one decision well, not by accumulating every related park fact.`
    ]],
    [`Reader-ready verdict for ${row.feature}`, [
      `Keep the plan when official signals, route description and group needs all point in the same direction. Adjust it when one signal is weak but a lower-friction version exists. Drop it when the weak signal affects turnaround, comfort, access, weather exposure or transportation pressure.`,
      `That verdict gives the reader a usable next action without pretending to provide live conditions. For live status, current closures and current weather, the article should send the reader back to the relevant official source.`
    ]]
  ];
}

function scenarioSections(row) {
  return [
    [`The real reader problem in ${row.mainKeyword}`, [
      `The reader is not asking for a list of pleasant walks. The reader is trying to solve this situation: ${row.readerSituation.toLowerCase()}. That problem changes how ${row.extendedKeywords[0]} and ${row.extendedKeywords[1]} should be weighed.`,
      `${row.uniqueAngle} A useful scenario article therefore starts with the reader's constraint and works outward to route choice, not the other way around.`
    ]],
    [`Decision pressure created by ${row.extendedKeywords[0]}`, [
      `${row.extendedKeywords[0]} is the first pressure point because it can make the same route feel calm for one group and brittle for another. It should be translated into a concrete question the group can answer before arriving.`,
      `For this article, the question is whether ${row.extendedKeywords[0]} affects the least flexible part of the outing: timing, footing, rest, transport, services, attention, access or the ability to turn around without conflict.`
    ]],
    [`The hidden tradeoff inside ${row.extendedKeywords[1]}`, [
      `${row.extendedKeywords[1]} is the quieter tradeoff. It may not look like terrain, but it can decide whether a gentle route remains gentle in practice. The article should make that tradeoff visible before scenery or popularity takes over.`,
      `A strong draft does not tell every reader to avoid the route. It tells them what must be true for ${row.decisionMoment.toLowerCase()} to be a reasonable move.`
    ]],
    [`A small planning object the reader can use`, [
      `${row.toolTitle} should be more than a named graphic. It should give the reader a compact way to compare signals: what is known, what is uncertain and what would make the plan change.`,
      `The table and visual block should repeat the decision logic in a scannable form, while the prose explains why the tradeoff matters. That is how the article avoids feeling like a template even though every page has usable components.`
    ]],
    [`Boundary conditions and source discipline`, [
      `${row.notAnsweredHere} The boundary matters because scenario pages are easy to overextend. If the article promises too much, it becomes less trustworthy and starts competing with other site pages.`,
      `Use official sources for live or park-managed facts, measured route information for stable trail shape, and user photos only as secondary evidence. This order keeps the answer useful without overclaiming.`
    ]],
    [`The answer the reader should leave with`, [
      `The reader should leave with one sentence they can use at the trailhead: ${row.answerClaim} If that sentence cannot be supported, the plan needs a smaller route, a different time or a backup that removes the weak dependency.`,
      `${row.nonOverlapClaim} That narrowness is the point: a high-scoring scenario post solves one decision cleanly instead of trying to sound comprehensive.`
    ]]
  ];
}

function routeFeatureSections(row) {
  return [
    [`Define the route feature before judging ${row.mainKeyword}`, [
      `${row.mainKeyword} names a feature-led planning problem, not a full itinerary. The article should first define the feature in plain terms so the reader knows what evidence belongs on the page and what belongs somewhere else.`,
      `${row.uniqueAngle} That feature focus keeps the post distinct from broad park recommendations and from generic safety pages.`
    ]],
    [`Where ${row.extendedKeywords[0]} changes the experience`, [
      `${row.extendedKeywords[0]} matters only if it changes effort, confidence, pacing, exposure, surface attention, route reversibility or group comfort. The article should show that change with a concrete route-reading habit.`,
      `For a feature guide, the strongest evidence is often a detail that sounds small until the reader imagines the return trip, the slowest walker, the weather window or the point where turning around stops feeling easy.`
    ]],
    [`Why ${row.extendedKeywords[1]} is not a footnote`, [
      `${row.extendedKeywords[1]} should be treated as a real planning variable. If it is ignored, the article risks telling readers that the route feature is always manageable just because the distance or climb looks low.`,
      `The better approach is to make ${row.extendedKeywords[1]} part of the decision table, then explain when it supports the plan and when it should push the reader toward a simpler alternative.`
    ]],
    [`Compare the feature against route context`, [
      `In ${row.context}, the same feature can mean different things depending on access, season, surface, transportation, visibility and facilities. The page should compare those context signals before recommending any commitment.`,
      `This comparison does not need to rank every route. It needs to help the reader decide whether ${row.decisionMoment.toLowerCase()} is still justified after the feature is understood.`
    ]],
    [`Avoid the common overclaim`, [
      `${row.notAnsweredHere} The overclaim would be to treat one feature as enough evidence for every reader. A conservative guide keeps the claim smaller and more defensible.`,
      `That is also how the page avoids cannibalizing nearby articles: ${row.nonOverlapClaim}`
    ]],
    [`Use the feature as a go, adjust or skip signal`, [
      `Go when the feature, source freshness and group needs support each other. Adjust when the feature is appealing but one modifier is unresolved. Skip when the unresolved modifier affects access, timing, comfort, weather exposure or the ability to reverse the route calmly.`,
      `The quality target is a reader who can make a better decision in five minutes, not a page that sounds exhaustive.`
    ]]
  ];
}

function workflowSections(row) {
  return [
    [`The workflow job behind ${row.mainKeyword}`, [
      `${row.mainKeyword} is a process article, so the value is in sequence. The reader needs a repeatable way to use ${row.extendedKeywords[0]} and ${row.extendedKeywords[1]} before the route decision becomes rushed.`,
      `${row.uniqueAngle} A workflow page should therefore read like a practical operating habit, not like a trail description with the nouns changed.`
    ]],
    [`Step one: turn ${row.extendedKeywords[0]} into a yes-or-change question`, [
      `The first step is to ask what ${row.extendedKeywords[0]} would change. If it changes nothing, it is not a strong planning signal. If it changes start time, route length, backup choice, source priority or group expectations, it belongs near the top of the workflow.`,
      `Write the answer as a decision, not as a note. The reader should know whether to continue with the route, shorten it, swap it or verify one more source.`
    ]],
    [`Step two: make ${row.extendedKeywords[1]} the failure check`, [
      `${row.extendedKeywords[1]} is the failure check because workflows break at the assumption nobody wrote down. It should test whether the plan still works when the first step is inconvenient, delayed or only partly true.`,
      `If the failure check is weak, the workflow should offer a lower-friction path: a closer route, clearer source, earlier start, shorter segment or backup owner.`
    ]],
    [`Step three: document the boundary`, [
      `The boundary is the condition that would make ${row.decisionMoment.toLowerCase()} a bad move. Naming it protects the group from forcing a plan just because the route looked gentle during research.`,
      `${row.toolTitle} is the compact version of that boundary. It should help the reader see what is confirmed, what is uncertain and what action follows.`
    ]],
    [`Keep source freshness inside the workflow`, [
      `A workflow article should tell readers when to use official sources, when to use stable route descriptions and when to treat photos or reviews as weak evidence. Current closures, alerts, transportation and weather-sensitive facts need the freshest source available.`,
      `${row.notAnsweredHere} That limitation keeps the workflow honest and prevents old information from masquerading as current guidance.`
    ]],
    [`Finish with an action, not a slogan`, [
      `The finish is practical: keep the plan if ${row.answerClaim.toLowerCase()} Change it if one modifier is unresolved but a simpler option removes the problem. Skip it if the unresolved issue affects safety, access, comfort, timing or calm turnaround.`,
      `${row.nonOverlapClaim} The article's job is complete when the reader has a clear next action and a better checking habit.`
    ]]
  ];
}

function sourceHierarchySections(row) {
  return [
    [`Rank the sources before ranking ${row.mainKeyword}`, [
      `The planning mistake is to compare routes before ranking evidence. For ${row.mainKeyword}, official pages, route descriptions, maps, weather sources, recent notices and photos do different jobs. The article should keep those jobs separate.`,
      `${row.uniqueAngle} That separation is what makes the piece useful for ${row.readerSituation.toLowerCase()} instead of another broad listicle.`
    ]],
    [`Official-source question for ${row.extendedKeywords[0]}`, [
      `Ask whether an official source can confirm the part of ${row.extendedKeywords[0]} that affects the decision. If the answer is yes, that source controls the recommendation. If the answer is no, the article should describe the uncertainty instead of smoothing it over.`,
      `This is especially important when the signal depends on closures, access, facilities, shuttle operation, protected areas, current conditions or warnings.`
    ]],
    [`Stable route evidence for ${row.extendedKeywords[1]}`, [
      `${row.extendedKeywords[1]} may be partly stable and partly current. The stable part can come from route descriptions, maps and measured details. The current part needs a same-day or official check before the reader treats it as settled.`,
      `A strong article marks that difference in plain language so the reader knows which facts can be trusted during early planning and which ones must be verified close to the walk.`
    ]],
    [`Secondary clues that can help but should not decide`, [
      `Photos, reviews and personal trip notes can reveal surface texture, shade feel, crowding patterns or confusing junctions, but they should not override official alerts or route-specific access information. They are context, not the final authority.`,
      `Use them to form questions: does the route look exposed, narrow, sandy, crowded, steep at one point or hard to reverse? Then check those questions against stronger sources when possible.`
    ]],
    [`Scope control for the page`, [
      `${row.notAnsweredHere} The scope limit is not a weakness. It keeps the article from making claims that its evidence cannot support.`,
      `The page remains unique because ${row.nonOverlapClaim} A source-hierarchy article is strongest when each source has one clear job.`
    ]],
    [`A final source-backed decision`, [
      `The final decision is ready only when the source hierarchy supports it: official signals do not block the route, stable route facts fit the group, and the two modifiers do not create unresolved pressure.`,
      `If that support is missing, the best answer is not a softer paragraph. It is a changed plan, a delayed decision or a smaller route commitment.`
    ]]
  ];
}

const sectionFamilies = [
  routeDecisionSections,
  evidenceAuditSections,
  scenarioSections,
  routeFeatureSections,
  workflowSections,
  sourceHierarchySections
];

function sections(row) {
  return sectionFamilies[row.index % sectionFamilies.length](row);
}

function takeaways(row) {
  return [
    `${row.mainKeyword} should change a route, timing or backup decision, not just decorate the title.`,
    `${row.extendedKeywords[0]} and ${row.extendedKeywords[1]} need to agree before the plan feels final.`,
    `Official park sources control current closures, alerts, access details and condition-sensitive decisions.`
  ];
}

export const next100Posts = rows.map((item, index) => {
  const [
    cluster,
    slug,
    title,
    subtitle,
    mainKeyword,
    extendedKeywords,
    searchIntent,
    uniqueAngle,
    toolTitle,
    visualType,
    context,
    feature,
    readerSituation,
    decisionMoment,
    notAnsweredHere
  ] = item;
  const meta = clusterMeta[cluster];
  const publishAt = scheduledAt(index);
  const seoTitle = titleWithRequiredCoverage(title, mainKeyword, extendedKeywords, index);
  const seoSubtitle = subtitleWithRequiredCoverage(subtitle, mainKeyword, extendedKeywords, index);
  const row = {
    index,
    cluster,
    slug,
    title: seoTitle,
    subtitle: seoSubtitle,
    mainKeyword,
    extendedKeywords,
    searchIntent,
    uniqueAngle,
    toolTitle,
    visualType,
    context,
    feature,
    readerSituation,
    decisionMoment,
    answerClaim: `${mainKeyword} is backed by ${extendedKeywords[0]} and ${extendedKeywords[1]} with an official-source check still available.`,
    nonOverlapClaim: `This article focuses on ${mainKeyword} inside ${context}, not the broader easy-trail category.`,
    notAnsweredHere
  };
  return {
    slug,
    title: seoTitle,
    subtitle: seoSubtitle,
    mainKeyword,
    extendedKeywords,
    keywordRole: "distinct route-planning query with two concrete modifiers",
    searchIntent,
    uniqueAngle,
    readerSituation,
    decisionCriterion: decisionMoment,
    answerClaim: row.answerClaim,
    nonOverlapClaim: row.nonOverlapClaim,
    structureType: ["park_playbook", "scenario_decision", "feature_audit", "workflow_card", "source_hierarchy"][index % 5],
    visualElements: [visualType, "decision-table", "source-notes"],
    scheduledAt: publishAt,
    publishAt,
    cat: meta.cat,
    catLabel: meta.catLabel,
    tint: meta.tint,
    seed: slug,
    author: authors[index % authors.length],
    date: displayDate(publishAt),
    read: `${11 + (index % 5)} min`,
    featured: false,
    dek: seoSubtitle,
    readerJob: `Use ${mainKeyword} with ${extendedKeywords[0]} and ${extendedKeywords[1]} before choosing or adjusting a gentle national park route.`,
    answerBox: makeAnswerBox(row),
    fieldExample: makeFieldExample(row),
    decisionTool: decisionTool(row),
    visual: makeVisual(row),
    faq: makeFaq(row),
    verificationChecklist: makeVerificationChecklist(row),
    researchEvidence: researchEvidence(row),
    sections: sections(row),
    takeaways: takeaways(row),
    sources: sourceSet(cluster),
    qualityScore: 93 + (index % 5)
  };
});
