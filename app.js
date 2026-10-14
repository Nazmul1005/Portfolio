import { profile } from './profile.js';
import { runCodingIntro } from './intro.js';
import { startSpectrumWallpaper } from './wallpaper.js';

const $ = (selector, root = document) => root.querySelector(selector);
const paths = {
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/>',
  folder: '<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  stack: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12c5 4 13 4 18 0M12 12v4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  terminal: '<path d="m5 5 6 6-6 6M13 18h7"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
  mouse: '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 2v7"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l4-4a5 5 0 0 0-7-7l-3 3M14 11a5 5 0 0 0-7 0l-4 4a5 5 0 0 0 7 7l3-3"/>',
  finder: '<path d="M12 3v9H9l1 9M5 15c4 3 10 3 14 0M7 7v2M17 7v2"/>',
  settings: '<circle cx="12" cy="12" r="4"/><path d="m12 2 1 3 3 1 3-1 1 3-2 2v3l2 2-1 3-3-1-3 1-1 3-3-1-1-3-3-1-2-2 2-3V9L3 7l3-2 3 1 2-3Z"/>',
  wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r="1"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const safeUrl = value => { try { const url = new URL(value, location.href); return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? escape(url.href) : ''; } catch { return ''; } };
const entries = [
  { id: 'about', file: 'about_me.txt', title: 'About me', icon: 'user' },
  { id: 'projects', file: 'projects.dir', title: 'All projects', icon: 'folder' },
  { id: 'skills', file: 'skills.stack', title: 'My toolkit', icon: 'stack' },
  { id: 'experience', file: 'experience.log', title: 'Experience & education', icon: 'briefcase' },
  { id: 'services', file: 'services.md', title: 'Services', icon: 'stack' },
  { id: 'contact', file: 'contact.card', title: 'Get in touch', icon: 'mail' },
  { id: 'terminal', file: 'terminal.sh', title: 'Terminal', icon: 'terminal' }
];
document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));
$('#profile-name').innerHTML = `${escape(profile.name)}<span class="accent">.</span>`;
$('#brand-name').textContent = 'Finder';
$('#profile-role').textContent = profile.role + (profile.location ? ` · ${profile.location}` : '');
$('#profile-bio').textContent = profile.bio;
$('#availability').textContent = profile.availability;
$('#projects-count').textContent = `${profile.projects.length} public repositories`;
$('#avatar').innerHTML = `${profile.avatar && safeUrl(profile.avatar) ? `<img src="${safeUrl(profile.avatar)}" alt="${escape(profile.name)}" width="72" height="72" referrerpolicy="no-referrer">` : escape(profile.initials)}<span class="avatar-dot"></span>`;
$('#avatar img')?.addEventListener('error', event => event.target.replaceWith(document.createTextNode(profile.initials)), { once: true });
document.title = `${profile.name} — ${profile.role}`;
document.querySelector('meta[name="description"]').content = `${profile.name} — ${profile.role}. ${profile.bio}`;
const links = [['Email', profile.email ? `mailto:${profile.email}` : '', 'mail'], ['GitHub', profile.github, 'link'], ['LinkedIn', profile.linkedin, 'link'], ['Resume', profile.resume, 'file'], ...(profile.socials || []).map(social => [social.label, social.url, 'link'])].filter(([, url]) => url && safeUrl(url));
const introLinks = links.filter(([label]) => ['Email', 'GitHub', 'LinkedIn', 'Resume'].includes(label));
$('#intro-links').innerHTML = introLinks.length ? introLinks.map(([name, url, symbol]) => `<a href="${safeUrl(url)}" ${url.startsWith('mailto:') ? '' : 'target="_blank" rel="noopener noreferrer"'}>${icon(symbol)}${name} ↗</a>`).join('') : '<span class="tiny-label">A SMALL WINDOW INTO MY WORLD</span>';
const appLabel = entry => ({ projects: 'Projects', skills: 'Skills', experience: 'Education', contact: 'Contact' }[entry.id] || entry.title);
$('#desktop-icons').innerHTML = entries.map(entry => `<button class="desktop-file" data-open="${entry.id}" aria-label="Open ${entry.title}"><span class="file-image app-icon app-${entry.id}">${icon(entry.icon)}</span><small>${escape(appLabel(entry))}</small></button>`).join('');
$('#dock-apps').innerHTML = entries.map(entry => `<button class="dock-item" data-open="${entry.id}" data-dock="${entry.id}" aria-label="Open ${entry.title}"><span class="app-icon app-${entry.id}">${icon(entry.icon)}</span><span class="dock-tooltip">${escape(appLabel(entry))}</span><span class="dock-dot"></span></button>`).join('');
function finderSidebar(active) {
  return `<span class="sidebar-heading">Favorites</span><button class="sidebar-item ${active === 'welcome' ? 'selected' : ''}" data-open="welcome">${icon('user')}<span>Nazmul Islam</span></button>${entries.filter(entry => entry.id !== 'terminal').map(entry => `<button class="sidebar-item ${active === entry.id ? 'selected' : ''}" data-open="${entry.id}">${icon(entry.icon)}<span>${escape(appLabel(entry))}</span></button>`).join('')}<span class="sidebar-heading sidebar-location">Applications</span><button class="sidebar-item" data-open="terminal">${icon('terminal')}<span>Terminal</span></button><div class="sidebar-footer">${escape(profile.location)}</div>`;
}
$('#welcome-sidebar').innerHTML = finderSidebar('welcome');

