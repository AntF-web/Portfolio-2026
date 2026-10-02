const defaultData = window.SITE_DATA || {};
let siteData = defaultData;
try {
  const local = localStorage.getItem('antPortfolioPreviewData');
  if (local) siteData = JSON.parse(local);
} catch (e) {}

const copy = {
  en:{navWork:'WORK',navBio:'BIO',navContact:'CONTACT',workTitle:'SELECTED WORK',cv1:'Musician / DJ',cv2:'Web designer',cv3:'Social & cultural work',cv4:'Editing / script studies',skills:'TOOLS / SKILLS',langs:'LANGUAGES',contactTitle:"LET'S WORK TOGETHER",cvPdf:'DOWNLOAD CV ↗',backWork:'PORTFOLIO',videoWord:'VIDEOS',featuredVideo:'VJ EXAMPLES',moreVideo:'MORE VIDEO',moreVideoText:'More edits, music videos and audiovisual experiments can be added here as the portfolio grows.',youtubeVisit:'VISIT YOUTUBE',backPortfolio:'← BACK TO PORTFOLIO'},
  fr:{navWork:'PROJETS',navBio:'BIO',navContact:'CONTACT',workTitle:'PROJETS CHOISIS',cv1:'Musicien / DJ',cv2:'Web designer',cv3:'Travail social & culturel',cv4:'Études montage / script',skills:'OUTILS / COMPÉTENCES',langs:'LANGUES',contactTitle:'TRAVAILLONS ENSEMBLE',cvPdf:'TÉLÉCHARGER LE CV ↗',backWork:'PORTFOLIO',videoWord:'VIDÉOS',featuredVideo:'EXEMPLES VJ',moreVideo:'PLUS DE VIDÉOS',moreVideoText:'D’autres montages, clips et expérimentations audiovisuelles peuvent être ajoutés ici au fil du portfolio.',youtubeVisit:'VOIR YOUTUBE',backPortfolio:'← RETOUR AU PORTFOLIO'}
};

let lang = 'en';
let activeFilter = 'all';
const byId = id => document.getElementById(id);
const setText = (el, text) => { if (el && text != null) el.textContent = text; };
const escapeHtml = (str='') => String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const safeHref = (url='') => /^\s*javascript:/i.test(url) ? '#' : (url || '#');
const isExternal = (url='') => /^(https?:)?\/\//i.test(url);

function projectVisual(p){
  const tag=`<span class="project-tag">${escapeHtml(p.tag||String(p.category||'').toUpperCase())}</span><span class="project-arrow">↗</span>`;
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
