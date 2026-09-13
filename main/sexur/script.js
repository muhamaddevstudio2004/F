/* ══ لۆککردنی ئاپ — ڕێگری لە زوم و سەلێکشن ══ */
(function(){
  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('gesturechange', e => e.preventDefault());
  document.addEventListener('gestureend', e => e.preventDefault());

  document.addEventListener('touchmove', e => {
    if(e.touches.length > 1) e.preventDefault();
  }, { passive:false });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', e => {
    const now = Date.now();
    if(now - lastTouchEnd <= 350) e.preventDefault();
    lastTouchEnd = now;
  }, { passive:false });

  document.addEventListener('wheel', e => {
    if(e.ctrlKey) e.preventDefault();
  }, { passive:false });

  document.addEventListener('keydown', e => {
    if((e.ctrlKey || e.metaKey) && ['+','-','=','0'].includes(e.key)) e.preventDefault();
  });
})();

/* ══ PWA INSTALL MODAL ══ */
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

function openInstallModal(){
  document.getElementById('installOverlay').classList.add('active');
}
function closeInstallModal(){
  document.getElementById('installOverlay').classList.remove('active');
  sessionStorage.setItem('sexur_install_shown', '1');
}

async function triggerAndroidInstall(){
  if(!deferredInstallPrompt){
    showModal({title:"دواتر هەوڵبدەرەوە", msg:"دابەزاندنی ڕاستەوخۆ ئێستا بەردەست نییە لەسەر ئەم وێبگەڕە. تکایە لە Chrome کردەوە بکەرەوە.", icon:"warn"});
    return;
  }
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  if(outcome === 'accepted'){
    vib('success');
    closeInstallModal();
  }
  deferredInstallPrompt = null;
}

function maybeShowInstallModal(){
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if(isStandalone) return;
  if(sessionStorage.getItem('sexur_install_shown')) return;
  setTimeout(()=>{
    openInstallModal();
  }, 1500);
}
window.addEventListener('load', maybeShowInstallModal);

/* ── VIBRATION ── */
function vib(type='light'){
  if(!('vibrate' in navigator))return;
  const patterns={light:[8],medium:[15],heavy:[30],double:[10,60,10],success:[10,40,20],error:[20,60,20,60,20]};
  navigator.vibrate(patterns[type]||patterns.light);
}
const avatars=[
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zara",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Titan",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Blaze",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Nova",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Cleo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Orion",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Axel",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Sage",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Flynn",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Ember",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Dusk",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=River",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Cedar",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Wren"
];
function avatarUrl(seed){
  if(!seed) return avatars[0];
  if(seed.startsWith('data:') || seed.startsWith('http')) return seed;
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
}
const nameSuggestions=[
  "ئەحمەد","موحەمەد","عەلی","سارا","ئایا","ئەمین","ڕێناس","شیلان","ئەرمان","ڕووناک",
  "باخان","ژیار","هەژار","دیلان","جیهاد","نازدار","سەعید","بینا","زیکە","لانە","کاروان",
  "هاوژین","ئارام","سروە","ڕاپەرین","گوڵالە","ئاکۆ","ئاسۆ","زەنون","عەبۆ","نالین","رویا","پشتیوان"
];
const words={
  کەسایەتی:["فەرهاد پیرباڵ","شێرکۆ بێکەس","ئومێد خۆشناو","شێخ لایلۆن","هەڵکەوت زاهیر","فاخیر هەریری","کەیفی","خدر بێگڵاسی","رەجەب","شرێک","موراد حەلەمدار","ترەمپ"],
  وڵات:["عیراق","فەرەنسا","ئەرجەنتین","دوبەی","کوردستان","تورکیا","سوریا","ئێران","ئەمریکا","صین"],
  خواردن:["سەروپێ","کفتە","تەشریب","برنج","پیزا","دۆڵمە","چایە","بریانی","مەقلوبە","شفتە","مریشک"],
  یاری:["رۆبلۆکس","PUBG","ئەتاری پلەی دوو","تۆپانێ","درایڤەر","کۆنکان","یاری سیخور","ماینکرافت","لاپتۆپ","XBOX"],
  وەرزش:["تۆپی پێ","تایرە","تێنس","مەلەوانی","کاراتی","شەبەکە","ڕاکردن","پاسکیل","هۆڵی لەشجوانی","بۆکسێن"],
  گیانەوەر:["شێر","فیل","پەنگوین","دۆلفین","باز","پڵینگ","زەرافە","شرێک","مەیمون","سەگ"],
  ئیش:["دکتۆر","مامۆستا","بێ ئیش","فرۆکەوان","شێف","پارێزەر","موهەندیس","پەرستار","سایەق بالیف","مدیر"],
هەست:["ماندوو","میهرەبان","دڵخۆش","گریان","پێکەنین","تووڕە","ترساو","ئاسوودە","تەنها","شەرمەزار","خەمبار","ئاشق","بێزار","نیگەران","ئارام"],
  شوێن:["بازار","مارکێت","قەڵای هەولێر","مەلەوانگە","سلێمانی","هەولێر خەبات","دارەتوو","هەورامان","بارزان","خەلیفان"],
  رەنگ:["مۆر "," سەوز"," سور"," زەرد","پرتەقالی ","شین"]
};
function initDefaultOnlineMode(){
  gameMode = 'online';
  document.querySelectorAll('.offline-only').forEach(el=>{
    el.classList.add('locked');
  });
  const mainBtn = document.getElementById('mainStartBtn');
  if(mainBtn){
    mainBtn.innerText = 'دەستپێکردنی یاری ئۆنڵاین';
    mainBtn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    mainBtn.style.color = '#fff';
    mainBtn.style.boxShadow = '0 6px 20px rgba(34,197,94,.35)';
  }
}
document.addEventListener('DOMContentLoaded', initDefaultOnlineMode);

let players=[],playerAvatarIndexes=[],selectedCategories=[],selectedCategory="";
let scoringEnabled=true;
function toggleScoring(on){
  scoringEnabled = on;
  vib();
  document.getElementById('scoringOn').classList.toggle('active', on);
  document.getElementById('scoringOff').classList.toggle('active', !on);
}
let currentIndex=0,spyIndexes=[],gameWord="",usedWords=[];
let spyBag=[],starterBag=[];
let holdTimer,timerInterval,currentTime=0,timerStarted=false,isPaused=false,cardWasOpened=false;
let suggBlurTimer=null;
let customWords = [];
/* ══════════════════════════════════════
  AD BANNER SYSTEM
══════════════════════════════════════ */
const adSlides = [
 {
   img: "bsexur.webp",
   title: "  ",
   desc: "  ",
   link: "https://wa.me/9647509628683"
 },
 {
   img: "fsexur.webp",
   title: "  ",
   desc: "  ",
   link: "https://wa.me/9647509628683"
 },
 {
   img: "ads.webp",
   title: "  ",
   desc: "  ",
   link: "https://wa.me/9647509628683"
 }
];
let adCurrent = 0;
let adAutoTimer = null;
const AD_INTERVAL = 4500;
let adProgress = 0;
let adProgressTimer = null;
let adDragging = false;
let adStartX = 0;
let adIsAnimating = false;
function buildAdBanner() {
 const track = document.getElementById('adTrack');
 const dots = document.getElementById('adDots');
 track.innerHTML = '';
 dots.innerHTML = '';
 adSlides.forEach((ad, i) => {
   const a = document.createElement('a');
   a.className = 'ad-slide';
   a.href = ad.link || '#';
   a.target = '_blank';
   a.rel = 'noopener';
   a.style.cssText = `
     border-radius: calc(var(--radius-card) - 6px);
     overflow: hidden;
     transform: scale(1);
     transition: transform .2s ease, opacity .2s ease;
   `;
   if (ad.img) {
     a.style.background = '#111';
     a.innerHTML = `
       <img class="ad-slide-img" src="${ad.img}" alt="${ad.title}" loading="lazy"
         style="border-radius:calc(var(--radius-card) - 6px);">
       <div class="ad-slide-overlay" style="border-radius:calc(var(--radius-card) - 6px);">
         <div class="ad-slide-overlay-title">${ad.title}</div>
         <div class="ad-slide-overlay-desc">${ad.desc}</div>
       </div>`;
   } else {
     a.style.background = ad.bg || 'linear-gradient(135deg,#ffe066,#ffd84d)';
     a.innerHTML = `
       <div class="ad-slide-icon">
         ${ad.icon || ''}
         <div class="ad-slide-icon-title">${ad.title}</div>
         <div class="ad-slide-icon-desc">${ad.desc}</div>
       </div>`;
   }
   // کلیک ئەنیمەیشن
   a.addEventListener('pointerdown', () => {
     a.style.transform = 'scale(.97)';
     a.style.opacity = '.9';
   });
   a.addEventListener('pointerup', () => {
     a.style.transform = 'scale(1)';
     a.style.opacity = '1';
   });
   a.addEventListener('pointerleave', () => {
     a.style.transform = 'scale(1)';
     a.style.opacity = '1';
   });
   track.appendChild(a);
   // dot
   const dot = document.createElement('div');
   dot.className = 'ad-dot' + (i === 0 ? ' active' : '');
   dot.onclick = () => { vib(); adGoTo(i); };
   dots.appendChild(dot);
 });
 // touch/swipe — نەرم و ئازاد
 const banner = document.getElementById('adBanner');
 banner.addEventListener('touchstart', e => {
   adStartX = e.touches[0].clientX;
   adDragging = true;
   adStopAuto();
 }, { passive: true });
 banner.addEventListener('touchmove', e => {
   if (!adDragging) return;
   const dx = e.touches[0].clientX - adStartX;
   const track = document.getElementById('adTrack');
   const base = adCurrent * 100;
   track.style.transition = 'none';
   track.style.transform = `translateX(calc(${base}% + ${dx}px))`;
 }, { passive: true });
 banner.addEventListener('touchend', e => {
   if (!adDragging) return;
   adDragging = false;
   const dx = e.changedTouches[0].clientX - adStartX;
   const track = document.getElementById('adTrack');
   track.style.transition = 'transform .45s cubic-bezier(.4,0,.2,1)';
   if (Math.abs(dx) > 50) {
     dx > 0 ? adPrev() : adNext();
   } else {
     adUpdateUI();
   }
   adStartAuto();
 }, { passive: true });
 adUpdateUI();
 adStartAuto();
}
function adUpdateUI() {
 const track = document.getElementById('adTrack');
 track.style.transition = 'transform .45s cubic-bezier(.4,0,.2,1)';
 track.style.transform = `translateX(${adCurrent * 100}%)`;
 document.querySelectorAll('.ad-dot').forEach((d, i) => {
   d.classList.toggle('active', i === adCurrent);
 });
}
function adGoTo(idx) {
 if (adIsAnimating) return;
 adIsAnimating = true;
 adCurrent = (idx + adSlides.length) % adSlides.length;
 adUpdateUI();
 adResetProgress();
 setTimeout(() => adIsAnimating = false, 450);
}
function adNext() { adGoTo(adCurrent + 1); }
function adPrev() { adGoTo(adCurrent - 1); }
function adStartAuto() {
 adStopAuto();
 adResetProgress();
 adAutoTimer = setInterval(() => adNext(), AD_INTERVAL);
}
function adStopAuto() {
 clearInterval(adAutoTimer);
 clearInterval(adProgressTimer);
}
function adResetProgress() {
 clearInterval(adProgressTimer);
 adProgress = 100;
 const fill = document.getElementById('adProgressFill');
 if (!fill) return;
 fill.style.width = '100%';
 const step = 100 / (AD_INTERVAL / 100);
 adProgressTimer = setInterval(() => {
   adProgress = Math.max(0, adProgress - step);
   fill.style.width = adProgress + '%';
 }, 100);
}
buildAdBanner();
// Skeleton loader
function hideLoader(){
  const l=document.getElementById('loadingScreen');
  l.classList.add('hide');
  setTimeout(()=>l.remove(),500);
}
const _ldStart=Date.now();
window.addEventListener('load',()=>{
  const elapsed=Date.now()-_ldStart;
  setTimeout(hideLoader,Math.max(0,900-elapsed));
});
setTimeout(hideLoader,6000); // fallback

function toggleCustomWordPanel(){
  const panel = document.getElementById('customWordPanel');
  const cat = document.getElementById('customCat');
  const isHidden = panel.classList.contains('hidden');
  
  if(isHidden){
    panel.classList.remove('hidden');
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-10px)';
    setTimeout(()=>{
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0)';
    }, 10);
    setTimeout(()=> document.getElementById('customWordInput').focus(), 300);
  } else {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-10px)';
    setTimeout(()=>{
      panel.classList.add('hidden');
      panel.style.opacity = '';
      panel.style.transform = '';
      if(customWords.length === 0) cat.classList.remove('active');
    }, 280);
  }
}





/* ══════════════════════════════════════
   PORTAL SUGGESTION
══════════════════════════════════════ */
function getPortal(){return document.getElementById('suggPortal');}
function positionPortal(){
  const input=document.getElementById('playerInput');
  const rect=input.getBoundingClientRect();
  const portal=getPortal();
  portal.style.top=(rect.bottom+window.scrollY+6)+'px';
  portal.style.left=rect.left+'px';
  portal.style.width=rect.width+'px';
  const maxH=window.innerHeight-rect.bottom-16;
  portal.style.maxHeight=Math.min(230,maxH)+'px';
}

function onPlayerInput(){
 const input = document.getElementById("playerInput");
 const val = input.value;
 
 const cleaned = val.replace(/[^\u0600-\u06FF\u200c\s]/g, '');
 
 if(cleaned !== val){
   input.value = cleaned;
   vib('error');
   showKurdishToast();
   return;
 }
 
 input.classList.remove("input-error");
 document.getElementById("inputErrMsg").classList.remove("show");
 renderSuggestions(cleaned);
}

let _toastTimer = null;
let _toastVisible = false; // ← زیادکرا

function showKurdishToast() {
  if (_toastVisible) return; // ← ئەگەر نۆتیفی هەیە، دووبارە مەکەوە
  
  const old = document.getElementById('kurdishToast');
  if (old) old.remove();
  clearTimeout(_toastTimer);
  _toastVisible = true; // ← دەستپێکرد

  const toast = document.createElement('div');
  toast.id = 'kurdishToast';
  toast.innerHTML = `
    <div style="
      width:36px;height:36px;
      border-radius:12px;
      background:rgba(255,212,0,.15);
      display:flex;align-items:center;justify-content:center;
      flex-shrink:0;">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffd400">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    </div>
    <div>
      <div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:2px;">ناوەکە بەکوردی بنووسە</div>
      <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.45);">تەنها پیتی کوردی قبوڵ دەکرێت</div>
    </div>
  `;

  toast.style.cssText = `
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%) translateY(-120px) scale(.92);
    background: rgba(30,30,30,.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,212,0,.2);
    border-radius: 20px;
    padding: 12px 16px;
    z-index: 99999;
    box-shadow: 0 8px 32px rgba(0,0,0,.3);
    transition: transform .4s cubic-bezier(.34,1.3,.64,1), opacity .3s ease;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 240px;
    max-width: 320px;
    opacity: 0;
    font-family: 'Noto Sans Arabic', sans-serif;
    direction: rtl;
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0) scale(1)';
      toast.style.opacity = '1';
    });
  });

  _toastTimer = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(-120px) scale(.92)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
      _toastVisible = false; // ← تەواو بوو، ئێستا دووبارە دێتەوە
    }, 400);
  }, 2500);
}




function addCustomWord(){
  const input = document.getElementById('customWordInput');
  const val = input.value.trim();
  if(!val) return;
  if(customWords.includes(val)){
    showModal({title:"هەڵەیە", msg:"ئەم وشەیە هەیە.", icon:"err"});
    return;
  }
  customWords.push(val);
  input.value = '';
  renderCustomWordTags();
}

function removeCustomWord(word){
  customWords = customWords.filter(w => w !== word);
  renderCustomWordTags();
}

function renderCustomWordTags(){
  const box = document.getElementById('customWordTags');
  const cat = document.getElementById('customCat');
  box.innerHTML = '';
  customWords.forEach(w => {
    const tag = document.createElement('div');
    tag.style.cssText = 'display:inline-flex;align-items:center;gap:6px;background:#fff;border:2px solid #ffd400;border-radius:100px;padding:6px 14px;font-size:14px;font-weight:700;';
    tag.innerHTML = `${w} <button onclick="vib();removeCustomWord('${w}')" style="background:none;border:none;color:#ff4d4d;font-size:16px;font-weight:900;cursor:pointer;padding:0;line-height:1;">✕</button>`;
    box.appendChild(tag);
  });
  if(cat) cat.classList.toggle('active', customWords.length > 0);
}



function onPlayerFocus(){renderSuggestions(document.getElementById("playerInput").value.trim());}
function hideSuggestion(){
  suggBlurTimer=setTimeout(()=>{getPortal().classList.remove("open");},200);
}
function renderSuggestions(val){
  const portal=getPortal();
  const lower=val.toLowerCase();
  const filtered=nameSuggestions.filter(n=>!players.includes(n)&&(val===""||n.includes(val)||n.toLowerCase().includes(lower))).slice(0,5);
  if(filtered.length===0&&val===""){portal.classList.remove("open");return;}
  let html="";
  filtered.forEach((name,i)=>{
    const avIdx=i%avatars.length;
    html+=`<div class="sugg-item" onmousedown="event.preventDefault();vib();pickSuggestion('${name}')">
      <div class="sugg-av"><img src="${avatars[avIdx]}" loading="lazy"></div>${name}</div>`;
  });
  if(val&&!nameSuggestions.includes(val)&&!players.includes(val)){
    html+=`<div class="sugg-plus-hint" onmousedown="event.preventDefault();vib();addPlayerFromInput()">
      <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      زیادکردنی "${val}"</div>`;
  }
  portal.innerHTML=html;
  positionPortal();
  portal.classList.add("open");
}
function pickSuggestion(name){
  clearTimeout(suggBlurTimer);
  getPortal().classList.remove("open");
  document.getElementById("playerInput").value=name;
  addPlayer(name);
  document.getElementById("playerInput").value="";
  document.getElementById("playerInput").focus();
}
function addPlayerFromInput(){
  getPortal().classList.remove("open");
  addPlayer(document.getElementById("playerInput").value.trim());
  if(players.length>0){document.getElementById("playerInput").value="";}
  document.getElementById("playerInput").focus();
}
window.addEventListener('scroll',()=>{if(getPortal().classList.contains('open'))positionPortal();},{passive:true});
window.addEventListener('resize',()=>{if(getPortal().classList.contains('open'))positionPortal();},{passive:true});

/* ── Custom Modal ── */
let _modalResolve=null;
function showModal({title,msg,icon="warn",confirm=false,dangerConfirm=false}){
  return new Promise(res=>{
    _modalResolve=res;
    document.getElementById("modalTitle").innerText=title||"";
    document.getElementById("modalMsg").innerText=msg||"";
    const sheet=document.getElementById("modalSheet");
    const ico=document.getElementById("modalIcon");
    sheet.classList.remove("modal-danger");
    ico.style.background=icon==="warn"?"#fff3cd":icon==="err"?"#ffe0e0":icon==="danger"?"#ffe0e0":"#e8f5e9";
    if(icon==="danger"){
      sheet.classList.add("modal-danger");
      ico.innerHTML=`<svg viewBox="0 0 24 24"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/></svg>`;
      ico.querySelector("svg").style.fill="#d60000";
    } else {
      ico.innerHTML=icon==="warn"
        ?`<svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`
        :icon==="err"
        ?`<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`
        :`<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z"/></svg>`;
      ico.querySelector("svg").style.fill=icon==="warn"?"#e6a800":icon==="err"?"#d60000":"#2e7d32";
    }
    const btns=document.getElementById("modalBtns");
    if(confirm||dangerConfirm){
      btns.innerHTML=`
        <button class="modal-ok" style="background:#eee;color:#111;flex:1" onclick="vib();modalResolve(false)">نەخێر</button>
        <button class="modal-ok ${dangerConfirm?'modal-danger-confirm':''}" style="flex:1" onclick="vib();modalResolve(true)">بەڵێ</button>`;
    }else{
      btns.innerHTML=`<button class="modal-ok" onclick="vib();modalResolve(true)">باشە</button>`;
    }
    document.getElementById("modalOverlay").classList.add("active");
  });
}
function modalResolve(val){
  document.getElementById("modalOverlay").classList.remove("active");
  if(_modalResolve){_modalResolve(val);_modalResolve=null;}
}
function goBack(screenId){showScreen(screenId);}
async function confirmBack(screenId){
  const yes=await showModal({title:"گەرانەوە",msg:"دڵنیای کە دەگەڕێیتەوە؟ پێشکەوتنی یاریت لەدەست دەچێت.",icon:"warn",confirm:true});
  if(yes){
    clearInterval(timerInterval);
    timerStarted=false;isPaused=false;
    document.getElementById("pauseOverlay").classList.remove("active");
    showScreen(screenId);
    if(screenId==="screen3"){showPlayer();}
  }
}
async function confirmFinishRound(){
  const wasPaused=isPaused;
  if(!wasPaused){isPaused=true;}
  const yes=await showModal({title:"چوونە دادگا",msg:"دڵنیای؟ دەرۆیت بۆ دادگا.",icon:"danger",dangerConfirm:true});
  if(yes){isPaused=false;finishRound();}
  else{if(!wasPaused){isPaused=false;}}
}


/* ── Core add ── */
function addPlayer(value){
  if(!value){
    vib('error');
    const input=document.getElementById("playerInput");
    const errMsg=document.getElementById("inputErrMsg");
    input.classList.remove("input-shake","input-error");
    errMsg.classList.remove("show");
    void input.offsetWidth;
    input.classList.add("input-shake","input-error");
    errMsg.classList.add("show");
    input.focus();
    input.addEventListener("input",()=>{input.classList.remove("input-error");errMsg.classList.remove("show");},{once:true});
    return;
  }
  document.getElementById("playerInput").classList.remove("input-error");
  document.getElementById("inputErrMsg").classList.remove("show");
  if(players.includes(value)){vib('error');showModal({title:"هەڵە",msg:"ئەم ناوە پێشتر تۆمارکراوە، ناوێکی تر هەڵبژێرە.",icon:"err"});return;}
  if(players.length>=10){vib('error');showModal({title:"سنووری زیاتری",msg:"زیاتر لە ١٠ یاریزان ناکرێت تۆمار بکرێت.",icon:"warn"});return;}
  players.push(value);
  playerAvatarIndexes.push(getRandomAvatar());
  spyBag=[];starterBag=[];
  vib('success');
  renderPlayers();
  const btn=document.getElementById("addBtn");
  btn.style.transition="transform .1s ease";btn.style.transform="scale(0.85)";
  setTimeout(()=>{btn.style.transition="transform .4s cubic-bezier(.34,1.7,.64,1)";btn.style.transform="scale(1)";},100);
}

function openInfo(){document.getElementById("infoOverlay").classList.add("active");}
function closeInfo(){document.getElementById("infoOverlay").classList.remove("active");}
function closeInfoOutside(e){if(e.target===document.getElementById("infoOverlay")){vib();closeInfo();}}

function getRandomAvatar(){
  const used=new Set(playerAvatarIndexes);
  const available=avatars.map((_,i)=>i).filter(i=>!used.has(i));
  if(available.length===0)return Math.floor(Math.random()*avatars.length);
  return available[Math.floor(Math.random()*available.length)];
}
function removePlayer(index){vib('medium');players.splice(index,1);playerAvatarIndexes.splice(index,1);spyBag=[];starterBag=[];renderPlayers();}
function renderPlayers(){
  const box=document.getElementById("playersBox");
  const frag=document.createDocumentFragment();
  players.forEach((p,i)=>{
    const avatarUrl=getPlayerAvatarUrl(p, playerAvatarIndexes[i]);
    const div=document.createElement("div");
    div.className="player-item";
    div.innerHTML=`<div class="avatar"><img src="${avatarUrl}" loading="lazy" width="52" height="52"></div>
      <div class="player-name">${p}</div>
      <button class="remove-player" onclick="removePlayer(${i})">&#x2715;</button>`;
    frag.appendChild(div);
  });
  box.innerHTML="";
  box.appendChild(frag);
}

function goCategory(){
  if(players.length<3){
    vib('error');
    const err=document.getElementById("minpErr");
    err.classList.remove("show");void err.offsetWidth;err.classList.add("show");
    const card=document.querySelector("#screen1 .input-card");
    card.style.animation="none";void card.offsetWidth;card.style.animation="shake .35s ease";
    setTimeout(()=>err.classList.remove("show"),3000);return;
  }
  document.getElementById('bottomNav').classList.add('hidden');
  document.getElementById("minpErr").classList.remove("show");
  showScreen("screen2");
}

