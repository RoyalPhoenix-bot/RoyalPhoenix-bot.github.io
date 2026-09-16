// Blog manifest — the single source of truth for what shows up on /blog.
//
// To publish a new post:
//   1. Copy blogs/sample-post.html to blogs/your-post-slug.html and write it.
//   2. Add one entry below with a title, a one-line summary, a date (YYYY-MM-DD),
//      and `file` set to the extensionless, root-absolute route GitHub Pages
//      will serve it at: "/blogs/your-post-slug" (the actual file on disk
//      keeps its .html extension — GitHub Pages resolves the rest).
//   3. That's it — blog.html reads this array and lists it automatically,
//      newest first by `date`.

const posts = [
  {
    title: "It's Me, I've Left",
    summary:
      "There is an art, or rather, a knack to flying. The knack lies in learning how to throw yourself at the ground and miss. You’ll have so many opportunities to throw yourself at the ground, all you have to do is to learn how to miss it.",
    date: "2024-06-22",
    file: "/blogs/ive-left",
  },
  {
    title: "The Uncertainitinometer",
    summary:
      "My attempt at rewriting Agatha Christie's Wasps' Nest into a sci-fi theme. This was written in 3 hours as part of an end-sem exam, so do gimme the benefit of doubt.",
    date: "2023-04-30",
    file: "/blogs/the-uncertainitinometer",
  },
  // {
  //   title: "Why I Rebuilt My Profiler in Rust",
  //   summary:
  //     "A short account of chasing a 3x latency regression down to the metal, and what it taught me about tooling.",
  //   date: "2026-09-01",
  //   file: "/blogs/sample-post",
  // },
];
