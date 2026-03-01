// app.js — Minimal, purposeful interactions

document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(
    ".hero-content, .hero-aside, .about-left, .about-right, " +
      ".domain-card, .brain-content, .experience-left, .exp-item, " +
      ".foundation-content, .foundation-quote",
  );

  reveals.forEach((el) => el.classList.add("reveal"));

  // Stagger logo items for cascade reveal
  document.querySelectorAll(".logo-item").forEach((el, i) => {
    el.style.setProperty("--i", i);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  reveals.forEach((el) => observer.observe(el));

  // Theme Toggle Logic
  const toggleBtn = document.querySelector(".theme-toggle");
  const htmlEl = document.documentElement;

  // Check saved theme explicitly
  const savedTheme = localStorage.getItem("theme");

  // Default to light mode heavily, unless user previously set 'dark'
  if (savedTheme === "dark") {
    htmlEl.setAttribute("data-theme", "dark");
  } else {
    htmlEl.removeAttribute("data-theme");
  }

  // Toggle handler
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentTheme = htmlEl.getAttribute("data-theme");
      if (currentTheme === "dark") {
        htmlEl.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        htmlEl.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }

  // Mobile Menu Logic
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = document.querySelector(".hamburger");
  const closeIcon = document.querySelector(".close-icon");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (mobileMenuBtn && mobileMenu) {
    function toggleMobileMenu() {
      const isActive = mobileMenu.classList.toggle("is-active");
      mobileMenuBtn.setAttribute("aria-expanded", isActive);
      // Lock background scrolling
      document.body.style.overflow = isActive ? "hidden" : "";
      // Swap icons
      if (hamburgerIcon)
        hamburgerIcon.style.display = isActive ? "none" : "block";
      if (closeIcon) closeIcon.style.display = isActive ? "block" : "none";
    }

    mobileMenuBtn.addEventListener("click", toggleMobileMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileMenu.classList.contains("is-active")) {
          toggleMobileMenu();
        }
      });
    });
  }

  // ————— Draggable Ping-Pong Marquee —————
  const track = document.querySelector(".logo-track");
  if (track) {
    let currentX = 0;
    let isDragging = false;
    let startX = 0;
    let initialX = 0;
    let speed = 0.8; // Idle scroll speed
    let direction = -1; // -1 = moving left, 1 = moving right
    let animationId;
    let trackWidth = 0;
    let parentWidth = 0;

    function measure() {
      trackWidth = track.scrollWidth;
      parentWidth = track.parentElement.clientWidth;
    }

    // Quick measure on load & resize
    window.addEventListener("load", measure);
    window.addEventListener("resize", measure);
    // Initial measurement
    measure();
    // Re-measure after fonts and layout settle
    setTimeout(measure, 500);

    function animate() {
      if (!isDragging) {
        currentX += speed * direction;
      }

      if (trackWidth > 0 && parentWidth > 0) {
        // Ping-Pong bounce logic (edges reach middle of screen exactly as requested)
        const leftBound = parentWidth / 2 - trackWidth;
        const rightBound = parentWidth / 2;

        if (currentX <= leftBound) {
          currentX = leftBound;
          direction = 1; // reverse to right
        } else if (currentX >= rightBound) {
          currentX = rightBound;
          direction = -1; // reverse to left
        }
      }

      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    // Stop fast loop on hover
    track.addEventListener("mouseenter", () => (speed = 0.2));
    track.addEventListener("mouseleave", () => {
      speed = 0.8;
      isDragging = false;
      track.style.cursor = "grab";
    });

    // Mouse Drag Events
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

      // Determine drag direction to set auto-scroll direction upon release
      if (walk !== 0) direction = walk > 0 ? 1 : -1;
    });

    // Touch Events for Mobile
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
  }
});
