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
    initKineticEngine();
  };

  // Acoustic Material Registry
  const acoustic = {
    switch: new Audio("switch.mp3"),
    paper: new Audio("page-turn.mp3"),
    thud: new Audio("thud.mp3"),
  };

  // Set volumes for subtle micro-interactions
  acoustic.switch.volume = 0.4;
  acoustic.paper.volume = 0.25;
  acoustic.thud.volume = 0.3;

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
      document.body.style.overflow = isActive ? "hidden" : "";

      if (hamburger) hamburger.style.display = isActive ? "none" : "block";
      if (closeIcon) closeIcon.style.display = isActive ? "block" : "none";
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
      if (e.key === "Escape" && mobileMenu.classList.contains("is-active")) {
        toggleMenu();
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

    const swVersion = "v2.5";

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

  let currentX = 0;
  let isDragging = false;
  let startX = 0;
  let initialX = 0;
  let speed = 0.8;
  let direction = -1;
  let animationId;
  let trackWidth = 0;
  let parentWidth = 0;

  const measure = () => {
    trackWidth = track.scrollWidth;
    parentWidth = track.parentElement.clientWidth;
  };

  // Measure on load and resize
  if (document.readyState === "complete") {
    measure();
  } else {
    window.addEventListener("load", measure);
  }
  window.addEventListener("resize", measure);

  // Initial measurement with retry for images
  let measureCount = 0;
  const measureInterval = setInterval(() => {
    measure();
    if (++measureCount > 10) clearInterval(measureInterval);
  }, 500);

  const animate = () => {
    if (!isDragging) {
      currentX += speed * direction;
    }

    if (trackWidth > 0 && parentWidth > 0) {
      const maxScroll = Math.max(0, trackWidth - parentWidth + 100);
      const leftBound = -maxScroll;
      const rightBound = 50;

      if (currentX <= leftBound) {
        currentX = leftBound;
        direction = 1;
      } else if (currentX >= rightBound) {
        currentX = rightBound;
        direction = -1;
      }
    }

    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    animationId = requestAnimationFrame(animate);
  };

  animationId = requestAnimationFrame(animate);

  // Pause on hover
  track.addEventListener("mouseenter", () => (speed = 0.2));
  track.addEventListener("mouseleave", () => {
    speed = 0.8;
    isDragging = false;
    track.style.cursor = "grab";
  });

  // Mouse drag events
  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX;
    initialX = currentX;
    track.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      track.style.cursor = "grab";
      document.body.style.userSelect = "";
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const walk = (e.pageX - startX) * 1.8;
    currentX = initialX + walk;
    if (walk !== 0) direction = walk > 0 ? 1 : -1;
  });

  // Touch events for mobile
  track.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      startX = e.touches[0].pageX;
      initialX = currentX;
    },
    { passive: true },
  );

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  window.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const walk = (e.touches[0].pageX - startX) * 1.8;
      currentX = initialX + walk;
      if (walk !== 0) direction = walk > 0 ? 1 : -1;
    },
    { passive: true },
  );

  // ============================================
  // Kinetic Engine — Micro-Interactions 2026
  // ============================================
  const initKineticEngine = () => {
    // 1. Magnetic Gravity (CTAs)
    const magneticTargets = document.querySelectorAll(
      ".btn-primary, .btn-email, .mobile-cta, .nav-logo",
    );
    magneticTargets.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        if (!window.matchMedia("(hover: hover)").matches) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.setProperty("--mag-x", `${x * 0.35}px`);
        el.style.setProperty("--mag-y", `${y * 0.35}px`);
      });
      el.addEventListener("mouseleave", () => {
        el.style.setProperty("--mag-x", "0px");
        el.style.setProperty("--mag-y", "0px");
      });
    });

    // 2. 3D Tilt & Bloom (Cards)
    const tiltTargets = document.querySelectorAll(
      ".domain-card, .exp-item, .metric-card, .writing-card, .hobby-card",
    );
    tiltTargets.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        if (!window.matchMedia("(hover: hover)").matches) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--tilt-x", `${x * 5}deg`);
        el.style.setProperty("--tilt-y", `${-y * 5}deg`);
      });
      el.addEventListener("mouseleave", () => {
        el.style.setProperty("--tilt-x", "0deg");
        el.style.setProperty("--tilt-y", "0deg");
      });
    });

    // 3. Refractive Glare (Theme Toggle)
    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("mousemove", (e) => {
        if (!window.matchMedia("(hover: hover)").matches) return;
        const rect = themeToggle.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        themeToggle.style.setProperty("--glare-x", `${x}%`);
        themeToggle.style.setProperty("--glare-y", `${y}%`);
        themeToggle.style.setProperty("--glare-opacity", "1");
      });
      themeToggle.addEventListener("mouseleave", () => {
        themeToggle.style.setProperty("--glare-opacity", "0");
      });
    }

    // 4. Proximity Variable Typography (Scroll)
    const impactTexts = document.querySelectorAll(".impact-text");
    const updateImpact = () => {
      const vhCenter = window.innerHeight / 2;
      impactTexts.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(vhCenter - elCenter);
        const maxDist = window.innerHeight / 1.2;
        const proximity = Math.max(0, 1 - dist / maxDist);
        const weight = 400 + proximity * proximity * 300;
        el.style.setProperty("--impact-weight", Math.round(weight));
      });
    };

    // 5. Acoustic Scroll Anchor (Bottom Thud)
    let bottomReached = false;
    const checkBottom = () => {
      const scrollPos = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 5;
      if (scrollPos >= threshold && !bottomReached) {
        acoustic.thud.currentTime = 0;
        acoustic.thud.play().catch(() => {});
        bottomReached = true;
      } else if (scrollPos < threshold - 100) {
        bottomReached = false;
      }
    };

    // 6. Paper Expansion Sound (Interactive items)
    document
      .querySelectorAll(
        ".domain-card, .writing-card, .hobby-card, .nav-links a",
      )
      .forEach((el) => {
        el.addEventListener("mouseenter", () => {
          acoustic.paper.currentTime = 0;
          acoustic.paper.play().catch(() => {});
        });
      });

    window.addEventListener(
      "scroll",
      () => {
        requestAnimationFrame(() => {
          updateImpact();
          checkBottom();
        });
      },
      { passive: true },
    );

    // Initial check
    updateImpact();
  };
})();