let topLayer = 20;
let activeWindow = 'welcome';
const windows = new Map([['welcome', $('#welcome-window')]]);
const empty = (title, text) => `<div class="empty-state"><h3>${title}</h3><p>${text}</p></div>`;
const sectionIntro = (label, title) => `<span class="tiny-label">${label}</span><h2>${title}</h2>`;
function projectCards(query = '', category = '') {
  const term = query.trim().toLowerCase();
  const matches = profile.projects.filter(project => (!category || project.category === category) && `${project.title} ${project.repository} ${project.description} ${(project.tags || []).join(' ')}`.toLowerCase().includes(term));
  const cards = matches.map(project => `<article class="project-card" data-repository="${escape(project.repository)}"><div class="project-card-top"><span class="tiny-label">${escape(project.category || 'Project')}</span>${project.fork ? '<span class="project-fork">Fork</span>' : ''}</div><h3>${escape(project.title)}</h3><span class="project-repository">${escape(project.repository)}</span><p>${escape(project.description)}</p><div class="skill-list">${(project.tags || []).map(tag => `<span class="skill">${escape(tag)}</span>`).join('')}</div><div class="project-links">${[[project.fork ? 'Upstream site' : 'Live site', project.url], ['GitHub', project.github]].filter(([, url]) => url && safeUrl(url)).map(([label, url]) => `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join('')}</div></article>`).join('');
  return { count: matches.length, html: cards || empty('No matching projects', 'Try another name or technology, or choose a different category.') };
}
function content(id) {
  switch (id) {
    case 'about': return sectionIntro('THE PERSON BEHIND THE CODE', `Hello, I’m ${escape(profile.name)}.`) + `<p>${escape(profile.bio)}</p><p>${escape(profile.about)}</p><div class="skill-list">${[profile.location, profile.university].filter(Boolean).map(value => `<span class="skill">${escape(value)}</span>`).join('')}</div><button class="section-button" data-open="services">Explore my services ↗</button>`;
    case 'projects': return sectionIntro('IDEAS → REALITY', 'All my projects.') + `<p>Web apps, machine learning, games, and experiments from my GitHub.</p><div class="project-controls"><label><span class="tiny-label">SEARCH PROJECTS</span><input class="project-search" type="search" placeholder="Name, language, or technology" aria-label="Search projects"></label><label><span class="tiny-label">CATEGORY</span><select class="project-filter" aria-label="Project category"><option value="">All repositories</option>${[...new Set(profile.projects.map(project => project.category).filter(Boolean))].map(category => `<option value="${escape(category)}">${escape(category)}</option>`).join('')}</select></label></div><p class="project-count" role="status">${profile.projects.length} repositories · ${profile.projects.filter(project => project.fork).length} forks</p><div class="projects-grid">${projectCards().html}</div>`;
    case 'skills': return sectionIntro('TOOLS OF THE TRADE', 'My toolkit.') + ((profile.skillGroups || []).length ? profile.skillGroups.map(group => `<section class="skill-group"><h3>${escape(group.title)}</h3><div class="skill-list">${group.skills.map(skill => `<span class="skill">${escape(skill)}</span>`).join('')}</div></section>`).join('') : profile.skills.length ? `<div class="skill-list">${profile.skills.map(skill => `<span class="skill">${escape(skill)}</span>`).join('')}</div>` : empty('A toolkit, uniquely yours', 'Add your languages, frameworks, and favorite tools in profile.js.'));
    case 'experience': return sectionIntro('THE JOURNEY SO FAR', 'Learning & education.') + (profile.education || []).map(item => `<article class="project-card"><span class="tiny-label">EDUCATION</span><h3>${escape(item.institution)}</h3><p>${escape(item.description)}</p></article>`).join('') + profile.experience.map(job => `<article class="project-card"><span class="tiny-label">${escape(job.period)}</span><h3>${escape(job.role)}</h3><p>${escape(job.company)}</p><p>${escape(job.description)}</p></article>`).join('') + ((profile.journey || []).length ? `<section class="journey"><h3>My learning timeline</h3>${profile.journey.map(item => `<div class="journey-item"><span class="tiny-label">${escape(item.period)}</span><p>${escape(item.title)}</p></div>`).join('')}</section>` : '');
    case 'services': return sectionIntro('LET’S BUILD SOMETHING TOGETHER', 'How I can help.') + (profile.services || []).map(service => `<article class="project-card service-card"><h3>${escape(service.title)}</h3><p>${escape(service.description)}</p><ul>${service.features.map(feature => `<li>${escape(feature)}</li>`).join('')}</ul></article>`).join('') + '<button class="section-button" data-open="contact">Discuss a project ↗</button>';
    case 'contact': return sectionIntro('GOOD THINGS START WITH A HELLO', 'Let’s connect.') + `<p>Have an idea, a question, or something you’d like to build together?</p>${profile.location ? `<p class="contact-location">Based in ${escape(profile.location)}</p>` : ''}` + (links.length ? links.map(([label, url, symbol]) => `<a class="contact-link" href="${safeUrl(url)}" ${url.startsWith('mailto:') ? '' : 'target="_blank" rel="noopener noreferrer"'}>${icon(symbol)}<span>${escape(label)}${label === 'Email' ? `<small>${escape(profile.email)}</small>` : ''}</span><span style="margin-left:auto">↗</span></a>`).join('') : empty('Open for a hello', 'Add your email and social links in profile.js to enable contact links.'));
    case 'terminal': return `<div class="terminal-session"><span class="terminal-status" role="status">STARTUP SESSION</span><button class="terminal-demo-control" type="button">Skip animation</button></div><div class="terminal-output"></div><form class="terminal-form"><span>visitor ~ $</span><input aria-label="Terminal command" autocomplete="off" spellcheck="false" placeholder="Type help to explore"></form>`;
  }
}
function refreshTasks() {
  document.querySelectorAll('[data-dock]').forEach(button => {
    const win = windows.get(button.dataset.dock);
    button.classList.toggle('running', Boolean(win));
    button.classList.toggle('active', Boolean(win && !win.classList.contains('minimized') && button.dataset.dock === activeWindow));
  });
}
function focusWindow(win) {
  windows.forEach(window => window.classList.remove('window-active'));
  win.classList.add('window-active');
  win.style.zIndex = ++topLayer;
  activeWindow = win.dataset.window;
  $('#brand-name').textContent = activeWindow === 'terminal' ? 'Terminal' : 'Finder';
  refreshTasks();
}
function openWindow(id, { focus = true } = {}) {
  if (windows.has(id)) { const win = windows.get(id); win.classList.remove('minimized'); focusWindow(win); if (focus) win.focus({ preventScroll: true }); return; }
  if (id === 'welcome') { const win = $('#welcome-window'); win.classList.remove('minimized'); windows.set(id, win); focusWindow(win); if (focus) win.focus({ preventScroll: true }); return; }
  const entry = entries.find(item => item.id === id);
  if (!entry) return;
  const win = document.createElement('section');
  win.className = `window content-window${id === 'terminal' ? ' terminal-window' : id === 'projects' ? ' projects-window' : ''}`;
  win.dataset.window = id;
  win.tabIndex = -1;
  win.setAttribute('aria-label', entry.title);
  const body = `<div class="window-content ${id === 'terminal' ? 'terminal-content' : ''}">${content(id)}</div>`;
  win.innerHTML = `<header class="window-bar"><div class="window-actions"><button data-action="close" aria-label="Close ${entry.title}"><span>×</span></button><button data-action="minimize" aria-label="Minimize ${entry.title}"><span>−</span></button><button data-action="maximize" aria-label="Maximize ${entry.title}"><span>⤢</span></button></div><span class="window-title">${icon(entry.icon)} ${escape(appLabel(entry))}</span><span class="window-bar-detail">${id === 'terminal' ? 'zsh' : 'Finder'}</span></header>${id === 'terminal' ? body : `<div class="finder-layout"><aside class="finder-sidebar" aria-label="Finder sidebar">${finderSidebar(id)}</aside>${body}</div>`}`;
  $('#desktop').append(win);
  windows.set(id, win);
  attachWindow(win, id);
  focusWindow(win);
  refreshTasks();
  if (id === 'terminal') setupTerminal(win);
  if (id === 'projects') {
    const updateProjects = () => {
      const result = projectCards($('.project-search', win).value, $('.project-filter', win).value);
      $('.projects-grid', win).innerHTML = result.html;
      $('.project-count', win).textContent = `${result.count} of ${profile.projects.length} repositories`;
    };
    $('.project-search', win).addEventListener('input', updateProjects);
    $('.project-filter', win).addEventListener('change', updateProjects);
  }
  if (focus) win.focus({ preventScroll: true });
}
function attachWindow(win, id) {
  win.addEventListener('pointerdown', () => focusWindow(win));
  win.addEventListener('focusin', () => focusWindow(win));
  win.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'minimize') win.classList.add('minimized');
    if (action === 'maximize') win.classList.toggle('maximized');
    if (action === 'close') { if (id === 'welcome') win.classList.add('minimized'); else win.remove(); windows.delete(id); }
    if (action) {
      if (action === 'close' || action === 'minimize') {
        const next = [...windows.values()].filter(window => !window.classList.contains('minimized')).sort((a, b) => Number(b.style.zIndex || 10) - Number(a.style.zIndex || 10))[0];
        if (next) focusWindow(next);
        else { activeWindow = null; $('#brand-name').textContent = 'Finder'; }
      }
      refreshTasks();
    }
  });
  const bar = $('.window-bar', win);
  bar.addEventListener('pointerdown', event => {
    if (event.target.closest('button, select') || win.classList.contains('maximized') || matchMedia('(max-width:760px)').matches) return;
    const initial = win.getBoundingClientRect();
    const desktop = $('#desktop').getBoundingClientRect();
    const startX = event.clientX, startY = event.clientY;
    bar.setPointerCapture(event.pointerId);
    const move = event => {
      win.style.left = Math.max(0, Math.min(desktop.width - initial.width, initial.left - desktop.left + event.clientX - startX)) + 'px';
      win.style.top = Math.max(0, Math.min(desktop.height - 120, initial.top - desktop.top + event.clientY - startY)) + 'px';
    };
    const stop = () => { bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', stop); bar.removeEventListener('pointercancel', stop); };
    bar.addEventListener('pointermove', move); bar.addEventListener('pointerup', stop); bar.addEventListener('pointercancel', stop);
  });
}
attachWindow($('#welcome-window'), 'welcome');
refreshTasks();
document.addEventListener('click', event => {
  const id = event.target.closest('[data-open]')?.dataset.open;
  if (id) openWindow(id);
  const task = event.target.closest('[data-task]')?.dataset.task;
  if (task) openWindow(task);
  document.querySelectorAll('.mac-menu[open]').forEach(menu => {
    if (!menu.contains(event.target) || event.target.closest('button')) menu.open = false;
  });
});
document.querySelectorAll('.mac-menu').forEach(menu => menu.addEventListener('toggle', () => {
  if (menu.open) document.querySelectorAll('.mac-menu').forEach(other => { if (other !== menu) other.open = false; });
}));
document.addEventListener('keydown', event => { if (event.key === 'Escape') document.querySelectorAll('.mac-menu').forEach(menu => menu.open = false); });
$('.brand').addEventListener('click', event => { event.preventDefault(); openWindow('welcome'); });
$('#home-button').addEventListener('click', () => openWindow('welcome'));
$('#reset-desktop').addEventListener('click', () => {
  [...windows].forEach(([id, win]) => { if (id !== 'welcome') win.remove(); });
  windows.clear();
  const win = $('#welcome-window'); win.classList.remove('minimized', 'maximized'); win.removeAttribute('style'); windows.set('welcome', win); focusWindow(win);
});

function setupTerminal(win) {
  const form = $('.terminal-form', win), input = $('input', form), output = $('.terminal-output', win);
  const status = $('.terminal-status', win), demoControl = $('.terminal-demo-control', win);
  const scroller = output;
  const history = []; let position = 0;
  let demoTimer, demoRunning = false, demoLine = 0, demoCharacter = 0, currentLine;
  const demoLines = [
    ['command', 'nazmul ~ $ node workspace.js'],
    ['comment', '// A little introduction, written in code.'],
    ['code', 'const developer = {'],
    ['code', `  name: ${JSON.stringify(profile.name)},`],
    ['code', `  role: ${JSON.stringify(profile.role)},`],
    ...(profile.university ? [['code', `  university: ${JSON.stringify(profile.university)},`]] : []),
    ['code', '  curiosity: Infinity'],
    ['code', '};'],
    ['code', 'await workspace.mount(developer);'],
    ['success', '[ok] about_me.txt loaded'],
    ['success', `[ok] ${profile.projects.length} public repositories mounted`],
    ['success', '[ok] terminal ready — make yourself at home.']
  ];
  function appendLine(text, kind = '') {
    const line = document.createElement('p');
    line.className = kind ? `terminal-${kind}` : '';
    line.textContent = text;
    output.append(line);
    scroller.scrollTop = scroller.scrollHeight;
    return line;
  }
  function stopDemo() {
    clearTimeout(demoTimer);
    const wasRunning = demoRunning;
    demoRunning = false;
    currentLine?.classList.remove('terminal-typing');
    win.classList.remove('terminal-running');
    status.textContent = 'READY / INTERACTIVE';
    demoControl.textContent = 'Replay intro';
    return wasRunning;
  }
  function finishDemo() {
    if (!demoRunning) return;
    if (currentLine) currentLine.textContent = demoLines[demoLine][1];
    for (let index = demoLine + (currentLine ? 1 : 0); index < demoLines.length; index++) {
      appendLine(demoLines[index][1], demoLines[index][0]);
    }
    stopDemo();
    scroller.scrollTop = scroller.scrollHeight;
  }
  function tickDemo() {
    if (!win.isConnected) { stopDemo(); return; }
    if (!demoRunning) return;
    if (demoLine >= demoLines.length) { stopDemo(); return; }
    const [kind, text] = demoLines[demoLine];
    if (!currentLine) {
      currentLine = appendLine('', kind);
      currentLine.classList.add('terminal-typing');
    }
    currentLine.textContent = text.slice(0, ++demoCharacter);
    scroller.scrollTop = scroller.scrollHeight;
    if (demoCharacter >= text.length) {
      currentLine.classList.remove('terminal-typing');
      currentLine = null;
      demoCharacter = 0;
      demoLine++;
      demoTimer = setTimeout(tickDemo, kind === 'command' ? 350 : 160);
    } else {
      demoTimer = setTimeout(tickDemo, kind === 'success' ? 9 : 22);
    }
  }
  function startDemo() {
    stopDemo();
    output.replaceChildren();
    demoLine = 0; demoCharacter = 0; currentLine = null; demoRunning = true;
    win.classList.add('terminal-running');
    status.textContent = 'TYPING / WORKSPACE.JS';
    demoControl.textContent = 'Skip animation';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) finishDemo();
    else tickDemo();
  }
  demoControl.addEventListener('click', () => demoRunning ? finishDemo() : startDemo());
  input.addEventListener('focus', () => {
    if (stopDemo()) appendLine('Intro paused. Type help for commands.', 'comment');
  });
  win.addEventListener('click', event => {
    if (event.target.closest('[data-action="close"]')) stopDemo();
  });
  form.addEventListener('submit', event => {
    event.preventDefault(); const command = input.value.trim(); input.value = ''; if (!command) return;
    stopDemo();
    history.push(command); position = history.length;
    const line = document.createElement('p'); line.textContent = `visitor ~ $ ${command}`; output.append(line);
    const [verb, arg] = command.toLowerCase().split(/\s+/);
    let response;
    if (verb === 'clear') { output.replaceChildren(); return; }
    if (verb === 'demo') { startDemo(); return; }
    if (verb === 'help') response = 'help          Show commands\nls            List portfolio files\nwhoami        Meet the developer\nopen <name>   Open about, projects, skills, experience, services, contact\ntheme <name>  Switch to ink, paper, sepia, green\ndemo          Replay the startup intro\ndate          Display local time\nclear         Clear terminal';
    else if (verb === 'ls') response = entries.map(entry => entry.file).join('  ');
    else if (verb === 'whoami') response = `${profile.name} — ${profile.role}\n${profile.bio}`;
    else if (verb === 'date') response = new Date().toLocaleString();
    else if (verb === 'open' && entries.some(entry => entry.id === arg || entry.file === arg)) { openWindow(entries.find(entry => entry.id === arg || entry.file === arg).id); response = `Opening ${arg}…`; }
    else if (verb === 'theme' && ['ink', 'paper', 'sepia', 'green'].includes(arg)) { applyTheme(arg); response = `Theme set to ${arg}.`; }
    else response = `Unknown command: ${command}. Type “help” for available commands.`;
    const result = document.createElement('p'); result.textContent = response; output.append(result); scroller.scrollTop = scroller.scrollHeight;
  });
  input.addEventListener('keydown', event => { if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); position = Math.max(0, Math.min(history.length, position + (event.key === 'ArrowUp' ? -1 : 1))); input.value = history[position] || ''; } });
  startDemo();
}

function save(key, value) { try { localStorage.setItem(key, value); } catch {} }
function saved(key) { try { return localStorage.getItem(key); } catch { return null; } }
function applyTheme(theme) { document.documentElement.dataset.theme = theme; $('#theme').value = theme; save('portfolio-theme', theme); }
const storedTheme = saved('portfolio-theme');
applyTheme(['ink', 'paper', 'sepia', 'green'].includes(storedTheme) ? storedTheme : 'paper');
$('#theme').addEventListener('change', event => applyTheme(event.target.value));
$('#theme-shortcut').addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'ink' ? 'paper' : 'ink'));
function applyType(type) { document.documentElement.style.setProperty('--font', type === 'mono' ? "'SFMono-Regular', Menlo, monospace" : type === 'serif' ? 'Georgia, serif' : "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"); $('#typography').value = type; save('portfolio-type', type); }
applyType(['sans', 'mono', 'serif'].includes(saved('portfolio-type')) ? saved('portfolio-type') : 'sans');
$('#typography').addEventListener('change', event => applyType(event.target.value));
function updateClock() { const now = new Date(); $('#clock').textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) + '  ' + now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); $('#clock').dateTime = now.toISOString(); }
updateClock(); setInterval(updateClock, 1000);

const dialog = $('#search-dialog');
function renderSearch() {
  const query = $('#search-input').value.toLowerCase();
  const matches = entries.filter(entry => `${entry.title} ${entry.file}`.toLowerCase().includes(query));
  $('#search-results').innerHTML = matches.length ? matches.map(entry => `<button class="search-result" data-result="${entry.id}">${icon(entry.icon)}<span>${entry.title}</span><span>${entry.file} ↵</span></button>`).join('') : '<p style="padding:10px;color:var(--muted)">No matching files.</p>';
}
function showSearch() { if (document.documentElement.classList.contains('booting')) return; $('#search-input').value = ''; renderSearch(); if (!dialog.open) dialog.showModal(); $('#search-input').focus(); }
$('#search-toggle').addEventListener('click', showSearch);
$('#search-close').addEventListener('click', () => dialog.close());
$('#search-input').addEventListener('input', renderSearch);
$('#search-input').addEventListener('keydown', event => { if (event.key === 'Enter') { const first = $('.search-result'); if (first) { dialog.close(); openWindow(first.dataset.result); } } if (event.key === 'ArrowDown') { event.preventDefault(); $('.search-result')?.focus(); } });
$('#search-results').addEventListener('click', event => { const id = event.target.closest('[data-result]')?.dataset.result; if (id) { dialog.close(); openWindow(id); } });
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (dialog.open) dialog.close(); else showSearch(); } });

startSpectrumWallpaper();
runCodingIntro(profile);
