/**
 * js/counters.js — Handles view and like counts via CounterAPI
 */

const NAMESPACE = "kushu"; 
const BASE_URL = `https://api.counterapi.dev/v1/${NAMESPACE}`;

function getPostSlug(fileOrPath) {
  if (!fileOrPath) return "";
  return fileOrPath.split("/").filter(Boolean).pop().replace(/\.html$/, "");
}

// Extract count safely across CounterAPI response formats
function parseCount(data) {
  if (!data || typeof data !== "object") return 0;
  if (typeof data.count === "number") return data.count;
  if (typeof data.value === "number") return data.value;
  return 0;
}

// Fetch view and like counts without modifying them
async function getMetrics(slug) {
  try {
    const [viewsRes, likesRes] = await Promise.all([
      fetch(`${BASE_URL}/${slug}_views`),
      fetch(`${BASE_URL}/${slug}_likes`)
    ]);

    const viewsData = viewsRes.ok ? await viewsRes.json() : null;
    const likesData = likesRes.ok ? await likesRes.json() : null;

    return {
      views: parseCount(viewsData),
      likes: parseCount(likesData)
    };
  } catch (err) {
    console.warn("Failed to fetch CounterAPI metrics:", err);
    return { views: 0, likes: 0 };
  }
}

// Increment View Count on page load
async function recordView(slug) {
  try {
    const res = await fetch(`${BASE_URL}/${slug}_views/up`);
    if (!res.ok) return 0;
    const data = await res.json();
    return parseCount(data);
  } catch (err) {
    console.warn("Failed to record view:", err);
    return 0;
  }
}

// Toggle Like Count (Up / Down)
async function recordLike(slug) {
  let hasLiked = localStorage.getItem(`has_liked_${slug}`) === "true";
  let action = hasLiked ? "down" : "up";

  try {
    let res = await fetch(`${BASE_URL}/${slug}_likes/${action}`);

    // Fallback: If decrementing fails on a uninitialized key, auto-recover by sending /up
    if (!res.ok && action === "down") {
      localStorage.removeItem(`has_liked_${slug}`);
      hasLiked = false;
      action = "up";
      res = await fetch(`${BASE_URL}/${slug}_likes/${action}`);
    }

    if (!res.ok) return null;

    const data = await res.json();
    const newCount = parseCount(data);

    if (!hasLiked) {
      localStorage.setItem(`has_liked_${slug}`, "true");
    } else {
      localStorage.removeItem(`has_liked_${slug}`);
    }

    return { likes: newCount, liked: !hasLiked };
  } catch (err) {
    console.warn("Failed to toggle like:", err);
    return null;
  }
}

function isPostLiked(slug) {
  return localStorage.getItem(`has_liked_${slug}`) === "true";
}
