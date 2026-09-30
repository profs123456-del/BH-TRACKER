/* =========================
   ✅ FIREBASE CONFIG
   ========================= */
const firebaseConfig = {
  apiKey: "AIzaSyCN2z5hKD5Tp9Ji2MQhpK3aUe2waoxvKOA",
  authDomain: "klass-x.firebaseapp.com",
  databaseURL: "https://klass-x-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "klass-x",
  storageBucket: "klass-x.firebasestorage.app",
  messagingSenderId: "760760762940",
  appId: "1:760760762940:web:9f8e96a8c041e34ec8b939"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ✅ SERVER TIME SYNC (fix +12 sec issues) */
let serverOffset = 0;
let serverReady = false;

db.ref(".info/serverTimeOffset").on("value", snap => {
  serverOffset = snap.val() || 0;
  serverReady = true;
});

/* =========================
   ✅ SETTINGS
   ========================= */
const HISTORY_LIMIT = 400;     // show last 200 logs
const ADMIN_PIN = "tracker";      // change this

let inputLock = false;
document.addEventListener("focusin", e => { if (e.target.type === "datetime-local") inputLock = true; });
document.addEventListener("focusout", e => { if (e.target.type === "datetime-local") inputLock = false; });

/* =========================
   ✅ BOSS PANEL
   One combined panel (was 4 separate CHANNEL 0-3 panels).
   Which channel a card belongs to is now shown on the card
   itself and controlled via the BOSSES & RESPAWN TIME filter.
   ========================= */
const BOSS_SECTION_KEY = "bosses";

/* Each boss entry has its own independent `respawn` value, in MINUTES.
   This is what makes different respawn intervals per boss possible —
   e.g. Darkswordsman Jr. (respawn:60 = 1 hour) and Etherial Fist
   (respawn:120 = 2 hours) each count down on their own schedule.
   Cheat sheet: 60=1h, 90=1.5h, 120=2h, 180=3h, 240=4h, 360=6h, 480=8h,
   720=12h. When changing a boss's respawn time, update it on ALL of
   that boss's channel lines (CH-0/CH-1/CH-2/CH-3) below, and keep the
   matching entry in BOSS_CATEGORIES (further down) in sync too, since
   that's what drives the respawn-time filter dropdown's label/grouping. */
const bosses = [
  {id:"1",name:"Darkswordsman Jr.",location:"Mystic Peak Hole",fullName:"CH-0 Darkswordsman Jr. - Mystic Peak Hole.",channel:0,respawn:60},
  {id:"2",name:"Darkswordsman Jr.",location:"Phoenix Hole",fullName:"CH-0 Darkswordsman Jr. - Phoenix Hole.",channel:0,respawn:60},
  {id:"3",name:"Darkswordsman Jr.",location:"SG Campus",fullName:"CH-0 Darkswordsman Jr. - SG Campus.",channel:0,respawn:60},
  {id:"4",name:"Darkswordsman Jr.",location:"MP Campus",fullName:"CH-0 Darkswordsman Jr. - MP Campus.",channel:0,respawn:60},
  {id:"5",name:"Darkswordsman Jr.",location:"Phoenix Campus",fullName:"CH-0 Darkswordsman Jr. - Phoenix Campus.",channel:0,respawn:60},
  {id:"6",name:"Etherial Fist",location:"Mystic Peak Hole",fullName:"CH-0 Etherial Fist - Mystic Peak Hole.",channel:0,respawn:120},
  {id:"7",name:"Etherial Fist",location:"Phoenix Hole",fullName:"CH-0 Etherial Fist - Phoenix Hole.",channel:0,respawn:120},
  {id:"8",name:"Etherial Fist",location:"Sacred Gate Hole",fullName:"CH-0 Etherial Fist - Sacred Gate Hole.",channel:0,respawn:120},
  {id:"9",name:"Ninja Knife",location:"Sacred Gate Hole",fullName:"CH-0 Ninja Knife - Sacred Gate HOle.",channel:0,respawn:120},
  {id:"10",name:"Dark Swordsman",location:"Sacred Gate Hole",fullName:"CH-0 Dark Swordsman - Sacred Gate Hole.",channel:0,respawn:120},
  {id:"11",name:"Dark Art Master",location:"Leonine Campus B3",fullName:"CH-0 Dark Art Master - Leonine Campus B3",channel:0,respawn:360},
  {id:"12",name:"Cruel Jupiter",location:"Practicing Yard",fullName:"CH-0 Cruel Jupiter- Practicing Yard",channel:0,respawn:480},
  {id:"13",name:"Darkswordsman Jr.",location:"Mystic Peak Hole",fullName:"CH-1 Darkswordsman Jr. - Mystic Peak Hole.",channel:1,respawn:60},
  {id:"14",name:"Darkswordsman Jr.",location:"Phoenix Hole",fullName:"CH-1 Darkswordsman Jr. - Phoenix Hole.",channel:1,respawn:60},
  {id:"15",name:"Darkswordsman Jr.",location:"SG Campus",fullName:"CH-1 Darkswordsman Jr. - SG Campus.",channel:1,respawn:60},
  {id:"16",name:"Darkswordsman Jr.",location:"MP Campus",fullName:"CH-1 Darkswordsman Jr. - MP Campus.",channel:1,respawn:60},
  {id:"17",name:"Darkswordsman Jr.",location:"Phoenix Campus",fullName:"CH-1 Darkswordsman Jr. - Phoenix Campus.",channel:1,respawn:60},
  {id:"18",name:"Etherial Fist",location:"Mystic Peak Hole",fullName:"CH-1 Etherial Fist - Mystic Peak Hole.",channel:1,respawn:120},
  {id:"19",name:"Etherial Fist",location:"Phoenix Hole",fullName:"CH-1 Etherial Fist - Phoenix Hole.",channel:1,respawn:120},
  {id:"20",name:"Etherial Fist",location:"Sacred Gate Hole",fullName:"CH-1 Etherial Fist - Sacred Gate Hole.",channel:1,respawn:120},
  {id:"21",name:"Ninja Knife",location:"Sacred Gate Hole",fullName:"CH-1 Ninja Knife - Sacred Gate HOle.",channel:1,respawn:120},
  {id:"22",name:"Dark Swordsman",location:"Sacred Gate Hole",fullName:"CH-1 Dark Swordsman - Sacred Gate Hole.",channel:1,respawn:120},
  {id:"23",name:"Dark Art Master",location:"Leonine Campus B3",fullName:"CH-1 Dark Art Master - Leonine Campus B3",channel:1,respawn:360},
  {id:"24",name:"Cruel Jupiter",location:"Practicing Yard",fullName:"CH-0 Cruel Jupiter- Practicing Yard",channel:1,respawn:480},
  {id:"25",name:"Darkswordsman Jr.",location:"Mystic Peak Hole",fullName:"CH-2 Darkswordsman Jr. - Mystic Peak Hole.",channel:2,respawn:60},
  {id:"26",name:"Darkswordsman Jr.",location:"Phoenix Hole",fullName:"CH-2 Darkswordsman Jr. - Phoenix Hole.",channel:2,respawn:60},
  {id:"27",name:"Darkswordsman Jr.",location:"SG Campus",fullName:"CH-2 Darkswordsman Jr. - SG Campus.",channel:2,respawn:60},
  {id:"28",name:"Darkswordsman Jr.",location:"MP Campus",fullName:"CH-2 Darkswordsman Jr. - MP Campus.",channel:2,respawn:60},
  {id:"29",name:"Darkswordsman Jr.",location:"Phoenix Campus",fullName:"CH-2 Darkswordsman Jr. - Phoenix Campus.",channel:2,respawn:60},
  {id:"30",name:"Etherial Fist",location:"Mystic Peak Hole",fullName:"CH-2 Etherial Fist - Mystic Peak Hole.",channel:2,respawn:120},
  {id:"31",name:"Etherial Fist",location:"Phoenix Hole",fullName:"CH-2 Etherial Fist - Phoenix Hole.",channel:2,respawn:120},
  {id:"32",name:"Etherial Fist",location:"Sacred Gate Hole",fullName:"CH-2 Etherial Fist - Sacred Gate Hole.",channel:2,respawn:120},
  {id:"33",name:"Ninja Knife",location:"Sacred Gate Hole",fullName:"CH-2 Ninja Knife - Sacred Gate HOle.",channel:2,respawn:120},
  {id:"34",name:"Dark Swordsman",location:"Sacred Gate Hole",fullName:"CH-2 Dark Swordsman - Sacred Gate Hole.",channel:2,respawn:120},
  {id:"35",name:"Dark Art Master",location:"Leonine Campus B3",fullName:"CH-2 Dark Art Master - Leonine Campus B3",channel:2,respawn:360},
  {id:"36",name:"Cruel Jupiter",location:"Practicing Yard",fullName:"CH-2 Cruel Jupiter- Practicing Yard",channel:2,respawn:480},
  {id:"37",name:"Darkswordsman Jr.",location:"Mystic Peak Hole",fullName:"CH-3 Darkswordsman Jr. - Mystic Peak Hole.",channel:3,respawn:60},
  {id:"38",name:"Darkswordsman Jr.",location:"Phoenix Hole",fullName:"CH-3 Darkswordsman Jr. - Phoenix Hole.",channel:3,respawn:60},
  {id:"39",name:"Darkswordsman Jr.",location:"SG Campus",fullName:"CH-3 Darkswordsman Jr. - SG Campus.",channel:3,respawn:60},
  {id:"40",name:"Darkswordsman Jr.",location:"MP Campus",fullName:"CH-3 Darkswordsman Jr. - MP Campus.",channel:3,respawn:60},
  {id:"41",name:"Darkswordsman Jr.",location:"Phoenix Campus",fullName:"CH-3 Darkswordsman Jr. - Phoenix Campus.",channel:3,respawn:60},
  {id:"42",name:"Etherial Fist",location:"Mystic Peak Hole",fullName:"CH-3 Etherial Fist - Mystic Peak Hole.",channel:3,respawn:120},
  {id:"43",name:"Etherial Fist",location:"Phoenix Hole",fullName:"CH-3 Etherial Fist - Phoenix Hole.",channel:3,respawn:120},
  {id:"44",name:"Etherial Fist",location:"Sacred Gate Hole",fullName:"CH-3 Etherial Fist - Sacred Gate Hole.",channel:3,respawn:120},
  {id:"45",name:"Ninja Knife",location:"Sacred Gate Hole",fullName:"CH-3 Ninja Knife - Sacred Gate HOle.",channel:3,respawn:120},
  {id:"46",name:"Dark Swordsman",location:"Sacred Gate Hole",fullName:"CH-3 Dark Swordsman - Sacred Gate Hole.",channel:3,respawn:120},
  {id:"47",name:"Dark Art Master",location:"Leonine Campus B3",fullName:"CH-3 Dark Art Master - Leonine Campus B3",channel:3,respawn:360},
  {id:"48",name:"Cruel Jupiter",location:"Practicing Yard",fullName:"CH-3 Cruel Jupiter- Practicing Yard",channel:3,respawn:480},
];

/* Map of boss-name substring -> background image file.
   (Replaces the long chain of duplicated if-statements from the original file.) */
const BOSS_BG_MAP = [
  ["Darkswordsman Jr.", "ds jr.png"],
  ["Etherial Fist", "EF.png"],
  ["Ninja Knife", "NK.png"],
  ["Dark Swordsman", "Dark_Swordsman.png"],
  ["Dark Art Master", "dam.png"],
  ["Cruel Jupiter", "cj enhance.png"],
];

/* Per-location art overrides. Checked before BOSS_BG_MAP, so a specific
   school/location can get unique art instead of the species' generic
   background. Keyed by the boss's `location` field. */
const LOCATION_BG_MAP = [
  ["MP Campus", "mystic_bg.png"],
];

/* Per boss+location art (the actual in-game render screenshots).
   Checked BEFORE the generic LOCATION_BG_MAP/BOSS_BG_MAP, since some
   locations (e.g. "Phoenix Hole") are shared by more than one boss
   species and need to resolve to different art per species. */
const BOSS_LOCATION_ART_MAP = [
  { name: "Darkswordsman Jr.", location: "MP Campus",    file: "mpc_dsjr.png" },
  { name: "Darkswordsman Jr.", location: "Mystic Peak Hole",    file: "mph_dsjr.png" },
  { name: "Darkswordsman Jr.", location: "Phoenix Hole",        file: "ph_dsjr.png" },
  { name: "Darkswordsman Jr.", location: "SG Campus",  file: "sgc_dsjr.png" },
  { name: "Darkswordsman Jr.", location: "Phoenix Campus",      file: "pc_dsjr.png" },
  { name: "Etherial Fist",     location: "Mystic Peak Hole",    file: "mph_ef.png" },
  { name: "Etherial Fist",     location: "Phoenix Hole",        file: "ph_ef.png" },
  { name: "Etherial Fist",     location: "Sacred Gate Hole",        file: "sgh_ef1.png" },
  { name: "Ninja Knife",       location: "Sacred Gate Hole",                  file: "Ninja_Knife.png" },
  { name: "Dark Swordsman",       location: "Sacred Gate Hole",                  file: "Dark_Swordsman.png" },
  { name: "Dark Art Master",       location: "Leonine Campus B3",                  file: "dam.png" },
  { name: "Cruel Jupiter",       location: "Practicing Yard",                  file: "cj enhance.png" },
];

function getBossBg(b){
  const name = typeof b === "string" ? b : b.name;
  const location = typeof b === "string" ? b : b.location;

  const exactHit = BOSS_LOCATION_ART_MAP.find(entry =>
    name.includes(entry.name) &&
    (entry.location === null || (location && location.includes(entry.location)))
  );
  if(exactHit) return exactHit.file;

  if(location){
    const locHit = LOCATION_BG_MAP.find(([key]) => location.includes(key));
    if(locHit) return locHit[1];
  }
  const hit = BOSS_BG_MAP.find(([key]) => name.includes(key));
  return hit ? hit[1] : null;
}

/* Map of school/map-name substring -> map icon file. Used to badge each
   boss card (and the hero "next spawn" art) with the icon of the school
   that boss's location belongs to: Mystic Peak, Sacred Gate, or Phoenix.
   Keyed independently of species name/background, since different boss
   species (Darkswordsman Jr., Etherial Fist) can share the same school. */
const MAP_ICON_MAP = [
  ["Mystic Peak", "Mystic_Peak.png"],
  ["MP Campus", "Mystic_Peak.png"],
  ["Sacred Gate Hole", "Sacred_Gate.png"],
  ["SG Campus", "Sacred_Gate.png"],
  ["Phoenix", "Phoenix.png"],
  
];

/* Full scenic background for the "NEXT SPAWN" hero panel, swapped in
   based on which school/location the next boss belongs to. Add more
   entries here as more location backgrounds are provided (Phoenix,
   Sacred Gate, etc). */
const PANEL_BG_MAP = [
  ["Mystic Peak Hole", "Mystic.png"],
  ["MP Campus", "mystic_bg.png"],
  ["Phoenix Hole", "phoenix_hole_BG.png"],
  ["Phoenix Campus", "Phc_bg.png"],
  ["Sacred Gate Hole", "SacredGate_BG.png"],
  ["SG Campus", "SG_Campus_BG.png"],
  ["Practicing Yard", "Practicing_Yard_BG.png"],
];

function getPanelBg(location){
  if(!location) return null;
  const hit = PANEL_BG_MAP.find(([key]) => location.includes(key));
  return hit ? hit[1] : null;
}

function setHeroPanelBg(location){
  const panel = document.getElementById("nextBossPanel");
  if(!panel) return;
  const bg = getPanelBg(location);
  if(bg){
    panel.style.backgroundImage =
      "linear-gradient(135deg, rgba(6,9,20,.88) 0%, rgba(6,9,20,.7) 55%, rgba(6,9,20,.92) 100%), url('" + bg + "')";
    panel.style.backgroundSize = "cover";
    panel.style.backgroundPosition = "center";
  } else {
    panel.style.backgroundImage = "";
  }
}

function getMapIcon(location){
  if(!location) return null;
  const hit = MAP_ICON_MAP.find(([key]) => location.includes(key));
  return hit ? hit[1] : null;
}

/* Clean, compact "Sep 8 · 12:02 PM" style formatting for next-spawn
   timestamps, used instead of the verbose default toLocaleString()
   output (e.g. "9/8/2025, 12:02:37 PM") so the boss cards and hero
   panel read smoother at a glance. */
function formatSpawnTime(date){
  const datePart = date.toLocaleDateString([], {month:"short", day:"numeric"});
  const timePart = date.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit"});
  return `${datePart} · ${timePart}`;
}

/* Map of boss-name substring -> card accent color class (matches the
   colored borders/badges in the KLASS X redesign). */
const BOSS_CAT_CLASS_MAP = [
  ["Darkswordsman Jr.", "cat-dsjr"],
  ["Etherial Fist", "cat-ef"],
  ["Ninja Knife", "cat-nk"],
  ["DARK SWORDSMAN", "cat-ds"],
  ["DARK ART MASTER", "cat-dam"],
];

function getBossCatClass(name){
  const hit = BOSS_CAT_CLASS_MAP.find(([key]) => name.includes(key));
  return hit ? hit[1] : "";
}

const channelsWrapper = document.getElementById("channelsWrapper");
const sound = document.getElementById("sound");
const sortBtn = document.getElementById("sortBtn");
const soundBtn = document.getElementById("soundBtn");
const nextBossTimer = document.getElementById("nextBossTimer");

let autoSort = true;
let alarmOn = true;
let alerted = {};
let warnedTenMin = {};
let warnedFiveMin = {};
let lastBeepSecond = null;

function speak(text){
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    u.volume = 1;
    speechSynthesis.speak(u);
  }catch(e){}
}

