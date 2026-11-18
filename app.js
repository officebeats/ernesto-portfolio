/**
 * app.js — Modern Portfolio Interactions
 * FAANG-grade performance with IntersectionObserver, theme toggle, and lightbox
 */

// Make openLightbox globally available for inline onclick handlers
window.openLightbox = function (src) {
  const lightbox = document.getElementById("img-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxVideo = document.getElementById("lightbox-video");

  if (!lightbox || !src) return;

  lightboxImg.src = src;
  lightboxImg.style.display = "block";
  lightboxVideo.style.display = "none";
  lightboxVideo.pause();

  lightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";
};

window.closeLightbox = function () {
  const lightbox = document.getElementById("img-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxVideo = document.getElementById("lightbox-video");

  if (!lightbox) return;

  lightbox.classList.remove("is-open");
  document.body.style.overflow = "";
  lightboxImg.src = "";
  lightboxVideo.pause();
  lightboxVideo.src = "";
};

// Wrap in IIFE to avoid global scope pollution
(() => {
  "use strict";

  // ============================================
  // DOM Ready — Initialize all functionality
  // ============================================
  const init = () => {
    initIntersectionObserver();
    initTheme();
    initMobileMenu();
    initLightbox();
    initServiceWorker();
    initLucideIcons();
    initHeroMotion();
    initImpactToggle();
    initBuilderLottie();
  };


  // ============================================
  // Hero Motion — Premium archetype (motion-design skill)
  // Count-up metrics + pointer parallax. Skipped entirely
  // under prefers-reduced-motion or on touch pointers.
  // ============================================
  const initHeroMotion = () => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Count-up: 950ms ease-out, formats preserved via data attributes.
    const values = hero.querySelectorAll(".metric-value[data-count]");
    if (values.length && !reduceMotion && "IntersectionObserver" in window) {
      const animate = (el) => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const comma = el.dataset.format === "comma";
        const start = performance.now();
        const dur = 950;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = Math.round(target * eased);
          el.textContent = (comma ? current.toLocaleString("en-US") : current) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      const counter = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => animate(entry.target), 350);
            counter.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      values.forEach((el) => counter.observe(el));
    }

    // Parallax: avatar follows at 6px, ambient layer counter-moves at 12px
    // (counter-motion rule). Lerped via rAF so it settles, never snaps.
    if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      const render = () => {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        hero.style.setProperty("--px", cx.toFixed(3));
        hero.style.setProperty("--py", cy.toFixed(3));
        if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
          raf = requestAnimationFrame(render);
        } else { raf = null; }
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(render); };
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        kick();
      });
      hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; kick(); });
    }
  };


  // ============================================
  // Impact (Career) — collapsed by default.
  // Expands on toggle, and auto-expands when a
  // visitor arrives via an #experience link.
  // ============================================
  const initImpactToggle = () => {
    const section = document.getElementById("experience");
    if (!section || section.hidden) return; // career section hidden by request — code kept, inert
    const button = section ? section.querySelector(".impact-toggle") : null;
    if (!section || !button) return;
    const label = button.querySelector(".impact-toggle-label");
    // Career history is not in the page source; it renders on first expand.
    const IMPACT_ITEMS = [
      {
            "time": "Aug 2026 — Present",
            "title": "Product Engagement Lead — Captios Partners",
            "body": "Product engagement leadership for enterprise clients — AI product strategy, delivery, and adoption across client product teams."
      },
      {
            "time": "Apr 2026 — Sep 2026",
            "title": "Product Lead (Contract) — MCG Health",
            "body": "Contract product lead at a healthcare information company — product strategy, roadmap, and delivery."
      },
      {
            "time": "Nov 2024 — Apr 2026",
            "title": "AI Product Lead — Ascension Health",
            "body": "Facilitated and aligned high-impact AI use cases across teams, prioritized by business impact and feasibility, and established the implementation roadmap for agentic AI (GCP, Vertex AI, Deepgram, atomic agents). Shipped messaging and knowledge-base products: <span class=\"impact-text\">+10% patient engagement, +20% support efficiency, −20% support ticket volume, +15% self-service rates, +10% NPS.</span>"
      },
      {
            "time": "Mar 2024 — Oct 2024",
            "title": "Head of Product — Route",
            "body": "Led product strategy and a team of 10 (2 PMs, 5 engineers, 1 designer): <span class=\"impact-text\">+25% monthly recurring revenue</span>, and landed a <span class=\"impact-text\">$500K Morgan Stanley investment</span> on the product growth strategy."
      },
      {
            "time": "Apr 2022 — Mar 2024",
            "title": "Senior Product Manager — BCG",
            "body": "Digital transformation for healthcare and energy clients: launched a self-serve portal (+50% operational efficiency), managed two FHIR data-store teams, and directed the Cerner/Athena EMR integration that raised the interoperability KPI by 40% over 18 months."
      },
      {
            "time": "Apr 2021 — Apr 2022",
            "title": "Senior Product Lead — Fetch Rewards",
            "body": "Led social and gamification features: MAU grew from 15M to 18M, engagement +10%, daily user retention +25%."
      },
      {
            "time": "Apr 2020 — Apr 2021",
            "title": "Senior Product Manager — LevelEx",
            "body": "Cut the discovery-to-development cycle from 12 weeks to 4, and launched a multiplayer product that lifted sales 20% after two years of stagnation."
      },
      {
            "time": "Jan 2019 — Mar 2020",
            "title": "Senior Product Owner — CoolerX",
            "body": "Scaled a retail pilot from 75 to 2,500 stores ahead of schedule, driving a 500% revenue increase; the flagship redesign grew impressions from 20M to 38.1M."
      },
      {
            "time": "Apr 2013 — Oct 2017",
            "title": "Technical Product Manager — PatientPoint",
            "body": "Led two touchscreen patient- and provider-facing products to 100% YoY revenue growth; shifted engineering in-house, improving product quality by 25%."
      }
];
    let rendered = false;
    const renderItems = () => {
      if (rendered) return;
      rendered = true;
      const list = section.querySelector(".experience-right");
      if (!list) return;
      IMPACT_ITEMS.forEach((item) => {
        const wrap = document.createElement("div");
        wrap.className = "exp-item stagger-item";
        const time = document.createElement("span");
        time.className = "exp-time";
        time.textContent = item.time;
        const body = document.createElement("div");
        const h3 = document.createElement("h3");
        h3.textContent = item.title;
        const p = document.createElement("p");
        p.innerHTML = item.body;
        body.append(h3, p);
        wrap.append(time, body);
        list.append(wrap);
      });
    };
    const setOpen = (open) => {
      if (open) renderItems();
      section.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Collapse career history" : "Expand career history";
    };
    button.addEventListener("click", () => setOpen(!section.classList.contains("is-open")));
    if (window.location.hash === "#experience") setOpen(true);
    document.querySelectorAll('a[href$="#experience"]').forEach((link) => {
      link.addEventListener("click", () => setOpen(true));
    });
  };


  // Builder section Lottie — persistent ambient loop.
  // Reduced motion: render the first frame, never play.
  const initBuilderLottie = () => {
    const stage = document.getElementById("builder-lottie");
    if (!stage || !window.lottie) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const anim = window.lottie.loadAnimation({
      container: stage, renderer: "svg", loop: true,
      autoplay: !reduceMotion, path: "builder-spark.json",
    });
    if (reduceMotion) anim.goToAndStop(0, true);
  };

  // Acoustic Material Registry
  const acoustic = {
    switch: new Audio("switch.mp3"),
  };

  // Keep the theme-toggle sound subtle.
  acoustic.switch.volume = 0.4;


  // ============================================
  // FAANG-Grade Intersection Observer
  // ============================================
  const initIntersectionObserver = () => {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: "0px 0px -5% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all reveal elements
    const targets = document.querySelectorAll(
      ".reveal, .reveal-blur, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .stagger-parent, .reveal-kinetic",
    );
    targets.forEach((target) => observer.observe(target));

    // Force reveal for above-fold content with a tiny safety delay
    const triggerInView = () => {
      const reveals = document.querySelectorAll(
        ".reveal, .reveal-blur, .reveal-left, .reveal-right, .stagger-parent",
      );
      reveals.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    };

    // Initial check
    triggerInView();
    // Safety check after load
    window.addEventListener("load", triggerInView);
  };

  // ============================================
  // Theme Toggle with localStorage persistence
  // ============================================
  const initTheme = () => {
    const toggleBtn = document.querySelector(".theme-toggle");
    const htmlEl = document.documentElement;

    // Check saved theme - default to dark mode
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme || savedTheme === "dark") {
      htmlEl.setAttribute("data-theme", "dark");
    } else {
      htmlEl.removeAttribute("data-theme");
    }

    if (!toggleBtn) return;

    toggleBtn.addEventListener(
      "click",
      () => {
        acoustic.switch.currentTime = 0;
        acoustic.switch.play().catch(() => {});

        const currentTheme = htmlEl.getAttribute("data-theme");
        if (currentTheme === "dark") {
          htmlEl.removeAttribute("data-theme");
          localStorage.setItem("theme", "light");
        } else {
          htmlEl.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
        }
      },
      { passive: true },
    );
  };

  // ============================================
  // Mobile Menu with accessibility
  // ============================================
  const initMobileMenu = () => {
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const hamburger = document.querySelector(".hamburger");
    const closeIcon = document.querySelector(".close-icon");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    if (!menuBtn || !mobileMenu) return;

    const toggleMenu = () => {
      const isActive = mobileMenu.classList.toggle("is-active");
      menuBtn.setAttribute("aria-expanded", isActive);
      mobileMenu.setAttribute("aria-hidden", !isActive);
      mobileMenu.inert = !isActive;
      document.body.style.overflow = isActive ? "hidden" : "";

      if (hamburger) hamburger.style.display = isActive ? "none" : "block";
      if (closeIcon) closeIcon.style.display = isActive ? "block" : "none";

      if (isActive) {
        mobileLinks[0]?.focus();
      } else {
        menuBtn.focus();
      }
    };

    menuBtn.addEventListener("click", toggleMenu, { passive: true });

    // Close menu on link click
    mobileLinks.forEach((link) => {
      link.addEventListener(
        "click",
        () => {
          if (mobileMenu.classList.contains("is-active")) {
            toggleMenu();
          }
        },
        { passive: true },
      );
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (!mobileMenu.classList.contains("is-active")) return;

      if (e.key === "Escape") {
        toggleMenu();
        return;
      }

      if (e.key !== "Tab" || mobileLinks.length === 0) return;

      const firstLink = mobileLinks[0];
      const lastLink = mobileLinks[mobileLinks.length - 1];
      if (!mobileMenu.contains(document.activeElement)) {
        e.preventDefault();
        firstLink.focus();
      } else if (e.shiftKey && document.activeElement === firstLink) {
        e.preventDefault();
        lastLink.focus();
      } else if (!e.shiftKey && document.activeElement === lastLink) {
        e.preventDefault();
        firstLink.focus();
      }
    });
  };

  // ============================================
  // Lightbox functionality
  // ============================================
  const initLightbox = () => {
    const lightbox = document.getElementById("img-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxVideo = document.getElementById("lightbox-video");
    const closeBtn = document.querySelector(".lightbox-close");
    const credItems = document.querySelectorAll(".cred-item");

    if (!lightbox) return;

    // Open lightbox on credential item click
    credItems.forEach((item) => {
      const openHandler = (e) => {
        e.preventDefault();
        const src = item.dataset.src;
        if (!src) return;

        lightboxImg.src = src;
        lightboxImg.style.display = "block";
        lightboxVideo.style.display = "none";
        lightboxVideo.pause();

        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";

        // Trap focus for accessibility
        closeBtn?.focus();
      };

      item.addEventListener("click", openHandler);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          openHandler(e);
        }
      });
    });

    // Close functions
    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      lightboxImg.src = "";
      lightboxVideo.pause();
      lightboxVideo.src = "";
    };

    // Close on button click
    closeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    // Close on backdrop click
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  };

  // ============================================
  // Service Worker Registration (PWA)
  // ============================================
  const initServiceWorker = () => {
    if (!("serviceWorker" in navigator)) return;

    const swVersion = "v2.8";

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(`./sw.js?${swVersion}`)
        .then((registration) => {
          console.log("Service Worker registered:", registration.scope);
          // Check for updates
          registration.update();
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  };

  // ============================================
  // Lucide Icons initialization
  // ============================================
  const initLucideIcons = () => {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  };

  // ============================================
  // Initialize when DOM is ready
  // ============================================
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// ============================================
// Draggable Ping-Pong Marquee
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".logo-track");
  if (!track) return;

  const mobileQuery = window.matchMedia("(max-width: 768px)");
  let currentX = 0;
  let isDragging = false;
  let startX = 0;
  let initialX = 0;
  let speed = 0.8;
  let direction = -1;
  let animationId = 0;
  let trackWidth = 0;
  let parentWidth = 0;

  const measure = () => {
    trackWidth = track.scrollWidth;
    parentWidth = track.parentElement.clientWidth;
  };

  const animate = () => {
    if (mobileQuery.matches) {
      animationId = 0;
      track.style.transform = "none";
      return;
    }

    if (!isDragging) currentX += speed * direction;

    if (trackWidth > 0 && parentWidth > 0) {
      const maxScroll = Math.max(0, trackWidth - parentWidth + 100);
      if (currentX <= -maxScroll) {
        currentX = -maxScroll;
        direction = 1;
      } else if (currentX >= 50) {
        currentX = 50;
        direction = -1;
      }
    }

    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    animationId = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    measure();
    if (mobileQuery.matches) {
      cancelAnimationFrame(animationId);
      animationId = 0;
      currentX = 0;
      isDragging = false;
      track.style.transform = "none";
      track.style.cursor = "default";
      document.body.style.userSelect = "";
    } else if (!animationId) {
      track.style.cursor = "grab";
      animationId = requestAnimationFrame(animate);
    }
  };

  measure();
  window.addEventListener("load", measure);
  window.addEventListener("resize", handleResize);
  if (!mobileQuery.matches) {
    let measureCount = 0;
    const measureInterval = setInterval(() => {
      measure();
      if (++measureCount > 10) clearInterval(measureInterval);
    }, 500);
    animationId = requestAnimationFrame(animate);
  } else {
    track.style.transform = "none";
    track.style.cursor = "default";
  }

  track.addEventListener("mouseenter", () => {
    if (!mobileQuery.matches) speed = 0.2;
  });
  track.addEventListener("mouseleave", () => {
    if (mobileQuery.matches) return;
    speed = 0.8;
    isDragging = false;
    track.style.cursor = "grab";
  });

  track.addEventListener("mousedown", (event) => {
    if (mobileQuery.matches) return;
    isDragging = true;
    startX = event.pageX;
    initialX = currentX;
    track.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  });
  window.addEventListener("mouseup", () => {
    if (mobileQuery.matches || !isDragging) return;
    isDragging = false;
    track.style.cursor = "grab";
    document.body.style.userSelect = "";
  });
  window.addEventListener("mousemove", (event) => {
    if (mobileQuery.matches || !isDragging) return;
    event.preventDefault();
    const walk = (event.pageX - startX) * 1.8;
    currentX = initialX + walk;
    if (walk !== 0) direction = walk > 0 ? 1 : -1;
  });

  track.addEventListener("touchstart", (event) => {
    if (mobileQuery.matches) return;
    isDragging = true;
    startX = event.touches[0].pageX;
    initialX = currentX;
  }, { passive: true });
  window.addEventListener("touchend", () => {
    if (!mobileQuery.matches) isDragging = false;
  });
  window.addEventListener("touchmove", (event) => {
    if (mobileQuery.matches || !isDragging) return;
    const walk = (event.touches[0].pageX - startX) * 1.8;
    currentX = initialX + walk;
    if (walk !== 0) direction = walk > 0 ? 1 : -1;
  }, { passive: true });
});
