// V12 shared HUD / dark-only navigation
const body=document.body;
if(localStorage.getItem('ps-nav-v11')==='collapsed' && window.innerWidth>1024) body.classList.add('nav-collapsed');
const hud=document.getElementById('hudNav'), collapse=document.getElementById('hudCollapse'), menu=document.getElementById('menuToggle'), scrim=document.getElementById('navScrim');
if(collapse) collapse.addEventListener('click',()=>{body.classList.toggle('nav-collapsed');const c=body.classList.contains('nav-collapsed');localStorage.setItem('ps-nav-v11',c?'collapsed':'expanded');collapse.textContent=c?'»':'«';collapse.setAttribute('aria-expanded',String(!c))});
function setMenu(open){if(!hud||!menu||!scrim)return;hud.classList.toggle('open',open);scrim.classList.toggle('open',open);body.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));}
if(menu) menu.addEventListener('click',()=>setMenu(!hud.classList.contains('open')));if(scrim)scrim.addEventListener('click',()=>setMenu(false));
document.querySelectorAll('.hud-links a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
const here=(location.pathname.split('/').pop()||'index.html');document.querySelectorAll('.hud-links a').forEach(a=>{const href=a.getAttribute('href');if((here==='index.html'&&href==='index.html')||href===here)a.classList.add('active')});

const legends=[
{n:'THE CREATIVE',c:'CLASS // CREATIVE SYSTEMS',img:'assets/legends/legend-creative.webp',selectedImg:'assets/legends/legend-creative-selected.webp',d:'Turns ideas into visual systems people understand, remember and act on. Art direction, UI/UX, brand systems, campaigns and scalable creative production.',s:[['ART DIRECTION',95],['VISUAL SYSTEMS',94],['UI / UX',90],['CAMPAIGNS',92]]},
{n:'THE BUILDER',c:'CLASS // PRODUCT BUILDER',img:'assets/legends/legend-builder.webp',selectedImg:'assets/legends/legend-builder-selected.webp',d:'Builds products and systems from zero: journeys, UX flows, prototypes, tooling and practical AI-assisted workflows. with hands-on execution.',s:[['PRODUCT THINKING',95],['UX SYSTEMS',93],['PROTOTYPING',89],['EXECUTION',94]]},
{n:'THE ALL-ROUNDER',c:'CLASS // MULTIDISCIPLINARY OPERATOR',img:'assets/legends/legend-all-rounder.webp',selectedImg:'assets/legends/legend-all-rounder-selected.webp',d:'The default loadout. Creative × Product × Brand × Monetization. Connects strategy, design and business into one end-to-end system.',s:[['CREATIVE',94],['PRODUCT',95],['BRAND',94],['OPERATIONS',92]]},
{n:'THE LEADER',c:'CLASS // CREATIVE LEADERSHIP',img:'assets/legends/legend-leader.webp',selectedImg:'assets/legends/legend-leader-selected.webp',d:'Aligns teams, stakeholders and disciplines around a clear direction. Creative direction, team leadership, strategy, workflows and decision-making.',s:[['LEADERSHIP',96],['STRATEGY',94],['ALIGNMENT',93],['DIRECTION',95]]},
{n:'THE OPERATOR',c:'CLASS // GAMING & iGAMING',img:'assets/legends/legend-operator.webp',selectedImg:'assets/legends/legend-operator-selected.webp',d:'Works where product performance matters: gaming, iGaming, monetization, live ops, retention, lifecycle journeys and growth systems.',s:[['MONETIZATION',93],['LIVE OPS',94],['RETENTION',91],['GROWTH',92]]},
{n:'THE AUGMENTED',c:'CLASS // AI / AUTOMATION / ORCHESTRATION',img:'assets/legends/legend-augmented.webp',selectedImg:'assets/legends/legend-augmented-selected.webp',d:'Human judgment. Machine leverage. Uses AI as part of the workflow. not as a replacement for thinking. across local models, generative pipelines, automation, agents, rapid prototyping and AI-assisted creative/build workflows.',s:[['AI WORKFLOWS',95],['AUTOMATION',91],['GENERATIVE CREATIVE',95],['RAPID PROTOTYPING',93]],extra:'<div class="augment-extra"><small>PASSIVE ABILITY // MULTIPLIER</small><b>Enhances the capabilities of every other Legend.</b><p>AI WORKFLOWS · GENERATIVE AI · AGENT SYSTEMS · LOCAL AI · AUTOMATION · RAPID PROTOTYPING · AI-ASSISTED CREATIVE · VIBE CODING</p><div class="system-patch">AI / SI / WHATEVER WE’RE CALLING IT NOW :P <span>SYSTEM PATCH // AI → SI // Apparently.</span></div><p class="loadout">LOADOUT // ChatGPT · Claude · Ollama · ComfyUI · Stable Diffusion · Midjourney · Higgsfield · Local LLMs</p></div>'}
];
let active=2; const cards=document.querySelector('#cards');
const legendStorageKey='ofs-activated-legend-v32';
let activatedLegend=null;
try {const stored=localStorage.getItem(legendStorageKey);if(stored!==null && /^[0-5]$/.test(stored))activatedLegend=Number(stored);}catch(e){}
function syncLegendActivation(){
 const btn=document.getElementById('activateLegendButton');
 const status=document.getElementById('legendActivationStatus');
 if(!btn)return;
 const isCurrent=activatedLegend===active;
 btn.textContent=isCurrent?'✓ LEGEND ACTIVATED':'⚡ ACTIVATE '+legends[active].n;
 btn.classList.toggle('is-activated',isCurrent);
 btn.setAttribute('aria-pressed',String(isCurrent));
 if(status)status.textContent=activatedLegend===null?'NO LEGEND ACTIVATED YET':`ACTIVE LOADOUT // ${legends[activatedLegend].n}`;
 document.querySelector('.stage')?.classList.toggle('legend-energized',activatedLegend===active);
}
function activateCurrentLegend(){
 if(activatedLegend===active)return;
 activatedLegend=active;
 try{localStorage.setItem(legendStorageKey,String(active));}catch(e){}
 render(); // Rebuild the cards immediately so the newly activated card gets is-chosen and its selected artwork.
 triggerLegendSelection(active);
 document.getElementById('legendActivationStatus')?.classList.add('activation-flash');
 if(typeof window.PeteSakeTrackEvent==='function')window.PeteSakeTrackEvent('legend_activate',legends[active].n);
}
document.getElementById('activateLegendButton')?.addEventListener('click',activateCurrentLegend);
function render(){if(!cards)return;cards.innerHTML=legends.map((x,i)=>`<button type="button" class="legend-card ${i===active?'active':''} ${i===activatedLegend?'is-chosen':''}" data-i="${i}" aria-pressed="${i===active}" aria-label="Select ${x.n}"><img class="legend-default-art" src="${x.img}" alt="${x.n}"><img class="legend-selected-art" src="${x.selectedImg}" alt="" aria-hidden="true"><div class="chosen-mark" aria-hidden="true">✓ ACTIVE</div><div class="select-cue">SELECT // ${x.n.replace('THE ','')}</div><div class="tag">0${i+1} / 06 // ${x.n}</div></button>`).join('');let x=legends[active];legendName.textContent=x.n;classLabel.textContent=x.c;legendDesc.innerHTML=x.d+(x.extra||'');stats.innerHTML=x.s.map(a=>`<div class="stat"><span>${a[0]}</span><div class="bar"><i style="width:${a[1]}%"></i></div></div>`).join('');syncLegendActivation()}
function selectLegend(i,fx=false){const prev=active;active=(i+legends.length)%legends.length;render();if(fx&&prev!==active){ /* preview changes information only; activated artwork stays locked */ }}
const prevBtn=document.getElementById('prev'), nextBtn=document.getElementById('next');
if(prevBtn&&nextBtn){prevBtn.onclick=()=>selectLegend(active-1,true);nextBtn.onclick=()=>selectLegend(active+1,true);document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')prevBtn.click();if(e.key==='ArrowRight')nextBtn.click()});}
if(cards&&prevBtn&&nextBtn){
 let sx=0,sy=0,drag=false,lastWheel=0;
 // One delegated click handler keeps every rendered Legend directly mouse/touch selectable.
 cards.addEventListener('click',e=>{const card=e.target.closest('.legend-card');if(card&&cards.contains(card))selectLegend(+card.dataset.i,true)});
 // Swipe is touch/pen only. Mouse clicks are never captured, so desktop selection stays reliable.
 cards.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;sx=e.clientX;sy=e.clientY;drag=true});
 cards.addEventListener('pointerup',e=>{if(!drag)return;const dx=e.clientX-sx,dy=e.clientY-sy;drag=false;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))(dx<0?nextBtn:prevBtn).click()});
 cards.addEventListener('pointercancel',()=>drag=false);
 cards.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)+Math.abs(e.deltaY)<12)return;const now=Date.now();if(now-lastWheel<450)return;lastWheel=now;e.preventDefault();(e.deltaY>0||e.deltaX>0?nextBtn:prevBtn).click()},{passive:false});
}
const careerEvents=[
{year:'2006. 2009',title:'PALOURIOTISSA LYCEUM',role:'Apolytirion · High School Diploma',type:'education',label:'EDUCATION // FOUNDATION',skin:'THE STUDENT // ORIGIN',desc:'The education checkpoint before National Guard service and university. the foundation of the journey.',gain:'FOUNDATION + DIRECTION'},
{year:'2009. 2011',title:'NATIONAL GUARD OF CYPRUS',role:'Infantry Soldier · Motor Transport Operator',type:'side',label:'FOUNDATION MISSION',skin:'THE SOLDIER',desc:'Before the design titles and product work: structure, responsibility and showing up when required.',gain:'DISCIPLINE + RESPONSIBILITY'},
{year:'2009. PRESENT',title:'PETESAKE DESIGNS',role:'Founder · Freelance Creative Consultant',type:'founder',label:'PARALLEL MISSION',skin:'THE FREELANCER',desc:'The independent creative track running alongside the entire career. client work, experimentation, design and consulting.',gain:'INDEPENDENCE + RANGE'},
{year:'2011. 2015',title:'UNIVERSITY OF NICOSIA',role:'BA Graphic Communications · Minor in Applied Multimedia',type:'education',label:'TRAINING ARC',skin:'THE STUDENT',desc:'Formal training in graphic communications and multimedia while the freelance path was already running in parallel.',gain:'CRAFT + FOUNDATIONS'},
{year:'2012',title:'HOSPITALITY',role:'Waiter · Barman',type:'side',label:'SIDE QUEST',skin:'THE BARMAN',desc:'A very different kind of work: customers, pressure, speed and learning to deal with people face-to-face.',gain:'PEOPLE SKILLS + RESILIENCE'},
{year:'2014',title:'POLSA SERVICES',role:'Graphic Design Intern',type:'main',label:'EARLY MISSION',skin:'THE INTERN',desc:'One of the first formal steps into professional graphic design.',gain:'PRO EXPERIENCE'},
{year:'2014. 2016',title:'MOBEE PAYMENTS',role:'Graphic Designer · IT Operations',type:'main',label:'MAIN MISSION',skin:'THE TECH CREATIVE',desc:'Creative work mixed with practical technology and operations. an early sign that the career would never stay inside one box.',gain:'DESIGN + TECH'},
{year:'2016. 2018',title:'HOLYDAY STUDIOS',role:'UI/UX Designer → Art Team Lead',type:'main',label:'PROMOTION ARC',skin:'THE GAME MAKER',desc:'Entered the games industry through UI/UX and progressed into team leadership.',gain:'GAMING + LEADERSHIP'},
{year:'2018. 2022',title:'WARGAMING',role:'Senior Marketing Designer · World of Tanks Console',type:'main',label:'AAA UNLOCKED',skin:'THE AAA CREATIVE',desc:'Four years inside a global AAA live-service environment, producing campaigns and seasonal work for World of Tanks Console.',gain:'AAA + LIVE SERVICE'},
{year:'2022',title:'WARGAMING // BREAKING POINT',role:'Career path interrupted by broader company downsizing',type:'break',label:'BREAKING POINT // 01',skin:'THE RESET',desc:'After four years, the wider environment changed and the chapter closed.',lesson:'No company is permanent. Keep learning, keep building, and never let comfort stop you preparing for what comes next.',gain:'+ ADAPTABILITY'},
{year:'2022',title:'KRYPTOES',role:'Founder · NFT Project',type:'founder',label:'FOUNDER MISSION',skin:'THE NFT FOUNDER',desc:'A personal NFT project launched in 2022. a founder experiment in digital ownership, creative direction and emerging Web3 culture.',gain:'EXPERIMENTATION + OWNERSHIP'},
{year:'2022. 2023',title:'AIXBLUEKIUM',role:'Founder · E-commerce / DTC Brand',type:'founder',label:'FOUNDER MISSION',skin:'THE FOUNDER',desc:'A founder chapter focused on building and learning through an e-commerce / direct-to-consumer brand.',gain:'OWNERSHIP + EXPERIMENTATION'},
{year:'2023. 2024',title:'BLACKMILL GAMES // ISONZO',role:'Senior UI/UX Designer · Marketing',type:'main',label:'MAIN MISSION',skin:'THE UI OPERATOR',desc:'Gameplay UI systems, interfaces, marketing assets and DLC/live campaign support for a multi-platform WWI title.',gain:'UI/UX + PRODUCT'},
{year:'2024',title:'MAXQUEST',role:'Head of Brand, Product & Marketing',type:'main',label:'BUILD FROM ZERO',skin:'THE PLATFORM BUILDER',desc:'Helped build the platform from concept to live across brand, product, monetization and marketing.',gain:'PRODUCT + BRAND + MONETIZATION'},
{year:'2024',title:'MAXQUEST // BREAKING POINT',role:'Role ended during workforce reduction / restructuring',type:'break',label:'BREAKING POINT // 02',skin:'THE BUILDER',desc:'A product can be deeply personal to build even when the decisions around its future are not yours.',lesson:'Give everything to what you build, but remember: you can own the quality of your work without owning the decisions around it.',gain:'+ PERSPECTIVE'},
{year:'2024',title:'TESCO',role:'Temporary role',type:'side',label:'SIDE QUEST',skin:'THE TESCO SHIFT',desc:'Not every chapter needs to look impressive on paper. Sometimes you do the work in front of you, keep moving and prepare for the next mission.',gain:'HUMILITY + MOMENTUM'},
{year:'2024. 2025',title:'THE3RD.ONE GROUP // THE LIGHTLESS WORLD',role:'Marketing Strategist',type:'main',label:'STRATEGY MISSION',skin:'THE STRATEGIST',desc:'A strategy-focused chapter spanning marketing and game positioning.',gain:'STRATEGY + POSITIONING'},
{year:'2025',title:'HOLYDAY STUDIOS // FIRESTONE',role:'Art Director · Product, UX & Systems',type:'main',label:'RETURN MISSION',skin:'THE ART DIRECTOR',desc:'Returned at Art Director level, directing product, UX, gameplay systems and visual execution while staying hands-on.',gain:'DIRECTION + SYSTEMS'},
{year:'AUG 2025',title:'HOLYDAY STUDIOS // BREAKING POINT',role:'Art Director chapter ended through a layoff',type:'break',label:'BREAKING POINT // 03',skin:'THE REALITY CHECK',desc:'Another unexpected ending. and a clearer understanding that culture is demonstrated by actions, especially when circumstances become difficult.',lesson:'Culture is not what a company calls itself. It is how people are treated when the easy conversations are over.',gain:'+ BOUNDARIES'},
{year:'OCT. DEC 2025',title:'DARUMA // BUGSYEMPIRE',role:'Senior Graphic Designer · Live Ops & Campaigns',type:'main',label:'LIVE OPS MISSION',skin:'THE LIVE OPS CREATIVE',desc:'High-frequency promotional cycles, seasonal content and campaign bundles across web and CRM.',gain:'SPEED + LIVE OPS'},
{year:'2025. 2026',title:'CANNONBALL CODE',role:'Creative Lead Director · Product, Brand & Monetization',type:'main',label:'LEADERSHIP MISSION',skin:'THE LEAD',desc:'An intense period spanning product, UX, brand, monetization, onboarding, promotions, retention and lifecycle systems.',gain:'LEADERSHIP + SCALE'},
{year:'JAN 2026',title:'CANNONBALL CODE // BREAKING POINT',role:'Chapter ended through a layoff',type:'break',label:'BREAKING POINT // 04',skin:'THE WAKE-UP CALL',desc:'After another intense build-and-scale chapter, the lesson had become less about losing a role and more about defining what leadership should mean.',lesson:'Leadership is not a title. It is showing up, communicating directly, taking responsibility and having the difficult conversations when they matter most.',gain:'+ LEADERSHIP'},
{year:'2025. PRESENT',title:"PETE'S PARADOX",role:'Founder · Creative Director',type:'founder',label:'FOUNDER MISSION',skin:'THE CREATOR',desc:'An independent brand and creative playground running alongside the professional career.',gain:'CREATIVE OWNERSHIP'},
{year:'MAY 2026. PRESENT',title:'GENERAL BOOST',role:'Senior Graphic Designer · Performance-Focused',type:'main',label:'CURRENT MISSION',skin:'CURRENT LOADOUT',desc:'Performance-driven creative across paid social, display, email and landing pages, using testing and campaign data to improve output.',gain:'PERFORMANCE + ITERATION'}
];
const careerAssetMap={
'PALOURIOTISSA LYCEUM':['career-palouriotissa-lyceum.svg','career-school.webp'],'NATIONAL GUARD OF CYPRUS':['career-national-guard.svg','career-soldier.webp'],'PETESAKE DESIGNS':['career-petesake-designs.svg','career-petesake.webp'],'UNIVERSITY OF NICOSIA':['career-unic.svg','career-university.webp'],'HOSPITALITY':['career-eleon.svg','career-waiter.webp'],'POLSA SERVICES':['career-polsa-services.svg','career-polsa.webp'],'MOBEE PAYMENTS':['career-mobee-payments.svg','career-mobee.webp'],'HOLYDAY STUDIOS':['career-holyday-studios.svg','career-holyday.webp'],'WARGAMING':['career-wargaming.svg','career-wargaming.webp'],'AIXBLUEKIUM':['career-aixbluekium.svg','career-aixbluekium.webp'],'KRYPTOES':['career-kryptoes.svg','career-kryptoes.webp'],'BLACKMILL GAMES':['career-blackmill-games.svg','career-blackmill.webp'],'MAXQUEST':['career-maxquest.svg','career-maxquest.webp'],'TESCO':['career-tesco.svg','career-tesco.webp'],'THE3RD.ONE GROUP':['career-the3rdone.svg','career-the3rdone.webp'],"PETE'S PARADOX":['career-petes-paradox.svg','career-petes-paradox.webp'],'DARUMA':['career-daruma.svg','career-daruma.webp'],'CANNONBALL CODE':['career-cannonball-code.svg','career-cannonball.webp'],'GENERAL BOOST':['career-general-boost.svg','career-general-boost.webp']};
const careerBackgroundMap={
'PALOURIOTISSA LYCEUM':'career-bg-education.webp','UNIVERSITY OF NICOSIA':'career-bg-education.webp','NATIONAL GUARD OF CYPRUS':'career-bg-military.webp','HOSPITALITY':'career-bg-service.webp','TESCO':'career-bg-service.webp','PETESAKE DESIGNS':'career-bg-creative-studio.webp','POLSA SERVICES':'career-bg-creative-studio.webp','MOBEE PAYMENTS':'career-bg-creative-studio.webp','HOLYDAY STUDIOS':'career-bg-game-studio.webp','WARGAMING':'career-bg-game-studio.webp','BLACKMILL GAMES':'career-bg-game-studio.webp','KRYPTOES':'career-bg-founder.webp','AIXBLUEKIUM':'career-bg-founder.webp',"PETE'S PARADOX":'career-bg-founder.webp','MAXQUEST':'career-bg-leadership.webp','THE3RD.ONE GROUP':'career-bg-leadership.webp','DARUMA':'career-bg-igaming.webp','CANNONBALL CODE':'career-bg-igaming.webp','GENERAL BOOST':'career-bg-igaming.webp'};
function careerSkinFor(j,base){
 if(j.type==='break'){
  if(j.title.startsWith('WARGAMING'))return 'career-wargaming-breaking.webp';
  if(j.title.startsWith('MAXQUEST'))return 'career-maxquest-breaking.webp';
  if(j.title.startsWith('HOLYDAY'))return 'career-holyday-breaking.webp';
  if(j.title.startsWith('CANNONBALL'))return 'career-cannonball-breaking.webp';
 }
 if(j.title.includes('FIRESTONE'))return 'career-holyday-1.webp';
 return careerAssetMap[base]?.[1];
}
function careerBackgroundFor(j,base){
 if(j.title.includes('FIRESTONE'))return 'career-bg-leadership.webp';
 return careerBackgroundMap[base]||'career-bg-creative-studio.webp';
}
function careerBaseTitle(title){return Object.keys(careerAssetMap).find(k=>title.startsWith(k))||title}
function renderTimeline(filter='all'){
 const timeline=document.getElementById('timeline'); if(!timeline)return;
 const list=careerEvents.filter(j=>filter==='all'||j.type===filter).slice().reverse();
 timeline.innerHTML=list.map((j,i)=>{const base=careerBaseTitle(j.title),asset=careerAssetMap[base];const logo=asset?`<img src="assets/career-logos/${asset[0]}" alt="" onerror="this.remove()">`:'';return `<article class="campaign-event ${j.type}" data-career="${careerEvents.indexOf(j)}"><div class="event-node"></div><time>${j.year}</time><div class="event-card"><div class="event-logo-slot" aria-hidden="true">${logo}</div><small>${j.label}</small><h4>${j.title}</h4><p>${j.role}</p><b>${j.gain}</b><span>OPEN DOSSIER →</span></div></article>`}).join('');
 document.querySelectorAll('.campaign-event').forEach(e=>e.onclick=()=>openCareer(+e.dataset.career));
}
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderTimeline(b.dataset.filter)});
function careerLevel(j){
 const years=(j.year.match(/\d{4}/g)||[]).map(Number); if(!years.length)return '35';
 const age=y=>y-1991;
 if(/PRESENT/.test(j.year)){const start=age(years[0]),now=35;return start===now?String(now):`${start} → ${now}`;}
 if(years.length>1){const a=age(years[0]),b=age(years[years.length-1]);return a===b?String(a):`${a} → ${b}`;}
 return String(age(years[0]));
}
function openCareer(i){const j=careerEvents[i],m=document.getElementById('careerModal');if(!m)return;document.getElementById('careerType').textContent=j.label;document.getElementById('careerTitle').textContent=j.title;document.getElementById('careerMeta').innerHTML=`<b>${j.year}</b><span>${j.role}</span><strong>${j.gain}</strong>`;document.getElementById('careerDesc').textContent=j.desc;document.getElementById('careerLesson').innerHTML=j.lesson?`<small>LESSON UNLOCKED</small><blockquote>${j.lesson}</blockquote>`:'';const base=careerBaseTitle(j.title),asset=careerAssetMap[base],skin=careerSkinFor(j,base),bg=careerBackgroundFor(j,base),level=careerLevel(j);const logo=document.getElementById('careerLogo'),art=document.getElementById('careerSkinArt');if(logo)logo.innerHTML=asset?`<img src="assets/career-logos/${asset[0]}" alt="${base} logo">`:'<span>COMPANY MARK</span>';if(art)art.innerHTML=`<div class="career-scene-bg" style="background-image:url('assets/career-backgrounds/${bg}')"></div><div class="career-scene-shade"></div><img class="career-character" src="assets/career-skins/${skin}" alt="${j.skin}" loading="eager"><div class="career-scene-hud"><div class="career-skin-name">${j.skin}</div><div class="career-level"><small>PLAYER LEVEL</small><strong>${level}</strong><em>AGE // CAREER CHECKPOINT</em></div></div>`;m.classList.toggle('breaking-dossier',j.type==='break');m.classList.add('open')}
const careerModalEl=document.getElementById('careerModal'),careerCloseEl=document.getElementById('careerClose');if(careerCloseEl)careerCloseEl.onclick=()=>careerModalEl.classList.remove('open');if(careerModalEl)careerModalEl.onclick=e=>{if(e.target===careerModalEl)careerModalEl.classList.remove('open')};

