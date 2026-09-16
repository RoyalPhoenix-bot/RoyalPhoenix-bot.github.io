// Blog manifest.
//
// To publish a new post:
//   1. Copy blogs/sample-post.html to blogs/your-post-slug.html and write it.
//   2. Add one entry below with a title, a one-line summary, a date (YYYY-MM-DD),
//      and `file` pointing at the path from this repo's root.
//   3. That's it — blog.html reads this array and lists it automatically.
//
// Newest posts don't need to go first; the list is sorted by date for you.

const posts = [
  {
    title: "Why I Rebuilt My Profiler in Rust",
    summary:
      "A short account of chasing a 3x latency regression down to the metal, and what it taught me about tooling.",
    date: "2026-09-01",
    file: "blogs/sample-post.html",
  },
];
