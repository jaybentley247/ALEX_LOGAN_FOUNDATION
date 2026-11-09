(function () {
  "use strict";

  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  /* ---- Translator (Google Translate, auto-detects visitor language) ---- */
  // [Google Translate code, native name, English name] — English first, then A–Z by English name
  const LANGS = [
    ["en", "English", "English"],
    ["af", "Afrikaans", "Afrikaans"], ["ak", "Akan / Twi", "Twi"], ["sq", "Shqip", "Albanian"],
    ["am", "አማርኛ", "Amharic"], ["ar", "العربية", "Arabic"], ["hy", "Հայերեն", "Armenian"],
    ["az", "Azərbaycan", "Azerbaijani"], ["eu", "Euskara", "Basque"], ["be", "Беларуская", "Belarusian"],
    ["bn", "বাংলা", "Bengali"], ["bs", "Bosanski", "Bosnian"], ["bg", "Български", "Bulgarian"],
    ["my", "မြန်မာ", "Burmese"], ["ca", "Català", "Catalan"], ["ceb", "Cebuano", "Cebuano"],
    ["ny", "Chichewa", "Chichewa"], ["zh-CN", "中文 (简体)", "Chinese Simplified"],
    ["zh-TW", "中文 (繁體)", "Chinese Traditional"], ["hr", "Hrvatski", "Croatian"],
    ["cs", "Čeština", "Czech"], ["da", "Dansk", "Danish"], ["nl", "Nederlands", "Dutch"],
    ["et", "Eesti", "Estonian"], ["ee", "Eʋegbe", "Ewe"], ["tl", "Filipino", "Filipino"],
    ["fi", "Suomi", "Finnish"], ["fr", "Français", "French"], ["ka", "ქართული", "Georgian"],
    ["de", "Deutsch", "German"], ["el", "Ελληνικά", "Greek"], ["gu", "ગુજરાતી", "Gujarati"],
    ["ht", "Kreyòl ayisyen", "Haitian Creole"], ["ha", "Hausa", "Hausa"], ["iw", "עברית", "Hebrew"],
    ["hi", "हिन्दी", "Hindi"], ["hu", "Magyar", "Hungarian"], ["is", "Íslenska", "Icelandic"],
    ["ig", "Igbo", "Igbo"], ["id", "Bahasa Indonesia", "Indonesian"], ["ga", "Gaeilge", "Irish"],
    ["it", "Italiano", "Italian"], ["ja", "日本語", "Japanese"], ["jw", "Basa Jawa", "Javanese"],
    ["kn", "ಕನ್ನಡ", "Kannada"], ["kk", "Қазақ", "Kazakh"], ["km", "ខ្មែរ", "Khmer"],
    ["rw", "Kinyarwanda", "Kinyarwanda"], ["ko", "한국어", "Korean"], ["ku", "Kurdî", "Kurdish"],
    ["lo", "ລາວ", "Lao"], ["lv", "Latviešu", "Latvian"], ["ln", "Lingála", "Lingala"],
    ["lt", "Lietuvių", "Lithuanian"], ["lg", "Luganda", "Luganda"], ["mk", "Македонски", "Macedonian"],
    ["mg", "Malagasy", "Malagasy"], ["ms", "Bahasa Melayu", "Malay"], ["ml", "മലയാളം", "Malayalam"],
    ["mt", "Malti", "Maltese"], ["mi", "Māori", "Maori"], ["mr", "मराठी", "Marathi"],
    ["mn", "Монгол", "Mongolian"], ["ne", "नेपाली", "Nepali"], ["no", "Norsk", "Norwegian"],
    ["om", "Afaan Oromoo", "Oromo"], ["ps", "پښتو", "Pashto"], ["fa", "فارسی", "Persian"],
    ["pl", "Polski", "Polish"], ["pt", "Português", "Portuguese"], ["pa", "ਪੰਜਾਬੀ", "Punjabi"],
    ["ro", "Română", "Romanian"], ["ru", "Русский", "Russian"], ["sm", "Gagana Sāmoa", "Samoan"],
    ["sr", "Српски", "Serbian"], ["st", "Sesotho", "Sesotho"], ["sn", "chiShona", "Shona"],
    ["si", "සිංහල", "Sinhala"], ["sk", "Slovenčina", "Slovak"], ["sl", "Slovenščina", "Slovenian"],
    ["so", "Soomaali", "Somali"], ["es", "Español", "Spanish"], ["sw", "Kiswahili", "Swahili"],
    ["sv", "Svenska", "Swedish"], ["tg", "Тоҷикӣ", "Tajik"], ["ta", "தமிழ்", "Tamil"],
    ["te", "తెలుగు", "Telugu"], ["th", "ไทย", "Thai"], ["ti", "ትግርኛ", "Tigrinya"],
    ["tr", "Türkçe", "Turkish"], ["uk", "Українська", "Ukrainian"], ["ur", "اردو", "Urdu"],
    ["uz", "Oʻzbek", "Uzbek"], ["vi", "Tiếng Việt", "Vietnamese"], ["cy", "Cymraeg", "Welsh"],
    ["xh", "isiXhosa", "Xhosa"], ["yo", "Yorùbá", "Yoruba"], ["zu", "isiZulu", "Zulu"]
  ];
  // Browser language codes that differ from Google Translate's codes
  const CODE_ALIASES = { he: "iw", fil: "tl", jv: "jw", nb: "no", nn: "no", tw: "ak" };
  const LANG_KEY = "alf-language";
  const langSelect = document.getElementById("langSelect");

  // Keep names, account numbers and wallet addresses untranslated
  document.querySelectorAll(".brand-text, .account-details dd span, .wallet-address, .coin, .method-icon")
    .forEach((el) => el.classList.add("notranslate"));

  const supported = (code) => LANGS.some(([c]) => c === code);
  const detectLanguage = () => {
    const prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
    for (const raw of prefs) {
      const full = raw.replace("_", "-");
      if (/^zh-(TW|HK|MO|Hant)/i.test(full)) return "zh-TW";
      if (/^zh/i.test(full)) return "zh-CN";
      let base = full.split("-")[0].toLowerCase();
      base = CODE_ALIASES[base] || base;
      if (supported(base)) return base;
    }
    return "en";
  };
  const savedLang = () => { try { return localStorage.getItem(LANG_KEY); } catch (_) { return null; } };
  const storeLang = (v) => { try { localStorage.setItem(LANG_KEY, v); } catch (_) { /* storage blocked */ } };

  const clearGoogTransCookie = () => {
    const expire = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = expire;
    if (location.hostname) {
      document.cookie = expire + "; domain=" + location.hostname;
      document.cookie = expire + "; domain=." + location.hostname.replace(/^www\./, "");
    }
  };

  let gtLoaded = false;
  let pendingLang = null;

  function applyToWidget(lang) {
    let tries = 0;
    const timer = setInterval(() => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        clearInterval(timer);
        // Google fills its language list lazily, so add the option if it isn't there yet
        if (![...combo.options].some((o) => o.value === lang)) {
          combo.add(new Option(lang, lang));
        }
        combo.value = lang;
        combo.dispatchEvent(new Event("change"));
      } else if (++tries > 50) {
        clearInterval(timer); // widget unavailable (offline or blocked)
      }
    }, 200);
  }

  window.googleTranslateElementInit = function () {
    /* global google */
    new google.translate.TranslateElement(
      { pageLanguage: "en", includedLanguages: LANGS.map(([c]) => c).join(","), autoDisplay: false },
      "google_translate_element"
    );
    if (pendingLang) applyToWidget(pendingLang);
  };

  function translateTo(lang) {
    if (lang === "en") {
      // Return to the original English page
      clearGoogTransCookie();
      if (document.documentElement.classList.contains("translated-ltr") ||
          document.documentElement.classList.contains("translated-rtl")) {
        location.reload();
      }
      return;
    }
    pendingLang = lang;
    // Google reads this cookie on start-up and translates the page automatically
    document.cookie = "googtrans=/en/" + lang + "; path=/";
    if (!gtLoaded) {
      gtLoaded = true;
      const s = document.createElement("script");
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    } else {
      applyToWidget(lang);
    }
  }

  if (langSelect) {
    langSelect.innerHTML = LANGS.map(([c, native, english]) =>
      `<option value="${c}">${native === english ? native : `${native} (${english})`}</option>`
    ).join("");
    const initial = savedLang() || detectLanguage();
    langSelect.value = supported(initial) ? initial : "en";
    if (langSelect.value !== "en") translateTo(langSelect.value);

    langSelect.addEventListener("change", () => {
      storeLang(langSelect.value);
      translateTo(langSelect.value);
    });
  }

  /* ---- Highlight the nav link for the current page ---- */
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  links.querySelectorAll("a:not(.btn)").forEach((a) => {
    if (a.getAttribute("href").toLowerCase() === current) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  /* ---- Mobile menu ---- */
  function closeMenu() {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ---- Navbar shadow on scroll ---- */
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Reveal on scroll ---- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---- Animated counters ---- */
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const duration = 1800;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".stat-num").forEach((el) => counterObserver.observe(el));

  /* ---- Receipt upload (Donate page) ---- */
  const receipt = document.getElementById("receipt");
  let resetUpload = () => {};
  let uploadValid = () => true;
  if (receipt) {
    const zone = document.getElementById("uploadZone");
    const preview = document.getElementById("uploadPreview");
    const thumb = document.getElementById("uploadThumb");
    const fileIcon = document.getElementById("uploadFileIcon");
    const nameEl = document.getElementById("uploadName");
    const sizeEl = document.getElementById("uploadSize");
    const errorEl = document.getElementById("uploadError");
    const removeBtn = document.getElementById("uploadRemove");
    const field = receipt.closest(".field");
    const MAX = 5 * 1024 * 1024;
    const TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    let thumbUrl = null;

    const formatSize = (b) => (b < 1024 * 1024 ? (b / 1024).toFixed(0) + " KB" : (b / 1024 / 1024).toFixed(1) + " MB");

    resetUpload = () => {
      receipt.value = "";
      if (thumbUrl) URL.revokeObjectURL(thumbUrl);
      thumbUrl = null;
      preview.hidden = true;
      zone.hidden = false;
      errorEl.textContent = "";
    };

    const showFile = (file) => {
      errorEl.textContent = "";
      field.classList.remove("error");
      if (!TYPES.includes(file.type)) {
        resetUpload();
        errorEl.textContent = "Please upload a PNG, JPG, WEBP or PDF file.";
        field.classList.add("error");
        return;
      }
      if (file.size > MAX) {
        resetUpload();
        errorEl.textContent = "That file is larger than 5MB. Please upload a smaller file.";
        field.classList.add("error");
        return;
      }
      if (thumbUrl) URL.revokeObjectURL(thumbUrl);
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        thumbUrl = URL.createObjectURL(file);
        thumb.src = thumbUrl;
      }
      thumb.hidden = !isImage;
      fileIcon.hidden = isImage;
      nameEl.textContent = file.name;
      sizeEl.textContent = formatSize(file.size);
      preview.hidden = false;
      zone.hidden = true;
    };

    uploadValid = () => {
      const ok = receipt.files.length > 0;
      field.classList.toggle("error", !ok);
      if (!ok) errorEl.textContent = "Please upload your payment receipt.";
      return ok;
    };

    receipt.addEventListener("change", () => {
      if (receipt.files[0]) showFile(receipt.files[0]);
    });
    removeBtn.addEventListener("click", () => {
      resetUpload();
      receipt.focus();
    });

    ["dragenter", "dragover"].forEach((ev) =>
      zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add("dragover"); })
    );
    ["dragleave", "drop"].forEach((ev) =>
      zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.remove("dragover"); })
    );
    zone.addEventListener("drop", (e) => {
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const dt = new DataTransfer();
      dt.items.add(file);
      receipt.files = dt.files;
      showFile(file);
    });
  }

  /* ---- Forms: contact, donation confirmation, bank account request ---- */
  // Each form has data-form="<type>" (and a matching hidden form_type field where needed):
  //   contact.html                      -> "contact"
  //   donate-paypal/bank/crypto.html    -> "donation-confirmation"
  //   donate-bank.html (request form)   -> "bank-account-request"
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.querySelectorAll("form.contact-form").forEach((form) => {
    const status = form.querySelector(".form-status");
    const hasUpload = !!form.querySelector('input[type="file"]');

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]:not([type=file])").forEach((input) => {
        const field = input.closest(".field");
        let ok;
        if (input.type === "checkbox") ok = input.checked;
        else if (input.type === "email") ok = emailRe.test(input.value.trim());
        else ok = input.value.trim() !== "";
        field.classList.toggle("error", !ok);
        if (!ok) valid = false;
      });
      if (hasUpload && !uploadValid()) valid = false;

      status.className = "form-status";
      if (!valid) {
        status.textContent = "Please fill in all required fields correctly.";
        status.classList.add("fail");
        return;
      }

      // TODO (backend): send `new FormData(form)` to your server here.
      // For data-form="bank-account-request": save it for the admin panel and
      // email it to the foundation's contact address.
      status.textContent = form.dataset.success || "Thank you! Your message has been received — we’ll be in touch soon.";
      status.classList.add("success");
      form.reset();
      if (hasUpload) resetUpload();
    });

    form.querySelectorAll("input:not([type=file]), textarea, select").forEach((input) => {
      const clear = () => input.closest(".field").classList.remove("error");
      input.addEventListener("input", clear);
      input.addEventListener("change", clear);
    });
  });

  /* ---- Copy-to-clipboard (Donate page) ---- */
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (_) { /* ignore */ }
    document.body.removeChild(ta);
  }
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        fallbackCopy(text);
      }
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      }, 1800);
    });
  });

  /* ---- Cookie consent ---- */
  const CONSENT_KEY = "alf-cookie-consent";
  const readConsent = () => { try { return localStorage.getItem(CONSENT_KEY); } catch (_) { return null; } };
  const saveConsent = (v) => { try { localStorage.setItem(CONSENT_KEY, v); } catch (_) { /* storage blocked */ } };

  // Other scripts (e.g. analytics) can check window.ALFConsent.get() === "allowed"
  // (returns null until the visitor accepts)
  // or listen for the "cookieconsent" event on document.
  window.ALFConsent = { get: readConsent };

  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.setAttribute("aria-labelledby", "cookieTitle");
  banner.setAttribute("aria-describedby", "cookieText");
  banner.innerHTML = `
    <div class="cookie-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M21.6 11.2a3 3 0 0 1-3.4-3.4 3 3 0 0 1-3.6-3.6A3 3 0 0 1 12.8 2 10 10 0 1 0 22 12c0-.3 0-.5-.4-.8zM8 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-1 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm1-6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>
    </div>
    <div class="cookie-copy">
      <h2 id="cookieTitle">We value your privacy</h2>
      <p id="cookieText">We use cookies to keep this site working smoothly and to understand how visitors use it, so we can improve our work. You can allow or deny non-essential cookies.</p>
    </div>
    <div class="cookie-actions">
      <button type="button" class="btn btn-ghost-dark btn-sm" data-consent="denied">Deny</button>
      <button type="button" class="btn btn-primary btn-sm" data-consent="allowed">Allow Cookies</button>
    </div>`;
  document.body.appendChild(banner);

  const showBanner = () => {
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add("show"));
  };
  const hideBanner = () => {
    banner.classList.remove("show");
    setTimeout(() => { banner.hidden = true; }, 400);
  };

  banner.querySelectorAll("[data-consent]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const choice = btn.dataset.consent;
      // Only "allowed" is remembered. Denying closes it for this page,
      // and the visitor is asked again on the next page load.
      if (choice === "allowed") saveConsent(choice);
      else { try { localStorage.removeItem(CONSENT_KEY); } catch (_) { /* storage blocked */ } }
      document.dispatchEvent(new CustomEvent("cookieconsent", { detail: choice }));
      hideBanner();
    })
  );

  banner.hidden = true;
  if (readConsent() !== "allowed") showBanner();

  // "Cookie Settings" link in the footer lets visitors change their choice later
  const footerBottom = document.querySelector(".footer-bottom p");
  if (footerBottom) {
    const settings = document.createElement("button");
    settings.type = "button";
    settings.className = "cookie-settings-link";
    settings.textContent = "Cookie Settings";
    settings.addEventListener("click", showBanner);
    footerBottom.append(" · ", settings);
  }

  /* ---- Footer year ---- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
