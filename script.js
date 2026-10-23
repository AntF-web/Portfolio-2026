const defaultData = window.SITE_DATA || {};
let siteData = defaultData;

// Browser-only editor previews are opt-in. Normal public visits must always
// use the published site-data.js, even if this browser has an old saved preview.
const previewMode = new URLSearchParams(window.location.search).get('preview') === '1';

// Public pages should never keep editor preview data around. This second guard
// is intentional: Firefox can retain localStorage even when asset cache changes.
if (!previewMode) {
  try { localStorage.removeItem('antPortfolioPreviewData'); } catch (e) {}
}
if (previewMode) {
  try {
    const local = localStorage.getItem('antPortfolioPreviewData');
    if (local) siteData = JSON.parse(local);
  } catch (e) {}
}

const copy = {
  en:{navWork:'WORK',navBio:'BIO',navContact:'CONTACT',workTitle:'SELECTED WORK',cv1:'Musician / DJ',cv2:'Web designer',cv3:'Social & cultural work',cv4:'Editing / script studies',skills:'TOOLS / SKILLS',langs:'LANGUAGES',contactTitle:"LET'S WORK TOGETHER",cvPdf:'DOWNLOAD CV ↗',backWork:'PORTFOLIO',videoWord:'VIDEOS',featuredVideo:'VJ EXAMPLES',moreVideo:'MORE VIDEO',moreVideoText:'More edits, music videos and audiovisual experiments can be added here as the portfolio grows.',youtubeVisit:'VISIT YOUTUBE',backPortfolio:'← BACK TO PORTFOLIO',timelineWord:'TIMELINES',featuredMaps:'INTERACTIVE PROJECTS',webProjects:'WEB PROJECTS',mapOpen:'OPEN PROJECT ↗',mapNoLink:'PROJECT LINK TO ADD'},
  fr:{navWork:'PROJETS',navBio:'BIO',navContact:'CONTACT',workTitle:'PROJETS CHOISIS',cv1:'Musicien / DJ',cv2:'Web designer',cv3:'Travail social & culturel',cv4:'Études montage / script',skills:'OUTILS / COMPÉTENCES',langs:'LANGUES',contactTitle:'TRAVAILLONS ENSEMBLE',cvPdf:'TÉLÉCHARGER LE CV ↗',backWork:'PORTFOLIO',videoWord:'VIDÉOS',featuredVideo:'EXEMPLES VJ',moreVideo:'PLUS DE VIDÉOS',moreVideoText:'D’autres montages, clips et expérimentations audiovisuelles peuvent être ajoutés ici au fil du portfolio.',youtubeVisit:'VOIR YOUTUBE',backPortfolio:'← RETOUR AU PORTFOLIO',timelineWord:'TIMELINES',featuredMaps:'PROJETS INTERACTIFS',webProjects:'PROJETS WEB',mapOpen:'OUVRIR LE PROJET ↗',mapNoLink:'LIEN DU PROJET À AJOUTER'}
};

let lang = 'en';
let activeFilter = 'all';
const byId = id => document.getElementById(id);
const setText = (el, text) => { if (el && text != null) el.textContent = text; };
const escapeHtml = (str='') => String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const safeHref = (url='') => /^\s*javascript:/i.test(url) ? '#' : (url || '#');
const isExternal = (url='') => /^(https?:)?\/\//i.test(url);

