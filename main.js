(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, ctx = document) => ctx.querySelector(s);

  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function setYear() {
    const el = $("#year");
    if (el) el.textContent = new Date().getFullYear();
  }

  const COLORS = ["#ff7a1a", "#ffb02e", "#e8b84b", "#c8102e", "#f3d98a", "#fff8ec"];
  function burst(opts) {
    if (reduceMotion || typeof confetti !== "function") return;
    confetti(Object.assign({ colors: COLORS, disableForReducedMotion: true }, opts));
  }

  function buildParticles() {
    if (reduceMotion) return;
    const wrap = $(".particles");
    if (!wrap) return;
    const count = window.innerWidth < 600 ? 16 : 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      const size = Math.random() * 8 + 4;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "vw";
      p.style.animationDuration = (Math.random() * 10 + 10) + "s";
      p.style.animationDelay = -(Math.random() * 20) + "s";
      p.style.opacity = (Math.random() * 0.5 + 0.3).toString();
      wrap.appendChild(p);
    }
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
  }

  function runIntro() {
    const overlay = $("#overlay");
    const content = $("#content");
    const txt = $("#rakhi-text");
    const word = "Happy Raksha Bandhan";

    const reveal = () => {
      overlay.classList.add("hide");
      content.classList.add("visible");
      buildParticles();
      initReveal();
      renderIcons();
      burst({ particleCount: 140, spread: 100, origin: { y: 0.15 } });
      setTimeout(() => {
        burst({ particleCount: 60, angle: 60, spread: 70, origin: { x: 0 } });
        burst({ particleCount: 60, angle: 120, spread: 70, origin: { x: 1 } });
      }, 250);
      setTimeout(() => overlay.remove(), 900);
    };

    if (reduceMotion) {
      txt.textContent = word;
      txt.classList.add("done");
      setTimeout(reveal, 400);
      return;
    }

    let i = 0;
    const type = setInterval(() => {
      if (i < word.length) {
        txt.textContent += word.charAt(i++);
      } else {
        clearInterval(type);
        txt.classList.add("done");
        setTimeout(reveal, 1200);
      }
    }, 90);
  }

  const LETTER_TITLE = "For You";
  const LETTER_BODY =
    "Happy Raksha Bandhan! Some bonds are not tied by blood, but by moments, care, and quiet understanding. You've always been a calm presence — someone who never needed to speak much, yet made things feel better just by being there. On this special day, I just want to thank you for being part of this journey. May your life always be filled with peace, love, and silent strength. No matter where life takes us, this thread of connection will always stay.";
const MEMORY_PHOTOS = [
  {
    src: "img/childhood/childhood1.jpg",
    category: "childhood",
    caption: "Childhood Partners"
  },
  {
    src: "img/childhood/childhood2.jpg",
    category: "childhood",
    caption: "Little Fights"
  },
  {
    src: "img/childhood/childhood3.jpg",
    category: "childhood",
    caption: "Pure Childhood"
  },
  {
    src: "img/old/old1.jpg",
    category: "old",
    caption: "Growing Together"
  },
  {
    src: "img/old/old2.jpg",
    category: "old",
    caption: "Old Smiles"
  },
  {
    src: "img/old/old3.jpg",
    category: "old",
    caption: "Same Bond"
  },
  {
    src: "img/recent/recent1.jpg",
    category: "recent",
    caption: "Still Together"
  },
  {
    src: "img/recent/recent2.jpg",
    category: "recent",
    caption: "Forever Connected"
  },
  {
    src: "img/recent/recent3.jpg",
    category: "recent",
    caption: "Rakhi Memories"
  }
];

function ensureMemoryLightbox() {
  let lightbox = $("#memoryLightbox");

  if (lightbox) return lightbox;

  lightbox = document.createElement("div");
  lightbox.className = "memory-lightbox";
  lightbox.id = "memoryLightbox";

  lightbox.innerHTML = `
    <div class="memory-lightbox-card">
      <button class="memory-lightbox-close" type="button" aria-label="Close memory">&times;</button>
      <img id="memoryLightboxImg" src="" alt="Selected memory">
      <p class="memory-lightbox-caption" id="memoryLightboxCaption"></p>
    </div>
  `;

  document.body.appendChild(lightbox);

  lightbox.addEventListener("click", (event) => {
    if (
      event.target === lightbox ||
      event.target.classList.contains("memory-lightbox-close")
    ) {
      closeMemoryLightbox();
    }
  });

  return lightbox;
}

