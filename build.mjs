import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";

import { basePath, outputDirectory } from "./config.mjs";

const dist = outputDirectory;
mkdirSync(dist, { recursive: true });

const projects = [
  {
    slug: "orbit",
    name: "Orbit",
    category: "Productivity",
    description: "A little space to focus. A distraction-free timer for one thing at a time.",
    type: "Web app",
    year: "2026",
    color: "orbit",
    number: "01",
    detail:
      "Most productivity tools ask you to manage the tool before you can do the work. Orbit explores the opposite: one task, one timer, and just enough structure to begin.",
    body: "Choose something small and give it your attention for 25 minutes. The prototype below keeps everything in your browser. There are no accounts, dashboards, or streaks to maintain.",
  },
  {
    slug: "fieldnotes",
    name: "Fieldnotes",
    category: "Writing",
    description:
      "A quiet place for fleeting ideas, unfinished thoughts, and everything in between.",
    type: "Personal tool",
    year: "2026",
    color: "fieldnotes",
    number: "02",
    detail:
      "An idea rarely arrives fully formed. Fieldnotes is a small experiment in giving those early thoughts somewhere to land, without asking them to become anything yet.",
    body: "Try the scratchpad below. Your writing is saved on this device when browser storage is available. It stays here until you clear it; it is never sent to a server.",
  },
  {
    slug: "mesh",
    name: "Mesh studies",
    category: "Creative coding",
    description: "Finding unexpected forms at the intersection of mathematics and motion.",
    type: "Experiment",
    year: "2026",
    color: "mesh",
    number: "03",
    detail:
      "A study in how simple rules can create surprisingly organic forms. A grid becomes a surface, the surface folds, and a familiar shape starts to feel unfamiliar.",
    body: "This experiment draws a parametric surface directly on a canvas. Change the shape below to explore how a few numbers can change its character. Move your pointer over the surface to shift the perspective.",
  },
];

const posts = [
  {
    slug: "making-room",
    title: "Making room for the things that matter",
    category: "Thoughts",
    date: "October 20, 2026",
    short: "Oct 20, 2026",
    time: "3 min",
    description: "On doing less, paying attention, and leaving a little space for the unexpected.",
    paragraphs: [
      [
        "A little breathing room",
        "There is a particular kind of satisfaction in clearing a desk. The work has not changed, but the possibility of doing it feels different. Removing a few things can make the things that remain easier to see.",
      ],
      [
        "Attention has edges",
        "The same seems true of a day. When every gap has a purpose, there is little room for noticing. A walk becomes a call. A waiting room becomes an inbox. Even rest starts to look like a task to complete.",
        "I have been thinking about what happens when a small part of the day stays unassigned. There is no grand method behind it. Just a little room between the things that need doing.",
      ],
      [
        "Try leaving something open",
        "Choose one small space: a page, an afternoon, a corner of a room. Resist the urge to make it useful immediately. See what you notice when you are not trying to fill it.",
        "Perhaps making room is less about doing less and more about giving the things we choose a fair chance to matter.",
      ],
    ],
  },
  {
    slug: "small-tools",
    title: "A case for small, personal tools",
    category: "Building",
    date: "October 12, 2026",
    short: "Oct 12, 2026",
    time: "4 min",
    description: "The best software sometimes solves a very small problem for a single person.",
    paragraphs: [
      [
        "Start with a small friction",
        "A useful tool can begin with something ordinary: a note that is hard to find, a repeated calculation, a timer buried behind three menus. These are not always startup ideas. Sometimes they are simply reasons to make something.",
      ],
      [
        "Build the shortest path",
        "Imagine a tool that does exactly one thing. There is no onboarding journey because there is almost nothing to explain. The interface is a direct expression of the task.",
        "A good first version might be a single HTML file. It can live on your computer, work offline, and keep its data in your browser. The smaller the promise, the easier it is to keep.",
      ],
      [
        "Leave room to stop",
        "Personal software does not need a roadmap. When the problem is solved, it is fine to stop adding features. Maintenance is a real cost, even for a tool used by one person.",
        "Try making the smallest version of something you wish existed. Use it for a week. Let the friction you actually encounter guide the next change.",
      ],
    ],
  },
  {
    slug: "archlinux-arm",
    title: "Arch Linux ARM on a consumer laptop",
    category: "Process",
    date: "October 20, 2026",
    short: "Oct 20, 2026",
    time: "5 min",
    description: "Setting up Arch Linux ARM on a consumer laptop for personal use.",
    paragraphs: [
      [
        "A record of the middle",
        "Finished projects tend to hide the interesting part. The false starts, tiny discoveries, and questions that changed the direction disappear behind a polished result. A notebook can keep a little of that middle visible.",
      ],
      [
        "Write down one thing",
        "A useful note does not need to teach an entire subject. It might describe a bug, show a sketch, or ask a better question. Specificity matters more than scope.",
        "One way to begin is to answer three questions: What did I try? What surprised me? What would I try next? That is often enough to preserve something useful.",
      ],
      [
        "Let it be provisional",
        "Writing in public can make an unfinished idea feel strangely permanent. A date and a clear statement of uncertainty help. This is a record of what made sense at a moment in time.",
        "Over time, small notes form a map. The point is not to prove that you knew the way all along. It is to remember how you found it.",
      ],
    ],
  },
];