/* =========================
   ✅ BUILD BOSS PANEL + CARDS
   ========================= */
function isChannelCollapsed(ch){
  try{ return localStorage.getItem("channel-collapsed-" + ch) === "1"; }catch(e){ return false; }
}

function toggleChannel(ch){
  const section = document.getElementById("channel-" + ch + "-section");
  section.classList.toggle("collapsed");
  try{
    localStorage.setItem("channel-collapsed-" + ch, section.classList.contains("collapsed") ? "1" : "0");
  }catch(e){}
}

(function buildBossSection(){
  const section = document.createElement("div");
  section.className = "channel-section";
  section.id = "channel-" + BOSS_SECTION_KEY + "-section";
  // Collapse/expand no longer has a visible toggle in the redesigned layout,
  // so the boss grid always renders expanded (ignore any stale saved state).

  section.innerHTML = `
    <div class="channel-header" onclick="toggleChannel('${BOSS_SECTION_KEY}')">
      <div class="channel-toggle">▾</div>
      <div class="channel-title">BOSSES</div>
    </div>
    <div class="channel-body" id="channel-${BOSS_SECTION_KEY}-body"></div>
  `;
  channelsWrapper.appendChild(section);
})();

bosses.forEach(b => {
  const card = document.createElement("div");
  const catClass = getBossCatClass(b.name);
  card.className = "card" + (catClass ? " " + catClass : "");
  card.id = b.id + "-card";

  const bg = getBossBg(b);
  const artStyle = bg ? ` style="background-image:url('${bg}')"` : "";
  const mapIcon = getMapIcon(b.location);
  const mapIconHtml = mapIcon ? `<img class="card-map-icon" src="${mapIcon}" alt="${b.location}">` : "";
  const locationHtml = b.location ? `<div class="card-location">${b.location}</div>` : "";

  card.innerHTML = `
    <div class="card-art"${artStyle}>
      <div class="card-drag-handle" title="Drag to trash to reset">🗑️</div>
      ${mapIconHtml}
      <div class="card-art-info">
        <div class="card-name">${b.name}</div>
        ${locationHtml}
        <div class="card-ch-badge ch-${b.channel}">CH ${b.channel}</div>
      </div>
    </div>
    <div class="card-body">
      <div class="timer" id="${b.id}-timer">--:--:--</div>
      <div class="next-label" id="${b.id}-next">Next Spawn: --</div>

      <div class="calendar-panel">
        <div class="calendar-display">Select Date &amp; Time</div>
        <input
        type="datetime-local"
        class="datetime-input"
        id="${b.id}-input"
        step="1">
      </div>

      <button class="set-manual" onclick="manual('${b.id}',${b.respawn})">Set Manual</button>
      <button class="killed-now" onclick="now('${b.id}',${b.respawn})">Killed Now</button>
    </div>
  `;
  document.getElementById("channel-" + BOSS_SECTION_KEY + "-body").appendChild(card);
});

