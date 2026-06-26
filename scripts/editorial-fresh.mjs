const authors = ["Gradient Field Team", "Mira Lee", "Sara Kim", "Elena Cruz", "Nolan Park"];

const clusterMeta = {
  logistics: { cat: "guide", catLabel: "Logistics", tint: "#6f7f4c" },
  terrain: { cat: "data", catLabel: "Terrain", tint: "#3f7f8c" },
  access: { cat: "access", catLabel: "Access", tint: "#b85c38" },
  family: { cat: "family", catLabel: "Family", tint: "#c89332" },
  weather: { cat: "seasonal", catLabel: "Weather", tint: "#94704c" },
  landscapes: { cat: "parks", catLabel: "Landscapes", tint: "#557d66" },
  metrics: { cat: "data", catLabel: "Metrics", tint: "#496f93" },
  itinerary: { cat: "guide", catLabel: "Itinerary", tint: "#7f8f52" },
  safety: { cat: "seasonal", catLabel: "Readiness", tint: "#98613f" },
  sources: { cat: "data", catLabel: "Sources", tint: "#586f87" }
};

const sourceLibrary = {
  trip: ["NPS Trip Planning Guide", "https://www.nps.gov/subjects/healthandsafety/trip-planning-guide.htm"],
  hike: ["NPS Hike Smart", "https://www.nps.gov/articles/hiking-safety.htm"],
  weather: ["NPS Weather Safety", "https://www.nps.gov/subjects/healthandsafety/severe-weather-safety.htm"],
  access: ["NPS Accessibility", "https://www.nps.gov/accessibility.htm"],
  plan: ["NPS Plan Your Visit", "https://www.nps.gov/planyourvisit/index.htm"],
  leave: ["Leave No Trace Seven Principles", "https://lnt.org/why/7-principles/"],
  usgs: ["USGS 3D Elevation Program", "https://www.usgs.gov/3d-elevation-program"],
  noaa: ["NOAA Weather Safety", "https://www.weather.gov/safety/"],
  air: ["AirNow Fire and Smoke Map", "https://fire.airnow.gov/"],
  rec: ["Recreation.gov Trip Planning", "https://www.recreation.gov/"]
};

const sourceProfiles = {
  logistics: ["trip", "plan", "hike", "leave", "rec"],
  terrain: ["usgs", "hike", "trip", "weather", "leave"],
  access: ["access", "trip", "plan", "hike", "leave"],
  family: ["trip", "hike", "plan", "weather", "leave"],
  weather: ["weather", "noaa", "air", "trip", "hike"],
  landscapes: ["plan", "trip", "hike", "weather", "leave"],
  metrics: ["usgs", "hike", "trip", "plan", "leave"],
  itinerary: ["trip", "plan", "weather", "hike", "rec"],
  safety: ["hike", "weather", "trip", "plan", "leave"],
  sources: ["plan", "trip", "access", "hike", "usgs"]
};

