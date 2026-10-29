const menu = document.querySelector(".menu-toggle");
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  document.querySelector("nav").classList.toggle("open", open);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu?.getAttribute("aria-expanded") === "true") {
    menu.click();
    menu.focus();
  }
});
document
  .querySelector(".copy-link:not(#clear-note):not(#mesh-pause)")
  ?.addEventListener("click", async (e) => {
    const b = e.currentTarget;
    try {
      await navigator.clipboard.writeText(location.href);
      b.textContent = "Link copied ✓";
      setTimeout(() => (b.textContent = "Copy link ↗"), 2000);
    } catch {
      b.textContent = "Copy the URL from your address bar";
    }
  });
let filter = "all";
const search = document.getElementById("post-search");
function filterPosts() {
  let count = 0;
  document.querySelectorAll("#posts .post-row").forEach((p) => {
    const show =
      (filter === "all" || p.dataset.category === filter) &&
      p.dataset.search.includes((search?.value || "").trim().toLowerCase());
    p.hidden = !show;
    if (show) count++;
  });
  document.getElementById("empty-posts").hidden = count !== 0;
  document.getElementById("post-count").textContent =
    `${count} ${count === 1 ? "post" : "posts"} · A few thoughts, with more to come.`;
}
document.querySelectorAll("[data-filter]").forEach((b) =>
  b.addEventListener("click", () => {
    filter = b.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((x) => {
      x.classList.toggle("active", x === b);
      x.setAttribute("aria-pressed", String(x === b));
    });
    filterPosts();
  }),
);
search?.addEventListener("input", filterPosts);
const pad = document.getElementById("scratchpad"),
  save = document.getElementById("save-state");