/* =========================
   ✅ BOSS FILTER PANEL
   Lets the user pick which bosses/channels actually
   show up in the tracker grid, organized HOUR -> BOSS -> CHANNEL.
   Choices persist locally per browser.
   ========================= */

/* Boss "families" shown in the filter — each covers every specific
   name that shares that background/category. Rename display names
   here later once the exact per-boss naming is finalized. */
/* This table is ONLY used to power the "BOSSES & RESPAWN TIME" filter
   dropdown (grouping + hour-pill labels) — it does NOT control the
   actual countdown. The real timer always comes from each boss's own
   `respawn` field up in the `bosses` array above. Keep the `respawn`
   value here matching whatever you set on that boss's entries above,
   or the filter pill will show the wrong hour label. */
const BOSS_CATEGORIES = [
  { name: "Darkswordsman Jr.", respawn: 60,   match: ["Darkswordsman Jr."] },
  { name: "Etherial Fist",      respawn: 120, match: ["Etherial Fist"] },
  { name: "Ninja Knife",        respawn: 120, match: ["Ninja Knife"] },
  { name: "Darkswordsman",      respawn: 120, match: ["Dark Swordsman"] },
  { name: "Dark Art Master",    respawn: 360, match: ["Dark Art Master"] },
  { name: "Cruel Jupiter",    respawn: 480, match: ["Cruel Jupiter"] },
];

/* =========================
   ✅ SMART BOSS SEARCH
   Powers the "Search: ch0, ef, mpcamp…" box in the toolbar. Typing
   shorthand tokens (channel, boss abbreviation, map abbreviation),
   separated by spaces, filters the boss card grid directly — every
   token has to match (AND), so "ch0 ef" only shows CH-0 Etherial
   Fist cards. Plain text still works as a normal substring search.
   ========================= */
const BOSS_ABBR = [
  { tokens:["dsjr"],          test:b => b.name === "Darkswordsman Jr." },
  { tokens:["ef"],            test:b => b.name === "Etherial Fist" },
  { tokens:["nk"],            test:b => b.name === "Ninja Knife" },
  { tokens:["ds","dsbig"],    test:b => b.name === "Dark Swordsman" },
  { tokens:["dam"],           test:b => b.name === "Dark Art Master" },
  { tokens:["cj"],            test:b => b.name === "Cruel Jupiter" },
];

const LOCATION_ABBR = [
  { tokens:["mpcamp","mpc"],       test:loc => loc.includes("MP Campus") },
  { tokens:["sgcamp","sgc"],       test:loc => loc.includes("SG Campus") },
  { tokens:["phcamp","phc"],       test:loc => loc.includes("Phoenix Campus") },
  { tokens:["mph","mphole"],       test:loc => loc.includes("Mystic Peak Hole") },
  { tokens:["sgh","sghole"],       test:loc => loc.includes("Sacred Gate Hole") },
  { tokens:["phh","phhole"],       test:loc => loc.includes("Phoenix Hole") },
  { tokens:["py"],                 test:loc => loc.includes("Practicing Yard") },
  { tokens:["lcb3","leo"],         test:loc => loc.includes("Leonine Campus B3") },
];

/* Joins shorthand that people naturally type with a space ("ds jr",
   "ch 0") into single tokens before splitting, so "ch0 ds jr" and
   "ch 0 dsjr" both resolve the same way. */
function normalizeSearchQuery(raw){
  return raw
    .toLowerCase()
    .replace(/ch\s*([0-3])/g, "ch$1")
    .replace(/ds\s*jr\.?/g, "dsjr");
}

function tokenMatchesBoss(token, b){
  const chMatch = token.match(/^ch([0-3])$/);
  if(chMatch) return b.channel === parseInt(chMatch[1], 10);

  const bossHit = BOSS_ABBR.find(entry => entry.tokens.includes(token));
  if(bossHit) return bossHit.test(b);

  const locHit = LOCATION_ABBR.find(entry => entry.tokens.includes(token));
  if(locHit) return locHit.test(b.location || "");

  const haystack = (b.name + " " + (b.location || "") + " ch" + b.channel).toLowerCase();
  return haystack.includes(token);
}

function bossMatchesQuery(b, rawQuery){
  const q = normalizeSearchQuery(rawQuery.trim());
  if(!q) return true;
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every(t => tokenMatchesBoss(t, b));
}

const FILTER_STORAGE_KEY = "boss-filter-v3";

/* Filter model (simple on purpose):
   - bosses   = boss NAMES the user picked. NOTHING picked = NO boss
                cards shown (a fresh visit starts empty; the player sets
                up the bosses they want to track).
   - channels = channels the user picked (none picked = all channels)
   A card shows only if it passes BOTH, so "Darkswordsman Jr." + "CH 0"
   shows just the CH 0 Darkswordsman Jr. cards. */
function loadBossFilter(){
  const empty = { bosses: [], channels: [] };
  try{
    const raw = localStorage.getItem(FILTER_STORAGE_KEY);
    if(!raw) return empty;
    const o = JSON.parse(raw) || {};
    const known = BOSS_CATEGORIES.map(c => c.name);
    return {
      bosses: Array.isArray(o.bosses) ? o.bosses.filter(n => known.includes(n)) : [],
      channels: Array.isArray(o.channels) ? o.channels.filter(n => [0,1,2,3].includes(n)) : [],
    };
  }catch(e){ return empty; }
}

