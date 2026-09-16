# RoyalPhoenix-bot.github.io

Kushagra Sharma's personal site — a home page and a small blog, built as
plain static HTML/CSS/JS (no build step, no framework) and served by
GitHub Pages.

## Live routes

| Route         | Served from              |
|---------------|---------------------------|
| `/index`      | `index.html`              |
| `/blog`       | `blog.html`                |
| `/blogs/<slug>` | `blogs/<slug>.html`      |

Links throughout the site are written **without** the `.html` extension
(e.g. `href="/blog"`). GitHub Pages automatically resolves an extensionless
path to the matching `.html` file, so the files on disk keep their real
`.html` extension — don't rename them. This only works once the site is
served by GitHub Pages (or an equivalent static host); opening the files
straight from disk (`file://...`) will break these root-absolute links,
since the browser has no server to resolve them against. To preview
locally, serve the folder with any static file server, e.g.:

```
npx serve .
# or
python3 -m http.server
```

## Structure

```
index.html        Home page (name, photo, about me)
blog.html          Blog index — lists every post from js/posts.js
blogs/             One HTML file per blog post — see blogs/README.md
css/               Shared + page-specific stylesheets — see css/README.md
js/                Shared scripts + the blog manifest — see js/README.md
assets/            Images — see assets/README.md
```

Every subdirectory has its own `README.md` with more detail, and every
file has a short comment at the top explaining what it's for.

## Adding a new blog post

1. Copy `blogs/sample-post.html` to `blogs/your-post-slug.html` and write it.
2. Add one entry to `js/posts.js` with a title, one-line summary, date, and
   the route (`/blogs/your-post-slug`).
3. Done — `blog.html` reads `js/posts.js` and lists the post automatically,
   newest first.

Full details in `blogs/README.md`.

## Shared page chrome

The top tab bar (Home / Blog) and the footer links (GitHub, LinkedIn, X,
Email) are duplicated at the top/bottom of every HTML file rather than
pulled from a shared partial, since this is plain static HTML with no
templating. If you change one, change it in the others too:
`index.html`, `blog.html`, and every file in `blogs/`.