function openMemoryLightbox(src, caption) {
  const lightbox = ensureMemoryLightbox();
  const img = $("#memoryLightboxImg");
  const text = $("#memoryLightboxCaption");

  img.src = src;
  img.alt = caption || "Sibling memory";
  text.textContent = caption || "Sibling memory";

  lightbox.classList.add("open");
}

function closeMemoryLightbox() {
  const lightbox = $("#memoryLightbox");
  const img = $("#memoryLightboxImg");

  if (!lightbox) return;

  lightbox.classList.remove("open");

  if (img) {
    img.src = "";
  }
}

function renderMemoryWall(category = "all") {
  const grid = $("#rakhiGallery");
  if (!grid) return;

  const photos =
    category === "all"
      ? MEMORY_PHOTOS
      : MEMORY_PHOTOS.filter((photo) => photo.category === category);

  grid.innerHTML = "";

  photos.forEach((photo) => {
    const card = document.createElement("figure");
    card.className = "gallery-card glass";

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = "lazy";

    const caption = document.createElement("figcaption");
    caption.textContent = photo.caption;

    img.addEventListener("click", () => {
      openMemoryLightbox(photo.src, photo.caption);
    });

    img.addEventListener("error", () => {
      card.remove();
    });

    card.appendChild(img);
    card.appendChild(caption);
    grid.appendChild(card);
  });
}

function initMemoryGallery() {
  const tabs = document.querySelectorAll(".memory-filter");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.getAttribute("data-filter");
      renderMemoryWall(category);
    });
  });

  renderMemoryWall("all");
}
  
  let timers = [];
  function clearTimers() {
    timers.forEach((t) => clearInterval(t));
    timers.forEach((t) => clearTimeout(t));
    timers = [];
  }

  function typeInto(el, text, speed, done) {
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
      } else {
        clearInterval(iv);
        if (done) done();
      }
    }, speed);
    timers.push(iv);
  }

  function openLetter() {
    const box = $(".box__letter");
    const border = $(".letter__border");
    const title = $(".title__letter");
    const body = $(".text__letter p");
    const media = [$("#heart__letter"), $(".love__img"), $("#mewmew")];
    const hearts = document.querySelectorAll(".heart");

    box.classList.add("open");
    burst({ particleCount: 90, spread: 80, origin: { y: 0.4 }, scalar: 0.9 });

    setTimeout(() => {
      border.style.display = "block";
      timers.push(setTimeout(() => typeInto(title, LETTER_TITLE, 90), 300));
      timers.push(setTimeout(() => media.forEach((m) => m && m.classList.add("animationOp")), 700));
      timers.push(setTimeout(() => hearts.forEach((h) => h.classList.add("animation")), 1300));
      timers.push(setTimeout(() => typeInto(body, LETTER_BODY, 26), 1800));
    }, 60);
  }

  function closeLetter() {
    clearTimers();
    const box = $(".box__letter");
    const border = $(".letter__border");
    $(".title__letter").textContent = "";
    $(".text__letter p").textContent = "";
    [$("#heart__letter"), $(".love__img"), $("#mewmew")].forEach((m) => m && m.classList.remove("animationOp"));
    document.querySelectorAll(".heart").forEach((h) => h.classList.remove("animation"));
    box.classList.remove("open");
    border.style.display = "none";
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderIcons();
    setYear();
    runIntro();
    initMemoryGallery();

    const btn = $("#btn");
    const close = $(".close");
    const box = $(".box__letter");
    if (btn) btn.addEventListener("click", openLetter);
    if (close) close.addEventListener("click", closeLetter);
    if (box) box.addEventListener("click", (e) => { if (e.target === box) closeLetter(); });
    document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
    closeLetter();
    closeMemoryLightbox();
  }
});
  });
})();
