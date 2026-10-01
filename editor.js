const clone = obj => JSON.parse(JSON.stringify(obj));
let data = clone(window.SITE_DATA || {});
try { const saved = localStorage.getItem('antPortfolioPreviewData'); if (saved) data = JSON.parse(saved); } catch(e) {}

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const field = (label,path,value,type='text',full=false,help='') => `<div class="field ${full?'full':''}"><label>${esc(label)}</label>${type==='textarea'?`<textarea data-path="${esc(path)}">${esc(value)}</textarea>`:`<input type="${type}" data-path="${esc(path)}" value="${esc(value)}">`}${help?`<div class="help inline">${esc(help)}</div>`:''}</div>`;

function renderGeneral(){
  const g=data.general;
  $('#generalFields').innerHTML = [
    field('Hero kicker','general.heroKicker',g.heroKicker),
    field('Email','general.email',g.email,'email'),
    field('Hero line 1 — EN','general.hero1.en',g.hero1.en), field('Hero line 1 — FR','general.hero1.fr',g.hero1.fr),
    field('Hero line 2 — EN','general.hero2.en',g.hero2.en), field('Hero line 2 — FR','general.hero2.fr',g.hero2.fr),
    field('Hero text — EN','general.heroText.en',g.heroText.en,'textarea'), field('Hero text — FR','general.heroText.fr',g.heroText.fr,'textarea'),
    field('Bio paragraph 1 — EN','general.bio1.en',g.bio1.en,'textarea'), field('Bio paragraph 1 — FR','general.bio1.fr',g.bio1.fr,'textarea'),
    field('Bio paragraph 2 — EN','general.bio2.en',g.bio2.en,'textarea'), field('Bio paragraph 2 — FR','general.bio2.fr',g.bio2.fr,'textarea'),
    field('Contact text — EN','general.contactText.en',g.contactText.en,'textarea'), field('Contact text — FR','general.contactText.fr',g.contactText.fr,'textarea'),
    field('Current site URL','general.currentSite',g.currentSite,'url'), field('YouTube URL','general.youtube',g.youtube,'url'),
    field('Footer location','general.footerLocation',g.footerLocation), field('Languages','general.languages',g.languages),
    field('Skills — one per line','general.skills',(g.skills||[]).join('\n'),'textarea',true)
  ].join('');
}

function mediaOptions(p,i){
  return `<div class="field"><label>CARD VISUAL</label><select data-path="projects.${i}.mediaType">
    <option value="image" ${p.mediaType==='image'?'selected':''}>IMAGE / THUMBNAIL</option>
    <option value="video" ${p.mediaType==='video'?'selected':''}>LOOPING VIDEO</option>
    <option value="custom" ${p.mediaType==='custom'?'selected':''}>MUSIC STORY CUSTOM VISUAL</option>
  </select></div>`;
}

function renderProjects(){
  const projects=data.projects||[];
  if(!projects.length){ $('#projectsFields').innerHTML='<div class="empty-state">No projects yet. Add MUSIC, WEB or VIDEO above.</div>'; return; }
  $('#projectsFields').innerHTML=projects.map((p,i)=>`<div class="edit-card" data-editor-project="${i}">
    <div class="edit-card-head">
      <span>${esc(p.title || 'UNTITLED PROJECT')}</span>
      <div class="card-actions">
        <span class="badge">${esc((p.category||'project').toUpperCase())}</span>
        <button class="mini-btn" type="button" data-project-action="up" data-index="${i}" aria-label="Move project up">↑</button>
        <button class="mini-btn" type="button" data-project-action="down" data-index="${i}" aria-label="Move project down">↓</button>
        <button class="mini-btn remove" type="button" data-project-action="remove" data-index="${i}">REMOVE</button>
      </div>
    </div>
    <div class="edit-card-body form-grid">
      ${field('Title',`projects.${i}.title`,p.title)}
      <div class="field"><label>CATEGORY / FILTER</label><select data-path="projects.${i}.category"><option value="music" ${p.category==='music'?'selected':''}>MUSIC</option><option value="web" ${p.category==='web'?'selected':''}>WEB</option><option value="video" ${p.category==='video'?'selected':''}>VIDEO</option></select></div>
      ${field('Description — EN',`projects.${i}.description.en`,p.description?.en||'','textarea')}${field('Description — FR',`projects.${i}.description.fr`,p.description?.fr||'','textarea')}
      ${field('Tools / tags',`projects.${i}.tools`,p.tools||'')}${field('Small visual label',`projects.${i}.tag`,p.tag||'')}
      ${field('Project / external link',`projects.${i}.link`,p.link||'','url',true,'Can be a website, YouTube, music page, or an internal page such as videos.html.')}
      ${mediaOptions(p,i)}
      ${field('Thumbnail / direct video URL (optional)',`projects.${i}.media`,p.media||'','url',false,'Leave empty for an automatic text-based card visual.')}
      ${p.mediaType==='video'?field('Video poster image URL (optional)',`projects.${i}.poster`,p.poster||'','url',true):''}
    </div>
  </div>`).join('');
}

function renderCv(){
  $('#cvFields').innerHTML=(data.cv||[]).map((c,i)=>`<div class="edit-card"><div class="edit-card-head"><span>${esc(c.year)}</span><span class="badge">CV ${i+1}</span></div><div class="edit-card-body form-grid">
  ${field('Years',`cv.${i}.year`,c.year)}${field('Detail',`cv.${i}.detail`,c.detail)}${field('Title — EN',`cv.${i}.title.en`,c.title.en)}${field('Title — FR',`cv.${i}.title.fr`,c.title.fr)}
  </div></div>`).join('');
}

