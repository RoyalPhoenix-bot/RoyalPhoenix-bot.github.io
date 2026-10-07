/**
 * js/counters.js — Powered by CounterAPI v2 (Cloudflare Cache-Buster Enabled)
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
 * Fetches view and like counts for a post without incrementing (Bypasses Edge & Disk Cache)
 */
async function getMetrics(slug) {
  try {
    const ts = Date.now();
    const [viewsRes, likesRes] = await Promise.all([
      fetch(`${BASE_URL}/${slug}_views?ts=${ts}`, { headers: FETCH_HEADERS, cache: "no-store" }).catch(() => null),
      fetch(`${BASE_URL}/${slug}_likes?ts=${ts}`, { headers: FETCH_HEADERS, cache: "no-store" }).catch(() => null)
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
    const res = await fetch(`${BASE_URL}/${slug}_views/up?ts=${Date.now()}`, { 
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
 * Increments like count with instant optimistic UI increment & vertical roller animation
 */
async function recordLike(slug) {
  const hasLiked = localStorage.getItem(`has_liked_${slug}`) === "true";
  
  // If already liked, return current metrics without incrementing
  if (hasLiked) {
    const current = await getMetrics(slug);
    return { likes: current.likes, liked: true };
  }

  // --- OPTIMISTIC UI UPDATE ---
  const likeBtn = document.getElementById("like-btn") || document.querySelector(".like-button");
  const likeCountEl = document.getElementById("like-count") || document.querySelector(".like-val") || document.querySelector(".like-count");

  let optimisticCount = 0;

  if (likeBtn) {
    likeBtn.classList.add("liked");
  }

  if (likeCountEl) {
    const currentCount = parseInt(likeCountEl.textContent, 10) || 0;
    optimisticCount = currentCount + 1;

    // Restart vertical roller animation
    likeCountEl.classList.remove("like-roller-animating");
    void likeCountEl.offsetWidth; // Reflow trick
    likeCountEl.classList.add("like-roller-animating");

    // Swap text mid-animation while the number is off-screen
    setTimeout(() => {
      likeCountEl.textContent = optimisticCount;
    }, 160);
  }

  try {
    const res = await fetch(`${BASE_URL}/${slug}_likes/up?ts=${Date.now()}`, { 
      headers: FETCH_HEADERS,
      cache: "no-store"
    });
    
    // Mark as liked in local storage
    localStorage.setItem(`has_liked_${slug}`, "true");

    if (!res.ok) return { likes: optimisticCount, liked: true };

    const data = await res.json();
    const newCount = parseCount(data);

    // Only overwrite DOM if the server count is strictly higher than optimistic count
    if (likeCountEl && newCount > optimisticCount) {
      likeCountEl.textContent = newCount;
      return { likes: newCount, liked: true };
    }

    return { likes: optimisticCount, liked: true };
  } catch (err) {
    console.error("Failed to update backend like count:", err);
    localStorage.setItem(`has_liked_${slug}`, "true");
    return { likes: optimisticCount, liked: true };
  }
}

function isPostLiked(slug) {
  return localStorage.getItem(`has_liked_${slug}`) === "true";
}
