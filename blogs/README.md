# blogs/

One HTML file per blog post. `sample-post.html` is both a real sample post
and the template to copy for new ones.

## Publishing a new post

1. **Copy the template**

   ```
   cp blogs/sample-post.html blogs/your-post-slug.html
   ```

2. **Edit `blogs/your-post-slug.html`**
   - Update `<title>` and the `<meta name="description">`.
   - Update the `<time datetime="YYYY-MM-DD">` and its visible date text.
   - Update the `<h1>` and the body paragraphs (`<h2>` for section headings).
   - Leave the `<head>` links, `.grain`/`.orb` divs, `.topnav`, and the
     footer `<nav>` as they are — they're what keep the post visually
     consistent with the rest of the site.

3. **Add it to the manifest** in `../js/posts.js`:

   ```js
   {
     title: "Your Post Title",
     summary: "One sentence describing the post.",
     date: "2026-01-01",
     file: "/blogs/your-post-slug",
   },
   ```

That's it — `blog.html` reads `js/posts.js` and lists the post
automatically, sorted newest-first by `date`.

## Why the route in `posts.js` has no `.html`

The actual file stays `your-post-slug.html` on disk. The route you put in
`posts.js` (`/blogs/your-post-slug`) is the clean URL GitHub Pages resolves
to that file — see the root `README.md` for details.
