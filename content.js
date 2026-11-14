const contentPath = "content/site.json";

function readPath(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function safeLink(url, fallback = "#") {
  if (!url) return fallback;
  try {
    const parsed = new URL(url, window.location.origin);
    return ["http:", "https:", "mailto:"].includes(parsed.protocol) ? parsed.href : fallback;
  } catch {
    return fallback;
  }
}

function applySimpleFields(content) {
  document.querySelectorAll("[data-content]").forEach((node) => {
    const value = readPath(content, node.dataset.content);
    if (typeof value === "string") node.textContent = value;
  });

  document.querySelectorAll("[data-profile-link]").forEach((node) => {
    const url = readPath(content, `site.${node.dataset.profileLink}`);
    node.href = safeLink(url);
    node.hidden = !url;
  });

  document.querySelectorAll("[data-email-link]").forEach((node) => {
    const email = content.site?.email;
    if (!email) return;
    node.href = `mailto:${email}`;
    const textNode = node.childNodes[0];
    if (textNode?.nodeType === Node.TEXT_NODE) textNode.textContent = `${email} `;
    else node.textContent = email;
  });
}

function renderFeatured(items = []) {
  const container = document.querySelector("[data-featured-list]");
  if (!container) return;
  container.replaceChildren(...items.map((item, index) => {
    const card = element("article", "work-card");
    card.append(element("div", "card-number", String(index + 1).padStart(2, "0")));
    const body = element("div");
    body.append(element("p", "eyebrow", item.type), element("h3", "", item.title), element("p", "", item.description));
    const link = element("a", "", `${item.link_label || "Explore"} ↗`);
    link.href = safeLink(item.url);
    link.setAttribute("aria-label", `${item.link_label || "Explore"}: ${item.title}`);
    card.append(body, link);
    return card;
  }));
}

function renderCurrentFocus(items = []) {
  const container = document.querySelector("[data-focus-list]");
  if (!container) return;
  container.replaceChildren(...items.map((item) => {
    const row = element("div", "now-item");
    row.append(element("span", "", item.label), element("p", "", item.text));
    return row;
  }));
}

function cvEntry(date, title, organization, description = "", compact = false) {
  const row = element("div", `cv-entry${compact ? " compact" : ""}`);
  const body = element("div");
  body.append(element("h3", "", title), element("p", "cv-org", organization));
  if (description) body.append(element("p", "", description));
  row.append(element("div", "cv-date", date), body);
  return row;
}

function renderCv(content) {
  const experience = document.querySelector("[data-cv-experience]");
  if (experience) experience.replaceChildren(...(content.cv?.experience || []).map((item) => cvEntry(item.date, item.title, item.organization, item.description)));

  const education = document.querySelector("[data-cv-education]");
  if (education) education.replaceChildren(...(content.cv?.education || []).map((item) => cvEntry(item.date, item.degree, item.institution, item.detail)));

  const publications = document.querySelector("[data-cv-publications]");
  if (publications) publications.replaceChildren(...(content.cv?.publications || []).map((item) => {
    const entry = element("li");
    entry.append(element("span", "", item.title), document.createTextNode(` ${item.citation || ""}`));
    return entry;
  }));

  const presentations = document.querySelector("[data-cv-presentations]");
  if (presentations) presentations.replaceChildren(...(content.cv?.presentations || []).map((item) => cvEntry(item.date, item.title, item.venue, "", true)));

  const awards = document.querySelector("[data-cv-awards]");
  if (awards) awards.replaceChildren(...(content.cv?.awards || []).map((item) => {
    const entry = element("li");
    entry.append(element("span", "", item.date), document.createTextNode(item.title));
    return entry;
  }));
}

function renderProjects(items = []) {
  const container = document.querySelector("[data-project-list]");
  if (!container) return;
  container.replaceChildren(...items.map((item, index) => {
    const article = element("article", "project-row");
    const meta = element("div", "project-meta");
    meta.append(element("span", "", String(index + 1).padStart(2, "0")), element("span", "", [item.type, item.status].filter(Boolean).join(" · ")));
    const body = element("div");
    body.append(element("h2", "", item.title), element("p", "", item.description));
    const tags = element("div", "tag-list");
    (item.tags || []).forEach((tag) => tags.append(element("span", "", tag)));
    body.append(tags);
    const link = element("a", "project-arrow", "↗");
    link.href = safeLink(item.url);
    link.setAttribute("aria-label", `Open ${item.title}`);
    if (!item.url) link.hidden = true;
    article.append(meta, body, link);
    return article;
  }));
}

function renderMedia(items = []) {
  const container = document.querySelector("[data-media-list]");
  if (!container) return;
  container.replaceChildren(...items.map((item) => {
    const article = element("article", "media-row");
    article.dataset.category = item.category;
    const meta = element("div");
    meta.append(element("span", "media-type", item.category), element("span", "media-date", item.date));
    const body = element("div");
    body.append(element("h2", "", item.title), element("p", "", item.source));
    const link = element("a", "", `${item.link_label || "Open"} ↗`);
    link.href = safeLink(item.url);
    link.setAttribute("aria-label", `${item.link_label || "Open"}: ${item.title}`);
    if (!item.url) link.hidden = true;
    article.append(meta, body, link);
    return article;
  }));
}

function renderInquiries(items = []) {
  const container = document.querySelector("[data-inquiry-list]");
  if (!container) return;
  container.replaceChildren(...items.map((item, index) => {
    const card = element("div", "inquiry-card");
    card.append(element("span", "", String(index + 1).padStart(2, "0")), element("h2", "", item.title), element("p", "", item.description));
    return card;
  }));
}

async function loadSiteContent() {
  try {
    const response = await fetch(contentPath, { cache: "no-store" });
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
    const content = await response.json();
    applySimpleFields(content);
    renderFeatured(content.home?.featured);
    renderCurrentFocus(content.home?.current_focus);
    renderCv(content);
    renderProjects(content.projects);
    renderMedia(content.media);
    renderInquiries(content.contact?.inquiry_types);
    document.dispatchEvent(new CustomEvent("site-content-ready"));
  } catch (error) {
    console.warn("Using built-in page content because editable content could not be loaded.", error);
  }
}

loadSiteContent();
