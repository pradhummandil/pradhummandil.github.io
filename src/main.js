import './style.css';
import emailjs from '@emailjs/browser';

/*
 * Pradhum Mandil Portfolio
 * External JavaScript
 *
 * Replace the three EmailJS placeholders below with the values from
 * your EmailJS dashboard. Your Auto-Reply remains configured in EmailJS.
 */

// Always start at the top and prevent browser scroll restoration.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ---------- Intro (magnifying glass) ----------
(function(){
  const intro = document.getElementById('fmIntro');
  if (!intro) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const INTRO_SEEN_KEY = 'pradhum_intro_seen';

  let introSeen = false;
  try {
    introSeen = localStorage.getItem(INTRO_SEEN_KEY) === '1';
  } catch (error) {
    introSeen = false;
  }

  function markIntroSeen(){
    try {
      localStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch (error) {}
  }

  if (reduced || introSeen) {
    markIntroSeen();
    intro.remove();
    document.body.style.overflow = '';
    window.scrollTo(0, 0);
    return;
  }


  function buildScene(el){
    const headers = ['The Morning Brief','Notes from the Desk','Field Report','Late Edition','On the Record'];
    headers.forEach((h,ci)=>{
      const col = document.createElement('div');
      col.className='fm-col';
      const hd=document.createElement('div'); hd.className='fm-col-h'; hd.textContent=h; col.appendChild(hd);
      const rule=document.createElement('div'); rule.className='fm-col-r'; col.appendChild(rule);
      for(let n=0;n<50;n++){
        const l=document.createElement('div');
        const r=(7*n+5*ci)%13;
        l.className='fm-col-l'+(r===0?' x':(r%4===0?' s':''));
        col.appendChild(l);
      }
      el.appendChild(col);
    });
    const mh=document.createElement('div'); mh.className='fm-masthead';
    mh.innerHTML='<div class="fm-masthead-k">Wanted</div><div class="fm-masthead-t">Pradhum Mandil</div><div class="fm-masthead-r"></div>';
    el.appendChild(mh);
  }
  buildScene(document.getElementById('fmSceneBase'));
  buildScene(document.getElementById('fmSceneMag'));

  function finish(){
    markIntroSeen();
    intro.classList.add('fm-exit');
    setTimeout(()=>{ intro.remove(); document.body.style.overflow=''; window.scrollTo(0,0); }, 460);
  }

  document.body.style.overflow='hidden';

  document.getElementById('fmSkip').addEventListener('click', finish);

  const lens = document.getElementById('fmLens');
  const sceneMag = document.getElementById('fmSceneMag');
  const magClip = document.getElementById('fmMagClip');
  const dim = document.getElementById('fmDim');
  const hint = document.getElementById('fmHint');
  const identified = document.getElementById('fmIdentified');
  hint.textContent = coarse ? 'Drag the glass — find the subject' : 'Take the glass — find the subject';

  let pos = {x:-0.3*window.innerWidth, y:-0.2*window.innerHeight};
  let target = {...pos};
  let lastMove = performance.now();
  let holdStart = 0;
  let locked = false;
  let raf = null;
  const R = Math.round(Math.min(104, Math.max(82, .12*Math.min(window.innerWidth, window.innerHeight))));

  function onMove(e){
    const cx = (e.touches? e.touches[0].clientX : e.clientX) - window.innerWidth/2;
    const cy = (e.touches? e.touches[0].clientY : e.clientY) - window.innerHeight/2;
    target = {x:cx, y:cy};
    lastMove = performance.now();
  }
  window.addEventListener('pointermove', onMove, {passive:true});
  window.addEventListener('touchmove', onMove, {passive:true});

  function frame(now){
    if (locked) return;
    if (now - lastMove > 3000){ target.x += (0-target.x)*0.02; target.y += (0-target.y)*0.02; }
    pos.x += (target.x-pos.x)*0.12;
    pos.y += (target.y-pos.y)*0.12;

    const F = window.innerWidth/2 + pos.x, L = window.innerHeight/2 + pos.y;
    lens.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    const clipPath = `circle(${R}px at ${F}px ${L}px)`;
    magClip.style.clipPath = clipPath; magClip.style.webkitClipPath = clipPath;
    sceneMag.style.transform = `translate(${-0.9*pos.x}px, ${-0.9*pos.y}px) scale(1.9)`;

    if (Math.hypot(pos.x,pos.y) < 0.6*R){
      if (!holdStart) holdStart = now;
      else if (now-holdStart > 800){ lockSequence(); return; }
    } else holdStart = 0;

    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  function lockSequence(){
    locked = true;
    hint.style.transition='opacity .3s ease'; hint.style.opacity='0';
    identified.style.transition='opacity .1s ease-out, transform .35s cubic-bezier(.34,1.56,.64,1)';
    requestAnimationFrame(()=>{
      identified.style.opacity='1';
      identified.style.transform='translateY(0) scale(1) rotate(0deg)';
    });
    dim.style.transition='opacity .3s ease'; dim.style.opacity='0.3';
    lens.style.transition='opacity .3s ease'; 
    setTimeout(()=>{ lens.style.opacity='0'; }, 250);
    setTimeout(finish, 900);
  }
})();

// ---------- Dateline ----------
const datelineText = document.getElementById('dateline-text');
if (datelineText) {
  datelineText.textContent = new Date().toLocaleDateString('en-IN', {
    weekday:'long',
    day:'numeric',
    month:'long',
    year:'numeric'
  });
  datelineText.classList.remove('dateline-reveal');
  void datelineText.offsetWidth;
  datelineText.classList.add('dateline-reveal');
}

// ---------- Mobile menu ----------
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
burgerBtn.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burgerBtn.setAttribute('aria-expanded', open);
});
document.querySelectorAll('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));

// ---------- Shared "browser window" mockup image ----------
function mockScreenSVG(w, h, colors){
  const bg = colors[0], panel = colors[1];
  const chromeH = Math.round(h*0.11);
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="${bg}"/>
    <rect width="${w}" height="${chromeH}" fill="#00000022"/>
    <circle cx="${chromeH*0.5}" cy="${chromeH*0.5}" r="${chromeH*0.16}" fill="#a6382c"/>
    <circle cx="${chromeH*1.1}" cy="${chromeH*0.5}" r="${chromeH*0.16}" fill="#00000030"/>
    <circle cx="${chromeH*1.7}" cy="${chromeH*0.5}" r="${chromeH*0.16}" fill="#00000030"/>
    <rect x="${chromeH*2.3}" y="${chromeH*0.28}" width="${w*0.3}" height="${chromeH*0.44}" rx="${chromeH*0.22}" fill="#00000022"/>
    <rect x="${w*0.06}" y="${h*0.22}" width="${w*0.16}" height="${h*0.05}" fill="${panel}"/>
    <rect x="${w*0.30}" y="${h*0.235}" width="${w*0.09}" height="${h*0.02}" fill="${panel}" opacity="0.7"/>
    <rect x="${w*0.44}" y="${h*0.235}" width="${w*0.09}" height="${h*0.02}" fill="${panel}" opacity="0.7"/>
    <rect x="${w*0.06}" y="${h*0.38}" width="${w*0.46}" height="${h*0.09}" fill="${panel}"/>
    <rect x="${w*0.06}" y="${h*0.50}" width="${w*0.30}" height="${h*0.09}" fill="${panel}" opacity="0.85"/>
    <rect x="${w*0.06}" y="${h*0.65}" width="${w*0.38}" height="${h*0.032}" fill="${panel}" opacity="0.5"/>
    <rect x="${w*0.06}" y="${h*0.71}" width="${w*0.26}" height="${h*0.032}" fill="${panel}" opacity="0.5"/>
    <rect x="${w*0.06}" y="${h*0.80}" width="${w*0.15}" height="${h*0.08}" fill="#a6382c"/>
    <rect x="${w*0.60}" y="${h*0.38}" width="${w*0.34}" height="${h*0.50}" fill="${panel}" opacity="0.35"/>
  </svg>`;
}

// ---------- Data ----------
const cards = [
  {ex:'Exhibit B', slug:'india-story-project', cat:'Co-built &middot; indiastoryproject.com', title:'India Story Project', url:'indiastoryproject.com',
   desc:'A bilingual (English/Hindi) editorial storytelling platform preserving India\u2019s untold stories \u2014 400+ pieces across 28+ states, with an interactive India map and cinematic scroll motion. Built with backend collaborator Mayank Sahu.',
   tags:['React','TanStack Start','Prisma','PostgreSQL','Supabase','GSAP'], meta:'2026 &middot; Co-built', colors:['#1a1414','#4a2f2f']},
  {ex:'Exhibit C', slug:'adihat-full-app', cat:'Adihat &middot; Flutter monorepo', title:'Adihat &mdash; Full Control', url:'adiha-full-control.vercel.app',
   desc:'An eight-portal healthcare platform \u2014 Patient, Doctor, Hospital, Lab, Pharmacy, Ambulance, Insurance and Admin \u2014 built end to end as a Flutter monorepo, with role-based access control and audit-logged compliance groundwork.',
   tags:['Flutter','Dart','Node.js','RBAC','Supabase'], meta:'2026 &middot; Founder &amp; Developer', colors:['#0f1f18','#254738']},
  {ex:'Exhibit D', slug:'adihat-website', cat:'Adihat &middot; Web', title:'Adihat (Web)', url:'adihat.netlify.app',
   desc:'The original Adihat build \u2014 a mental-wellness support platform for students, with an AI chat companion, gamified daily check-ins, anonymous peer support forums, and a parent dashboard for early intervention.',
   tags:['React','Node.js','Express','MongoDB','TensorFlow'], meta:'2025 &middot; Web build', colors:['#1c1730','#3a2f5c']},
  {ex:'Exhibit E', slug:'hostel-management', cat:'Open source &middot; GitHub', title:'Hostel Management', url:'github.com/pradhummandil/hostel-management',
   desc:'A smaller utility from the repo list \u2014 a hostel management system for handling room allotments, resident records and everyday admin work, built to solve one specific problem cleanly.',
   tags:['TypeScript','React','Node.js'], meta:'2026', colors:['#151a1f','#2c3944']},

  {ex:'Exhibit F', slug:'nearhive-partner', cat:'UI/UX &middot; Figma', title:'Nearhive Partner App', url:'figma.com/design/nearhive-partner-app',
   desc:'A mobile-first partner product exploration designed in Figma, focused on clear operational workflows, information hierarchy, and a polished partner-side experience.',
   tags:['Figma','UI/UX','Mobile Design','Prototype'], meta:'2026 &middot; Product Design', colors:['#1b1712','#5b4630']},
  {ex:'Exhibit G', slug:'swiggy-instamart-human-care', cat:'UI/UX &middot; Figma', title:'Swiggy Instamart — Human Care', url:'figma.com/design/swiggy-instamart-human-care',
   desc:'A human-centered UI/UX concept exploring how Instamart could make support, assistance, and care interactions feel more accessible, reassuring, and intuitive.',
   tags:['Figma','UI/UX','Human-Centered Design','Prototype'], meta:'2026 &middot; Concept Design', colors:['#2b1717','#733b32']},
];
const cardGrid = document.getElementById('cardGrid');
cards.forEach(c=>{
  const el = document.createElement('article');
  el.className = 'card rv';
  el.innerHTML = `
    <span class="exhibit-flag">${c.ex}</span>
    <span class="exhibit-cat">${c.cat}</span>
    <h3 class="exhibit-title" style="font-size:28px;">${c.title}<svg class="title-mag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="20" y1="20" x2="15.2" y2="15.2"/></svg></h3>
    <div style="margin-top:16px;">
      <div class="polaroid" data-case="${c.slug}">
        <div class="polaroid-img">
          <img src="/images/${c.slug}.jpg" alt="${c.title} screenshot" onerror="this.onerror=null;this.classList.add('image-missing');"/>
          <span class="stamp-confirmed">Confirmed</span>
        </div>
        <div class="polaroid-foot">
          <span class="exhibit-badge">${c.ex}
            <svg viewBox="0 0 120 44" preserveAspectRatio="none"><path d="M10 24 C 8 10, 44 4, 76 7 C 104 10, 116 18, 112 28 C 108 38, 70 42, 40 39 C 16 37, 8 30, 12 20" fill="none" stroke="#a6382c" stroke-width="3" stroke-linecap="round" opacity="0.85"/></svg>
          </span>
          <span>recovered from ${c.url}</span>
        </div>
      </div>
    </div>
    <p class="exhibit-desc">${c.desc}</p>
    <div class="tags">${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    <div class="exhibit-foot">
      <span class="exhibit-meta">${c.meta}</span>
      <span class="case-link" data-case="${c.slug}">Open case file <span>&rarr;</span></span>
    </div>`;
  cardGrid.appendChild(el);
});

const stack = [
  {name:'Next.js', code:'NEXT', detected:'Most days', find:'Primary tool'},
  {name:'React / TS', code:'RTS', detected:'Most days', find:'Primary tool'},
  {name:'Tailwind CSS', code:'TWX', detected:'Most days', find:'Primary tool'},
  {name:'Supabase', code:'SUPA', detected:'In projects', find:'Primary tool'},
  {name:'PostgreSQL', code:'PG', detected:'In projects', find:'Comfortable'},
  {name:'MySQL', code:'SQL', detected:'When needed', find:'Comfortable'},
  {name:'AWS', code:'AWS', detected:'Amplify&middot;&lambda;&middot;S3', find:'In training'},
  {name:'Vercel', code:'VRCL', detected:'Most days', find:'Comfortable'},
  {name:'Docker', code:'DCKR', detected:'Learning', find:'Trace amount'},
  {name:'TanStack Start', code:'TNK', detected:'Learning', find:'Trace amount'},
];
const stackRows = document.getElementById('stackRows');
stack.forEach(s=>{
  const primary = s.find === 'Primary tool';
  const el = document.createElement('div');
  el.className = 'row rv';
  el.innerHTML = `
    <div class="row-name"><span class="big">${s.name}</span><span class="code">${s.code}</span></div>
    <div class="row-code">${s.code}</div>
    <div class="row-det">${s.detected}</div>
    <div class="row-find"><span class="pill ${primary?'pill-primary':'pill-secondary'}">${s.find}</span></div>`;
  stackRows.appendChild(el);
});

const jobs = [
  {date:'2026 &mdash; Now', role:'Founder &mdash; building Adihat, end to end', org:'Adihat (Healthcare Startup)',
   desc:'Designing and building an eight-portal healthcare platform \u2014 Patient, Doctor, Hospital, Lab, Pharmacy, Ambulance, Insurance and Admin \u2014 as a Flutter monorepo with role-based access control and audit-logged compliance work.'},
  {date:'2023 &mdash; Now', role:'B.Tech, Information Technology', org:'Samrat Ashok Technological Institute, Vidisha',
   desc:'Studying IT while running freelance projects on the side \u2014 full-stack web, Flutter apps, UI/UX design and video editing for real clients.'},
  {date:'Ongoing', role:'Freelance Full-Stack &amp; App Developer', org:'Independent / Client Work',
   desc:'Ships production web apps \u2014 Study Hub, India Story Project \u2014 and client sites end to end, using React, Next.js, Supabase and Node.js, from spec to deploy.'},
  {date:'Ongoing', role:'Instagram Reels Creator', org:'@heymandil__',
   desc:'Writes and shoots storytelling-style Reels for an Indian audience \u2014 relatable, home-shot moments with a hook, edited in CapCut and DaVinci Resolve.'},
];
const ledger = document.getElementById('ledger');
jobs.forEach(j=>{
  const el = document.createElement('div');
  el.className = 'ledger-row rv';
  el.innerHTML = `
    <div class="ledger-date">${j.date}</div>
    <div class="ledger-role">${j.role}<b>${j.org}</b></div>
    <div class="ledger-desc">${j.desc}</div>`;
  ledger.appendChild(el);
});

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll('.rv');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if (en.isIntersecting){ en.target.classList.add('is-visible'); io.unobserve(en.target); }
    });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  revealEls.forEach(el=>io.observe(el));
} else {
  revealEls.forEach(el=>el.classList.add('is-visible'));
}

// ---------- Contact form ----------
const EMAILJS_CONFIG = {
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ""
};

if (EMAILJS_CONFIG.publicKey) {
  emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
}

document.getElementById('contactForm').addEventListener('submit', async function(e){
  e.preventDefault();

  const form = this;
  const button = form.querySelector('button[type="submit"]');
  const wrap = document.getElementById('formWrap');
  const originalText = button.textContent;

  button.disabled = true;
  button.textContent = 'Sending...';

  try {
    if (!EMAILJS_CONFIG.publicKey || !EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId) {
      throw new Error('EmailJS environment variables are not configured.');
    }

    await emailjs.sendForm(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      form
    );

    wrap.innerHTML = `
      <div class="success-box">
        <div class="mark">*</div>
        <h3>Tip received &mdash; filed for the morning edition</h3>
        <p>Thanks for writing in. The desk reads every message and replies within 24 hours.</p>
      </div>`;

  } catch (error) {
    console.error('EmailJS error:', error);
    button.disabled = false;
    button.textContent = originalText;
    alert('Unable to send your message right now. Please try again.');
  }
});

// ---------- Case files (detail pages) ----------
const caseFiles = {
  'study-hub': {
    ex:'Exhibit A', label:'Study Hub &middot; Flagship', url:'https://studyhub-bypradhum.vercel.app/', domain:'studyhub-bypradhum.vercel.app',
    headline:'A guidance platform built for students who are actually preparing for GATE.',
    dek:'A solo-built React and Supabase platform \u2014 real booking, a real study timer, and a real resource library, wrapped in a cinematic landing page.',
    meta:'2026 &mdash; Now &middot; Solo build',
    colors:['#0f1b2e','#2c4064'],
    body:[
      "Study Hub started as a straightforward problem: GATE and JEE aspirants needed one place to book guidance, track study time, and find official papers \u2014 instead of five browser tabs and a WhatsApp group. The build leans on React, Vite and TypeScript on the front, with Tailwind and shadcn/ui doing the visual heavy lifting.",
      "Underneath, Supabase handles everything real: email and Google OAuth for sign-in, a Postgres database with row-level security for saved resources and roadmap progress, and Storage for the resource PDFs themselves. A live Cal.com embed lets students book free 1-on-1 guidance calls without leaving the page.",
      "The Focus Room is the feature that gets the most repeat use \u2014 a circular-progress study timer with streaks and session history, built to nudge momentum rather than just count minutes. Around it sits a searchable, filterable resource library covering GATE and JEE Advanced papers and answer keys.",
      "It's a solo build, shipped and iterated on while the developer is himself preparing for the same exam it's built for \u2014 which tends to keep the feature list honest."
    ],
    quote:'"Full-stack developer \u00b7 GATE 2027 aspirant \u00b7 quiet-grind believer."',
    facts:[['Frontend','React &middot; Vite &middot; TypeScript'],['UI','Tailwind &middot; shadcn/ui'],['Auth','Supabase (Email + Google)'],['Booking','Cal.com embed'],['Hosting','Vercel'],['Status','Live']],
    related:['india-story-project','adihat-full-app']
  },
  'india-story-project': {
    ex:'Exhibit B', label:'Co-built &middot; indiastoryproject.com', url:'https://www.indiastoryproject.com/', domain:'indiastoryproject.com',
    headline:'400+ Indian stories, told with the polish of a design studio.',
    dek:'A bilingual editorial platform for India\u2019s changemakers and quiet revolutions \u2014 an interactive map, cinematic motion, and a real production backend, co-built with Mayank Sahu.',
    meta:'2026 &middot; Co-built with Mayank Sahu',
    colors:['#1a1414','#4a2f2f'],
    body:[
      "India Story Project set out to be something other than another news blog \u2014 an immersive, editorial home for the changemakers and everyday heroes that don't usually get a byline. The front end runs on React 19 and TanStack Start, with GSAP handling scroll-triggered timelines and Framer Motion covering the smaller, component-level interactions.",
      "An interactive map of India sits at the center of the experience, letting readers explore stories state by state, with glow and depth transitions on hover. The whole thing is fully bilingual \u2014 English and Hindi \u2014 with a dynamic language toggle that carries through categories, states and navigation.",
      "Underneath, Prisma and PostgreSQL hold over 400 published stories across 28-plus states, with Supabase handling auth and storage, and a role-based admin dashboard for story, category and analytics management. The build is a two-person effort: this developer owns the product vision, motion direction and frontend architecture, while collaborator Mayank Sahu runs the backend and database layer.",
      "It's an active project \u2014 AI-assisted recommendations and translation are the current roadmap items, alongside community contributions and reading challenges still to ship."
    ],
    quote:'"Every scroll, hover, and transition should feel like turning the page of a premium storybook."',
    facts:[['Frontend','React 19 &middot; TanStack Start'],['Motion','GSAP &middot; Framer Motion'],['Backend','Prisma &middot; PostgreSQL'],['Auth','Supabase'],['Team','Solo frontend, co-built backend'],['Status','Live &middot; 400+ stories']],
    related:['study-hub','adihat-website']
  },
  'adihat-full-app': {
    ex:'Exhibit C', label:'Adihat &middot; Flutter monorepo', url:'https://adiha-full-control.vercel.app/', domain:'adiha-full-control.vercel.app',
    headline:'Eight portals, one healthcare platform, built from scratch.',
    dek:'Adihat\u2019s current form \u2014 a Flutter monorepo covering Patient, Doctor, Hospital, Lab, Pharmacy, Ambulance, Insurance and Admin, with role-based access baked in from day one.',
    meta:'2026 &middot; Founder &amp; Developer',
    colors:['#0f1f18','#254738'],
    body:[
      "This is Adihat's most ambitious form so far \u2014 not a single app, but eight coordinated portals sharing one backend and one set of design decisions. Patients, doctors, hospital staff, lab technicians, pharmacists, ambulance dispatchers, insurers and admins each get a purpose-built Flutter app, organized as a single monorepo with a shared package for common logic.",
      "Access control isn't an afterthought here \u2014 each role has a defined scope in the system: patients read their own records, doctors read assigned patients and write consultations, lab staff manage diagnostic orders, pharmacists verify and dispense, dispatchers manage active emergency requests, and a super-admin role holds global read/write and audit access.",
      "That last point matters for a healthcare product: every administrative action is logged with timestamp, user ID, role and detail, aimed at HIPAA and India's NDHM data-handling expectations. It's early-stage \u2014 built solo, in active development \u2014 but architected like something meant to hold real patient data eventually, not a hackathon demo.",
      "It sits alongside the original Adihat web build as proof of how far the idea has moved: from a single mental-wellness site to a full clinical operations platform."
    ],
    quote:'"Global read/write, audit log inspection, and user governance access \u2014 designed in from the start."',
    facts:[['Framework','Flutter &middot; Dart'],['Structure','Monorepo, 8 portals'],['Access','Role-based (RBAC)'],['Compliance','HIPAA &amp; NDHM-oriented'],['Backend','Node.js'],['Status','In development']],
    related:['adihat-website','study-hub']
  },
  'adihat-website': {
    ex:'Exhibit D', label:'Adihat &middot; Web', url:'https://adihat.netlify.app/', domain:'adihat.netlify.app',
    headline:'Where Adihat started: a mental-wellness platform for students.',
    dek:'The original Adihat build \u2014 an AI chat companion, gamified check-ins, anonymous peer support, and a parent dashboard built to catch problems early.',
    meta:'2025 &middot; Web build',
    colors:['#1c1730','#3a2f5c'],
    body:[
      "Before Adihat became a healthcare monorepo, it was this \u2014 a web platform aimed squarely at student mental well-being. The idea was to combine AI-driven personalization, peer support, and professional guidance into one place students would actually open more than once, instead of a static resources page nobody visits after week one.",
      "The Adihat Bot sits at the center: a conversational assistant offering guided mindfulness exercises and quick, relevant resources, available around the clock. Around it, a gamified journey \u2014 daily wellness challenges, streaks, and an achievement system \u2014 gives the emotional-check-in habit somewhere to attach itself.",
      "An anonymous, moderated peer support network and direct access to professional counseling cover the parts a chatbot shouldn't handle alone, while a parent dashboard surfaces emotional trends and engagement patterns for early intervention, without turning into full surveillance.",
      "Under the hood: React and Tailwind on the front, Node/Express and Flask on the back, MongoDB for user and activity data, and a genuine ML layer \u2014 scikit-learn, TensorFlow and Hugging Face Transformers \u2014 doing sentiment analysis and mood prediction rather than just window dressing."
    ],
    quote:'"The less harshly we judge ourselves, the more accepting we become to others."',
    facts:[['Frontend','React &middot; Tailwind'],['Backend','Node.js &middot; Express &middot; Flask'],['Database','MongoDB'],['ML','scikit-learn &middot; TensorFlow &middot; Transformers'],['Real-time','Socket.IO &middot; Jitsi Meet'],['Status','Live']],
    related:['adihat-full-app','india-story-project']
  },
  'hostel-management': {
    ex:'Exhibit E', label:'Open source &middot; GitHub', url:'https://github.com/pradhummandil/hostel-management', domain:'github.com/pradhummandil/hostel-management',
    headline:'A smaller file, but a real one: hostel administration, solved.',
    dek:'A hostel management system for room allotments, resident records and the everyday admin work that usually lives in a spreadsheet.',
    meta:'2026',
    colors:['#151a1f','#2c3944'],
    body:[
      "Not every exhibit needs to be a flagship. This one is smaller and more utilitarian by design \u2014 a hostel management system built to replace the spreadsheet-and-notice-board approach most hostels still run on, with proper records for room allotments and resident details.",
      "It's built in TypeScript with a React front end and a Node.js backend, following the same stack instincts as the larger projects on file, just applied to a tighter, single-purpose problem.",
      "It's one of a handful of smaller utilities in the wider repo list \u2014 evidence that not everything shipped needs a cinematic landing page to be worth building."
    ],
    quote:null,
    facts:[['Frontend','React &middot; TypeScript'],['Backend','Node.js'],['Scope','Single-purpose utility'],['Status','On GitHub']],
    related:['study-hub','adihat-full-app']
  },
  'nearhive-partner': {
    ex:'Exhibit F', label:'UI/UX &middot; Figma',
    url:'https://www.figma.com/design/Q0WkyrCoPCYjVbTZ1TYp1X/nearhive-partner-app?t=4MNws0N7hF3epEGQ-0',
    domain:'figma.com',
    prototypeUrl:'https://www.figma.com/proto/Q0WkyrCoPCYjVbTZ1TYp1X/nearhive-partner-app?node-id=415-460&starting-point-node-id=415%3A460',
    prototypeEmbed:'https://embed.figma.com/proto/Q0WkyrCoPCYjVbTZ1TYp1X/nearhive-partner-app?node-id=415-460&starting-point-node-id=415%3A460&embed-host=share',
    headline:'A partner-side product experience designed to make operations feel simple.',
    dek:'A Figma-based mobile product exploration for the Nearhive Partner App — focused on clear workflows, practical information hierarchy, and a polished partner experience.',
    meta:'2026 &middot; Product Design',
    colors:['#1b1712','#5b4630'],
    body:[
      "Nearhive Partner App is a UI/UX exploration built in Figma around the needs of a partner-facing mobile product. The focus was not only visual polish, but making the key actions and operational information easy to discover.",
      "The design system uses structured hierarchy, clear action states, and mobile-first layouts so the interface can remain readable while carrying a realistic amount of product information.",
      "The prototype connects the main screens into an interactive flow, allowing the experience to be evaluated as a product rather than as a set of disconnected static screens.",
      "This case file represents the design side of the portfolio — product thinking, interface systems, interaction design, and prototype-driven iteration."
    ],
    quote:'"A product should make the next action obvious before the user has to search for it."',
    facts:[['Tool','Figma'],['Type','Mobile product UI/UX'],['Focus','Partner workflows'],['Prototype','Interactive'],['Platform','Mobile'],['Status','Design exploration']],
    related:['swiggy-instamart-human-care','study-hub']
  },
  'swiggy-instamart-human-care': {
    ex:'Exhibit G', label:'UI/UX &middot; Human Care',
    url:'https://www.figma.com/design/DUAtrHb8NiYj2swyKGiAPo/Swiggy-Instamart--Human-Care--Pradhum-Mandil?t=VNWmmvIWTm6BT7oq-0',
    domain:'figma.com',
    prototypeUrl:'https://www.figma.com/proto/DUAtrHb8NiYj2swyKGiAPo/Swiggy-Instamart--Human-Care--Pradhum-Mandil?node-id=0-1',
    prototypeEmbed:'https://embed.figma.com/proto/DUAtrHb8NiYj2swyKGiAPo/Swiggy-Instamart--Human-Care--Pradhum-Mandil?node-id=40002223-3042&starting-point-node-id=40002223%3A3042&embed-host=share',
    headline:'A human-centered care concept for Instamart.',
    dek:'A Figma concept exploring how a high-speed commerce product could introduce a more reassuring, accessible, and human support experience.',
    meta:'2026 &middot; Concept Design',
    colors:['#2b1717','#733b32'],
    body:[
      "Swiggy Instamart — Human Care explores the support layer around a fast commerce experience. The project looks at how care, assistance, and problem resolution can feel less transactional and more human.",
      "The interface balances the speed expected from Instamart with clearer communication, friendlier guidance, and stronger visual reassurance around moments where users may feel uncertain or need help.",
      "The prototype turns the concept into a navigable experience, making it possible to inspect the interaction flow rather than evaluating only individual screens.",
      "It is a concept case study that demonstrates UX thinking: identifying a human problem, framing the interaction, and expressing the solution through interface design."
    ],
    quote:'"Good support does not only solve the problem — it reduces the anxiety around having the problem."',
    facts:[['Tool','Figma'],['Type','UI/UX concept'],['Focus','Human-centered care'],['Prototype','Interactive'],['Platform','Mobile'],['Status','Concept exploration']],
    related:['nearhive-partner','study-hub']
  }

};

function cfHeroImg(slug, alt){
  return `<img src="/images/${slug}.jpg" alt="${alt} screenshot" onerror="this.onerror=null;this.classList.add('image-missing');"/>`;
}

const cfView = document.getElementById('caseFileView');
const cfoView = document.getElementById('caseFolderView');
const resumeView = document.getElementById('resumeView');
const mainWrap = document.getElementById('mainWrap');

// Single source of truth for which of the three top-level views is showing.
// Explicitly setting display on all three every time prevents any of them
// from silently staying visible (the "home page bleeds through" bug).
function showView(view){
  mainWrap.style.display = view === 'main' ? '' : 'none';
  cfView.classList.toggle('open', view === 'case');
  cfoView.classList.toggle('open', view === 'folder');
  resumeView.classList.toggle('open', view === 'resume');

  if (resumeView) resumeView.setAttribute('aria-hidden', String(view !== 'resume'));
  if (view === 'resume' && document.getElementById('resumeFrame')) {
    document.getElementById('resumeFrame').focus({preventScroll:true});
  }

  window.scrollTo(0,0);
}

function openResume(pushHistory = true){
  showView('resume');
  document.title = 'Resume — Pradhum Mandil';
  if (pushHistory && location.hash !== '#resume') {
    history.pushState({resume:true}, '', '#resume');
  }
}

function closeResume(){
  showView('main');
  document.title = 'Pradhum Mandil - Full-Stack & Flutter Developer';
  if (location.hash === '#resume') {
    history.pushState({}, '', location.pathname + location.search);
  }
}

function openCaseFile(slug){
  const d = caseFiles[slug];
  if (!d) return;
  document.getElementById('cfEyebrow').innerHTML = `Case File &middot; ${d.ex} &middot; ${d.domain.toUpperCase()}`;
  document.getElementById('cfTitle').textContent = d.headline;
  document.getElementById('cfDek').innerHTML = d.dek;
  document.getElementById('cfMeta').innerHTML = d.meta;
  document.getElementById('cfMediaImg').innerHTML = cfHeroImg(slug, d.headline);
  document.getElementById('cfExLabel').textContent = d.ex;
  document.getElementById('cfFigCap').textContent = 'Fig. 1 — the exhibit, as recovered.';
  document.getElementById('cfBody').innerHTML =
    d.body.map(p=>`<p>${p}</p>`).join('') +
    (d.quote ? `<div class="cf-quote">${d.quote}</div>` : '');
  document.getElementById('cfFacts').innerHTML = d.facts.map(f=>`<div class="cf-fact"><span>${f[0]}</span><span>${f[1]}</span></div>`).join('');
  document.getElementById('cfRelated').innerHTML = d.related.map(s=>{
    const rd = caseFiles[s];
    return rd ? `<a data-case="${s}">${rd.ex} &mdash; ${rd.headline.split(' ').slice(0,4).join(' ')}&hellip;</a>` : '';
  }).join('');
  document.getElementById('cfVisit').href = d.url;

  const prototypeSection = document.getElementById('cfPrototype');
  const prototypeIframe = document.getElementById('cfPrototypeIframe');
  const prototypeOpen = document.getElementById('cfPrototypeOpen');

  if (prototypeSection && prototypeIframe && prototypeOpen) {
    if (d.prototypeEmbed) {
      prototypeSection.style.display = 'block';
      prototypeIframe.src = d.prototypeEmbed;
      prototypeOpen.href = d.prototypeUrl || d.url;
    } else {
      prototypeSection.style.display = 'none';
      prototypeIframe.src = '';
      prototypeOpen.href = '#';
    }
  }

  showView('case');
  document.title = `Case File: ${d.ex} — Pradhum Mandil`;
  history.pushState({case:slug}, '', '#case-' + slug);
}

function openCaseFolder(){
  const list = document.getElementById('cfoList');
  list.innerHTML = Object.keys(caseFiles).map(slug=>{
    const d = caseFiles[slug];
    return `
      <div class="cfo-row" data-case="${slug}">
        <div class="cfo-left">
          <span class="cfo-flag">${d.ex}</span>
          <span class="cfo-name">${d.headline.split(' ').slice(0,6).join(' ')}&hellip;</span>
          <span class="cfo-cat">${d.label}</span>
        </div>
        <div class="cfo-right">
          <span class="cfo-meta">${d.meta}</span>
          <span class="cfo-open">Open case file <span class="cfo-arrow">&rarr;</span></span>
        </div>
      </div>`;
  }).join('');

  showView('folder');
  document.title = 'Case Files — Pradhum Mandil';
  history.pushState({folder:true}, '', '#casefiles');
}

function closeCaseFile(){
  showView('main');
  document.title = 'Pradhum Mandil - Full-Stack & Flutter Developer';
  if (location.hash.startsWith('#case-') || location.hash === '#casefiles') history.pushState({}, '', location.pathname + location.search);
}

document.addEventListener('click', function(e){
  const link = e.target.closest('[data-case]');
  if (link){ e.preventDefault(); openCaseFile(link.getAttribute('data-case')); }
});
document.getElementById('cfBack').addEventListener('click', closeCaseFile);
document.getElementById('cfBack2').addEventListener('click', closeCaseFile);
document.getElementById('cfAllCases').addEventListener('click', openCaseFolder);
document.getElementById('cfoBack').addEventListener('click', closeCaseFile);

document.getElementById('resumeBack').addEventListener('click', closeResume);
document.getElementById('navResume').addEventListener('click', function(e){
  e.preventDefault();
  openResume();
});
document.getElementById('navResumeMobile').addEventListener('click', function(e){
  e.preventDefault();
  openResume();
  mobileMenu.classList.remove('open');
});

['navCaseFiles','navCaseFilesMobile','workAllCases'].forEach(id=>{
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', function(e){ e.preventDefault(); openCaseFolder(); mobileMenu.classList.remove('open'); });
});

document.getElementById('footerFingerprint').addEventListener('click', function(e){
  e.preventDefault();
  try {
    localStorage.removeItem('pradhum_intro_seen');
  } catch (err) {}
  window.location.href = window.location.pathname + window.location.search;
});

window.addEventListener('popstate', function(){
  if (location.hash === '#resume') openResume(false);
  else if (location.hash.startsWith('#case-')) openCaseFile(location.hash.replace('#case-',''));
  else if (location.hash === '#casefiles') openCaseFolder();
  else {
    showView('main');
    document.title = 'Pradhum Mandil - Full-Stack & Flutter Developer';
  }
});

if (location.hash === '#resume') openResume(false);
else if (location.hash.startsWith('#case-')) openCaseFile(location.hash.replace('#case-',''));
else if (location.hash === '#casefiles') openCaseFolder();


// ---------- Background Music ----------
(() => {
  const backgroundMusic = document.getElementById('backgroundMusic');
  const soundToggle = document.getElementById('soundToggle');

  if (!backgroundMusic || !soundToggle) return;

  const soundIcon = soundToggle.querySelector('.sound-icon');
  const soundLabel = soundToggle.querySelector('.sound-label');
  const TARGET_VOLUME = 0.10;
  const STORAGE_KEY = 'pradhum-background-sound';

  let soundEnabled = localStorage.getItem(STORAGE_KEY) !== 'off';
  let userGestureReceived = false;

  backgroundMusic.loop = true;
  backgroundMusic.volume = TARGET_VOLUME;
  backgroundMusic.preload = 'auto';

  function updateSoundUI() {
    const playing = !backgroundMusic.paused && soundEnabled;

    soundToggle.classList.toggle('is-playing', playing);
    soundToggle.setAttribute('aria-pressed', String(soundEnabled));
    soundToggle.setAttribute(
      'aria-label',
      soundEnabled ? 'Turn background sound off' : 'Turn background sound on'
    );

    if (soundIcon) soundIcon.textContent = soundEnabled ? '♫' : '♪';
    if (soundLabel) soundLabel.textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF';
  }

  async function startMusic() {
    if (!soundEnabled) {
      updateSoundUI();
      return false;
    }

    try {
      backgroundMusic.volume = TARGET_VOLUME;
      await backgroundMusic.play();
      updateSoundUI();
      return true;
    } catch (error) {
      updateSoundUI();
      return false;
    }
  }

  function stopMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    updateSoundUI();
  }

  soundToggle.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    userGestureReceived = true;

    if (soundEnabled) {
      soundEnabled = false;
      localStorage.setItem(STORAGE_KEY, 'off');
      stopMusic();
    } else {
      soundEnabled = true;
      localStorage.setItem(STORAGE_KEY, 'on');
      await startMusic();
    }
  });

  startMusic();

  const firstGestureEvents = ['pointerdown', 'keydown', 'touchstart'];

  async function handleFirstGesture(event) {
    if (userGestureReceived) return;

    if (event.target && event.target.closest('#soundToggle')) {
      userGestureReceived = true;
      return;
    }

    userGestureReceived = true;

    if (soundEnabled && backgroundMusic.paused) {
      await startMusic();
    }

    firstGestureEvents.forEach((eventName) => {
      window.removeEventListener(eventName, handleFirstGesture);
    });
  }

  firstGestureEvents.forEach((eventName) => {
    window.addEventListener(eventName, handleFirstGesture, { passive: true });
  });

  backgroundMusic.addEventListener('play', updateSoundUI);
  backgroundMusic.addEventListener('pause', updateSoundUI);
  backgroundMusic.addEventListener('ended', updateSoundUI);

  updateSoundUI();
})();