const arrow = '<span aria-hidden="true">↗</span>';

function currentAttr(path, href) {
  if (href === "/") return path === "/" ? ' aria-current="page"' : "";
  return path.startsWith(href) ? ' aria-current="page"' : "";
}

function shell(
  title,
  path,
  content,
  description = "A personal portfolio of selected projects, writing, and experiments.",
) {
  const nav = [
    ["Home", "/"],
    ["About", "/about/"],
    ["Projects", "/projects/"],
    ["Blogs", "/blogs/"],
    ["Notebook", "/notebook/"],
  ]
    .map(([name, href]) => `<a href="${href}"${currentAttr(path, href)}>${name}</a>`)
    .join("\n        ");

  const pageTitle = title === "Home" ? "Your Name — Portfolio" : `${title} — Your Name`;
  const ogType = path.startsWith("/blogs/") && path != "/blogs/" ? "article" : "website";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="#090a0b">
    <title>${pageTitle}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="${ogType}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/style.css">
    <script src="/app.js" defer></script>
  </head>
  <body>
    <a class="skip" href="#main">Skip to content</a>
    <header class="header">
      <a class="brand" href="/" aria-label="Your Name portfolio home">
        <span class="brand-icon" aria-hidden="true">✳</span> Your Name
      </a>
      <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="navigation">
        Menu <span aria-hidden="true">☰</span>
      </button>
      <nav id="navigation" aria-label="Main navigation">
        ${nav}
      </nav>
      <a class="header-note" href="/notebook/">
        A work in progress <span class="status-dot"></span>
      </a>
    </header>
    <main id="main">
      ${content}
    </main>
    <footer class="footer wrap">
      <div>
        <a class="footer-brand" href="/">Your Name</a>
        <p>Selected work, writing, and experiments.</p>
      </div>
      <div class="footer-right">
        <a href="/about/">About me ${arrow}</a>
        <span>© 2026 · Made with intention</span>
        <span class="sample-label">Portfolio template · Sample content</span>
      </div>
    </footer>
  </body>
</html>
`;
}

function write(path, title, content, description) {
  const target =
    path === "404"
      ? new URL("404.html", dist)
      : new URL(path ? path + "/index.html" : "index.html", dist);
  mkdirSync(new URL("./", target), { recursive: true });
  writeFileSync(
    target,
    shell(title, path === "404" ? "/404/" : "/" + (path ? path + "/" : ""), content, description)
      .replace(/((?:href|src)=")\/(?!\/)/g, `$1${basePath}/`),
  );
}

function sectionHead(num, title, link, url) {
  return `<div class="section-head">
    <div>
      <span class="eyebrow">${num}</span>
      <h2>${title}</h2>
    </div>
    ${link ? `<a class="text-link" href="${url}">${link} <span aria-hidden="true">↗</span></a>` : ""}
  </div>`;
}

function art(p) {
  if (p.slug === "orbit") {
    return `<div class="orbit-art">
      <div class="orbit-ring ring-one"></div>
      <div class="orbit-ring ring-two"></div>
      <div class="planet"></div>
      <span class="orbit-point"></span>
      <span class="art-caption">Less noise. More focus.</span>
    </div>`;
  }
  if (p.slug === "fieldnotes") {
    return `<div class="notes-art">
      <div class="paper paper-back"></div>
      <div class="paper">
        <span class="paper-label">FIELDNOTES / 001</span>
        <span class="paper-title">An idea starts<br>with a small note.</span>
        <i></i><i></i><i></i>
        <span class="paper-bottom">A place to begin. ↗</span>
      </div>
    </div>`;
  }
  return '<canvas class="project-mesh" data-mesh data-static="true" aria-hidden="true"></canvas>';
}

function card(p) {
  return `<a class="project-card" href="/projects/${p.slug}/">
    <div class="project-art ${p.color}">
      <span class="art-index">${p.number} / ${p.year}</span>
      ${art(p)}
      <span class="art-arrow" aria-hidden="true">↗</span>
    </div>
    <div class="card-heading">
      <h3>${p.name}</h3>
      <span>${p.type}</span>
    </div>
    <p>${p.description}</p>
  </a>`;
}

function row(p) {
  return `<a class="post-row" href="/blogs/${p.slug}/" data-category="${p.category.toLowerCase()}" data-search="${p.title.toLowerCase()} ${p.description.toLowerCase()}">
    <time>${p.short}</time>
    <div>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <span class="mobile-meta">${p.category} · ${p.time} read</span>
    </div>
    <span class="post-category">${p.category}</span>
    <span class="row-arrow" aria-hidden="true">↗</span>
  </a>`;
}

function demo(p) {
  if (p.slug === "orbit") {
    return `<div class="timer">
      <span class="eyebrow">ONE THING AT A TIME</span>
      <label class="sr-only" for="focus-task">Your focus task</label>
      <input id="focus-task" placeholder="What will you focus on?" maxlength="100">
      <span id="timer-display" role="timer" aria-label="Time remaining">25:00</span>
      <div>
        <button class="button button-light" id="timer-start">Start focus</button>
        <button class="button" id="timer-reset">Reset</button>
      </div>
      <p id="timer-state" aria-live="polite">Take a breath. Start when you’re ready.</p>
    </div>`;
  }
  if (p.slug === "fieldnotes") {
    return `<div class="scratchpad">
      <label class="eyebrow" for="scratchpad">A SMALL NOTE, A PLACE TO BEGIN</label>
      <textarea id="scratchpad" placeholder="What’s on your mind?"></textarea>
      <div>
        <span id="save-state" aria-live="polite">Saved on this device as you type.</span>
        <button class="copy-link" id="clear-note">Clear note</button>
      </div>
    </div>`;
  }
  return `<canvas data-mesh id="study-mesh" role="img" aria-label="Interactive silver wireframe surface"></canvas>
    <div class="mesh-controls">
      <label for="mesh-shape">Shape</label>
      <input type="range" id="mesh-shape" min="0" max="100" value="50">
      <button class="copy-link" id="mesh-pause" aria-pressed="false">Pause motion</button>
    </div>`;
}

function ideaHeading(slug) {
  if (slug === "orbit") return "A quieter kind of productivity.";
  if (slug === "fieldnotes") return "A home for unfinished thinking.";
  return "Simple rules. Unexpected forms.";
}

write(
  "",
  "Home",
  `<section class="hero wrap">
    <div class="hero-copy">
      <div class="eyebrow hero-kicker"><span class="status-dot"></span> PERSONAL PORTFOLIO</div>
      <h1>Selected work,<br>thoughtful <span>experiments.</span></h1>
      <p>A collection of projects, writing, and ideas<br class="desktop-break"> from my ongoing practice.</p>
      <div class="hero-actions">
        <a class="button button-light" href="/projects/">View selected work <span aria-hidden="true">↗</span></a>
        <a class="text-link" href="/about/">About me <span aria-hidden="true">→</span></a>
      </div>
    </div>
    <div class="hero-art">
      <canvas data-mesh id="hero-mesh" aria-label="A silver wireframe surface in three-dimensional space" role="img"></canvas>
      <div class="mesh-label">
        <span>FIG. 01 — AN EXERCISE IN CURIOSITY</span>
        <span>∞</span>
      </div>
    </div>
    <div class="hero-bottom">
      <a href="#selected">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
      <span>Always learning. Always making.</span>
    </div>
  </section>
  <div class="below-hero">
    <section class="section wrap" id="selected">
      ${sectionHead("01 / SELECTED WORK", "Things I’ve been making", "All projects", "/projects/")}
      <div class="project-grid">${projects.slice(0, 2).map(card).join("")}</div>
    </section>
    <section class="section wrap writing">
      ${sectionHead("02 / WORDS & IDEAS", "From the blog", "All writing", "/blogs/")}
      <div>${posts.map(row).join("")}</div>
    </section>
    <section class="notebook-callout wrap">
      <div>
        <span class="eyebrow">03 / IN THE MARGINS</span>
        <h2>Not everything needs<br>to be a finished thought.</h2>
        <p>Fragments, observations, and things worth remembering.</p>
      </div>
      <a class="button" href="/notebook/">Open the notebook ${arrow}</a>
      <span class="notebook-glyph" aria-hidden="true">✳</span>
    </section>
  </div>`,
);

write(
  "about",
  "About",
  `<div class="wrap page">
    <div class="page-intro">
      <span class="eyebrow">THE PERSON BEHIND THE PIXELS</span>
      <h1>A little about<br>the <span>person.</span></h1>
      <p>The person, practice, and<br>thinking behind the work.</p>
    </div>
    <div class="about-layout">
      <div class="about-art">
        <canvas data-mesh data-static="true" aria-hidden="true"></canvas>
        <span class="eyebrow">A CONSTANT WORK IN PROGRESS</span>
      </div>
      <div class="prose about-copy">
        <h2>Nice to have you here.</h2>
        <p>This portfolio brings together projects, writing, and experiments that reflect what I’m curious about and how I work.</p>
        <p>I enjoy making thoughtful digital work, exploring new ideas, and sharing what I learn along the way.</p>
        <h2>A few things you’ll find here</h2>
        <p><a href="/projects/">Projects</a> is a collection of small tools and experiments. <a href="/blogs/">The blog</a> makes room for longer thoughts. <a href="/notebook/">The notebook</a> is for everything that hasn’t quite found its shape yet.</p>
        <h2>Built to stay simple.</h2>
        <p>Clear type, considered details, and pages that load quickly and read comfortably. The site should get out of the way of the work.</p>
        <aside class="content-note">Make it yours: this is sample introductory copy. Replace it with your name, story, interests, and contact links in <code>build.mjs</code>.</aside>
      </div>
    </div>
  </div>`,
);

write(
  "projects",
  "Projects",
  `<div class="wrap page">
    <div class="page-intro">
      <span class="eyebrow">EXPERIMENTS, TOOLS & LITTLE OBSESSIONS</span>
      <h1>Things I’ve<br>been <span>making.</span></h1>
      <p>A few explorations in code, design, and useful simplicity.</p>
    </div>
    <div class="collection-bar">
      <span>SELECTED PROJECTS <span class="count">03</span></span>
      <span>2026 — ONGOING</span>
    </div>
    <div class="project-grid all-projects">${projects.map(card).join("")}</div>
    <p class="content-note">These are working concept projects included with this portfolio template. Open one to explore the live prototype.</p>
  </div>`,
);

write(
  "blogs",
  "Blogs",
  `<div class="wrap page">
    <div class="page-intro">
      <span class="eyebrow">A PLACE TO THINK OUT LOUD</span>
      <h1>Words, ideas,<br>and <span>in-betweens.</span></h1>
      <p>Notes on building things, paying attention, and figuring it out.</p>
    </div>
    <div class="filter-bar">
      <div class="filters" role="group" aria-label="Filter blog posts">
        <button class="filter active" data-filter="all" aria-pressed="true">All posts <span>03</span></button>
        <button class="filter" data-filter="building" aria-pressed="false">Building</button>
        <button class="filter" data-filter="thoughts" aria-pressed="false">Thoughts</button>
        <button class="filter" data-filter="process" aria-pressed="false">Process</button>
      </div>
      <label class="search">
        <span aria-hidden="true">⌕</span>
        <input type="search" id="post-search" placeholder="Find a post…" aria-label="Search blog posts">
      </label>
    </div>
    <div id="posts">${posts.map(row).join("")}</div>
    <p id="empty-posts" hidden>No posts found. Try a different search or category.</p>
    <p class="collection-end" id="post-count" aria-live="polite">3 posts · A few thoughts, with more to come.</p>
  </div>`,
);

for (const p of posts) {
  const body = p.paragraphs
    .map(
      ([heading, ...paras]) =>
        `<h2>${heading}</h2>\n        ${paras.map((t) => `<p>${t}</p>`).join("\n        ")}`,
    )
    .join("\n        ");
  write(
    "blogs/" + p.slug,
    p.title,
    `<article class="article wrap">
      <a class="back-link" href="/blogs/">← All writing</a>
      <div class="article-meta">
        <span>${p.category}</span>
        <span>${p.date}</span>
        <span>${p.time} read</span>
      </div>
      <h1>${p.title}</h1>
      <p class="article-deck">${p.description}</p>
      <div class="prose">
        ${body}
        <p class="content-note">Sample essay · Written for this portfolio template.</p>
      </div>
      <div class="article-bottom">
        <a href="/blogs/">← Back to the blog</a>
        <button class="copy-link">Copy link ↗</button>
      </div>
      <div class="related">
        <span class="eyebrow">KEEP READING</span>
        ${row(posts[(posts.indexOf(p) + 1) % posts.length])}
      </div>
    </article>`,
    p.description,
  );
}

const notes = [
  [
    "001",
    "Leave a little unfinished",
    "A thought",
    "An unfinished idea is an invitation. A sketch with rough edges gives you somewhere to go next. Not every thought needs to become a conclusion.",
  ],
  [
    "002",
    "Useful beats impressive",
    "A reminder",
    "The smallest tool that removes a real friction is often more interesting than the most elaborate system. Start with the thing you would actually use tomorrow.",
  ],
  [
    "003",
    "A reading list for a slower internet",
    "On the shelf",
    "A few starting points for thinking about attention, tools, and independent portfolios online.",
  ],
  [
    "004",
    "Look closer",
    "An observation",
    "A shadow moving across a wall. The rhythm of a familiar walk. The things we see every day are rarely the things we actually notice.",
  ],
  [
    "005",
    "Questions worth keeping",
    "Open questions",
    "What would this look like if it were simpler? What happens if I leave it alone for a week? Is there a smaller version I could finish today?",
  ],
];

const readingList = `<ul>
          <li><a href="https://www.are.na/" target="_blank" rel="noopener noreferrer">Are.na <span aria-hidden="true">↗</span></a> — collecting with intention</li>
          <li><a href="https://nownownow.com/" target="_blank" rel="noopener noreferrer">nownownow.com <span aria-hidden="true">↗</span></a> — a look at what people are doing now</li>
          <li><a href="https://www.gutenberg.org/" target="_blank" rel="noopener noreferrer">Project Gutenberg <span aria-hidden="true">↗</span></a> — a library to get lost in</li>
        </ul>`;

write(
  "notebook",
  "Notebook",
  `<div class="wrap page">
    <div class="page-intro">
      <span class="eyebrow">FRAGMENTS FROM THE EVERYDAY</span>
      <h1>A notebook,<br>with the <span>margins left in.</span></h1>
      <p>Small observations, open questions, and things worth keeping.</p>
    </div>
    <div class="collection-bar">
      <span>LOOSE LEAVES <span class="count">05</span></span>
      <span>NOTHING HERE NEEDS TO BE FINISHED</span>
    </div>
    <div class="notes-grid">${notes
      .map(
        ([n, t, k, b]) => `<article class="note" id="note-${n}">
        <div class="note-top">
          <span>${n} / ${k.toUpperCase()}</span>
          <a href="#note-${n}" aria-label="Link to ${t}">↗</a>
        </div>
        <h2>${t}</h2>
        <p>${b}</p>
        ${n === "003" ? readingList : ""}
        <span class="note-date">OCTOBER 2026</span>
      </article>`,
      )
      .join("")}
    </div>
    <p class="content-note">Sample notebook entries · A starting point for your own observations.</p>
  </div>`,
);

for (const p of projects) {
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  write(
    "projects/" + p.slug,
    p.name,
    `<div class="wrap project-detail">
      <a class="back-link" href="/projects/">← All projects</a>
      <div class="project-detail-heading">
        <div>
          <span class="eyebrow">${p.type.toUpperCase()} / ${p.year} / CONCEPT PROJECT</span>
          <h1>${p.name}<span>.</span></h1>
        </div>
        <span class="tag">Interactive prototype</span>
      </div>
      <p class="project-summary">${p.description}</p>
      <div class="demo ${p.color}">
        ${demo(p)}
      </div>
      <div class="project-body">
        <span class="eyebrow">THE IDEA</span>
        <div class="prose">
          <h2>${ideaHeading(p.slug)}</h2>
          <p>${p.detail}</p>
          <p>${p.body}</p>
          <div class="stack">
            <span>HTML</span>
            <span>CSS</span>
            <span>JavaScript</span>
            <span>${p.slug === "mesh" ? "Canvas API" : "Browser-native"}</span>
          </div>
        </div>
      </div>
      <div class="article-bottom">
        <a href="/projects/">← Back to projects</a>
        <a href="/projects/${next.slug}/">Next project →</a>
      </div>
    </div>`,
    p.description,
  );
}

write(
  "404",
  "Page not found",
  `<section class="not-found wrap">
    <span class="eyebrow">A SMALL DETOUR</span>
    <div class="error-code">404<span aria-hidden="true">✳</span></div>
    <h1>A little off the grid.</h1>
    <p>This page has wandered off, or it never existed.<br>There’s still plenty to explore.</p>
    <a class="button button-light" href="/">Back to home <span aria-hidden="true">↗</span></a>
    <a class="text-link" href="/notebook/">Or get lost in the notebook →</a>
  </section>`,
);

for (const f of ["style.css", "app.js", "favicon.svg"]) {
  copyFileSync(new URL("./" + f, import.meta.url), new URL(f, dist));
}
writeFileSync(new URL("robots.txt", dist), "User-agent: *\nAllow: /\n");
writeFileSync(new URL(".nojekyll", dist), "");
console.log(`Built ${6 + projects.length + posts.length} static pages, including a custom 404.`);