function selectCategory(el,cat){
  el.classList.toggle("active");
  vib(el.classList.contains("active")?'medium':'light');
  if(selectedCategories.includes(cat)){selectedCategories=selectedCategories.filter(c=>c!==cat);}
  else{selectedCategories.push(cat);}
}
function prepareGame(){
const allPools = [];
  selectedCategories.forEach(c => {
    const pool = (words[c] || []).filter(w => !usedWords.includes(w));
    if(pool.length > 0) allPools.push({ cat: c, pool });
  });
  const customPool = customWords.filter(w => !usedWords.includes(w));
  if(customPool.length > 0) allPools.push({ cat: "تایبەت", pool: customPool });

  if(allPools.length === 0){
    usedWords = [];
    selectedCategories.forEach(c => {
      const pool = words[c] || [];
      if(pool.length > 0) allPools.push({ cat: c, pool });
    });
    if(customWords.length > 0) allPools.push({ cat: "تایبەت", pool: customWords });
  }

  const chosen = allPools[Math.floor(Math.random() * allPools.length)];
  gameWord = chosen.pool[Math.floor(Math.random() * chosen.pool.length)];
  selectedCategory = chosen.cat;
  usedWords.push(gameWord);


 spyIndexes = [];
 const rawVal = document.getElementById("spyCount").value;
 const spyCount = rawVal === "random"
   ? Math.floor(Math.random() * 3) + 1
   : parseInt(rawVal);
 while(spyIndexes.length < spyCount){
   if(spyBag.length === 0) spyBag = shuffleArray(players.map((_,i)=>i));
   const rand = spyBag.shift();
   if(!spyIndexes.includes(rand)) spyIndexes.push(rand);
 }
 currentIndex = 0;
}
function showPlayer(){
  cardWasOpened=false;
  document.getElementById("wordCard").classList.remove("flip");
  document.getElementById("nextBtn").classList.remove("active");
  document.getElementById("turnPlayer").innerText=players[currentIndex];
  document.getElementById("playerCounter").innerText=`${currentIndex+1} / ${players.length}`;
  document.getElementById("categoryBadge").innerText=selectedCategory;
  const avatarUrl=getPlayerAvatarUrl(players[currentIndex], playerAvatarIndexes[currentIndex]);
  document.getElementById("avatarFront").innerHTML=`<img src="${avatarUrl}">`;
  document.getElementById("avatarBack").innerHTML=`<img src="${avatarUrl}">`;
  if(spyIndexes.includes(currentIndex)){
    document.getElementById("roleText").innerText="سیخور";
    document.getElementById("secretWord").innerText="تۆ سیخوریت";
  }else{
    document.getElementById("roleText").innerText="وشە";
    document.getElementById("secretWord").innerText=gameWord;
  }
}
function openCard(){vib('medium');cardWasOpened=true;document.getElementById("wordCard").classList.add("flip");}
function closeCard(){
  vib('light');
  document.getElementById("wordCard").classList.remove("flip");
  if(cardWasOpened)document.getElementById("nextBtn").classList.add("active");
  cardWasOpened=false;
}
const card=document.getElementById("wordCard");
card.addEventListener("touchstart",e=>{e.preventDefault();cardWasOpened=false;holdTimer=setTimeout(openCard,400);},{passive:false});
card.addEventListener("touchend",e=>{e.preventDefault();clearTimeout(holdTimer);if(cardWasOpened)closeCard();},{passive:false});
card.addEventListener("mousedown",()=>{cardWasOpened=false;holdTimer=setTimeout(openCard,400);});
card.addEventListener("mouseup",()=>{clearTimeout(holdTimer);if(cardWasOpened)closeCard();});
card.addEventListener("mouseleave",()=>{clearTimeout(holdTimer);if(cardWasOpened)closeCard();});

function nextPlayer(){currentIndex++;if(currentIndex>=players.length){vib('success');showStarter();return;}vib();showPlayer();}

function resetTimerUI(){
  clearInterval(timerInterval);timerStarted=false;isPaused=false;
  document.getElementById("pauseOverlay").classList.remove("active");
  document.getElementById("timer").innerText="00:00";
  document.getElementById("timer").style.color="#111";
  document.getElementById("startRoundBtn").classList.remove("hidden");
  document.getElementById("timerControls").classList.add("hidden");
  stopHintSystem();

}
function startTimer(){
  if(timerStarted)return;timerStarted=true;
  vib('medium');
  document.getElementById("startRoundBtn").classList.add("hidden");
  document.getElementById("timerControls").classList.remove("hidden");
  startHintSystem(document.getElementById('starterName').innerText);
  currentTime=parseInt(document.getElementById("gameTime").value);
  updateTimer(currentTime);
  timerInterval=setInterval(()=>{
    if(isPaused)return;
    currentTime--;
    updateTimer(currentTime);
    if(currentTime===10)vib('medium');
    if(currentTime<=3&&currentTime>0)vib('heavy');
    if(currentTime<=0)finishRound();
  },1000);
}
function togglePause(){
  isPaused=!isPaused;
  vib(isPaused?'medium':'light');
  document.getElementById("pauseOverlay").classList.toggle("active",isPaused);
}
/* دەستنیشانکردن: ئایا دوگمەی بەردەوامبوون بۆ ئۆفڵاینە یان ئۆنڵاین */
function handleResumeClick(){
  if(onlineRoomCode){ toggleOnlinePause(); }
  else { togglePause(); }
}
function restartTimer(){clearInterval(timerInterval);timerStarted=false;startTimer();}
function finishRound(){
  clearInterval(timerInterval);
  isPaused=false;
  document.getElementById("pauseOverlay").classList.remove("active");
  vib('double');
  document.getElementById("timer").innerText="END";
  document.getElementById("timer").style.color="#d60000";
setTimeout(()=> scoringEnabled ? openDadga() : showResults(), 300);
}
function updateTimer(sec){
  const m=Math.floor(sec/60).toString().padStart(2,"0");
  const s=(sec%60).toString().padStart(2,"0");
  document.getElementById("timer").innerText=`${m}:${s}`;
}
function showResults(){
  updateRoundBtn();
  saveGameStats();
  checkReviewPopup();
  showScreen("screen5");
  document.getElementById("wordRevealText").innerText=gameWord;
  document.getElementById("wordRevealCat").innerText="جۆری وشەکە: "+selectedCategory;
  const spyCardsEl=document.getElementById("spyCards");
  spyCardsEl.innerHTML="";
  if(spyIndexes.length===0){
    spyCardsEl.innerHTML=`<div class="no-spies-badge">سیخور نەدۆزرایەوە</div>`;
  } else {
    spyIndexes.forEach((idx,i)=>{
      const div=document.createElement("div");
      const theme=getPlayerCardTheme(players[idx]);
      div.className="spy-card"+(theme?' '+theme:'');
      div.style.animationDelay=(i*0.12)+"s";
      const bgS=getPlayerCardBgStyle(players[idx]); if(bgS) div.style.cssText+=bgS;
      div.innerHTML=`
        <div class="spy-avatar-wrap"><img src="${getPlayerAvatarUrl(players[idx], playerAvatarIndexes[idx])}" width="60" height="60"></div>
        <div class="spy-card-info">
          <div class="spy-card-name">${players[idx]}</div>
          <div class="spy-card-tag"><svg viewBox="0 0 24 24"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/></svg>سیخور</div>
        </div>
        <div class="spy-shield"><svg viewBox="0 0 24 24"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/></svg></div>`;
      spyCardsEl.appendChild(div);
    });
  }
  // ← ئەمە زیاد بکە
  setTimeout(() => openScores(), 600);
}
function updateRoundBtn(){
  const rounds = getTotalRounds();
  const btn = document.getElementById('playAgainBtn');
  if(btn) btn.innerText = `خولی ${rounds + 1}`;
}
function resetAll(){
  document.getElementById('bottomNav').classList.remove('hidden');
navClick('home'); // active state بگەڕێنەوە

  spyIndexes=[];
  usedWords=[];
  document.getElementById("spyCards").innerHTML="";
  showScreen("screen1");
  gameCountForReview = parseInt(localStorage.getItem('sexur_game_count') || '0');

}
const _screens = ['screen1','screen2','screen3','screen4','screen5','statsScreen','reviewScreen','creatorScreen','dadgaScreen'

];
function showScreen(id){
  _screens.forEach(s=>{
    const el=document.getElementById(s);
    if(el) el.classList.toggle('hidden',s!==id);
  });
const gameScreens = ['screen3','screen4','screen5','onlineChooseScreen','onlineLobbyScreen','onlineCardScreen','onlineTimerScreen','onlineVotingScreen','onlineLastChanceScreen','onlineRevealScreen'];
  document.getElementById('bottomNav')
    .classList.toggle('hidden', gameScreens.includes(id));
}
/* ── Spring press ── */
function attachPress(btn){
  if(btn._pressAttached)return;btn._pressAttached=true;
  const down=()=>{btn.style.transition="transform .09s ease";btn.style.transform="scale(0.85)";};
  const up=()=>{setTimeout(()=>{btn.style.transition="transform .45s cubic-bezier(.34,1.7,.64,1)";btn.style.transform="scale(1)";},90);};
  btn.addEventListener("touchstart",down,{passive:true});btn.addEventListener("touchend",up,{passive:true});
  btn.addEventListener("touchcancel",up,{passive:true});btn.addEventListener("mousedown",down);
  btn.addEventListener("mouseup",up);btn.addEventListener("mouseleave",up);
}
function attachAllButtons(){document.querySelectorAll("button").forEach(attachPress);}
attachAllButtons();
const _pressObs=new MutationObserver(attachAllButtons);
_pressObs.observe(document.body,{childList:true,subtree:true});

// WHAT'S NEW
let _wnewAutoClose=null,_wnewCdTick=null;
const WNEW_SECS=10;

function closeWnew(){
  clearTimeout(_wnewAutoClose);
  clearInterval(_wnewCdTick);
  const w=document.getElementById('wnewWrap');
  w.classList.add('closing');
  setTimeout(()=>{
    w.classList.remove('visible','closing');
    w.style.opacity='0';
    w.style.pointerEvents='none';
  },320);
}

setTimeout(()=>{
  const w=document.getElementById('wnewWrap');
  w.style.opacity='';
  w.style.pointerEvents='';
  w.classList.add('visible');

  // لاینی پێشکەوتن
  const bar=document.getElementById('wnewBarFill');
  bar.style.animationDuration=WNEW_SECS+'s';
  bar.classList.add('running');
  
  _wnewAutoClose=setTimeout(closeWnew,WNEW_SECS*1000);
},800);


/* ══ NAVBAR ══ */
/* ── BOTTOM NAV ── */
function navClick(tab) {
  if (document.getElementById('nav-' + tab)?.classList.contains('active')) return;
  vib('medium');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('nav-' + tab).classList.add('active');
  if (tab === 'home') showScreen('screen1');
  if (tab === 'stats') { showScreen('statsScreen'); switchStatsMode('online'); }
  if (tab === 'review') { showScreen('reviewScreen'); loadReviews(); }
if (tab === 'creator') {
  showScreen('creatorScreen');
  renderAuthOrProfile();
}
}

/* ══════════════════════════════════════
   STATS SYSTEM
══════════════════════════════════════ */
function saveGameStats() {
  const stats = JSON.parse(localStorage.getItem('sexur_stats') || '{}');
  
  // ژمارەی یارییەکان
  stats.totalGames = (stats.totalGames || 0) + 1;
  
  // وشەی باو
  stats.words = stats.words || {};
  stats.words[gameWord] = (stats.words[gameWord] || 0) + 1;
  
  // سیخورەکان
  stats.spies = stats.spies || {};
  spyIndexes.forEach(idx => {
    const name = players[idx];
    stats.spies[name] = (stats.spies[name] || 0) + 1;
  });
  
  // چالاکترین یاریزانەکان
  stats.players = stats.players || {};
  players.forEach(name => {
    stats.players[name] = (stats.players[name] || 0) + 1;
  });
  
  localStorage.setItem('sexur_stats', JSON.stringify(stats));
}

function loadStats() {
  return JSON.parse(localStorage.getItem('sexur_stats') || '{}');
}

function renderStats() {
  const stats = loadStats();
  const container = document.getElementById('statsContent');
  if (!container) return;

  // ژمارەی کۆی یاری
  const totalGames = stats.totalGames || 0;

  // وشە زۆر باوەکان — تۆپ 3
  const topWords = Object.entries(stats.words || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // سیخورە باوەکان
  const topSpies = Object.entries(stats.spies || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // چالاکترین یاریزانەکان
  const topPlayers = Object.entries(stats.players || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const wordMedals = ['', '', ''];

  container.innerHTML = `
    <!-- کۆی یاری -->
    <div class="stat-hero">
      <div class="stat-hero-inner">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/></svg>
        <div class="stat-hero-num">${totalGames}</div>
        <div class="stat-hero-label">کۆی یارییەکان</div>
      </div>
    </div>

    <!-- وشە زۆر باوەکان -->
    <div class="stat-section">
      <div class="stat-section-title">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm4 5h8v2H8zm3 5h2v2h-2z"/></svg>
        وشە زۆر باوەکان
      </div>
      ${topWords.length === 0
        ? `<div class="stat-empty">هێشتا یاری نەکراوە</div>`
        : topWords.map(([word, count], i) => `
          <div class="stat-word-row" style="animation-delay:${i * 0.08}s">
            <div class="stat-word-rank rank-${i + 1}">${i + 1}</div>
            <div class="stat-word-name">${word}</div>
            <div class="stat-word-bar-wrap">
              <div class="stat-word-bar" style="width:${Math.min(100, (count / (topWords[0]?.[1] || 1)) * 100)}%"></div>
            </div>
            <div class="stat-word-count">${count}×</div>
          </div>`).join('')
      }
    </div>

    <!-- سیخورە باوەکان -->
    <div class="stat-section">
      <div class="stat-section-title">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/></svg>
        زۆرترین سیخور
      </div>
      ${topSpies.length === 0
        ? `<div class="stat-empty">هێشتا داتا نییە</div>`
        : topSpies.map(([name, count], i) => `
          <div class="stat-player-row" style="animation-delay:${i * 0.06}s">
            <div class="stat-player-avatar">
              <img src="${statPlayerAvatarUrl(name)}" loading="lazy">
            </div>
            <div class="stat-player-name">${name}</div>
            <div class="stat-player-badge spy-badge">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/></svg>
              ${count}
            </div>
          </div>`).join('')
      }
    </div>

    <!-- چالاکترین یاریزانەکان -->
    <div class="stat-section">
      <div class="stat-section-title">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        چالاکترین یاریزانەکان
      </div>
      ${topPlayers.length === 0
        ? `<div class="stat-empty">هێشتا داتا نییە</div>`
        : topPlayers.map(([name, count], i) => `
          <div class="stat-player-row" style="animation-delay:${i * 0.06}s">
            <div class="stat-rank-num">${i + 1}</div>
            <div class="stat-player-avatar">
              <img src="${statPlayerAvatarUrl(name)}" loading="lazy">
            </div>
            <div class="stat-player-name">${name}</div>
            <div class="stat-player-badge game-badge">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/></svg>
              ${count}
            </div>
          </div>`).join('')
      }
    </div>

    <!-- ڕەشکردنەوەی داتا -->
    <button class="stat-reset-btn" onclick="vib('heavy');confirmResetStats()">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
      سیرنەوەی ئامار
    </button>
  `;
}

async function confirmResetStats() {
  const yes = await showModal({
    title: "سرینەوەی ئامار",
    msg: "دڵنیایت؟ هەموو ئامارەکان دەسڕێتەوە.",
    icon: "danger",
    dangerConfirm: true
  });
  if (yes) {
    localStorage.removeItem('sexur_stats');
    renderStats();
    vib('success');
  }
}

/* ══════════════════════════════════════
   ONLINE STATS (LEADERBOARD)
══════════════════════════════════════ */
function switchStatsMode(mode){
  document.getElementById('statsModeOffline').classList.toggle('active', mode==='offline');
  document.getElementById('statsModeOnline').classList.toggle('active', mode==='online');
  document.getElementById('statsContent').classList.toggle('hidden', mode!=='offline');
  document.getElementById('onlineStatsWrap').classList.toggle('hidden', mode!=='online');
  if(mode==='online') loadOnlineStats();
}

const kurdishDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
function toKurdishNum(n){
  return String(n).split('').map(d => kurdishDigits[+d] ?? d).join('');
}

let currentStatCategory = 'champion';
let championRankMap = {}; // user_id -> rank (1-10)

async function fetchChampionRanks(){
  const { data: users } = await sb.from('app_users').select('id,total_games,spy_wins,detective_wins').limit(500);
  if(!users) return;
  const sorted = users.map(u=>({ id:u.id, score:(u.total_games||0)+(u.spy_wins||0)+(u.detective_wins||0) }))
    .filter(u=>u.score>0)
    .sort((a,b)=>b.score-a.score)
    .slice(0,10);
  championRankMap = {};
  sorted.forEach((u,i)=>{ championRankMap[u.id] = i+1; });
}

function championBadgeInline(userId){
  if(!userId || !championRankMap[userId]) return '';
  const rank = championRankMap[userId];
  const cls = rank<=3 ? 'gold' : 'red';
  return ` <span class="champion-badge-inline ${cls}"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 4.86 5.1.5-3.9 3.4 1.2 5.02L12 13.1l-4.3 2.68 1.2-5.02-3.9-3.4 5.1-.5z"/></svg>چامپیۆن ${toKurdishNum(rank)}</span>`;
}

function computeChampionScore(u){
  return (u.total_games||0) + (u.spy_wins||0) + (u.detective_wins||0);
}
function buildChampionBadgeFull(rank){
  const cls = rank<=3 ? 'gold' : 'red';
  return `<div class="champion-rank-badge ${cls}"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 4.86 5.1.5-3.9 3.4 1.2 5.02L12 13.1l-4.3 2.68 1.2-5.02-3.9-3.4 5.1-.5z"/></svg>چامپیۆن ${toKurdishNum(rank)}</div>`;
}
function buildChampionRow(u, rank){
  const frameClass = vipFrameClass(u.frame_style);
  const themeClass = isVipActive(u) && u.card_theme && u.card_theme!=='default' ? ' theme-'+u.card_theme : '';
  const verifiedIco = u.is_verified ? ` ${verifiedBadgeSvg(18)}` : '';
  const score = computeChampionScore(u);
  return `
    <div class="player-item${themeClass}" style="margin-bottom:8px;">
      <div class="avatar ${frameClass}"><div class="avatar-clip"><img src="${avatarUrl(u.avatar_seed)}" loading="lazy"></div></div>
      <div class="player-name">${u.username}${verifiedIco}</div>
      ${buildChampionBadgeFull(rank)}
      <div class="online-stat-badge" style="margin-right:6px;">${score}</div>
    </div>`;
}
function renderChampionStatCategory(box){
  const sorted = [..._statUsersCache].map(u=>({...u, _score:computeChampionScore(u)})).filter(u=>u._score>0).sort((a,b)=>b._score-a._score);
  let html = '';
  if(currentUser){
    const idx = sorted.findIndex(u=>u.username===currentUser.username);
    const rank = idx>=0 ? idx+1 : null;
    const score = computeChampionScore(currentUser);
    html += `
      <div class="stat-your-rank" style="border-color:#ffd70055;">
        <div class="stat-your-rank-label">پلەی تۆ</div>
        <div class="stat-your-rank-row">
          <div class="avatar ${vipFrameClass(currentUser.frame_style)}"><div class="avatar-clip"><img src="${avatarUrl(currentUser.avatar_seed)}" loading="lazy"></div></div>
          <div class="stat-your-rank-name">${currentUser.username}</div>
          ${rank && rank<=10 ? buildChampionBadgeFull(rank) : `<div class="stat-your-rank-badge" style="background:#888;">#${rank?toKurdishNum(rank):'-'}</div>`}
          <div class="stat-your-rank-val">${score}</div>
        </div>
      </div>`;
  }
  if(sorted.length === 0){
    html += `<div class="stat-empty">هێشتا داتا نییە</div>`;
  } else {
    const top10 = sorted.slice(0,10);
    html += `<div class="stat-section">` + top10.map((u,i)=>buildChampionRow(u,i+1)).join('') + `</div>`;
  }
  box.innerHTML = html;
}
const statCategoryConfig = {
  games: { key:'total_games', color:'#ffd400',
    icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="#ffd400"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>' },
  spy: { key:'spy_wins', color:'#ff3b3b',
    icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="#ff3b3b"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/></svg>' },
  detective: { key:'detective_wins', color:'#3b82f6',
    icon:'<svg viewBox="0 0 24 24" width="20" height="20" fill="#3b82f6"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>' }
};

function switchStatCategory(cat){
  currentStatCategory = cat;
  document.querySelectorAll('.stat-chip').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  renderStatCategory();
}

function buildYourRankCard(user, rank, val, cfg){
  const vip = isVipActive(user);
  const frameClass = vip ? vipFrameClass(user.frame_style) : '';
  const rankText = rank ? '#' + toKurdishNum(rank) : '—';
  return `
    <div class="stat-your-rank" style="border-color:${cfg.color}55;">
      <div class="stat-your-rank-label">پلەی تۆ</div>
      <div class="stat-your-rank-row">
        <div class="avatar ${frameClass}"><div class="avatar-clip"><img src="${avatarUrl(user.avatar_seed)}" loading="lazy"></div></div>
        <div class="stat-your-rank-name">${user.username}</div>
        <div class="stat-your-rank-badge" style="background:${cfg.color};">${rankText}</div>
        <div class="stat-your-rank-val">${val}</div>
      </div>
    </div>`;
}

function buildPodiumFirst(u, cfg){
  const vip = isVipActive(u);
  const frameClass = vip ? vipFrameClass(u.frame_style) : '';
  const verifiedIco = u.is_verified ? ` ${verifiedBadgeSvg(19)}` : '';
  return `
    <div class="stat-podium-first">
      <div class="stat-podium-crown"><svg viewBox="0 0 24 24" width="22" height="22" fill="${cfg.color}"><path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5zm0 2h14v2H5v-2z"/></svg></div>
      <div class="stat-podium-first-avatar ${frameClass}"><img src="${avatarUrl(u.avatar_seed)}" loading="lazy"></div>
      <div class="stat-podium-first-name">${u.username}${verifiedIco}</div>
      <div class="stat-podium-first-val" style="color:${cfg.color};">${u[cfg.key]||0}</div>
    </div>`;
}

function buildPodiumCard(u, cfg, rank){
  const vip = isVipActive(u);
  const frameClass = vip ? vipFrameClass(u.frame_style) : '';
  return `
    <div class="stat-podium-card">
      <div class="stat-podium-rank">${toKurdishNum(rank)}</div>
      <div class="avatar ${frameClass}" style="width:52px;height:52px;"><div class="avatar-clip"><img src="${avatarUrl(u.avatar_seed)}" loading="lazy"></div></div>
      <div class="stat-podium-card-name">${u.username}</div>
      <div class="stat-podium-card-val" style="color:${cfg.color};">${u[cfg.key]||0}</div>
    </div>`;
}

function buildPodium(top3, cfg){
  if(top3.length === 0) return '';
  const [first, second, third] = top3;
  let html = '<div class="stat-podium-wrap">';
  if(first) html += buildPodiumFirst(first, cfg);
  if(second || third){
    html += '<div class="stat-podium-row23">';
    if(second) html += buildPodiumCard(second, cfg, 2);
    if(third) html += buildPodiumCard(third, cfg, 3);
    html += '</div>';
  }
  html += '</div>';
  return html;
}

let _statUsersCache = null;

function renderStatCategory(){
  const box = document.getElementById('onlineStatsContent');
  if(!box || !_statUsersCache) return;

  if(currentStatCategory === 'champion'){
    renderChampionStatCategory(box);
    return;
  }
  if(currentStatCategory === 'vip'){
    renderVipStatCategory(box);
    return;
  }

  const cfg = statCategoryConfig[currentStatCategory];
  const sorted = [..._statUsersCache].filter(u => (u[cfg.key]||0) > 0).sort((a,b) => (b[cfg.key]||0) - (a[cfg.key]||0));

  let html = '';

  if(currentUser){
    const allSorted = [..._statUsersCache].sort((a,b) => (b[cfg.key]||0) - (a[cfg.key]||0));
    const idx = allSorted.findIndex(u => u.username === currentUser.username);
    const rank = idx >= 0 ? idx + 1 : null;
    const val = currentUser[cfg.key] || 0;
    html += buildYourRankCard(currentUser, rank, val, cfg);
  }

  if(sorted.length === 0){
    html += `<div class="stat-empty">هێشتا داتا نییە</div>`;
  } else {
    const top3 = sorted.slice(0, 3);
    const rest = sorted.slice(3, 10);
    html += buildPodium(top3, cfg);
    if(rest.length){
      html += `<div class="stat-section">` + rest.map((u,i) => buildOnlineStatRow(u, u[cfg.key]||0, i+4)).join('') + `</div>`;
    }
  }
  box.innerHTML = html;
}

function buildVipStatRow(u, rank){
  const frameClass = vipFrameClass(u.frame_style);
  const rankClass = rank<=3 ? ' rank-'+rank : '';
  const verifiedIco = u.is_verified
    ? ` ${verifiedBadgeSvg(18)}`
    : '';
  const hasTheme = u.card_theme && u.card_theme !== 'default';
  const rowClass = hasTheme ? ' theme-'+u.card_theme : ' vip-list-row';
  const daysLeft = Math.max(0, Math.ceil((new Date(u.vip_until) - new Date())/(24*60*60*1000)));
  return `
    <div class="player-item${rowClass}" style="margin-bottom:8px;">
      <div class="stat-rank-num${rankClass}">${rank}</div>
      <div class="avatar ${frameClass}"><div class="avatar-clip"><img src="${avatarUrl(u.avatar_seed)}" loading="lazy"></div></div>
      <div class="player-name">${u.username}${verifiedIco}</div>
      <div class="vip-days-badge">${toKurdishNum(daysLeft)} ڕۆژ</div>
    </div>`;
}

function renderVipStatCategory(box){
  const vipUsers = _statUsersCache.filter(u => isVipActive(u))
    .sort((a,b) => new Date(b.vip_until) - new Date(a.vip_until));

  let html = '';

  if(currentUser){
    if(isVipActive(currentUser)){
      const daysLeft = Math.max(0, Math.ceil((new Date(currentUser.vip_until) - new Date())/(24*60*60*1000)));
      html += `
        <div class="stat-your-rank" style="border-color:#4fc3f755;">
          <div class="stat-your-rank-label">پاکێتی تۆ</div>
          <div class="stat-your-rank-row">
            <div class="avatar ${vipFrameClass(currentUser.frame_style)}"><div class="avatar-clip"><img src="${avatarUrl(currentUser.avatar_seed)}" loading="lazy"></div></div>
            <div class="stat-your-rank-name">${currentUser.username}</div>
            <div class="vip-days-badge">${toKurdishNum(daysLeft)} ڕۆژ</div>
          </div>
        </div>`;
    } else {
      html += `
        <div class="stat-your-rank" style="border-color:#4fc3f755;text-align:center;">
          <div style="font-size:13px;font-weight:800;color:#888;">هێشتا پاکێتی VIP چالاک نەکردووە</div>
        </div>`;
    }
  }

  if(vipUsers.length === 0){
    html += `<div class="stat-empty">هێشتا کەس پاکێتی VIP چالاک نەکردووە</div>`;
  } else {
    html += `<div class="stat-section">` + vipUsers.map((u,i) => buildVipStatRow(u, i+1)).join('') + `</div>`;
  }

  box.innerHTML = html;
}

function buildOnlineStatRow(u, val, rank){
  const vip = isVipActive(u);
  const themeClass = vip && u.card_theme && u.card_theme!=='default' ? ' theme-'+u.card_theme : '';
  const frameClass = vip ? vipFrameClass(u.frame_style) : '';
  const rankClass = rank<=3 ? ' rank-'+rank : '';
  const verifiedIco = u.is_verified
    ? ` ${verifiedBadgeSvg(18)}`
    : '';
  return `
    <div class="player-item${themeClass}" style="margin-bottom:8px;">
      <div class="stat-rank-num${rankClass}">${rank}</div>
      <div class="avatar ${frameClass}"><div class="avatar-clip"><img src="${avatarUrl(u.avatar_seed)}" loading="lazy"></div></div>
      <div class="player-name">${u.username}${verifiedIco}</div>
      <div class="online-stat-badge">${val}</div>
    </div>`;
}

function buildOnlineStatSection(title, iconSvg, list, key){
  if(list.length === 0){
    return `<div class="stat-section"><div class="stat-section-title">${iconSvg}${title}</div><div class="stat-empty">هێشتا داتا نییە</div></div>`;
  }
  const rows = list.map((u,i)=> buildOnlineStatRow(u, u[key]||0, i+1)).join('');
  return `<div class="stat-section"><div class="stat-section-title">${iconSvg}${title}</div>${rows}</div>`;
}

async function loadOnlineStats(){
  const box = document.getElementById('onlineStatsContent');
  if(!box) return;
  box.innerHTML = '<div class="stat-empty">چاوەڕوانبە...</div>';

  const { data: users, error } = await sb.from('app_users')
    .select('username,avatar_seed,is_verified,frame_style,card_theme,total_games,spy_wins,detective_wins,vip_until')
    .order('total_games', { ascending:false })
    .limit(200);

  if(error || !users){
    box.innerHTML = '<div class="stat-empty">نەتوانرا ئامار بار بکرێت</div>';
    return;
  }

  _statUsersCache = users;
  renderStatCategory();
}

/* ══════════════════════════════════════
   REVIEW SYSTEM
══════════════════════════════════════ */
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbz3faSklt0Wc9X0RZYSBIyPiqgSWPYj9r3CJyaMHILQgy1u4nB-v89EFrS5c4mrcsl-5g/exec';
const ADMIN_KEY = 'sexur2024'; // کۆدی تایبەتی بۆ سڕینەوە — بگۆڕە
let selectedStars = 0;
let gameCountForReview = parseInt(localStorage.getItem('sexur_game_count') || '0');

function setStar(n) {
  selectedStars = n;
  vib('light');
  document.querySelectorAll('.star-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i < n);
  });
}

async function submitReview() {
  const name = document.getElementById('reviewName').value.trim();
  const text = document.getElementById('reviewText').value.trim();
  if (!name) { vib('error'); showModal({title:"ناو پێویستە", msg:"تکایە ناوت بنووسە.", icon:"warn"}); return; }
  if (!selectedStars) { vib('error'); showModal({title:"ئەستێرە هەڵبژێرە", msg:"تکایە ئەستێرەیەک هەڵبژێرە.", icon:"warn"}); return; }
  if (!text) { vib('error'); showModal({title:"پێداچوونەوە پێویستە", msg:"تکایە بۆچوونت بنووسە.", icon:"warn"}); return; }

  const btn = document.getElementById('reviewSubmitBtn');
  btn.disabled = true;
  btn.innerText = 'دەنێردرێت...';

  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, stars: selectedStars, review: text })
    });
    vib('success');
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewText').value = '';
    setStar(0);
    selectedStars = 0;
    showModal({title:"سوپاس!", msg:"پێداچوونەوەکەت نێردرا. زۆر سوپاس!", icon:"ok"});
    loadReviews();
  } catch(e) {
    showModal({title:"هەڵە", msg:"کێشەیەک روویدا، دووبارە هەوڵبدەرەوە.", icon:"err"});
  }

  btn.disabled = false;
  btn.innerText = 'ناردنی پێداچوونەوە';
}

async function loadReviews() {
  const box = document.getElementById('reviewsList');
  if (!box) return;
  box.innerHTML = '<div class="review-loading">چاوەڕوانبە...</div>';
  try {
    const res = await fetch(SHEET_URL + '?t=' + Date.now());
    const data = await res.json();
    if (!data.length) {
      box.innerHTML = '<div class="review-empty">هێشتا پێداچوونەوە نییە — یەکەمین بە!</div>';
      return;
    }
    box.innerHTML = '';
    data.reverse().forEach((r, i) => {
      const div = document.createElement('div');
      div.className = 'review-card';
      div.style.animationDelay = (i * 0.05) + 's';
      const stars = Array.from({length:5}, (_,j) => `
        <svg viewBox="0 0 24 24" fill="${j < r.stars ? '#ffd400' : '#e0e0e0'}">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>`).join('');
      const date = r.date ? new Date(r.date).toLocaleDateString('ku', {year:'numeric',month:'short',day:'numeric'}) : '';
      div.innerHTML = `
        <div class="review-card-top">
          <div class="review-card-avatar">
            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(r.name)}" loading="lazy">
          </div>
          <div class="review-card-meta">
            <div class="review-card-name">${r.name}</div>
            <div class="review-card-stars">${stars}</div>
            <div class="review-card-date">${date}</div>
          </div>
          <button class="review-card-delete" onclick="deleteReview(${i}, '${r.name}')">
            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
        <div class="review-card-text">${r.review}</div>`;
      box.appendChild(div);
    });
  } catch(e) {
    box.innerHTML = '<div class="review-empty">پێداچوونەوەکان بەمزووانە بەردەست دەبن.</div>';
  }
}

async function deleteReview(index, name) {
  const key = prompt('کۆدی تایبەتی بنووسە:');
  if (key !== ADMIN_KEY) { showModal({title:"هەڵە", msg:"کۆدەکە هەڵەیە.", icon:"err"}); return; }
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', index: index + 1 })
    });
    vib('success');
    loadReviews();
  } catch(e) {
    showModal({title:"هەڵە", msg:"نەتوانرا بسرێتەوە.", icon:"err"});
  }
}

/* پۆپ-ئەپ دوای ٣ یاری */
function checkReviewPopup() {
  gameCountForReview++;
  localStorage.setItem('sexur_game_count', gameCountForReview);
  if (gameCountForReview % 3 === 0) {
    setTimeout(() => {
      document.getElementById('reviewPopupOverlay').classList.add('active');
    }, 1500);
  }
}

function closeReviewPopup(goToReview) {
  document.getElementById('reviewPopupOverlay').classList.remove('active');
  if (goToReview) {
    setTimeout(() => {
      navClick('review');
    }, 300);
  }
}

/* ══ CREATOR ══ */
function toggleContactDetail(which){
  const rows = { share:['shareRowTrigger','shareDetail'], donate:['donateRowTrigger','donateDetail'] };
  Object.keys(rows).forEach(key=>{
    const [rowId, detId] = rows[key];
    const row = document.getElementById(rowId);
    const det = document.getElementById(detId);
    if(key === which){
      const isOpen = row.classList.contains('open');
      row.classList.toggle('open', !isOpen);
      det.classList.toggle('open', !isOpen);
    } else {
      row.classList.remove('open');
      det.classList.remove('open');
    }
  });
}

function toggleDonateCard() {
  const card = document.getElementById('donateCard');
  card.classList.toggle('open');
}

function copyFIB() {
  vib('medium');
  const btn = document.getElementById('donateCopyBtn');
  navigator.clipboard?.writeText('07509628683').then(() => {
    vib('success');
    btn.classList.add('copied');
    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>کۆپی کرا ✓`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>کۆپی بکە`;
    }, 2500);
  }).catch(() => {
    showModal({title:"کۆپی نەکرا", msg:"ژمارەکە کۆپی بکە: 0750 962 8683", icon:"warn"});
  });
}

function copyLink() {
  const btn = document.getElementById('shareCopyBtn');
  navigator.clipboard?.writeText('https://sexurgame.com').then(() => {
    vib('success');
    btn.classList.add('copied');
    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>کۆپی کرا ✓`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `<img src="sexur.webp" style="width:22px;height:22px;border-radius:6px;object-fit:cover;flex-shrink:0;"> لینکەکە کۆپی بکە`;
    }, 2500);
  }).catch(() => {
    showModal({title:"کۆپی نەکرا", msg:"لینکەکە دەستی کۆپی بکە: https://sexurgame.com", icon:"warn"});
  });
}