function renderVideos(){
  const intro=data.videos?.intro || {en:'',fr:''};
  $('#videoIntroFields').innerHTML=field('VJ page intro — EN','videos.intro.en',intro.en,'textarea')+field('VJ page intro — FR','videos.intro.fr',intro.fr,'textarea');
  const examples=data.videos?.examples||[];
  if(!examples.length){ $('#videoFields').innerHTML='<div class="empty-state">No VJ examples yet. Add one above.</div>'; return; }
  $('#videoFields').innerHTML=examples.map((v,i)=>`<div class="edit-card"><div class="edit-card-head"><span>${esc(v.title||'UNTITLED VIDEO')}</span><div class="card-actions"><span class="badge">VIDEO ${i+1}</span><button class="mini-btn" type="button" data-video-action="up" data-index="${i}">↑</button><button class="mini-btn" type="button" data-video-action="down" data-index="${i}">↓</button><button class="mini-btn remove" type="button" data-video-action="remove" data-index="${i}">REMOVE</button></div></div><div class="edit-card-body form-grid">
  ${field('Title',`videos.examples.${i}.title`,v.title||'')}${field('Video URL',`videos.examples.${i}.src`,v.src||'','url',false,'Direct MP4/WebM URL recommended.')}${field('Description — EN',`videos.examples.${i}.text.en`,v.text?.en||'','textarea')}${field('Description — FR',`videos.examples.${i}.text.fr`,v.text?.fr||'','textarea')}${field('Poster image URL (optional)',`videos.examples.${i}.poster`,v.poster||'','url',true)}
  </div></div>`).join('');
}

function setByPath(obj,path,value){
  const parts=path.split('.'); let cur=obj;
  for(let i=0;i<parts.length-1;i++) cur=cur[parts[i]];
  const key=parts[parts.length-1];
  if(path==='general.skills') cur[key]=value.split(/\n|,/).map(x=>x.trim()).filter(Boolean); else cur[key]=value;
}

function uniqueId(category){
  const base=`${category}-${Date.now().toString(36)}`;
  let id=base,n=2;
  while((data.projects||[]).some(p=>p.id===id)) id=`${base}-${n++}`;
  return id;
}

function addProject(category){
  data.projects ||= [];
  const n=data.projects.filter(p=>p.category===category).length+1;
  const label=category.toUpperCase();
  data.projects.push({
    id:uniqueId(category), category, tag:`${label} / ${String(n).padStart(2,'0')}`, title:`New ${label.toLowerCase()} project`,
    description:{en:'Add a short description.',fr:'Ajoutez une courte description.'},
    tools:label, link:'', mediaType:'image', media:'', poster:''
  });
  renderProjects();
  const cards=document.querySelectorAll('[data-editor-project]');
  cards[cards.length-1]?.scrollIntoView({behavior:'smooth',block:'center'});
  flash(`${label} project added`);
}

function moveItem(arr,index,delta){
  const target=index+delta;
  if(index<0||target<0||target>=arr.length) return;
  [arr[index],arr[target]]=[arr[target],arr[index]];
}

function handleProjectAction(action,index){
  const arr=data.projects||[];
  if(action==='remove') arr.splice(index,1);
  if(action==='up') moveItem(arr,index,-1);
  if(action==='down') moveItem(arr,index,1);
  renderProjects();
}

function handleVideoAction(action,index){
  const arr=data.videos?.examples||[];
  if(action==='remove') arr.splice(index,1);
  if(action==='up') moveItem(arr,index,-1);
  if(action==='down') moveItem(arr,index,1);
  renderVideos();
}

document.addEventListener('input',e=>{const path=e.target.dataset.path;if(path)setByPath(data,path,e.target.value)});
document.addEventListener('change',e=>{const path=e.target.dataset.path;if(path){setByPath(data,path,e.target.value);if(path.endsWith('.mediaType')) renderProjects();}});
document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add-project]'); if(add){addProject(add.dataset.addProject);return;}
  const pa=e.target.closest('[data-project-action]'); if(pa){handleProjectAction(pa.dataset.projectAction,Number(pa.dataset.index));return;}
  const va=e.target.closest('[data-video-action]'); if(va){handleVideoAction(va.dataset.videoAction,Number(va.dataset.index));return;}
});

$('#addVjVideo').addEventListener('click',()=>{
  data.videos ||= {intro:{en:'',fr:''},examples:[]}; data.videos.examples ||= [];
  data.videos.examples.push({title:'New VJ video',src:'',poster:'',text:{en:'Add a short description.',fr:'Ajoutez une courte description.'}});
  renderVideos();
  flash('VJ video added');
});

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));btn.classList.add('active');document.getElementById(btn.dataset.tab).classList.add('active')}));

function flash(msg){const el=$('#status');el.textContent=msg;el.classList.add('show');clearTimeout(flash.t);flash.t=setTimeout(()=>el.classList.remove('show'),2200)}
$('#savePreview').addEventListener('click',()=>{localStorage.setItem('antPortfolioPreviewData',JSON.stringify(data));flash('Preview saved in this browser')});
$('#clearPreview').addEventListener('click',()=>{localStorage.removeItem('antPortfolioPreviewData');data=clone(window.SITE_DATA);renderAll();flash('Local preview reset')});
$('#exportData').addEventListener('click',()=>{const blob=new Blob([`window.SITE_DATA = ${JSON.stringify(data,null,2)};\n`],{type:'application/javascript'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='site-data.js';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);flash('site-data.js exported')});

function renderAll(){renderGeneral();renderProjects();renderCv();renderVideos()}
renderAll();