function saveBossFilter(){
  try{ localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(bossFilter)); }catch(e){}
}

let bossFilter = loadBossFilter();

function isBossSelected(catName){ return bossFilter.bosses.includes(catName); }
function isChannelSelected(ch){ return bossFilter.channels.includes(ch); }

function categoryForBoss(b){
  return BOSS_CATEGORIES.find(c => c.match.includes(b.name)) || null;
}

function searchIsActive(){
  const input = document.getElementById("bossSearchInput");
  return !!(input && input.value.trim());
}

function passesBossFilter(b){
  const cat = categoryForBoss(b);
  /* No boss picked = show nothing... except while the player is typing
     in the search box, so a quick search still finds any boss. */
  const bossOk = bossFilter.bosses.length
    ? !!(cat && isBossSelected(cat.name))
    : searchIsActive();
  const chOk = !bossFilter.channels.length || isChannelSelected(b.channel);
  return bossOk && chOk;
}

/* Friendly message shown in place of the grid when no cards are visible. */
function updateBossEmptyState(){
  const grid = document.getElementById("channelsWrapper");
  if(!grid) return;
  let box = document.getElementById("bossEmptyState");
  if(!box){
    box = document.createElement("div");
    box.id = "bossEmptyState";
    box.className = "boss-empty-state";
    grid.parentNode.insertBefore(box, grid);
  }
  const anyVisible = bosses.some(b => {
    const c = document.getElementById(b.id + "-card");
    return c && c.style.display !== "none";
  });
  if(anyVisible){ box.style.display = "none"; return; }

  const nothingPicked = !bossFilter.bosses.length && !searchIsActive();
  box.style.display = "";
  box.innerHTML = nothingPicked
    ? '<div class="bes-icon">🎯</div><div class="bes-title">NO BOSSES SELECTED</div><div class="bes-text">Pick the bosses you want to track and they will appear here.</div><button type="button" class="bes-btn" id="besOpenFilter">CHOOSE BOSSES</button>'
    : '<div class="bes-icon">🔍</div><div class="bes-title">NO BOSSES MATCH</div><div class="bes-text">Try a different search, boss or channel.</div>';
  const btn = document.getElementById("besOpenFilter");
  if(btn) btn.onclick = (e) => {
    e.stopPropagation();
    const dock = document.getElementById("respawnFilterDock");
    if(dock) dock.classList.add("open");
  };
}

/* =========================
   ✅ MAP LOCATION PANEL (left menu)
   When the boss list is narrowed (search box or filter dropdown), the
   panel shows the map of each visible boss location that has map data,
   with that boss's icon pinned on every spawn spot.
   HOW TO ADD MORE: add a location key below (must equal the boss's
   `location` field), point `image` at the map file, and list each boss's
   spots as x/y PERCENTAGES of the map image (0,0 = top-left,
   100,100 = bottom-right).
   ========================= */
const MAP_LOCATION_DATA = {
  "Mystic Peak Hole": {
    image: "mph_loc.png",
    spawns: {
      "Darkswordsman Jr.": [
        {x:13.2, y:49.4},
        {x:10.6, y:76.6},
        {x:56.5, y:81.7},
        {x:36.4, y:88.7},
        {x:35.8, y:98.1},
      ],
      "Etherial Fist": [
        {x:62.0, y:11.1},
        {x:47.2, y:33.8},
        {x:36.5, y:42.5},
        {x:96.0, y:46.5},
        {x:62.2, y:47.6},
      ],
    }
  },
  "SG Campus": {
    image: "sgc_loc.png",
    spawns: {
      "Darkswordsman Jr.": [
          {x:9.4, y:21.8},
          {x:87.0, y:31.4},
          {x:49.4, y:78.6},
          {x:16.0, y:86.2},
        ],
    }
  },
  "MP Campus": {
    image: "mpc_loc.png",
    spawns: {
      "Darkswordsman Jr.": [
          {x:28.0, y:23.8},
          {x:88.3, y:51.4},
          {x:51.8, y:60.7},
          {x:51.6, y:68.0},
          {x:9.5, y:79.0},
          {x:65.7, y:86.7},
        ],
    }
  },
  "Phoenix Campus": {
    image: "pc_loc.png",
    spawns: {
      "Darkswordsman Jr.": [
          {x:63.2, y:32.8},
          {x:24.8, y:34.7},
          {x:55.0, y:56.9},
          {x:92.7, y:66.0},
          {x:56.8, y:73.7},
        ],
    }
  },
  "Phoenix Hole": {
    image: "ph_loc.png",
    spawns: {
      "Darkswordsman Jr.": [
          {x:12.5, y:39.8},
          {x:45.2, y:47.3},
          {x:41.7, y:75.0},
          {x:42.1, y:91.1},
          {x:42.1, y:98.9},
        ],
      "Etherial Fist": [
          {x:42.8, y:11.4},
          {x:42.5, y:25.1},
          {x:74.6, y:25.4},
          {x:44.3, y:41.1},
          {x:64.9, y:47.8},
        ],
    }
  },
  "Sacred Gate Hole": {
    image: "sgh_loc.png",
    spawns: {
      "Etherial Fist": [
          {x:62.2, y:48.4},
          {x:34.9, y:60.2},
          {x:80.4, y:69.4},
          {x:40.0, y:71.2},
          {x:43.4, y:97.7},
        ],
      "Ninja Knife": [
          {x:79.3, y:5.1},
          {x:79.7, y:12.3},
          {x:66.7, y:16.3},
          {x:60.6, y:37.2},
          {x:70.7, y:38.7},
        ],
      "Dark Swordsman": [
          {x:43.7, y:1.1},
          {x:61.7, y:11.5},
          {x:15.9, y:11.9},
          {x:51.4, y:37.2},
          {x:17.4, y:38.1},
        ],
    }
  },
};

/* Own icon table (kept separate so the panel can safely run before the
   Kill History icon table further down the file has been created). */
const MAP_PIN_ICONS = {
  "Darkswordsman Jr.": "dsicon.png",
  "Etherial Fist": "ef.png",
  "Ninja Knife": "nk.png",
  "Dark Swordsman": "darkswordsman.png",
};

let activeMapLocation = null;
let lastMapSignature = "";

function buildMapStage(locKey, bossNames, big){
  const data = MAP_LOCATION_DATA[locKey];
  const stage = document.createElement("div");
  stage.className = "map-stage" + (big ? " big" : "");

  const img = document.createElement("img");
  img.className = "map-stage-img";
  img.src = data.image;
  img.alt = locKey + " map";
  img.draggable = false;
  stage.appendChild(img);

  bossNames.forEach(name => {
    (data.spawns[name] || []).forEach((pt, i) => {
      const pin = document.createElement("div");
      pin.className = "map-pin";
      pin.style.left = pt.x + "%";
      pin.style.top = pt.y + "%";
      pin.title = name + " — spot " + (i + 1);
      const icon = MAP_PIN_ICONS[name];
      if(icon){
        const pi = document.createElement("img");
        pi.src = icon;
        pi.alt = name;
        pi.draggable = false;
        pi.onerror = () => { pi.remove(); pin.textContent = name.charAt(0); };
        pin.appendChild(pi);
      } else {
        pin.textContent = name.charAt(0);
      }
      stage.appendChild(pin);
    });
  });
  return stage;
}

