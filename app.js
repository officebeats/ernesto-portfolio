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
