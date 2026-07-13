const tracks = [
  { title: "The Eleventh Night", image: "assets/images/covers/eleventh-night.png", text: "Fire, memory and the sound of a Northern Irish summer night." },
  { title: "Shadows Don’t Sleep", image: "assets/images/covers/shadows-dont-sleep.png", text: "Some thoughts stay awake." },
  { title: "First Light", image: "assets/images/covers/first-light.png", text: "Every night ends somewhere." },
  { title: "Still Breathing", image: "assets/images/covers/still-breathing.png", text: "One more breath. One more chance." },
  { title: "Three Small Scars", image: "assets/images/covers/three-small-scars.png", text: "Proof that I survived." },
  { title: "Nobody Knows Me Yet", image: "assets/images/covers/nobody-knows-me-yet.png", text: "The story is still being written." },
  { title: "It Was Worth the Wait", image: "assets/images/covers/it-was-worth-the-wait.png", text: "Some dreams arrive a little late, but they arrive." }
];

const catalog = document.querySelector("#catalog-grid");
const gallery = document.querySelector("#gallery-grid");

tracks.forEach(track => {
  const card = document.createElement("article");
  card.className = "music-card reveal";
  card.innerHTML = `
    <img src="${track.image}" alt="${track.title} cover artwork">
    <div class="music-card-copy">
      <h3>${track.title}</h3>
      <p>${track.text}</p>
      <a class="btn btn-ghost platform-link" data-platform="spotify" href="#">Listen</a>
    </div>
  `;
  catalog.appendChild(card);

  const item = document.createElement("button");
  item.className = "gallery-item reveal";
  item.type = "button";
  item.innerHTML = `<img src="${track.image}" alt="${track.title} artwork">`;
  item.addEventListener("click", () => openLightbox(track.image, `${track.title} artwork`));
  gallery.appendChild(item);
});

document.querySelectorAll(".platform-link").forEach(link => {
  const key = link.dataset.platform;
  const target = window.WWILISS_LINKS?.[key] || "#";
  link.href = target;
  if (target !== "#") {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.addEventListener("click", event => {
      event.preventDefault();
      alert("This link is not connected yet. Add it in js/config.js");
    });
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const lightbox = document.querySelector("#lightbox");
const lightboxImg = lightbox.querySelector("img");
function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}
lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

const canvas = document.querySelector("#rain-canvas");
const ctx = canvas.getContext("2d");
let drops = [];
function resizeRain() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(180, Math.floor(innerWidth / 7));
  drops = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    len: 8 + Math.random() * 22,
    speed: 5 + Math.random() * 8,
    opacity: .08 + Math.random() * .22
  }));
}
function drawRain() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.lineWidth = 1;
  drops.forEach(drop => {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(245,235,210,${drop.opacity})`;
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x - 4, drop.y + drop.len);
    ctx.stroke();
    drop.y += drop.speed;
    drop.x -= .8;
    if (drop.y > innerHeight + 30) {
      drop.y = -30;
      drop.x = Math.random() * innerWidth;
    }
  });
  requestAnimationFrame(drawRain);
}
resizeRain();
drawRain();
addEventListener("resize", resizeRain);