function openMapLightbox(locKey, bossNames){
  const overlay = document.createElement("div");
  overlay.className = "map-lightbox";
  overlay.innerHTML = '<div class="map-lightbox-inner"><button class="map-lightbox-close" aria-label="Close">&times;</button><div class="map-lightbox-title"></div></div>';
  overlay.querySelector(".map-lightbox-title").textContent = locKey.toUpperCase();
  overlay.querySelector(".map-lightbox-inner").appendChild(buildMapStage(locKey, bossNames, true));
  const close = () => { overlay.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = e => { if(e.key === "Escape") close(); };
  overlay.addEventListener("click", e => { if(e.target === overlay || e.target.classList.contains("map-lightbox-close")) close(); });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(overlay);
}

function updateMapPanel(){
  const body = document.getElementById("mapPanelBody");
  const tabs = document.getElementById("mapTabs");
  if(!body || !tabs) return;

  const visible = bosses.filter(b => {
    const card = document.getElementById(b.id + "-card");
    return card && card.style.display !== "none";
  });
  const narrowed = visible.length > 0 && visible.length < bosses.length;

  // location -> ordered list of visible boss names that live there
  const groups = {};
  if(narrowed){
    visible.forEach(b => {
      if(!MAP_LOCATION_DATA[b.location]) return;
      const g = groups[b.location] = groups[b.location] || [];
      if(!g.includes(b.name)) g.push(b.name);
    });
  }
  const locs = Object.keys(groups);

  const signature = JSON.stringify(groups) + "|" + activeMapLocation;
  if(signature === lastMapSignature) return;

  tabs.innerHTML = "";
  body.innerHTML = "";

  if(!locs.length){
    activeMapLocation = null;
    lastMapSignature = JSON.stringify(groups) + "|null";
    const msg = document.createElement("div");
    msg.className = "map-empty";
    msg.innerHTML = narrowed
      ? "NO MAP FOR<br>THIS FILTER YET"
      : "FILTER A BOSS<br>TO SEE ITS<br>MAP LOCATION";
    body.appendChild(msg);
    return;
  }

  if(!locs.includes(activeMapLocation)) activeMapLocation = locs[0];
  lastMapSignature = JSON.stringify(groups) + "|" + activeMapLocation;

  if(locs.length > 1){
    locs.forEach(loc => {
      const t = document.createElement("button");
      t.type = "button";
      t.className = "map-tab" + (loc === activeMapLocation ? " active" : "");
      t.textContent = loc;
      t.onclick = () => { activeMapLocation = loc; updateMapPanel(); };
      tabs.appendChild(t);
    });
  }

  const names = groups[activeMapLocation];
  const label = document.createElement("div");
  label.className = "map-loc-label";
  label.textContent = activeMapLocation;
  body.appendChild(label);

  const stage = buildMapStage(activeMapLocation, names, false);
  stage.title = "Click to enlarge";
  stage.onclick = () => openMapLightbox(activeMapLocation, names);
  body.appendChild(stage);

  const data = MAP_LOCATION_DATA[activeMapLocation];
  names.forEach(n => {
    const count = (data.spawns[n] || []).length;
    const row = document.createElement("div");
    row.className = "map-legend-row";
    row.textContent = n + " · " + (count ? count + " spot" + (count > 1 ? "s" : "") : "spots not mapped yet");
    body.appendChild(row);
  });
}

function applyBossVisibility(){
  bosses.forEach(b => {
    const visible = passesBossFilter(b);
    const card = document.getElementById(b.id + "-card");
    if(card){
      const searchHidden = card.dataset.searchHidden === "1";
      card.style.display = (visible && !searchHidden) ? "" : "none";
    }
  });
  updateBossEmptyState();
  updateMapPanel();
}

/* Live search — filters the boss CARD GRID itself as you type (see
   the BOSS_ABBR/LOCATION_ABBR tables above for supported shorthand). */
(function initBossCardSearch(){
  const input = document.getElementById("bossSearchInput");
  if(!input) return;
  input.addEventListener("input", () => {
    const q = input.value;
    bosses.forEach(b => {
      const card = document.getElementById(b.id + "-card");
      if(!card) return;
      card.dataset.searchHidden = bossMatchesQuery(b, q) ? "" : "1";
    });
    applyBossVisibility();
  });
})();

/* Fixed set of respawn brackets the tracker supports (in hours).
   Any BOSS_CATEGORIES entry using one of these (respawn in minutes,
   e.g. 60 -> 1H, 360 -> 6H) lands in the matching pill / row below
   automatically. Brackets with no bosses yet show as a dimmed pill. */
const RESPAWN_HOURS = [1,2,3,4,5,6,7,8,10,12];

function hourLabel(minutes){ return (minutes / 60) + "H"; }

function catsForHour(hr){ return BOSS_CATEGORIES.filter(c => c.respawn === hr * 60); }

/* Click a spawn-time chip: select every boss in that bracket, or
   clear them if they're all already selected. */
function toggleHourBracket(hr){
  const names = catsForHour(hr).map(c => c.name);
  if(!names.length) return;
  const allOn = names.every(isBossSelected);
  bossFilter.bosses = allOn
    ? bossFilter.bosses.filter(n => !names.includes(n))
    : [...new Set([...bossFilter.bosses, ...names])];
  onFilterChanged();
}

function toggleBossName(name){
  bossFilter.bosses = isBossSelected(name)
    ? bossFilter.bosses.filter(n => n !== name)
    : [...bossFilter.bosses, name];
  onFilterChanged();
}

function toggleChannelFilter(ch){
  bossFilter.channels = isChannelSelected(ch)
    ? bossFilter.channels.filter(n => n !== ch)
    : [...bossFilter.channels, ch];
  onFilterChanged();
}

function clearBossFilter(){      // HIDE ALL: back to the empty start state
  bossFilter = { bosses: [], channels: [] };
  onFilterChanged();
}

function selectAllBosses(){      // SHOW ALL: every boss, every channel
  bossFilter = { bosses: BOSS_CATEGORIES.map(c => c.name), channels: [] };
  onFilterChanged();
}

function onFilterChanged(){
  saveBossFilter();
  syncFilterUI();
  applyBossVisibility();
}

/* Paint every filter control (top hour pills, channel pills, and the
   SPAWN TIME / BOSS rows) from the current bossFilter state. */
function syncFilterUI(){
  document.querySelectorAll("#hourPillRow .hour-pill:not(.empty)").forEach(pill => {
    const names = catsForHour(parseInt(pill.textContent, 10)).map(c => c.name);
    pill.classList.toggle("active", names.length > 0 && names.every(isBossSelected));
  });
  document.querySelectorAll("#channelPillRow .channel-pill").forEach(pill => {
    pill.classList.toggle("active", isChannelSelected(parseInt(pill.textContent.replace("CH ", ""), 10)));
  });
  document.querySelectorAll("#bossFilterList .spawn-hour-chip").forEach(chip => {
    const names = catsForHour(parseInt(chip.dataset.hour, 10)).map(c => c.name);
    chip.classList.toggle("active", names.length > 0 && names.every(isBossSelected));
  });
  document.querySelectorAll("#bossFilterList .boss-chip").forEach(chip => {
    chip.classList.toggle("active", isBossSelected(chip.dataset.cat));
  });

  /* Dropdown button label reflects what is being tracked. */
  const lbl = document.querySelector("#bossFilterToggleBtn span:nth-child(2)");
  if(lbl){
    const n = bossFilter.bosses.length;
    let text = "SELECT BOSSES";
    if(n){
      text = (n === BOSS_CATEGORIES.length) ? "ALL BOSSES" : n + (n === 1 ? " BOSS" : " BOSSES");
      if(bossFilter.channels.length) text += " · CH " + [...bossFilter.channels].sort().join(",");
    }
    lbl.textContent = text;
  }
}

(function buildHourPillRow(){
  const row = document.getElementById("hourPillRow");
  if(!row) return;

  RESPAWN_HOURS.forEach(hr => {
    const has = catsForHour(hr).length > 0;
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "hour-pill" + (has ? "" : " empty");
    pill.textContent = hr + "H";
    if(has){
      pill.onclick = () => toggleHourBracket(hr);
    } else {
      pill.disabled = true;
      pill.title = "No bosses assigned to this respawn time yet";
    }
    row.appendChild(pill);
  });
})();

(function buildChannelPillRow(){
  const row = document.getElementById("channelPillRow");
  if(!row) return;

  [0,1,2,3].forEach(ch => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "channel-pill";
    pill.textContent = "CH " + ch;
    pill.onclick = () => toggleChannelFilter(ch);
    row.appendChild(pill);
  });
})();

/* SPAWN TIME [ 1H ]   BOSS: [Darkswordsman Jr.] [...]
   One row per respawn time, generated from BOSS_CATEGORIES — add a
   boss there and it shows up in the right row by itself. */
(function buildBossFilterPanel(){
  const list = document.getElementById("bossFilterList");
  if(!list) return;

  const hint = document.createElement("div");
  hint.className = "filter-hint";
  hint.textContent = "Tap the bosses you want to track, then pick channels above to narrow them (no channel picked = all channels). Nothing selected = no bosses shown.";
  list.appendChild(hint);

  const hours = [...new Set(BOSS_CATEGORIES.map(c => c.respawn))].sort((a,b) => a - b);

  hours.forEach(minutes => {
    const hr = minutes / 60;
    const rowEl = document.createElement("div");
    rowEl.className = "spawn-row";

    const head = document.createElement("div");
    head.className = "spawn-row-head";
    head.innerHTML = '<span class="spawn-row-label">SPAWN TIME</span>';
    const hourChip = document.createElement("button");
    hourChip.type = "button";
    hourChip.className = "spawn-hour-chip";
    hourChip.dataset.hour = hr;
    hourChip.textContent = hourLabel(minutes);
    hourChip.title = "Select every " + hourLabel(minutes) + " boss";
    hourChip.onclick = () => toggleHourBracket(hr);
    head.appendChild(hourChip);

    const bossLine = document.createElement("div");
    bossLine.className = "spawn-row-bosses";
    bossLine.innerHTML = '<span class="spawn-row-label">BOSS :</span>';
    catsForHour(hr).forEach(cat => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "boss-chip";
      chip.dataset.cat = cat.name;
      chip.textContent = cat.name;
      chip.onclick = () => toggleBossName(cat.name);
      bossLine.appendChild(chip);
    });

    rowEl.appendChild(head);
    rowEl.appendChild(bossLine);
    list.appendChild(rowEl);
  });

  const showAllBtn = document.getElementById("filterShowAllBtn");
  const hideAllBtn = document.getElementById("filterHideAllBtn");
  if(showAllBtn) showAllBtn.onclick = selectAllBosses;
  if(hideAllBtn) hideAllBtn.onclick = clearBossFilter;

  syncFilterUI();
  applyBossVisibility();
})();

