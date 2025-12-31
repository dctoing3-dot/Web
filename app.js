(() => {
  "use strict";

  const pad2 = (n) => String(n).padStart(2, "0");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (min, max) => Math.random() * (max - min) + min;

  const el = {
    badge: document.getElementById("badge"),
    title: document.getElementById("title"),
    subtitle: document.getElementById("subtitle"),
    d: document.getElementById("d"),
    h: document.getElementById("h"),
    m: document.getElementById("m"),
    s: document.getElementById("s"),
    burst: document.getElementById("burst"),
    toggle: document.getElementById("toggle"),
    foot: document.getElementById("foot"),
    nameA: document.getElementById("nameA"),
    nameB: document.getElementById("nameB"),
    romanceLine: document.getElementById("romanceLine"),
  };

  // Optional: set names from URL, example:
  // ?a=Rina&b=Andi
  const params = new URLSearchParams(location.search);
  const nameA = (params.get("a") || "Aku").trim().slice(0, 24);
  const nameB = (params.get("b") || "Kamu").trim().slice(0, 24);
  el.nameA.textContent = nameA || "Aku";
  el.nameB.textContent = nameB || "Kamu";

  // Countdown to Jan 1 next year (local time)
  const now = new Date();
  const nextYear = now.getFullYear() + 1;
  const target = new Date(nextYear, 0, 1, 0, 0, 0, 0);

  el.title.textContent = `Menuju ${nextYear}`;
  el.foot.textContent = `Happy New Year ${nextYear}`;

  let celebrated = false;

  function tickCountdown() {
    const t = new Date();
    let diff = target.getTime() - t.getTime();
    if (diff <= 0) diff = 0;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    el.d.textContent = pad2(days);
    el.h.textContent = pad2(hours);
    el.m.textContent = pad2(mins);
    el.s.textContent = pad2(secs);

    if (!celebrated && diff === 0) {
      celebrated = true;
      el.badge.textContent = "Selamat Tahun Baru!";
      el.title.textContent = `Happy New Year ${nextYear}`;
      el.subtitle.textContent = "Terima kasih sudah jadi rumah paling hangat—kita jalani tahun ini, bersama.";
      el.romanceLine.innerHTML =
        `<span class="names">${escapeHtml(nameA || "Aku")}</span> dan <span class="names">${escapeHtml(nameB || "Kamu")}</span>, ` +
        `kita peluk tahun baru dengan lembut—tanpa terburu-buru, tanpa ragu.`;
      burstShowtime(10_000);
      heartsShowtime(10_000);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Canvas FX
  const canvas = document.getElementById("fx");
  const ctx = canvas.getContext("2d", { alpha: true });

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  // kinds: 'spark' | 'heart'
  const particles = [];
  const rockets = [];

  let auto = !prefersReducedMotion;
  el.toggle.setAttribute("aria-pressed", String(auto));
  el.toggle.textContent = `Auto kembang api: ${auto ? "ON" : "OFF"}`;

  function makeRocket(x = rand(0.15, 0.85) * window.innerWidth) {
    rockets.push({
      x,
      y: window.innerHeight + 10,
      vx: rand(-0.6, 0.6),
      vy: rand(-10.5, -12.5),
      hue: rand(0, 360),
      targetY: rand(0.18, 0.5) * window.innerHeight,
    });
  }

  function explode(x, y, hue, power = 1) {
    const baseCount = prefersReducedMotion ? 18 : 70;
    const count = Math.floor(baseCount * clamp(power, 0.5, 2.2));
    const gravity = 0.085;

    for (let i = 0; i < count; i++) {
      const angle = Math.PI * 2 * (i / count) + rand(-0.08, 0.08);
      const speed = rand(2.4, 6.4) * power;
      particles.push({
        kind: "spark",
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: rand(0.010, 0.018),
        hue: (hue + rand(-25, 25) + 360) % 360,
        size: rand(1.2, 2.2) * (prefersReducedMotion ? 0.9 : 1),
        gravity
      });
    }
  }

  function drawHeartPath(c, size) {
    c.save();
    c.scale(size / 16, size / 16);
    c.beginPath();
    c.moveTo(0, 6);
    c.bezierCurveTo(0, 0, -8, 0, -8, 6);
    c.bezierCurveTo(-8, 10, -4, 12, 0, 16);
    c.bezierCurveTo(4, 12, 8, 10, 8, 6);
    c.bezierCurveTo(8, 0, 0, 0, 0, 6);
    c.closePath();
    c.restore();
  }

  function spawnHeart(x, y, power = 1) {
    const size = rand(8, 14) * clamp(power, 0.8, 1.8);
    particles.push({
      kind: "heart",
      x, y,
      vx: rand(-0.35, 0.35),
      vy: rand(-1.9, -0.9),
      life: 1,
      decay: rand(0.006, 0.012) * (prefersReducedMotion ? 1.2 : 1),
      hue: rand(325, 360),
      size,
      gravity: -0.004,
      wobble: rand(0, Math.PI * 2),
    });
  }

  function burstAt(x, y, power = 1.2) {
    const hue = rand(0, 360);
    explode(x, y, hue, power);
  }

  function draw() {
    // trails
    ctx.fillStyle = "rgba(7, 10, 22, 0.18)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.10;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${r.hue}, 95%, 70%, 0.95)`;
      ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = `hsla(${r.hue}, 95%, 65%, 0.35)`;
      ctx.lineWidth = 2;
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - r.vx * 3, r.y - r.vy * 3);
      ctx.stroke();

      if (r.y <= r.targetY || r.vy > -2) {
        explode(r.x, r.y, r.hue, rand(1.0, 1.8));
        if (!prefersReducedMotion && Math.random() < 0.65) {
          spawnHeart(r.x, r.y + 16, 1.0);
        }
        rockets.splice(i, 1);
      }
    }

    // particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      if (p.kind === "spark") {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.vy += p.gravity;

        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }

        const alpha = clamp(p.life, 0, 1);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 95%, 68%, ${alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        p.wobble += 0.05;
        p.x += p.vx + Math.sin(p.wobble) * 0.18;
        p.y += p.vy;
        p.vy += p.gravity;

        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }

        const alpha = clamp(p.life, 0, 1) * 0.9;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${alpha})`;
        drawHeartPath(ctx, p.size);
        ctx.fill();
        ctx.restore();
      }
    }

    // auto fireworks + gentle hearts
    if (auto) {
      if (Math.random() < (prefersReducedMotion ? 0.010 : 0.028)) makeRocket();

      const bottomX = window.innerWidth * 0.5;
      const bottomY = window.innerHeight * 0.86;
      if (Math.random() < (prefersReducedMotion ? 0.008 : 0.020)) {
        spawnHeart(bottomX + rand(-60, 60), bottomY + rand(-10, 10), 1.0);
      }
    }

    requestAnimationFrame(draw);
  }

  function burstShowtime(ms) {
    const end = performance.now() + ms;
    const interval = setInterval(() => {
      const x = rand(0.1, 0.9) * window.innerWidth;
      const y = rand(0.12, 0.55) * window.innerHeight;
      burstAt(x, y, rand(1.3, 2.0));
      if (!prefersReducedMotion) makeRocket(rand(0.15, 0.85) * window.innerWidth);

      if (performance.now() >= end) clearInterval(interval);
    }, prefersReducedMotion ? 320 : 170);
  }

  function heartsShowtime(ms) {
    const end = performance.now() + ms;
    const interval = setInterval(() => {
      const x = window.innerWidth * 0.5 + rand(-140, 140);
      const y = window.innerHeight * 0.72 + rand(-40, 40);
      spawnHeart(x, y, rand(1.0, 1.6));
      if (performance.now() >= end) clearInterval(interval);
    }, prefersReducedMotion ? 260 : 120);
  }

  // Interactions
  window.addEventListener("pointerdown", (e) => {
    const t = e.target;
    if (t && t.closest && t.closest("button")) return;

    burstAt(e.clientX, e.clientY, prefersReducedMotion ? 0.9 : 1.3);
    spawnHeart(
      e.clientX + rand(-10, 10),
      e.clientY + rand(10, 24),
      prefersReducedMotion ? 0.9 : 1.2
    );
  });

  el.burst.addEventListener("click", () => {
    const x = rand(0.2, 0.8) * window.innerWidth;
    const y = rand(0.15, 0.55) * window.innerHeight;
    burstAt(x, y, prefersReducedMotion ? 1.0 : 1.6);
    spawnHeart(x, y + 18, 1.4);
    makeRocket(x);
  });

  el.toggle.addEventListener("click", () => {
    auto = !auto;
    el.toggle.setAttribute("aria-pressed", String(auto));
    el.toggle.textContent = `Auto kembang api: ${auto ? "ON" : "OFF"}`;
  });

  // Start
  tickCountdown();
  setInterval(tickCountdown, 250);

  // opening vibe
  if (!prefersReducedMotion) {
    makeRocket(rand(0.2, 0.8) * window.innerWidth);
    setTimeout(() => makeRocket(rand(0.2, 0.8) * window.innerWidth), 650);
  }

  requestAnimationFrame(draw);
})();
