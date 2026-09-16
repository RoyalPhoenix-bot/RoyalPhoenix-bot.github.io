function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderPosts() {
  const list = document.getElementById("post-list");
  if (!list || typeof posts === "undefined") return;

  if (posts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "post-list-empty";
    empty.textContent = "Nothing here yet — check back soon.";
    list.replaceWith(empty);
    return;
  }

  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  sorted.forEach((post) => {
    const item = document.createElement("li");
    item.className = "post-item";

    const time = document.createElement("time");
    time.className = "post-date";
    time.dateTime = post.date;
    time.textContent = formatDate(post.date);

    const link = document.createElement("a");
    link.className = "post-title";
    link.href = post.file;
    link.textContent = post.title;

    const summary = document.createElement("p");
    summary.className = "post-summary";
    summary.textContent = post.summary;

    item.append(time, link, summary);
    list.appendChild(item);
  });
}

renderPosts();
