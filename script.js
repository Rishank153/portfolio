const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

/* Mobile menu */
const hamburger = document.getElementById("hamburger");
let mobileMenu = null;

function buildMobileMenu() {
  if (mobileMenu) return mobileMenu;

  const overlay = document.createElement("div");
  overlay.className = "mobile-menu";
  overlay.id = "mobileMenu";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "mobile-menu-close";
  closeBtn.setAttribute("aria-label", "Close menu");
  closeBtn.textContent = "×";

  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Mobile");

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const a = document.createElement("a");
    a.href = link.getAttribute("href");
    a.textContent = link.textContent;
    a.addEventListener("click", closeMobileMenu);
    nav.appendChild(a);
  });

  closeBtn.addEventListener("click", closeMobileMenu);
  overlay.appendChild(closeBtn);
  overlay.appendChild(nav);
  document.body.appendChild(overlay);
  mobileMenu = overlay;
  return overlay;
}

function openMobileMenu() {
  buildMobileMenu().classList.add("open");
  document.body.style.overflow = "hidden";
  hamburger.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove("open");
  document.body.style.overflow = "";
  hamburger.setAttribute("aria-expanded", "false");
}

hamburger.addEventListener("click", () => {
  if (mobileMenu?.classList.contains("open")) closeMobileMenu();
  else openMobileMenu();
});

/* Typewriter */
const roles = [
  "Software Engineer",
  "Backend Developer",
  "Full-Stack Developer",
  "Competitive Programmer",
];

const typewriterEl = document.getElementById("typewriter");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeTick() {
  const current = roles[roleIndex];
  if (!deleting) {
    typewriterEl.textContent = current.slice(0, charIndex + 1);
    charIndex += 1;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeTick, 2000);
      return;
    }
    setTimeout(typeTick, 80);
  } else {
    typewriterEl.textContent = current.slice(0, charIndex - 1);
    charIndex -= 1;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeTick, 400);
      return;
    }
    setTimeout(typeTick, 40);
  }
}

setTimeout(typeTick, 800);

/* Scroll reveal */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".fade-in").forEach((el) => fadeObserver.observe(el));

/* Skill tag stagger */
const skillsPanel = document.querySelector(".skills-panel");
const tags = skillsPanel ? [...skillsPanel.querySelectorAll(".skill-tag")] : [];

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      tags.forEach((tag, index) => {
        tag.style.opacity = "0";
        tag.style.transform = "translateY(8px)";
        tag.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        requestAnimationFrame(() => {
          setTimeout(() => {
            tag.style.opacity = "1";
            tag.style.transform = "translateY(0)";
          }, index * 25);
        });
      });
      skillObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

if (skillsPanel) skillObserver.observe(skillsPanel);

/* CP counters */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el, target, duration) {
  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const value = Math.floor(easeOutCubic(t) * target);
    el.textContent = String(value);
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = String(target);
  }
  requestAnimationFrame(frame);
}

const programmingSection = document.getElementById("programming");
let cpCounted = false;

const cpObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || cpCounted) return;
      cpCounted = true;
      programmingSection.querySelectorAll(".cp-stat-value").forEach((el) => {
        animateCounter(el, parseInt(el.getAttribute("data-target"), 10), 1400);
      });
      cpObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.3 }
);

if (programmingSection) cpObserver.observe(programmingSection);

/* Active nav */
const sections = [...document.querySelectorAll("section[id]"), document.getElementById("footer")];
const navLinks = document.querySelectorAll(".nav-links a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.35 }
);

sections.forEach((section) => {
  if (section) navObserver.observe(section);
});

/* Smooth scroll */
const NAV_OFFSET = 72;

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    closeMobileMenu();
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
