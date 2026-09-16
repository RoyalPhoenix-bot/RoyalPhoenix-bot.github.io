# css/

| File          | Purpose |
|---------------|---------|
| `styles.css`  | Shared on every page. Design tokens, the grain + orb background effect, the top tab bar, the home page's two-column hero, and the footer social links. |
| `blog.css`    | Loaded **after** `styles.css`, only on `blog.html` and every file in `/blogs`. Blog listing styles + article typography. |

Load order matters: `styles.css` first, then `blog.css` if the page needs it.
`index.html` only needs `styles.css`.
