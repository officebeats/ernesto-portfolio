// app.js — Minimal, purposeful interactions

document.addEventListener("DOMContentLoaded", () => {
  // Scroll reveal — simple intersection observer
  const reveals = document.querySelectorAll(
    ".hero-content, .hero-aside, .about-left, .about-right, " +
      ".domain-card, .brain-content, .experience-left, .exp-item, " +
      ".logo-item, .foundation-content, .foundation-quote",
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
});
