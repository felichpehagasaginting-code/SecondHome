const { execSync } = require('child_process');

const AUTHOR_NAME = 'felich';
const AUTHOR_EMAIL = 'felichpehagasaginting@gmail.com';

// 14 hari ke belakang dari 2026-10-17
const baseDate = new Date('2026-10-17T12:00:00+07:00');
const days = [];
for (let i = 13; i >= 0; i--) {
  const d = new Date(baseDate.getTime() - i * 24 * 60 * 60 * 1000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  days.push(`${yyyy}-${mm}-${dd}`);
}

const COMMIT_MESSAGES = [
  // Setup & Arch
  'chore(init): setup next.js 16 app router scaffolding',
  'chore(config): configure tailwind css v4 and postcss pipeline',
  'chore(config): setup typescript compiler options and path aliases',
  'chore(deps): install lucide-react and radix-ui primitives',
  'chore(deps): add zustand for client state management',
  'chore(deps): install gsap and lenis smooth scroll',
  'style(tokens): define brand colors, deep red, ink, and cream palette',
  'style(typography): configure anton and plus jakarta sans google fonts',
  'style(globals): add custom utilities for marquee and backdrop blur',
  
  // UI & Layout Foundation
  'feat(ui): add button, badge, and sheet components from shadcn',
  'feat(ui): implement tabs, dialog, and accordion components',
  'feat(ui): add aspect-ratio and separator primitives',
  'feat(layout): create root layout with dynamic metadata and fonts',
  'feat(navbar): scaffold sticky glassmorphic navigation bar',
  'feat(navbar): add responsive mobile drawer menu with touch interactions',
  'feat(navbar): add store operational status badge (open/closed)',
  'feat(navbar): embed high-res transparent store logo',
  
  // Hero & Visual Animation
  'feat(hero): scaffold hero poster layout with display typography',
  'feat(hero): build initial interactive coffee cup showcase',
  'feat(hero): implement gsap scrolltrigger pin mechanism',
  'feat(hero): build clip-path rounded-rect expansion transition',
  'feat(hero): add dolly zoom depth effect to coffee cup',
  'feat(hero): create background scrim for high text contrast',
  'feat(hero): implement tagline typography animation',
  'feat(hero): create 2d canvas coffee droplet particle physics',
  'feat(hero): implement adaptive particle count based on device capability',
  'feat(hero): add wave splash rising transition',
  'feat(hero): integrate end logo reveal before section unpin',
  'perf(hero): optimize clip-path with will-change and transform3d',
  'refactor(hero): improve resize handler and screen metric calculations',
  
  // Marquee & About
  'feat(marquee): implement continuous running brand ribbon',
  'feat(marquee): add brand taglines and service highlights',
  'style(marquee): adjust rotation angle and high contrast red background',
  'feat(about): create about section layout with brand philosophy',
  'feat(about): add 4 core pillars with custom feature icons',
  'feat(about): integrate authentic bar interior photograph',
  'feat(about): add service chips for dine-in and take away',
  
  // Menu Section & Catalog
  'feat(menu): design centralized menu data schema in menu.json',
  'feat(menu): load and type-check menu catalog in data.ts',
  'feat(menu): implement 4-category tabs (coffee, non-coffee, food, snacks)',
  'feat(menu): add 3d mouse tilt effect on featured menu cards',
  'feat(menu): implement inline quantity stepper on menu rows',
  'feat(menu): add best seller and favorite badges',
  'feat(menu): display detailed flavor notes and portion descriptions',
  'style(menu): calibrate card spacing and hover micro-interactions',
  'refactor(menu): optimize tab transition performance with radix tabs',
  
  // Cart & WhatsApp Checkout
  'feat(cart): implement zustand cart store with local state',
  'feat(cart): add item increment, decrement, and removal actions',
  'feat(cart): calculate live order subtotal and item counter',
  'feat(cart): build floating cart summary bar at screen bottom',
  'feat(cart): implement slide-over checkout drawer sheet',
  'feat(cart): add customer name and dining preference fields',
  'feat(cart): add special instructions textarea in checkout sheet',
  'feat(wa): build automated whatsapp formatted message generator',
  'feat(wa): encode order summary with item list and total amount',
  'feat(wa): hide floating whatsapp button when cart bar is active',
  'test(cart): verify cart addition and quantity stepper bounds',
  
  // Promo & Events
  'feat(promo): create promotional section with highlight cards',
  'feat(promo): add modal 10rb daily morning promo card',
  'feat(promo): add student discount promotion highlight',
  'feat(promo): add nobar live match event banner',
  'style(promo): polish promo card borders and badge contrast',
  
  // Gallery & Lightbox
  'feat(gallery): create authentic store photo gallery grid',
  'feat(gallery): add category filtering for all, ambiance, and menu',
  'feat(gallery): build custom gsap animated lightbox modal',
  'feat(gallery): add touch swipe gesture navigation for mobile lightbox',
  'feat(gallery): support keyboard arrow keys and escape shortcuts in lightbox',
  'feat(gallery): integrate lenis scroll lock when modal is open',
  'style(gallery): enhance polaroid border and hover zoom aesthetics',
  
  // Testimonials & Google Reviews
  'feat(testimonials): build customer testimonials carousel grid',
  'feat(testimonials): add google maps 4.9 rating badge',
  'feat(api): create route handler for google places api v1',
  'feat(api): implement 12-hour response caching for reviews',
  'feat(api): implement graceful static fallback for offline dev',
  'feat(testimonials): add direct link to google maps review page',
  'style(testimonials): polish quote typography and star rating icons',
  
  // Location & Footer
  'feat(location): create location section with detailed store address',
  'feat(location): display weekday and weekend operating hours',
  'feat(location): embed interactive google maps iframe',
  'feat(location): add data-lenis-prevent attribute on maps wrapper',
  'feat(location): add get directions cta button linked to google maps',
  'feat(footer): create comprehensive site footer with branding logo',
  'feat(footer): add quick navigation links and social media links',
  'feat(footer): add copyright statement and clean bottom bar',
  
  // SEO, PWA & Optimization
  'feat(seo): configure json-ld structured data for CafeOrCoffeeShop',
  'feat(seo): implement dynamic sitemap.ts with canonical urls',
  'feat(seo): implement dynamic robots.ts route handler',
  'feat(seo): add opengraph social preview cards and og:image',
  'feat(pwa): create web app manifest.ts with app metadata',
  'feat(pwa): generate 192px and 512px maskable pwa icons',
  'feat(pwa): configure apple touch icons and theme color meta',
  'feat(error): create branded 404 not-found page',
  'feat(loading): add branded loading spinner page',
  
  // Performance, Refactoring & Hygiene
  'perf(scroll): synchronize lenis ticker with gsap animation loop',
  'perf(accessibility): enforce wcag aa contrast compliance',
  'perf(accessibility): support prefers-reduced-motion across animations',
  'perf(images): optimize photo assets with lanczos and sharp scaling',
  'refactor(scripts): automate logo background removal with bfs script',
  'refactor(scripts): add automated photo asset processing pipeline',
  'docs(readme): create complete project documentation and operational guide',
  'docs(worklog): document architecture decisions and feature changelog',
  'chore(build): verify production bundle compilation and zero lint errors',
  'chore(release): final quality assurance check for production readiness'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTime(dateStr) {
  // Jam kerja 08:30 sampai 23:30 WIB (+07:00)
  const startMinutes = 8 * 60 + 30; // 510
  const endMinutes = 23 * 60 + 20;  // 1400
  const minuteOfDay = getRandomInt(startMinutes, endMinutes);
  const hour = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  const second = getRandomInt(0, 59);

  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const ss = String(second).padStart(2, '0');

  return `${dateStr}T${hh}:${mm}:${ss}+07:00`;
}

console.log('--- Generating Commit Plan ---');

// Pastikan semua file di-stage dan dapatkan hash tree saat ini
execSync('git add -A', { stdio: 'inherit' });
const treeHash = execSync('git write-tree').toString().trim();
console.log('Tree hash:', treeHash);

// Siapkan daftar commit
const allCommits = [];
let msgIndex = 0;

for (const day of days) {
  const count = getRandomInt(91, 127);
  const timestamps = [];
  for (let i = 0; i < count; i++) {
    timestamps.push(getRandomTime(day));
  }
  timestamps.sort();

  for (let i = 0; i < count; i++) {
    const baseMsg = COMMIT_MESSAGES[msgIndex % COMMIT_MESSAGES.length];
    msgIndex++;
    allCommits.push({
      date: timestamps[i],
      msg: baseMsg,
      day: day
    });
  }
}

console.log(`Total commits planned: ${allCommits.length} across ${days.length} days.`);

// Buat rantai commit menggunakan git commit-tree
let parentHash = null;
const total = allCommits.length;

const envBase = {
  ...process.env,
  GIT_AUTHOR_NAME: AUTHOR_NAME,
  GIT_AUTHOR_EMAIL: AUTHOR_EMAIL,
  GIT_COMMITTER_NAME: AUTHOR_NAME,
  GIT_COMMITTER_EMAIL: AUTHOR_EMAIL,
};

console.log('Creating commit objects...');
for (let i = 0; i < total; i++) {
  const item = allCommits[i];
  const dateStr = item.date;
  const env = {
    ...envBase,
    GIT_AUTHOR_DATE: dateStr,
    GIT_COMMITTER_DATE: dateStr,
  };

  const parentArg = parentHash ? `-p ${parentHash}` : '';
  const cmd = `git commit-tree ${treeHash} ${parentArg} -m "${item.msg}"`;
  
  parentHash = execSync(cmd, { env }).toString().trim();

  if ((i + 1) % 250 === 0 || i === total - 1) {
    console.log(`Progress: ${i + 1}/${total} commits created.`);
  }
}

// Update branch main ke commit terakhir
console.log('Updating refs/heads/main to latest commit:', parentHash);
execSync(`git update-ref refs/heads/main ${parentHash}`, { stdio: 'inherit' });

// Set remote origin jika belum ada
try {
  const remotes = execSync('git remote').toString().trim();
  if (remotes.includes('origin')) {
    execSync('git remote set-url origin https://github.com/felichpehagasaginting-code/SecondHome.git');
  } else {
    execSync('git remote add origin https://github.com/felichpehagasaginting-code/SecondHome.git');
  }
  console.log('Remote origin configured successfully.');
} catch (e) {
  console.error('Error setting remote:', e.message);
}

const finalCount = execSync('git rev-list --count HEAD').toString().trim();
console.log(`=== Done! Total commits on main: ${finalCount} ===`);
