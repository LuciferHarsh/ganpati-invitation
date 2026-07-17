(function () {
  "use strict";

  /* =========================================================
     Translations
     ========================================================= */
  var translations = {
    en: {
      gate_eyebrow: "Ganpati Bappa Morya",
      gate_title: "You Are Invited",
      gate_subtitle: "Ganpati Utsav · 14th September",
      gate_button: "Open the Invitation",
      gate_hint: "Tap to open the doors",
      shloka_meaning: "O Lord of the curved trunk, mighty in form, radiant as a million suns — please make all my endeavours free of obstacles, always.",
      photo_fallback: "Add Photo Here",
      inviter_line: "With the blessings of Ganpati Bappa, and joy in our hearts, we invite you to celebrate with",
      family_name: "Rajput Parivar",
      date_label: "Date",
      date_value: "Sunday, 14th September",
      venue_label: "Venue",
      venue_value: "Ganesh Chambers, Flat No. 11, Sangvi, Pune – 27",
      closing_message: "Your presence would mean the world to us, and turn this celebration into something truly complete. We look forward to sharing this happy occasion with you.",
      signature_label: "With warm regards",
      rsvp_button: "Accept the Invitation",
      rsvp_thanks: "Thank you for accepting! We're so glad you'll be with us — see you on 14th September.",
      back_button: "Back to Invitation"
    },
    mr: {
      gate_eyebrow: "गणपती बाप्पा मोरया",
      gate_title: "आपणास सादर निमंत्रण",
      gate_subtitle: "गणपती उत्सव · १४ सप्टेंबर",
      gate_button: "निमंत्रण उघडा",
      gate_hint: "दार उघडण्यासाठी स्पर्श करा",
      shloka_meaning: "वक्र तोंडाच्या, महाकाय, कोटी सूर्यांसमान तेजस्वी देवा, माझी सर्व कार्ये सदैव निर्विघ्न होऊ द्या.",
      photo_fallback: "इथे फोटो जोडा",
      inviter_line: "गणपती बाप्पांच्या आशीर्वादाने आणि मनात आनंद घेऊन, आम्ही आपणास या सोहळ्यात सामील होण्याचे सादर निमंत्रण देत आहोत",
      family_name: "राजपूत परिवार",
      date_label: "दिनांक",
      date_value: "रविवार, १४ सप्टेंबर",
      venue_label: "ठिकाण",
      venue_value: "गणेश चेंबर्स, फ्लॅट नं. ११, संगवी, पुणे – २७",
      closing_message: "आपली उपस्थिती आमच्यासाठी खूप मोलाची असेल आणि या सोहळ्याला खऱ्या अर्थाने पूर्णत्व देईल. आपणास भेटण्यास आम्ही उत्सुक आहोत.",
      signature_label: "सस्नेह",
      rsvp_button: "निमंत्रण स्वीकारा",
      rsvp_thanks: "स्वीकारल्याबद्दल धन्यवाद! आपण येणार याचा आम्हाला खूप आनंद आहे — १४ सप्टेंबरला भेटू.",
      back_button: "निमंत्रणाकडे परत जा"
    }
  };

  var currentLang = "en";

  function applyTranslations(lang) {
    var nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      var dict = translations[lang];
      if (dict && dict[key] !== undefined) {
        node.textContent = dict[key];
      }
    });
    document.documentElement.setAttribute("lang", lang === "mr" ? "mr" : "en");
  }

  function initLangToggle() {
    var btn = document.getElementById("langToggle");
    if (!btn) return;
    var enOpt = btn.querySelector(".lang-toggle__opt--en");
    var mrOpt = btn.querySelector(".lang-toggle__opt--mr");

    btn.addEventListener("click", function () {
      currentLang = currentLang === "en" ? "mr" : "en";
      applyTranslations(currentLang);
      enOpt.setAttribute("data-active", String(currentLang === "en"));
      mrOpt.setAttribute("data-active", String(currentLang === "mr"));
    });
  }

  /* =========================================================
     Floating marigold petals (ambient background)
     ========================================================= */
  function initPetals() {
    var field = document.getElementById("petalField");
    if (!field) return;
    var count = window.innerWidth < 600 ? 14 : 24;
    for (var i = 0; i < count; i++) {
      var petal = document.createElement("div");
      petal.className = "petal";
      var left = Math.random() * 100;
      var duration = 8 + Math.random() * 10;
      var delay = Math.random() * 12;
      var drift = (Math.random() * 80 - 40) + "px";
      var size = 6 + Math.random() * 8;
      var hue = Math.random() > 0.5 ? "#E8871E" : "#D4AF37";

      petal.style.left = left + "vw";
      petal.style.width = size + "px";
      petal.style.height = size + "px";
      petal.style.background = hue;
      petal.style.setProperty("--drift", drift);
      petal.style.animationDuration = duration + "s";
      petal.style.animationDelay = "-" + delay + "s";

      field.appendChild(petal);
    }
  }

  /* =========================================================
     Gate -> doors -> invitation reveal sequence (reversible)
     ========================================================= */
  function initGateSequence() {
    var openBtn = document.getElementById("openInviteBtn");
    var backBtn = document.getElementById("backBtn");
    var gate = document.getElementById("gate");
    var doors = document.getElementById("doors");
    var invite = document.getElementById("invite");
    if (!openBtn || !gate || !doors || !invite) return;

    var isAnimating = false;

    function openInvitation() {
      if (isAnimating || invite.hidden === false) return;
      isAnimating = true;

      gate.classList.add("is-hidden");
      invite.hidden = false;

      // Make the doors visible (closed) first, then trigger the open
      // transform on the next frame so the browser paints the closed
      // state before animating — otherwise the transition can be skipped.
      doors.classList.remove("is-gone");
      doors.classList.add("is-active");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          doors.classList.add("is-open");
        });
      });

      window.setTimeout(function () {
        doors.classList.add("is-gone");
        invite.scrollIntoView({ behavior: "smooth", block: "start" });
        initScrollReveal();
        isAnimating = false;
      }, 1150);
    }

    function backToGate() {
      if (isAnimating) return;

      invite.hidden = true;
      window.scrollTo(0, 0);

      // Reset doors so they're ready to animate again next time.
      doors.classList.remove("is-open", "is-active", "is-gone");

      // Reset section reveal state so the entrance replays on next open.
      document.querySelectorAll(".invite section, .invite .signature").forEach(function (s) {
        s.classList.remove("is-visible");
      });

      gate.classList.remove("is-hidden");
    }

    openBtn.addEventListener("click", openInvitation);
    if (backBtn) backBtn.addEventListener("click", backToGate);
  }

  /* =========================================================
     RSVP — accept invitation
     ========================================================= */
  function initRsvp() {
    var btn = document.getElementById("rsvpBtn");
    var thanks = document.getElementById("rsvpThanks");
    if (!btn || !thanks) return;

    btn.addEventListener("click", function () {
      btn.classList.add("is-fading");
      thanks.hidden = false;
      requestAnimationFrame(function () {
        thanks.classList.add("is-shown");
      });
      window.setTimeout(function () {
        btn.hidden = true;
      }, 300);
    });
  }

  /* =========================================================
     Scroll-triggered section reveal
     ========================================================= */
  function initScrollReveal() {
    var sections = document.querySelectorAll(".invite section, .invite footer");
    if (!("IntersectionObserver" in window)) {
      sections.forEach(function (s) { s.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* =========================================================
     Init
     ========================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    applyTranslations(currentLang);
    initLangToggle();
    initPetals();
    initGateSequence();
    initRsvp();
  });
})();