/* ══ DISCORD LIVE STATS ══ */
async function loadDiscordStats(){
  if(!document.getElementById('discordOnlineCount')) return;
  const inviteCode = 'driverkurdi'; // هەمان کۆدی ناو href
  try{
    const res = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`);
    const data = await res.json();
    const online = data.approximate_presence_count;
    const total  = data.approximate_member_count;
    if(online != null) document.getElementById('discordOnlineCount').innerText = online.toLocaleString('en-US');
    if(total  != null) document.getElementById('discordMemberCount').innerText  = total.toLocaleString('en-US');
  }catch(e){
    document.getElementById('discordOnlineCount').innerText = '?';
    document.getElementById('discordMemberCount').innerText = '?';
  }
}
window.addEventListener('load', () => setTimeout(loadDiscordStats, 1200));

/* ══════════════════════════════════════
   SEXUR ACCOUNT SYSTEM
══════════════════════════════════════ */
let authCurrentTab = 'login';
let currentUser = null; // { id, username, avatar_seed, is_verified, card_theme, frame_style }
function isVipActive(user){
  return !!(user && user.vip_until && new Date(user.vip_until) > new Date());
}
function vipFrameClass(frameStyle){
  if(frameStyle==='royal') return 'vip-frame-royal';
  if(frameStyle==='spy') return 'vip-frame-spy';
  if(frameStyle==='electric') return 'vip-frame-electric';
  return '';
}
function getPlayerCardTheme(name){
  if(currentUser && isVipActive(currentUser) && currentUser.username === name && currentUser.card_theme && currentUser.card_theme !== 'default'){
    return 'theme-' + currentUser.card_theme;
  }
  return '';
}
function getPlayerAvatarUrl(name, fallbackIdx){
  if(currentUser && isVipActive(currentUser) && currentUser.username === name && currentUser.avatar_seed){
    return avatarUrl(currentUser.avatar_seed);
  }
  return avatars[fallbackIdx];
}
function statPlayerAvatarUrl(name){
  if(currentUser && isVipActive(currentUser) && currentUser.username === name && currentUser.avatar_seed){
    return avatarUrl(currentUser.avatar_seed);
  }
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
}
function vipFrameIconSvg(id){
  if(id==='royal') return '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5zm0 2h14v2H5v-2z" fill="#ffd400"/></svg>';
  if(id==='spy') return '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z" fill="#ff3b3b"/></svg>';
  if(id==='electric') return '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M11 21h-1l1-7H7l6-11h1l-1 7h4l-6 11z" fill="#00e5ff"/></svg>';
  return '';
}
function verifiedBadgeSvg(size){
  size = size || 18;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="vertical-align:-4px;flex-shrink:0;"><path fill="#1877F2" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/><path fill="#fff" d="M9.71 15.29l-2.4-2.4 1.42-1.42 1 1 4.5-4.5 1.42 1.42z"/></svg>`;
}
function vipBadgeHtml(isVerified){
  return isVerified ? `<div class="vip-mini-badge">${verifiedBadgeSvg(11)}</div>` : '';
}

async function redeemVipCode(){
  if(!currentUser){
    vib('error');
    showModal({title:"پێویستە بچیتە ژوورەوە", msg:"سەرەتا هەژمارێک دروست بکە یان بچۆ ژوورەوە.", icon:"warn"});
    return;
  }
  const code = document.getElementById('vipCodeInput').value.trim();
  if(!code){ vib('error'); return; }

  const btn = document.getElementById('vipRedeemBtn');
  btn.disabled = true; btn.innerText = '...';

  const { data: row } = await sb.from('redeem_codes').select('*').eq('code', code).maybeSingle();

  if(!row){
    vib('error');
    showModal({title:"کۆدەکە هەڵەیە", msg:"ئەم کۆدە بوونی نییە.", icon:"err"});
    btn.disabled=false; btn.innerText='چالاککردن'; return;
  }
  if(row.used_by_username){
    vib('error');
    showModal({title:"کۆدەکە بەکارهاتووە", msg:"ئەم کۆدە پێشتر بەکارهاتووە.", icon:"err"});
    btn.disabled=false; btn.innerText='چالاککردن'; return;
  }

  const now = new Date();
  const base = isVipActive(currentUser) ? new Date(currentUser.vip_until) : now;
  const newUntil = new Date(base.getTime() + row.duration_days*24*60*60*1000);

  const { error: e1 } = await sb.from('redeem_codes').update({
    used_by_username: currentUser.username, used_at: now.toISOString()
  }).eq('id', row.id).is('used_by_username', null);
  console.error('Redeem update error:', e1);
  if(e1){
    vib('error');
    showModal({title:"کۆدەکە بەکارهات", msg:"یەکێکی تر پێش تۆ ئەم کۆدەی بەکارهێنا.", icon:"err"});
    btn.disabled=false; btn.innerText='چالاککردن'; return;
  }

    const { data: updatedUser, error: e2 } = await sb.from('app_users').update({
    vip_until: newUntil.toISOString(), is_verified: true
  }).eq('id', currentUser.id).select().single();

  console.error('VIP activation error:', e2);
  if(e2 || !updatedUser){
    vib('error');
    showModal({title:"هەڵە لە چالاککردن", msg:"کۆدەکە تۆمارکرا بەڵام نەتوانرا هەژمارەکەت نوێ بکرێتەوە. تکایە پەیوەندی بکە.", icon:"err"});
    btn.disabled=false; btn.innerText='چالاککردن'; return;
  }

  currentUser = updatedUser;
  document.getElementById('vipCodeInput').value = '';
  btn.disabled=false; btn.innerText='چالاککردن';
  vib('success');
  showModal({title:"پاکێتی VIP چالاک بوو 🎉", msg:"سوپاس! ئێستا پاکێتی VIP بۆ ماوەی "+row.duration_days+" ڕۆژ چالاکە.", icon:"ok"});
  renderAuthOrProfile();
}

const vipAvatarSeeds = ["Zara","Titan","Blaze","Nova","Cleo","Orion","Luna"];

function renderVipAvatarGrid(){
  const grid = document.getElementById('vipAvatarGrid');
  if(!grid) return;

  const hasCustom = !!currentUser.custom_avatar;
  const isCustomActive = hasCustom && currentUser.avatar_seed === currentUser.custom_avatar;

  // ئەگەر پێشتر دروستکراوە، تەنها چالاککردنەکە نوێ بکەرەوە — بێ دروستکردنەوەی وێنەکان (ریفرێش نابنەوە)
  if(grid.dataset.built === '1'){
    grid.querySelectorAll('.vip-avatar-opt[data-seed]').forEach(el=>{
      el.classList.toggle('active', !isCustomActive && el.dataset.seed === currentUser.avatar_seed);
    });
    const customTile = grid.querySelector('.vip-avatar-opt[data-custom]');
    if(hasCustom){
      if(customTile){
        if(customTile.querySelector('img').src !== currentUser.custom_avatar){
          customTile.querySelector('img').src = currentUser.custom_avatar;
        }
        customTile.classList.toggle('active', isCustomActive);
      } else {
        const div = document.createElement('div');
        div.className = 'vip-avatar-opt' + (isCustomActive ? ' active' : '');
        div.setAttribute('data-custom','1');
        div.innerHTML = `<img src="${currentUser.custom_avatar}" loading="lazy">`;
        div.onclick = () => { vib('medium'); selectCustomAvatar(); };
        grid.insertBefore(div, grid.children[1] || null);
      }
    } else if(customTile){
      customTile.remove();
    }
    return;
  }

  grid.innerHTML = '';
  grid.dataset.built = '1';

  const uploadDiv = document.createElement('div');
  uploadDiv.className = 'vip-avatar-upload';
  uploadDiv.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
    <span>وێنەی خۆت</span>`;
  uploadDiv.onclick = () => { vib('medium'); document.getElementById('vipPhotoInput').click(); };
  grid.appendChild(uploadDiv);

  if(hasCustom){
    const div = document.createElement('div');
    div.className = 'vip-avatar-opt' + (isCustomActive ? ' active' : '');
    div.setAttribute('data-custom','1');
    div.innerHTML = `<img src="${currentUser.custom_avatar}" loading="lazy">`;
    div.onclick = () => { vib('medium'); selectCustomAvatar(); };
    grid.appendChild(div);
  }

  vipAvatarSeeds.forEach(seed=>{
    const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
    const div = document.createElement('div');
    div.className = 'vip-avatar-opt' + (!isCustomActive && currentUser.avatar_seed===seed ? ' active' : '');
    div.setAttribute('data-seed', seed);
    div.innerHTML = `<img src="${url}" loading="lazy">`;
    div.onclick = () => { vib('medium'); selectVipAvatar(seed); };
    grid.appendChild(div);
  });
}

async function selectCustomAvatar(){
  const { data: updatedUser } = await sb.from('app_users').update({ avatar_seed: currentUser.custom_avatar }).eq('id', currentUser.id).select().single();
  currentUser = updatedUser;
  renderAuthOrProfile();
}
async function selectVipAvatar(seed){
  const { data: updatedUser } = await sb.from('app_users').update({ avatar_seed: seed }).eq('id', currentUser.id).select().single();
  currentUser = updatedUser;
  renderAuthOrProfile();
}

function handleCustomPhotoUpload(event){
  if(!isVipActive(currentUser)){
    vib('error');
    showModal({title:"تایبەتە بە VIP", msg:"بۆ ئەپلۆدکردنی وێنەی خۆت پێویستە پاکێتی VIP چالاک بکەیت.", icon:"warn"});
    event.target.value = '';
    return;
  }
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const size = 260;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      const scale = Math.max(size/img.width, size/img.height);
      const w = img.width*scale, h = img.height*scale;
      ctx.drawImage(img, (size-w)/2, (size-h)/2, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      saveCustomAvatar(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

async function saveCustomAvatar(dataUrl){
  vib('medium');
  const { data: updatedUser, error } = await sb.from('app_users').update({ avatar_seed: dataUrl, custom_avatar: dataUrl }).eq('id', currentUser.id).select().single();
  if(error || !updatedUser){
    vib('error');
    showModal({title:"هەڵە", msg:"نەتوانرا وێنەکە هەڵبگیرێت.", icon:"err"});
    return;
  }
  currentUser = updatedUser;
  vib('success');
  renderAuthOrProfile();
}

const vipThemes = [
  { id:'default', label:'ئاسایی' },
  { id:'royal', label:'شاهانە' },
  { id:'spy', label:'سیخوڕ' },
  { id:'electric', label:'کارەبایی' }
];
function renderVipThemeRow(){
  const row = document.getElementById('vipThemeRow');
  if(!row) return;
  row.innerHTML = '';
  vipThemes.forEach(t=>{
    const div = document.createElement('div');
    div.className = 'vip-theme-opt' + (currentUser.frame_style===t.id ? ' active' : '');
    div.innerHTML = `<div class="vip-theme-swatch ${vipFrameClass(t.id)}" style="border:2.5px solid #eee;background:#fff;display:flex;align-items:center;justify-content:center;">${vipFrameIconSvg(t.id)}</div><span>${t.label}</span>`;
    div.onclick = () => { vib('medium'); selectVipTheme(t.id); };
    row.appendChild(div);
  });
}

async function selectVipTheme(themeId){
  const { data: updatedUser } = await sb.from('app_users').update({ frame_style: themeId }).eq('id', currentUser.id).select().single();
  currentUser = updatedUser;
  renderAuthOrProfile();
}
function renderProfileFrameIcon(){
  const el = document.getElementById('profileFrameIcon');
  if(!el) return;
  const bgMap = { royal:'#111', spy:'#111', electric:'#111' };
  const bg = bgMap[currentUser.frame_style];
  if(!bg){ el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  el.style.background = bg;
  el.innerHTML = vipFrameIconSvg(currentUser.frame_style);
}
/* ══ CARD CUSTOM BACKGROUND (VIP) ══ */
function cardBgClass(u){ return (u && u.card_bg_image) ? ' custom-bg-card' : ''; }
function cardBgStyle(u){ return (u && u.card_bg_image) ? `background-image:linear-gradient(0deg, rgba(0,0,0,.4), rgba(0,0,0,.4)), url('${u.card_bg_image}');` : ''; }
function getPlayerCardBgClass(name){
  return (currentUser && isVipActive(currentUser) && currentUser.username === name && currentUser.card_bg_image) ? ' custom-bg-card' : '';
}
function getPlayerCardBgStyle(name){
  return (currentUser && isVipActive(currentUser) && currentUser.username === name) ? cardBgStyle(currentUser) : '';
}
function renderCardBgUI(){
  const preview = document.getElementById('vipCardBgPreview');
  const removeBtn = document.getElementById('vipCardBgRemoveBtn');
  if(!preview) return;
  if(currentUser.card_bg_image){
    preview.classList.add('has-img');
    preview.innerHTML = `<img src="${currentUser.card_bg_image}" loading="lazy">`;
    removeBtn.classList.remove('hidden');
  } else {
    preview.classList.remove('has-img');
    preview.innerHTML = `<svg viewBox="0 0 24 24" fill="#999"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;
    removeBtn.classList.add('hidden');
  }
}
function handleCardBgUpload(event){
  if(!isVipActive(currentUser)){
    vib('error');
    showModal({title:"تایبەتە بە VIP", msg:"بۆ دانانی وێنەی کارتی خۆت پێویستە پاکێتی VIP چالاک بکەیت.", icon:"warn"});
    event.target.value = '';
    return;
  }
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const w = 640, h = 220;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      const scale = Math.max(w/img.width, h/img.height);
      const dw = img.width*scale, dh = img.height*scale;
      ctx.drawImage(img, (w-dw)/2, (h-dh)/2, dw, dh);
      saveCardBgImage(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}
async function saveCardBgImage(dataUrl){
  vib('medium');
  const { data: updatedUser, error } = await sb.from('app_users').update({ card_bg_image: dataUrl }).eq('id', currentUser.id).select().single();
  if(error || !updatedUser){ vib('error'); showModal({title:"هەڵە", msg:"نەتوانرا وێنەکە هەڵبگیرێت.", icon:"err"}); return; }
  currentUser = updatedUser;
  vib('success');
  renderAuthOrProfile();
}
async function removeCardBgImage(){
  vib('medium');
  const { data: updatedUser, error } = await sb.from('app_users').update({ card_bg_image: null }).eq('id', currentUser.id).select().single();
  if(error || !updatedUser){ vib('error'); return; }
  currentUser = updatedUser;
  vib('success');
  renderAuthOrProfile();
}

const vipCardThemes = [
  { id:'default', label:'ئاسایی' },
  { id:'fire', label:'ئاگرین 🔥', color:'linear-gradient(135deg,#0a0a0a,#c0392b)' },
  { id:'neon', label:'کارەبایی ⚡', color:'linear-gradient(135deg,#0a0a0a,#0d6efd)' },
  { id:'royal', label:'شاهانە 👑', color:'linear-gradient(135deg,#0a0a0a,#8a5cf6)' },
  { id:'dark', label:'تاریک', color:'linear-gradient(135deg,#0a0a0a,#555)' }
];
function renderVipCardThemeRow(){
  const row = document.getElementById('vipCardThemeRow');
  if(!row) return;
  row.innerHTML = '';
  vipCardThemes.forEach(t=>{
    const div = document.createElement('div');
    div.className = 'vip-theme-opt' + (currentUser.card_theme===t.id ? ' active' : '');
    div.innerHTML = `<div class="vip-theme-swatch" style="background:${t.color};"></div><span>${t.label}</span>`;
    div.onclick = () => { vib('medium'); selectVipCardTheme(t.id); };
    row.appendChild(div);
  });
  renderVipCardThemePreview();
}
function renderVipCardThemePreview(){
  const box = document.getElementById('vipCardThemePreview');
  if(!box) return;
  const theme = currentUser.card_theme && currentUser.card_theme!=='default' ? currentUser.card_theme : '';
  box.innerHTML = `
    <div class="player-item${theme?' theme-'+theme:''}${cardBgClass(currentUser)}" style="${cardBgStyle(currentUser)}">
      <div class="avatar"><img src="${avatarUrl(currentUser.avatar_seed)}" loading="lazy"></div>
      <div class="player-name">${currentUser.username}</div>
    </div>`;
}
async function selectVipCardTheme(themeId){
  const { data: updatedUser } = await sb.from('app_users').update({ card_theme: themeId, card_bg_image: null }).eq('id', currentUser.id).select().single();
  currentUser = updatedUser;
  renderAuthOrProfile();
}
async function sha256Hex(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function toggleVerifiedBadge(checked){
  if(!isVipActive(currentUser)){
    vib('error');
    document.getElementById('vipVerifiedToggle').checked = !checked;
    showModal({title:"تایبەتە بە VIP", msg:"بۆ چالاککردنی هێمای پشتڕاستکراوی پێویستە پاکێتی VIP چالاک بکەیت.", icon:"warn"});
    return;
  }
  vib('medium');
  document.getElementById('profileVerifiedBadge').classList.toggle('hidden', !checked);
  const { data: updatedUser, error } = await sb.from('app_users').update({ is_verified: checked }).eq('id', currentUser.id).select().single();
  if(error || !updatedUser){
    vib('error');
    document.getElementById('vipVerifiedToggle').checked = !checked;
    document.getElementById('profileVerifiedBadge').classList.toggle('hidden', !currentUser.is_verified);
    return;
  }
  currentUser = updatedUser;
  vib('success');
  renderAuthOrProfile();
}
function switchAuthTab(tab){
  authCurrentTab = tab;
  document.getElementById('authTabLogin').classList.toggle('active', tab==='login');
  document.getElementById('authTabRegister').classList.toggle('active', tab==='register');
  document.getElementById('authSubmitText').innerText = tab==='login' ? 'چوونەژوورەوە' : 'دروستکردنی هەژمار';
  document.getElementById('authSubmitIcon').innerHTML = tab==='login'
    ? '<path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>'
    : '<path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>';
  const btn = document.getElementById('authSubmitBtn');
  btn.style.background = tab==='login' ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'linear-gradient(135deg,#22c55e,#16a34a)';
  btn.style.color = '#fff';
  btn.style.boxShadow = tab==='login' ? '0 6px 20px rgba(59,130,246,.35)' : '0 6px 20px rgba(34,197,94,.35)';
  document.getElementById('authErrMsg').style.display = 'none';
}

function onAuthUsernameInput(){
  const input = document.getElementById('authUsername');
  const cleaned = input.value.replace(/[^\u0600-\u06FF\u200c\s]/g,'');
  if(cleaned !== input.value){
    input.value = cleaned;
    vib('error');
    showKurdishToast();
  }
}
function showAuthError(msg){
  const el = document.getElementById('authErrMsg');
  el.innerText = msg;
  el.style.display = 'block';
  vib('error');
}

async function submitAuth(){
  const username = document.getElementById('authUsername').value.trim();
  const password = document.getElementById('authPassword').value;

  if(!username || username.length < 3){ showAuthError('ناوی بەکارهێنەر لانیکەم ٣ پیت بێت'); return; }
  if(!password || password.length < 4){ showAuthError('وشەی نهێنی لانیکەم ٤ پیت بێت'); return; }

  const btn = document.getElementById('authSubmitBtn');
  btn.disabled = true;
  const pwHash = await sha256Hex(password);

  if(authCurrentTab === 'register'){
    const { data: existing } = await sb.from('app_users').select('id').eq('username', username).maybeSingle();
    if(existing){ showAuthError('ئەم ناوە پێشتر بەکارهاتووە'); btn.disabled = false; return; }

    const { data: created, error } = await sb.from('app_users').insert({
      username, password_hash: pwHash, client_id: CLIENT_ID,
      avatar_seed: username + '_' + Date.now(), is_verified: false,
      card_theme: 'default', frame_style: 'default'
    }).select().single();

    if(error){
      console.error('Register error:', error);
      showAuthError('هەڵە: ' + (error.message || 'هەڵەیەک ڕوویدا'));
      btn.disabled = false; return;
    }
    vib('success');
    setUserSession(created);
  } else {
    const { data: user } = await sb.from('app_users').select('*').eq('username', username).maybeSingle();
    if(!user || user.password_hash !== pwHash){ showAuthError('ناو یان وشەی نهێنی هەڵەیە'); btn.disabled = false; return; }
    vib('success');
    setUserSession(user);
  }
  btn.disabled = false;
}

function setUserSession(user){
  currentUser = user;
  localStorage.setItem('sexur_user_session', JSON.stringify({ id: user.id, username: user.username }));
  renderAuthOrProfile();
}
async function loadUserSession(){
  const saved = localStorage.getItem('sexur_user_session');
  if(!saved) return;
  try{
    const { id } = JSON.parse(saved);
    const { data: user } = await sb.from('app_users').select('*').eq('id', id).maybeSingle();
    if(user){
      currentUser = user;
      renderAuthOrProfile();
    }
    else localStorage.removeItem('sexur_user_session');
  }catch(e){ localStorage.removeItem('sexur_user_session'); }
}
function logoutUser(){
  currentUser = null;
  localStorage.removeItem('sexur_user_session');
  renderAuthOrProfile();
}

function renderAuthOrProfile(){
  const lockedView = document.getElementById('profileLockedView');
  const unlockedView = document.getElementById('profileUnlockedView');
  if(!lockedView || !unlockedView) return;

  if(currentUser){
    lockedView.classList.add('hidden');
    unlockedView.classList.remove('hidden');
    document.getElementById('profileAvatarImg').src = avatarUrl(currentUser.avatar_seed);
    document.getElementById('profileAvatarWrap').className = vipFrameClass(currentUser.frame_style);
    document.getElementById('profileUsernameText').innerText = currentUser.username;
    document.getElementById('profileVerifiedBadge').classList.toggle('hidden', !currentUser.is_verified);
    const vip = isVipActive(currentUser);
    document.getElementById('profileCard').classList.remove('theme-fire','theme-neon','theme-royal','theme-dark');
    if(vip && currentUser.card_theme && currentUser.card_theme !== 'default'){
      document.getElementById('profileCard').classList.add('theme-' + currentUser.card_theme);
    }
    document.getElementById('vipPricingWrap').classList.toggle('hidden', vip);
    document.getElementById('vipActiveStatusWrap').classList.toggle('hidden', !vip);
    document.getElementById('vipRedeemSubText').innerText = vip
      ? 'کۆدێکی تر بنووسە بۆ زیادکردنی ماوەکەت'
      : 'ئیتارەی تایبەت، ڕەنگی کارتی لۆبی، هێمای پشتڕاستکراوی و زیاتر';
    document.getElementById('profileVipStatusRow').classList.toggle('hidden', !vip);
    document.getElementById('vipCustomizeSection').classList.toggle('vip-locked', !vip);
    document.getElementById('vipLockBadge').classList.toggle('hidden', vip);
    if(vip){
      const daysLeft = Math.max(0, Math.ceil((new Date(currentUser.vip_until) - new Date())/(24*60*60*1000)));
      document.getElementById('profileVipDaysLeft').innerText = `${daysLeft} ڕۆژ ماوە`;
    }
    renderVipAvatarGrid();
    renderVipThemeRow();
    renderVipCardThemeRow();
    renderCardBgUI();
    const vTog = document.getElementById('vipVerifiedToggle');
    if(vTog) vTog.checked = !!currentUser.is_verified;
  } else {
    lockedView.classList.remove('hidden');
    unlockedView.classList.add('hidden');
    document.getElementById('vipPricingWrap').classList.remove('hidden');
    document.getElementById('vipRedeemInputWrap').classList.remove('hidden');
    document.getElementById('vipActiveStatusWrap').classList.add('hidden');
    document.getElementById('vipCustomizeSection').classList.add('vip-locked');
    document.getElementById('vipLockBadge').classList.remove('hidden');
    document.getElementById('authUsername').value = '';
    document.getElementById('authPassword').value = '';
    switchAuthTab('login');
  }
}
window.addEventListener('load', () => setTimeout(loadUserSession, 300));

/* ══════════════════════════════════════
   DADGA SYSTEM
══════════════════════════════════════ */
let dadgaTieNames = [];
let dadgaAccusedList = [];
let dadgaPhase3Queue = [];
let dadgaVotes = {};       // { voterName: suspectName }
let dadgaCurrentVoterIdx = 0;
let dadgaAccused = '';     // کەی زیاتر دەنگی وەرگرت

function openDadga() {
  saveGameStats();
  dadgaVotes = {};
  dadgaCurrentVoterIdx = 0;
  dadgaAccused = '';
  dadgaTieNames = [];        // ← ئەمە زیاد بکە
  dadgaAccusedList = [];     // ← ئەمەش
  dadgaPhase3Queue = [];     // ← ئەمەش

  // داتای screen5 پڕ بکەوە بەبێ نیشاندان
  document.getElementById('wordRevealText').innerText = gameWord;
  document.getElementById('wordRevealCat').innerText = 'جۆری وشەکە: ' + selectedCategory;

  const spyCardsEl = document.getElementById('spyCards');
  spyCardsEl.innerHTML = '';
  if (spyIndexes.length === 0) {
    spyCardsEl.innerHTML = `<div class="no-spies-badge">سیخور نەدۆزرایەوە</div>`;
  } else {
    spyIndexes.forEach((idx, i) => {
      const div = document.createElement('div');
      const theme = getPlayerCardTheme(players[idx]);
      div.className = 'spy-card'+(theme?' '+theme:'');
      div.style.animationDelay = (i * 0.12) + 's';
      const bgS2=getPlayerCardBgStyle(players[idx]); if(bgS2) div.style.cssText+=bgS2;
      div.innerHTML = `
        <div class="spy-avatar-wrap"><img src="${getPlayerAvatarUrl(players[idx], playerAvatarIndexes[idx])}" width="60" height="60"></div>
        <div class="spy-card-info">
          <div class="spy-card-name">${players[idx]}</div>
          <div class="spy-card-tag"><svg viewBox="0 0 24 24"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/></svg>سیخور</div>
        </div>
        <div class="spy-shield"><svg viewBox="0 0 24 24"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/></svg></div>`;
      spyCardsEl.appendChild(div);
    });
  }

  document.getElementById('dadgaPhase1').classList.remove('hidden');
  document.getElementById('dadgaPhase2').classList.add('hidden');
  document.getElementById('dadgaPhase3').classList.add('hidden');
  document.getElementById('dadgaPhase4').classList.add('hidden');

  updateDadgaStep(1);
  renderDadgaVoter();
  showScreen('dadgaScreen');
  
  document.getElementById('dadgaVoteBtn').onclick = function() {
  vib();
  if (dadgaTieNames.length > 0) {
    submitTieVote();
  } else {
    submitVote();
  }
};

}

function closeDadgaToResults() {
  // داتای screen5 پڕ بکەوە
  document.getElementById('wordRevealText').innerText = gameWord;
  document.getElementById('wordRevealCat').innerText = 'جۆری وشەکە: ' + selectedCategory;
  
  showScreen('screen5');
  // کەمێک چاوەڕوانی بکە پاشان خالەکان بکەوە
  updateRoundBtn();
  setTimeout(() => openScores(), 400);
}


function closeDadga() {
  document.getElementById('dadgaOverlay').classList.remove('active');
}

function updateDadgaStep(active) {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('dstep' + i);
    dot.classList.remove('active', 'done');
    if (i < active) dot.classList.add('done');
    else if (i === active) dot.classList.add('active');
  }
  for (let i = 1; i <= 3; i++) {
    const fill = document.getElementById('dline' + i);
    fill.style.width = i < active ? '100%' : '0%';
  }
}

function renderDadgaVoter() {
  const voter = players[dadgaCurrentVoterIdx];
  const avIdx = playerAvatarIndexes[dadgaCurrentVoterIdx];
  document.getElementById('dadgaVoterAvatar').src = getPlayerAvatarUrl(voter, avIdx);
  document.getElementById('dadgaVoterName').innerText = voter;

  // لیستی بەرکەوتەکان — خۆی ناتوانێت بە خۆی دەنگ بدات
  const list = document.getElementById('dadgaSuspectList');
  list.innerHTML = '';
  players.forEach((p, i) => {
    if (i === dadgaCurrentVoterIdx) return;
    const div = document.createElement('div');
    const theme = getPlayerCardTheme(p);
div.className = 'dadga-suspect-item'+getPlayerCardBgClass(p);
    const bgS3=getPlayerCardBgStyle(p); if(bgS3) div.setAttribute('style', bgS3);
    div.id = 'dsusp_' + i;
    div.onclick = () => { vib('light'); selectSuspect(i); };
    div.innerHTML = `
      <div class="dadga-suspect-avatar">
        <img src="${getPlayerAvatarUrl(p, playerAvatarIndexes[i])}" loading="lazy">
      </div>
      <div class="dadga-suspect-name">${p}</div>
      <div class="dadga-suspect-check">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </div>`;
    list.appendChild(div);
  });

  document.getElementById('dadgaVoteBtn').classList.remove('ready');
  document.getElementById('dadgaVoteBtn').dataset.selected = '';
}
let dadgaSelectedIdx = -1;
function selectSuspect(idx) {
  dadgaSelectedIdx = idx;
  document.querySelectorAll('.dadga-suspect-item').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById('dsusp_' + idx);
  if (el) el.classList.add('selected');
  document.getElementById('dadgaVoteBtn').classList.add('ready');
}

function submitVote() {
  if (dadgaSelectedIdx < 0) return;
  const voter = players[dadgaCurrentVoterIdx];
  const suspect = players[dadgaSelectedIdx];
  dadgaVotes[voter] = suspect;
  dadgaSelectedIdx = -1;

  dadgaCurrentVoterIdx++;
  if (dadgaCurrentVoterIdx < players.length) {
    renderDadgaVoter();
  } else {
    showDadgaResult();
  }
}

function showDadgaResult() {
  updateDadgaStep(2);
  document.getElementById('dadgaPhase1').classList.add('hidden');
  document.getElementById('dadgaPhase2').classList.remove('hidden');

  const tally = {};
  players.forEach(p => { tally[p] = 0; });
  Object.values(dadgaVotes).forEach(suspect => {
    tally[suspect] = (tally[suspect] || 0) + 1;
  });

  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const maxVotes = sorted[0][1];

  // کەسانی هەمان دەنگی زیاتر
  const topCandidates = sorted.filter(([_, v]) => v === maxVotes);

  // ئایا هەردووکیان سیخورن؟
  const topSpies = topCandidates.filter(([name]) => spyIndexes.includes(players.indexOf(name)));
  const topCivs = topCandidates.filter(([name]) => !spyIndexes.includes(players.indexOf(name)));

  if (topCandidates.length > 1 && topSpies.length !== topCandidates.length) {
    // دەنگ یەکسانە و هەردووکیان سیخور نین → دووبارە دەنگدان
    dadgaAccused = '';
    dadgaTieNames = topCandidates.map(([name]) => name);

    const card = document.getElementById('dadgaVerdictCard');
    card.className = 'dadga-verdict-card';
    card.style.background = 'linear-gradient(135deg,#111,#2a2a2a)';
    document.getElementById('dadgaVerdictName').innerText = 'دەنگ یەکسانە';
    document.getElementById('dadgaVerdictDesc').innerText = dadgaTieNames.join(' — ') + ' هەرکامیان ' + maxVotes + ' دەنگیان وەرگرت';
    const ico = document.getElementById('dadgaVerdictIcon');
    ico.innerHTML = `<svg viewBox="0 0 24 24"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>`;

    document.getElementById('dadgaTallyList').innerHTML = '';
    const maxV = sorted[0][1] || 1;
    sorted.forEach(([name, count]) => {
      const idx = players.indexOf(name);
      const div = document.createElement('div');
      div.className = 'dadga-tally-row';
      div.innerHTML = `
        <div class="dadga-tally-avatar"><img src="${getPlayerAvatarUrl(name, playerAvatarIndexes[idx])}" loading="lazy"></div>
        <div class="dadga-tally-name">${name}</div>
        <div class="dadga-tally-bar-wrap"><div class="dadga-tally-bar" style="width:${(count/maxV)*100}%"></div></div>
        <div class="dadga-tally-count">${count}</div>`;
      document.getElementById('dadgaTallyList').appendChild(div);
    });

    // دوگمە بگۆڕە بۆ دووبارە دەنگدان
    document.querySelector('#dadgaPhase2 .dadga-final-again').innerText = 'دووبارە دەنگدان';
    document.querySelector('#dadgaPhase2 .dadga-final-again').onclick = () => { vib(); startTieVote(); };
    return;
  }

  // ئەگەر هەردووکیان سیخورن و دەنگ یەکسانە → هەردووکیان دەستگیر
  if (topSpies.length > 1) {
    dadgaAccusedList = topSpies.map(([name]) => name);
  } else {
    dadgaAccusedList = [sorted[0][0]];
  }
  dadgaAccused = dadgaAccusedList[0];

  const card = document.getElementById('dadgaVerdictCard');
  card.className = 'dadga-verdict-card';
  card.style.background = 'linear-gradient(135deg,#111,#2a2a2a)';
  document.getElementById('dadgaVerdictName').innerText = dadgaAccusedList.join(' — ');
  document.getElementById('dadgaVerdictDesc').innerText = maxVotes + ' دەنگی وەرگرت';
  const ico = document.getElementById('dadgaVerdictIcon');
  ico.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;

  const tallyList = document.getElementById('dadgaTallyList');
  tallyList.innerHTML = '';
  const maxV = sorted[0][1] || 1;
  sorted.forEach(([name, count]) => {
    const idx = players.indexOf(name);
    const div = document.createElement('div');
    div.className = 'dadga-tally-row';
    div.innerHTML = `
      <div class="dadga-tally-avatar"><img src="${getPlayerAvatarUrl(name, playerAvatarIndexes[idx])}" loading="lazy"></div>
      <div class="dadga-tally-name">${name}</div>
      <div class="dadga-tally-bar-wrap"><div class="dadga-tally-bar" style="width:${(count/maxV)*100}%"></div></div>
      <div class="dadga-tally-count">${count}</div>`;
    tallyList.appendChild(div);
  });

  document.querySelector('#dadgaPhase2 .dadga-final-again').innerText = 'بریاری دادگا';
  document.querySelector('#dadgaPhase2 .dadga-final-again').onclick = () => { vib(); showDadgaNextStep(); };
}



function goToPhase3() {
  const accusedIdx = players.indexOf(dadgaAccused);
  const isSpy = spyIndexes.includes(accusedIdx);

  if (!isSpy) {
    // بێتاوانە دەستگیرکرا — سیخور براوە بەبێ شانس
    showDadgaFinal(false);
    return;
  }

  // سیخور دەستگیرکرا — شانسی ئاخری
  updateDadgaStep(3);
  document.getElementById('dadgaPhase2').classList.add('hidden');
  document.getElementById('dadgaPhase3').classList.remove('hidden');

  document.getElementById('dadgaSpyAvatar').src = getPlayerAvatarUrl(dadgaAccused, playerAvatarIndexes[accusedIdx]);
  document.getElementById('dadgaSpyRevealName').innerText = dadgaAccused;
  document.getElementById('dadgaGuessInput').value = '';
}

function showDadgaFinal(spyWins) {
  awardPoints(spyWins);
  updateDadgaStep(4);
  document.getElementById('dadgaPhase3').classList.add('hidden');
  document.getElementById('dadgaPhase4').classList.remove('hidden');

  const hero = document.getElementById('dadgaFinalHero');
  hero.className = 'dadga-final-hero ' + (spyWins ? 'spy-wins' : 'citizens-win');

  const ico = document.getElementById('dadgaFinalTrophyIcon');
  if (spyWins) {
    ico.innerHTML = `<path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/>`;
    document.getElementById('dadgaFinalTitle').innerText = 'سیخور براوەیە';
    document.getElementById('dadgaFinalSub').innerText = 'سیخور لەلێکۆڵینەوە دەرچوو - ئازادکرا !';
  } else {
    ico.innerHTML = `<path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>`;
    document.getElementById('dadgaFinalTitle').innerText = 'یاریزانی ئاسایی براوەیە';
    document.getElementById('dadgaFinalSub').innerText = 'سیخور دەستگیرکرا !';
  }
setTimeout(() => {
    showScreen('screen5');
    setTimeout(() => openScores(), 600);
  }, 2500);
}

function showDadgaNextStep() {
  const card = document.getElementById('dadgaVerdictCard');
  card.style.background = '';

  // queue دروست بکە بۆ سیخورەکان
  dadgaPhase3Queue = dadgaAccusedList.filter(name =>
    spyIndexes.includes(players.indexOf(name))
  );

  if (dadgaPhase3Queue.length === 0) {
    // بێتاوانە دەستگیرکرا
    card.className = 'dadga-verdict-card innocent';
    const ico = document.getElementById('dadgaVerdictIcon');
    ico.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z"/></svg>`;
    document.getElementById('dadgaVerdictDesc').innerText = 'بێتاوانە دەستگیرکرا — سیخور ئازادە';
    setTimeout(() => showDadgaFinal(true), 1200);
  } else {
    // سیخور دۆزرایەوە — بە نۆبە شانسی ئاخری
    card.className = 'dadga-verdict-card guilty';
    const ico = document.getElementById('dadgaVerdictIcon');
    ico.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/></svg>`;
    document.getElementById('dadgaVerdictDesc').innerText = 'سیخور دۆزرایەوە';
    setTimeout(() => nextPhase3Spy(), 1200);
  }
}

function nextPhase3Spy() {
  if (dadgaPhase3Queue.length === 0) {
    // هەموو سیخورەکان تێپەڕان — یاریزانی ئاسایی براوە
    showDadgaFinal(false);
    return;
  }

  const spyName = dadgaPhase3Queue.shift();
  const spyIdx = players.indexOf(spyName);

  updateDadgaStep(3);
  document.getElementById('dadgaPhase2').classList.add('hidden');
  document.getElementById('dadgaPhase3').classList.remove('hidden');
  const spyTheme = getPlayerCardTheme(spyName);
  document.getElementById('dadgaSpyRevealCard').className = 'dadga-spy-reveal'+(spyTheme?' '+spyTheme:'');
  document.getElementById('dadgaSpyAvatar').src = getPlayerAvatarUrl(spyName, playerAvatarIndexes[spyIdx]);
  document.getElementById('dadgaSpyRevealName').innerText = spyName;
  document.getElementById('dadgaGuessInput').value = '';
  const spyCardEl = document.getElementById('dadgaSpyRevealCard');
  if(spyCardEl){
    spyCardEl.className = 'dadga-spy-reveal'+getPlayerCardBgClass(spyName);
    spyCardEl.setAttribute('style', getPlayerCardBgStyle(spyName));
  }
}

function checkSpyGuess(adminSaysCorrect) {
  const input = document.getElementById('dadgaGuessInput').value.trim();
  
  const normalize = s => s
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ە')
    .replace(/\u200c/g, '')
    .replace(/\u200d/g, '');
  
  const correct = normalize(input) === normalize(gameWord);
  
  document.getElementById('dadgaGuessInput').value = correct ? '✓ راستە' : '✗ هەڵەیە';
  document.getElementById('dadgaGuessInput').disabled = true;
  
  setTimeout(() => {
    document.getElementById('dadgaGuessInput').disabled = false;
    document.getElementById('dadgaGuessInput').value = '';
    
    if (correct) {
      if (dadgaPhase3Queue.length > 0) {
        document.getElementById('dadgaPhase3').classList.add('hidden');
        document.getElementById('dadgaPhase2').classList.remove('hidden');
        nextPhase3Spy();
      } else {
        showDadgaFinal(true);
      }
    } else {
      showDadgaFinal(false);
    }
  }, 1200);
}



function startTieVote() {
  dadgaVotes = {};
  dadgaCurrentVoterIdx = 0;
  updateDadgaStep(1);
  document.getElementById('dadgaPhase2').classList.add('hidden');
  document.getElementById('dadgaPhase1').classList.remove('hidden');
  renderTieVoter();
}


function renderTieVoter() {
  const voter = players[dadgaCurrentVoterIdx];
  document.getElementById('dadgaVoterAvatar').src = getPlayerAvatarUrl(players[dadgaCurrentVoterIdx], playerAvatarIndexes[dadgaCurrentVoterIdx]);
  document.getElementById('dadgaVoterName').innerText = voter;
  dadgaSelectedIdx = -1;
  document.getElementById('dadgaVoteBtn').classList.remove('ready');

  const list = document.getElementById('dadgaSuspectList');
  list.innerHTML = '';

  // تەنها ئەو دوو کەسە نیشان بدە کە دەنگیان یەکسان بوو
  dadgaTieNames.forEach(name => {
    if (name === voter) return;
    const idx = players.indexOf(name);
    const div = document.createElement('div');
    div.className = 'dadga-suspect-item'+getPlayerCardBgClass(name);
    const bgS4=getPlayerCardBgStyle(name); if(bgS4) div.setAttribute('style', bgS4);
    div.id = 'dsusp_' + idx;
    div.onclick = () => { vib('light'); selectSuspect(idx); };
    div.innerHTML = `
      <div class="dadga-suspect-avatar"><img src="${getPlayerAvatarUrl(name, playerAvatarIndexes[idx])}" loading="lazy"></div>
      <div class="dadga-suspect-name">${name}</div>
      <div class="dadga-suspect-check">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </div>`;
    list.appendChild(div);
  });
}


function submitTieVote() {
  if (dadgaSelectedIdx < 0) return;
  const voter = players[dadgaCurrentVoterIdx];
  const suspect = players[dadgaSelectedIdx];
  dadgaVotes[voter] = suspect;
  dadgaSelectedIdx = -1;

  dadgaCurrentVoterIdx++;
  if (dadgaCurrentVoterIdx < players.length) {
    renderTieVoter();
  } else {
    showDadgaResult();
  }
}

/* ══════════════════════════════════════
   SCORES SYSTEM
══════════════════════════════════════ */
let lastRoundPoints = {}; // خالی ئەم خولە تەنها

function loadScores() {
  return JSON.parse(localStorage.getItem('sexur_scores') || '{}');
}
function saveScores(data) {
  localStorage.setItem('sexur_scores', JSON.stringify(data));
}
function getTotalRounds() {
  return parseInt(localStorage.getItem('sexur_rounds') || '0');
}

function awardPoints(spyWon) {
  const scores = loadScores();
  lastRoundPoints = {};

  if (spyWon) {
    spyIndexes.forEach(idx => {
      const name = players[idx];
      scores[name] = (scores[name] || 0) + 3;
      lastRoundPoints[name] = 3;
    });
  } else {
    players.forEach((name, idx) => {
      if (!spyIndexes.includes(idx)) {
        scores[name] = (scores[name] || 0) + 2;
        lastRoundPoints[name] = 2;
      }
    });
  }

  // خالی -1 بۆ دەنگی هەڵە
  Object.entries(dadgaVotes).forEach(([voter, suspect]) => {
    const suspectIdx = players.indexOf(suspect);
    const isSuspectSpy = spyIndexes.includes(suspectIdx);
    const voterIdx = players.indexOf(voter);
    const isVoterSpy = spyIndexes.includes(voterIdx);

    if (!isSuspectSpy && !isVoterSpy) {
      // -1 بۆ دەنگەری هەڵە
      scores[voter] = (scores[voter] || 0) - 1;
      lastRoundPoints[voter] = (lastRoundPoints[voter] || 0) - 1;

      // +1 بۆ هەر سیخورێک
      spyIndexes.forEach(spyIdx => {
        const spyName = players[spyIdx];
        scores[spyName] = (scores[spyName] || 0) + 0;
        lastRoundPoints[spyName] = (lastRoundPoints[spyName] || 0) + 0;
      });
    }
  });


  const rounds = getTotalRounds() + 1;
  localStorage.setItem('sexur_rounds', rounds);
  saveScores(scores);
}


function openScores() {
  renderScores();
  updateRoundBtn();
  document.getElementById('scoresResetBtn').classList.remove('hidden');
  document.getElementById('scoresOverlay').classList.add('active');
}

function closeScores() {
  document.getElementById('scoresOverlay').classList.remove('active');
}
function closeScoresOutside(e) {
  if (e.target === document.getElementById('scoresOverlay')) {
    vib(); closeScores();
  }
}

function renderScores() {
  const scores = loadScores();
  const rounds = getTotalRounds();
  document.getElementById('scoresRoundBadge').innerText = `خول ${rounds}`;

  // تەنها یاریزانانی ئێستا نیشان بدە + یاریزانی کۆن کە خالیان هەیە
  const allNames = new Set([...players, ...Object.keys(scores)]);
  const sorted = [...allNames]
    .map(name => ({ name, pts: scores[name] || 0 }))
    .sort((a, b) => b.pts - a.pts);

  const list = document.getElementById('scoresList');
  list.innerHTML = '';

  sorted.forEach((p, i) => {
    const rank = i + 1;
    const rankClass = rank <= 3 ? ` rank-${rank}` : '';
    const rankSymbol = rank === 1 ? '١' : rank === 2 ? '٢' : rank === 3 ? '٣' : rank + '';
    const newPts = lastRoundPoints[p.name];
    const avSrc = statPlayerAvatarUrl(p.name);
    const div = document.createElement("div");
    div.className = 'scores-row' + rankClass;
    div.style.animationDelay = (i * 0.06) + 's';
    div.innerHTML = `
  ${newPts !== undefined && newPts !== 0 ? `<div class="scores-new-pts" style="${newPts < 0 ? 'background:linear-gradient(135deg,#ff3b3b,#c62828);box-shadow:0 3px 10px rgba(255,59,59,.35);' : newPts >= 2 ? 'background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 3px 10px rgba(34,197,94,.35);' : 'background:linear-gradient(135deg,#ffd400,#ffbc00);color:#111;box-shadow:0 3px 10px rgba(255,188,0,.35);'}">${newPts > 0 ? '+' : ''}${newPts}${newPts < 0 ? ' ✗' : ' ✓'}</div>` : ''}
      <div class="scores-rank">${rankSymbol}</div>
         <div class="scores-avatar">
        <img src="${avSrc}" loading="lazy">
      </div>
      <div class="scores-name">${p.name}</div>
      <div class="scores-pts-wrap">
        <div class="scores-pts">${p.pts}</div>
        <div class="scores-pts-label">خال</div>
      </div>`;
    list.appendChild(div);
  });
}

async function confirmResetScores() {
  const yes = await showModal({
    title: "سرینەوەی خالەکان",
    msg: "دڵنیایت؟ هەموو خالەکان دەسڕێتەوە.",
    icon: "danger",
    dangerConfirm: true
  });
  if (yes) {
    localStorage.removeItem('sexur_scores');
    localStorage.removeItem('sexur_rounds');
    lastRoundPoints = {};
    renderScores();
    vib('success');
  }
}

document.getElementById('scoresResetBtn')
  .addEventListener('click', async () => {
    vib('heavy');
    closeScores();
    await new Promise(r => setTimeout(r, 300));
    await confirmResetScores();
  });

/* ══ HINT SYSTEM ══ */
const hintMessages = [
  "سیخور لەنێوتانە... بەڵام کێیە؟",
  "هەموو کەسێک گوماناویە .",
  "کێ زۆر ئارامە؟",
  "کێ زۆر قسە دەکات؟",
  "سیخور هەوڵی فریودان دەدات.",
  "چاوتان لە پێکەنینە ساختەکان بێت.",
  "یەکێک لێرە ڕاستی ناڵێت.",
  "سیخور لەناو کۆمەڵەکەدا ون بووە.",
  "هەندێک جار بێدەنگی گومانە.",
  "هەندێک جار قسەی زۆریش گومانە.",
  "کێ خێراتر وەڵام دەدات؟",
  "کێ زۆر بیر دەکاتەوە پێش وەڵامدان؟",
  "سیخور دەزانێت وشەکە چییە.",
  "ئایا هەمووان بێتاوانن؟",
  "گومانەکان زیاد دەبن.",
  "سیخور ئێستا تەماشاتان دەکات.",
  "کێ زۆر دڵنیایە لە خۆی؟",
  "هەستەکانتان پشتگوێ مەخە.",
  "سیخور هەوڵی تێکدانی یاریەکە دەدات.",
  "وەسفە دوورەکان سیخور دەردەخەن.",
  "کێ هەوڵی گۆڕینی بابەتەکە دەدات؟",
  "لەوانەیە سیخور پێبکەنێت ئێستا.",
  "هەموو چاوەکان شتێک دەڵێن.",
  "کێ زیاد لە پێویست بەرگری لە خۆی دەکات؟",
  "سیخور نزیکترە لەوەی دەزانیت.",
  "یەک هەڵە، = ئاشکراکردن.",
  "کێ هەوڵی سەرنج ڕاکێشان دەدات؟",
  " سیخور ئێستا قسە دەکات؟",
  "گومانەکان هەمیشە سیخور نییە.",
  "سیخور زۆر زیرەکە.",
  "کێ خۆی زۆر بێتاوان پیشان دەدات؟",
  "شتێک ئاسایی نییە.",
  "سیخور چاوەڕێی هەڵەیەکە.",
  "گوێ لد وشەکان مەگرن، کردارەکان تەماشا بکەن.",
  "کێ هەوڵی ئارامکردنەوەی هەمووان دەدات؟",
  "ئایا گومانەکانتان لە شوێنی دروستن؟",
  "سیخور ئێستا دڵخۆشە.",
  "هەموو شتێک ئاساییە.",
  "کێ هەر زوو ناوی کەسێک دەهێنێت؟",
  "لەوانەیە سیخور لەو کەسانە بێت کە کەمترین گومانیان لێ دەکرێت."
];

function getHintMessages() {
  const personal = [];
  const usedNames = new Set();
  
  players.forEach(name => {
    if (usedNames.has(name)) return;
    usedNames.add(name);
    personal.push(` « ${name} » شتێک دەشارێتەوە؟`);
personal.push(`گومانەکان ئێستا لە دەوری « ${name} » دەسوڕێنەوە.`);
personal.push(`« ${name} » زۆر ئارامە...`);
personal.push(`کەس دڵنیانیە لە « ${name} ».`);
personal.push(`ئەم خولە « ${name} » جیاواز دیارە.`);
personal.push(`هەموو شتێک ئاساییە... یان نا، « ${name} »؟`);
personal.push(`چاوتان لە « ${name} » بێت.`);
personal.push(`« ${name} » گوماناوی دیارە.`);
personal.push(` « ${name} » هەست دەکەم زۆر زانیاری نییە؟`);
personal.push(`« ${name} » بەردەوام پێدەکەنێت 😏`);
personal.push(`شتێکی « ${name} » ئاسایی نییە.`);
personal.push(`« ${name} » زۆر بێدەنگە.`);
personal.push(`هەست دەکەم « ${name} » شتێک بزانێت.`);
personal.push(`نازانم سیقە بە « ${name} » بکەم یان نا؟`);
personal.push(`« ${name} » لە ژێر چاودێریی خۆمە.`);
personal.push(`گومانەکە بەرەو « ${name} » دەڕوات.`);
personal.push(`« ${name} » هەوڵی شاردنەوە دەدات.`);
personal.push(`« ${name} » زۆر بە خێرایی وەڵام دەدات.`);
personal.push(`ئەم وەسفەی « ${name} » سەیرە.`);
personal.push(`« ${name} » هێشتا سەرنجی هەمووانی ڕاکێشاوە.`);
personal.push(` « ${name} » بێتاوانە؟ 🤔`);
personal.push(`« ${name} » زۆر دڵنیایە لە خۆی.`);
personal.push(`هەمووان دەڕواننە « ${name} ».`);
personal.push(`« ${name} » بە سادەیی ناتوانێت دەرباز بێت 😈`);
personal.push(`ئەمجارە ناوی « ${name} » زیاتر دەبیستم.`);
personal.push(`« ${name} » شتێک لە مێشکی هەیە.`);
personal.push(` « ${name} » سیناریۆ دەکات؟ 🎭`);
personal.push(`« ${name} »  منادڵیت پاکە ئممم.`);
personal.push(` مورتاح نیمە کاتێک « ${name} » قسەدەکات.`);
personal.push(`« ${name} » گوماناوی ترین کەسی ئەم خولەیە.`);
  });
  
  return [...hintMessages, ...personal];
}


let hintInterval = null;
let hintShowing = false;
let starterPlayerName = '';

function startHintSystem(playerName) {
  starterPlayerName = playerName;
  clearInterval(hintInterval);
  const wrap = document.getElementById('hintAvatarWrap');
  wrap.classList.add('hidden');
  hintShowing = false;

  setTimeout(() => {
    showNextHint();
    hintInterval = setInterval(showNextHint, 30000);
  }, 3000);
}

function showNextHint() {
  const wrap = document.getElementById('hintAvatarWrap');
  const dots = document.getElementById('hintDots');
  const text = document.getElementById('hintText');

  const allHints = getHintMessages();
  const msg = allHints[Math.floor(Math.random() * allHints.length)];

  wrap.classList.remove('hidden');
  wrap.style.animation = 'none';
  void wrap.offsetWidth;
  wrap.style.animation = '';

  dots.classList.remove('hidden');
  text.classList.add('hidden');
  text.innerText = '';

  setTimeout(() => {
    dots.classList.add('hidden');
    text.classList.remove('hidden');
    typeText(text, msg);
  }, 5000);
}

function typeText(el, msg) {
  el.innerHTML = '';
  el.style.direction = 'rtl';
  el.style.textAlign = 'right';
  let i = 0;
  const chars = [...msg];
  const interval = setInterval(() => {
    if (i < chars.length) {
      el.innerHTML = '<span style="direction:rtl;unicode-bidi:embed;display:inline;">' 
        + chars.slice(0, i + 1).join('') 
        + '</span>';
      i++;
    } else {
      clearInterval(interval);
    }
  }, 60);
}



function stopHintSystem() {
  clearInterval(hintInterval);
  hintInterval = null;
  const wrap = document.getElementById('hintAvatarWrap');
  if (wrap) wrap.classList.add('hidden');
}

/* ══ CONFETTI ══ */
const CONFETTI_COLORS = ['#ffd400','#ff3b3b','#22c55e','#6366f1','#f97316','#ec4899','#111'];

function launchConfetti(count = 120) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        background: ${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
        width: ${6 + Math.random() * 10}px;
        height: ${6 + Math.random() * 10}px;
        border-radius: ${Math.random() > .5 ? '50%' : '2px'};
        animation-duration: ${1.5 + Math.random() * 2.5}s;
        animation-delay: ${Math.random() * .5}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, i * 18);
  }
}

/* ══ GAME OVER ══ */
function showGameover() {
  const scores = loadScores();

  // بەرزترین خاڵ
  const topEntry = Object.entries(scores)
    .filter(([name]) => players.includes(name))
    .sort((a, b) => b[1] - a[1])[0];

  // sub text
  document.getElementById('gameoverSub').innerText =
    `${totalRounds} خول تەواو بوو — جەنگاوەر و پاڵەوانی خولەکە دیاری کرا!`;

  // بەرزترین یاریزان
  const winnerEl = document.getElementById('gameoverWinner');
  if (topEntry) {
    const [name, pts] = topEntry;
    winnerEl.innerHTML = `
      <div class="gameover-winner-avatar">
        <img src="${statPlayerAvatarUrl(name)}">
      </div>
      <div class="gameover-winner-info">
        <div class="gameover-winner-label">🏆 براوەی یاری</div>
        <div class="gameover-winner-name">${name}</div>
      </div>
      <div class="gameover-winner-pts">${pts}</div>`;
  } else {
    winnerEl.innerHTML = '';
  }

  document.getElementById('gameoverOverlay').classList.add('active');
  launchConfetti(150);
  vib('success');
}

function closeGameover() {
  document.getElementById('gameoverOverlay').classList.remove('active');
}

/* ══ ROUND SYSTEM ══ */
let currentRound = 1;
let totalRounds = 1;

function startCards() {
  if (selectedCategories.length === 0 && customWords.length === 0) {
    vib('error');
    showModal({title:"لیستی وشە هەڵبژێرە", msg:"تکایە لانیکەم یەک وشە هەڵبژێرە.", icon:"warn"});
    return;
  }
  totalRounds = parseInt(document.getElementById('roundCount').value);
  currentRound = 1;
  prepareGame();
  showScreen("screen3");
  showPlayer();
}

function playAgain() {
  currentRound++;
  if (currentRound > totalRounds) {
    setTimeout(() => showGameover(), 400);
    return;
  }
  prepareGame();
  updateRoundBtn();
  showScreen("screen3");
  showPlayer();
}

function updateRoundBtn() {
  const btn = document.getElementById('playAgainBtn');
  if (!btn) return;
  if (currentRound >= totalRounds) {
    btn.innerText = `کۆتایی یاری — خولی ${totalRounds}`;
    btn.style.background = '#111';
    btn.style.color = '#ffd400';
  } else {
    btn.innerText = `خولی ${currentRound + 1} / ${totalRounds}`;
    btn.style.background = '';
    btn.style.color = '';
  }
}

function showStarter() {
  showScreen("screen4");
  if(starterBag.length === 0) starterBag = shuffleArray(players.map((_,i)=>i));
  const starter = starterBag.shift();
  document.getElementById("starterName").innerText = players[starter];
  document.getElementById("starterAvatar").src = getPlayerAvatarUrl(players[starter], playerAvatarIndexes[starter]);
  const titleEl = document.getElementById("screen4").querySelector(".title");
  if (titleEl) titleEl.innerText = `خولی ${currentRound} / ${totalRounds}`;
  resetTimerUI();
}
const SUPABASE_URL = "https://gvfpapyeepfkngwzfjmc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Qu-rqw7AxsfpHKuCs1XQnw_0zbX25t2";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── client_id نەگۆڕ بۆ هەر ئامێرێک ── */
function getClientId(){
  let id = localStorage.getItem('sexur_client_id');
  if(!id){
    id = 'c_' + Math.random().toString(36).slice(2,10) + Date.now().toString(36);
    localStorage.setItem('sexur_client_id', id);
  }
  return id;
}
const CLIENT_ID = getClientId();

/* Fisher-Yates shuffle — هەڕەمەکی دروست، بەبێ لایەنگری */
/* Fisher-Yates shuffle — هەڕەمەکی دروست، بەبێ لایەنگری */
function shuffleArray(arr){
  const a = [...arr];
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── هەڵگرتنی سیشنی ئۆنڵاین بۆ گەڕانەوە دوای بڕانی نێت ── */
function saveOnlineSession(code){
  localStorage.setItem('sexur_online_room', code);
}
function clearOnlineSession(){
  localStorage.removeItem('sexur_online_room');
}

async function reconnectOnlineSession(){
  const savedCode = localStorage.getItem('sexur_online_room');
  if(!savedCode) return;

  try{
    const { data: room } = await sb.from('rooms').select('*').eq('code', savedCode).maybeSingle();
    if(!room){ clearOnlineSession(); return; }

    const { data: myRow } = await sb.from('room_players').select('*').eq('room_code', savedCode).eq('client_id', CLIENT_ID).maybeSingle();
    if(!myRow){ clearOnlineSession(); return; } // کراوە بە kick یان ژوورەکە بەجێهێشتووە

    onlineRoomCode = savedCode;
    isHost = !!myRow.is_host;
    roomIsPublic = !!room.is_public;
    currentRoomMaxPlayers = room.max_players || 10;
    gameMode = 'online';
    document.getElementById('modeOffline').classList.remove('active');
    document.getElementById('modeOnline').classList.add('active');

    subscribeRoom();
    await refreshLobbyPlayers();
    startPingLoop();
    fetchChampionRanks();

    if(room.status === 'lobby'){
      document.getElementById('lobbyRoomCode').innerText = onlineRoomCode;
      document.getElementById('lobbyHostControls').classList.toggle('hidden', !isHost);
      document.getElementById('lobbyWaitMsg').classList.toggle('hidden', isHost);
      showScreen('onlineLobbyScreen');
      showChatFab();
    } else if(room.status === 'playing'){
      if(room.round_start_at) showOnlineTimerScreen(room);
      else showOnlineCard(room);
    } else if(room.status === 'voting'){
      showOnlineVoting(room);
    } else if(room.status === 'reveal'){
      showOnlineReveal(room);
    }

    vib('success');
  }catch(e){
    clearOnlineSession();
  }
}

window.addEventListener('load', () => { setTimeout(reconnectOnlineSession, 1200); });

/* ── پێداچوونەوەی خێرایی ئینتەرنێت (ping) ── */
let pingInterval = null;
let lastPingValue = 0;

async function measurePing(){
  try{
    const start = performance.now();
    await fetch(SUPABASE_URL + '/rest/v1/', { method:'HEAD', headers:{ apikey: SUPABASE_ANON_KEY } });
    const ms = Math.round(performance.now() - start);
    lastPingValue = ms;
    if(onlineRoomCode){
      await sb.from('room_players').update({ ping_ms: ms, last_seen_at: new Date().toISOString() }).eq('room_code', onlineRoomCode).eq('client_id', CLIENT_ID);
    }
  }catch(e){ /* بێدەنگ - ئینتەرنێت لادراوە */ }
}

function startPingLoop(){
  stopPingLoop();
  measurePing();
  pingInterval = setInterval(measurePing, 5000);
  startPresenceCheck();
}
function stopPingLoop(){
  clearInterval(pingInterval);
  pingInterval = null;
  stopPresenceCheck();
}

/* ══════════════════════════════════════
   DISCONNECT + HOST TRANSFER SYSTEM
══════════════════════════════════════ */
const STALE_MS = 30000;      // ٣٠ چرکە → دیسکۆنێکت
const HOST_STALE_MS = 45000; // ٤٥ چرکە → هۆست چالاک نییە
const ALL_STALE_MS = 120000; // ٢ خولەک → هەموویان چالاک نین

let presenceCheckInterval = null;

function startPresenceCheck(){
  stopPresenceCheck();
  presenceCheckInterval = setInterval(checkPresence, 5000);
}
function stopPresenceCheck(){
  clearInterval(presenceCheckInterval);
  presenceCheckInterval = null;
}

function isStale(lastSeenAt, thresholdMs){
  if(!lastSeenAt) return false;
  return (Date.now() - new Date(lastSeenAt).getTime()) > thresholdMs;
}

function updateDisconnectedDom(clientId, disconnected){
  document.querySelectorAll(`.ready-slot[data-client="${clientId}"]`).forEach(el=>{
    el.classList.toggle('is-disconnected', disconnected);
  });
  document.querySelectorAll(`[data-player-row="${clientId}"]`).forEach(el=>{
    el.classList.toggle('is-disconnected', disconnected);
  });
}

function refreshHostUI(){
  document.getElementById('lobbyHostControls')?.classList.toggle('hidden', !isHost);
  document.getElementById('lobbyWaitMsg')?.classList.toggle('hidden', isHost);
  document.getElementById('onlineForceStartBtn')?.classList.toggle('hidden', !isHost);
  document.getElementById('onlineTimerControlsHost')?.classList.toggle('hidden', !isHost);
  document.getElementById('onlineTimerWaitMsg')?.classList.toggle('hidden', isHost);
  document.getElementById('resumeBtnMain')?.classList.toggle('hidden', !isHost);
  document.getElementById('resumeWaitText')?.classList.toggle('hidden', isHost);
}

async function checkPresence(){
  if(!onlineRoomCode || !onlinePlayers.length) return;

  onlinePlayers.forEach(p=>{
    updateDisconnectedDom(p.client_id, isStale(p.last_seen_at, STALE_MS));
  });

  const { data: room } = await sb.from('rooms').select('host_client_id,status').eq('code', onlineRoomCode).maybeSingle();
  if(!room) return;

  /* هاوکاتکردنی isHost لای خۆم بەپێی داتابەیس — چارەسەری کێشەی دوو هۆست */
  if(room.host_client_id !== CLIENT_ID && isHost){
    isHost = false;
    refreshHostUI();
    refreshLobbyPlayersUI();
  } else if(room.host_client_id === CLIENT_ID && !isHost){
    isHost = true;
    refreshHostUI();
    refreshLobbyPlayersUI();
  }

  const hostPlayer = onlinePlayers.find(p=>p.client_id === room.host_client_id);
  if(!hostPlayer) return;

  const hostStale = isStale(hostPlayer.last_seen_at, HOST_STALE_MS);
  if(!hostStale) return;

  const active = onlinePlayers
    .filter(p => p.client_id !== room.host_client_id && !isStale(p.last_seen_at, STALE_MS))
    .sort((a,b)=> new Date(a.joined_at) - new Date(b.joined_at));

  if(active.length === 0){
    const allStale = onlinePlayers.every(p => isStale(p.last_seen_at, ALL_STALE_MS));
    if(allStale){
      await sb.from('rooms').delete().eq('code', onlineRoomCode);
    }
    return;
  }

  const successor = active[0];
  if(successor.client_id !== CLIENT_ID) return;

  const { error } = await sb.from('rooms')
    .update({ host_client_id: CLIENT_ID })
    .eq('code', onlineRoomCode)
    .eq('host_client_id', room.host_client_id);

  if(!error){
    await sb.from('room_players').update({ is_host: false }).eq('room_code', onlineRoomCode).eq('client_id', room.host_client_id);
    await sb.from('room_players').update({ is_host: true }).eq('room_code', onlineRoomCode).eq('client_id', CLIENT_ID);
    isHost = true;
    vib('success');
    refreshHostUI();
    showModal({title:"بوویت بە خاوەن ژوور", msg:"خاوەنی پێشوو چالاک نەبوو، تۆ ئێستا خاوەنی نوێی ژوورەکەیت.", icon:"ok"});
  }
}

/* ══ JOIN/LEAVE TOAST ══ */
function showJoinToast(name, avatarSeed, type='join'){
  const stack = document.getElementById('joinToastStack');
  if(!stack) return;
  const isJoin = type === 'join';
  const el = document.createElement('div');
  el.className = 'join-toast';
  el.innerHTML = `
    <div class="join-toast-av"><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed||name)}" loading="lazy"></div>
    <div class="join-toast-text"><b>${name}</b> ${isJoin ? 'هاتەژوورەوە 👋' : 'چووەدەرەوە'}</div>`;
  stack.appendChild(el);
  requestAnimationFrame(()=> requestAnimationFrame(()=> el.classList.add('show')));
  setTimeout(()=>{
    el.classList.remove('show');
    setTimeout(()=> el.remove(), 400);
  }, 2600);
}

function pingClass(ms){
  if(ms <= 0) return 'ping-mid';
  if(ms < 150) return 'ping-good';
  if(ms < 400) return 'ping-mid';
  return 'ping-bad';
}

/* تەنها ژمارەی ms نوێ بکەرەوە — بەبێ ری‌ڕێندەری هەموو لیستەکە */
function updatePingDom(clientId, ms){
  const cls = pingClass(ms);
  document.querySelectorAll(`[data-ping="${clientId}"]`).forEach(el=>{
    el.textContent = ms>0 ? ms+' ms' : '...';
    el.classList.remove('ping-good','ping-mid','ping-bad');
    el.classList.add(cls);
  });
}

/* پشکنین: ئایا تەنها ping_ms گۆڕاوە یان زانیاریی تریش گۆڕاوە؟ *//* پشکنین: ئایا تەنها ping_ms گۆڕاوە یان زانیاریی تریش گۆڕاوە؟ */
function isOnlyPingDiff(oldP, newRow){
  if(!oldP) return false;
  const keys = ['name','is_host','avatar_seed','vote_for','score'];
  return keys.every(k => oldP[k] === newRow[k]);
}

/* پشکنین: ئایا تەنها vote_for (ئامادەبوون) گۆڕاوە؟ */
function isOnlyReadyDiff(oldP, newRow){
  if(!oldP) return false;
  const keys = ['name','is_host','avatar_seed','score'];
  return keys.every(k => oldP[k] === newRow[k]);
}

let gameMode = 'offline';
let onlineScoringEnabled = true;
function toggleOnlineScoring(on){
  onlineScoringEnabled = on;
  vib();
  document.getElementById('lobbyScoringOn').classList.toggle('active', on);
  document.getElementById('lobbyScoringOff').classList.toggle('active', !on);
}
let onlineRoomCode = null;
let isHost = false;
let onlinePlayers = [];
let onlineSpyBag = [];
let onlineStarterBag = [];
let roomChannel = null;
let roundTimerInterval = null;
let onlineCardOpened = false;
let onlineSelectedVote = null;
let _onlineGuessSubmitted = false;
let _finalizingLastChance = false;
let onlineLastRoundPoints = {};
let _onlineScoresSnapshot = [];
let _onlineScoresRound = 1;
let lobbyCustomWords = [];
let roomIsPublic = true;

function setRoomPrivacy(isPublic){
  roomIsPublic = isPublic;
  document.getElementById('roomPublicBtn').classList.toggle('active', isPublic);
  document.getElementById('roomPrivateBtn').classList.toggle('active', !isPublic);
  document.getElementById('roomPrivacyHint').innerText = isPublic
    ? 'هەموو کەسێک دەتوانێت ژوورەکەت ببینێت و بچێتە ژوورەوە'
    : 'تەنها ئەوانەی کۆدی ژوورەکەیان هەیە دەتوانن بچنە ژوورەوە';
  document.getElementById('createRoomSub').innerText = isPublic
    ? 'ژوورێکی نوێ دروست بکە و بانگهێشتی هاوڕێیەکانت بکە'
    : 'ژوورێکی تایبەت دروست دەکەیت — کۆدەکە بنێرە بۆ هاوڕێیەکانت';
}

/* ══ CHAT ══ */
const quickChatPhrases = ["گومانم لە یەکێکە 🤔","من بێتاوانم ✋","کێ زۆر بێدەنگە؟","با دەست بکەین!","چاوەڕێ بن...","👍","😂","🤨"];
let chatOpen = false, chatUnread = 0, lastChatSentAt = 0;

function renderChatQuickButtons(){
  const row = document.getElementById('chatQuickRow');
  if(!row) return;
  row.innerHTML = '';
  quickChatPhrases.forEach(p=>{
    const btn = document.createElement('button');
    btn.className = 'chat-quick-btn';
    btn.innerText = p;
    btn.onclick = ()=>{ vib(); sendChatMessage(p); };
    row.appendChild(btn);
  });
}
renderChatQuickButtons();

function showChatFab(){
  document.getElementById('chatFabWrap')?.classList.remove('hidden');
  syncChatMuteUI();
}
function hideChatFab(){
  document.getElementById('chatFabWrap')?.classList.add('hidden');
  document.getElementById('chatPanel')?.classList.remove('open');
  chatOpen = false;
}

async function confirmLeaveOnlineGame(){
  const yes = await showModal({title:"دەرچوون لە یاری", msg:"دڵنیایت لە دەرچوون؟ ناتوانیت بگەڕێیتەوە ئەم یارییە.", icon:"danger", dangerConfirm:true});
  if(!yes) return;
  if(!onlineRoomCode){ showScreen('screen1'); return; }
  const _leftCode2 = onlineRoomCode;
  await sb.from('room_players').delete().eq('room_code', onlineRoomCode).eq('client_id', CLIENT_ID);
  if(isHost) await sb.from('rooms').delete().eq('code', onlineRoomCode);
  else await deleteRoomIfEmpty(_leftCode2);
  if(roomChannel) sb.removeChannel(roomChannel);
  clearInterval(roundTimerInterval);
  stopPingLoop();
  clearOnlineSession();
  onlineRoomCode = null; isHost = false; onlinePlayers = [];
  hideChatFab();
  clearChatMessages();
  vib('success');
  showScreen('screen1');
}
function toggleChatPanel(){
  const panel = document.getElementById('chatPanel');
  chatOpen = !chatOpen;
  panel.classList.toggle('open', chatOpen);

  if(chatOpen){
    chatUnread = 0; updateChatBadge();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    setTimeout(()=>document.getElementById('chatMessages').scrollTop = 999999, 50);
  } else {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    panel.classList.remove('fullscreen');
    chatDragOffset = 0;
    panel.style.transform = '';
  }
}

/* ── ڕاکێشانی چات بۆ فوول سکرین ── */
let chatDragStartY = 0, chatDragging = false, chatDragOffset = 0, chatWasFullscreen = false;

(function initChatDrag(){
  const handle = document.getElementById('chatDragHandle');
  const panel = document.getElementById('chatPanel');
  if(!handle || !panel) return;

  handle.addEventListener('touchstart', e=>{
    chatDragging = true;
    chatDragStartY = e.touches[0].clientY;
    chatWasFullscreen = panel.classList.contains('fullscreen');
    panel.style.transition = 'none';
  }, {passive:true});

  handle.addEventListener('touchmove', e=>{
    if(!chatDragging) return;
    const dy = e.touches[0].clientY - chatDragStartY;
    chatDragOffset = dy;
    if(dy < 0){
      panel.style.transform = `translateY(${Math.max(dy, -window.innerHeight)}px)`;
    } else {
      if(chatWasFullscreen){
        panel.classList.remove('fullscreen');
        chatWasFullscreen = false;
        chatDragStartY = e.touches[0].clientY;
      }
      panel.style.transform = `translateY(${dy}px)`;
    }
  }, {passive:true});

  handle.addEventListener('touchend', ()=>{
    if(!chatDragging) return;
    chatDragging = false;
    panel.style.transition = '';
    panel.style.transform = '';

    if(chatDragOffset < -80){
      panel.classList.add('fullscreen');
      vib('light');
    } else if(chatDragOffset > 100){
      panel.classList.remove('fullscreen');
      toggleChatPanel();
      vib('light');
    }
    chatDragOffset = 0;
  }, {passive:true});
})();
function updateChatBadge(){
  const badge = document.getElementById('chatBadge');
  if(!badge) return;
  badge.classList.toggle('hidden', chatUnread === 0);
  badge.innerText = chatUnread > 9 ? '9+' : chatUnread;
}
function myMuteStatus(){
  const me = onlinePlayers.find(p=>p.client_id===CLIENT_ID);
  return me ? !!me.is_muted : false;
}
function syncChatMuteUI(){
  const muted = myMuteStatus();
  const input = document.getElementById('chatInput');
  if(!input) return;
  input.disabled = muted;
  input.placeholder = muted ? 'میوت کراویت' : 'پەیامێک بنووسە...';
  document.querySelectorAll('.chat-quick-btn').forEach(b=> b.disabled = muted);
  document.getElementById('chatMutedNotice')?.classList.toggle('hidden', !muted);
}
function sendFreeChatMessage(){
  const input = document.getElementById('chatInput');
  const val = input.value.trim();
  if(!val) return;
  sendChatMessage(val);
  input.value = '';
}
const CHAT_COOLDOWN_MS = 3000;
let chatCooldownTimer = null;

function sendChatMessage(text){
  if(!onlineRoomCode || myMuteStatus()) return;
  const now = Date.now();
  if(now - lastChatSentAt < CHAT_COOLDOWN_MS) return;
  lastChatSentAt = now;
  const me = onlinePlayers.find(p=>p.client_id===CLIENT_ID);
  const payload = { clientId: CLIENT_ID, userId: me?me.user_id:null, name: me?me.name:'؟', avatarSeed: me?me.avatar_seed:CLIENT_ID, text: text.slice(0,80), ts: now, isVerified: me?!!me.is_verified:false, frameStyle: me?me.frame_style:'default' };
  roomChannel.send({ type:'broadcast', event:'chat_message', payload });
  appendChatMessage(payload, true);
  startChatCooldownUI(CHAT_COOLDOWN_MS);
}

function startChatCooldownUI(durationMs){
  const btn = document.querySelector('.chat-send-btn');
  const input = document.getElementById('chatInput');
  if(!btn) return;
  clearInterval(chatCooldownTimer);
  let remain = Math.ceil(durationMs/1000);
  const originalIcon = btn.dataset.originalIcon || btn.innerHTML;
  btn.dataset.originalIcon = originalIcon;
  btn.disabled = true;
  if(input) input.disabled = true;
  btn.innerHTML = `<span style="color:#fff;font-size:13px;font-weight:800;">${remain}</span>`;
  chatCooldownTimer = setInterval(()=>{
    remain--;
    if(remain <= 0){
      clearInterval(chatCooldownTimer);
      const muted = myMuteStatus();
      btn.disabled = muted;
      if(input) input.disabled = muted;
      btn.innerHTML = originalIcon;
    } else {
      btn.innerHTML = `<span style="color:#fff;font-size:13px;font-weight:800;">${remain}</span>`;
    }
  }, 1000);
}
function appendChatMessage(payload, isMine){
  const box = document.getElementById('chatMessages');
  if(!box) return;
  const div = document.createElement('div');
  div.className = 'chat-msg' + (isMine ? ' mine' : '');
  const senderMuted = !!onlinePlayers.find(p=>p.client_id===payload.clientId)?.is_muted;
  const muteBtnHtml = (isHost && !isMine)
    ? `<button class="mute-toggle-btn ${senderMuted?'is-muted':''}" data-mute-for="${payload.clientId}"
        style="width:26px;height:26px;border-radius:9px;flex-shrink:0;background:rgba(0,0,0,.05);border:none;display:flex;align-items:center;justify-content:center;"
onclick="vib('medium');toggleMutePlayer('${payload.clientId}')">
        ${senderMuted
          ? '<svg viewBox="0 0 24 24" width="13" height="13"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#c62828" opacity=".35"/><line x1="3" y1="3" x2="21" y2="21" stroke="#c62828" stroke-width="2.4" stroke-linecap="round"/></svg>'
          : '<svg viewBox="0 0 24 24" width="13" height="13" fill="#888"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'
        }</button>`
    : '';
  const champBadge = championBadgeInline(payload.userId);
  const vipNameHtml = payload.isVerified
    ? `<div class="chat-msg-name" style="color:#1877F2;display:flex;align-items:center;gap:4px;">${payload.name}${verifiedBadgeSvg(15)}${champBadge}</div>`
    : `<div class="chat-msg-name">${payload.name}${champBadge}</div>`;
  div.innerHTML = `<div class="chat-msg-avatar ${vipFrameClass(payload.frameStyle)}"><img src="${avatarUrl(payload.avatarSeed)}" loading="lazy"></div>
    <div class="chat-msg-bubble" style="${payload.isVerified ? 'border:1.5px solid rgba(255,212,0,.5);background:linear-gradient(135deg,#fffbe8,#fff5cc);' : ''}">${isMine ? '' : vipNameHtml}<div>${payload.text}</div></div>
    ${muteBtnHtml}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  if(!isMine && !chatOpen){ chatUnread++; updateChatBadge(); vib('light'); }
}
function clearChatMessages(){
  document.getElementById('chatMessages').innerHTML = '';
  chatUnread = 0; updateChatBadge();
}
async function toggleMutePlayer(clientId){
  vib('medium');
  // ── هەمیشە دۆخی ئێستای ڕاستی وەردەگرین لە onlinePlayers، نەک لە پارامیتەری کۆن ──
  const p = onlinePlayers.find(x => x.client_id === clientId);
  const newMuted = !(p && p.is_muted);

  if(p) p.is_muted = newMuted;
  updateMuteDom(clientId, newMuted);
  if(clientId === CLIENT_ID) syncChatMuteUI();

  roomChannel.send({ type:'broadcast', event:'player_muted', payload:{ clientId, muted: newMuted } });

  // هەڵگرتن لە پشتەوە، بەبێ await
  sb.from('room_players').update({ is_muted: newMuted }).eq('room_code', onlineRoomCode).eq('client_id', clientId);
}
function addLobbyCustomWord(){
  const input = document.getElementById('lobbyCustomWordInput');
  const val = input.value.trim();
  if(!val) return;
  if(lobbyCustomWords.includes(val)){
    showModal({title:"هەڵەیە", msg:"ئەم وشەیە هەیە.", icon:"err"});
    return;
  }
  lobbyCustomWords.push(val);
  input.value = '';
  renderLobbyCustomWordTags();
}
function removeLobbyCustomWord(word){
  lobbyCustomWords = lobbyCustomWords.filter(w => w !== word);
  renderLobbyCustomWordTags();
}
function renderLobbyCustomWordTags(){
  const box = document.getElementById('lobbyCustomWordTags');
  if(!box) return;
  box.innerHTML = '';
  lobbyCustomWords.forEach(w => {
    const tag = document.createElement('div');
    tag.style.cssText = 'display:inline-flex;align-items:center;gap:6px;background:#fff;border:2px solid #ffd400;border-radius:100px;padding:6px 14px;font-size:14px;font-weight:700;';
    tag.innerHTML = `${w} <button onclick="vib();removeLobbyCustomWord('${w}')" style="background:none;border:none;color:#ff4d4d;font-size:16px;font-weight:900;cursor:pointer;padding:0;line-height:1;">✕</button>`;
    box.appendChild(tag);
  });
}