const rows = [
  ["logistics", "trailhead-restroom-timing", "Trailhead Restroom Timing for Gentle National Park Hikes", "How trailhead restroom timing and family hiking logistics keep a gentle route from becoming stressful.", "trailhead restroom timing", ["gentle national park hikes", "family hiking logistics"], "logistics timing", "Restrooms are treated as a route-fit variable rather than a footnote.", "Restroom timing audit", "evidenceChecklist"],
  ["logistics", "parking-overflow-backup-walk", "Parking Overflow Backup Walks for Popular Easy Trailheads", "A parking overflow backup walk plan for popular easy trailheads when the first lot is already full.", "parking overflow backup walk", ["popular easy trailheads", "first lot full"], "parking contingency", "The article separates a backup trail from a backup parking plan.", "Overflow decision board", "decisionBox"],
  ["logistics", "visitor-center-first-route-plan", "Visitor Center First Route Plans for Low-Stress Park Days", "Why a visitor center first route plan can improve gentle trail choices, alerts, maps and restroom timing.", "visitor center first route plan", ["gentle trail choices", "low-stress park days"], "arrival sequencing", "Visitor centers are framed as friction reducers, not tourist chores.", "Visitor center sequence", "stepCards"],
  ["logistics", "shuttle-gap-gentle-trail", "Shuttle Gap Planning for Gentle National Park Trails", "Use shuttle gap planning and route timing to avoid turning gentle national park trails into wait-heavy days.", "shuttle gap planning", ["gentle national park trails", "route timing"], "shuttle timing", "The decision centers on wait exposure and return certainty.", "Shuttle gap table", "timeline"],
  ["logistics", "trailhead-signage-confidence", "Trailhead Signage Confidence Before Starting an Easy Route", "A trailhead signage confidence check for easy route navigation, junction risk and return certainty.", "trailhead signage confidence", ["easy route navigation", "junction risk"], "navigation confidence", "The start of the route is treated as part of the route.", "Signage confidence scale", "riskScale"],
  ["logistics", "offline-meeting-point-hike", "Offline Meeting Points for Family National Park Hikes", "How an offline meeting point and family hike communication plan help when cell service disappears.", "offline meeting point", ["family hike communication", "cell service disappears"], "offline coordination", "The article handles easy-route coordination before anyone separates.", "Offline group plan", "stepCards"],
  ["logistics", "trailhead-meal-timing", "Trailhead Meal Timing for Short Scenic Hikes", "Trailhead meal timing and short scenic hikes work better when snacks, heat and return time are planned together.", "trailhead meal timing", ["short scenic hikes", "snacks heat return time"], "food logistics", "Meals become a pacing and heat-management decision.", "Meal timing matrix", "scenarioTable"],
  ["logistics", "road-construction-detour-hike", "Road Construction Detours Before a Gentle Trail Day", "A road construction detour check for gentle trail days, parking windows and backup route timing.", "road construction detour", ["gentle trail days", "backup route timing"], "road access", "The road before the hike is treated as a schedule risk.", "Detour readiness ladder", "timeline"],
  ["logistics", "entrance-station-delay-hike-plan", "Entrance Station Delay Planning for Easy Park Walks", "Entrance station delay planning helps easy park walks keep enough daylight, water and group patience.", "entrance station delay planning", ["easy park walks", "daylight water patience"], "entry delay", "Entrance delay is tied to route abandonment criteria.", "Entry delay buffer", "miniFormula"],
  ["logistics", "trailhead-photo-pressure", "Trailhead Photo Pressure Can Distort Gentle Hike Choices", "How trailhead photo pressure and scenic route expectations can push a gentle hike beyond the group fit.", "trailhead photo pressure", ["scenic route expectations", "group fit"], "expectation pressure", "The piece treats social pressure as a planning hazard.", "Photo-pressure filter", "decisionBox"],

  ["terrain", "contour-lines-easy-hike", "Contour Lines for Easy Hike Decisions in National Parks", "Use contour lines and easy hike decisions to see hidden climbs before a national park route feels committed.", "contour lines", ["easy hike decisions", "hidden climbs"], "map literacy", "Contour reading is translated for non-technical route decisions.", "Contour cue table", "evidenceChecklist"],
  ["terrain", "grade-distribution-trail-effort", "Grade Distribution Explains Trail Effort Better Than One Number", "Why grade distribution and trail effort matter when a gentle route has one short steep section.", "grade distribution", ["trail effort", "short steep section"], "grade pattern", "The angle distinguishes average grade from effort timing.", "Grade distribution board", "miniFormula"],
  ["terrain", "stairs-on-short-trails", "Stairs on Short Trails Change the Easy Hike Calculation", "How stairs on short trails affect easy hike calculation, family pacing and mobility-aware route checks.", "stairs on short trails", ["easy hike calculation", "family pacing"], "step effort", "Steps are treated as surface and grade, not scenery.", "Stair-effort checklist", "riskScale"],
  ["terrain", "sand-vs-gravel-trail-surface", "Sand vs Gravel Trail Surface for Gentle National Park Walks", "A sand vs gravel trail surface comparison for gentle national park walks, strollers and tired legs.", "sand vs gravel trail surface", ["gentle national park walks", "strollers tired legs"], "surface comparison", "The article separates loose-surface fatigue from route distance.", "Surface drag table", "scenarioTable"],
  ["terrain", "boardwalk-frost-risk", "Boardwalk Frost Risk on Morning National Park Walks", "Boardwalk frost risk and morning national park walks need traction, shade and official condition checks.", "boardwalk frost risk", ["morning national park walks", "official condition checks"], "cold surface", "Frost is handled as a micro-condition on otherwise gentle surfaces.", "Frost risk scale", "riskScale"],
  ["terrain", "small-bridge-crossings-trail", "Small Bridge Crossings on Easy Trails Still Deserve a Check", "Small bridge crossings and easy trails can affect access, wet weather decisions and family route confidence.", "small bridge crossings", ["easy trails", "wet weather decisions"], "crossing detail", "Minor crossings become decision points for access and weather.", "Bridge confidence table", "evidenceChecklist"],
  ["terrain", "shade-aspect-hiking-route", "Shade Aspect in Hiking Route Planning for Hot Park Days", "Shade aspect and hiking route planning help hot park days feel calmer when grade and exposure are read together.", "shade aspect", ["hiking route planning", "hot park days"], "sun exposure", "The route's direction and slope are treated as comfort variables.", "Shade-aspect screen", "miniFormula"],
  ["terrain", "microclimate-trail-choice", "Microclimate Trail Choice for Gentle Mountain Walks", "Microclimate trail choice and gentle mountain walks require wind, shade, water and elevation checks.", "microclimate trail choice", ["gentle mountain walks", "wind shade elevation"], "microclimate", "Microclimates are connected to route fit, not broad park weather.", "Microclimate branch table", "scenarioTable"],
  ["terrain", "drainage-after-storm-trails", "Drainage After Storms Can Reclassify an Easy Trail", "Drainage after storms and easy trail planning change how you read mud, crossings and boardwalk segments.", "drainage after storms", ["easy trail planning", "mud crossings boardwalk"], "post-storm terrain", "The article explains why the same trail changes class after weather.", "Drainage decision ladder", "decisionBox"],
  ["terrain", "snowline-route-selection", "Snowline Route Selection for Gentle Spring Hikes", "Snowline route selection and gentle spring hikes depend on elevation bands, shade and official closure notes.", "snowline route selection", ["gentle spring hikes", "official closure notes"], "spring snow", "Snowline is positioned as a route-screening boundary.", "Snowline readiness table", "timeline"],

  ["access", "bench-spacing-access-aware-walk", "Bench Spacing for Access-Aware National Park Walks", "Bench spacing and access-aware national park walks help visitors judge rest rhythm, shade and route confidence.", "bench spacing", ["access-aware national park walks", "rest rhythm"], "rest access", "Rest points are treated as evidence, not amenities.", "Bench spacing audit", "evidenceChecklist"],
  ["access", "ramp-transition-trailhead", "Ramp Transitions at Trailheads Need More Than a Surface Label", "Ramp transitions and trailhead surface labels shape wheelchair route checks, stroller use and access certainty.", "ramp transitions", ["trailhead surface labels", "access certainty"], "entry transition", "The article focuses on the first feet of the route.", "Transition detail table", "scenarioTable"],
  ["access", "mobility-device-trail-surface", "Mobility Device Trail Surface Checks Before a Park Walk", "A mobility device trail surface check for slope, cross-slope, gravel, boardwalk and current condition notes.", "mobility device trail surface", ["slope cross-slope gravel", "current condition notes"], "device surface", "Surface is described as device-specific rather than universally easy.", "Device-surface board", "decisionBox"],
  ["access", "sensory-overload-easy-trail", "Sensory Overload on Easy Trails: Crowds, Noise and Narrow Paths", "Sensory overload on easy trails can make crowds, noise and narrow paths matter as much as mileage.", "sensory overload on easy trails", ["crowds noise narrow paths", "mileage"], "sensory fit", "The piece adds sensory load to easy-route screening.", "Sensory pressure scale", "riskScale"],
  ["access", "low-vision-route-cues", "Low-Vision Route Cues for Gentle National Park Trails", "Low-vision route cues and gentle national park trails require contrast, edge clarity, signage and companion planning.", "low-vision route cues", ["gentle national park trails", "contrast signage"], "visual navigation", "The article discusses route cues without overclaiming access.", "Cue confidence checklist", "evidenceChecklist"],
  ["access", "accessible-shuttle-dependence", "Accessible Shuttle Dependence in National Park Trail Plans", "Accessible shuttle dependence and national park trail plans need timing, boarding, stop location and fallback checks.", "accessible shuttle dependence", ["national park trail plans", "fallback checks"], "access transport", "Transit access is treated as part of the trail decision.", "Shuttle access sequence", "timeline"],
  ["access", "service-animal-water-breaks", "Service Animal Water Breaks on Gentle Park Trails", "Service animal water breaks and gentle park trails need heat, surface, crowd and official rule checks.", "service animal water breaks", ["gentle park trails", "official rule checks"], "service animal planning", "The article focuses on route fit for handler and animal together.", "Service animal route check", "stepCards"],
  ["access", "restroom-access-route-confidence", "Restroom Access Builds Route Confidence for Mobility-Aware Walks", "Restroom access and mobility-aware walks affect timing, distance tolerance and the decision to turn around.", "restroom access", ["mobility-aware walks", "turn around"], "facility access", "Facilities are framed as confidence infrastructure.", "Restroom confidence ladder", "decisionBox"],
  ["access", "companion-pacing-accessible-walk", "Companion Pacing on Accessible Park Walks", "Companion pacing and accessible park walks work best when rest points, slope and communication are planned.", "companion pacing", ["accessible park walks", "rest points slope"], "group support", "The companion's role is practical, not heroic or vague.", "Companion pacing plan", "stepCards"],
  ["access", "call-park-accessibility-questions", "Questions to Ask Before Relying on a Park Accessibility Claim", "Park accessibility claim questions should cover surface, slope, closures, shuttles, restrooms and current conditions.", "park accessibility claim questions", ["surface slope closures", "current conditions"], "official call prep", "The article gives a precise inquiry script without pretending to certify access.", "Access call script", "evidenceChecklist"],

  ["family", "teen-and-toddler-trail-plan", "Teen and Toddler Trail Plans for One Gentle Park Walk", "A teen and toddler trail plan helps one gentle park walk satisfy movement, attention and rest needs together.", "teen and toddler trail plan", ["one gentle park walk", "attention rest needs"], "mixed child ages", "The article handles opposite pacing needs inside one family.", "Age-split route board", "scenarioTable"],
  ["family", "grandparent-rest-rhythm", "Grandparent Rest Rhythm on Family National Park Trails", "Grandparent rest rhythm and family national park trails should shape benches, shade, grade and turnaround choices.", "grandparent rest rhythm", ["family national park trails", "shade grade turnaround"], "older adult pacing", "Rest rhythm is separated from age stereotypes.", "Rest rhythm checklist", "evidenceChecklist"],
  ["family", "neurodivergent-child-trail-plan", "Neurodivergent Child Trail Planning for Gentle Park Routes", "Neurodivergent child trail planning and gentle park routes benefit from predictability, exits and sensory load checks.", "neurodivergent child trail planning", ["gentle park routes", "sensory load checks"], "predictable family planning", "The article focuses on route predictability without medical advice.", "Predictability route map", "stepCards"],
  ["family", "stroller-nap-timing", "Stroller Nap Timing on National Park Walks", "Stroller nap timing and national park walks depend on surface, shade, noise and return certainty.", "stroller nap timing", ["national park walks", "surface shade noise"], "stroller rhythm", "The article treats a nap as a route constraint, not a parenting tip list.", "Nap-window route filter", "timeline"],
  ["family", "sibling-split-hike-plan", "Sibling Split Plans for Family-Friendly Trail Days", "A sibling split hike plan and family-friendly trail day can protect different energy levels without splitting safety.", "sibling split hike plan", ["family-friendly trail day", "different energy levels"], "family branch planning", "The article helps families decide when not to force one pace.", "Sibling branch table", "scenarioTable"],
  ["family", "family-photo-stop-pacing", "Family Photo Stop Pacing on Scenic Easy Trails", "Family photo stop pacing and scenic easy trails change total outing time, attention and crowd pressure.", "family photo stop pacing", ["scenic easy trails", "total outing time"], "photo pacing", "Photo stops are counted as time and crowd friction.", "Photo-stop time budget", "miniFormula"],
  ["family", "kid-water-reminder-route", "Kid Water Reminder Routes for Hot Easy Hikes", "Kid water reminder routes and hot easy hikes work better when shade, breaks and refill points are visible.", "kid water reminder routes", ["hot easy hikes", "shade breaks refill points"], "hydration rhythm", "The angle makes water reminders route-based rather than nagging.", "Water rhythm checklist", "stepCards"],
  ["family", "reward-frequency-kids-hikes", "Reward Frequency on Kids' National Park Hikes", "Reward frequency and kids' national park hikes explain why signs, creeks and viewpoints can beat distance alone.", "reward frequency", ["kids' national park hikes", "signs creeks viewpoints"], "engagement design", "The article measures interest density instead of just destination value.", "Reward spacing table", "scenarioTable"],
  ["family", "post-hike-meltdown-prevention", "Post-Hike Meltdown Prevention Starts Before the Trailhead", "Post-hike meltdown prevention and trailhead planning connect snacks, shade, return timing and exit simplicity.", "post-hike meltdown prevention", ["trailhead planning", "return timing"], "family recovery", "The article looks at the hour after the route.", "Meltdown risk scale", "riskScale"],
  ["family", "junior-ranger-trail-pairing", "Junior Ranger Trail Pairing for a Calm Park Day", "Junior Ranger trail pairing and a calm park day can connect learning stops, short walks and visitor center timing.", "Junior Ranger trail pairing", ["calm park day", "visitor center timing"], "learning itinerary", "The article pairs a program-style goal with terrain fit.", "Junior Ranger sequence", "timeline"],

  ["weather", "thunderstorm-turnaround-time", "Thunderstorm Turnaround Time for Easy Mountain Trails", "Thunderstorm turnaround time and easy mountain trails require morning starts, sky checks and backup decisions.", "thunderstorm turnaround time", ["easy mountain trails", "backup decisions"], "storm timing", "The article turns weather risk into a time boundary.", "Storm turnaround ladder", "timeline"],
  ["weather", "desert-wind-short-walk", "Desert Wind Can Change a Short National Park Walk", "Desert wind and short national park walks affect sand, exposure, eyes, kids and scenic viewpoints.", "desert wind", ["short national park walks", "sand exposure"], "wind exposure", "Wind is treated as comfort and safety friction.", "Wind exposure scale", "riskScale"],
  ["weather", "cold-morning-boardwalk", "Cold Morning Boardwalk Planning for Gentle Routes", "Cold morning boardwalk planning and gentle routes should consider frost, railings, footwear and sun timing.", "cold morning boardwalk planning", ["gentle routes", "frost footwear"], "cold start", "The article handles a short route's first hour, not the whole season.", "Cold boardwalk check", "evidenceChecklist"],
  ["weather", "bug-season-gentle-hike", "Bug Season Gentle Hike Planning for Families", "Bug season gentle hike planning and families should balance standing water, shade, pace and backup stops.", "bug season gentle hike planning", ["families", "standing water shade"], "insect season", "Bugs are framed as attention and pacing friction.", "Bug-friction route board", "scenarioTable"],
  ["weather", "icy-shade-trail-segments", "Icy Shade Segments on Otherwise Easy Trails", "Icy shade segments and otherwise easy trails need aspect, timing, footwear and official condition checks.", "icy shade segments", ["otherwise easy trails", "official condition checks"], "ice pockets", "The article isolates shaded segments rather than labeling the whole trail winter-hard.", "Icy segment scan", "riskScale"],
  ["weather", "glare-on-lake-loop", "Glare on Lake Loop Trails: A Gentle Hike Comfort Check", "Glare on lake loop trails and gentle hike comfort change with sun angle, water, eyewear and direction.", "glare on lake loop trails", ["gentle hike comfort", "sun angle"], "glare comfort", "The article explains an overlooked sensory/weather variable.", "Glare direction table", "miniFormula"],
  ["weather", "monsoon-wash-crossing", "Monsoon Wash Crossings Before a Desert Park Walk", "Monsoon wash crossings and desert park walks require forecast checks, route shape and no-go triggers.", "monsoon wash crossings", ["desert park walks", "no-go triggers"], "flash flood awareness", "The focus is route screening, not dramatic storm storytelling.", "Wash crossing decision tree", "decisionBox"],
  ["weather", "smoke-day-visitor-center-walk", "Smoke-Day Visitor Center Walks as Gentle Trail Alternatives", "Smoke-day visitor center walks and gentle trail alternatives help protect views, breathing comfort and trip value.", "smoke-day visitor center walks", ["gentle trail alternatives", "breathing comfort"], "smoke alternative", "The article avoids medical claims while supporting conservative alternatives.", "Smoke-day alternative board", "scenarioTable"],
  ["weather", "flash-flood-route-avoidance", "Flash Flood Route Avoidance for Easy Canyon Walks", "Flash flood route avoidance and easy canyon walks depend on drainage, forecast timing and official warnings.", "flash flood route avoidance", ["easy canyon walks", "official warnings"], "canyon weather risk", "The piece separates canyon route shape from general rain advice.", "Flood avoidance ladder", "timeline"],
  ["weather", "wildflower-mud-tradeoff", "Wildflower Mud Tradeoffs on Gentle Spring Trails", "Wildflower mud tradeoffs and gentle spring trails require meadow protection, footwear and alternate route timing.", "wildflower mud tradeoffs", ["gentle spring trails", "alternate route timing"], "spring meadow condition", "The article balances scenic timing with resource protection.", "Wildflower condition table", "scenarioTable"],

  ["landscapes", "desert-arch-short-route", "Desert Arch Short Routes Need Heat and Sand Screening", "A desert arch short route and heat sand screening plan can keep scenic walks realistic for mixed groups.", "desert arch short route", ["heat sand screening", "mixed groups"], "desert route type", "Landscape form controls comfort more than mileage.", "Arch route screen", "riskScale"],
  ["landscapes", "canyon-rim-edge-distance", "Canyon Rim Edge Distance on Gentle View Walks", "Canyon rim edge distance and gentle view walks require exposure, crowd and child-distance decisions.", "canyon rim edge distance", ["gentle view walks", "child-distance decisions"], "rim exposure", "The article measures emotional and physical edge comfort.", "Rim edge comfort board", "decisionBox"],
  ["landscapes", "coastal-bluff-breeze-route", "Coastal Bluff Breeze on Easy National Park Trails", "Coastal bluff breeze and easy national park trails can affect layers, fog, footing and turnaround points.", "coastal bluff breeze", ["easy national park trails", "fog footing"], "coastal exposure", "The angle treats wind and fog as route-fit details.", "Bluff breeze checklist", "evidenceChecklist"],
  ["landscapes", "alpine-lake-gentle-loop", "Alpine Lake Gentle Loops Still Need Elevation Context", "An alpine lake gentle loop and elevation context check keeps scenery, weather and pacing in the same decision.", "alpine lake gentle loop", ["elevation context", "weather pacing"], "alpine lake route", "A scenic lake is separated from low-elevation ease.", "Alpine lake readiness table", "scenarioTable"],
  ["landscapes", "rainforest-root-loop", "Rainforest Root Loops for Short Gentle Walks", "Rainforest root loops and short gentle walks require wet footing, boardwalk checks and slower pacing.", "rainforest root loops", ["short gentle walks", "wet footing"], "rainforest surface", "The article handles root texture as a core planning signal.", "Root loop surface scale", "riskScale"],
  ["landscapes", "prairie-boardwalk-sun", "Prairie Boardwalk Sun Exposure on Easy Nature Trails", "Prairie boardwalk sun exposure and easy nature trails affect water, hats, kids and timing.", "prairie boardwalk sun exposure", ["easy nature trails", "kids timing"], "open prairie route", "The article shows why flat and exposed are different claims.", "Prairie exposure board", "miniFormula"],
  ["landscapes", "cave-area-surface-walk", "Cave Area Surface Walks Need Temperature and Step Checks", "A cave area surface walk and temperature step check helps gentle route planning near cave entrances.", "cave area surface walk", ["temperature step check", "gentle route planning"], "cave approach", "The approach trail is treated as a microclimate transition.", "Cave approach sequence", "timeline"],
  ["landscapes", "waterfall-spray-zone-trail", "Waterfall Spray Zones on Easy Family Trails", "Waterfall spray zones and easy family trails can change footing, clothing, crowding and photo-stop timing.", "waterfall spray zones", ["easy family trails", "photo-stop timing"], "waterfall comfort", "The article treats the destination zone as part of route fit.", "Spray zone checklist", "evidenceChecklist"],
  ["landscapes", "volcanic-trail-footing", "Volcanic Trail Footing for Gentle Scenic Walks", "Volcanic trail footing and gentle scenic walks require loose rock, heat, edges and official route boundaries.", "volcanic trail footing", ["gentle scenic walks", "official route boundaries"], "volcanic surface", "The article separates scenic geology from stable footing.", "Volcanic footing scale", "riskScale"],
  ["landscapes", "historic-site-walking-loop", "Historic Site Walking Loops as Gentle Trail Alternatives", "Historic site walking loops and gentle trail alternatives can offer shade, learning stops and predictable surfaces.", "historic site walking loops", ["gentle trail alternatives", "predictable surfaces"], "historic walk", "The piece expands trail planning beyond wilderness-coded hikes.", "Historic loop route board", "scenarioTable"],

  ["metrics", "elevation-profile-reading-order", "Elevation Profile Reading Order for Easy Trail Choices", "An elevation profile reading order for easy trail choices helps catch early climbs, late climbs and grade spikes.", "elevation profile reading order", ["easy trail choices", "grade spikes"], "profile literacy", "The article teaches a repeatable read order without repeating old gain content.", "Profile read sequence", "stepCards"],
  ["metrics", "moving-time-vs-outing-time", "Moving Time vs Outing Time on Gentle National Park Routes", "Moving time vs outing time and gentle national park routes explains breaks, photos, shuttles and return buffers.", "moving time vs outing time", ["gentle national park routes", "return buffers"], "time metric", "The article distinguishes calculator output from total day cost.", "Outing time formula", "miniFormula"],
  ["metrics", "score-conflict-trail-choice", "When Trail Scores Disagree: Gentle, Family and Difficulty Signals", "Trail scores disagree when gentle family difficulty signals weigh terrain, logistics and group fit differently.", "trail scores disagree", ["gentle family difficulty signals", "group fit"], "score conflict", "The article makes score disagreement useful instead of confusing.", "Score conflict table", "scenarioTable"],
  ["metrics", "route-shape-effort", "Route Shape Changes Effort on Easy Out-and-Back Trails", "Route shape effort and easy out-and-back trails depend on turnarounds, return climbs and navigation certainty.", "route shape effort", ["easy out-and-back trails", "return climbs"], "shape metric", "The piece focuses on geometry rather than surface or distance.", "Route shape decision tree", "decisionBox"],
  ["metrics", "distance-one-way-vs-round-trip", "One-Way Distance vs Round-Trip Distance for Park Walks", "One-way distance vs round-trip distance and park walks can prevent undercounting family time and water needs.", "one-way distance vs round-trip distance", ["park walks", "family time water needs"], "distance interpretation", "A common map-reading error gets its own practical correction.", "Distance translation table", "evidenceChecklist"],
  ["metrics", "max-grade-spike", "Max Grade Spikes: The Hidden Easy Trail Filter", "Max grade spikes and hidden easy trail filters help readers catch the short ramp that changes the route.", "max grade spikes", ["hidden easy trail filters", "short ramp"], "max grade", "The article isolates the single worst segment problem.", "Grade spike scale", "riskScale"],
  ["metrics", "family-score-weighting", "Family Score Weighting for Gentle Trail Shortlists", "Family score weighting and gentle trail shortlists explain how logistics, distance and grade shape kid-friendly choices.", "family score weighting", ["gentle trail shortlists", "kid-friendly choices"], "family metric", "The score is interpreted as a planning lens, not a black box.", "Family score components", "miniFormula"],
  ["metrics", "mobile-map-battery-plan", "Mobile Map Battery Planning for Short Park Hikes", "Mobile map battery planning and short park hikes still matter when photos, service gaps and navigation overlap.", "mobile map battery planning", ["short park hikes", "service gaps"], "device readiness", "The phone is treated as a fragile planning tool.", "Battery readiness checklist", "evidenceChecklist"],
  ["metrics", "gpx-vs-official-map", "GPX vs Official Map for National Park Trail Decisions", "GPX vs official map and national park trail decisions require source age, route status and closure checks.", "GPX vs official map", ["national park trail decisions", "closure checks"], "source comparison", "The article compares evidence types without attacking user maps.", "Map source comparison", "scenarioTable"],
  ["metrics", "paper-backup-map", "Paper Backup Maps for Easy National Park Walks", "Paper backup maps and easy national park walks protect route notes, meeting points and low-service areas.", "paper backup maps", ["easy national park walks", "low-service areas"], "backup navigation", "The article explains why easy routes still deserve offline redundancy.", "Paper backup steps", "stepCards"],

  ["itinerary", "last-day-gentle-walk", "Last-Day Gentle Walks Before Leaving a National Park", "Last-day gentle walks and national park departure plans need short routes, clean timing and low parking risk.", "last-day gentle walks", ["national park departure plans", "low parking risk"], "departure day", "The article handles route choice under checkout and driving constraints.", "Last-day filter", "timeline"],
  ["itinerary", "picnic-and-short-trail", "Picnic and Short Trail Pairings for Low-Effort Park Days", "Picnic and short trail pairings can make low-effort park days feel complete without stacking mileage.", "picnic and short trail pairings", ["low-effort park days", "stacking mileage"], "picnic pairing", "The article uses food/rest as itinerary architecture.", "Picnic pairing board", "scenarioTable"],
  ["itinerary", "sunrise-vs-sunset-walk", "Sunrise vs Sunset Walks for Gentle Viewpoint Routes", "Sunrise vs sunset walks and gentle viewpoint routes differ in light, parking, cold, crowds and return certainty.", "sunrise vs sunset walks", ["gentle viewpoint routes", "return certainty"], "time comparison", "The comparison is built around route logistics, not photography advice.", "Viewpoint time table", "scenarioTable"],
  ["itinerary", "red-eye-arrival-park-walk", "Red-Eye Arrival Park Walks Should Stay Extremely Simple", "A red-eye arrival park walk and simple route plan protect daylight, driving fatigue and first-day mood.", "red-eye arrival park walk", ["simple route plan", "driving fatigue"], "travel fatigue", "The piece gives a conservative no-hero arrival rule.", "Red-eye route ladder", "decisionBox"],
  ["itinerary", "hotel-checkin-gap-trail", "Hotel Check-In Gap Trails for National Park Travel Days", "Hotel check-in gap trails and national park travel days need luggage, heat, parking and time-boxed routes.", "hotel check-in gap trails", ["national park travel days", "time-boxed routes"], "check-in gap", "The article addresses an awkward real itinerary window.", "Check-in gap board", "timeline"],
  ["itinerary", "midday-nap-trail-window", "Midday Nap Trail Windows for Family Park Trips", "Midday nap trail windows and family park trips can pair short walks with shade, meals and quiet returns.", "midday nap trail windows", ["family park trips", "quiet returns"], "family timing", "The article turns child rest needs into route timing.", "Nap-window sequence", "timeline"],
  ["itinerary", "split-group-easy-route", "Split-Group Easy Routes When Not Everyone Wants to Hike", "Split-group easy routes and non-hiker park plans need meeting points, time limits and shared rewards.", "split-group easy routes", ["non-hiker park plans", "meeting points"], "split group", "The article keeps split plans simple and accountable.", "Split-group agreement", "stepCards"],
  ["itinerary", "bus-tour-short-walk-add-on", "Bus Tour Short Walk Add-Ons in National Parks", "Bus tour short walk add-ons and national parks require strict timing, simple navigation and restroom awareness.", "bus tour short walk add-ons", ["national parks", "strict timing"], "tour add-on", "The article handles guided or bus-window constraints.", "Add-on route filter", "evidenceChecklist"],
  ["itinerary", "low-energy-park-day", "Low-Energy Park Day Plans With One Gentle Trail", "Low-energy park day plans and one gentle trail can still feel worthwhile with the right reward and backup stop.", "low-energy park day plans", ["one gentle trail", "backup stop"], "low energy day", "The piece gives permission to choose less without making the day thin.", "Low-energy plan board", "decisionBox"],
  ["itinerary", "rainy-hour-by-hour-walk", "Rainy Hour-by-Hour Walk Planning for Park Visitors", "Rainy hour-by-hour walk planning helps park visitors use short clear windows without forcing unsafe trails.", "rainy hour-by-hour walk planning", ["park visitors", "short clear windows"], "rain timing", "The article focuses on flexible timing instead of one backup list.", "Rain window timeline", "timeline"],

  ["safety", "turn-back-phrase-family-hike", "Turn-Back Phrases That Keep a Family Hike Calm", "Turn-back phrases and family hike calm planning help adults change course without making kids feel blamed.", "turn-back phrases", ["family hike calm planning", "change course"], "communication safety", "The article treats language as a practical safety tool.", "Turn-back script", "stepCards"],
  ["safety", "footwear-tradeoff-short-trail", "Footwear Tradeoffs on Short National Park Trails", "Footwear tradeoffs and short national park trails depend on roots, steps, wet rock, sand and return fatigue.", "footwear tradeoffs", ["short national park trails", "wet rock sand"], "shoe choice", "The article avoids universal footwear rules and maps shoes to surface.", "Footwear tradeoff table", "scenarioTable"],
  ["safety", "water-refill-reality-check", "Water Refill Reality Checks Before Easy Park Walks", "Water refill reality checks and easy park walks prevent underpacking when fountains, heat or lines change.", "water refill reality checks", ["easy park walks", "heat lines"], "water planning", "The article separates a known refill from an assumed refill.", "Refill confidence checklist", "evidenceChecklist"],
  ["safety", "wildlife-corridor-easy-trail", "Wildlife Corridor Awareness on Gentle Park Trails", "Wildlife corridor awareness and gentle park trails keep popular routes from feeling falsely controlled.", "wildlife corridor awareness", ["gentle park trails", "popular routes"], "wildlife readiness", "The article explains why easy and busy do not erase wildlife behavior.", "Wildlife awareness board", "riskScale"],
  ["safety", "cliff-edge-comfort-zone", "Cliff Edge Comfort Zones for Gentle Viewpoint Walks", "Cliff edge comfort zones and gentle viewpoint walks help families set distance rules before the overlook.", "cliff edge comfort zones", ["gentle viewpoint walks", "distance rules"], "edge safety", "The article focuses on pre-agreed boundaries.", "Edge comfort ladder", "decisionBox"],
  ["safety", "kids-near-water-trails", "Kids Near Water on Easy National Park Trails", "Kids near water and easy national park trails need bank distance, footing, attention and photo-stop rules.", "kids near water", ["easy national park trails", "photo-stop rules"], "water edge", "Water is framed as a supervision zone, not only scenery.", "Water-edge checklist", "evidenceChecklist"],
  ["safety", "solo-easy-trail-plan", "Solo Easy Trail Plans Still Need Check-In Habits", "A solo easy trail plan and check-in habits matter when service, weather, injury or route confusion changes.", "solo easy trail plan", ["check-in habits", "route confusion"], "solo readiness", "The piece keeps advice lightweight but concrete.", "Solo check-in sequence", "stepCards"],
  ["safety", "fog-low-visibility-walk", "Fog and Low Visibility on Easy Park Walks", "Fog and low visibility on easy park walks affect navigation, road crossings, viewpoints and return confidence.", "fog and low visibility", ["easy park walks", "return confidence"], "visibility", "The article shows why visual reward routes can lose their purpose.", "Visibility decision table", "scenarioTable"],
  ["safety", "simple-emergency-plan-hike", "A Simple Emergency Plan for Short National Park Hikes", "A simple emergency plan and short national park hikes should cover contact, location, timing and turnaround rules.", "simple emergency plan", ["short national park hikes", "turnaround rules"], "emergency basics", "The article keeps emergency planning proportional to easy routes.", "Emergency basics card", "stepCards"],
  ["safety", "altitude-warning-signs-easy-route", "Altitude Warning Signs on Easy Mountain Routes", "Altitude warning signs and easy mountain routes require slower pace, honest symptoms and conservative turnarounds.", "altitude warning signs", ["easy mountain routes", "conservative turnarounds"], "altitude safety", "The article explains altitude without giving medical treatment advice.", "Altitude caution ladder", "riskScale"],

  ["sources", "official-alerts-vs-blog-advice", "Official Alerts vs Blog Advice for National Park Trails", "Official alerts vs blog advice and national park trails should decide closures, hazards, shuttles and access details.", "official alerts vs blog advice", ["national park trails", "access details"], "source hierarchy", "The article names which source controls which decision.", "Source control table", "scenarioTable"],
  ["sources", "social-media-trail-hype", "Social Media Trail Hype Can Misread Gentle Route Fit", "Social media trail hype and gentle route fit often miss parking, grade, crowds, weather and group limits.", "social media trail hype", ["gentle route fit", "group limits"], "hype filter", "The piece distinguishes inspiration from planning evidence.", "Hype filter checklist", "evidenceChecklist"],
  ["sources", "outdated-trail-reviews", "Outdated Trail Reviews Before a National Park Walk", "Outdated trail reviews and a national park walk can mislead when closures, construction or surface repairs change.", "outdated trail reviews", ["national park walk", "surface repairs"], "review freshness", "The article teaches date reading as a route skill.", "Review freshness scale", "riskScale"],
  ["sources", "photos-mislead-trail-grade", "Photos Can Mislead Trail Grade on Scenic Easy Routes", "Photos can mislead trail grade and scenic easy routes when the steep, sandy or crowded part is off-camera.", "photos can mislead trail grade", ["scenic easy routes", "off-camera"], "photo evidence", "The article makes image literacy practical.", "Photo evidence board", "decisionBox"],
  ["sources", "map-app-easy-labels", "Map App Easy Labels Need an Official Source Check", "Map app easy labels and official source checks help prevent stale route, access and closure assumptions.", "map app easy labels", ["official source checks", "closure assumptions"], "app label caution", "The piece does not reject apps; it limits their authority.", "Map app source ladder", "timeline"],
  ["sources", "ai-summary-trail-caution", "AI Summary Trail Caution for National Park Planning", "AI summary trail caution and national park planning require source dates, official checks and route-specific judgment.", "AI summary trail caution", ["national park planning", "source dates"], "AI answer caution", "The article gives readers a modern source-check habit.", "AI summary audit", "evidenceChecklist"],
  ["sources", "closure-wording-meaning", "What Closure Wording Means Before Choosing an Easy Trail", "Closure wording and easy trail choices require attention to partial, seasonal, temporary and area-wide notices.", "closure wording", ["easy trail choices", "temporary notices"], "closure interpretation", "The article distinguishes types of closure language.", "Closure wording table", "scenarioTable"],
  ["sources", "park-newsletter-alerts", "Park Newsletter Alerts as a Trail Planning Signal", "Park newsletter alerts and trail planning signals can reveal construction, seasonal access and visitor-use changes.", "park newsletter alerts", ["trail planning signals", "seasonal access"], "alert channel", "The angle adds a source readers often ignore.", "Alert channel checklist", "evidenceChecklist"],
  ["sources", "accessibility-disclaimer-reading", "How to Read an Accessibility Disclaimer on Trail Pages", "Accessibility disclaimer reading and trail pages help separate legal caution, current conditions and usable route facts.", "accessibility disclaimer reading", ["trail pages", "usable route facts"], "disclaimer literacy", "The article turns disclaimers into precise follow-up questions.", "Disclaimer reading board", "decisionBox"],
  ["sources", "responsible-sharing-gentle-trails", "Responsible Sharing of Gentle Trail Recommendations", "Responsible sharing and gentle trail recommendations should include source limits, current checks and access caution.", "responsible sharing", ["gentle trail recommendations", "access caution"], "sharing ethics", "The piece focuses on how readers pass advice to others.", "Responsible sharing checklist", "stepCards"]
];