if (pad) {
  const storageKey = "portfolio-notebook-note";
  try {
    const savedNote = localStorage.getItem(storageKey);
    if (savedNote !== null) {
      pad.value = savedNote;
    } else {
      const legacyNote = localStorage.getItem("personal-space-note");
      if (legacyNote !== null) {
        pad.value = legacyNote;
        localStorage.setItem(storageKey, legacyNote);
        localStorage.removeItem("personal-space-note");
      }
    }
  } catch {
    save.textContent = "Storage unavailable. Notes last for this visit.";
  }
  pad.addEventListener("input", () => {
    try {
      localStorage.setItem(storageKey, pad.value);
      save.textContent = "Saved on this device.";
    } catch {
      save.textContent = "Storage unavailable. Copy your note before leaving.";
    }
  });
  let clearArmed = false,
    clearTimeoutId;
  document.getElementById("clear-note").addEventListener("click", (e) => {
    if (!pad.value) return;
    if (!clearArmed) {
      clearArmed = true;
      e.currentTarget.textContent = "Confirm clear";
      clearTimeoutId = setTimeout(() => {
        clearArmed = false;
        document.getElementById("clear-note").textContent = "Clear note";
      }, 4000);
      return;
    }
    clearTimeout(clearTimeoutId);
    clearArmed = false;
    pad.value = "";
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    save.textContent = "Note cleared.";
    e.currentTarget.textContent = "Clear note";
    pad.focus();
  });
}
const start = document.getElementById("timer-start");
if (start) {
  let remain = 25 * 60,
    running = false,
    deadline = 0,
    interval;
  const display = document.getElementById("timer-display"),
    state = document.getElementById("timer-state");
  function draw() {
    const min = String(Math.floor(remain / 60)).padStart(2, "0"),
      sec = String(remain % 60).padStart(2, "0");
    display.textContent = `${min}:${sec}`;
    document.title = running ? `${min}:${sec} — Orbit` : "Orbit — Portfolio";
  }
  function tick() {
    remain = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    draw();
    if (!remain) {
      running = false;
      clearInterval(interval);
      start.textContent = "Start again";
      state.textContent = "Session complete. Take a moment to step away.";
      document.title = "Session complete — Orbit";
    }
  }
  start.addEventListener("click", () => {
    if (running) {
      remain = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      running = false;
      clearInterval(interval);
      start.textContent = "Resume focus";
      state.textContent = "Paused. Your time is yours.";
      draw();
    } else {
      if (!remain) remain = 1500;
      running = true;
      deadline = Date.now() + remain * 1000;
      interval = setInterval(tick, 250);
      start.textContent = "Pause";
      state.textContent = "One thing at a time. You’ve got this.";
      tick();
    }
  });
  document.getElementById("timer-reset").addEventListener("click", () => {
    clearInterval(interval);
    running = false;
    remain = 1500;
    start.textContent = "Start focus";
    state.textContent = "Take a breath. Start when you’re ready.";
    draw();
  });
}
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
document.querySelectorAll("canvas[data-mesh]").forEach((canvas) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let w = 0,
    h = 0,
    dpr = 1,
    visible = true,
    paused = false,
    t = 0,
    shape = 0.5,
    pointer = { x: 0, y: 0 },
    last = 0;
  const isStatic = canvas.dataset.static === "true";
  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }
  function project(u, v) {
    const twist = u * 2 + Math.PI * 0.15;
    const radius =
      1 + 0.28 * Math.cos(v * 3 + u * 2 + t * 0.14) + 0.1 * shape * Math.sin(u * 4 - v * 2);
    let x = (2.3 + Math.cos(v) * radius) * Math.cos(u),
      y = (2.3 + Math.cos(v) * radius) * Math.sin(u),
      z = Math.sin(v) * radius;
    const morph = 0.28 + shape * 0.5;
    const yy = y * Math.cos(twist * 0.2 * morph) - z * Math.sin(twist * 0.2 * morph);
    z = y * Math.sin(twist * 0.2 * morph) + z * Math.cos(twist * 0.2 * morph);
    y = yy;
    const ry = 0.4 + pointer.x * 0.12 + t * 0.035,
      rx = 0.94 + pointer.y * 0.09,
      rz = -0.52;
    let ax = x * Math.cos(ry) + z * Math.sin(ry);
    z = -x * Math.sin(ry) + z * Math.cos(ry);
    x = ax;
    let ay = y * Math.cos(rx) - z * Math.sin(rx);
    z = y * Math.sin(rx) + z * Math.cos(rx);
    y = ay;
    ax = x * Math.cos(rz) - y * Math.sin(rz);
    y = x * Math.sin(rz) + y * Math.cos(rz);
    x = ax;
    const scale = Math.min(w / 7.7, h / 7.2);
    const perspective = 9 / (9 - z * 0.3);
    return { x: w * 0.5 + x * scale * perspective, y: h * 0.5 + y * scale * perspective, z };
  }
  function render() {
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const nu = 76,
      nv = 32;
    for (let k = 0; k < 2; k++) {
      const count = k ? nv : nu,
        steps = k ? nu : nv;
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        let depth = 0;
        for (let j = 0; j <= steps; j++) {
          const u = (k ? j / steps : i / count) * Math.PI * 2,
            v = (k ? i / count : j / steps) * Math.PI * 2,
            p = project(u, v);
          depth += p.z;
          j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
        }
        const alpha = 0.13 + Math.min(0.35, Math.max(0, (depth / (steps + 1) + 3) / 12));
        ctx.strokeStyle = `rgba(184,196,207,${alpha})`;
        ctx.lineWidth = k ? 0.55 : 0.7;
        ctx.stroke();
      }
    }
  }
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = (e.clientX - r.left) / w - 0.5;
    pointer.y = (e.clientY - r.top) / h - 0.5;
    if (reduceMotion.matches || isStatic) render();
  });
  canvas.addEventListener("pointerleave", () => {
    pointer = { x: 0, y: 0 };
    if (isStatic || reduceMotion.matches) render();
  });
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((entries) => (visible = entries[0].isIntersecting)).observe(canvas);
  function animate(now) {
    requestAnimationFrame(animate);
    if (
      now - last < 50 ||
      !visible ||
      document.hidden ||
      paused ||
      isStatic ||
      reduceMotion.matches
    )
      return;
    t += 0.035;
    last = now;
    render();
  }
  requestAnimationFrame(animate);
  if (canvas.id === "study-mesh") {
    document.getElementById("mesh-shape").addEventListener("input", (e) => {
      shape = Number(e.target.value) / 100;
      render();
    });
    const pb = document.getElementById("mesh-pause");
    if (reduceMotion.matches) {
      paused = true;
      pb.textContent = "Play motion";
      pb.setAttribute("aria-pressed", "true");
    }
    pb.addEventListener("click", () => {
      paused = !paused;
      pb.setAttribute("aria-pressed", String(paused));
      pb.textContent = paused ? "Play motion" : "Pause motion";
      if (!paused && reduceMotion.matches) {
        t += 1;
        render();
        pb.textContent = "Advance shape";
      }
    });
  }
});
