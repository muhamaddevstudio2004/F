setTimeout(() => {
    const s = document.getElementById('splash');
    s.style.opacity = '0';
    s.style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
        s.style.display = 'none';
        s.style.pointerEvents = 'none';
        // ── splash2 نیشان بدە ──
        const s2 = document.getElementById('splash2');
        s2.style.display = 'block';
        s2.style.opacity = '0';
        s2.style.transition = 'opacity 0.5s ease';
        setTimeout(() => s2.style.opacity = '1', 50);
    }, 600);
}, 2500);

function closeSplash2() {
    const s2 = document.getElementById('splash2');
    s2.style.opacity = '0';
    s2.style.transition = 'opacity 0.5s ease';
    setTimeout(() => s2.style.display = 'none', 500);
}




// ══════════ AUDIO ENGINE ══════════
const AC = new (window.AudioContext || window.webkitAudioContext)();

function resumeAC() {
  if (AC.state === 'suspended') AC.resume();
}
document.addEventListener('touchstart', resumeAC, { once: true });
document.addEventListener('click', resumeAC, { once: true });

function playTone(freq, type, duration, vol = 0.15, delay = 0) {
  try {
    const osc = AC.createOscillator();
    const gain = AC.createGain();
    osc.connect(gain);
    gain.connect(AC.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, AC.currentTime + delay);
    gain.gain.setValueAtTime(0, AC.currentTime + delay);
    gain.gain.linearRampToValueAtTime(vol, AC.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + delay + duration);
    osc.start(AC.currentTime + delay);
    osc.stop(AC.currentTime + delay + duration + 0.05);
  } catch(e) {}
}

function sndClick() { playTone(600, 'sine', 0.06, 0.12); }
function sndFlip() {
  playTone(300, 'sine', 0.08, 0.08);
  playTone(500, 'sine', 0.12, 0.12, 0.06);
  playTone(700, 'sine', 0.1, 0.1, 0.12);
}
function sndSpy() {
  playTone(200, 'sawtooth', 0.15, 0.1);
  playTone(180, 'sawtooth', 0.2, 0.12, 0.1);
  playTone(150, 'sawtooth', 0.25, 0.1, 0.22);
}
function sndTick() { playTone(880, 'square', 0.04, 0.06); }
function sndUrgentTick() {
  playTone(1100, 'square', 0.05, 0.09);
  playTone(1300, 'square', 0.04, 0.07, 0.05);
}
function sndTimerEnd() {
  playTone(440, 'sawtooth', 0.1, 0.12);
  playTone(330, 'sawtooth', 0.15, 0.12, 0.12);
  playTone(220, 'sawtooth', 0.2, 0.1, 0.26);
}
function sndVote() {
  playTone(500, 'sine', 0.08, 0.12);
  playTone(650, 'sine', 0.08, 0.1, 0.07);
}
function sndWin() { [523,659,784,1047].forEach((f,i) => playTone(f,'sine',0.2,0.13,i*0.1)); }
function sndLose() { [400,350,280,200].forEach((f,i) => playTone(f,'sawtooth',0.2,0.1,i*0.1)); }
function sndBtn() { playTone(440, 'sine', 0.06, 0.1); }

