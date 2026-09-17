/**
 * js/counters.js — Handles view and like counts via CounterAPI
 */

const NAMESPACE = "kushu"; // Change this to any unique string for your site
const BASE_URL = `https://api.counterapi.dev/v1/${NAMESPACE}`;

// Standardized slug helper for both blog index and post pages
function getPostSlug(fileOrPath) {
  if (!fileOrPath) return "";
  return fileOrPath.split("/").filter(Boolean).pop().replace(/\.html$/, "");
}

// Fetch view and like counts without modifying them
async function getMetrics(slug) {
  try {
    const [viewsRes, likesRes] = await Promise.all([
      fetch(`${BASE_URL}/${slug}_views`),
      fetch(`${BASE_URL}/${slug}_likes`)
    ]);

    const viewsData = viewsRes.ok ? await viewsRes.json() : { count: 0 };
    const likesData = likesRes.ok ? await likesRes.json() : { count: 0 };

    return {
      views: viewsData.count || 0,
      likes: likesData.count || 0
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
    const data = await res.json();
    return data.count;
  } catch (err) {
    console.warn("Failed to record view:", err);
  }
}

// Toggle Like Count (Up / Down)
async function recordLike(slug) {
  const hasLiked = localStorage.getItem(`has_liked_${slug}`) === "true";
  const action = hasLiked ? "down" : "up";

  try {
    const res = await fetch(`${BASE_URL}/${slug}_likes/${action}`);
    const data = await res.json();

    if (!hasLiked) {
      localStorage.setItem(`has_liked_${slug}`, "true");
    } else {
      localStorage.removeItem(`has_liked_${slug}`);
    }

    return { likes: data.count, liked: !hasLiked };
  } catch (err) {
    console.warn("Failed to toggle like:", err);
  }
}

function isPostLiked(slug) {
  return localStorage.getItem(`has_liked_${slug}`) === "true";
}