function ensureMapsFeature(){
  siteData.projects ||= [];
  if(!siteData.projects.some(p=>p.id==='maps-timelines')){
    const card={
      id:'maps-timelines',category:'web',tag:'WEB / MAPS',title:'Maps / Timelines',
      description:{en:'Interactive maps, timelines & data stories',fr:'Cartes interactives, timelines & récits de données'},
      tools:'WEB · MAPS · DATA · TIMELINES',link:'maps.html',mediaType:'maps',media:'',poster:''
    };
    const musicStoryIndex=siteData.projects.findIndex(p=>p.id==='musicstory');
    siteData.projects.splice(musicStoryIndex>=0?musicStoryIndex+1:siteData.projects.length,0,card);
  }
  if(!siteData.maps){
    siteData.maps={
      intro:{
        en:'Interactive maps, historical timelines and data-driven web experiments exploring music, politics, colonial history and environmental change.',
        fr:'Cartes interactives, timelines historiques et expérimentations web basées sur les données autour de la musique, de la politique, de l’histoire coloniale et des transformations environnementales.'
      },
      examples:[
        {title:'Popular Music Flow Map',kind:'MAP + TIMELINE',link:'https://github.com/AntF-web/music-flow-map',image:'',text:{en:'Interactive map tracing musical influences, circulation and appropriation flows across time.',fr:'Carte interactive retraçant les influences musicales, les circulations et les flux d’appropriation au fil du temps.'}},
        {title:'Hip-Hop History Timeline',kind:'TIMELINE',link:'',image:'',text:{en:'Chronological history of hip-hop through key moments, places, images and audio examples.',fr:'Histoire chronologique du hip-hop à travers des moments clés, des lieux, des images et des exemples audio.'}},
        {title:'Left-Wing Football Clubs',kind:'MAP',link:'https://github.com/AntF-web/left_wing_football_clubs',image:'',text:{en:'Interactive world map of left-wing, supporter-owned and politically engaged football clubs.',fr:'Carte mondiale interactive des clubs de football de gauche, détenus par leurs supporters ou politiquement engagés.'}},
        {title:'Colonialism History',kind:'MAP + TIMELINE',link:'https://github.com/AntF-web/colonialism-map',image:'',text:{en:'Interactive map and timeline exploring colonial powers, territories and historical expansion.',fr:'Carte et timeline interactives explorant les puissances coloniales, les territoires et l’expansion historique.'}},
        {title:'Global Deforestation',kind:'MAP + TIMELINE',link:'https://github.com/AntF-web/global-deforestation-map',image:'',text:{en:'Historical geography of global deforestation from the early 20th century to the present.',fr:'Géographie historique de la déforestation mondiale du début du XXe siècle à aujourd’hui.'}},
        {title:'Capitalism Timeline',kind:'TIMELINE',link:'',image:'',text:{en:'Interactive chronology of key events and systems that contributed to the development of capitalism.',fr:'Chronologie interactive des événements et systèmes ayant contribué au développement du capitalisme.'}},
        {title:'Football History Timeline',kind:'TIMELINE',link:'',image:'',text:{en:'Interactive chronological presentation of major moments in football history.',fr:'Présentation chronologique interactive des grands moments de l’histoire du football.'}}
      ]
    };
  }
  siteData.maps.intro ||= {en:'Interactive maps and timelines.',fr:'Cartes et timelines interactives.'};
  siteData.maps.examples ||= [];
}
ensureMapsFeature();

function projectVisual(p){
  const tag=`<span class="project-tag">${escapeHtml(p.tag||String(p.category||'').toUpperCase())}</span><span class="project-arrow">↗</span>`;
  if(p.mediaType==='maps'){
    return `<div class="project-visual project-maps"><div class="maps-card-visual" aria-hidden="true"><span class="map-dot d1"></span><span class="map-dot d2"></span><span class="map-dot d3"></span><span class="map-route r1"></span><span class="map-route r2"></span><span class="map-time-axis"></span><strong>MAPS /<br>TIMELINES</strong></div>${tag}</div>`;
  }
  if(p.mediaType==='custom'){
    return `<div class="project-visual project-musicstory"><div class="musicstory-card" aria-hidden="true"><span class="musicstory-rec">● REC</span><span class="musicstory-volume">RED ANT / PERSONAL ARCHIVE / VOL. 01</span><strong>MUSIC<br>MADE<br>MY LIFE</strong><span class="musicstory-genres">REGGAE · FUNK · HIP-HOP · RAVE · JUNGLE · UK GARAGE</span></div>${tag}</div>`;
  }
  if(p.mediaType==='video' && p.media){
    return `<div class="project-visual project-video"><video autoplay muted loop playsinline preload="metadata" ${p.poster?`poster="${escapeHtml(p.poster)}"`:''} aria-hidden="true"><source src="${escapeHtml(p.media)}"></video>${tag}</div>`;
  }
  if(p.media){
    return `<div class="project-visual project-photo"><img src="${escapeHtml(p.media)}" alt="${escapeHtml(p.title||'Project')}" loading="lazy">${tag}</div>`;
  }
  return `<div class="project-visual"><div class="project-placeholder"><small>${escapeHtml(String(p.category||'project').toUpperCase())}</small><strong>${escapeHtml(p.title||'Untitled')}</strong></div>${tag}</div>`;
}

function renderProjects(){
  const grid=byId('projectGrid');
  if(!grid) return;
  grid.innerHTML=(siteData.projects||[]).map(p=>{
    const href=safeHref(p.link);
    const external=isExternal(href);
    const hidden=activeFilter!=='all' && p.category!==activeFilter;
    return `<a class="project${hidden?' hidden':''}" data-project-id="${escapeHtml(p.id||'')}" data-category="${escapeHtml(p.category||'')}" href="${escapeHtml(href)}" ${external?'target="_blank" rel="noreferrer"':''} aria-label="${escapeHtml(p.title||'Project')} — open project">${projectVisual(p)}<div class="project-meta"><div><h3>${escapeHtml(p.title||'Untitled')}</h3><p class="project-desc">${escapeHtml(p.description?.[lang]||p.description?.en||'')}</p></div><p class="project-tools">${escapeHtml(p.tools||'')}</p></div></a>`;
  }).join('');
}

