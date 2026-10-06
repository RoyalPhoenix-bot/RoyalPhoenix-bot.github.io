/**
 * js/game/counters.js — Powered by CounterAPI v2 (Cloudflare Cache-Buster Enabled)
 */
const WORKSPACE = "kushu";
const BASE_URL = `https://api.counterapi.dev/v2/${WORKSPACE}`;
const FETCH_HEADERS = { "Content-Type": "application/json" };

function parseCount(payload) {
  if (!payload || typeof payload !== "object") return 0;
  const data = payload.data || payload;
  if (typeof data.up_count === "number") return data.up_count;
  if (typeof data.value === "number") return data.value;
  if (typeof data.count === "number") return data.count;
  return 0;
}

export async function loadGameMetrics() {
  try {
    const ts = Date.now();
    const [winsRes, defeatsRes, rickRes] = await Promise.all([
      fetch(`${BASE_URL}/marvin_wins?ts=${ts}`, { headers: FETCH_HEADERS, cache: "no-store" }).catch(() => null),
      fetch(`${BASE_URL}/marvin_defeats?ts=${ts}`, { headers: FETCH_HEADERS, cache: "no-store" }).catch(() => null),
      fetch(`${BASE_URL}/curiosity_incidents?ts=${ts}`, { headers: FETCH_HEADERS, cache: "no-store" }).catch(() => null)
    ]);

    const winsData = winsRes && winsRes.ok ? await winsRes.json() : null;
    const defeatsData = defeatsRes && defeatsRes.ok ? await defeatsRes.json() : null;
    const rickData = rickRes && rickRes.ok ? await rickRes.json() : null;

    const elWins = document.getElementById("count-marvin-wins");
    const elDefeats = document.getElementById("count-marvin-defeats");
    const elRick = document.getElementById("count-rick-roll");

    if (elWins) elWins.textContent = parseCount(winsData);
    if (elDefeats) elDefeats.textContent = parseCount(defeatsData);
    if (elRick) elRick.textContent = parseCount(rickData);
  } catch (err) {
    console.warn("Failed to load game metrics:", err);
  }
}

export async function recordMarvinWin() {
  try {
    const res = await fetch(`${BASE_URL}/marvin_wins/up?ts=${Date.now()}`, { headers: FETCH_HEADERS, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const elWins = document.getElementById("count-marvin-wins");
      if (elWins) elWins.textContent = parseCount(data);
    }
  } catch (err) { /* silent fail */ }
}

export async function recordMarvinDefeat() {
  try {
    const res = await fetch(`${BASE_URL}/marvin_defeats/up?ts=${Date.now()}`, { headers: FETCH_HEADERS, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const elDefeats = document.getElementById("count-marvin-defeats");
      if (elDefeats) elDefeats.textContent = parseCount(data);
    }
  } catch (err) { /* silent fail */ }
}

export async function recordRickRollClick() {
  try {
    const res = await fetch(`${BASE_URL}/curiosity_incidents/up?ts=${Date.now()}`, { headers: FETCH_HEADERS, cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const elRick = document.getElementById("count-rick-roll");
      if (elRick) elRick.textContent = parseCount(data);
    }
  } catch (err) { /* silent fail */ }
}