function escWords(value) {
  return String(value).toLowerCase();
}

function scheduledAt(index) {
  const start = new Date(Date.UTC(2026, 5, 26, 0, 0, 0));
  return new Date(start.getTime() + index * 5 * 60 * 60 * 1000).toISOString();
}

function displayDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function sourceSet(cluster) {
  return sourceProfiles[cluster].map((key) => sourceLibrary[key]);
}

function sectionPlan(row, index) {
  const angle = row.uniqueAngle.toLowerCase();
  const extended = row.extendedKeywords.join(" and ");
  const variants = [
    [
      [`The overlooked decision behind ${row.mainKeyword}`, [
        `The planning problem is not whether ${row.mainKeyword} sounds useful. It is whether it changes a real choice before someone reaches the trailhead. ${row.uniqueAngle}`,
        `${row.mainKeyword} should be read beside ${extended}, not as a standalone trick. That pairing keeps the article grounded in the route's actual job instead of turning it into general travel advice.`
      ]],
      [`Evidence that matters before ${row.decisionMoment.toLowerCase()}`, [
        `The useful evidence is concrete: official alerts, route distance, surface wording, arrival plan, weather exposure and what the least flexible person in the group needs before the route feels reasonable.`,
        `Use the same order every time: stable terrain first, logistics second, current official conditions last. Stable terrain explains the route shape. Logistics explains whether the group can start and finish comfortably. Current conditions decide whether the plan still works today.`
      ]],
      [`The false shortcut in this ${row.searchIntent} search`, [
        `The tempting shortcut is to treat ${row.mainKeyword} as a yes-or-no label. That loses the nuance. A route may pass the first screen and still fail because ${row.extendedKeywords[0]} changes the day.`,
        `Instead of asking whether the route is simply easy, ask what would make it wrong for this group. The answer may be a weather window, a missing restroom, a crowded edge, a weak access claim, a late return or a source that is too old to trust.`
      ]],
      [`A route-level test for ${row.extendedKeywords[0]}`, [
        `Run the field test in writing. Name the route, name the constraint and name the evidence source. That sentence forces the plan to reveal its weakest dependency.`,
        `If the dependency cannot be checked, downgrade the route. Choose a shorter loop, a visitor-center-adjacent walk, a lower-exposure overlook or a route with an obvious turnaround.`
      ]],
      [`When to keep, change or skip the plan`, [
        `A good final choice should be explainable in one sentence: the route fits because ${row.answerClaim.toLowerCase()} If that sentence cannot be defended, the plan needs another pass.`,
        `Keep the route when the signal, the group and the current condition all agree. Change the plan when one of them is uncertain and the consequence would be more than mild inconvenience.`
      ]]
    ],
    [
      [`What ${row.mainKeyword} changes for a cautious visitor`, [
        `A gentle trail can still fail the day if ${row.mainKeyword} is ignored until the group is already committed. The value of this topic is practical: it gives the planner a chance to notice friction while there is still time to choose a different route or a different hour.`,
        `${row.uniqueAngle} That makes this article a separate planning contract, not a variation on a broad easy-trail checklist.`
      ]],
      [`Turn ${row.extendedKeywords[0]} into a concrete yes-or-no signal`, [
        `${row.extendedKeywords[0]} should lead to a visible decision. If the route still looks equally good after you check it, the signal was not specific enough. Look for a measurable clue, a written official note, a route feature shown on the map or a condition that can be confirmed before departure.`,
        `The strongest signals are the ones that change behavior: start earlier, carry more water, choose a smaller loop, call the park, avoid a bridge, skip a late start or use a visitor-center-adjacent option.`
      ]],
      [`Why ${row.extendedKeywords[1]} belongs in the same decision`, [
        `${row.extendedKeywords[1]} is the companion check because it catches a different failure mode. One detail may describe the route itself, while the other describes the day, the group or the source quality behind the route description.`,
        `Reading them together prevents a common planning error: accepting a route because one familiar metric looks comfortable while the actual constraint sits somewhere else.`
      ]],
      [`A better question than "is this easy?"`, [
        `Ask, "what would make this route uncomfortable, confusing or hard to reverse?" That question fits families, older adults, cautious hikers and access-aware visitors better than a generic difficulty label.`,
        `The answer does not need to be dramatic. It might be a missing bench, a long exposed return, a weak shuttle plan, a noisy start, a slanted surface, a photo stop that doubles the outing time or an official alert that changes the route shape.`
      ]],
      [`The conservative decision rule`, [
        `Keep the plan only when the article's main signal is supported by route facts and current official information. If the signal is only implied by photos, reviews or an old map label, treat it as a lead rather than a conclusion.`,
        `This guide does not promise that one route is safe for every visitor. It helps the reader decide whether the plan is strong enough to carry into the park day.`
      ]]
    ],
    [
      [`Start with the moment the plan could break`, [
        `Most route mistakes start before the first step. For this topic, the likely break point is ${row.decisionMoment.toLowerCase()}. If that moment feels vague, the route has not been translated into a real plan yet.`,
        `${row.uniqueAngle} The article's job is to make that hidden break point visible before the group has used up daylight, patience or energy.`
      ]],
      [`Separate stable trail facts from day-of conditions`, [
        `Stable facts include distance, gain, shape, surface clues and the layout of the route. Day-of conditions include closures, smoke, heat, ice, construction, shuttle operations, parking and crowd pressure. ${row.mainKeyword} often sits between those two categories.`,
        `A strong plan says which facts are stable and which ones must be checked again. That distinction keeps the reader from treating old route descriptions as current guidance.`
      ]],
      [`Where ${row.extendedKeywords[0]} can mislead the reader`, [
        `${row.extendedKeywords[0]} can look minor because it does not always change the mileage. But gentle-route planning is often about comfort, reversibility and confidence rather than distance alone.`,
        `If the group depends on predictability, the small feature becomes a large planning signal. It may change which route is best, where the group starts, how much buffer time is needed or whether the backup should be nearby.`
      ]],
      [`Use ${row.extendedKeywords[1]} as the cross-check`, [
        `${row.extendedKeywords[1]} cross-checks the first signal from another angle. If both point in the same direction, the decision is easier. If they conflict, do not average them; name the conflict and choose the more conservative interpretation.`,
        `For example, a route may look physically mild but have a weak return plan. It may have a good surface but poor current-condition evidence. It may be scenic but too exposed for the group's comfort.`
      ]],
      [`A field editor's final pass`, [
        `The final pass is short: what is known, what is inferred and what must still be checked? Known facts can support the shortlist. Inferences should be treated gently. Current official conditions decide the visit.`,
        `The route is ready only when ${row.answerClaim.toLowerCase()} Otherwise, the best article outcome is a changed plan, not a forced recommendation.`
      ]]
    ],
    [
      [`Why this is not just another easy-trail filter`, [
        `The best use of ${row.mainKeyword} is narrow and practical: it should help the reader keep a route, change the timing or choose a backup with less guesswork. ${row.uniqueAngle}`,
        `That is why the article does not try to become a list of trail names. It gives the reader a decision lens that can be applied to any route page, map listing or park-planning note.`
      ]],
      [`The route feature to inspect first`, [
        `Start with ${row.extendedKeywords[0]}. It is the detail most likely to change the first decision because it affects comfort before ambition. If this signal is unknown, do not fill the gap with optimism.`,
        `Check whether the source is official, measured, visible on a current map or only implied by a review. The weaker the source, the smaller the route commitment should be.`
      ]],
      [`The second feature that changes the answer`, [
        `Then check ${row.extendedKeywords[1]}. This second feature matters because a trail can pass the first screen and still be the wrong route for the day.`,
        `A careful planner does not need perfect information. The goal is enough information to avoid the preventable mistake: starting a route whose weak point was visible before departure.`
      ]],
      [`How to compare two routes with this lens`, [
        `When two routes look similar, choose the one with fewer unresolved dependencies. A slightly less famous route can be the better gentle choice if its start, return, surface, shade, source status and turnaround options are easier to explain.`,
        `If both routes have the same weakness, the backup is not a true backup. Pick a fallback that changes the risk profile: lower exposure, simpler access, shorter commitment, clearer signs or closer services.`
      ]],
      [`The answer this article gives and what it leaves out`, [
        `${row.answerClaim} This article does not replace official park alerts or route-specific accessibility confirmation.`,
        `${row.nonOverlapClaim} That boundary matters because high-quality trail planning should reduce confusion rather than collect every possible caution in one place.`
      ]]
    ],
    [
      [`A small signal that can decide the whole walk`, [
        `${row.mainKeyword} may sound like a small planning detail, but small signals often decide whether a gentle route actually feels gentle. The issue is not drama; it is fit.`,
        `${row.uniqueAngle} A route that ignores this signal can still be short, scenic and popular while being the wrong choice for a specific group.`
      ]],
      [`Read the route through the group's least flexible need`, [
        `The fairest planning baseline is the least flexible need in the group: the person with the lowest energy window, the strongest edge concern, the tightest schedule, the greatest sensory load or the most specific access requirement.`,
        `${row.extendedKeywords[0]} should be judged against that need. If it works only for the most flexible person, it is not a group-fit signal.`
      ]],
      [`Check the source before accepting the cue`, [
        `This is where source hierarchy matters. Inspiration can come from photos and reviews, but closures, access notes, weather warnings, pet rules, shuttle changes and route status need official or primary information close to the visit.`,
        `${row.extendedKeywords[1]} is especially important when a route description is old, vague or copied from a summary that may not reflect current conditions.`
      ]],
      [`Build a fallback that solves a different problem`, [
        `A good fallback is not a weaker copy of the original plan. It should remove the dependency that makes the first route uncertain. If the first route depends on timing, choose a flexible route. If it depends on surface, choose a more predictable surface. If it depends on current access details, choose a route closer to services or call the park before going.`,
        `This is the difference between a real backup and a second hope. A real backup gives the group a way to preserve the day.`
      ]],
      [`The practical conclusion for ${row.searchIntent}`, [
        `The practical conclusion is conservative: keep the route when ${row.answerClaim.toLowerCase()} Change the plan when the signal is unknown and the cost of being wrong is meaningful.`,
        `That answer is intentionally narrower than a park-wide recommendation. It gives the reader a defendable next step, which is the point of a high-quality planning article.`
      ]]
    ]
  ];
  return variants[index % variants.length];
}