const projects=[
{n:'GENERAL BOOST',type:'PERFORMANCE CREATIVE · GROWTH',desc:'Current role focused on performance-driven creative across paid social, display, email and landing pages, using testing and campaign data to improve creative output.',slug:'general-boost'},
{n:'PETESAKE DESIGNS',type:'FREELANCE · CREATIVE CONSULTING',desc:'Independent creative practice spanning brand, visual design, product thinking and creative consulting across client and self-initiated work.',slug:'petesake-designs'},
{n:'HOLYDAY STUDIOS',type:'ART DIRECTION · PRODUCT · UX',desc:'Art direction, product UX, gameplay systems and visual execution across Holyday Studios projects, including Firestone Idle RPG.',slug:'holyday-studios'},
{n:'MAXQUEST',type:'BRAND · PRODUCT · MARKETING',desc:'A platform built from concept to live across identity, product experience, monetization and launch systems.',slug:'maxquest'},
{n:'CANNONBALL CODE',type:'PRODUCT · BRAND · MONETIZATION',desc:'Creative leadership, product, UX, lifecycle, promotions and monetization systems developed at Cannonball Code, including work across the SweepKings environment.',slug:'cannonball-code'},
{n:'WORLD OF TANKS',type:'AAA LIVE SERVICE · CAMPAIGNS',desc:'Global live-service creative and campaign work including major entertainment collaborations.',slug:'wot'},
{n:'ISONZO',type:'UI/UX · MARKETING',desc:'Gameplay UI systems, interfaces and campaign support for Blackmill Games’ multi-platform WWI title.',slug:'isonzo'},
{n:'THE LIGHTLESS WORLD',type:'GAME · MARKETING STRATEGY',desc:'Marketing strategy and positioning work for The Lightless World during the THE3RD.ONE chapter. Selected visual evidence from the project.',slug:'the-lightless-world'},
{n:'BUGSYEMPIRE',type:'LIVE OPS · CAMPAIGNS',desc:'High-frequency promotional and seasonal creative across web, CRM and live campaign cycles.',slug:'bugsy'},
{n:'AIXBLUEKIUM',type:'FOUNDER · DIGITAL VENTURE',desc:'Founder-led digital venture exploring products, brand systems and emerging technologies. Full case study and supporting artwork coming soon.',slug:'aixbluekium',group:'founder'},
{n:'KRYPTOES',type:'FOUNDER · WEB3 / NFT',desc:'Founder-led Web3 and NFT project developed in 2022. Full case study and supporting artwork coming soon.',slug:'kryptoes',group:'founder'},
{n:"PETE'S PARADOX",type:'FOUNDER · BRAND / E-COMMERCE',desc:'Independent creative brand bringing together original design, digital products, e-commerce and experimentation. Full case study and supporting artwork coming soon.',slug:'petes-paradox',group:'founder'}
];
const projectGridEl=document.getElementById('projectGrid');
function projectImagePath(p,k=1){return `assets/projects/${p.slug}-${String(k).padStart(2,'0')}.webp`}
if(projectGridEl){
 projectGridEl.innerHTML=projects.map((p,i)=>`${p.group==='founder'&&(i===0||projects[i-1].group!=='founder')?'<div class="project-group-heading founder-group-heading"><small>04 // FOUNDER MISSIONS</small><h3>FOUNDER // BUILT FROM ZERO.</h3><p>My own ventures, ideas and brands. Select a case file to explore the mission.</p></div>':''}<article class="project-card ${p.group==='founder'?'project-founder':''}" data-project="${i}"><div class="project-visual"><span class="project-fallback-no">0${i+1}</span><img src="${projectImagePath(p)}" alt="" loading="lazy"></div><div class="project-overlay"><span class="project-no">${p.group==='founder'?'FOUNDER FILE':'CASE FILE'} // ${String(i+1).padStart(2,'0')}</span><h3>${p.n}</h3><p>${p.type}</p><span class="view">OPEN PROJECT →</span></div></article>`).join('');
 projectGridEl.querySelectorAll('.project-visual img').forEach(img=>{img.addEventListener('load',()=>img.closest('.project-card')?.classList.add('has-image'));img.addEventListener('error',()=>img.remove())});
}
document.querySelectorAll('.project-card').forEach(c=>c.onclick=()=>openProject(+c.dataset.project));
function openProject(i){
 const p=projects[i],m=document.getElementById('projectModal'),gallery=document.getElementById('modalGallery');if(!m||!gallery)return;
 document.getElementById('modalType').textContent=p.type;document.getElementById('modalTitle').textContent=p.n;document.getElementById('modalDesc').textContent=p.desc;
 gallery.innerHTML='';gallery.className='project-gallery is-loading';
 const found=[];let finished=0;
 const maxImages=p.slug==='petesake-designs'?10:p.slug==='cannonball-code'?2:p.slug==='wot'?6:p.slug==='isonzo'?4:p.slug==='maxquest'?3:p.slug==='general-boost'?5:4;
 for(let k=1;k<=maxImages;k++){const img=new Image();img.onload=()=>{found.push({k,src:img.src});done()};img.onerror=done;img.src=projectImagePath(p,k)}
 function done(){if(++finished<maxImages)return;found.sort((a,b)=>a.k-b.k);gallery.className=`project-gallery count-${found.length}`;found.forEach(({k,src})=>{const slot=document.createElement('figure');slot.className='gallery-slot gallery-interactive';const img=document.createElement('img');img.src=src;img.alt=`${p.n} portfolio case study ${k}`;img.loading='lazy';slot.appendChild(img);const caption=document.createElement('figcaption');caption.className='gallery-caption';caption.textContent=getProjectCaption(p,k);slot.appendChild(caption);const zoom=document.createElement('button');zoom.type='button';zoom.className='gallery-zoom';zoom.textContent='EXPAND ↗';zoom.setAttribute('aria-label',`Expand ${p.n} artwork ${k}`);zoom.addEventListener('click',()=>openArtworkLightbox(p,k,src));slot.appendChild(zoom);slot.tabIndex=0;slot.setAttribute('role','button');slot.setAttribute('aria-label',`Expand ${p.n} artwork ${k}`);slot.addEventListener('click',e=>{if(!e.target.closest('.gallery-zoom'))openArtworkLightbox(p,k,src)});slot.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openArtworkLightbox(p,k,src)}});gallery.appendChild(slot)});if(!found.length){const empty=document.createElement('div');empty.className='gallery-empty';empty.textContent='VISUAL EVIDENCE // COMING SOON';gallery.appendChild(empty)}}
 m.classList.add('open')
}
const projectCaptions={
 'wot':{1:'World of Tanks: Console // Selected live-service creative. Campaign artwork and communication designed for players across digital touchpoints.',2:'World of Tanks: Console // Marketing composition from a multi-channel creative portfolio, balancing game identity with promotional readability.',3:'World of Tanks: Console // Promotional visual developed for a live-service gaming audience.',4:'World of Tanks: Console // Campaign and presentation artwork from the Wargaming chapter.',5:'World of Tanks: Console // Selected design execution demonstrating brand consistency across game marketing.',6:'WORLD TURTLE DAY // Social campaign for 23 May 2021. A tongue-in-cheek turtle-tank concept created for World of Tanks: Console social channels.'},
 'isonzo':{1:'BREAD IS THE KEY TO VICTORY // WWI-style propaganda poster concept for Isonzo’s Bread Hunt 2025 event, including illustrated character, medal concept, colour palette and poster variations.',2:'ISONZO // Historical visual storytelling, balancing period atmosphere and clear communication.',3:'ISONZO // Game and promotional design within a historically grounded visual identity.',4:'ISONZO // Selected artwork from the Italian Front creative portfolio.'},
 'petes-paradox':{1:'PETE’S PARADOX // Cyprus-born independent streetwear brand. Original Cypriot dialect sayings, playful illustrations and offbeat humour meet black, white and electric-green visual identity.'},
 'aixbluekium':{1:'AIXBLUEKIUM // Founder project. Brand identity and marketing exploration combining AI-oriented positioning with a distinct visual system.'},
 'kryptoes':{1:'KRYPTOES // Founder-led Web3/NFT project. Brand and digital collectible identity work.'},
 'general-boost':{1:'GENERAL BOOST // Performance-focused creative for digital campaigns and growth-oriented delivery.',2:'GENERAL BOOST // Selected creative execution for performance marketing touchpoints.',3:'GENERAL BOOST // Digital advertising creative developed with iteration and channel requirements in mind.',4:'GENERAL BOOST // Visual production supporting campaign communication and experimentation.',5:'MR. EGG PRIMAL // Prehistoric-themed slot game artwork featuring character design, reel symbols, game interface and mobile presentation. A showcase of playful game art and promotional composition.'},
 'holyday-studios':{1:'HOLYDAY STUDIOS // Game art and product visual direction across the studio’s portfolio, including Firestone Idle RPG.',2:'HOLYDAY STUDIOS // Selected creative and UI/UX exploration for game experiences.',3:'HOLYDAY STUDIOS // Game-oriented design systems and visual communication.',4:'HOLYDAY STUDIOS // Selected art-direction and production work.'},
 'maxquest':{1:'MAXQUEST // Product and brand creative developed for a competitive gaming platform.'},
 'cannonball-code':{1:'CANNONBALL CODE // Product, brand and promotional creative from the SweepKing/SweepKings chapter.',2:'CANNONBALL CODE // Coin pack redesign, before-and-after comparison and a new king mascot concept.'},
 'bugsy':{1:'BUGSYEMPIRE // Promotional artwork supporting live operations and player-facing campaigns.',2:'BUGSYEMPIRE // Additional campaign visual for digital marketing and lifecycle communication.'},
 'the-lightless-world':{1:'THE LIGHTLESS WORLD // Dark-fantasy game positioning and promotional visual identity. Selected creative from the THE3RD.ONE chapter.'},
 'petesake-designs':{1:'PETESAKE DESIGNS // Independent creative portfolio: brand identity and visual problem-solving.',2:'PETESAKE DESIGNS // Selected design work across commercial and personal projects.',3:'PETESAKE DESIGNS // Creative exploration, visual direction and client delivery.',4:'PETESAKE DESIGNS // Selected graphic-design and presentation work.',5:'PETESAKE DESIGNS // Branding and visual communication across formats.',6:'PETESAKE DESIGNS // Creative development and production artwork.',7:'PETESAKE DESIGNS // Selected concept-to-execution design.',8:'PETESAKE DESIGNS // Additional independent creative portfolio work.',9:'WHISKY LINES // Premium liquor store branding, logo exploration, visual identity and packaging mockups.',10:'DAILY REWARDS // Mobile game feature concept with reward UI, player flow and wireframes.'},
};
function getProjectCaption(p,k){
if(p.slug==='maxquest'){const captions={1:'MAXQUEST // Brand and product identity. shaping a coherent visual language for the platform.',2:'MAXQUEST // Interface and experience design. translating product goals into clear, scalable visual systems.',3:'MAXQUEST // Campaign and launch creative. extending the brand across marketing and player-facing touchpoints.'};return captions[k]||'MAXQUEST // Product and brand design.';}
return projectCaptions[p.slug]?.[k]||`${p.n} // SELECTED WORK ${String(k).padStart(2,'0')}. Portfolio artwork from this project.`}
let artworkLightboxIndex=0,artworkLightboxItems=[];
function openArtworkLightbox(p,k,src){
 const lb=document.getElementById('artworkLightbox');if(!lb)return;
 artworkLightboxItems=Array.from(document.querySelectorAll('#modalGallery .gallery-interactive')).map(el=>({src:el.querySelector('img').src,caption:el.querySelector('.gallery-caption').textContent}));
 artworkLightboxIndex=Math.max(0,artworkLightboxItems.findIndex(item=>item.src===src));
 updateArtworkLightbox();lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.classList.add('artwork-lightbox-open');document.getElementById('artworkClose').focus();
}
function updateArtworkLightbox(){const item=artworkLightboxItems[artworkLightboxIndex];if(!item)return;const full=document.getElementById('artworkFullImage');full.classList.remove('artwork-reveal');void full.offsetWidth;full.src=item.src;full.classList.add('artwork-reveal');document.getElementById('artworkFullImage').alt=item.caption;document.getElementById('artworkCaption').textContent=item.caption;document.getElementById('artworkCount').textContent=`${artworkLightboxIndex+1} / ${artworkLightboxItems.length}`;}
function closeArtworkLightbox(){const lb=document.getElementById('artworkLightbox');if(!lb)return;lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.classList.remove('artwork-lightbox-open');}
document.getElementById('artworkClose')?.addEventListener('click',closeArtworkLightbox);
document.getElementById('artworkPrev')?.addEventListener('click',()=>{artworkLightboxIndex=(artworkLightboxIndex-1+artworkLightboxItems.length)%artworkLightboxItems.length;updateArtworkLightbox()});
document.getElementById('artworkNext')?.addEventListener('click',()=>{artworkLightboxIndex=(artworkLightboxIndex+1)%artworkLightboxItems.length;updateArtworkLightbox()});
document.getElementById('artworkLightbox')?.addEventListener('click',e=>{if(e.target.id==='artworkLightbox')closeArtworkLightbox()});
document.addEventListener('keydown',e=>{if(!document.getElementById('artworkLightbox')?.classList.contains('open'))return;if(e.key==='Escape'){e.stopPropagation();closeArtworkLightbox()}if(e.key==='ArrowLeft'){artworkLightboxIndex=(artworkLightboxIndex-1+artworkLightboxItems.length)%artworkLightboxItems.length;updateArtworkLightbox()}if(e.key==='ArrowRight'){artworkLightboxIndex=(artworkLightboxIndex+1)%artworkLightboxItems.length;updateArtworkLightbox()}});
const projectModalEl=document.getElementById('projectModal'),modalCloseEl=document.getElementById('modalClose');if(modalCloseEl)modalCloseEl.onclick=()=>projectModalEl.classList.remove('open');if(projectModalEl)projectModalEl.onclick=e=>{if(e.target===projectModalEl)projectModalEl.classList.remove('open')};document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(projectModalEl)projectModalEl.classList.remove('open');if(careerModalEl)careerModalEl.classList.remove('open')}});
renderTimeline();render();


