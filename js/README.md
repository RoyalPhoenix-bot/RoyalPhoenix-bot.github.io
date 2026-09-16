# js/

| File         | Loaded on          | Purpose |
|--------------|--------------------|---------|
| `script.js`  | Every page          | Moves the ambient `.orb` glow with the pointer. Purely decorative; respects `prefers-reduced-motion`. |
| `posts.js`   | `blog.html`          | **The blog manifest.** An array of `{ title, summary, date, file }`. Add a new post here — see `../blogs/README.md`. |
| `blog.js`    | `blog.html`          | Reads `posts.js` and renders it into the `<ul id="post-list">` on `blog.html`. You shouldn't need to edit this to add a post. |

`posts.js` must be loaded before `blog.js` (it defines the global `posts`
array that `blog.js` reads) — see the `<script>` order at the bottom of
`blog.html`.
