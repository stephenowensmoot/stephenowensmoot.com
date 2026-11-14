(function () {
  "use strict";

  var h = window.h;
  var createClass = window.createClass;

  function el(tag, props) {
    var children = Array.prototype.slice.call(arguments, 2).filter(function (child) {
      return child !== null && child !== undefined && child !== false;
    });
    return h.apply(null, [tag, props || {}].concat(children));
  }

  function list(value) {
    return Array.isArray(value) ? value : [];
  }

  function assetUrl(component, path) {
    if (!path) return "";
    var asset = component.props.getAsset(path);
    return asset ? asset.toString() : "";
  }

  function image(component, path, alt, className) {
    var src = assetUrl(component, path);
    if (!src) return null;
    return el("img", { src: src, alt: alt || "", className: className || "" });
  }

  function PreviewHeader(component) {
    var pages = [
      ["home", "Home"],
      ["cv", "CV"],
      ["projects", "Projects"],
      ["media", "Media"],
      ["contact", "Contact"]
    ];
    return el("div", { className: "preview-toolbar", role: "navigation", "aria-label": "Preview a website page" },
      el("span", { className: "preview-toolbar-label" }, "Live preview"),
      el("div", { className: "preview-toolbar-pages" }, pages.map(function (page) {
        return el("button", {
          key: page[0],
          type: "button",
          className: component.state.page === page[0] ? "active" : "",
          onClick: function () { component.setState({ page: page[0] }); }
        }, page[1]);
      }))
    );
  }

  function SiteHeader(active) {
    return el("header", { className: "site-header" },
      el("div", { className: "container nav-shell" },
        el("div", { className: "wordmark" },
          el("span", { className: "wordmark-mark", "aria-hidden": "true" }, "SOS"),
          el("span", null, "Stephen Owen Smoot")
        ),
        el("nav", { className: "site-nav", "aria-label": "Preview navigation" },
          ["Home", "CV", "Projects", "Media", "Contact"].map(function (label) {
            return el("span", { key: label, className: active === label.toLowerCase() ? "preview-nav-current" : "" }, label);
          })
        )
      )
    );
  }

  function Footer() {
    return el("footer", { className: "site-footer" },
      el("div", { className: "container footer-grid" },
        el("p", null, "© " + new Date().getFullYear() + " Stephen Owen Smoot"),
        el("div", { className: "footer-links" }, el("span", null, "CV"), el("span", null, "Media"), el("span", null, "Contact")),
        el("p", { className: "footer-domain" }, "stephenowensmoot.com")
      )
    );
  }

  function HomePreview(component, data) {
    var site = data.site || {};
    var home = data.home || {};
    return el("div", null,
      SiteHeader("home"),
      el("main", null,
        el("section", { className: "hero container" },
          el("div", { className: "hero-kicker" }, "Personal website & archive"),
          el("div", { className: "hero-grid" },
            el("div", null, el("h1", null, "Stephen Owen", el("br"), "Smoot")),
            el("div", { className: "hero-intro" },
              el("p", { className: "eyebrow" }, site.tagline || "Professional headline"),
              el("p", { className: "lede" }, site.introduction || "Homepage introduction")
            )
          ),
          el("div", { className: "hero-rule", "aria-hidden": "true" }, el("span"))
        ),
        el("section", { className: "section container" },
          el("div", { className: "section-grid" },
            el("div", null, el("p", { className: "section-label" }, "01 / About")),
            el("div", { className: "content-narrow" },
              site.profile_image ? el("figure", { className: "profile-photo" }, image(component, site.profile_image, site.profile_image_alt)) : null,
              el("h2", null, home.bio_heading || "Biography heading"),
              el("p", { className: "body-large" }, home.bio_primary || "Main biography"),
              home.bio_secondary ? el("p", { className: "muted" }, home.bio_secondary) : null
            )
          )
        ),
        el("section", { className: "section section-tinted" },
          el("div", { className: "container" },
            el("div", { className: "section-heading-row" }, el("div", null,
              el("p", { className: "section-label" }, "02 / Selected work"),
              el("h2", null, "A few things worth exploring.")
            )),
            el("div", { className: "card-grid" }, list(home.featured).map(function (item, index) {
              return el("article", { className: "work-card", key: index },
                el("div", { className: "card-number" }, String(index + 1).padStart(2, "0")),
                el("div", null,
                  image(component, item.image, item.image_alt || item.title, "work-card-image"),
                  el("p", { className: "eyebrow" }, item.type),
                  el("h3", null, item.title),
                  el("p", null, item.description)
                ),
                el("span", { className: "preview-link" }, (item.link_label || "Explore") + " ↗")
              );
            }))
          )
        ),
        list(home.gallery).length ? el("section", { className: "section gallery-section" },
          el("div", { className: "container" },
            el("div", { className: "section-heading-row" }, el("div", null,
              el("p", { className: "section-label" }, "Photos"),
              el("h2", null, "Selected images.")
            )),
            el("div", { className: "photo-gallery" }, list(home.gallery).map(function (item, index) {
              return el("figure", { className: "gallery-item", key: index },
                image(component, item.image, item.alt),
                item.caption ? el("figcaption", null, item.caption) : null
              );
            }))
          )
        ) : null,
        el("section", { className: "section container" },
          el("div", { className: "section-grid" },
            el("div", null, el("p", { className: "section-label" }, "03 / Now")),
            el("div", null,
              el("h2", null, "Current focus"),
              el("div", { className: "now-list" }, list(home.current_focus).map(function (item, index) {
                return el("div", { className: "now-item", key: index }, el("span", null, item.label), el("p", null, item.text));
              })),
              el("p", { className: "updated" }, "Last updated " + (home.last_updated || ""))
            )
          )
        )
      ),
      Footer()
    );
  }

  function CvPreview(data) {
    var cv = data.cv || {};
    function rows(items, titleKey, orgKey) {
      return list(items).map(function (item, index) {
        return el("div", { className: "cv-entry", key: index },
          el("div", { className: "cv-date" }, item.date),
          el("div", null,
            el("h3", null, item[titleKey]),
            el("p", { className: "cv-org" }, item[orgKey]),
            item.description || item.detail ? el("p", null, item.description || item.detail) : null
          )
        );
      });
    }
    return el("div", null,
      SiteHeader("cv"),
      el("main", null,
        el("section", { className: "page-hero container" },
          el("p", { className: "page-kicker" }, "Curriculum vitae"),
          el("div", { className: "page-title-row" }, el("h1", null, "Experience", el("br"), "& work."), el("p", { className: "page-intro" }, cv.profile))
        ),
        el("div", { className: "container preview-cv" },
          el("section", { className: "cv-section" }, el("h2", null, "Experience"), rows(cv.experience, "title", "organization")),
          el("section", { className: "cv-section" }, el("h2", null, "Education"), rows(cv.education, "degree", "institution")),
          el("section", { className: "cv-section" }, el("h2", null, "Publications"),
            el("ol", { className: "publication-list" }, list(cv.publications).map(function (item, index) {
              return el("li", { key: index }, el("span", null, item.title), " " + (item.citation || ""));
            }))
          )
        )
      ),
      Footer()
    );
  }

  function ProjectsPreview(component, data) {
    return el("div", null,
      SiteHeader("projects"),
      el("main", null,
        el("section", { className: "page-hero container" },
          el("p", { className: "page-kicker" }, "Projects & selected work"),
          el("div", { className: "page-title-row" }, el("h1", null, "Research made", el("br"), "visible."))
        ),
        el("section", { className: "container project-list" }, list(data.projects).map(function (item, index) {
          return el("article", { className: "project-row", key: index },
            el("div", { className: "project-meta" }, el("span", null, String(index + 1).padStart(2, "0")), el("span", null, [item.type, item.status].filter(Boolean).join(" · "))),
            el("div", null,
              image(component, item.image, item.image_alt || item.title, "project-image"),
              el("h2", null, item.title),
              el("p", null, item.description),
              el("div", { className: "tag-list" }, list(item.tags).map(function (tag) { return el("span", { key: tag }, tag); }))
            ),
            item.url ? el("span", { className: "project-arrow" }, "↗") : null
          );
        }))
      ),
      Footer()
    );
  }

  function MediaPreview(component, data) {
    return el("div", null,
      SiteHeader("media"),
      el("main", null,
        el("section", { className: "page-hero container" },
          el("p", { className: "page-kicker" }, "Podcasts, interviews & lectures"),
          el("div", { className: "page-title-row" }, el("h1", null, "Public", el("br"), "conversations."))
        ),
        el("section", { className: "container media-section" },
          el("div", { className: "filter-row" }, el("span", { className: "filter-button active" }, "All"), el("span", { className: "filter-button" }, "Podcasts"), el("span", { className: "filter-button" }, "Interviews"), el("span", { className: "filter-button" }, "Lectures")),
          el("div", { className: "media-list" }, list(data.media).map(function (item, index) {
            return el("article", { className: "media-row", key: index },
              el("div", null, el("span", { className: "media-type" }, item.category), el("span", { className: "media-date" }, item.date)),
              el("div", null, image(component, item.image, item.image_alt || item.title, "media-image"), el("h2", null, item.title), el("p", null, item.source)),
              item.url ? el("span", { className: "preview-link" }, (item.link_label || "Open") + " ↗") : null,
              item.video_url ? el("div", { className: "preview-video" }, el("span", null, "Video embed"), el("strong", null, item.video_url)) : null
            );
          }))
        )
      ),
      Footer()
    );
  }

  function ContactPreview(data) {
    var site = data.site || {};
    var contact = data.contact || {};
    return el("div", { className: "contact-page" },
      SiteHeader("contact"),
      el("main", { className: "contact-main" },
        el("section", { className: "contact-hero container" },
          el("p", { className: "page-kicker" }, "Contact"),
          el("div", { className: "contact-grid" },
            el("h1", null, "Let’s start a", el("br"), "conversation."),
            el("div", { className: "contact-copy" }, el("p", null, contact.introduction), el("div", { className: "contact-email" }, site.email || "Public email"))
          )
        ),
        el("section", { className: "container inquiry-grid" }, list(contact.inquiry_types).map(function (item, index) {
          return el("div", { className: "inquiry-card", key: index }, el("span", null, String(index + 1).padStart(2, "0")), el("h2", null, item.title), el("p", null, item.description));
        }))
      )
    );
  }

  var WebsitePreview = createClass({
    getInitialState: function () {
      return { page: "home" };
    },
    render: function () {
      var entryData = this.props.entry.get("data");
      var data = entryData && entryData.toJS ? entryData.toJS() : {};
      var page;
      if (this.state.page === "cv") page = CvPreview(data);
      else if (this.state.page === "projects") page = ProjectsPreview(this, data);
      else if (this.state.page === "media") page = MediaPreview(this, data);
      else if (this.state.page === "contact") page = ContactPreview(data);
      else page = HomePreview(this, data);
      return el("div", { className: "cms-preview" }, PreviewHeader(this), el("div", { className: "preview-canvas" }, page));
    }
  });

  CMS.registerPreviewStyle("../styles.css");
  CMS.registerPreviewStyle("preview.css");
  CMS.registerPreviewTemplate("content", WebsitePreview);
})();