/* =========================
   ✅ RESPAWN FILTER DOCK (top-right dropdown)
   ========================= */
(function wireFilterDock(){
  const dock = document.getElementById("respawnFilterDock");
  const toggleBtn = document.getElementById("bossFilterToggleBtn");
  if(!dock || !toggleBtn) return;

  toggleBtn.onclick = (e) => {
    e.stopPropagation();
    dock.classList.toggle("open");
  };

  document.addEventListener("click", (e) => {
    if(dock.classList.contains("open") && !dock.contains(e.target)){
      dock.classList.remove("open");
    }
  });
})();

/* =========================
   ✅ TOP BUTTONS
   ========================= */
sortBtn.onclick = () => {
  autoSort = !autoSort;
  sortBtn.textContent = "AUTO SORT: " + (autoSort ? "ON" : "OFF");
  sortBtn.classList.toggle("off", !autoSort);
};

soundBtn.onclick = () => {
  alarmOn = !alarmOn;
  soundBtn.textContent = "ALARM: " + (alarmOn ? "ON" : "SILENT");
  soundBtn.classList.toggle("off", !alarmOn);
};

/* =========================
   ✅ HISTORY
   ========================= */
/* Pull "Boss Name" and "Location" back out of a history entry's raw
   fullName string (e.g. "CH-0 Darkswordsman Jr. - Mystic Peak Hole.").
   Falls back gracefully for older/odd-format entries that don't match
   the "Name - Location" pattern, so history never shows a blank icon
   or a garbled string with no explanation. */
/* Close-up "icon" art for the Kill History avatars specifically.
   The boss-card art (BOSS_LOCATION_ART_MAP / BOSS_BG_MAP) is a full
   scene shot, which crops awkwardly into a small 44px circle — these
   are tighter portrait crops chosen to read clearly at avatar size. */
const BOSS_HISTORY_ICON_MAP = [
  ["Etherial Fist", "ef.png"],
  ["Darkswordsman Jr.", "dsicon.png"],
  ["Ninja Knife", "nk.png"],
  ["Dark Swordsman", "darkswordsman.png"],
];

function getHistoryIcon(name){
  const hit = BOSS_HISTORY_ICON_MAP.find(([key]) => name.includes(key));
  return hit ? hit[1] : null;
}

function parseHistoryEntry(raw){
  const chMatch = raw.match(/CH-(\d+)/);
  const ch = chMatch ? chMatch[1] : "?";

  let rest = raw.replace(/^CH-\d+\s*/, "").trim();
  rest = rest.replace(/\.+$/, "");

  const sepIdx = rest.indexOf(" - ");
  let bossName, location;
  if(sepIdx !== -1){
    bossName = rest.slice(0, sepIdx).trim();
    location = rest.slice(sepIdx + 3).trim();
  } else {
    bossName = rest;
    location = "";
  }

  const bg = getHistoryIcon(bossName) || getBossBg({name: bossName, location});
  const mapIcon = location ? getMapIcon(location) : null;

  return {ch, bossName, location, bg, mapIcon};
}

/* Full unfiltered set from the last Firebase read, kept around so the
   search box can re-filter locally without a fresh fetch every keystroke. */
let historyItemsCache = [];

function renderHistory(items){
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  if(!items || items.length === 0){
    const empty = document.createElement("div");
    empty.className = "history-item";
    empty.textContent = historyItemsCache.length
      ? "No matches found."
      : "No logs yet. Click Killed Now.";
    historyList.appendChild(empty);
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";

    const {ch, bossName, location, bg, mapIcon} = parseHistoryEntry(item.name);
    const avatarStyle = bg ? ` style="background-image:url('${bg}')"` : "";
    const avatarClass = bg ? "history-avatar" : "history-avatar history-avatar--fallback";
    const mapBadge = mapIcon ? `<img class="history-map-badge" src="${mapIcon}" alt="" onerror="this.style.display='none'">` : "";
    const locationRow = location
      ? `<div class="history-location" title="${location}"><span class="rf-icon">📍</span>${location}</div>`
      : `<div class="history-location history-location--unknown"><span class="rf-icon">❓</span>Unknown location</div>`;
    const killedDate = new Date(item.killedAt);

    div.innerHTML = `
      <div class="history-avatar-wrap">
        <div class="${avatarClass}"${avatarStyle}></div>
        ${mapBadge}
      </div>
      <div class="history-info">
        <div class="history-name" title="${bossName}">${bossName}</div>
        ${locationRow}
        <div class="history-ch">CH ${ch}</div>
      </div>
      <div class="history-date">
        ${killedDate.toLocaleDateString([], {month:"short", day:"numeric"})}<br>
        ${killedDate.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit"})}
      </div>
    `;
    historyList.appendChild(div);
  });
}

/* Filters historyItemsCache against the search box (boss name, location,
   or "ch2"/"ch 2" style channel shorthand) and re-renders the list. */
function applyHistorySearch(){
  const input = document.getElementById("historySearchInput");
  const q = (input && input.value || "").trim().toLowerCase();

  if(!q){
    renderHistory(historyItemsCache);
    return;
  }

  const chQuery = q.match(/^ch\s*(\d+)$/);

  const filtered = historyItemsCache.filter(item => {
    const {ch, bossName, location} = parseHistoryEntry(item.name);
    if(chQuery) return ch === chQuery[1];
    const haystack = (bossName + " " + location + " ch" + ch).toLowerCase();
    return haystack.includes(q);
  });

  renderHistory(filtered);
}

function setHistoryData(items){
  historyItemsCache = items || [];
  applyHistorySearch();
}

(function initHistorySearch(){
  const input = document.getElementById("historySearchInput");
  if(!input) return;
  input.addEventListener("input", applyHistorySearch);
})();

function refreshHistory(){
  db.ref("history").limitToLast(HISTORY_LIMIT).once("value").then(snapshot => {
    const data = snapshot.val();
    if(!data) return setHistoryData([]);
    const items = Object.values(data).sort((a,b) => b.killedAt - a.killedAt);
    setHistoryData(items);
  });
}

function clearHistory(){
  const pinInput = document.getElementById("pinInput");
  const pinError = document.getElementById("pinError");
  const pin = (pinInput.value || "").trim();

  if(pin !== ADMIN_PIN){
    pinError.style.color = "#a13d2b";
    pinError.textContent = "❌ Wrong PIN";
    return;
  }

  if(!confirm("Clear ALL kill history?")) return;

  db.ref("history").remove().then(() => {
    pinError.style.color = "#8fae6a";
    pinError.textContent = "✅ History Cleared!";
    pinInput.value = "";
  }).catch(() => {
    pinError.style.color = "#a13d2b";
    pinError.textContent = "❌ Error clearing history";
  });
}

db.ref("history").limitToLast(HISTORY_LIMIT).on("value", snapshot => {
  const data = snapshot.val();
  if(!data) return setHistoryData([]);
  const items = Object.values(data).sort((a,b) => b.killedAt - a.killedAt);
  setHistoryData(items);
});

/* =========================
   ✅ TIMER STORAGE (FIREBASE)
   ========================= */
/* Cache the last known timer data locally so that on a page refresh,
   the tracker immediately shows the last real state instead of
   flashing the empty "---" / "--:--:--" placeholder while waiting for
   Firebase to respond over the network. Firebase remains the source
   of truth — this cache is only used as an instant first paint, and
   gets overwritten the moment Firebase's real "value" event arrives. */
const BOSSES_CACHE_KEY = "cached-bosses-v1";