// ══════════ DATA ══════════
const CATEGORIES = [
  {
    id:'food', name:'خواردن', color:'#ff8c42',
    icon:`<svg viewBox="0 0 40 40" fill="none"><path d="M10 8v10c0 4.418 4.477 8 10 8s10-3.582 10-8V8" stroke="#ff8c42" stroke-width="2" stroke-linecap="round"/><path d="M20 26v6M14 32h12" stroke="#ff8c42" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="18" r="5" stroke="#ff8c42" stroke-width="1.5"/></svg>`,
    words:['پیزا','بەرگر','مەستاو','کباب','بریانی','دۆلمە','سەموون','باقلاوە','برنج','ئاو','جبس','فەلافەل','پرتەقاڵ','مۆتە','شاورمە','ماسی','مۆز','سێو','شیر','چای']
  },
  {
    id:'animal', name:'گیانەوەر', color:'#38d9b4',
    icon:`<svg viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="22" rx="12" ry="9" stroke="#38d9b4" stroke-width="2"/><circle cx="20" cy="14" r="6" stroke="#38d9b4" stroke-width="2"/><path d="M14 8c-2-3-6-2-5 2M26 8c2-3 6-2 5 2" stroke="#38d9b4" stroke-width="1.5" stroke-linecap="round"/><circle cx="17" cy="14" r="1.5" fill="#38d9b4"/><circle cx="23" cy="14" r="1.5" fill="#38d9b4"/></svg>`,
    words:['مەیمون','تیمساح','فیل','زەرافە','دۆلفین','قرش','گورگ','رێوی','مار','ئەسپ','مانگا','مشک','سەگ','پشیلە','شێر','پڵنگ','ورچ','پاندا','کەنگەر','کۆتر']
  },
  {
    id:'sport', name:'وەرزش', color:'#4d8cff',
    icon:`<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="12" stroke="#4d8cff" stroke-width="2"/><path d="M8.5 15h23M8.5 25h23" stroke="#4d8cff" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="20" cy="20" rx="5" ry="12" stroke="#4d8cff" stroke-width="1.5"/></svg>`,
    words:['تایرە','یارئ شەبەکە','تێنس','زۆرانبازی','مەلەکردن','بەرشەلۆنە','یاریگا','نابژیوان','رۆبێرتۆ کارلوس','ریـال','رۆنالدۆ','مودەڕیب','کارتی سووری','لاپچین','گۆڵ','قازانج','یانەی هەولێر','فریز']
  },
  {
    id:'tech', name:'تەکنەلۆجی', color:'#a78bfa',
    icon:`<svg viewBox="0 0 40 40" fill="none"><rect x="6" y="10" width="28" height="18" rx="3" stroke="#a78bfa" stroke-width="2"/><path d="M14 32h12M20 28v4" stroke="#a78bfa" stroke-width="2" stroke-linecap="round"/><path d="M13 18h4M19 18h8" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    words:['مۆبایل','لاپتۆپ','تابلێت','درۆن','رۆبۆت','کامێرا','شاشە','کیبۆرد','ئینتەرنێت','پلەی دوو','وایەر شەحن','پاتری','سناپ','تیک تۆک','هاردسک','ئیفۆن','وێبسایت','یوتیوب']
  },
  {
    id:'job', name:'پیشە', color:'#fbbf24',
    icon:`<svg viewBox="0 0 40 40" fill="none"><rect x="10" y="16" width="20" height="16" rx="2" stroke="#fbbf24" stroke-width="2"/><path d="M15 16v-4a5 5 0 0110 0v4" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/><path d="M10 23h20" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    words:['دکتۆر','مامۆستا','سەرتاش','ئەندازیار','پەرستار','ئاکتەر','خوێندکار','دادگا','پۆلیس','سەرۆک','کەناس','وتاربێژ','نووسەر','خۆجە','بازرگان','شۆفێر','میمار','کژێر']
  },
  {
    id:'object', name:'کەلوپەل', color:'#f472b6',
    icon:`<svg viewBox="0 0 40 40" fill="none"><rect x="8" y="12" width="24" height="18" rx="2" stroke="#f472b6" stroke-width="2"/><path d="M8 18h24" stroke="#f472b6" stroke-width="1.5" stroke-linecap="round"/><circle cx="14" cy="25" r="2" stroke="#f472b6" stroke-width="1.5"/><path d="M20 23h8M20 27h6" stroke="#f472b6" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    words:['کەرەستە','چادر','سەندوق','قوفل','کتێب','خازنە','سووچ','دووری','نووسەر','ساتک','میز','کورسی','پەنجەرە','شووشە','فرێزەر','بالیف','سەبەت','ئەسپیرین']
  },
  {
    id:'place', name:'شوێن', color:'#34d399',
    icon:`<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="16" r="7" stroke="#34d399" stroke-width="2"/><path d="M20 23v10M13 38h14" stroke="#34d399" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="16" r="2.5" fill="#34d399"/></svg>`,
    words:['بازار','نەخۆشخانە','قوتابخانە','فڕۆکەخانە','پارک','مزگەوت','سینەما','رستەران','هۆتێل','پرد','گوندێک','شار','دەریا','چیا','زەوی','کتێبخانە','ستەدیۆم','زیندان']
  },
  {
    id:'character', name:'کەسایەتی', color:'#fbbf24',
    icon:`<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="13" r="7" stroke="#fbbf24" stroke-width="2"/><path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/></svg>`,
    words:['دکتۆر','مامۆستا','میمار','ئەندازیار','پەرستار','ئاکتەر','خوێندکار','سەرکردە','بەڕێوەبەر','دادگا','پۆلیس','مووسیقار','نووسەر','وەرزشکار','کارگێڕ','دیپلۆمات','زانا','تاجر']
  }
];

// ── STATE ──
let G = {
  players: [], catIds: [], word: '',
  spyIdx: -1, roles: [], curPlayer: 0,
  votes: {}, curVoter: 0,
  timerInterval: null, timerSec: 60,
};
let selectedVote = null;

// ── INIT ──
function init() {
  G.players = ['','','',''];
  renderPlayers();
  renderCats();
}

function renderPlayers() {
  const el = document.getElementById('player-list');
  el.innerHTML = '';
  G.players.forEach((name, i) => {
    const row = document.createElement('div');
    row.className = 'player-row';
    row.style.animationDelay = (i * 0.05) + 's';
    row.innerHTML = `
      <div class="player-num">${i+1}</div>
      <input type="text" placeholder="ناوی یاریزانی ${i+1}" value="${name}"
        oninput="G.players[${i}]=this.value" />
      ${G.players.length > 2 ? `<button class="del-btn" onclick="removePlayer(${i}); sndClick();">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>` : ''}
    `;
    el.appendChild(row);
  });
}

function addPlayer() {
  if (G.players.length >= 10) return;
  sndClick();
  G.players.push('');
  renderPlayers();
  setTimeout(() => {
    const inputs = document.querySelectorAll('#player-list input');
    inputs[inputs.length-1].focus();
  }, 60);
}

function removePlayer(i) {
  if (G.players.length <= 2) return;
  G.players.splice(i, 1);
  renderPlayers();
}

function renderCats() {
  const grid = document.getElementById('cats-grid');
  grid.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('div');
    btn.className = 'cat-btn' + (G.catIds.includes(cat.id) ? ' selected' : '');
    btn.innerHTML = `
      <div class="cat-check">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="cat-icon">${cat.icon}</div>
      <div class="cat-name">${cat.name}</div>
    `;
    btn.onclick = () => {
      sndClick();
      const i = G.catIds.indexOf(cat.id);
      if (i === -1) G.catIds.push(cat.id);
      else G.catIds.splice(i, 1);
      renderCats();
    };
    grid.appendChild(btn);
  });
}

// ── START ──
function startGame() {
  sndBtn();
  const inputs = document.querySelectorAll('#player-list input');
  inputs.forEach((inp, i) => G.players[i] = inp.value.trim());
  const valid = G.players.filter(p => p.length > 0);
  if (valid.length < 2) { alert('لانیکەم ٢ یاریزان پێویستە!'); return; }
  if (G.catIds.length === 0) { alert('لانیکەم یەک جۆر هەڵبژێرە!'); return; }

  G.players = valid;
  const allWords = CATEGORIES
    .filter(c => G.catIds.includes(c.id))
    .flatMap(c => c.words);
  G.word = allWords[Math.floor(Math.random() * allWords.length)];
  G.spyIdx = Math.floor(Math.random() * G.players.length);
  G.roles = G.players.map((_, i) => i === G.spyIdx ? 'spy' : 'normal');
  G.curPlayer = 0;
  G.votes = {};
  G.curVoter = 0;
  showPass(0);
}

// ── PASS ──
function showPass(idx) {
  G.curPlayer = idx;
  document.getElementById('pass-name').textContent = G.players[idx];
  show('s-pass');
}

// ── CARD FLIP ──
function showCard() {
  sndClick();
  const idx = G.curPlayer;
  const isSpy = G.roles[idx] === 'spy';

  const prog = document.getElementById('prog-dots');
  prog.innerHTML = '';
  G.players.forEach((_, i) => {
    const s = document.createElement('div');
    s.className = 'prog-seg' + (i < idx ? ' done' : i === idx ? ' active' : '');
    prog.appendChild(s);
  });

  const flipCard = document.getElementById('flip-card');
  flipCard.classList.remove('flipped');

  const back = document.getElementById('flip-back');
  back.className = 'flip-back ' + (isSpy ? 'spy' : 'normal');

  const badge = document.getElementById('reveal-badge');
  const word  = document.getElementById('reveal-word');
  const hint  = document.getElementById('reveal-hint');
  const warn  = document.getElementById('card-warn-text');
  const btn   = document.getElementById('card-next-btn');

  if (isSpy) {
    badge.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M4 6c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z" fill="currentColor"/>
      </svg> فریودەر`;
    word.textContent = 'تۆ فریودەریت!';
    hint.textContent = 'وشەکە نازانی — بفریوێنە';
    warn.textContent = 'زیرەکانە قسە بکە — وانەیەک بدە';
  } else {
    badge.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg> وشەی نهێنی`;
    word.textContent = G.word;
    hint.textContent = 'بیناسانەوە — فریودەرەکە بدزە';
    warn.textContent = 'بیبینە و بیرت لێ بخەوە — کەسی تر نەبینێت';
  }

  const isLast = idx === G.players.length - 1;
  btn.textContent = isLast ? 'دەستبکە بە گفتوگۆ' : `دەیدەینە دەستی ${G.players[idx+1]}`;
  btn.classList.remove('visible');

  show('s-card');
}

function flipCard() {
  const flipCard = document.getElementById('flip-card');
  if (flipCard.classList.contains('flipped')) return;

  sndFlip();
  flipCard.classList.add('flipped');

  const isSpy = G.roles[G.curPlayer] === 'spy';
  setTimeout(() => {
    if (isSpy) sndSpy();
  }, 350);

  setTimeout(() => {
    document.getElementById('card-next-btn').classList.add('visible');
  }, 700);
}

function nextPlayer() {
  sndBtn();
  if (G.curPlayer < G.players.length - 1) {
    showPass(G.curPlayer + 1);
  } else {
    startDiscuss();
  }
}

// ── DISCUSS ──
function startDiscuss() {
  G.timerSec = 60;
  updateTimer();
  show('s-discuss');
  if (G.timerInterval) clearInterval(G.timerInterval);
  G.timerInterval = setInterval(() => {
    G.timerSec--;
    updateTimer();

    if (G.timerSec <= 10 && G.timerSec > 0) {
      sndUrgentTick();
    } else if (G.timerSec > 10) {
      if (G.timerSec % 5 === 0) sndTick();
    }

    if (G.timerSec <= 0) {
      clearInterval(G.timerInterval);
      sndTimerEnd();
      setTimeout(() => goToVote(), 600);
    }
  }, 1000);
}

const CIRCUMFERENCE = 2 * Math.PI * 54;

function updateTimer() {
  const numEl = document.getElementById('timer-num');
  numEl.textContent = G.timerSec;
  numEl.classList.remove('tick');
  void numEl.offsetWidth;
  numEl.classList.add('tick');

  const offset = CIRCUMFERENCE * (1 - G.timerSec / 60);
  document.getElementById('timer-prog').style.strokeDashoffset = offset;
  const clr = G.timerSec > 20 ? '#ff4d6d' : '#ff8c42';
  document.getElementById('timer-prog').style.stroke = clr;
  numEl.style.color = clr;
}

function skipTimer() {
  sndBtn();
  if (G.timerInterval) clearInterval(G.timerInterval);
  goToVote();
}

function goToVote() {
  if (G.timerInterval) clearInterval(G.timerInterval);
  showVote(0);
}

// ── VOTE ──
function showVote(voterIdx) {
  G.curVoter = voterIdx;
  selectedVote = null;
  const voter = G.players[voterIdx];
  document.getElementById('voter-tag').textContent = `${voter} — دەنگ دەدات`;

  const list = document.getElementById('vote-list');
  list.innerHTML = '';
  G.players.forEach(name => {
    if (name === voter) return;
    const item = document.createElement('div');
    item.className = 'vote-item';
    item.innerHTML = `<span>${name}</span><div class="vote-radio"></div>`;
    item.onclick = () => {
      sndClick();
      list.querySelectorAll('.vote-item').forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');
      selectedVote = name;
      document.getElementById('vote-btn').disabled = false;
    };
    list.appendChild(item);
  });

  document.getElementById('vote-btn').disabled = true;
  show('s-vote');
}

function confirmVote() {
  if (!selectedVote) return;
  sndVote();
  G.votes[G.players[G.curVoter]] = selectedVote;
  const next = G.curVoter + 1;
  if (next < G.players.length) showVote(next);
  else showTally();
}

// ── TALLY ──
function showTally() {
  const counts = {};
  G.players.forEach(p => counts[p] = 0);
  Object.values(G.votes).forEach(v => counts[v] = (counts[v]||0) + 1);

  const max = Math.max(...Object.values(counts));
  const winners = Object.keys(counts).filter(p => counts[p] === max);

  const rows = document.getElementById('tally-rows');
  rows.innerHTML = '';
  G.players.forEach((p, idx) => {
    const pct = Math.round(counts[p] / G.players.length * 100);
    const row = document.createElement('div');
    row.className = 'tally-row';
    row.style.animationDelay = (idx * 0.08) + 's';
    row.innerHTML = `
      <div class="tally-name">${p}</div>
      <div class="tally-track">
        <div class="tally-fill" style="width:0%" data-pct="${pct}">
          ${counts[p] > 0 ? counts[p] : ''}
        </div>
      </div>
    `;
    rows.appendChild(row);
  });
  setTimeout(() => {
    rows.querySelectorAll('.tally-fill').forEach(b => b.style.width = b.dataset.pct + '%');
  }, 80);

  const win = document.getElementById('tally-winner');
  win.textContent = winners.length === 1
    ? `زیاترین دەنگ: ${winners[0]}`
    : `یەکسانی دەنگ — دووبارە دەنگدان پێویستە`;

  show('s-tally');
}

// ── RESULT ──
function showResult() {
  sndBtn();
  const counts = {};
  G.players.forEach(p => counts[p] = 0);
  Object.values(G.votes).forEach(v => counts[v] = (counts[v]||0) + 1);
  const max = Math.max(...Object.values(counts));
  const accused = Object.keys(counts).filter(p => counts[p] === max);
  const spyName = G.players[G.spyIdx];
  const caught = accused.length === 1 && accused[0] === spyName;

  const hero = document.getElementById('result-hero');
  hero.className = 'result-hero ' + (caught ? 'win' : 'lose');

  const iconSvg = document.getElementById('result-icon-svg');
  if (caught) {
    iconSvg.innerHTML = `<path d="M8 20l8 8 16-16" stroke="#38d9b4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else {
    iconSvg.innerHTML = `
      <circle cx="20" cy="16" r="6" stroke="#ff4d6d" stroke-width="2.5"/>
      <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#ff4d6d" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M28 10l4 4M32 10l-4 4" stroke="#ff4d6d" stroke-width="2" stroke-linecap="round"/>`;
  }

  document.getElementById('result-title').textContent = caught ? 'فریودەرەکە دەستگیر کرا!' : 'فریودەرەکە بردی!';
  document.getElementById('result-sub').textContent = caught
    ? `${spyName} فریودەر بوو — یاریزانە باشەکان بردن!\nوشەکە: « ${G.word} »`
    : `${spyName} فریودەر بوو — هەموویانی فریو دا!\nوشەکە: « ${G.word} »`;

  const list = document.getElementById('reveal-list');
  list.innerHTML = '';
  G.players.forEach((p, i) => {
    const isSpy = G.roles[i] === 'spy';
    const row = document.createElement('div');
    row.className = 'reveal-row-item';
    row.style.animationDelay = (i * 0.07) + 's';
    row.innerHTML = `
      <span class="rr-name">${p}</span>
      <span class="rr-word">${isSpy ? '—' : G.word}</span>
      <span class="rr-role ${isSpy ? 'role-spy' : 'role-normal'}">${isSpy ? 'فریودەر' : 'باش'}</span>
    `;
    list.appendChild(row);
  });

  show('s-result');

  setTimeout(() => {
    if (caught) { sndWin(); spawnConfetti(); }
    else sndLose();
  }, 300);
}