// V10 interaction + lightweight VFX
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function setupCanvas(canvas){if(!canvas)return null;const ctx=canvas.getContext('2d');let dpr=Math.min(devicePixelRatio||1,2);function size(){const r=canvas.getBoundingClientRect();canvas.width=Math.max(1,r.width*dpr);canvas.height=Math.max(1,r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}size();addEventListener('resize',size,{passive:true});return {ctx,size}}
const lv=document.getElementById('legendVfx'),lvc=setupCanvas(lv);let legendBurst=0;
function triggerLegendSelection(i){legendBurst=performance.now()+850;const msg=document.getElementById('legendSystemMsg');if(msg){msg.innerHTML=`<b>SYSTEM // LOADOUT CHANGED</b><span>${legends[i].c.replace('CLASS // ','')}</span>`;msg.classList.remove('show');void msg.offsetWidth;msg.classList.add('show')}}
if(lvc&&!reduceMotion){let particles=Array.from({length:innerWidth<700?18:42},()=>({x:Math.random(),y:Math.random(),v:.08+Math.random()*.22,s:.5+Math.random()*1.8}));function drawLegend(t){const r=lv.getBoundingClientRect(),ctx=lvc.ctx;ctx.clearRect(0,0,r.width,r.height);ctx.fillStyle='rgba(0,246,255,.42)';particles.forEach(p=>{p.y-=p.v/100;p.x+=Math.sin(t/700+p.y*8)*.0002;if(p.y<0)p.y=1;ctx.fillRect(p.x*r.width,p.y*r.height,p.s,p.s*2)});if(t<legendBurst){const q=(legendBurst-t)/850;ctx.strokeStyle=`rgba(0,246,255,${q*.75})`;ctx.lineWidth=1;for(let k=0;k<5;k++){const y=r.height*(1-q)+k*9;ctx.beginPath();ctx.moveTo(r.width*.28,y);ctx.lineTo(r.width*.72,y);ctx.stroke()}ctx.beginPath();ctx.arc(r.width/2,r.height*.72,(1-q)*180+30,0,Math.PI*2);ctx.stroke()}requestAnimationFrame(drawLegend)}requestAnimationFrame(drawLegend)}
const hv=document.getElementById('heroVfx'),hvc=setupCanvas(hv),hero=document.getElementById('homeHero');
if(hvc&&!reduceMotion){
 const mobile=innerWidth<700, smoke=[], sparks=[];
 const smokeCount=mobile?18:34, sparkCount=mobile?20:46;
 const rnd=(a,b)=>a+Math.random()*(b-a);
 function resetSmoke(p,initial=false){p.x=rnd(.37,.62);p.y=initial?rnd(.34,.72):rnd(.55,.70);p.r=rnd(28,92);p.vx=rnd(-.00010,.00013);p.vy=rnd(-.00016,-.000055);p.life=initial?Math.random():0;p.decay=rnd(.00018,.00034);p.phase=Math.random()*6.28}
 for(let i=0;i<smokeCount;i++){const p={};resetSmoke(p,true);smoke.push(p)}
 function resetSpark(p,initial=false){p.x=rnd(.43,.57);p.y=rnd(.48,.63);const a=rnd(-2.75,-.38),v=rnd(.00015,.0007);p.vx=Math.cos(a)*v;p.vy=Math.sin(a)*v;p.life=initial?Math.random():0;p.decay=rnd(.0005,.0015);p.s=rnd(.6,2.2)}
 for(let i=0;i<sparkCount;i++){const p={};resetSpark(p,true);sparks.push(p)}
 let last=performance.now(), visible=true;
 if('IntersectionObserver'in window&&hero)new IntersectionObserver(e=>visible=e[0]?.isIntersecting??true,{threshold:.01}).observe(hero);
 function drawHero(t){requestAnimationFrame(drawHero);if(!visible||document.hidden)return;const dt=Math.min(32,t-last||16);last=t;const r=hv.getBoundingClientRect(),ctx=hvc.ctx,w=r.width,h=r.height;ctx.clearRect(0,0,w,h);
   const pulse=.5+.5*Math.sin(t*.00125),cx=w*(.49+Math.sin(t*.00031)*.008),cy=h*.56;
   const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,w*.25);glow.addColorStop(0,`rgba(225,255,255,${.13+.07*pulse})`);glow.addColorStop(.09,`rgba(0,246,255,${.12+.05*pulse})`);glow.addColorStop(.38,'rgba(0,145,255,.035)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
   ctx.globalCompositeOperation='screen';
   smoke.forEach(p=>{p.life+=dt*p.decay;p.x+=p.vx*dt+Math.sin(t*.0007+p.phase)*.000012*dt;p.y+=p.vy*dt;p.r+=dt*.012;if(p.life>1||p.y<.20)resetSmoke(p);const a=Math.sin(Math.PI*Math.min(1,p.life))*.075;const g=ctx.createRadialGradient(p.x*w,p.y*h,0,p.x*w,p.y*h,p.r);g.addColorStop(0,`rgba(190,248,255,${a})`);g.addColorStop(.28,`rgba(0,210,255,${a*.72})`);g.addColorStop(1,'rgba(0,50,90,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x*w,p.y*h,p.r,0,Math.PI*2);ctx.fill()});
   sparks.forEach(p=>{p.life+=dt*p.decay;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.0000011*dt;if(p.life>1||p.x<.25||p.x>.75||p.y<.25||p.y>.8)resetSpark(p);const a=(1-p.life)*(.25+.35*pulse);ctx.fillStyle=`rgba(160,250,255,${a})`;ctx.shadowBlur=8;ctx.shadowColor='#00f6ff';ctx.fillRect(p.x*w,p.y*h,p.s,p.s*2.8)});ctx.shadowBlur=0;ctx.globalCompositeOperation='source-over';
 }
 requestAnimationFrame(drawHero);
 if(hero&&matchMedia('(pointer:fine)').matches)hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hero.style.setProperty('--px',`${x*10}px`);hero.style.setProperty('--py',`${y*6}px`)})
}

const selectCta=document.getElementById('selectLegendCta');if(selectCta)selectCta.addEventListener('click',()=>{document.body.classList.add('interface-pulse');setTimeout(()=>document.body.classList.remove('interface-pulse'),650)});


// V15 // PETESAKE SYSTEM GLITCH LOADER
(()=>{const l=document.getElementById('siteLoader');if(!l)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const repeat=sessionStorage.getItem('ps-v15-boot')==='1';const lines=['INITIALIZING PLAYER PROFILE...','LOADING CAREER DATA...','SYNCING LEGEND LOADOUTS...','CALIBRATING VFX...','READY.'];const msg=l.querySelector('[data-loader-msg]'),bar=l.querySelector('.site-loader-fill'),pct=l.querySelector('[data-loader-pct]');if(reduced){l.remove();return}sessionStorage.setItem('ps-v15-boot','1');let duration=repeat?380:1250,start=performance.now(),last=-1;function tick(now){let q=Math.min(1,(now-start)/duration),n=Math.min(lines.length-1,Math.floor(q*lines.length));if(n!==last&&msg){last=n;msg.textContent=lines[n];msg.classList.remove('glitch-pop');void msg.offsetWidth;msg.classList.add('glitch-pop')}if(bar)bar.style.transform=`scaleX(${q})`;if(pct)pct.textContent=`${Math.round(q*100)}%`;if(q<1)requestAnimationFrame(tick);else{l.classList.add('loader-exit');setTimeout(()=>l.remove(),520)}}requestAnimationFrame(tick)})();

// V14 // 404 ERROR GLITCH
(()=>{const page=document.querySelector('.error404');if(!page||reduceMotion)return;const code=page.querySelector('.error-code');const status=page.querySelector('[data-error-status]');const states=['ERROR // MISSION PATH NOT FOUND','TRACE // ROUTE LOST','BUILDER // CONFUSED','RECOVERY // BACK TO BASE'];let i=0;setInterval(()=>{if(document.hidden)return;i=(i+1)%states.length;if(status)status.textContent=states[i];if(code){code.classList.remove('error-jolt');void code.offsetWidth;code.classList.add('error-jolt')}},1900)})();


// V15 // MOTION SYSTEM 2.0. responsive, lightweight, no animation framework
(()=>{
 if(reduceMotion) return;
 document.documentElement.classList.add('motion-ready');
 const reveal=[...document.querySelectorAll('main section, .campaign-event, .project-card, .world-card, .affiliation-card')];
 reveal.forEach((el,i)=>{el.classList.add('motion-reveal');el.style.setProperty('--reveal-delay',`${Math.min(i%5,4)*45}ms`)});
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-in');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -8%'});
 reveal.forEach(el=>io.observe(el));

 // Scroll-linked progress + hero depth. rAF keeps the scroll handler cheap.
 const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
 let ticking=false;
 function scrollFx(){
   const y=scrollY,max=Math.max(1,document.documentElement.scrollHeight-innerHeight),q=Math.min(1,y/max);
   progress.style.transform=`scaleX(${q})`;
   document.documentElement.style.setProperty('--scroll-y',`${Math.min(y,900)}px`);
   if(hero){const r=hero.getBoundingClientRect(),local=Math.max(-1,Math.min(1,-r.top/Math.max(1,r.height)));hero.style.setProperty('--hero-scroll',local)}
   ticking=false;
 }
 addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(scrollFx)}},{passive:true});scrollFx();

 // Pointer-reactive depth / proximity glow for interactive surfaces.
 if(matchMedia('(pointer:fine)').matches){
   document.querySelectorAll('.legend-card,.project-card,.event-card,.cta,.filter').forEach(el=>{
     el.classList.add('reactive-surface');
     el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;el.style.setProperty('--mx',`${x*100}%`);el.style.setProperty('--my',`${y*100}%`);el.style.setProperty('--rx',`${(0.5-y)*3}deg`);el.style.setProperty('--ry',`${(x-0.5)*4}deg`)});
     el.addEventListener('pointerleave',()=>{el.style.removeProperty('--rx');el.style.removeProperty('--ry')});
   });
 }

 // Internal page links get a fast HUD wipe; same-page anchors remain immediate/smooth.
 const wipe=document.createElement('div');wipe.className='page-wipe';wipe.innerHTML='<i></i><span>SYSTEM // TRANSFERRING</span>';document.body.appendChild(wipe);
 document.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',e=>{
   if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download'))return;
   const href=a.getAttribute('href');
   if(!href||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('http')||/\.(pdf|docx|zip|png|jpe?g|webp)(?:[?#]|$)/i.test(href))return;
   const url=new URL(href,location.href);
   const sameDocument=url.origin===location.origin && url.pathname===location.pathname && !!url.hash;
   if(href.startsWith('#')||sameDocument){
     const target=document.querySelector(url.hash);
     if(target){e.preventDefault();target.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});history.replaceState(null,'',url.hash);}
     return;
   }
   e.preventDefault();wipe.classList.add('active');setTimeout(()=>location.href=href,260);setTimeout(()=>wipe.classList.remove('active'),1800);setTimeout(()=>wipe.classList.remove('active'),1800);
 }));
})();