function renderVideoGallery(){
  const gallery=byId('videoGallery');
  if(!gallery) return;
  gallery.innerHTML=(siteData.videos?.examples||[]).map((item,i)=>`<article class="video-example" data-video-index="${i}"><div class="video-frame"><video muted loop playsinline controls preload="metadata" ${item.poster?`poster="${escapeHtml(item.poster)}"`:''}>${item.src?`<source src="${escapeHtml(item.src)}">`:''}Your browser does not support HTML5 video.</video></div><div class="video-caption"><div><h3>${escapeHtml(item.title||'Video')}</h3><p>${escapeHtml(item.text?.[lang]||item.text?.en||'')}</p></div><span>VJ · LIVE VISUALS</span></div></article>`).join('');
}

function renderMapsGallery(){
  const gallery=byId('mapsGallery');
  if(!gallery) return;
  const items=siteData.maps?.examples||[];
  gallery.innerHTML=items.map((item,i)=>{
    const href=safeHref(item.link||'');
    const canOpen=!!item.link && href!=='#';
    const external=isExternal(href);
    const visual=item.image
      ? `<div class="map-frame"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title||'Map project')}" loading="lazy"></div>`
      : `<div class="map-frame map-auto-visual" aria-hidden="true"><span class="map-grid-dot a"></span><span class="map-grid-dot b"></span><span class="map-grid-dot c"></span><span class="map-grid-line one"></span><span class="map-grid-line two"></span><strong>${escapeHtml(item.kind||'MAP / TIMELINE')}</strong></div>`;
    const body=`${visual}<div class="map-caption"><div><h3>${escapeHtml(item.title||'Untitled map')}</h3><p>${escapeHtml(item.text?.[lang]||item.text?.en||'')}</p></div><div class="map-meta"><span>${escapeHtml(item.kind||'MAP / TIMELINE')}</span><b>${copy[lang][canOpen?'mapOpen':'mapNoLink']}</b></div></div>`;
    return canOpen
      ? `<a class="map-example" data-map-index="${i}" href="${escapeHtml(href)}" ${external?'target="_blank" rel="noreferrer"':''}>${body}</a>`
      : `<article class="map-example map-disabled" data-map-index="${i}">${body}</article>`;
  }).join('');
}

function applyDynamicContent() {
  const g = siteData.general || {};
  setText(byId('heroKicker'), g.heroKicker);
  setText(byId('heroLine1'), g.hero1?.[lang]);
  setText(byId('heroLine2'), g.hero2?.[lang]);
  setText(byId('heroText'), g.heroText?.[lang]);
  setText(byId('bio1'), g.bio1?.[lang]);
  setText(byId('bio2'), g.bio2?.[lang]);
  setText(byId('contactText'), g.contactText?.[lang]);
  setText(byId('footerLocation'), g.footerLocation);
  setText(byId('languagesList'), g.languages);
  if (byId('emailLink') && g.email) byId('emailLink').href = `mailto:${g.email}`;
  if (byId('currentSiteLink') && g.currentSite) byId('currentSiteLink').href = g.currentSite;
  if (byId('videoYoutubeTop') && g.youtube) byId('videoYoutubeTop').href = g.youtube;
  if (byId('videoYoutubeBottom') && g.youtube) byId('videoYoutubeBottom').href = g.youtube;
  if (byId('skillsList') && Array.isArray(g.skills)) byId('skillsList').innerHTML = g.skills.map(x => `<span>${escapeHtml(x)}</span>`).join('');

  renderProjects();

  (siteData.cv || []).forEach((item, i) => {
    const row = document.querySelector(`[data-cv-index="${i}"]`);
    if (!row) return;
    setText(row.querySelector('.year'), item.year);
    setText(row.querySelector('h3'), item.title?.[lang] || item.title?.en);
    const detail = typeof item.detail === 'string' ? item.detail : (item.detail?.[lang] || item.detail?.en || '');
    setText(row.querySelector('p'), detail);
  });

  setText(byId('videoIntro'), siteData.videos?.intro?.[lang]);
  renderVideoGallery();
  setText(byId('mapsIntro'), siteData.maps?.intro?.[lang] || siteData.maps?.intro?.en || '');
  renderMapsGallery();
}

function applyFilter(filter){
  activeFilter=filter;
  document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
  document.querySelectorAll('.project').forEach(p=>p.classList.toggle('hidden', filter!=='all' && p.dataset.category!==filter));
}

document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

function translatePage() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (copy[lang]?.[k]) el.textContent = copy[lang][k];
  });
  applyDynamicContent();
}

const toggle = byId('langToggle');
if (toggle) toggle.addEventListener('click', () => {
  lang = lang === 'en' ? 'fr' : 'en';
  toggle.textContent = lang === 'en' ? 'FR' : 'EN';
  translatePage();
});

translatePage();