function toggleGameMode(mode){
  gameMode = mode;
  vib();
  document.getElementById('modeOffline').classList.toggle('active', mode==='offline');
  document.getElementById('modeOnline').classList.toggle('active', mode==='online');
  document.querySelectorAll('.offline-only').forEach(el=>{
    el.classList.toggle('locked', mode==='online');
  });
  const mainBtn = document.getElementById('mainStartBtn');
  if(mainBtn){
    if(mode === 'online'){
      mainBtn.innerText = 'دەستپێکردنی یاری ئۆنڵاین';
      mainBtn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      mainBtn.style.color = '#fff';
      mainBtn.style.boxShadow = '0 6px 20px rgba(34,197,94,.35)';
    } else {
      mainBtn.innerText = 'دەستپێکردنی یاری';
      mainBtn.style.background = '';
      mainBtn.style.color = '';
      mainBtn.style.boxShadow = '';
    }
  }
}
/* بەکارهێنانی هەمان دوگمەی "دەستپێکردنی یاری" ی سەرەکی — گۆڕانکاری بچووک */
function handleModeStart(){
  if(gameMode === 'online'){
    showScreen('onlineChooseScreen');
    startPublicRoomsPolling();
    const nameInput = document.getElementById('onlinePlayerName');
    if(currentUser && isVipActive(currentUser)){
      nameInput.value = currentUser.username;
      nameInput.disabled = true;
      nameInput.placeholder = currentUser.username;
    } else {
      nameInput.disabled = false;
      nameInput.value = '';
    }
  } else {
    goCategory();
  }
}