// V60 // About portrait follows the explicitly activated Legend, not the preview.
(()=>{
 const portrait=document.getElementById('aboutLegendPortrait');
 if(!portrait)return;
 const names=['CREATIVE','BUILDER','ALL-ROUNDER','LEADER','OPERATOR','AUGMENTED'];
 const powers=['IDEAS INTO REALITY','BUILD FROM ZERO','ADAPT · BUILD · LEAD','LEAD THE TEAM','MAKE IT PERFORM','AI · AUTOMATE · CREATE'];
 const assets=['legend-creative','legend-builder','legend-all-rounder','legend-leader','legend-operator','legend-augmented'];
 let selected=2;
 try{const stored=localStorage.getItem('ofs-activated-legend-v32');if(stored!==null&&/^[0-5]$/.test(stored))selected=Number(stored);}catch(e){}
 portrait.src='assets/legends/'+assets[selected]+'-selected.webp';
 const strength=document.getElementById('aboutLegendStrength');if(strength)strength.textContent=powers[selected];
 const status=document.getElementById('aboutActiveLegend');if(status)status.textContent=names[selected]+' // ACTIVE';
})();

// V16 // DYNAMIC PLAYER LEVEL. birthday: 2 April 1991
(()=>{
 const now=new Date();
 const year=now.getFullYear();
 const birthdayThisYear=new Date(year,3,2);
 const level=year-1991-(now<birthdayThisYear?1:0);
 const lastBirthday=new Date(now.getFullYear()-(now<birthdayThisYear?1:0),3,2);
 const nextBirthday=new Date(lastBirthday.getFullYear()+1,3,2);
 const progress=Math.max(0,Math.min(1,(now-lastBirthday)/(nextBirthday-lastBirthday)));
 const progressPercent=(progress*100).toFixed(3)+'%';
 document.querySelectorAll('[data-player-level]').forEach(el=>el.textContent=String(level));
 document.documentElement.style.setProperty('--player-level',String(level));
 document.documentElement.style.setProperty('--birthday-progress',progressPercent);
 document.querySelectorAll('.level-ring').forEach(el=>{el.setAttribute('role','progressbar');el.setAttribute('aria-label','Progress towards next birthday level');el.setAttribute('aria-valuemin','0');el.setAttribute('aria-valuemax','100');el.setAttribute('aria-valuenow',String(Math.floor(progress*100)));el.title=Math.floor(progress*100)+'% towards level '+(level+1);});
 document.querySelectorAll('.mini-intel').forEach(el=>{el.setAttribute('title',Math.floor(progress*100)+'% towards level '+(level+1));});
 // Birthday-only HUD event. Automatically updates every 2 April without server work.
 if(now.getMonth()===3&&now.getDate()===2&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const toast=document.createElement('div');toast.className='level-up-toast';toast.innerHTML=`<small>PLAYER PROGRESSION // UNLOCKED</small><b>LEVEL UP // ${level}</b><span>+1 YEAR XP ACQUIRED</span>`;document.body.appendChild(toast);
   requestAnimationFrame(()=>toast.classList.add('show'));setTimeout(()=>toast.classList.remove('show'),4200);setTimeout(()=>toast.remove(),4800);
 }
})();

