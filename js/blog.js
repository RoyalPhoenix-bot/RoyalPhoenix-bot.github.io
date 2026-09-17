// js/blog.js — Handles filtering, deep text search, and dynamic rendering for blog.html

let currentCategory = "all";
let searchQuery = "";
const postContentCache = new Map(); // Caches post.file -> raw text content

function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Preloads and strips HTML tag content from all post pages in the background
async function preloadPostContents() {
  if (typeof posts === "undefined") return;

  await Promise.all(
    posts.map(async (post) => {
      if (!post.file) return;
      try {
        const response = await fetch(post.file);
        if (response.ok) {
          const htmlText = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, "text/html");
          
          // Target the main article container or fallback to body text
          const mainContent = doc.querySelector(".post-main") || doc.body;
          if (mainContent) {
            postContentCache.set(post.file, mainContent.textContent.toLowerCase());
          }
        }
      } catch (err) {
        console.warn(`Could not index text for post: ${post.file}`, err);
      }
    })
  );

  // Trigger a re-render in case the user typed a query before preloading finished
  if (searchQuery.trim() !== "") {
    renderPosts();
  }
}

function renderPosts() {
  const list = document.getElementById("post-list");
  if (!list || typeof posts === "undefined") return;

  list.innerHTML = "";
  const query = searchQuery.trim().toLowerCase();

  // Filter posts by active category AND deep text search query
  const filtered = posts.filter((post) => {
    // 1. Category check
    const categories = Array.isArray(post.category)
      ? post.category
      : [post.category || "Tech"];
    const matchesCategory = currentCategory === "all" || categories.includes(currentCategory);

    // 2. Search check across Title, Summary, and Full Body Content
    const titleMatch = post.title ? post.title.toLowerCase().includes(query) : false;
    const summaryMatch = post.summary ? post.summary.toLowerCase().includes(query) : false;
    const bodyContent = postContentCache.get(post.file) || "";
    const bodyMatch = bodyContent.includes(query);

    const matchesSearch = query === "" || titleMatch || summaryMatch || bodyMatch;

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "post-list-empty";
    empty.textContent = query
      ? `No posts found matching "${searchQuery}".`
      : `No posts found under "${currentCategory}".`;
    list.appendChild(empty);
    return;
  }

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  sorted.forEach((post) => {
    const item = document.createElement("li");
    item.className = "post-item";

    const slug = getPostSlug(post.file);

    // Meta Container
    const meta = document.createElement("div");
    meta.className = "post-meta";

    // Left Side: Date + Category Badges
    const metaLeft = document.createElement("div");
    metaLeft.className = "post-meta-left";

    const time = document.createElement("time");
    time.className = "post-date";
    time.dateTime = post.date;
    time.textContent = formatDate(post.date);

    const tagsContainer = document.createElement("div");
    tagsContainer.className = "post-tags";

    const categories = Array.isArray(post.category)
      ? post.category
      : [post.category || "Tech"];

    categories.forEach((cat) => {
      const tag = document.createElement("span");
      tag.className = "tag-badge";
      tag.textContent = cat;
      tagsContainer.appendChild(tag);
    });

    metaLeft.append(time, tagsContainer);

    // Right Side: Views & Likes Placeholders
    const stats = document.createElement("div");
    stats.className = "post-stats";
    stats.innerHTML = `
      <span class="stat-item" title="Views">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span class="view-val">—</span>
      </span>
      <span class="stat-item" title="Likes">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
        <span class="like-val">—</span>
      </span>
    `;

    // Asynchronously update metric values from CounterAPI
    getMetrics(slug).then(({ views, likes }) => {
      const vEl = stats.querySelector(".view-val");
      const lEl = stats.querySelector(".like-val");
      if (vEl) vEl.textContent = views;
      if (lEl) lEl.textContent = likes;
    });

    meta.append(metaLeft, stats);

    const link = document.createElement("a");
    link.className = "post-title";
    link.href = post.file;
    link.textContent = post.title;

    const summary = document.createElement("p");
    summary.className = "post-summary";
    summary.textContent = post.summary;

    item.append(meta, link, summary);
    list.appendChild(item);
  });
}

function setupToolbar() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderPosts();
    });
  });

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderPosts();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupToolbar();
  renderPosts();
  preloadPostContents(); // Kick off full-text indexing
});