/* ── دروستکردنی کۆدی ژوور ── */
function generateRoomCode(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for(let i=0;i<5;i++) code += chars[Math.floor(Math.random()*chars.length)];
  return code;
}

/* ── فۆرماتی خۆکاری کۆدی ژوور و پاست ── */
/* ── لیستی ژوورە بەردەستەکان (چاوەڕوانی) ── */
/* ── لیستی ژوورە بەردەستەکان (realtime، بەبێ refresh) ── */
let publicRoomsChannel = null;
let publicRoomsCache = {}; // code -> {hostName, avatarSeed, count}

function startPublicRoomsPolling(){
  stopPublicRoomsPolling();
  loadPublicRoomsInitial();
  subscribePublicRooms();
}

function stopPublicRoomsPolling(){
  if(publicRoomsChannel){ sb.removeChannel(publicRoomsChannel); publicRoomsChannel = null; }
  publicRoomsCache = {};
}

async function loadPublicRoomsInitial(){
  const box = document.getElementById('publicRoomsList');
  if(!box) return;
  box.innerHTML = '<div class="stat-empty">چاوەڕوانبە...</div>';
        const { data: rooms } = await sb.from('rooms').select('*').eq('status','lobby').order('created_at', { ascending:false });
  publicRoomsCache = {};
  if(!rooms || rooms.length === 0){
    renderPublicRoomsEmpty();
    renderFakeRoomsIntoList();
    return;
  }
  const codes = rooms.map(r=>r.code);
  const { data: allPlayers } = await sb.from('room_players').select('room_code,name,avatar_seed,is_host,is_verified,frame_style,card_theme').in('room_code', codes);
  rooms.forEach(r=>{
    const rp = (allPlayers||[]).filter(p=>p.room_code===r.code);
    if(rp.length === 0){
      sb.from('rooms').delete().eq('code', r.code);
      return;
    }
    const host = rp.find(p=>p.is_host);
    publicRoomsCache[r.code] = {
      hostName: host ? host.name : 'نەناسراو',
      avatarSeed: host ? host.avatar_seed : r.code,
      count: rp.length,
      isPublic: r.is_public,
      isVerified: host ? !!host.is_verified : false,
      frameStyle: host ? host.frame_style : 'default',
      cardTheme: host ? host.card_theme : 'default'
    };
  });
  renderAllPublicRooms();
  renderFakeRoomsIntoList();
}
function renderPublicRoomsEmpty(){
  const box = document.getElementById('publicRoomsList');
  if(box) box.innerHTML = '<div class="stat-empty">هیچ ژوورێک ئێستا بەردەست نییە</div>';
}