// V16 // INTERACTION PASS 3.0. section focus, kinetic headings, cursor energy, magnetic CTAs
(()=>{
 if(reduceMotion)return;
 const fine=matchMedia('(pointer:fine)').matches;
 const sections=[...document.querySelectorAll('main > section')];
 const focusIO=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('section-active',e.isIntersecting)),{threshold:.32});
 sections.forEach(s=>focusIO.observe(s));
 // Give section headings a restrained split/scan response as they enter view.
 document.querySelectorAll('.section-title h2,.final h2,.motto blockquote').forEach(el=>el.classList.add('kinetic-copy'));
 if(fine){
   const orb=document.createElement('div');orb.className='cursor-energy';orb.setAttribute('aria-hidden','true');document.body.appendChild(orb);
   let tx=-100,ty=-100,x=tx,y=ty;addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY},{passive:true});
   function follow(){x+=(tx-x)*.16;y+=(ty-y)*.16;orb.style.transform=`translate3d(${x}px,${y}px,0)`;requestAnimationFrame(follow)}requestAnimationFrame(follow);
   document.querySelectorAll('.cta,.filter,.hud-links a').forEach(el=>{
     el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mag-x',`${(e.clientX-r.left-r.width/2)*.08}px`);el.style.setProperty('--mag-y',`${(e.clientY-r.top-r.height/2)*.12}px`)});
     el.addEventListener('pointerleave',()=>{el.style.setProperty('--mag-x','0px');el.style.setProperty('--mag-y','0px')});
   });
 }
 // Career line progress responds to how far the campaign has travelled through viewport.
 const campaign=document.querySelector('.campaign-line');
 if(campaign){let busy=false;const update=()=>{const r=campaign.getBoundingClientRect(),vh=innerHeight;const q=Math.max(0,Math.min(1,(vh*.78-r.top)/(r.height+vh*.25)));campaign.style.setProperty('--campaign-progress',q);busy=false};addEventListener('scroll',()=>{if(!busy){busy=true;requestAnimationFrame(update)}},{passive:true});update()}
})();


