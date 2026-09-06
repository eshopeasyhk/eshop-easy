(function () {
  "use strict";

  var BASE = (function () {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || "";
      var m = src.match(/^(.*\/)js\/content\.js(?:\?.*)?$/);
      if (m) return m[1];
    }
    var path = location.pathname || "";
    if (path.indexOf("/eshop-easy/") === 0) return "/eshop-easy/";
    return "./";
  })();

  function waUrl(digits, text) {
    var d = String(digits || "").replace(/\D/g, "");
    if (d.length === 8) d = "852" + d;
    var q = text ? "?text=" + encodeURIComponent(text) : "";
    return "https://wa.me/" + d + q;
  }

  function setText(sel, text) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (text != null) el.textContent = text;
    });
  }

  function setHtml(sel, html) {
    var el = document.querySelector(sel);
    if (el && html != null) el.innerHTML = html;
  }

  function applyTheme(theme) {
    if (!theme) return;
    var root = document.documentElement;
    var map = {
      paper: "--paper",
      sand: "--sand",
      ink: "--ink",
      teal: "--teal",
      tealDark: "--teal-dark",
      amber: "--amber",
      whatsapp: "--wa"
    };
    Object.keys(map).forEach(function (k) {
      if (theme[k]) root.style.setProperty(map[k], theme[k]);
    });
    if (theme.paper) {
      var tc = document.querySelector('meta[name="theme-color"]');
      if (tc) tc.setAttribute("content", theme.paper);
    }
  }

  function applyImages(images) {
    if (!images) return;
    if (images.logo) {
      var logoPath = BASE + images.logo.replace(/^\.\//, "");
      document.querySelectorAll(".brand img").forEach(function (img) {
        img.src = logoPath;
      });
    }
    if (images.og) {
      var ogUrl = new URL(images.og.replace(/^\.\//, ""), location.origin + BASE).href;
      var og = document.querySelector('meta[property="og:image"]');
      if (og) og.setAttribute("content", ogUrl);
      var tw = document.querySelector('meta[name="twitter:image"]');
      if (tw) tw.setAttribute("content", ogUrl);
    }
  }

  function applyMeta(meta) {
    if (!meta) return;
    if (meta.title) {
      document.title = meta.title;
      var ogt = document.querySelector('meta[property="og:title"]');
      if (ogt) ogt.setAttribute("content", meta.title);
      var twt = document.querySelector('meta[name="twitter:title"]');
      if (twt) twt.setAttribute("content", meta.title);
    }
    if (meta.description) {
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute("content", meta.description);
      var ogd = document.querySelector('meta[property="og:description"]');
      if (ogd) ogd.setAttribute("content", meta.description);
    }
  }

  function applyWaLinks(contact) {
    if (!contact || !contact.phoneDigits) return;
    var digits = String(contact.phoneDigits).replace(/\D/g, "");
    var intl = digits.length === 8 ? "852" + digits : digits;
    document.querySelectorAll("a[data-cms-wa], a[href*='wa.me']").forEach(function (a) {
      var text = a.getAttribute("data-cms-wa-text") || contact.waDefaultText || "";
      a.href = waUrl(contact.phoneDigits, text);
    });
    document.querySelectorAll("a[data-cms-tel], a[href^='tel:']").forEach(function (a) {
      a.href = "tel:+" + intl;
      if (a.hasAttribute("data-cms-tel")) {
        a.textContent = "+852 " + (contact.phoneDisplay || digits);
      }
    });
    setText("[data-cms='phoneDisplay']", contact.phoneDisplay || contact.phoneDigits);
    if (contact.facebookUrl) {
      document.querySelectorAll("[data-cms='facebookLink'], a[data-cms-fb]").forEach(function (a) {
        a.href = contact.facebookUrl;
      });
    }
    if (contact.facebookLabel) {
      setText("[data-cms='facebookLabel']", contact.facebookLabel);
      document.querySelectorAll("[data-cms='facebookLink']").forEach(function (a) {
        if (a.classList.contains("btn") || a.classList.contains("btn-fb")) {
          a.textContent = contact.facebookLabel;
        }
      });
    }
  }

  function renderPackages(packages, contact) {
    var grid = document.querySelector("[data-cms='packages']");
    if (!grid || !packages || !packages.length) return;
    var digits = (contact && contact.phoneDigits) || "46726613";
    grid.innerHTML = packages
      .map(function (p) {
        var featured = p.featured ? " featured" : "";
        var badge = p.badge ? '<p class="badge">' + escapeHtml(p.badge) + "</p>" : "";
        var priceInner = p.pricePrefix
          ? '<span class="from">' + escapeHtml(p.pricePrefix) + '</span><span class="currency">HK$</span>' + escapeHtml(p.price || "")
          : '<span class="currency">HK$</span>' + escapeHtml(p.price || "");
        var bullets = (p.bullets || [])
          .map(function (b) {
            return "<li>" + escapeHtml(b) + "</li>";
          })
          .join("");
        var href = waUrl(digits, p.waText || "");
        var btnClass = p.featured ? "btn btn-wa" : "btn btn-ghost";
        var btnLabel = p.id === "ios" ? "查詢報價" : "選擇此套餐";
        return (
          '<article class="price-card' +
          featured +
          '">' +
          badge +
          '<p class="price-name">' +
          escapeHtml(p.nameEn || "") +
          "</p>" +
          "<h3>" +
          escapeHtml(p.nameZh || "") +
          "</h3>" +
          '<p class="price">' +
          priceInner +
          "</p>" +
          '<p class="price-meta">' +
          escapeHtml(p.meta || "") +
          "</p>" +
          "<ul>" +
          bullets +
          "</ul>" +
          '<a class="' +
          btnClass +
          '" href="' +
          href +
          '" target="_blank" rel="noopener" data-cms-wa data-cms-wa-text="' +
          escapeAttr(p.waText || "") +
          '">' +
          btnLabel +
          "</a>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderFaq(faq) {
    var box = document.querySelector("[data-cms='faq']");
    if (!box || !faq || !faq.length) return;
    box.innerHTML = faq
      .map(function (item) {
        return (
          "<details><summary>" +
          escapeHtml(item.q || "") +
          "</summary><p>" +
          escapeHtml(item.a || "") +
          "</p></details>"
        );
      })
      .join("");
  }

  function renderChips(chips) {
    var el = document.querySelector("[data-cms='heroChips']");
    if (!el || !chips) return;
    el.innerHTML = chips
      .map(function (c) {
        return "<li>" + escapeHtml(c) + "</li>";
      })
      .join("");
  }

  function renderOffers(offers) {
    var el = document.querySelector("[data-cms='offers']");
    if (!el || !offers) return;
    el.innerHTML = offers
      .map(function (o, i) {
        var n = String(i + 1).padStart(2, "0");
        return (
          '<article class="offer-card"><span class="idx">' +
          n +
          "</span><h3>" +
          escapeHtml(o.title || "") +
          "</h3><p>" +
          escapeHtml(o.body || "") +
          "</p></article>"
        );
      })
      .join("");
  }

  function renderServiceCards(cards) {
    var el = document.querySelector("[data-cms='serviceCards']");
    if (!el || !cards) return;
    el.innerHTML = cards
      .map(function (c, i) {
        var n = String(i + 1).padStart(2, "0");
        return (
          '<article class="service-card"><span class="idx">' +
          n +
          "</span><h3>" +
          escapeHtml(c.title || "") +
          "</h3><p>" +
          escapeHtml(c.body || "") +
          "</p></article>"
        );
      })
      .join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function apply(data) {
    applyTheme(data.theme);
    applyImages(data.images);
    applyMeta(data.meta);
    applyWaLinks(data.contact);

    if (data.brand) {
      setText("[data-cms='brandZh']", data.brand.zh);
      setText("[data-cms='brandEn']", data.brand.en);
    }
    if (data.contact) {
      setText("[data-cms='contactTitle']", data.contact.title);
      setText("[data-cms='contactTagline']", data.contact.tagline);
    }
    if (data.hero) {
      setText("[data-cms='heroEyebrow']", data.hero.eyebrow);
      setText("[data-cms='heroLede']", data.hero.lede);
      renderChips(data.hero.chips);
    }
    if (data.about) {
      setText("[data-cms='aboutKicker']", data.about.kicker);
      setHtml("[data-cms='aboutHeading']", data.about.headingHtml);
      setText("[data-cms='aboutP1']", data.about.p1);
      setText("[data-cms='aboutP2']", data.about.p2);
      setText("[data-cms='aboutNote']", data.about.note);
    }
    setText("[data-cms='servicesLead']", data.servicesLead);
    renderOffers(data.offers);
    renderServiceCards(data.serviceCards);
    setText("[data-cms='pricingLead']", data.pricingLead);
    renderPackages(data.packages, data.contact);
    setText("[data-cms='maintenanceNote']", data.maintenanceNote);
    if (data.case) {
      setText("[data-cms='caseHeading']", data.case.heading);
      setText("[data-cms='caseP1']", data.case.p1);
      setText("[data-cms='caseP2']", data.case.p2);
      var btn = document.querySelector("[data-cms='caseButton']");
      if (btn) {
        btn.textContent = data.case.buttonLabel || btn.textContent;
        if (data.case.url) btn.href = data.case.url;
      }
      setText("[data-cms='caseCardTag']", data.case.cardTag);
      setText("[data-cms='caseCardTitle']", data.case.cardTitle);
      setText("[data-cms='caseCardBody']", data.case.cardBody);
      setText("[data-cms='caseCardUrl']", data.case.cardUrlLabel);
    }
    renderFaq(data.faq);
    if (data.contactSection) {
      setText("[data-cms='contactHeading']", data.contactSection.heading);
      setText("[data-cms='contactBody']", data.contactSection.body);
    }
    setText("[data-cms='footerTag']", data.footerTag);
  }

  window.EshopContent = { apply: apply, waUrl: waUrl, base: BASE };

  fetch(BASE + "data/site.json?_=" + Date.now())
    .then(function (r) {
      if (!r.ok) throw new Error("site.json " + r.status);
      return r.json();
    })
    .then(apply)
    .catch(function (err) {
      console.warn("[content.js]", err);
    });
})();