function renderAllPublicRooms(){
  const box = document.getElementById('publicRoomsList');
  if(!box) return;
  const codes = Object.keys(publicRoomsCache);
  if(codes.length === 0){ renderPublicRoomsEmpty(); return; }
  box.innerHTML = '';
  codes.forEach(code=> box.appendChild(buildRoomCard(code)));
}
function buildRoomCard(code){
  const r = publicRoomsCache[code];
  const div = document.createElement('div');
  const themeClass = r.cardTheme && r.cardTheme!=='default' ? ' theme-'+r.cardTheme : '';
  div.className = 'player-item' + themeClass;
  div.style.cursor = 'pointer';
  div.setAttribute('data-room', code);
  div.onclick = ()=>{ vib(); promptJoinRoom(code, publicRoomsCache[code].hostName, publicRoomsCache[code].isPublic); };
  const badgeColor = r.isPublic ? '#22c55e' : '#ff4d4d';
  const badgeIcon = r.isPublic
    ? '<svg viewBox="0 0 24 24" width="11" height="11" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>'
    : '<svg viewBox="0 0 24 24" width="11" height="11" fill="#fff"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg>';
  const roomTypeLabel = r.isPublic ? '' : ' — تایبەت';
  const verifiedIco = r.isVerified ? ` ${verifiedBadgeSvg(19)}` : '';
  div.innerHTML = `
    <div class="avatar-disc-wrap">
    <div class="avatar ${vipFrameClass(r.frameStyle)}"><img src="${avatarUrl(r.avatarSeed)}" loading="lazy"></div>
         <div style="position:absolute;bottom:-2px;right:-2px;width:19px;height:19px;border-radius:50%;background:${badgeColor};border:2px solid #fff;display:flex;align-items:center;justify-content:center;z-index:2;">
        ${badgeIcon}
      </div>
    </div>
    <div class="player-name">ژووری ${r.hostName}${verifiedIco}<div class="room-count-label" style="font-size:12px;font-weight:700;opacity:.55;margin-top:2px;">${r.count} / ١٠ یاریزان${roomTypeLabel}</div></div>
    <svg viewBox="0 0 24 24" width="20" height="20" style="fill:#bbb;flex-shrink:0;"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`;
  return div;
}
function updateRoomCardCount(code){
  const box = document.getElementById('publicRoomsList');
  if(!box) return;
  const card = box.querySelector(`[data-room="${code}"]`);
  if(!card) return;
  const label = card.querySelector('.room-count-label');
  if(label) label.innerText = `${publicRoomsCache[code].count} / ١٠ یاریزان`;
}

function addRoomCard(code){
  const box = document.getElementById('publicRoomsList');
  if(!box) return;
  if(box.querySelector('.stat-empty')) box.innerHTML = '';
  if(box.querySelector(`[data-room="${code}"]`)) return;
  const card = buildRoomCard(code);
  box.insertBefore(card, box.firstChild);
}

function removeRoomCard(code){
  const box = document.getElementById('publicRoomsList');
  if(!box) return;
  const card = box.querySelector(`[data-room="${code}"]`);
  if(card) card.remove();
  if(Object.keys(publicRoomsCache).length === 0 && !box.querySelector('[data-fake-room]')) renderPublicRoomsEmpty();
}

async function refreshRoomCardFull(code){
  const { data: rp } = await sb.from('room_players').select('*').eq('room_code', code);
  if(!rp || !publicRoomsCache[code]) return;
  const host = rp.find(p=>p.is_host);
  publicRoomsCache[code].hostName = host ? host.name : 'نەناسراو';
  publicRoomsCache[code].avatarSeed = host ? host.avatar_seed : code;
  publicRoomsCache[code].count = rp.length;
  publicRoomsCache[code].isVerified = host ? !!host.is_verified : false;
  publicRoomsCache[code].frameStyle = host ? host.frame_style : 'default';
  publicRoomsCache[code].cardTheme = host ? host.card_theme : 'default';
  const box = document.getElementById('publicRoomsList');
  const oldCard = box && box.querySelector(`[data-room="${code}"]`);
  if(oldCard){
    const newCard = buildRoomCard(code);
    oldCard.replaceWith(newCard);
  }
}
/* ══ FAKE ROOMS (بۆ نیشاندانی چالاکی) ══ */
const FAKE_ROOMS_KEY = 'sexur_fake_rooms';
const FAKE_ROOMS_REFRESH_HOURS = 4;

function generateFakeRoomsData(){
  const count = Math.floor(Math.random() * 5) + 1; // 1 تا 5 ژوور
  const usedNames = new Set();
  const rooms = [];
  for(let i=0;i<count;i++){
    let name;
    do{ name = nameSuggestions[Math.floor(Math.random()*nameSuggestions.length)]; } while(usedNames.has(name));
    usedNames.add(name);
    rooms.push({
      code: 'F' + Math.random().toString(36).slice(2,7).toUpperCase(),
      hostName: name,
      avatarSeed: name + '_fake_' + i,
      count: Math.floor(Math.random() * 7) + 3 // 3 تا 9
    });
  }
  return { rooms, generatedAt: Date.now() };
}

function getFakeRooms(){
  let stored;
  try{ stored = JSON.parse(localStorage.getItem(FAKE_ROOMS_KEY) || 'null'); }catch(e){ stored = null; }
  const expired = !stored || (Date.now() - stored.generatedAt) > FAKE_ROOMS_REFRESH_HOURS*3600*1000;
  if(expired){
    stored = generateFakeRoomsData();
    localStorage.setItem(FAKE_ROOMS_KEY, JSON.stringify(stored));
  }
  return stored.rooms;
}

