/**
 * js/counters.js — Powered by CounterAPI v2 (No-Cache Enabled)
 */

const NAMESPACE = "kushu"; 
const BASE_URL = `https://api.counterapi.dev/v2/${NAMESPACE}`;

const FETCH_HEADERS = {
  "Content-Type": "application/json"
};

function getPostSlug(fileOrPath) {
  if (!fileOrPath) return "";
  return fileOrPath.split("/").filter(Boolean).pop().replace(/\.html$/, "");
}

function parseCount(payload) {
  if (!payload || typeof payload !== "object") return 0;
  const data = payload.data || payload;
  
  if (typeof data.up_count === "number") return data.up_count;
  if (typeof data.value === "number") return data.value;
  if (typeof data.count === "number") return data.count;
  return 0;
}

/**
 * Fetches view and like counts for a post without incrementing (Bypasses Disk Cache)
 */
async function getMetrics(slug) {
  try {
    const [viewsRes, likesRes] = await Promise.all([
      fetch(`${BASE_URL}/${slug}_views`, { headers: FETCH_HEADERS, cache: "no-store" }).catch(() => null),
      fetch(`${BASE_URL}/${slug}_likes`, { headers: FETCH_HEADERS, cache: "no-store" }).catch(() => null)
    ]);

    const viewsData = viewsRes && viewsRes.ok ? await viewsRes.json() : null;
    const likesData = likesRes && likesRes.ok ? await likesRes.json() : null;

    return {
      views: parseCount(viewsData),
      likes: parseCount(likesData)
    };
  } catch (err) {
    return { views: 0, likes: 0 };
  }
}

/**
 * Increments view count on page visit
 */
async function recordView(slug) {
  try {
    const res = await fetch(`${BASE_URL}/${slug}_views/up`, { 
      headers: FETCH_HEADERS,
      cache: "no-store"
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return parseCount(data);
  } catch (err) {
    return 0;
  }
}

/**
 * Increments like count
 */
async function recordLike(slug) {
  const hasLiked = localStorage.getItem(`has_liked_${slug}`) === "true";
  
  // If already liked, return current metrics without incrementing
  if (hasLiked) {
    const current = await getMetrics(slug);
    return { likes: current.likes, liked: true };
  }

  try {
    const res = await fetch(`${BASE_URL}/${slug}_likes/up`, { 
      headers: FETCH_HEADERS,
      cache: "no-store"
    });
    if (!res.ok) return null;

    const data = await res.json();
    const newCount = parseCount(data);

    localStorage.setItem(`has_liked_${slug}`, "true");

    return { likes: newCount, liked: true };
  } catch (err) {
    return null;
  }
}

function isPostLiked(slug) {
  return localStorage.getItem(`has_liked_${slug}`) === "true";
}