function visualRows(row) {
  return [
    [row.mainKeyword, `What does the page, map, forecast or official source actually prove about ${row.mainKeyword}?`, "Use this as the controlling signal."],
    [row.extendedKeywords[0], `Could ${row.extendedKeywords[0]} make the route harder, slower or less comfortable than expected?`, "Adjust timing, route length or backup choice."],
    [row.extendedKeywords[1], `Is ${row.extendedKeywords[1]} a stable route fact or a current-condition detail?`, "Stable facts can shortlist; current details must be verified."],
    ["Plan change trigger", `What would make ${row.decisionMoment.toLowerCase()} the wrong moment to continue?`, "Write the no-go trigger before leaving."]
  ];
}

function decisionTool(row) {
  return {
    title: row.toolTitle,
    intro: `Use this article-specific tool when ${row.readerSituation.toLowerCase()}. It turns ${row.mainKeyword} into a practical route decision rather than a loose planning idea.`,
    rows: visualRows(row)
  };
}

function takeaways(row) {
  return [
    `${row.mainKeyword} is useful only when it changes a route, timing or backup decision.`,
    `${row.extendedKeywords[0]} and ${row.extendedKeywords[1]} should be checked before the route feels final.`,
    `The official park source controls current closures, alerts, access details and weather-sensitive choices.`
  ];
}