function buildFakeRoomCard(fr){
  const div = document.createElement('div');
  div.className = 'player-item';
  div.style.cursor = 'pointer';
  div.setAttribute('data-fake-room', fr.code);
  div.onclick = ()=>{ vib(); promptJoinFakeRoom(fr); };
  div.innerHTML = `
    <div class="avatar-disc-wrap">
      <div class="avatar"><img src="https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fr.avatarSeed)}" loading="lazy"></div>
      <div style="position:absolute;bottom:-2px;right:-2px;width:19px;height:19px;border-radius:50%;background:#ff4d4d;border:2px solid #fff;display:flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 24 24" width="10" height="10" fill="#fff"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg>
      </div>
    </div>
    <div class="player-name">ژووری ${fr.hostName}<div class="room-count-label" style="font-size:12px;font-weight:700;opacity:.55;margin-top:2px;">${fr.count} / ١٠ یاریزان — تایبەت</div></div>
    <svg viewBox="0 0 24 24" width="20" height="20" style="fill:#bbb;flex-shrink:0;"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`;
  return div;
}

function promptJoinFakeRoom(fr){
  const name = getOnlinePlayerName();
  if(!name){
    vib('error');
    showModal({title:"ناوت بنووسە", msg:"تکایە پێش چوونەژوورەوە ناوی خۆت بنووسە.", icon:"warn"});
    return;
  }
  _joinCodeTarget = { code: fr.code, hostName: fr.hostName };
  document.getElementById('joinCodeHostLabel').innerText = `ژووری ${fr.hostName}`;
  document.getElementById('joinCodeModalInput').value = '';
  document.getElementById('joinCodeModalInput').classList.remove('input-error');
  document.getElementById('joinCodeOverlay').classList.add('active');
  setTimeout(()=>document.getElementById('joinCodeModalInput').focus(), 300);
}

function renderFakeRoomsIntoList(){
  const box = document.getElementById('publicRoomsList');
  if(!box) return;
  if(box.querySelector('.stat-empty')) box.innerHTML = '';
  getFakeRooms().forEach(fr => box.appendChild(buildFakeRoomCard(fr)));
}
function subscribePublicRooms(){
  publicRoomsChannel = sb.channel('public_rooms_browser')
        .on('postgres_changes', { event:'INSERT', schema:'public', table:'rooms' }, (payload)=>{
      const room = payload.new;
      if(room.status !== 'lobby') return;
      publicRoomsCache[room.code] = { hostName:'نەناسراو', avatarSeed: room.code, count: 0, isPublic: room.is_public };
      addRoomCard(room.code);
      // زانیاری هۆست کەمێک دواتر دێت، بۆیە نوێی دەکەینەوە
      setTimeout(()=> refreshRoomCardFull(room.code), 600);
    })
    .on('postgres_changes', { event:'UPDATE', schema:'public', table:'rooms' }, (payload)=>{
      const room = payload.new;
      if(room.status !== 'lobby' && publicRoomsCache[room.code]){
        delete publicRoomsCache[room.code];
        removeRoomCard(room.code);
      }
    })
    .on('postgres_changes', { event:'DELETE', schema:'public', table:'rooms' }, (payload)=>{
      const code = payload.old?.code;
      if(code && publicRoomsCache[code]){
        delete publicRoomsCache[code];
        removeRoomCard(code);
      }
    })
    .on('postgres_changes', { event:'INSERT', schema:'public', table:'room_players' }, (payload)=>{
      const p = payload.new;
      if(publicRoomsCache[p.room_code]){
        publicRoomsCache[p.room_code].count++;
        if(p.is_host){
          publicRoomsCache[p.room_code].hostName = p.name;
          publicRoomsCache[p.room_code].avatarSeed = p.avatar_seed;
        }
        updateRoomCardCount(p.room_code);
      }
    })
    .on('postgres_changes', { event:'DELETE', schema:'public', table:'room_players' }, (payload)=>{
      const p = payload.old;
      const code = p?.room_code;
      if(code && publicRoomsCache[code]){
        publicRoomsCache[code].count = Math.max(0, publicRoomsCache[code].count - 1);
        updateRoomCardCount(code);
      } else if(!code){
        // REPLICA IDENTITY FULL دانەمەزراوە — بەبێ ئاگاداری تەواو refresh دەکەین
        loadPublicRoomsInitial();
      }
    })
    .subscribe();
}

let _joinCodeTarget = null;

function promptJoinRoom(code, hostName, isPublicRoom){
  const name = getOnlinePlayerName();
  if(!name){
    vib('error');
    showModal({title:"ناوت بنووسە", msg:"تکایە پێش چوونەژوورەوە ناوی خۆت بنووسە.", icon:"warn"});
    return;
  }
  if(isPublicRoom){
    joinOnlineRoomByCode(code, name);
    return;
  }
  _joinCodeTarget = { code, hostName };
  document.getElementById('joinCodeHostLabel').innerText = `ژووری ${hostName}`;
  document.getElementById('joinCodeModalInput').value = '';
  document.getElementById('joinCodeModalInput').classList.remove('input-error');
  document.getElementById('joinCodeOverlay').classList.add('active');
  setTimeout(()=>document.getElementById('joinCodeModalInput').focus(), 300);
}

function closeJoinCodeModal(){
  document.getElementById('joinCodeOverlay').classList.remove('active');
  _joinCodeTarget = null;
}

async function confirmJoinCodeModal(){
  if(!_joinCodeTarget) return;
  const input = document.getElementById('joinCodeModalInput');
  const clean = input.value.trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(!clean || clean !== _joinCodeTarget.code.toUpperCase()){
    vib('error');
    input.classList.remove('input-shake');
    void input.offsetWidth;
    input.classList.add('input-shake','input-error');
    return;
  }
  const name = document.getElementById('onlinePlayerName').value.trim();
  const target = _joinCodeTarget;
  closeJoinCodeModal();
  await joinOnlineRoomByCode(target.code, name);
}

/* ── سنووردارکردنی ناوی یاریزان بە پیتی کوردی — وەک مۆدی ئۆفڵاین ── */
function getOnlinePlayerName(){
  if(currentUser && isVipActive(currentUser)) return currentUser.username;
  return document.getElementById('onlinePlayerName').value.trim();
}
function onOnlineNameInput(){
  const input = document.getElementById('onlinePlayerName');
  const val = input.value;
  const cleaned = val.replace(/[^\u0600-\u06FF\u200c\s]/g, '');
  if(cleaned !== val){
    input.value = cleaned;
    vib('error');
    showKurdishToast();
    return;
  }
}
function onChatInput(){
  const input = document.getElementById('chatInput');
  const val = input.value;
  const cleaned = val.replace(/[^\u0600-\u06FF\u200c\s]/g, '');
  if(cleaned !== val){
    input.value = cleaned;
    vib('error');
    showKurdishToast();
    return;
  }
}
async function createOnlineRoom(){
  const name = getOnlinePlayerName();
  if(!name){ vib('error'); showModal({title:"ناوت بنووسە", msg:"تکایە ناوی خۆت بنووسە.", icon:"warn"}); return; }
  // پلەیەری لۆگینکراوی VIP لەم پشکنینە ئازادە
  const isVipUser = !!(currentUser && isVipActive(currentUser));
  if(!isVipUser){
    const { data: existingHosts } = await sb.from('room_players').select('name').eq('is_host', true);
    if(existingHosts && existingHosts.some(p => p.name === name)){
      vib('error');
      showModal({title:"ناوەکە بەکارهاتووە", msg:"کەسێکی تر ئێستا بەم ناوە ژوورێکی دروست کردووە. تکایە ناوێکی تر هەڵبژێرە بۆ ئەوەی تێکەڵ نەبن.", icon:"warn"});
      return;
    }
  }
  isHost = true;
  const code = generateRoomCode();
  const maxPlayers = isVipUser ? 30 : 10;
  const { error: roomErr } = await sb.from('rooms').insert({ code, host_client_id: CLIENT_ID, status: 'lobby', is_public: roomIsPublic, max_players: maxPlayers });
  if(roomErr){ vib('error'); showModal({title:"هەڵە", msg:"نەتوانرا ژوور دروست بکرێت.", icon:"err"}); return; }

   const { error: playerErr } = await sb.from('room_players').insert({
    room_code: code, client_id: CLIENT_ID, name,
    avatar_seed: (currentUser && isVipActive(currentUser)) ? currentUser.avatar_seed : name+'_'+Date.now(),
    is_host: true, last_seen_at: new Date().toISOString(),
    is_verified: !!(currentUser && isVipActive(currentUser)),
    frame_style: (currentUser && isVipActive(currentUser)) ? currentUser.frame_style : 'default',
    card_theme: (currentUser && isVipActive(currentUser)) ? currentUser.card_theme : 'default',
    user_id: currentUser ? currentUser.id : null
  });
  if(playerErr){ vib('error'); showModal({title:"هەڵە", msg:"نەتوانرا زیاد بکرێیت.", icon:"err"}); return; }

  onlineRoomCode = code;
  saveOnlineSession(code);
  vib('success');
  stopPublicRoomsPolling();
  enterLobby();

  if(!roomIsPublic){
    setTimeout(()=>{
      showModal({title:"ژوورە تایبەتەکەت ئامادەیە", msg:"ژوورەکەت لە لیستی گشتی دیار نابێت. کۆدی ژوورەکە کۆپی بکە و بنێرە بۆ هاوڕێیەکانت.", icon:"ok"});
    }, 500);
  }
}
async function joinOnlineRoomByCode(code, name){
  const { data: room, error: roomErr } = await sb.from('rooms').select('*').eq('code', code).maybeSingle();
  if(roomErr || !room){ vib('error'); showModal({title:"ژوور نەدۆزرایەوە", msg:"ژوورەکە نەماوە.", icon:"err"}); return; }
  if(room.status !== 'lobby'){ vib('error'); showModal({title:"یاری دەستی پێکردووە", msg:"ناتوانیت بچیتە ژوورەوە، یاری دەستی پێکردووە.", icon:"warn"}); return; }
  roomIsPublic = !!room.is_public;

    const { data: existing } = await sb.from('room_players').select('*').eq('room_code', code)
  const isVipUser = !!(currentUser && isVipActive(currentUser));
  if(!isVipUser && existing && existing.some(p => p.name === name)){
    vib('error'); showModal({title:"ناوەکە بەکارهاتووە", msg:"ناوێکی تر بنووسە.", icon:"warn"}); return;
  }
  const roomMax = room.max_players || 10;
  if(existing && existing.length >= roomMax){
    vib('error'); showModal({title:"ژوورەکە پڕە", msg:`زیاتر لە ${roomMax} کەس ناتوانرێت.`, icon:"warn"}); return;
  }
  
    const { error: playerErr } = await sb.from('room_players').insert({
    room_code: code, client_id: CLIENT_ID, name,
    avatar_seed: (currentUser && isVipActive(currentUser)) ? currentUser.avatar_seed : name+'_'+Date.now(),
    is_host: false, last_seen_at: new Date().toISOString(),
    is_verified: !!(currentUser && isVipActive(currentUser)),
    frame_style: (currentUser && isVipActive(currentUser)) ? currentUser.frame_style : 'default',
    card_theme: (currentUser && isVipActive(currentUser)) ? currentUser.card_theme : 'default',
    user_id: currentUser ? currentUser.id : null
  });
  if(playerErr){ vib('error'); showModal({title:"هەڵە", msg:"نەتوانرا بچیتە ژوورەوە.", icon:"err"}); return; }

  onlineRoomCode = code;
  isHost = false;
  saveOnlineSession(code);
  vib('success');
  stopPublicRoomsPolling();
  enterLobby();
}

/* ── لۆبی + ڕیئلتایم ── */
let currentRoomMaxPlayers = 10;
async function enterLobby(){
  fetchChampionRanks();
  showScreen('onlineLobbyScreen');
  document.getElementById('lobbyRoomCode').innerText = onlineRoomCode;
  document.getElementById('lobbyRoomCodeBox').classList.toggle('hidden', roomIsPublic);
  document.getElementById('lobbyPublicBox').classList.toggle('hidden', !roomIsPublic);
  document.getElementById('lobbyHostControls').classList.toggle('hidden', !isHost);
  document.getElementById('lobbyWaitMsg').classList.toggle('hidden', isHost);
  const { data: roomRow } = await sb.from('rooms').select('max_players').eq('code', onlineRoomCode).maybeSingle();
  currentRoomMaxPlayers = roomRow?.max_players || 10;
    subscribeRoom();
  refreshLobbyPlayers();
  startPingLoop();
  showChatFab();
}

function subscribeRoom(){
  if(roomChannel) sb.removeChannel(roomChannel);
  roomChannel = sb.channel('room_' + onlineRoomCode)
      .on('broadcast', { event:'player_kicked' }, ({ payload }) => {
      handleKickBroadcast(payload.clientId, payload.name);
    })
    .on('broadcast', { event:'chat_message' }, ({ payload }) => {
      if(payload.clientId !== CLIENT_ID) appendChatMessage(payload, false);
    })
       .on('broadcast', { event:'player_muted' }, ({ payload }) => {
      const p = onlinePlayers.find(x=>x.client_id===payload.clientId);
      if(p) p.is_muted = payload.muted;
      if(payload.clientId === CLIENT_ID) syncChatMuteUI();
      updateMuteDom(payload.clientId, payload.muted);
    })
    .on('postgres_changes', { event:'*', schema:'public', table:'room_players', filter:`room_code=eq.${onlineRoomCode}` },
      async (payload) => {
        if(payload.eventType === 'UPDATE' && payload.new){
          const newRow = payload.new;
          const cached = onlinePlayers.find(p=>p.client_id===newRow.client_id);
          if(isOnlyPingDiff(cached, newRow)){
            cached.ping_ms = newRow.ping_ms;
            cached.last_seen_at = newRow.last_seen_at;
            updatePingDom(newRow.client_id, newRow.ping_ms);
            return;
          }
                    if(isOnlyReadyDiff(cached, newRow)){
            cached.vote_for = newRow.vote_for;
            cached.ping_ms = newRow.ping_ms;
            cached.last_seen_at = newRow.last_seen_at;
            updateReadyDom(newRow.client_id, newRow.vote_for === 'READY');
            syncOnlinePlayerUI();
            if(isHost){ checkAllReady(); checkAllVoted(); }
            return;
          }
        }
        if(payload.eventType === 'INSERT' && payload.new && payload.new.client_id !== CLIENT_ID){
          showJoinToast(payload.new.name, payload.new.avatar_seed, 'join');
        }
        if(payload.eventType === 'DELETE' && payload.old && payload.old.client_id !== CLIENT_ID){
          const leftPlayer = onlinePlayers.find(p => p.client_id === payload.old.client_id);
          if(leftPlayer) showJoinToast(leftPlayer.name, leftPlayer.avatar_seed, 'leave');
        }
        await refreshLobbyPlayers();
        syncOnlinePlayerUI();
                            if(!isHost && onlineRoomCode && !onlinePlayers.some(p=>p.client_id===CLIENT_ID)){
          vib('error');
          showModal({title:"دەرکراویت", msg:"خاوەنی ژوور تۆی دەرکرد.", icon:"err"});
          if(roomChannel) sb.removeChannel(roomChannel);
          clearInterval(roundTimerInterval);
          stopPingLoop();
          clearOnlineSession();
          onlineRoomCode = null; onlinePlayers = [];
          hideChatFab();
          clearChatMessages();
          showScreen('screen1');
          return;
        }
        if(isHost) checkAllReady();
        if(isHost) checkAllVoted();
      })
    .on('postgres_changes', { event:'UPDATE', schema:'public', table:'rooms', filter:`code=eq.${onlineRoomCode}` },
      payload => onRoomUpdate(payload.new))
    .subscribe();
}
async function refreshLobbyPlayers(){
  const { data } = await sb.from('room_players').select('*').eq('room_code', onlineRoomCode).order('joined_at');
  onlinePlayers = data || [];
  const me = onlinePlayers.find(p=>p.client_id===CLIENT_ID);
  if(me && me.is_host !== isHost){
    isHost = me.is_host;
    refreshHostUI();
  }
  refreshLobbyPlayersUI();
}
/* تەنها ری‌ڕێندەری DOM — بەبێ fetch، بۆ نوێکردنەوەی خێرا لە کاتی کیک */
function refreshLobbyPlayersUI(){
  const box = document.getElementById('lobbyPlayersList');
  if(!box) return;
  box.innerHTML = '';
  onlinePlayers.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'player-item' + (isStale(p.last_seen_at, STALE_MS) ? ' is-disconnected' : '') + (p.card_theme && p.card_theme!=='default' ? ' theme-'+p.card_theme : '') + cardBgClass(p);
    div.setAttribute('style', cardBgStyle(p));
    div.setAttribute('data-player-row', p.client_id);
    const canKick = isHost && p.client_id !== CLIENT_ID;
    const pingMs = p.ping_ms || 0;
    const pc = pingClass(pingMs);
         const muteBtn = `${canKick ? `<button class="mute-toggle-btn ${p.is_muted?'is-muted':''}" onclick="toggleMutePlayer('${p.client_id}')">
        ${p.is_muted
          ? '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#c62828" opacity=".35"/><line x1="3" y1="3" x2="21" y2="21" stroke="#c62828" stroke-width="2.4" stroke-linecap="round"/></svg>'
          : '<svg viewBox="0 0 24 24" width="16" height="16" fill="#555"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'
        }</button>` : ''}`;
    const crownIco = p.is_host ? `<svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:-3px;flex-shrink:0;"><path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5zm0 2h14v2H5v-2z" fill="#ffd400"/></svg>` : '';
    const verifiedIco = p.is_verified ? ` ${verifiedBadgeSvg(20)}` : '';
    const muteIco = p.is_muted ? ` <svg viewBox="0 0 24 24" width="14" height="14" style="vertical-align:-2px"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#c62828" opacity=".85"/><line x1="3" y1="3" x2="21" y2="21" stroke="#fff7cf" stroke-width="2.4"/></svg>` : '';
    div.innerHTML = `<div class="avatar-disc-wrap"><div class="avatar ${vipFrameClass(p.frame_style)}" style="position:relative;"><img src="${avatarUrl(p.avatar_seed)}"></div><div class="disc-badge-lobby">🔌</div></div>
      <div class="player-name">${p.name}${verifiedIco}${championBadgeInline(p.user_id)}<span data-mute-emoji="${p.client_id}">${muteIco}</span></div>
      <div class="lobby-ping-badge ${pc}" data-ping="${p.client_id}" style="background:rgba(0,0,0,.05);display:flex;align-items:center;gap:4px;">${crownIco}${pingMs>0?pingMs+' ms':'...'}</div>
      ${muteBtn}
      ${canKick ? `<button class="remove-player" onclick="vib('medium');kickPlayer('${p.client_id}','${p.name}')">&#x2715;</button>` : ''}`;
    box.appendChild(div);
  });
    document.getElementById('lobbyCount').innerText = onlinePlayers.length + ' / ' + currentRoomMaxPlayers + ' یاریزان';
}

/* نوێکردنەوەی تەنها دۆخی میوت — بەبێ ری‌ڕێندەری هەموو لیستەکە */
function updateMuteDom(clientId, muted){
  const svgOn = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#c62828" opacity=".35"/><line x1="3" y1="3" x2="21" y2="21" stroke="#c62828" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const svgOff = '<svg viewBox="0 0 24 24" width="16" height="16" fill="#555"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
  const svgOnSmall = '<svg viewBox="0 0 24 24" width="13" height="13"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#c62828" opacity=".35"/><line x1="3" y1="3" x2="21" y2="21" stroke="#c62828" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const svgOffSmall = '<svg viewBox="0 0 24 24" width="13" height="13" fill="#888"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';

  document.querySelectorAll(`[data-player-row="${clientId}"] .mute-toggle-btn`).forEach(btn=>{
    btn.classList.toggle('is-muted', muted);
    btn.innerHTML = muted ? svgOn : svgOff;
  });
  document.querySelectorAll(`[data-mute-emoji="${clientId}"]`).forEach(el=>{
    el.textContent = muted ? ' 🔇' : '';
  });
  document.querySelectorAll(`[data-mute-for="${clientId}"]`).forEach(btn=>{
    btn.classList.toggle('is-muted', muted);
    btn.innerHTML = muted ? svgOnSmall : svgOffSmall;
  });
}
async function kickPlayer(clientId, name){
  const yes = await showModal({title:"دەرکردنی یاریزان", msg:`ئایا دڵنیایت لە دەرکردنی ${name}؟`, icon:"warn", confirm:true});
  if(!yes) return;

  // ١. یەکسەر لای هۆست خۆی نوێ بکەرەوە (optimistic)
  onlinePlayers = onlinePlayers.filter(p => p.client_id !== clientId);
  refreshLobbyPlayersUI();
  syncOnlinePlayerUI();
  vib('success');

  // ٢. ڕاستەوخۆ بۆ هەموو ئامێرەکانی تر broadcast بکە — خێراترە لە دیتابەیس
  roomChannel.send({
    type: 'broadcast',
    event: 'player_kicked',
    payload: { clientId, name }
  });
  // ٣. لە دیتابەیس بیسڕەوە بۆ مانەوەی دروستی
  await sb.from('room_players').delete().eq('room_code', onlineRoomCode).eq('client_id', clientId);
  await deleteRoomIfEmpty(onlineRoomCode);
}

/* وەرگرتنی broadcast‌ی کیک — بۆ هەموو ئامێرەکان دەستبەجێ */
function handleKickBroadcast(clientId, name){
  if(clientId === CLIENT_ID){
    // خۆم کیک کراوم
    vib('error');
    showModal({title:"دەرکراویت", msg:"خاوەن ژوور تۆی دەرکرد.", icon:"err"});
    if(roomChannel) sb.removeChannel(roomChannel);
    clearInterval(roundTimerInterval);
    stopPingLoop();
    clearOnlineSession();
    onlineRoomCode = null; isHost = false; onlinePlayers = [];
    hideChatFab();
    clearChatMessages();
    showScreen('screen1');
    return;
  }
  // یاریزانێکی تر کیک کراوە — یەکسەر لای من نوێ بکەرەوە
  onlinePlayers = onlinePlayers.filter(p => p.client_id !== clientId);
  refreshLobbyPlayersUI();
  syncOnlinePlayerUI();
}
async function deleteRoomIfEmpty(code){
  const { data: remaining } = await sb.from('room_players').select('client_id').eq('room_code', code);
  if(!remaining || remaining.length === 0){
    await sb.from('rooms').delete().eq('code', code);
  }
}

function copyRoomCode(){
  navigator.clipboard?.writeText(onlineRoomCode).then(()=>{
    vib('success');
    showModal({title:"کۆپی کرا ✓", msg:"کۆدی ژوورەکە بنێرە بۆ هاوڕێکانت.", icon:"ok"});
  });
}

async function leaveLobby(){
  if(!onlineRoomCode){ showScreen('screen1'); return; }
  const _leftCode = onlineRoomCode;
  await sb.from('room_players').delete().eq('room_code', onlineRoomCode).eq('client_id', CLIENT_ID);
  if(isHost) await sb.from('rooms').delete().eq('code', onlineRoomCode);
  else await deleteRoomIfEmpty(_leftCode);
  if(roomChannel) sb.removeChannel(roomChannel);
  clearInterval(roundTimerInterval);
  stopPingLoop();
  clearOnlineSession();
    onlineRoomCode = null; isHost = false; onlinePlayers = [];
  hideChatFab();
  clearChatMessages();
  showScreen('screen1');
}
/* ── دەستپێکردن (هۆست) ── */
async function startOnlineGame(){
  if(!isHost) return;
  if(onlinePlayers.length < 3){
    vib('error');
    const err = document.getElementById('lobbyMinpErr');
    err.classList.remove('show'); void err.offsetWidth; err.classList.add('show');
    showModal({title:"کەمە", msg:"کەمترین یاریزان بۆ دەستپێکردنی یاری ٣ کەسە. چاوەڕێ بکە هاوڕێیەکانت بچنە ژوورەوە یان کۆدی ژوورەکە بنێرە بۆیان.", icon:"warn"});
    setTimeout(()=>err.classList.remove('show'),3000);
    return;
  }
  document.getElementById('lobbyMinpErr').classList.remove('show');

  const selectedCats = Array.from(document.querySelectorAll('#lobbyCategoryGrid .mini-cat.active')).map(el=>el.dataset.cat);
  if(selectedCats.length === 0 && lobbyCustomWords.length === 0){
    vib('error'); showModal({title:"وشە هەڵبژێرە", msg:"لانیکەم یەک جۆری وشە یان وشەیەکی تایبەت هەڵبژێرە.", icon:"warn"}); return;
  }

  const pool = [];
  selectedCats.forEach(c => (words[c]||[]).forEach(w => pool.push({w, c})));
  lobbyCustomWords.forEach(w => pool.push({w, c:'تایبەت'}));
  const chosen = pool[Math.floor(Math.random()*pool.length)];

  const spyCountRaw = document.getElementById('lobbySpyCount').value;
  const spyCount = spyCountRaw === 'random' ? Math.floor(Math.random()*3)+1 : parseInt(spyCountRaw);
  const allIds = onlinePlayers.map(p=>p.client_id);
  onlineSpyBag = onlineSpyBag.filter(id => allIds.includes(id));
  const spyIds = [];
  const maxSpies = Math.min(spyCount, onlinePlayers.length-1);
  while(spyIds.length < maxSpies){
    if(onlineSpyBag.length === 0) onlineSpyBag = shuffleArray(allIds);
    const id = onlineSpyBag.shift();
    if(!spyIds.includes(id)) spyIds.push(id);
  }
  const gameTime = parseInt(document.getElementById('lobbyGameTime').value);

    await sb.from('room_players').update({ vote_for: null }).eq('room_code', onlineRoomCode);
  await sb.from('rooms').update({
    status: 'playing', game_word: chosen.w, current_category: chosen.c,
    spy_client_ids: spyIds, game_time: gameTime, round_start_at: null,
    scoring_enabled: onlineScoringEnabled
  }).eq('code', onlineRoomCode);
}
/* ── وەرگرتنی گۆڕانکاری ژوور بۆ هەموو ئامێرەکان ── */
function onRoomUpdate(room){
  onlineScoringEnabled = room.scoring_enabled !== false;
  if(room.status === 'playing'){
    if(room.round_start_at){ showOnlineTimerScreen(room); }
    else { showOnlineCard(room); }
  }
  if(room.status === 'voting') showOnlineVoting(room);
  if(room.status === 'lastchance') handleOnlineLastChanceUpdate(room);
  if(room.status === 'reveal') showOnlineReveal(room);
  if(room.status === 'lobby' && onlineRoomCode){ showScreen('onlineLobbyScreen'); refreshLobbyPlayers(); }
}