// ── CONFETTI ──
function spawnConfetti() {
  const wrap = document.getElementById('confetti-wrap');
  wrap.innerHTML = '';
  const colors = ['#ff4d6d','#ff8c42','#38d9b4','#4d8cff','#fbbf24','#f472b6'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random()*100}%;
      top: -10px;
      background: ${colors[Math.floor(Math.random()*colors.length)]};
      width: ${6 + Math.random()*6}px;
      height: ${6 + Math.random()*6}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${1.5 + Math.random()*2}s;
      animation-delay: ${Math.random()*0.8}s;
    `;
    wrap.appendChild(piece);
  }
  setTimeout(() => { wrap.innerHTML = ''; }, 4000);
}

function restartSame() {
  sndBtn();
  const allWords = CATEGORIES
    .filter(c => G.catIds.includes(c.id))
    .flatMap(c => c.words);
  G.word = allWords[Math.floor(Math.random() * allWords.length)];
  G.spyIdx = Math.floor(Math.random() * G.players.length);
  G.roles = G.players.map((_, i) => i === G.spyIdx ? 'spy' : 'normal');
  G.curPlayer = 0; G.votes = {}; G.curVoter = 0;
  showPass(0);
}

function goSetup() { sndBtn(); show('s-setup'); }

// ── UTILS ──
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById(id).scrollTop = 0;
}

init();