function loadCachedBosses(){
  try{
    const raw = localStorage.getItem(BOSSES_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){ return {}; }
}

function saveCachedBosses(data){
  try{ localStorage.setItem(BOSSES_CACHE_KEY, JSON.stringify(data)); }catch(e){}
}

let firebaseBosses = loadCachedBosses();

db.ref("bosses").on("value", snapshot => {
  firebaseBosses = snapshot.val() || {};
  saveCachedBosses(firebaseBosses);
});

/* =========================
   ✅ SET NEXT (MANUAL)
   ========================= */
function setNext(id,mins,k){
  const nextTime = k.getTime() + mins * 60000;
  db.ref("bosses/" + id).set(nextTime);
  alerted[id] = false;
  warnedTenMin[id] = false;
}

/* =========================
   ✅ BUTTON ACTIONS
   ========================= */
function now(id,mins){
  // prevent clicking before server time is ready
  if(!serverReady){
    const pinError = document.getElementById("pinError");
    if(pinError){
      pinError.style.color = "#d9b878";
      pinError.textContent = "⏳ Wait 1 second (syncing server time)...";
      setTimeout(() => { pinError.textContent = ""; }, 1500);
    }
    return;
  }

  const serverNow = Date.now() + serverOffset;
  const nextTime = serverNow + mins * 60000;

  db.ref("bosses/" + id).set(nextTime);
  alerted[id] = false;
  warnedTenMin[id] = false;

  const boss = bosses.find(b => b.id === id);
  db.ref("history").push({
    bossId: id,
    name: boss ? boss.fullName : ("BOSS " + id),
    killedAt: serverNow
  });
}

function manual(id,mins){
  const v = document.getElementById(id + "-input").value;
  if(!v) return alert("Enter time");
  setNext(id, mins, new Date(v));
}

function resetAll(){
  if(!confirm("Reset ALL timers?")) return;
  alerted = {};
  warnedTenMin = {};
  lastBeepSecond = null;
  db.ref("bosses").remove();
}

/* Resets a single boss back to its original "no time set" state —
   used when a card is dragged onto the trash bin. */
function resetBoss(id){
  db.ref("bosses/" + id).remove();
  alerted[id] = false;
  warnedTenMin[id] = false;
  warnedFiveMin[id] = false;
  const input = document.getElementById(id + "-input");
  if(input) input.value = "";
}

/* =========================
   ✅ MAIN UPDATE LOOP
   ========================= */
function update(){
  if(inputLock) return;
  let soonest = null, soonId = null;
  const sortData = [];

  bosses.forEach(b => {
    const t = firebaseBosses[b.id];
    const timer = document.getElementById(b.id + "-timer");
    const next = document.getElementById(b.id + "-next");
    const card = document.getElementById(b.id + "-card");
    card.classList.remove("next");

    if (Object.keys(firebaseBosses).length === 0) {
      document.getElementById("nextBossName").textContent = "---";
      const nextBossLocationEmpty = document.getElementById("nextBossLocation");
      if(nextBossLocationEmpty) nextBossLocationEmpty.textContent = "";
      document.getElementById("nextBossTimer").textContent = "--:--:--";
      document.getElementById("nextBossTime").textContent = "---";
      document.getElementById("nextBossTimer").classList.remove("danger");
      const chBadge = document.getElementById("nextBossChBadge");
      if(chBadge){
        chBadge.innerHTML = '<span class="rf-icon">⏱</span> CH --';
        chBadge.className = "hero-ch-badge";
      }
      const bar = document.getElementById("heroProgressBar");
      if(bar) bar.style.width = "0%";
      const heroArt = document.getElementById("heroArt");
      if(heroArt) heroArt.style.backgroundImage = "none";
      const heroMapIconEmpty = document.getElementById("heroMapIcon");
      if(heroMapIconEmpty) heroMapIconEmpty.style.display = "none";
      setHeroPanelBg(null);
    }

    if (!t) {
      timer.textContent = "--:--:--";
      timer.classList.remove("danger");
      next.textContent = "Next Spawn: --";
      sortData.push({ id: b.id, time: Infinity });
      return;
    }

    // ✅ server-time countdown
    const nowServer = Date.now() + serverOffset;
    const d = t - nowServer;

    if(d <= 0){
      timer.textContent = "SPAWNED!";
      timer.classList.add("danger");
      next.textContent = "NOW";
      warnedTenMin[b.id] = false;
      warnedFiveMin[b.id] = false;
      if(!alerted[b.id]){
        if(alarmOn){
          sound.currentTime = 0;
          sound.play().catch(() => {});
          speak(b.name + " has spawned at " + b.location + ", channel " + b.channel);
        }
        alerted[b.id] = true;
      }
      sortData.push({id:b.id, time:0});
      return;
    }

    if(d <= 10*60*1000 && d > 9*60*1000 && !warnedTenMin[b.id]){
      if(alarmOn){
        sound.currentTime = 0;
        sound.play().catch(() => {});
        setTimeout(() => {
          speak(b.name + " will spawn in 10 minutes at " + b.location + ", channel " + b.channel);
        }, 250);
      }
      warnedTenMin[b.id] = true;
    }

    if(d > 10*60*1000){
      warnedTenMin[b.id] = false;
    }

    if(d <= 5*60*1000 && d > 4*60*1000 && !warnedFiveMin[b.id]){
      if(alarmOn){
        sound.currentTime = 0;
        sound.play().catch(() => {});
        setTimeout(() => {
          speak(b.name + " will spawn in 5 minutes at " + b.location + ", channel " + b.channel);
        }, 250);
      }
      warnedFiveMin[b.id] = true;
    }

    if(d > 5*60*1000){
      warnedFiveMin[b.id] = false;
    }

    sortData.push({id:b.id, time:d});
    if(soonest === null || d < soonest){ soonest = d; soonId = b.id; }

    const hh = String(Math.floor(d/3600000)).padStart(2,"0");
    const mm = String(Math.floor(d%3600000/60000)).padStart(2,"0");
    const ss = String(Math.floor(d%60000/1000)).padStart(2,"0");
    timer.textContent = `${hh}:${mm}:${ss}`;
    next.textContent = "Next: " + formatSpawnTime(new Date(t));

    // This boss's own card turns red once IT is under 5 minutes away —
    // independent of whichever boss is soonest overall in the hero panel.
    if(d <= 5*60*1000){
      timer.classList.add("danger");
    }else{
      timer.classList.remove("danger");
    }
  });

  if(autoSort){
    sortData.sort((a,b) => a.time - b.time);
    const body = document.getElementById("channel-" + BOSS_SECTION_KEY + "-body");
    if(body) sortData.forEach(o => body.appendChild(document.getElementById(o.id + "-card")));
  }

  if(soonId){
    document.getElementById(soonId + "-card").classList.add("next");
    const b = bosses.find(x => x.id === soonId);
    document.getElementById("nextBossName").textContent = b.name;
    const nextBossLocationEl = document.getElementById("nextBossLocation");
    if(nextBossLocationEl) nextBossLocationEl.textContent = b.location || "";
    setHeroPanelBg(b.location);
    document.getElementById("nextBossTimer").textContent = document.getElementById(soonId + "-timer").textContent;

    const chBadge = document.getElementById("nextBossChBadge");
    if(chBadge){
      chBadge.innerHTML = '<span class="rf-icon">⏱</span> CH ' + b.channel;
      chBadge.className = "hero-ch-badge ch-" + b.channel;
    }

    const heroArt = document.getElementById("heroArt");
    if(heroArt){
      const heroBg = getBossBg(b);
      heroArt.style.backgroundImage = heroBg ? `url('${heroBg}')` : "none";
    }

    const heroMapIcon = document.getElementById("heroMapIcon");
    if(heroMapIcon){
      const icon = getMapIcon(b.location);
      if(icon){
        heroMapIcon.src = icon;
        heroMapIcon.style.display = "block";
      }else{
        heroMapIcon.removeAttribute("src");
        heroMapIcon.style.display = "none";
      }
    }

    const bar = document.getElementById("heroProgressBar");
    if(bar){
      const totalMs = b.respawn * 60000;
      const pct = totalMs > 0 ? Math.max(0, Math.min(100, (1 - (soonest / totalMs)) * 100)) : 0;
      bar.style.width = pct + "%";
    }

    const soonTs = firebaseBosses[soonId];
    document.getElementById("nextBossTime").textContent = soonTs
      ? ("Spawns at: " + formatSpawnTime(new Date(soonTs)))
      : "---";

    if(soonest <= 10000 && soonest > 0){
      const sec = Math.ceil(soonest/1000);
      if(lastBeepSecond !== sec){
        if(alarmOn){
          sound.currentTime = 0;
          sound.play().catch(() => {});
        }
        lastBeepSecond = sec;
      }
    }else{ lastBeepSecond = null; }

    if(soonest <= 5*60*1000){
      nextBossTimer.classList.add("danger");
    }else{
      nextBossTimer.classList.remove("danger");
    }
  }
}

setInterval(update, 1000);

/* =========================
   ✅ DRAG-TO-SCROLL (channels wrapper)
   Lets users click+drag left/right to pan between
   channel panels instead of needing a scrollbar —
   handy when the browser window is narrow.
   ========================= */
(function initDragScroll(){
  const wrapper = channelsWrapper;
  if(!wrapper) return;

  const DRAG_THRESHOLD = 6; // px of movement before it counts as a drag, not a click
  let isPointerDown = false;
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  function isFormControl(el){
    return el.closest("input, textarea, select, button, .datetime-input, .card-drag-handle");
  }

  wrapper.addEventListener("mousedown", (e) => {
    // Only left-click drags
    if(e.button !== 0) return;

    // If the click started on a button/input/etc, don't track it as a
    // potential drag at all — otherwise normal mouse jitter while clicking
    // (very common with a real mouse) can cross the drag threshold and
    // cause the click to be swallowed by endDrag()'s suppressClick logic,
    // making buttons like "Killed Now" seem to randomly not respond.
    if(isFormControl(e.target)) return;

    isPointerDown = true;
    isDragging = false;
    startX = e.pageX;
    startScrollLeft = wrapper.scrollLeft;

    // Stop the browser's native text-selection drag from starting at all.
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if(!isPointerDown) return;
    const dx = e.pageX - startX;

    if(!isDragging && Math.abs(dx) > DRAG_THRESHOLD){
      isDragging = true;
      wrapper.classList.add("dragging");
    }

    if(isDragging){
      e.preventDefault();
      wrapper.scrollLeft = startScrollLeft - dx;
    }
  });

  function endDrag(){
    if(isDragging){
      wrapper.classList.remove("dragging");
      // Swallow the click that follows a drag so buttons/toggles
      // underneath the cursor don't accidentally fire.
      const suppressClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        window.removeEventListener("click", suppressClick, true);
      };
      window.addEventListener("click", suppressClick, true);
      setTimeout(() => window.removeEventListener("click", suppressClick, true), 0);
    }
    isPointerDown = false;
    isDragging = false;
  }

  window.addEventListener("mouseup", endDrag);
  wrapper.addEventListener("mouseleave", (e) => {
    // Only end the drag if the mouse actually left the window area over the wrapper edge,
    // not just moved over a child element (mouseleave on wrapper fires for children too
    // only if relatedTarget is outside wrapper).
    if(!wrapper.contains(e.relatedTarget)) endDrag();
  });

  /* =========================
     ✅ TOUCH SWIPE — same click-and-drag panning, for touchscreens.
     Horizontal swipes pan between channels (like the mouse drag above);
     vertical swipes are left alone so the page/panels scroll natively
     up and down as expected.
     ========================= */
  let touchStartX = 0;
  let touchStartY = 0;
  let touchScrollLeft = 0;
  let touchAxis = null; // "x" | "y" | null (undecided)

  wrapper.addEventListener("touchstart", (e) => {
    if(isFormControl(e.target)) return;
    const t = e.touches[0];
    touchStartX = t.pageX;
    touchStartY = t.pageY;
    touchScrollLeft = wrapper.scrollLeft;
    touchAxis = null;
  }, { passive: true });

  wrapper.addEventListener("touchmove", (e) => {
    if(!e.touches.length) return;
    const t = e.touches[0];
    const dx = t.pageX - touchStartX;
    const dy = t.pageY - touchStartY;

    if(!touchAxis){
      if(Math.abs(dx) < 8 && Math.abs(dy) < 8) return; // not enough movement yet
      touchAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if(touchAxis === "x") wrapper.classList.add("dragging");
    }

    if(touchAxis === "x"){
      // Horizontal swipe: pan the channels, and stop the page from
      // scrolling vertically underneath the gesture.
      e.preventDefault();
      wrapper.scrollLeft = touchScrollLeft - dx;
    }
    // touchAxis === "y": do nothing — native vertical scroll takes over.
  }, { passive: false });

  wrapper.addEventListener("touchend", () => {
    wrapper.classList.remove("dragging");
    touchAxis = null;
  });
  wrapper.addEventListener("touchcancel", () => {
    wrapper.classList.remove("dragging");
    touchAxis = null;
  });
})();