// V17 // RESPONSIVE WORLD. spatial scroll, HUD section tracking, text decode, card focus
(()=>{
 if(reduceMotion)return;
 const fine=matchMedia('(pointer:fine)').matches;
 const sections=[...document.querySelectorAll('main > section[id]')];
 // Active navigation follows the current "mission" while scrolling.
 if(sections.length){
   const nav=[...document.querySelectorAll('.hud-links a[href*="#"]')];
   const navIO=new IntersectionObserver(entries=>entries.forEach(e=>{
     if(!e.isIntersecting)return;
     nav.forEach(a=>a.classList.toggle('mission-active',a.getAttribute('href').endsWith('#'+e.target.id)));
   }),{rootMargin:'-35% 0px -50%',threshold:0});
   sections.forEach(s=>navIO.observe(s));
 }
 // Decode headings once when they enter view. Keeps text readable and animation purposeful.
 const glyphs='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>[]';
 const decode=[...document.querySelectorAll('.section-title small,.eyebrow,.intel-top small')];
 const decodeIO=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return; decodeIO.unobserve(entry.target);
   const el=entry.target, target=el.textContent, chars=[...target]; let frame=0, max=Math.max(8,chars.length*1.25);
   const timer=setInterval(()=>{frame++;el.textContent=chars.map((ch,i)=> ch===' '||'·/-'.includes(ch)?ch:(i<frame/1.25?ch:glyphs[(Math.random()*glyphs.length)|0])).join('');if(frame>=max){clearInterval(timer);el.textContent=target}},24);
 }),{threshold:.6}); decode.forEach(el=>decodeIO.observe(el));
 // Mouse proximity focus: hovered cards pull visual priority while siblings recede slightly.
 document.querySelectorAll('.legend-stage,.project-grid,.world-grid,.affiliation-grid').forEach(group=>{
   const cards=[...group.children]; cards.forEach(card=>{card.addEventListener('pointerenter',()=>{group.classList.add('has-focus');card.classList.add('is-focus')});card.addEventListener('pointerleave',()=>{group.classList.remove('has-focus');card.classList.remove('is-focus')})});
 });
 // Scroll velocity drives a tiny interface skew/glitch energy, clamped so it never becomes nauseating.
 let lastY=scrollY,lastT=performance.now(),energy=0,raf=0;
 addEventListener('scroll',()=>{const now=performance.now(),dy=scrollY-lastY,dt=Math.max(16,now-lastT);energy=Math.max(-1,Math.min(1,dy/dt*.16));lastY=scrollY;lastT=now;if(!raf)raf=requestAnimationFrame(()=>{document.documentElement.style.setProperty('--scroll-energy',energy.toFixed(3));clearTimeout(window.__ofsEnergy);window.__ofsEnergy=setTimeout(()=>document.documentElement.style.setProperty('--scroll-energy','0'),120);raf=0})},{passive:true});
 // Fine-pointer hero/world depth layers without adding WebGL or dependencies.
 if(fine){
   document.querySelectorAll('.hero,.worlds,.projects').forEach(zone=>zone.addEventListener('pointermove',e=>{const r=zone.getBoundingClientRect();zone.style.setProperty('--zone-x',((e.clientX-r.left)/r.width-.5).toFixed(3));zone.style.setProperty('--zone-y',((e.clientY-r.top)/r.height-.5).toFixed(3))}));
 }
})();

