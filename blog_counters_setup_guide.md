# Blog Counters Setup Guide

This document outlines all required and active counters for your static portfolio blog using **CounterAPI v2**, along with a quick step-by-step checklist to follow whenever you publish a new article.

## 1. Counter Naming Convention

All counters in your **`kushu`** workspace follow a strict naming scheme matching your HTML filename (the post slug):

* **Views:** `{slug}_views`

* **Likes:** `{slug}_likes`

## 2. List of Counters to Create in CounterAPI Dashboard

Log in to [counterapi.dev](https://counterapi.dev?utm_source=gemini) $\rightarrow$ select workspace **`kushu`** $\rightarrow$ navigate to **Counters** $\rightarrow$ click **+ Create Counter**.

### Example:

1. **`ive-left`**

   * Counter 1 Name/Slug: `ive-left_views`

   * Counter 2 Name/Slug: `ive-left_likes`

2. **`the-uncertainitinometer`**

   * Counter 1 Name/Slug: `the-uncertainitinometer_views`

   * Counter 2 Name/Slug: `the-uncertainitinometer_likes`

## 3. Workflow for Adding a New Blog Post

Whenever you write and publish a new post (e.g., `blogs/my-new-post.html`):

### Step 1: Create the Counter Pair on CounterAPI

1. Go to [counterapi.dev/dashboard](https://app.counterapi.dev/team/kushagra-sharmas-team).

2. Click **+ Create Counter** and create:

   * **Name / Slug:** `my-new-post_views`. Ensure that the slug has an underscore (`_`) before views.

3. Click **+ Create Counter** again and create:

   * **Name / Slug:** `my-new-post_likes`. Ensure that the slug has an underscore (`_`) before likes.

4. Register both the new counters under the 'kushu' workspace.

### Step 2: Test in Terminal (Optional Verification)

Verify that your newly created counter responds cleanly to API calls:

```
curl -i https://api.counterapi.dev/v2/kushu/my-new-post_views \
  -H "Authorization: Bearer ut_mys9M1SGnDU0l9P3iU8Wsd8N0QjHdtpEKuveEdSw"

```

### Step 3: Embed Counter Logic into your HTML Post

In your new blog file (`blogs/my-new-post.html`), ensure `js/counters.js` is imported and invoked in the DOM initialization script:

```
<!-- Include Scripts -->
<script src="../js/theme.js"></script>
<script src="../js/counters.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", async () => {
    // Automatically derives "my-new-post" from path
    const slug = getPostSlug(window.location.pathname);

    // 1. Record page view on load
    await recordView(slug);

    // 2. Load metrics into UI elements
    const metrics = await getMetrics(slug);
    const likeCountSpan = document.getElementById("like-count");
    const likeBtn = document.getElementById("like-btn");

    if (likeCountSpan) likeCountSpan.textContent = metrics.likes;

    if (isPostLiked(slug)) {
      likeBtn.classList.add("liked");
    }

    // 3. Handle Like Button Clicks
    likeBtn.addEventListener("click", async () => {
      likeBtn.disabled = true;
      const res = await recordLike(slug);
      likeBtn.disabled = false;

      if (res && res.likes !== undefined) {
        likeCountSpan.textContent = res.likes;
        if (res.liked) {
          likeBtn.classList.add("liked");
        } else {
          likeBtn.classList.remove("liked");
        }
      }
    });
  });
</script>

```