function makeVisual(row) {
  return {
    type: row.visualType,
    title: `${row.toolTitle}: visual planning block`,
    accent: row.accent,
    accentSoft: row.accentSoft,
    rows: visualRows(row)
  };
}

export const freshPosts = rows.map((item, index) => {
  const [cluster, slug, title, subtitle, mainKeyword, extendedKeywords, searchIntent, uniqueAngle, toolTitle, visualType] = item;
  const meta = clusterMeta[cluster];
  const publishAt = scheduledAt(index);
  const accent = index % 3 === 0 ? "#2563eb" : index % 3 === 1 ? "#b45309" : "#2f7d5c";
  const accentSoft = index % 3 === 0 ? "#eff6ff" : index % 3 === 1 ? "#fffbeb" : "#eefaf3";
  const row = {
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
    accent,
    accentSoft,
    readerSituation: `a reader is using ${escWords(mainKeyword)} to choose or adjust a gentle national park route`,
    decisionMoment: `committing to a route after checking ${extendedKeywords[0]}`,
    answerClaim: `${mainKeyword} works when it is verified against ${extendedKeywords[0]} and ${extendedKeywords[1]}.`,
    nonOverlapClaim: `This article focuses on ${mainKeyword}, not the broader easy-trail topic or sibling route-score articles.`
  };
  return {
    slug,
    title,
    subtitle,
    mainKeyword,
    extendedKeywords,
    keywordRole: "primary editorial query with two route-planning modifiers",
    searchIntent,
    uniqueAngle,
    readerSituation: row.readerSituation,
    decisionCriterion: row.decisionMoment,
    answerClaim: row.answerClaim,
    nonOverlapClaim: row.nonOverlapClaim,
    structureType: ["decision_ladder", "comparison_field", "route_audit", "scenario_branch", "source_hierarchy"][index % 5],
    visualElements: [visualType, "decision-table", "source-notes"],
    scheduledAt: publishAt,
    publishAt,
    cat: meta.cat,
    catLabel: meta.catLabel,
    tint: meta.tint,
    seed: slug,
    author: authors[index % authors.length],
    date: displayDate(publishAt),
    read: `${10 + (index % 5)} min`,
    featured: false,
    dek: subtitle,
    readerJob: `Use ${mainKeyword} with ${extendedKeywords[0]} before choosing a gentle national park route.`,
    decisionTool: decisionTool(row),
    visual: makeVisual(row),
    sections: sectionPlan(row, index),
    takeaways: takeaways(row),
    sources: sourceSet(cluster),
    qualityScore: 92 + (index % 6)
  };
});