// V24 // LAYERED HERO DEPTH + HAND-TO-CURSOR + CYBORG CURSOR
(()=>{
 const root=document.body, hero=document.getElementById('homeHero');
 if(!root.classList.contains('ofs-v24')) return;
 const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(fine && !reduced){
   const cursor=document.createElement('div');cursor.className='cyborg-cursor';cursor.setAttribute('aria-hidden','true');cursor.innerHTML='<i></i>';document.body.appendChild(cursor);
   let cx=-100,cy=-100,tx=-100,ty=-100,raf=0;
   const tick=()=>{cx+=(tx-cx)*.34;cy+=(ty-cy)*.34;cursor.style.transform=`translate3d(${cx-15}px,${cy-15}px,0)`;raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);
   addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;cursor.style.opacity='1'},{passive:true});
   addEventListener('pointerdown',()=>cursor.classList.add('active'),{passive:true});addEventListener('pointerup',()=>cursor.classList.remove('active'),{passive:true});
   document.documentElement.addEventListener('mouseleave',()=>cursor.style.opacity='0');
   if(hero){
     hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();const nx=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width-.5)*2));const ny=Math.max(-1,Math.min(1,((e.clientY-r.top)/r.height-.5)*2));hero.style.setProperty('--hero-x',nx.toFixed(3));hero.style.setProperty('--hero-y',ny.toFixed(3));hero.style.setProperty('--hand-x',`${nx*22}px`);hero.style.setProperty('--hand-y',`${ny*16}px`);hero.style.setProperty('--hero-burst',String(Math.max(0,1-Math.hypot(nx,ny)/1.4).toFixed(3)))});
     hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--hero-x','0');hero.style.setProperty('--hero-y','0');hero.style.setProperty('--hand-x','0px');hero.style.setProperty('--hand-y','0px')});
   }
 }
 if(hero && !reduced){let queued=false;const update=()=>{const r=hero.getBoundingClientRect();const p=Math.max(-1,Math.min(1,-r.top/Math.max(1,r.height)));hero.style.setProperty('--hero-scroll24',p.toFixed(3));queued=false};addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});update()}
})();