/* =========================
   ✅ DRAG-TO-TRASH
   Grabbing a card's ⠿ handle and dropping it on the trash bin (left
   sidebar) resets that boss to its original "no time set" state —
   same as if it had never been killed. Uses Pointer Events so mouse
   and touch both work with one code path.
   ========================= */
(function initCardTrash(){
  const trash = document.getElementById("trashBin");
  if(!trash) return;

  let dragId = null;
  let ghost = null;

  function makeGhost(label){
    const g = document.createElement("div");
    g.className = "drag-ghost";
    g.textContent = label;
    document.body.appendChild(g);
    return g;
  }
  function moveGhost(x, y){
    if(ghost){ ghost.style.left = x + "px"; ghost.style.top = y + "px"; }
  }
  function removeGhost(){
    if(ghost){ ghost.remove(); ghost = null; }
  }
  function isOverTrash(x, y){
    const r = trash.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  function onPointerMove(e){
    if(dragId === null) return;
    moveGhost(e.clientX, e.clientY);
    trash.classList.toggle("drag-over", isOverTrash(e.clientX, e.clientY));
  }

  function onPointerUp(e){
    if(dragId === null) return;
    if(isOverTrash(e.clientX, e.clientY)) resetBoss(dragId);

    const card = document.getElementById(dragId + "-card");
    if(card) card.classList.remove("dragging-source");
    trash.classList.remove("drag-over");
    removeGhost();
    dragId = null;

    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }

  document.querySelectorAll(".card-drag-handle").forEach(handle => {
    handle.addEventListener("pointerdown", (e) => {
      // Stop this from also being read as a channel-panning drag, and
      // suppress the compatibility mouse events that would otherwise
      // fire on the wrapper right after.
      e.preventDefault();
      e.stopPropagation();

      const card = handle.closest(".card");
      if(!card) return;
      dragId = card.id.replace(/-card$/, "");
      card.classList.add("dragging-source");

      const nameEl = card.querySelector(".card-name");
      ghost = makeGhost(nameEl ? nameEl.textContent : "Boss");
      moveGhost(e.clientX, e.clientY);

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    });
  });
})();

/* =========================
   ✅ POP-UP GUIDE
   ========================= */
(function initGuide(){
  const overlay   = document.getElementById("guideOverlay");
  const helpBtn   = document.getElementById("guideHelpBtn");
  const closeBtn  = document.getElementById("guideCloseBtn");
  const gotItBtn  = document.getElementById("guideGotItBtn");
  const dontShow  = document.getElementById("guideDontShow");
  const STORAGE_KEY = "ran-tracker-guide-dismissed";

  function guideDismissed(){
    try{ return localStorage.getItem(STORAGE_KEY) === "1"; }catch(e){ return false; }
  }
  function setGuideDismissed(v){
    try{ localStorage.setItem(STORAGE_KEY, v ? "1" : "0"); }catch(e){}
  }

  function openGuide(){
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeGuide(){
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if(dontShow && dontShow.checked) setGuideDismissed(true);
  }

  if(helpBtn) helpBtn.onclick = openGuide;
  if(closeBtn) closeBtn.onclick = closeGuide;
  if(gotItBtn) gotItBtn.onclick = closeGuide;

  // Click outside the modal to close
  if(overlay){
    overlay.addEventListener("click", (e) => {
      if(e.target === overlay) closeGuide();
    });
  }

  // Escape key to close
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && overlay && overlay.classList.contains("open")) closeGuide();
  });

  // Auto-show on first visit only
  if(!guideDismissed()) openGuide();
})();
/* =========================
   ✅ TOP BAR — LIVE CLOCK + SERVER STATUS DOT
   ========================= */
(function initTopBar(){
  const clockEl = document.getElementById("liveClock");
  const dateEl  = document.getElementById("liveDate");
  const dot     = document.getElementById("serverDot");

  function tick(){
    const now = new Date();
    if(clockEl) clockEl.textContent = now.toLocaleTimeString([], { hour12:false });
    if(dateEl)  dateEl.textContent  = now.toLocaleDateString([], { month:"short", day:"numeric", year:"numeric" });
    if(dot)     dot.className = "dot" + (serverReady ? "" : " syncing");
  }
  tick();
  setInterval(tick, 1000);
})();

/* =========================
   ✅ LEFT SIDE NAV — smooth-scroll to sections + active state
   ========================= */
(function initSideNav(){
  const items = document.querySelectorAll("#sideNav .nav-item");
  if(!items.length) return;

  items.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const target = document.getElementById(targetId);

      items.forEach(i => i.classList.remove("active"));
      btn.classList.add("active");

      // "Settings" opens the respawn filter dropdown instead of just scrolling to it
      if(targetId === "respawnFilterDock"){
        const dock = document.getElementById("respawnFilterDock");
        if(dock) dock.classList.add("open");
      }

      if(target) target.scrollIntoView({ behavior:"smooth", block:"start" });
    });
  });
})();