function showOnlineLastChance(room){
  showScreen('onlineLastChanceScreen');
  showChatFab();
  const accusedPlayer = onlinePlayers.find(p=>p.client_id === room.accused_id);
  document.getElementById('onlineLastChanceAvatar').src = accusedPlayer ? avatarUrl(accusedPlayer.avatar_seed) : '';
  document.getElementById('onlineLastChanceName').innerHTML = accusedPlayer ? (accusedPlayer.name + championBadgeInline(accusedPlayer.user_id)) : '';
  const accTheme = accusedPlayer && accusedPlayer.card_theme && accusedPlayer.card_theme!=='default' ? 'theme-'+accusedPlayer.card_theme : '';
  const accCard = document.getElementById('onlineLastChanceCard');
  accCard.className = 'dadga-spy-reveal'+(accTheme?' '+accTheme:'')+cardBgClass(accusedPlayer);
  accCard.setAttribute('style', cardBgStyle(accusedPlayer));
  const isMe = CLIENT_ID === room.accused_id;
  document.getElementById('onlineLastChanceSelfBox').classList.toggle('hidden', !isMe);
  document.getElementById('onlineLastChanceWaitBox').classList.toggle('hidden', isMe);
  if(isMe){
    _onlineGuessSubmitted = false;
    const input = document.getElementById('onlineGuessInput');
    input.value = '';
    input.disabled = false;
  }
}

async function handleOnlineLastChanceUpdate(room){
  if(room.spy_guess_correct === null || room.spy_guess_correct === undefined){
    showOnlineLastChance(room);
    return;
  }
  if(!isHost || _finalizingLastChance) return;
  _finalizingLastChance = true;
  const { data: players } = await sb.from('room_players').select('*').eq('room_code', onlineRoomCode);
  const spyIds = room.spy_client_ids || [];
  await finalizeOnlineRound(room.accused_id, room.spy_guess_correct, spyIds, players);
  _finalizingLastChance = false;
}

async function submitOnlineSpyGuess(){
  if(_onlineGuessSubmitted) return;
  const { data: room } = await sb.from('rooms').select('*').eq('code', onlineRoomCode).single();
  if(!room || room.accused_id !== CLIENT_ID) return;
  _onlineGuessSubmitted = true;
  const input = document.getElementById('onlineGuessInput');
  input.disabled = true;
  const normalize = s => s.trim().replace(/\s+/g,' ').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/ة/g,'ە').replace(/\u200c/g,'').replace(/\u200d/g,'');
  const correct = normalize(input.value) === normalize(room.game_word);
  input.value = correct ? '✓ راستە' : '✗ هەڵەیە';
  await sb.from('rooms').update({ spy_guess_correct: correct }).eq('code', onlineRoomCode);
}

/* ── شاشەی کات (وەک ئۆفڵاین) ── */
let _shownStarterFor = null;
function showOnlineTimerScreen(room){
  showScreen('onlineTimerScreen');
  showChatFab();
  document.getElementById('onlineTimerRoundBadge').innerText = 'خول ' + (room.current_round || 1);
  document.getElementById('onlineTimerControlsHost').classList.toggle('hidden', !isHost);
  document.getElementById('onlineTimerWaitMsg').classList.toggle('hidden', isHost);
  syncOnlinePauseUI(room);
  startOnlineTimer(room);

  const key = room.code + '_' + room.round_start_at;
  if(room.starter_client_id && _shownStarterFor !== key){
    _shownStarterFor = key;
    const starter = onlinePlayers.find(p=>p.client_id === room.starter_client_id);
    const box = document.getElementById('starterAnnounceBox');
    if(starter && box){
      document.getElementById('starterAnnounceText').innerText = `${starter.name} دەست پێدەکات`;
      box.classList.remove('hidden','fading');
      clearTimeout(box._hideTimer);
      box._hideTimer = setTimeout(()=>{
        box.classList.add('fading');
        setTimeout(()=> box.classList.add('hidden'), 400);
      }, 6000);
    }
  }
}

function syncOnlinePauseUI(room){
  const overlay = document.getElementById('pauseOverlay');
  overlay.classList.toggle('active', !!room.is_paused);
  document.getElementById('resumeBtnMain').classList.toggle('hidden', !isHost);
  document.getElementById('resumeWaitText').classList.toggle('hidden', isHost);
  const pauseBtn = document.getElementById('onlinePauseBtn');
  if(pauseBtn){
    pauseBtn.innerHTML = room.is_paused
      ? `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`
      : `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
  }
}

async function toggleOnlinePause(){
  if(!isHost) return;
  const { data: room } = await sb.from('rooms').select('*').eq('code', onlineRoomCode).single();
  if(!room) return;
  if(!room.is_paused){
    await sb.from('rooms').update({ is_paused:true, pause_started_at: new Date().toISOString() }).eq('code', onlineRoomCode);
  } else {
    const pausedMs = Date.now() - new Date(room.pause_started_at).getTime();
    const newStart = new Date(new Date(room.round_start_at).getTime() + pausedMs).toISOString();
    await sb.from('rooms').update({ is_paused:false, pause_started_at:null, round_start_at:newStart }).eq('code', onlineRoomCode);
  }
}

/* ── کارتی تاک ── */
function showOnlineCard(room){
  showScreen('onlineCardScreen');
  showChatFab();
  _onlineGuessSubmitted = false;
  const amSpy = (room.spy_client_ids || []).includes(CLIENT_ID);
  document.getElementById('onlineCatBadge').innerText = room.current_category;
  document.getElementById('onlineRoundBadge').innerText = 'خول ' + (room.current_round||1);
  document.getElementById('onlineRoleText').innerText = amSpy ? 'سیخور' : 'وشە';
  document.getElementById('onlineSecretWord').innerText = amSpy ? 'تۆ سیخوریت' : room.game_word;
  document.getElementById('onlineWordCard').classList.remove('flip');
  document.getElementById('onlineWaitingReady').classList.add('hidden');
  onlineCardOpened = false;
  onlineAlreadyReady = false;
  renderReadyStatus();
  document.getElementById('onlineForceStartBtn').classList.toggle('hidden', !isHost);
  if(isHost) lockForceStartButton(10);
  if(!pingInterval) startPingLoop();
}

function renderReadyStatus(){
  const box = document.getElementById('onlineReadyStatusBox');
  if(!box) return;
  box.innerHTML = '';
  onlinePlayers.forEach(p=>{
    const ready = p.vote_for === 'READY';
    const canKick = isHost && p.client_id !== CLIENT_ID;
    const disc = isStale(p.last_seen_at, STALE_MS);
    const slot = document.createElement('div');
    slot.className = 'ready-slot' + (ready ? ' is-ready' : '') + (disc ? ' is-disconnected' : '');
    slot.setAttribute('data-client', p.client_id);
    const pingMs = p.ping_ms || 0;
    slot.innerHTML = `
      <div class="ready-av-wrap">
        ${canKick ? `<div class="ready-kick" onclick="event.stopPropagation();vib('medium');kickPlayer('${p.client_id}','${p.name}')">✕</div>` : ''}
<div class="ready-av ${vipFrameClass(p.frame_style)}"><div class="avatar-clip"><img src="${avatarUrl(p.avatar_seed)}" loading="lazy"></div></div>
        <div class="ready-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>
        <div class="disc-badge">🔴</div>
      </div>
       <div class="ready-name">${p.name}${p.is_verified ? ` ${verifiedBadgeSvg(15)}` : ''}</div>${championBadgeInline(p.user_id)}
      <div class="ready-ping ${pingClass(pingMs)}" data-ping="${p.client_id}">${pingMs>0?pingMs+' ms':'...'}</div>`;
    box.appendChild(slot);
  });
}

/* نوێکردنەوەی تەنها دۆخی ئامادەبوون — بەبێ ری‌ڕێندەری دووبارەی وێنە و ناو */
function updateReadyDom(clientId, isReady){
  document.querySelectorAll(`.ready-slot[data-client="${clientId}"]`).forEach(el=>{
    el.classList.toggle('is-ready', isReady);
  });
}

let forceStartLockTimer = null;
function lockForceStartButton(seconds){
  const btn = document.getElementById('onlineForceStartBtn');
  if(!btn) return;
  clearInterval(forceStartLockTimer);
  let remain = seconds;
  btn.classList.add('force-start-lock');
  btn.innerText = `دەستپێکردن بەبێ چاوەڕوانی (${remain})`;
  forceStartLockTimer = setInterval(()=>{
    remain--;
    if(remain <= 0){
      clearInterval(forceStartLockTimer);
      btn.classList.remove('force-start-lock');
      btn.innerText = 'دەستپێکردن بەبێ چاوەڕوانی';
    } else {
      btn.innerText = `دەستپێکردن بەبێ چاوەڕوانی (${remain})`;
    }
  }, 1000);
}

async function confirmForceStart(){
  const notReady = onlinePlayers.filter(p=>p.vote_for!=='READY').map(p=>p.name).join('، ');
  const yes = await showModal({
    title:"دەستپێکردن بەبێ چاوەڕوانی",
    msg: notReady ? `ئەم کەسانە هێشتا ئامادە نین: ${notReady}. دڵنیایت دەست پێبکەیت؟` : "هەموو ئامادەن، دەست پێبکە.",
    icon:"warn", confirm:true
  });
  if(yes && isHost){
    await sb.from('room_players').update({ vote_for: null }).eq('room_code', onlineRoomCode);
    await sb.from('rooms').update({ round_start_at: new Date().toISOString() }).eq('code', onlineRoomCode);
  }
}
let onlineAlreadyReady = false;

function openOnlineCard(){ vib('medium'); onlineCardOpened = true; document.getElementById('onlineWordCard').classList.add('flip'); }
function closeOnlineCard(){
  vib('light');
  document.getElementById('onlineWordCard').classList.remove('flip');
  if(onlineCardOpened && !onlineAlreadyReady){
    markReady();
  }
}

async function markReady(){
  if(onlineAlreadyReady) return;
  onlineAlreadyReady = true;
  vib('medium');
  document.getElementById('onlineWaitingReady').classList.remove('hidden');
  await sb.from('room_players').update({ vote_for: 'READY' }).eq('room_code', onlineRoomCode).eq('client_id', CLIENT_ID);
}

async function hostStartRoundTimer(){
  const allIds = onlinePlayers.map(p=>p.client_id);
  onlineStarterBag = onlineStarterBag.filter(id => allIds.includes(id));
  if(onlineStarterBag.length === 0) onlineStarterBag = shuffleArray(allIds);
  const starterId = onlineStarterBag.shift();
  const starter = onlinePlayers.find(p=>p.client_id === starterId);
  await sb.from('rooms').update({
    round_start_at: new Date().toISOString(),
    starter_client_id: starter ? starter.client_id : null
  }).eq('code', onlineRoomCode);
}

async function checkAllReady(){
  if(!isHost) return;
  const { data } = await sb.from('rooms').select('status').eq('code', onlineRoomCode).single();
  if(!data || data.status !== 'playing') return;
  const { data: players } = await sb.from('room_players').select('*').eq('room_code', onlineRoomCode);
  if(players && players.length && players.every(p => p.vote_for === 'READY')){
    await sb.from('room_players').update({ vote_for: null }).eq('room_code', onlineRoomCode);
    await hostStartRoundTimer();
  }
}

function startOnlineTimer(room){
  clearInterval(roundTimerInterval);
  const endTime = new Date(room.round_start_at).getTime() + room.game_time*1000;

  if(room.is_paused){
    const pausedAt = new Date(room.pause_started_at).getTime();
    const left = Math.max(0, Math.round((endTime - pausedAt)/1000));
    updateOnlineTimerDisplay(left);
    return;
  }

  const tick = ()=>{
    const left = Math.max(0, Math.round((endTime - Date.now())/1000));
    updateOnlineTimerDisplay(left);
    if(left <= 0){
      clearInterval(roundTimerInterval);
      if(isHost){
        onlineScoringEnabled
          ? sb.from('rooms').update({ status:'voting' }).eq('code', onlineRoomCode)
          : sb.from('rooms').update({ status:'reveal' }).eq('code', onlineRoomCode);
      }
    }
  };
  tick();
  roundTimerInterval = setInterval(tick, 250);
}

function updateOnlineTimerDisplay(sec){
  const m = Math.floor(sec/60).toString().padStart(2,'0');
  const s = (sec%60).toString().padStart(2,'0');
  const el = document.getElementById('onlineTimer');
  if(el) el.innerText = `${m}:${s}`;
}
async function confirmEndOnlineRound(){
  const yes = await showModal({title:"کۆتایی خول", msg:"دەچیتە بەشی دەنگدان — ناچیتە دادگای مۆدی ئۆفڵاین.", icon:"warn", confirm:true});
  if(yes && isHost){
    clearInterval(roundTimerInterval);
    await sb.from('room_players').update({ vote_for: null }).eq('room_code', onlineRoomCode);
    await sb.from('rooms').update({ status: onlineScoringEnabled ? 'voting' : 'reveal' }).eq('code', onlineRoomCode);
  }
}

/* ── دەنگدان ── */
/* ── هاوکاتکردنی UI بۆ گۆڕانی لیستی یاریزانان (کیک/چوونەژوورەوە) ── */
function syncOnlinePlayerUI(){
  if(!document.getElementById('onlineCardScreen').classList.contains('hidden')) renderReadyStatus();
  if(!document.getElementById('onlineVotingScreen').classList.contains('hidden')) refreshOnlineVoteList();
}

/* ── دەنگدان ── */
function showOnlineVoting(room){
  showScreen('onlineVotingScreen');
  showChatFab();
  onlineSelectedVote = null;
  refreshOnlineVoteList();
  document.getElementById('onlineVoteBtn').innerText = 'دەنگدان';
  document.getElementById('onlineVoteBtn').classList.remove('ready');
}

function refreshOnlineVoteList(){
  const list = document.getElementById('onlineVoteList');
  if(!list) return;
  const prevSelected = onlineSelectedVote;
  list.innerHTML = '';
  let stillValid = false;
  onlinePlayers.forEach(p=>{
    if(p.client_id === CLIENT_ID) return;
     const themeClass = p.card_theme && p.card_theme!=='default' ? ' theme-'+p.card_theme : '';
    const div = document.createElement('div');
    div.className = 'dadga-suspect-item' + themeClass + cardBgClass(p) + (p.client_id === prevSelected ? ' selected' : '');
    div.setAttribute('style', cardBgStyle(p));
    if(p.client_id === prevSelected) stillValid = true;
    div.onclick = ()=>{ vib('light'); selectOnlineVote(p.client_id, div); };
    div.innerHTML = `<div class="dadga-suspect-avatar ${vipFrameClass(p.frame_style)}"><img src="${avatarUrl(p.avatar_seed)}"></div>
      <div class="dadga-suspect-name">${p.name}${p.is_verified ? ` ${verifiedBadgeSvg(18)}` : ''}${championBadgeInline(p.user_id)}</div>
      <div class="dadga-suspect-check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>`;
    list.appendChild(div);
  });
  if(!stillValid){
    onlineSelectedVote = null;
    document.getElementById('onlineVoteBtn').classList.remove('ready');
  }
}
function selectOnlineVote(id, el){
  onlineSelectedVote = id;
  document.querySelectorAll('#onlineVoteList .dadga-suspect-item').forEach(x=>x.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('onlineVoteBtn').classList.add('ready');
}
async function submitOnlineVote(){
  if(!onlineSelectedVote) return;
  vib();
  await sb.from('room_players').update({ vote_for: onlineSelectedVote }).eq('room_code', onlineRoomCode).eq('client_id', CLIENT_ID);
  document.getElementById('onlineVoteBtn').innerText = 'چاوەڕوانی یاریزانانی تر...';
  document.getElementById('onlineVoteBtn').classList.remove('ready');
}

async function checkAllVoted(){
  if(!isHost) return;
  const { data: room } = await sb.from('rooms').select('status').eq('code', onlineRoomCode).single();
  if(!room || room.status !== 'voting') return;
  const { data: players } = await sb.from('room_players').select('*').eq('room_code', onlineRoomCode);
  const activeVoters = (players||[]).filter(p => !isStale(p.last_seen_at, STALE_MS));
  if(players && players.length && activeVoters.length && activeVoters.every(p => p.vote_for)){
    const tally = {};
    players.forEach(p=>{ if(p.vote_for) tally[p.vote_for] = (tally[p.vote_for]||0)+1; });
    const sorted = Object.entries(tally).sort((a,b)=>b[1]-a[1]);
    const accusedId = sorted[0][0];

    const { data: roomRow } = await sb.from('rooms').select('spy_client_ids').eq('code', onlineRoomCode).single();
    const spyIds = roomRow.spy_client_ids || [];

    if(spyIds.includes(accusedId)){
      // سیخور دۆزرایەوە — شانسی ئاخری بدەرێ پێش بڕیاردان
      await sb.from('rooms').update({ status:'lastchance', accused_id: accusedId, spy_guess_correct: null }).eq('code', onlineRoomCode);
      return;
    }

    // بێتاوان دەستگیرکرا — سیخور ڕاستەوخۆ براوەیە، پێویست بە شانس نییە
    await finalizeOnlineRound(accusedId, true, spyIds, players);
  }
}

async function finalizeOnlineRound(accusedId, spyWon, spyIds, players){
  onlineLastRoundPoints = {};

  for(const p of players){
    const isSpy = spyIds.includes(p.client_id);
    let delta = 0;

    if(isSpy){
      if(spyWon) delta += 3;
    } else {
      if(!spyWon) delta += 2;
      if(p.vote_for && !spyIds.includes(p.vote_for)) delta -= 1;
    }

    onlineLastRoundPoints[p.client_id] = delta;

    if(delta !== 0){
      await sb.from('room_players').update({ score: (p.score||0) + delta }).eq('room_code', onlineRoomCode).eq('client_id', p.client_id);
    }
  }

  const statUserIds = players.filter(p=>p.user_id).map(p=>p.user_id);
  if(statUserIds.length){
    const { data: userRows } = await sb.from('app_users').select('id,total_games,spy_wins,detective_wins').in('id', statUserIds);
    const userStatMap = {};
    (userRows||[]).forEach(u=>{ userStatMap[u.id] = u; });
    for(const p of players){
      const su = p.user_id ? userStatMap[p.user_id] : null;
      if(!su) continue;
      const isSpy = spyIds.includes(p.client_id);
      const statUpdates = { total_games: (su.total_games||0) + 1 };
      if(isSpy && spyWon){
        statUpdates.spy_wins = (su.spy_wins||0) + 1;
      }
      if(!isSpy && !spyWon && p.vote_for && spyIds.includes(p.vote_for)){
        statUpdates.detective_wins = (su.detective_wins||0) + 1;
      }
      await sb.from('app_users').update(statUpdates).eq('id', p.user_id);
    }
  }

  window._lastAccusedId = accusedId;
  window._lastSpyWon = spyWon;

  await sb.from('room_players').update({ vote_for: null }).eq('room_code', onlineRoomCode);
  await sb.from('rooms').update({ status:'reveal', accused_id: null, spy_guess_correct: null }).eq('code', onlineRoomCode);
}
/* ── ئاشکراکردن ── */
async function showOnlineReveal(room){
  if(!room.scoring_enabled) onlineLastRoundPoints = {};
  showScreen('onlineRevealScreen');
  showChatFab();
  const spies = onlinePlayers.filter(p=>(room.spy_client_ids||[]).includes(p.client_id));
  document.getElementById('onlineRevealWord').innerText = room.game_word;
  document.getElementById('onlineRevealCat').innerText = 'جۆری وشەکە: ' + room.current_category;
  const spiesBox = document.getElementById('onlineRevealSpies');
  if(spies.length === 0){
    spiesBox.innerHTML = '<div class="no-spies-badge">نەدۆزرایەوە</div>';
  } else {
    spiesBox.innerHTML = spies.map((p,i)=>{
      const theme = p.card_theme && p.card_theme!=='default' ? ' theme-'+p.card_theme : '';
      const verifiedIco = p.is_verified ? ` ${verifiedBadgeSvg(16)}` : '';
      return `
        <div class="spy-card${theme}${cardBgClass(p)}" style="animation-delay:${i*0.12}s;${cardBgStyle(p)}">
          <div class="spy-avatar-wrap"><img src="${avatarUrl(p.avatar_seed)}" loading="lazy"></div>
          <div class="spy-card-info">
            <div class="spy-card-name">${p.name}${verifiedIco}${championBadgeInline(p.user_id)}</div>
            <div class="spy-card-tag"><svg viewBox="0 0 24 24"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/></svg>سیخور</div>
          </div>
          <div class="spy-shield"><svg viewBox="0 0 24 24"><path d="M12 2L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-5z"/></svg></div>
        </div>`;
    }).join('');
  }
  const nextBtn = document.getElementById('onlineNextRoundBtn');
  nextBtn.innerText = `خولی ${(room.current_round || 1) + 1}`;
  nextBtn.classList.toggle('hidden', !isHost);

  const { data: players } = await sb.from('room_players').select('*').eq('room_code', onlineRoomCode).order('score', { ascending:false });
  _onlineScoresSnapshot = players || [];
  _onlineScoresRound = room.current_round || 1;

  setTimeout(() => openOnlineScores(_onlineScoresSnapshot, _onlineScoresRound), 600);
}

function openOnlineScoresManual(){
  vib();
  openOnlineScores(_onlineScoresSnapshot, _onlineScoresRound);
}

function renderOnlineScoresSheet(players, round){
  document.getElementById('scoresRoundBadge').innerText = `خول ${round}`;
  const sorted = [...players].sort((a,b)=> (b.score||0) - (a.score||0));
  const list = document.getElementById('scoresList');
  list.innerHTML = '';
  sorted.forEach((p, i) => {
    const rank = i + 1;
    const rankClass = rank <= 3 ? ` rank-${rank}` : '';
    const rankSymbol = rank === 1 ? '١' : rank === 2 ? '٢' : rank === 3 ? '٣' : rank + '';
    const newPts = onlineLastRoundPoints[p.client_id];
    const div = document.createElement('div');
    div.className = 'scores-row' + rankClass;
    div.style.animationDelay = (i * 0.06) + 's';
    if(cardBgStyle(p)) div.setAttribute('style', div.getAttribute('style')+cardBgStyle(p));
    div.innerHTML = `
  ${newPts !== undefined && newPts !== 0 ? `<div class="scores-new-pts" style="${newPts < 0 ? 'background:linear-gradient(135deg,#ff3b3b,#c62828);box-shadow:0 3px 10px rgba(255,59,59,.35);' : newPts >= 2 ? 'background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 3px 10px rgba(34,197,94,.35);' : 'background:linear-gradient(135deg,#ffd400,#ffbc00);color:#111;box-shadow:0 3px 10px rgba(255,188,0,.35);'}">${newPts > 0 ? '+' : ''}${newPts}${newPts < 0 ? ' ✗' : ' ✓'}</div>` : ''}
      <div class="scores-rank">${rankSymbol}</div>
      <div class="scores-avatar">
        <img src="${avatarUrl(p.avatar_seed)}" loading="lazy">
      </div>
      <div class="scores-name">${p.name}</div>
      <div class="scores-pts-wrap">
        <div class="scores-pts">${p.score||0}</div>
        <div class="scores-pts-label">خال</div>
      </div>`;
    list.appendChild(div);
  });
}

function openOnlineScores(players, round){
  renderOnlineScoresSheet(players, round);
  document.getElementById('scoresResetBtn').classList.add('hidden');
  document.getElementById('scoresOverlay').classList.add('active');
}
async function nextOnlineRound(){
  await sb.from('rooms').update({ status:'lobby', current_round: (await sb.from('rooms').select('current_round').eq('code',onlineRoomCode).single()).data.current_round + 1 }).eq('code', onlineRoomCode);
}
/* ئەم فایلانە پێویستیان بە _screens زیادکردنە بۆ ئەوەی showScreen بتوانێت بیانبینێت */
_screens.push('onlineChooseScreen','onlineLobbyScreen','onlineCardScreen','onlineTimerScreen','onlineVotingScreen','onlineLastChanceScreen','onlineRevealScreen');