// V46: Worlds carousel navigation (native swipe and keyboard scrolling remain available)
(()=>{const rail=document.getElementById('worldsCarousel');if(!rail)return;
document.querySelectorAll('[data-worlds-step]').forEach(btn=>btn.addEventListener('click',()=>{
const card=rail.querySelector('article');const step=(card?.getBoundingClientRect().width||300)+18;
rail.scrollBy({left:Number(btn.dataset.worldsStep)*step*2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}));})();

// V48: browser history and bfcache must never preserve the transfer overlay.
window.addEventListener('pageshow',()=>document.querySelectorAll('.page-wipe').forEach(el=>el.classList.remove('active')));

// V49: mouse drag works on images and text; touch keeps native swipe.
(()=>{
 const rail=document.getElementById('worldsCarousel');if(!rail)return;
 let pointer=null, originX=0, originScroll=0, hasMoved=false, suppressClick=false;
 rail.querySelectorAll('img').forEach(img=>img.addEventListener('dragstart',e=>e.preventDefault()));
 rail.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('button,a,input,textarea'))return;
  pointer=e.pointerId;originX=e.clientX;originScroll=rail.scrollLeft;hasMoved=false;
  rail.classList.add('is-grabbing');rail.setPointerCapture(e.pointerId);
 });
 rail.addEventListener('pointermove',e=>{
  if(e.pointerId!==pointer)return;
  const delta=e.clientX-originX;
  if(Math.abs(delta)>4)hasMoved=true;
  if(hasMoved){rail.scrollLeft=originScroll-delta;e.preventDefault()}
 });
 function finish(e){if(pointer===null||e.pointerId!==pointer)return;
  if(hasMoved){suppressClick=true;setTimeout(()=>{suppressClick=false},150)}
  pointer=null;rail.classList.remove('is-grabbing');
  if(rail.hasPointerCapture(e.pointerId))rail.releasePointerCapture(e.pointerId);
 }
 rail.addEventListener('pointerup',finish);rail.addEventListener('pointercancel',finish);
 rail.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation()}},true);
})();;


// V53 mobile legend quick-select: preview is distinct from the saved activation.
(function(){
 const root=document.getElementById('legendMobileLoadouts');
 if(!root || typeof legends==='undefined' || typeof render!=='function')return;
 const refresh=()=>{root.innerHTML=legends.map((item,i)=>`<button type="button" data-mobile-legend="${i}" class="${i===active?'is-preview':''} ${i===activatedLegend?'is-activated':''}" aria-pressed="${i===active}">${String(i+1).padStart(2,'0')} // ${item.n.replace('THE ','')}</button>`).join('');};
 root.addEventListener('click',e=>{const btn=e.target.closest('[data-mobile-legend]');if(!btn)return;active=Number(btn.dataset.mobileLegend);render();refresh();});
 document.getElementById('prev')?.addEventListener('click',()=>requestAnimationFrame(refresh));
 document.getElementById('next')?.addEventListener('click',()=>requestAnimationFrame(refresh));
 document.getElementById('activateLegendButton')?.addEventListener('click',()=>requestAnimationFrame(refresh));
 refresh();
})();
