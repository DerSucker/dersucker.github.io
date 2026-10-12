/* Rasta-Man – Jump & Run
   by Martin Sucker | github.com/DerSucker | www.martinsucker.de
   Reines HTML/CSS/JS für GitHub Pages, keine externen Abhängigkeiten. */
(function () {
  'use strict';

  // ---------- Grundkonstanten ----------
  var T = 30, VW = 640, VH = 360, ROWS = 12, SC = 2;
  var GRAV = 1500, MAXFALL = 720, RUN = 195, JUMPV = 645;
  var PW = 22, PH = 42;
  var FONT = '"Special Elite","American Typewriter","Courier New",Courier,monospace';

  var LEVELS = [
    { name: 'Negril',         code: '',          theme: 'beach',    sky: 'sunset' },
    { name: 'Montego Bay',    code: 'IRIE',      theme: 'beach',    sky: 'day' },
    { name: 'Ocho Rios',      code: 'RIDDIM',    theme: 'jungle',   sky: 'day' },
    { name: 'Port Antonio',   code: 'ONELOVE',   theme: 'jungle',   sky: 'dusk' },
    { name: 'Treasure Beach', code: 'DUBWISE',   theme: 'beach',    sky: 'dusk' },
    { name: 'Nine Mile',      code: 'YAMAN',     theme: 'hills',    sky: 'day' },
    { name: 'Blue Mountains', code: 'ROOTSROCK', theme: 'mountain', sky: 'mist' },
    { name: 'Trench Town',    code: 'SKANK',     theme: 'city',     sky: 'day' },
    { name: 'Spanish Town',   code: 'BIGUP',     theme: 'city',     sky: 'sunset' },
    { name: 'Kingston',       code: 'JAHBLESS',  theme: 'city',     sky: 'night' }
  ];

  var SKY = {
    day:    ['#3a9df0', '#bfe8ff'],
    sunset: ['#5b2a86', '#ff9a5a'],
    dusk:   ['#1f2a66', '#e07a5f'],
    mist:   ['#7f97ab', '#e4edf1'],
    night:  ['#04071a', '#1d2a5c']
  };
  var GROUND = {
    beach:    { top: '#f4d68e', body: '#d6a45a', dot: '#b98840' },
    jungle:   { top: '#3cb043', body: '#6b4226', dot: '#4f2f1a' },
    hills:    { top: '#72c23f', body: '#80562f', dot: '#5f3e20' },
    mountain: { top: '#5b9a45', body: '#6d6f78', dot: '#55575f' },
    city:     { top: '#9aa0aa', body: '#575c66', dot: '#454a53' }
  };


  // ---------- Sprache (DE/EN) – Auswahl wird wie auf der Hauptseite unter 'lang' gespeichert ----------
  var I18N = {
    de: {
      light: '☀ Lightmode', dark: '☾ Darkmode',
      back: 'Startseite', backAria: 'Startseite',
      role: 'Jump & Run durch zehn Orte auf Jamaika', rotate: 'Bitte Gerät quer halten ↻',
      cheatInfo: 'Ab Level 2 wird am Levelanfang ein Code angezeigt. Damit startest du beim nächsten Mal direkt dort.', go: 'Los',
      hControls: 'Steuerung', cRun: 'Laufen', cRunD: '← → oder A / D', cJump: 'Springen / Fliegen', cJumpD: 'Leertaste, ↑ oder W (gedrückt halten = höher)',
      cThrow: 'Cookie werfen', cThrowD: 'X, K oder Shift', cSys: 'Pause / Sound / Vollbild', cSysD: 'P bzw. Esc / M / F',
      cMobD: 'Eingeblendete Tasten. Im Vollbild liegen sie über dem Spiel.',
      hItems: 'Items & Gegner', iLeaf: 'Hanfblatt', iLeafD: 'Sammeln. 50 Hanfblätter = 1 Extraleben.', iJointD: '10 Sekunden fliegen: Sprungtaste gedrückt halten.',
      iCookieD: '5 Cookies zum Werfen auf Gegner.', iPlant: 'Hanfpflanze', iPlantD: '10 Sekunden unbesiegbar.', iBeer: 'Bier', iBeerD: 'PowerDown: 3 Sekunden kotzen und bewegungsunfähig.',
      iStone: 'Steinblöcke', iStoneD: 'Von unten zertrümmern. Manche verstecken Items.', iCop: 'Polizei', iCopD: 'Einfacher Gegner. Draufspringen!',
      iPol: 'Politiker', iPolD: 'Mittlerer Gegner. Wirft mit Büchern.', legal: 'Impressum & Datenschutz',
      themeAria: 'Design wechseln', canvasAria: 'Spielfeld Rasta-Man', langBtn: 'English',
      title: 'Rasta-Man – Games – Martin Sucker',
      start: '▶ Start', restart: '↺ Neustart', pause: '❚❚ Pause', resume: '▶ Weiter', soundOn: '♫ Sound an', soundOff: '♫ Sound aus',
      fs: '⛶ Vollbild', fsOff: '⛶ Vollbild beenden', badCode: 'Unbekannter Code.', loaded: 'Level {n}: {name} geladen. Irie!',
      pCp: 'Checkpoint!', pFly: 'Fliegen!', pCookies: '+5 Cookies', pStar: 'Unbesiegbar!', pBeer: 'Bäh! Bier…',
      sub: 'Ein Jump & Run durch Jamaika', tapStart: 'Tippen zum Starten', keyStart: 'Enter oder Leertaste zum Starten',
      cheatFor: 'Cheatcode für dieses Level:', intro1: 'Sammle Hanfblätter, zertrümmere Steinblöcke', intro2: 'und erreiche die Irie Bar!',
      tapGo: 'Tippen = los', keyGo: 'Leertaste = los', tapResume: 'Tippen zum Weiterspielen', keyResume: 'P oder Esc zum Weiterspielen',
      clear: 'Level geschafft!', leaves: 'Hanfblätter', score: 'Punkte', contCode: 'Weiter mit Cheatcode: ',
      tapTitle: 'Tippen für Titelbild', keyTitle: 'Enter für Titelbild', winText: 'Alle 10 Orte auf Jamaika geschafft.'
    },
    en: {
      light: '☀ Light mode', dark: '☾ Dark mode',
      back: 'Home', backAria: 'Home',
      role: 'Jump & run through ten places in Jamaica', rotate: 'Please rotate your device ↻',
      cheatInfo: 'From level 2 on, a code is shown at the start of each level. Use it to jump straight back there next time.', go: 'Go',
      hControls: 'Controls', cRun: 'Run', cRunD: '← → or A / D', cJump: 'Jump / Fly', cJumpD: 'Space, ↑ or W (hold = higher)',
      cThrow: 'Throw cookie', cThrowD: 'X, K or Shift', cSys: 'Pause / Sound / Fullscreen', cSysD: 'P or Esc / M / F',
      cMobD: 'On-screen buttons. In fullscreen they sit on top of the game.',
      hItems: 'Items & Enemies', iLeaf: 'Hemp leaf', iLeafD: 'Collect them. 50 hemp leaves = 1 extra life.', iJointD: 'Fly for 10 seconds: hold the jump button.',
      iCookieD: '5 cookies to throw at enemies.', iPlant: 'Hemp plant', iPlantD: 'Invincible for 10 seconds.', iBeer: 'Beer', iBeerD: 'Power-down: 3 seconds of puking, unable to move.',
      iStone: 'Stone blocks', iStoneD: 'Smash them from below. Some hide items.', iCop: 'Police', iCopD: 'Easy enemy. Jump on them!',
      iPol: 'Politician', iPolD: 'Medium enemy. Throws books.', legal: 'Legal notice & privacy',
      themeAria: 'Switch theme', canvasAria: 'Rasta-Man game screen', langBtn: 'Deutsch',
      title: 'Rasta-Man – Games – Martin Sucker',
      start: '▶ Start', restart: '↺ Restart', pause: '❚❚ Pause', resume: '▶ Resume', soundOn: '♫ Sound on', soundOff: '♫ Sound off',
      fs: '⛶ Fullscreen', fsOff: '⛶ Exit fullscreen', badCode: 'Unknown code.', loaded: 'Level {n}: {name} loaded. Irie!',
      pCp: 'Checkpoint!', pFly: 'Fly!', pCookies: '+5 cookies', pStar: 'Invincible!', pBeer: 'Ugh! Beer…',
      sub: 'A jump & run through Jamaica', tapStart: 'Tap to start', keyStart: 'Press Enter or Space to start',
      cheatFor: 'Cheat code for this level:', intro1: 'Collect hemp leaves, smash stone blocks', intro2: 'and reach the Irie Bar!',
      tapGo: 'Tap = go', keyGo: 'Space = go', tapResume: 'Tap to resume', keyResume: 'P or Esc to resume',
      clear: 'Level complete!', leaves: 'hemp leaves', score: 'Score', contCode: 'Continue with cheat code: ',
      tapTitle: 'Tap for title screen', keyTitle: 'Enter for title screen', winText: 'All 10 places in Jamaica completed.'
    }
  };
  var LANG = 'de';
  try { if (localStorage.getItem('lang') === 'en') LANG = 'en'; } catch (e) {}
  function tt(k) { return (I18N[LANG] && I18N[LANG][k]) || I18N.de[k] || k; }

  // ---------- Hilfsfunktionen ----------
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hsh(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function overlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function $(id) { return document.getElementById(id); }

  // ---------- Canvas ----------
  var cv = $('cv'), ctx = cv.getContext('2d');
  cv.width = VW * SC; cv.height = VH * SC;

  function mk(w, h, fn) {
    var c = document.createElement('canvas'); c.width = w * SC; c.height = h * SC;
    var g = c.getContext('2d'); g.scale(SC, SC); fn(g); return c;
  }

  function leafShape(g, cx, cy, s, col, vein) {
    g.save(); g.translate(cx, cy);
    var L = [[0, 1], [0.5, 0.86], [-0.5, 0.86], [1.05, 0.64], [-1.05, 0.64], [1.75, 0.36], [-1.75, 0.36]];
    g.fillStyle = col;
    g.fillRect(-s * 0.05, 0, s * 0.1, s * 0.38);
    for (var i = 0; i < L.length; i++) {
      var len = s * L[i][1], wd = Math.max(1.4, s * 0.13 * L[i][1]);
      g.save(); g.rotate(L[i][0]);
      g.beginPath(); g.moveTo(0, 0);
      g.quadraticCurveTo(wd, -len * 0.45, 0, -len);
      g.quadraticCurveTo(-wd, -len * 0.45, 0, 0);
      g.fill();
      if (vein) { g.strokeStyle = vein; g.lineWidth = 0.6; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -len * 0.85); g.stroke(); }
      g.restore();
    }
    g.restore();
  }

  var SPR = {
    leaf: mk(22, 22, function (g) { leafShape(g, 11, 13, 10, '#2fbf4a', '#9cf0a8'); }),
    leafS: mk(14, 14, function (g) { leafShape(g, 7, 8.5, 6.4, '#2fbf4a', '#9cf0a8'); }),
    joint: mk(24, 24, function (g) {
      g.translate(12, 12); g.rotate(-0.45);
      g.fillStyle = '#f6f1e3'; g.beginPath(); g.moveTo(-10, -2); g.lineTo(8, -3.5); g.lineTo(8, 3.5); g.lineTo(-10, 2); g.closePath(); g.fill();
      g.strokeStyle = '#c9c1aa'; g.lineWidth = 0.6; g.stroke();
      g.fillStyle = '#c69c5d'; g.fillRect(-11, -2, 3, 4);
      g.fillStyle = '#ff6a00'; g.fillRect(8, -3.5, 2.5, 7);
      g.fillStyle = '#ffd21f'; g.fillRect(9.5, -1.5, 1.4, 3);
    }),
    cookie: mk(20, 20, function (g) {
      g.fillStyle = '#c98a3c'; g.beginPath(); g.arc(10, 10, 8.5, 0, 7); g.fill();
      g.fillStyle = '#e0a958'; g.beginPath(); g.arc(8.5, 8.5, 6, 0, 7); g.fill();
      g.fillStyle = '#4a2a12';
      [[7, 7], [12, 9], [9, 13], [13, 13], [6, 11], [11, 5]].forEach(function (p) { g.beginPath(); g.arc(p[0], p[1], 1.3, 0, 7); g.fill(); });
      g.fillStyle = '#2fbf4a'; g.beginPath(); g.arc(14, 6, 1.2, 0, 7); g.fill();
    }),
    plant: mk(26, 28, function (g) {
      g.fillStyle = '#c0582c'; g.beginPath(); g.moveTo(6, 19); g.lineTo(20, 19); g.lineTo(18, 28); g.lineTo(8, 28); g.closePath(); g.fill();
      g.fillStyle = '#d96d3c'; g.fillRect(5, 18, 16, 3);
      g.fillStyle = '#1d7a2c'; g.fillRect(12.3, 8, 1.4, 11);
      leafShape(g, 13, 11, 9, '#2fbf4a', '#9cf0a8');
      leafShape(g, 8, 17, 5, '#24a33c');
      leafShape(g, 18, 16, 5, '#24a33c');
    }),
    beer: mk(16, 30, function (g) {
      g.fillStyle = '#6b3a0e'; g.beginPath();
      g.moveTo(6, 1); g.lineTo(10, 1); g.lineTo(10, 9); g.quadraticCurveTo(14, 11, 14, 15); g.lineTo(14, 28);
      g.lineTo(2, 28); g.lineTo(2, 15); g.quadraticCurveTo(2, 11, 6, 9); g.closePath(); g.fill();
      g.fillStyle = '#c9c9c9'; g.fillRect(5.5, 0, 5, 2.5);
      g.fillStyle = '#f2d34b'; g.fillRect(2, 16, 12, 7);
      g.fillStyle = '#b3261e'; g.fillRect(2, 18.5, 12, 2);
      g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(3.5, 13, 1.5, 13);
    }),
    book: mk(16, 12, function (g) {
      g.fillStyle = '#f2ead6'; g.fillRect(1, 2, 14, 9);
      g.fillStyle = '#8f1d2c'; g.fillRect(0, 1, 15, 2); g.fillRect(0, 9, 15, 2); g.fillRect(0, 1, 3, 10);
      g.fillStyle = '#e6c34a'; g.fillRect(0.6, 4.5, 1.8, 3);
    })
  };

  function jamFlag(g, x, y, w, h) {
    g.fillStyle = '#009b3a'; g.fillRect(x, y, w, h);
    g.fillStyle = '#000';
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + w / 2, y + h / 2); g.lineTo(x, y + h); g.fill();
    g.beginPath(); g.moveTo(x + w, y); g.lineTo(x + w / 2, y + h / 2); g.lineTo(x + w, y + h); g.fill();
    g.strokeStyle = '#fed100'; g.lineWidth = h * 0.14;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y + h); g.moveTo(x + w, y); g.lineTo(x, y + h); g.stroke();
  }

  // ---------- Levelgenerator (deterministisch je Level) ----------
  function genLevel(i) {
    var R = rng(9001 + i * 7919), diff = i / 9;
    var cols = [];
    function col(x) { while (cols.length <= x) cols.push(new Uint8Array(ROWS)); return cols[x]; }
    function set(x, y, v) { if (x >= 0 && y >= 0 && y < ROWS) col(x)[y] = v; }
    function ground(x, top) { for (var y = top; y < ROWS; y++) set(x, y, 1); }
    var lv = { i: i, hidden: {}, leaves: [], enemies: [], slots: [], blocks: [], cp: null, hutX: 0 };
    function leaf(tx, ty) { if (ty >= 0) lv.leaves.push({ x: tx * T + T / 2, y: ty * T + T / 2, got: false }); }
    function stones(x0, n, row) { for (var k = 0; k < n; k++) { set(x0 + k, row, 2); lv.blocks.push([x0 + k, row]); } }
    function ri(a, b) { return a + Math.floor(R() * (b - a + 1)); }

    var x = 0, h = 10, k, len;
    for (; x < 14; x++) ground(x, h);
    stones(7, 3, h - 4); leaf(7, h - 5); leaf(8, h - 5); leaf(9, h - 5);
    lv.start = { x: 2 * T, y: h * T - PH };
    var startItem = i === 0 ? 'cookie' : ['cookie', 'joint', 'plant'][ri(0, 2)];
    lv.hidden[8 + ',' + (h - 4)] = startItem;

    var target = 170 + i * 12, cpX = Math.floor(target * 0.5);
    var lastSeg = 'flat';
    while (x < target) {
      if (!lv.cp && x >= cpX) {
        for (k = 0; k < 8; k++) ground(x + k, h);
        lv.cp = { x: (x + 3) * T, y: h * T, on: false };
        x += 8; lastSeg = 'flat'; continue;
      }
      var r = R();
      if (lastSeg === 'gap' || lastSeg === 'plat') r = R() * 0.34;
      if (r < 0.34) { // flache Strecke mit Blöcken und Blättern
        len = ri(6, 12);
        for (k = 0; k < len; k++) ground(x + k, h);
        var blocks = false;
        if (R() < 0.6) {
          var n = ri(2, 5), x0 = x + 1 + Math.floor(R() * Math.max(1, len - n - 1));
          stones(x0, n, h - 4); blocks = true;
          for (k = 0; k < n; k++) if (R() < 0.6) leaf(x0 + k, h - 5);
          if (R() < 0.3 && h >= 9) {
            var m = Math.min(n, ri(2, 3)), x1 = x0 + Math.floor((n - m) / 2);
            stones(x1, m, h - 8);
            for (k = 0; k < m; k++) leaf(x1 + k, h - 9);
          }
        }
        if (!blocks && R() < 0.75) {
          var nl = ri(3, 5), xl = x + Math.floor((len - nl) / 2);
          for (k = 0; k < nl; k++) leaf(xl + k, h - 2);
        }
        for (k = 2; k < len - 2; k++) lv.slots.push({ x: x + k, h: h });
        x += len; lastSeg = 'flat';
      } else if (r < 0.52) { // Abgrund
        var maxW = 2 + Math.min(2, Math.floor(i / 3));
        var nh = clamp(h + [-1, 0, 0, 1][ri(0, 3)], 8, 10);
        var w = ri(2, maxW); if (nh < h) w = Math.min(w, 3);
        for (k = 0; k < w; k++) leaf(x + k, (w >= 3 && k === Math.floor(w / 2)) ? Math.min(h, nh) - 4 : Math.min(h, nh) - 3);
        x += w; h = nh;
        for (k = 0; k < 3; k++) ground(x + k, h);
        x += 3; lastSeg = 'gap';
      } else if (r < 0.64) { // Treppe
        var st = ri(3, 4), pit = i >= 3 && R() < 0.5, j, y;
        for (j = 0; j < st; j++) { ground(x + j, h); for (y = h - 1 - j; y < h; y++) set(x + j, y, 3); leaf(x + j, h - 2 - j); }
        x += st;
        if (pit) { x += 2; } else { ground(x, h); for (y = h - st; y < h; y++) set(x, y, 3); leaf(x, h - st - 1); x += 1; }
        for (j = st - 1; j >= 0; j--) { ground(x, h); for (y = h - 1 - j; y < h; y++) set(x, y, 3); x += 1; }
        for (k = 0; k < 2; k++) ground(x + k, h);
        x += 2; lastSeg = 'stairs';
      } else if (r < 0.74) { // Lautsprecher-Türme
        len = 11;
        for (k = 0; k < len; k++) ground(x + k, h);
        var hh = (i >= 4 && R() < 0.5) ? 3 : 2, hh2 = ri(1, hh);
        for (k = 0; k < hh; k++) { set(x + 2, h - 1 - k, 4); set(x + 3, h - 1 - k, 4); }
        for (k = 0; k < hh2; k++) { set(x + 8, h - 1 - k, 4); set(x + 9, h - 1 - k, 4); }
        leaf(x + 2, h - hh - 1); leaf(x + 3, h - hh - 1); leaf(x + 8, h - hh2 - 1); leaf(x + 9, h - hh2 - 1);
        lv.slots.push({ x: x + 5, h: h }); lv.slots.push({ x: x + 6, h: h });
        x += len; lastSeg = 'speak';
      } else if (r < 0.84) { // Plattformen über Abgrund
        var np = ri(1, 2), px = x + 2;
        for (j = 0; j < np; j++) {
          var row = h - 2 - (j % 2);
          for (k = 0; k < 3; k++) { set(px + k, row, 5); leaf(px + k, row - 1); }
          px += 5;
        }
        x += 5 * np + 2;
        for (k = 0; k < 3; k++) ground(x + k, h);
        x += 3; lastSeg = 'plat';
      } else if (r < 0.92) { // Höhenwechsel
        var nh2 = h;
        while (nh2 === h) nh2 = clamp(h + [-2, -1, 1, 2][ri(0, 3)], 8, 10);
        h = nh2; len = 6;
        for (k = 0; k < len; k++) ground(x + k, h);
        for (k = 2; k < len - 1; k++) lv.slots.push({ x: x + k, h: h });
        x += len; lastSeg = 'flat';
      } else { // Bonus hoch oben (nur fliegend erreichbar)
        len = 9;
        for (k = 0; k < len; k++) ground(x + k, h);
        var sr = ri(1, 2);
        for (k = 1; k < len - 1; k++) leaf(x + k, sr);
        for (k = 2; k < len - 2; k++) lv.slots.push({ x: x + k, h: h });
        x += len; lastSeg = 'flat';
      }
    }
    // Ziel: Pyramide und Reggae-Bar
    var x0e = x;
    for (k = 0; k < 26; k++) ground(x0e + k, h);
    for (var s = 0; s < 4; s++) { for (var yy = h - 1 - s; yy < h; yy++) set(x0e + 3 + s, yy, 3); leaf(x0e + 3 + s, h - 2 - s); }
    for (s = 3; s >= 0; s--) { for (yy = h - 1 - s; yy < h; yy++) set(x0e + 10 - s, yy, 3); }
    lv.hutX = (x0e + 15) * T; lv.hutY = h * T;
    lv.W = cols.length;

    // Tiles flach ablegen
    lv.tiles = new Uint8Array(lv.W * ROWS);
    for (var cx = 0; cx < lv.W; cx++) for (var cy = 0; cy < ROWS; cy++) lv.tiles[cy * lv.W + cx] = cols[cx][cy];

    // Versteckte Items in Steinblöcken
    var idx = lv.blocks.map(function (b, n) { return n; }).filter(function (n) { return lv.blocks[n][0] !== 8 || lv.blocks[n][1] !== 6; });
    for (k = idx.length - 1; k > 0; k--) { var q = Math.floor(R() * (k + 1)); var tmp = idx[k]; idx[k] = idx[q]; idx[q] = tmp; }
    var cnt = Math.max(4, Math.round(lv.blocks.length * 0.35));
    var pool = ['joint', 'cookie', 'plant', 'beer'];
    for (k = 0; k < cnt && k < idx.length; k++) {
      var b = lv.blocks[idx[k]], key = b[0] + ',' + b[1];
      if (lv.hidden[key]) continue;
      var it;
      if (k < pool.length) it = pool[k];
      else {
        var rr = R(), lt = 0.45 - 0.12 * diff;
        it = rr < lt ? 'leaf' : rr < lt + 0.15 ? 'cookie' : rr < lt + 0.25 ? 'joint' : rr < lt + 0.35 ? 'plant' : 'beer';
      }
      lv.hidden[key] = it;
    }

    // Gegner verteilen
    var slots = lv.slots.filter(function (sl) { return sl.x >= 20 && sl.x < x0e - 2; });
    for (k = slots.length - 1; k > 0; k--) { var q2 = Math.floor(R() * (k + 1)); var t2 = slots[k]; slots[k] = slots[q2]; slots[q2] = t2; }
    var nCop = 6 + i, nPol = i === 0 ? 0 : 1 + Math.round(i * 0.8), want = nCop + nPol, chosen = [];
    for (k = 0; k < slots.length && chosen.length < want; k++) {
      var ok = true;
      for (var c2 = 0; c2 < chosen.length; c2++) if (Math.abs(chosen[c2].x - slots[k].x) < 5) { ok = false; break; }
      if (ok) chosen.push(slots[k]);
    }
    for (k = chosen.length - 1; k > 0; k--) { var q3 = Math.floor(R() * (k + 1)); var t3 = chosen[k]; chosen[k] = chosen[q3]; chosen[q3] = t3; }
    chosen.forEach(function (sl, n) {
      var pol = n < nPol;
      var ew = 24, eh = pol ? 38 : 36;
      lv.enemies.push({
        type: pol ? 'pol' : 'cop', x: sl.x * T + (T - ew) / 2, y: sl.h * T - eh, w: ew, h: eh,
        vx: 0, vy: 0, dir: R() < 0.5 ? -1 : 1, speed: pol ? 30 + 12 * diff : 42 + 22 * diff,
        alive: true, dead: 0, deadType: '', active: false, throwT: 1.2 + R() * 1.5, throwAnim: 0, anim: R() * 10, onGround: false
      });
    });
    return lv;
  }

  // ---------- Audio (prozedurale Reggae-Musik + Effekte) ----------
  var Audio = (function () {
    var ac = null, master, mus, sfx, noiseBuf, on = true, playing = false, timer = 0;
    var next = 0, step = 0, bpm = 76, key = 57, prog = null, perChord = 1, motif = [];
    var PROGS = [
      [[0, 'm'], [5, 'M']],
      [[0, 'M'], [7, 'M'], [9, 'm'], [5, 'M']],
      [[0, 'M'], [5, 'M'], [7, 'M'], [5, 'M']],
      [[0, 'm'], [10, 'M'], [8, 'M'], [10, 'M']],
      [[0, 'm'], [5, 'm'], [0, 'm'], [7, 'm']]
    ];
    var KEYS = [57, 55, 52, 50, 57, 55, 53, 52, 50, 57];
    function unlock() {
      if (!ac) {
        var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
        ac = new C();
        master = ac.createGain(); master.gain.value = on ? 0.55 : 0; master.connect(ac.destination);
        mus = ac.createGain(); mus.gain.value = 0.5; mus.connect(master);
        sfx = ac.createGain(); sfx.gain.value = 0.6; sfx.connect(master);
        noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
        var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ac.state === 'suspended') ac.resume();
    }
    function mf(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function env(g, t, a, d, peak) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    }
    function osc(t, freq, dur, type, peak, dest, filt, q) {
      var o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t);
      var node = o;
      if (filt) { var f = ac.createBiquadFilter(); f.type = filt[0]; f.frequency.value = filt[1]; f.Q.value = q || 1; o.connect(f); node = f; }
      node.connect(g); g.connect(dest); env(g, t, 0.006, dur, peak);
      o.start(t); o.stop(t + dur + 0.05); return o;
    }
    function noise(t, dur, peak, type, freq, dest, q) {
      var s = ac.createBufferSource(); s.buffer = noiseBuf;
      var f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q || 1;
      var g = ac.createGain(); s.connect(f); f.connect(g); g.connect(dest);
      env(g, t, 0.002, dur, peak); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
    }
    // --- Drums
    function kick(t) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.16);
      o.connect(g); g.connect(mus); env(g, t, 0.003, 0.3, 0.95); o.start(t); o.stop(t + 0.4);
    }
    function rim(t) { noise(t, 0.07, 0.45, 'bandpass', 2100, mus, 3); osc(t, 420, 0.04, 'triangle', 0.25, mus); }
    function hat(t, v) { noise(t, 0.035, v, 'highpass', 7500, mus); }
    // --- Harmonie
    function triad(root, minor) { var r = root; while (r < 60) r += 12; while (r > 66) r -= 12; return [r, r + (minor ? 3 : 4), r + 7]; }
    function skank(t, root, minor) {
      triad(root, minor).forEach(function (n) {
        osc(t, mf(n), 0.1, 'square', 0.07, mus, ['bandpass', 1400], 0.8);
        osc(t, mf(n + 12), 0.08, 'sawtooth', 0.025, mus, ['highpass', 1200]);
      });
      noise(t, 0.03, 0.08, 'bandpass', 3000, mus, 2);
    }
    function bubble(t, root, minor, v) {
      triad(root, minor).forEach(function (n) { osc(t, mf(n - 12), 0.07, 'triangle', v, mus, ['lowpass', 1800]); });
    }
    function bass(t, n, dur) {
      osc(t, mf(n), dur, 'sine', 0.55, mus, ['lowpass', 500]);
      osc(t, mf(n), dur, 'triangle', 0.18, mus, ['lowpass', 380]);
    }
    function lead(t, n, dur) {
      var o = osc(t, mf(n), dur, 'sawtooth', 0.05, mus, ['lowpass', 1700], 2);
      var lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 5.5; lg.gain.value = 4;
      lfo.connect(lg); lg.connect(o.frequency); lfo.start(t); lfo.stop(t + dur + 0.05);
    }
    var BASS = [[0, 0, 3], [6, 0, 1], [7, 7, 2], [10, 12, 2], [12, 7, 1], [14, 'third', 2]];
    function playStep(s, t) {
      var st = s % 16, bar = Math.floor(s / 16), sd = 60 / bpm / 4;
      var ch = prog[Math.floor(bar / perChord) % prog.length], root = key + ch[0], minor = ch[1] === 'm';
      if (st === 8) { kick(t); rim(t); }
      if (st % 2 === 0) hat(t, st % 4 === 2 ? 0.12 : 0.05);
      if (bar % 8 === 7 && st >= 12) rim(t + (st === 15 ? sd / 2 : 0));
      if (st === 4 || st === 12) skank(t, root, minor);
      if (st === 6 || st === 14) bubble(t, root, minor, 0.05);
      if (st === 7 || st === 15) bubble(t, root, minor, 0.03);
      var br = root; while (br > 47) br -= 12; while (br < 36) br += 12;
      for (var i = 0; i < BASS.length; i++) if (BASS[i][0] === st) {
        var iv = BASS[i][1] === 'third' ? (minor ? 3 : 4) : BASS[i][1];
        bass(t, br + iv, BASS[i][2] * sd * 0.95);
      }
      if (bar % 8 >= 4) {
        var mi = (bar % 2) * 16 + st;
        if (motif[mi] != null) lead(t, key + 12 + motif[mi], sd * 1.8);
      }
    }
    function tick() {
      if (!playing || !ac) return;
      var sd = 60 / bpm / 4;
      if (next < ac.currentTime) next = ac.currentTime + 0.05;
      while (next < ac.currentTime + 0.15) { playStep(step, next); next += sd; step++; }
    }
    function setLevel(i) {
      var R = rng(4242 + i * 31);
      prog = PROGS[i % PROGS.length]; perChord = prog.length === 2 ? 2 : 1;
      key = KEYS[i] || 57; bpm = 74 + i * 1.3;
      var minor = prog[0][1] === 'm', scale = minor ? [0, 3, 5, 7, 10, 12] : [0, 2, 4, 7, 9, 12];
      motif = [];
      for (var s = 0; s < 32; s++) motif[s] = (s % 2 === 0 && R() < 0.38) ? scale[Math.floor(R() * scale.length)] : null;
    }
    function start() {
      unlock(); if (!ac) return;
      if (!prog) setLevel(0);
      if (playing) return;
      playing = true; step = 0; next = ac.currentTime + 0.08;
      mus.gain.cancelScheduledValues(ac.currentTime); mus.gain.setValueAtTime(0.5, ac.currentTime);
      clearInterval(timer); timer = setInterval(tick, 30); tick();
    }
    function stop() {
      playing = false; clearInterval(timer);
      if (ac) { mus.gain.cancelScheduledValues(ac.currentTime); mus.gain.setValueAtTime(0.5, ac.currentTime); }
    }
    function toggle() {
      on = !on; if (ac) master.gain.setTargetAtTime(on ? 0.55 : 0, ac.currentTime, 0.02); return on;
    }
    // --- Effekte
    function fx(name) {
      if (!ac || !on) return;
      var t = ac.currentTime + 0.005, i;
      switch (name) {
        case 'jump': var o = osc(t, 300, 0.16, 'square', 0.12, sfx, ['lowpass', 2500]); o.frequency.exponentialRampToValueAtTime(720, t + 0.14); break;
        case 'leaf': osc(t, 1318, 0.06, 'square', 0.08, sfx); osc(t + 0.06, 1976, 0.14, 'square', 0.08, sfx); break;
        case 'stomp': var o2 = osc(t, 420, 0.12, 'square', 0.15, sfx); o2.frequency.exponentialRampToValueAtTime(110, t + 0.12); break;
        case 'break': noise(t, 0.18, 0.5, 'lowpass', 1200, sfx); noise(t, 0.1, 0.3, 'bandpass', 400, sfx, 2); break;
        case 'bump': osc(t, 140, 0.08, 'square', 0.15, sfx, ['lowpass', 600]); break;
        case 'item': for (i = 0; i < 4; i++) osc(t + i * 0.05, mf(72 + i * 4), 0.08, 'triangle', 0.15, sfx); break;
        case 'power': [0, 4, 7, 12, 16, 19, 24].forEach(function (n, k) { osc(t + k * 0.05, mf(67 + n), 0.1, 'square', 0.08, sfx, ['lowpass', 3000]); }); break;
        case 'beer': var o3 = osc(t, 260, 0.6, 'sawtooth', 0.14, sfx, ['lowpass', 700]); o3.frequency.linearRampToValueAtTime(90, t + 0.6); noise(t + 0.1, 0.5, 0.25, 'bandpass', 500, sfx, 1.5); break;
        case 'throw': var o4 = osc(t, 900, 0.08, 'triangle', 0.12, sfx); o4.frequency.exponentialRampToValueAtTime(400, t + 0.08); break;
        case 'book': noise(t, 0.06, 0.15, 'bandpass', 1500, sfx, 2); break;
        case 'oneup': [0, 4, 7, 12, 7, 12].forEach(function (n, k) { osc(t + k * 0.08, mf(76 + n), 0.1, 'square', 0.09, sfx); }); break;
        case 'die': for (i = 0; i < 6; i++) osc(t + i * 0.11, mf(72 - i * 3), 0.12, 'square', 0.12, sfx, ['lowpass', 2000]); break;
        case 'clear': [0, 4, 7, 12, 9, 12, 16].forEach(function (n, k) { osc(t + k * 0.12, mf(64 + n), 0.16, 'square', 0.1, sfx, ['lowpass', 2600]); osc(t + k * 0.12, mf(52 + n), 0.16, 'triangle', 0.12, sfx); }); break;
        case 'over': [0, -3, -7, -12].forEach(function (n, k) { osc(t + k * 0.25, mf(64 + n), 0.3, 'triangle', 0.18, sfx); }); break;
        case 'cp': osc(t, 880, 0.1, 'square', 0.08, sfx); osc(t + 0.1, 1320, 0.2, 'square', 0.08, sfx); break;
        case 'pause': osc(t, 660, 0.06, 'square', 0.07, sfx); break;
      }
    }
    return { unlock: unlock, start: start, stop: stop, setLevel: setLevel, toggle: toggle, fx: fx, isOn: function () { return on; } };
  })();

  // ---------- Eingabe ----------
  var inp = { left: false, right: false, jump: false, thr: false, jumpP: false, thrP: false, startP: false, pauseP: false, tap: false, tl: false, tr: false };
  var KEYS = {
    ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
    ArrowUp: 'jump', KeyW: 'jump', Space: 'jump',
    KeyX: 'thr', KeyK: 'thr', ShiftLeft: 'thr', ShiftRight: 'thr',
    Enter: 'start', KeyP: 'pause', Escape: 'pause', KeyM: 'mute', KeyF: 'fs', ArrowDown: 'down', KeyS: 'down'
  };
  function typing(e) { var t = e.target; return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'); }
  window.addEventListener('keydown', function (e) {
    if (typing(e)) return;
    var a = KEYS[e.code]; if (!a) return;
    e.preventDefault(); Audio.unlock();
    if (e.repeat && a !== 'left' && a !== 'right') return;
    if (a === 'left') inp.left = true;
    else if (a === 'right') inp.right = true;
    else if (a === 'jump') { if (!inp.jump) inp.jumpP = true; inp.jump = true; inp.startP = true; }
    else if (a === 'thr') { if (!inp.thr) inp.thrP = true; inp.thr = true; }
    else if (a === 'start') inp.startP = true;
    else if (a === 'pause') { if (e.code === 'Escape' && shell.classList.contains('pseudo-fs')) pseudo(false); else inp.pauseP = true; }
    else if (a === 'mute') toggleSound();
    else if (a === 'fs') toggleFS();
  });
  window.addEventListener('keyup', function (e) {
    if (typing(e)) return;
    var a = KEYS[e.code]; if (!a) return;
    e.preventDefault();
    if (a === 'left') inp.left = false;
    else if (a === 'right') inp.right = false;
    else if (a === 'jump') inp.jump = false;
    else if (a === 'thr') inp.thr = false;
  });
  window.addEventListener('blur', function () { inp.left = inp.right = inp.jump = inp.thr = inp.tl = inp.tr = false; });

  // Touch
  var shell = $('shell'), dpad = $('dpad');
  function markTouch() { document.body.classList.add('is-touch'); }
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) markTouch();
  window.addEventListener('touchstart', markTouch, { passive: true, once: true });

  var dpadPtr = null;
  function dpadSet(e) {
    var r = dpad.getBoundingClientRect(), left = e.clientX < r.left + r.width / 2;
    inp.tl = left; inp.tr = !left;
    dpad.children[0].classList.toggle('on', left); dpad.children[1].classList.toggle('on', !left);
  }
  function dpadOff() { dpadPtr = null; inp.tl = inp.tr = false; dpad.children[0].classList.remove('on'); dpad.children[1].classList.remove('on'); }
  dpad.addEventListener('pointerdown', function (e) { e.preventDefault(); Audio.unlock(); dpadPtr = e.pointerId; try { dpad.setPointerCapture(e.pointerId); } catch (x) {} dpadSet(e); });
  dpad.addEventListener('pointermove', function (e) { if (e.pointerId === dpadPtr) dpadSet(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) { dpad.addEventListener(ev, function (e) { if (e.pointerId === dpadPtr) dpadOff(); }); });

  Array.prototype.forEach.call(document.querySelectorAll('.tbtn'), function (b) {
    var k = b.getAttribute('data-k');
    b.addEventListener('pointerdown', function (e) {
      e.preventDefault(); Audio.unlock(); b.classList.add('on');
      if (k === 'jump') { if (!inp.jump) inp.jumpP = true; inp.jump = true; inp.startP = true; }
      else if (k === 'throw') { if (!inp.thr) inp.thrP = true; inp.thr = true; }
      else if (k === 'pause') inp.pauseP = true;
      else if (k === 'fs') toggleFS();
    });
    function up() { b.classList.remove('on'); if (k === 'jump') inp.jump = false; if (k === 'throw') inp.thr = false; }
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('pointerleave', up);
    b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });
  cv.addEventListener('pointerdown', function () { Audio.unlock(); inp.tap = true; cv.focus({ preventScroll: true }); });
  shell.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // ---------- Spielzustand ----------
  var G = {
    state: 'title', lvIdx: 0, lv: null, lives: 3, leaves: 0, score: 0, timer: 0,
    camX: 0, t: 0, msg: '', shake: 0
  };
  var P = null, items = [], books = [], cookies = [], parts = [], pops = [];

  function newPlayer(x, y) {
    return { x: x, y: y, w: PW, h: PH, vx: 0, vy: 0, face: 1, onGround: false, coyote: 0, buf: 0,
      fly: 0, star: 0, vomit: 0, safe: 0, cookies: 0, cd: 0, anim: 0, dead: false, deadT: 0 };
  }
  function loadLevel(i) {
    G.lvIdx = i; G.lv = genLevel(i);
    items = []; books = []; cookies = []; parts = []; pops = [];
    P = newPlayer(G.lv.start.x, G.lv.start.y);
    G.camX = 0; G.levelLeaves = 0;
    Audio.setLevel(i);
    skyCache = null;
  }
  function startGame(i) {
    G.lives = 3; G.leaves = 0; G.score = 0;
    loadLevel(i); G.state = 'intro'; G.timer = 0;
    Audio.stop(); Audio.start();
    updateButtons();
  }
  function respawn() {
    var lv = G.lv, sp = lv.cp && lv.cp.on ? { x: lv.cp.x, y: lv.cp.y - PH } : lv.start;
    P = newPlayer(sp.x, sp.y); P.safe = 2;
    books = []; cookies = []; items = items.filter(function (it) { return Math.abs(it.x - sp.x) > VW; });
    G.camX = clamp(sp.x - VW * 0.4, 0, lv.W * T - VW);
  }

  // ---------- Kollision ----------
  function tileAt(tx, ty) {
    var lv = G.lv;
    if (tx < 0 || tx >= lv.W) return 3;
    if (ty < 0 || ty >= ROWS) return 0;
    return lv.tiles[ty * lv.W + tx];
  }
  function solid(tx, ty) { return tileAt(tx, ty) > 0; }
  function setTile(tx, ty, v) { G.lv.tiles[ty * G.lv.W + tx] = v; }

  function move(e, dt) {
    var res = { wall: false, head: null, land: false }, tx, ty, y0, y1, x0, x1;
    e.x += e.vx * dt;
    y0 = Math.floor(e.y / T); y1 = Math.floor((e.y + e.h - 0.01) / T);
    if (e.vx > 0) {
      tx = Math.floor((e.x + e.w - 0.01) / T);
      for (ty = y0; ty <= y1; ty++) if (solid(tx, ty)) { e.x = tx * T - e.w; e.vx = 0; res.wall = true; break; }
    } else if (e.vx < 0) {
      tx = Math.floor(e.x / T);
      for (ty = y0; ty <= y1; ty++) if (solid(tx, ty)) { e.x = (tx + 1) * T; e.vx = 0; res.wall = true; break; }
    }
    e.y += e.vy * dt; e.onGround = false;
    x0 = Math.floor((e.x + 1) / T); x1 = Math.floor((e.x + e.w - 1) / T);
    if (e.vy > 0) {
      ty = Math.floor((e.y + e.h - 0.01) / T);
      for (tx = x0; tx <= x1; tx++) if (solid(tx, ty)) { e.y = ty * T - e.h; e.vy = 0; e.onGround = true; res.land = true; break; }
    } else if (e.vy < 0) {
      ty = Math.floor(e.y / T);
      var best = null, bestOv = 0;
      for (tx = x0; tx <= x1; tx++) if (solid(tx, ty)) {
        var ov = Math.min(e.x + e.w, (tx + 1) * T) - Math.max(e.x, tx * T);
        if (ov > bestOv) { bestOv = ov; best = [tx, ty]; }
      }
      if (best) { e.y = (ty + 1) * T; e.vy = 0; res.head = best; }
    }
    return res;
  }

  // ---------- Effekte ----------
  function part(x, y, vx, vy, life, col, size, grav, kind) {
    if (parts.length > 400) parts.shift();
    parts.push({ x: x, y: y, vx: vx, vy: vy, life: life, max: life, col: col, size: size, grav: grav || 0, kind: kind || 'sq', rot: Math.random() * 6 });
  }
  function pop(x, y, txt, col) { pops.push({ x: x, y: y, txt: txt, col: col || '#fff', life: 1 }); }
  function addScore(n, x, y) { G.score += n; if (x != null) pop(x, y, '+' + n); }
  function addLeaves(n, x, y) {
    G.leaves += n; G.levelLeaves += n; G.score += 10 * n;
    while (G.leaves >= 50) { G.leaves -= 50; G.lives++; Audio.fx('oneup'); pop(P.x, P.y - 10, '1UP!', '#ffd21f'); }
  }

  // ---------- Blöcke ----------
  function hitBlock(tx, ty) {
    var t = tileAt(tx, ty);
    if (t !== 2) { Audio.fx('bump'); return; }
    setTile(tx, ty, 0); Audio.fx('break'); G.shake = 0.12; addScore(50);
    for (var i = 0; i < 6; i++) part(tx * T + T / 2, ty * T + T / 2, (Math.random() - 0.5) * 260, -150 - Math.random() * 260, 1.1, i % 2 ? '#8c8f99' : '#5d606b', 6, 1300, 'rock');
    // Gegner auf dem Block erledigen
    G.lv.enemies.forEach(function (e) {
      if (e.alive && Math.abs(e.y + e.h - ty * T) < 4 && e.x + e.w > tx * T && e.x < (tx + 1) * T) killEnemy(e, 'flip');
    });
    var key = tx + ',' + ty, it = G.lv.hidden[key];
    if (it) {
      delete G.lv.hidden[key];
      if (it === 'leaf') {
        addLeaves(3); Audio.fx('leaf'); pop(tx * T + T / 2, ty * T - 6, '+3', '#7cff6b');
        for (var k = 0; k < 3; k++) part(tx * T + T / 2, ty * T, (k - 1) * 40, -260, 0.6, '', 0, 600, 'leaf');
      } else {
        Audio.fx('item');
        var dir = Math.random() < 0.5 ? -1 : 1;
        if (it === 'beer') dir = P.x + P.w / 2 < tx * T + T / 2 ? -1 : 1;
        items.push({ type: it, x: tx * T + 4, y: ty * T + 2, w: 22, h: 24, vx: 0, vy: -300, dir: dir, wait: 0.3, onGround: false });
      }
    }
  }

  // ---------- Gegner ----------
  function killEnemy(e, how) {
    if (!e.alive) return;
    e.alive = false; e.deadType = how; e.dead = 0;
    if (how === 'flip') { e.vy = -380; e.vx = (Math.random() - 0.5) * 120; }
    var pts = e.type === 'pol' ? 200 : 100;
    addScore(pts, e.x + e.w / 2, e.y);
    Audio.fx('stomp');
  }

  function playerDie() {
    if (P.dead) return;
    P.dead = true; P.deadT = 0; P.vy = -520; P.vx = 0;
    P.fly = P.star = P.vomit = 0;
    Audio.stop(); Audio.fx('die');
  }

  // ---------- Update ----------
  function updatePlay(dt) {
    var lv = G.lv;
    if (P.dead) {
      P.deadT += dt; P.vy += GRAV * dt; P.y += P.vy * dt;
      if (P.deadT > 2.4) {
        G.lives--;
        if (G.lives <= 0) { G.state = 'gameover'; G.timer = 0; Audio.fx('over'); updateButtons(); }
        else { respawn(); Audio.start(); }
      }
      return;
    }
    P.anim += dt;
    var left = inp.left || inp.tl, right = inp.right || inp.tr, jumpHeld = inp.jump;
    if (P.vomit > 0) {
      P.vomit -= dt; P.vx = 0;
      if (Math.random() < 0.7) part(P.x + P.w / 2 + P.face * 10, P.y + 16, P.face * (60 + Math.random() * 80), -20 + Math.random() * 40, 0.8, Math.random() < 0.5 ? '#9acd32' : '#d4c84a', 3 + Math.random() * 3, 900, 'drop');
      left = right = false; jumpHeld = false; inp.jumpP = false; inp.thrP = false;
    }
    var dir = (right ? 1 : 0) - (left ? 1 : 0);
    if (dir) P.face = dir;
    var acc = P.onGround ? 1500 : 1000, target = dir * RUN;
    if (P.vx < target) P.vx = Math.min(target, P.vx + acc * dt);
    else if (P.vx > target) P.vx = Math.max(target, P.vx - acc * dt);

    if (inp.jumpP) { P.buf = 0.13; inp.jumpP = false; }
    if (P.onGround) P.coyote = 0.09; else P.coyote -= dt;
    P.buf -= dt;
    if (P.buf > 0 && P.coyote > 0 && P.vomit <= 0) {
      P.vy = -JUMPV; P.buf = 0; P.coyote = 0; P.onGround = false; Audio.fx('jump');
    }
    var g = GRAV;
    if (P.fly > 0) {
      P.fly -= dt; g *= 0.35;
      if (jumpHeld) P.vy = Math.max(P.vy - 2100 * dt, -290);
      if (Math.random() < 0.5) part(P.x + P.w / 2 - P.face * 4, P.y + 18, -P.face * 20 + (Math.random() - 0.5) * 20, -30, 1.1, 'rgba(220,220,220,.5)', 4, -20, 'smoke');
    } else if (P.vy < 0 && !jumpHeld) g *= 2.3;
    P.vy = Math.min(P.vy + g * dt, P.fly > 0 ? 260 : MAXFALL);

    var r = move(P, dt);
    if (P.y < -T) { P.y = -T; if (P.vy < 0) P.vy = 0; }
    if (r.head) hitBlock(r.head[0], r.head[1]);

    if (P.star > 0) { P.star -= dt; if (Math.random() < 0.6) part(P.x + Math.random() * P.w, P.y + Math.random() * P.h, 0, -40, 0.5, ['#e8322b', '#ffd21f', '#22b04b'][Math.floor(Math.random() * 3)], 3, 0, 'spark'); }
    if (P.safe > 0) P.safe -= dt;
    P.cd -= dt;

    if (inp.thrP) {
      inp.thrP = false;
      if (P.cookies > 0 && P.cd <= 0) {
        P.cookies--; P.cd = 0.25; Audio.fx('throw');
        cookies.push({ x: P.x + P.w / 2 + P.face * 8 - 7, y: P.y + 14, w: 14, h: 14, vx: P.face * 360 + P.vx * 0.3, vy: -140, b: 0, life: 3, rot: 0, onGround: false });
      }
    }

    if (P.y > ROWS * T + 40) { playerDie(); return; }

    // Blätter
    var pcx = P.x + P.w / 2, pcy = P.y + P.h / 2;
    for (var i = 0; i < lv.leaves.length; i++) {
      var L = lv.leaves[i];
      if (!L.got && Math.abs(L.x - pcx) < 18 && Math.abs(L.y - pcy) < 28) {
        L.got = true; addLeaves(1); Audio.fx('leaf');
        part(L.x, L.y, 0, -60, 0.4, '#b4ffb0', 0, 0, 'ring');
      }
    }

    // Items
    for (i = items.length - 1; i >= 0; i--) {
      var it = items[i];
      it.wait -= dt;
      if (it.wait <= 0) it.vx = it.dir * (it.type === 'beer' ? 70 : 55);
      it.vy = Math.min(it.vy + GRAV * 0.8 * dt, MAXFALL);
      var ir = move(it, dt);
      if (ir.wall) it.dir *= -1;
      if (it.y > ROWS * T + 40) { items.splice(i, 1); continue; }
      if (it.wait <= 0.1 && overlap(P, it)) { applyItem(it.type, it); items.splice(i, 1); }
    }

    // Checkpoint
    if (lv.cp && !lv.cp.on && P.x > lv.cp.x) { lv.cp.on = true; Audio.fx('cp'); pop(lv.cp.x, lv.cp.y - 80, tt('pCp'), '#ffd21f'); }

    // Gegner
    var camL = G.camX - 2 * T, camR = G.camX + VW + 3 * T;
    lv.enemies.forEach(function (e) {
      if (!e.alive) {
        e.dead += dt;
        if (e.deadType === 'flip') { e.vy += GRAV * dt; e.y += e.vy * dt; e.x += e.vx * dt; }
        return;
      }
      if (!e.active) { if (e.x < camR && e.x > camL) { e.active = true; e.vx = e.dir * e.speed; } else return; }
      e.anim += dt;
      if (e.throwAnim > 0) e.throwAnim -= dt;
      e.vy = Math.min(e.vy + GRAV * dt, MAXFALL);
      if (e.throwAnim <= 0) e.vx = e.dir * e.speed; else e.vx = 0;
      var er = move(e, dt);
      if (er.wall) { e.dir *= -1; }
      else if (e.onGround) {
        var ax = e.dir > 0 ? Math.floor((e.x + e.w + 2) / T) : Math.floor((e.x - 2) / T);
        if (!solid(ax, Math.floor((e.y + e.h + 2) / T))) e.dir *= -1;
      }
      if (e.y > ROWS * T + 40) { e.alive = false; e.dead = 9; return; }
      // Politiker wirft Bücher
      if (e.type === 'pol') {
        e.throwT -= dt;
        var dx = (P.x + P.w / 2) - (e.x + e.w / 2), dy = P.y - e.y;
        if (e.throwT <= 0 && Math.abs(dx) < 10 * T && Math.abs(dy) < 6 * T && !P.dead) {
          var diff = G.lvIdx / 9;
          e.throwT = 2.7 - diff * 0.9 + Math.random() * 0.7; e.throwAnim = 0.35; e.dir = dx > 0 ? 1 : -1;
          var fl = 0.85;
          books.push({ x: e.x + e.w / 2 - 7, y: e.y + 6, w: 14, h: 11, vx: clamp(dx / fl, -230, 230), vy: -360 + clamp(dy, -120, 60), rot: 0, life: 4 });
          Audio.fx('book');
        }
      }
      // Kontakt mit Spieler
      if (!P.dead && overlap({ x: P.x + 2, y: P.y + 2, w: P.w - 4, h: P.h - 2 }, { x: e.x + 2, y: e.y + 4, w: e.w - 4, h: e.h - 4 })) {
        if (P.star > 0) { killEnemy(e, 'flip'); }
        else if (P.vy > 40 && (P.y + P.h) - e.y < 18) {
          killEnemy(e, 'squash'); P.vy = jumpHeld ? -560 : -380;
          for (var k = 0; k < 5; k++) part(e.x + e.w / 2, e.y + 4, (Math.random() - 0.5) * 160, -Math.random() * 120, 0.4, '#fff', 3, 400, 'spark');
        } else if (P.safe <= 0) playerDie();
      }
    });

    // Bücher
    for (i = books.length - 1; i >= 0; i--) {
      var b = books[i];
      b.life -= dt; b.vy += 900 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.rot += dt * 10 * (b.vx >= 0 ? 1 : -1);
      var dead = b.life <= 0 || b.y > ROWS * T + 30 || solid(Math.floor((b.x + 7) / T), Math.floor((b.y + 5) / T));
      if (!dead && !P.dead && overlap(b, { x: P.x + 3, y: P.y + 3, w: P.w - 6, h: P.h - 6 })) {
        dead = true;
        if (P.star <= 0 && P.safe <= 0) playerDie();
      }
      if (dead) { for (var q = 0; q < 4; q++) part(b.x + 7, b.y + 5, (Math.random() - 0.5) * 140, -Math.random() * 140, 0.6, '#f2ead6', 4, 600, 'paper'); books.splice(i, 1); }
    }

    // Cookies
    for (i = cookies.length - 1; i >= 0; i--) {
      var c = cookies[i];
      c.life -= dt; c.rot += dt * 14; c.vy = Math.min(c.vy + 1400 * dt, MAXFALL);
      var vx0 = c.vx;
      var cr = move(c, dt);
      if (cr.land) { c.vy = -300; c.b++; }
      var gone = c.life <= 0 || cr.wall || c.b > 4 || c.y > ROWS * T + 30;
      if (cr.head) gone = true;
      c.vx = vx0;
      if (!gone) {
        for (var e2 = 0; e2 < lv.enemies.length; e2++) {
          var en = lv.enemies[e2];
          if (en.alive && overlap(c, en)) { killEnemy(en, 'flip'); gone = true; break; }
        }
        for (var b2 = books.length - 1; !gone && b2 >= 0; b2--) if (overlap(c, books[b2])) { books.splice(b2, 1); gone = true; addScore(50, c.x, c.y); }
      }
      if (gone) { for (var z = 0; z < 5; z++) part(c.x + 7, c.y + 7, (Math.random() - 0.5) * 160, -Math.random() * 160, 0.5, '#c98a3c', 3, 800, 'sq'); cookies.splice(i, 1); }
    }

    // Ziel
    if (P.x + P.w / 2 > lv.hutX + T * 1.5) {
      G.state = 'clear'; G.timer = 0; Audio.stop(); Audio.fx('clear');
      G.score += 1000; P.vx = 0; P.fly = P.star = P.vomit = 0;
    }

    // Kamera
    var tgt = clamp(P.x + P.w / 2 - VW * 0.42 + P.face * 30, 0, lv.W * T - VW);
    G.camX += (tgt - G.camX) * Math.min(1, dt * 6);
  }

  function applyItem(type, it) {
    var x = it.x + it.w / 2, y = it.y;
    if (type === 'joint') { P.fly = 10; Audio.fx('power'); pop(x, y, tt('pFly'), '#00f0ff'); }
    else if (type === 'cookie') { P.cookies += 5; Audio.fx('power'); pop(x, y, tt('pCookies'), '#ffcf7a'); }
    else if (type === 'plant') { P.star = 10; Audio.fx('power'); pop(x, y, tt('pStar'), '#7cff6b'); }
    else if (type === 'beer') { P.vomit = 3; Audio.fx('beer'); pop(x, y, tt('pBeer'), '#ffb020'); }
    addScore(type === 'beer' ? 0 : 200);
  }

  function updateParts(dt) {
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i]; p.life -= dt;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      p.vy += p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += dt * 6;
    }
    for (i = pops.length - 1; i >= 0; i--) { pops[i].life -= dt * 0.9; pops[i].y -= 30 * dt; if (pops[i].life <= 0) pops.splice(i, 1); }
    if (G.shake > 0) G.shake -= dt;
  }

  function anyStart() { var s = inp.startP || inp.tap; inp.startP = inp.tap = false; return s; }

  function update(dt) {
    G.t += dt;
    if (inp.pauseP) {
      inp.pauseP = false;
      if (G.state === 'play') { G.state = 'pause'; Audio.stop(); Audio.fx('pause'); updateButtons(); }
      else if (G.state === 'pause') { G.state = 'play'; Audio.start(); updateButtons(); }
    }
    switch (G.state) {
      case 'title':
        if (anyStart()) startGame(0);
        break;
      case 'intro':
        G.timer += dt;
        if ((G.timer > 0.6 && anyStart()) || G.timer > 4) { G.state = 'play'; inp.jumpP = false; updateButtons(); }
        inp.tap = false;
        break;
      case 'play':
        inp.startP = inp.tap = false;
        updatePlay(dt); updateParts(dt);
        break;
      case 'pause':
        if (inp.tap) { inp.tap = false; inp.pauseP = true; }
        inp.startP = false;
        break;
      case 'clear':
        G.timer += dt; updateParts(dt);
        P.anim += dt; P.vx = P.x < G.lv.hutX + T * 2.2 ? 70 : 0; P.vy = Math.min(P.vy + GRAV * dt, MAXFALL); move(P, dt);
        if (G.timer > 3.2 || (G.timer > 1.2 && anyStart())) {
          if (G.lvIdx + 1 >= LEVELS.length) { G.state = 'win'; G.timer = 0; updateButtons(); }
          else { loadLevel(G.lvIdx + 1); G.state = 'intro'; G.timer = 0; Audio.start(); }
        }
        inp.tap = false;
        break;
      case 'gameover':
      case 'win':
        G.timer += dt; updateParts(dt);
        if (G.timer > 1.5 && anyStart()) { G.state = 'title'; G.timer = 0; updateButtons(); }
        inp.tap = false;
        break;
    }
    inp.jumpP = G.state === 'play' ? inp.jumpP : false;
  }

  // ---------- Zeichnen: Hintergrund ----------
  var skyCache = null;
  function drawBG(lvIdx, camX) {
    var L = LEVELS[lvIdx], sk = SKY[L.sky];
    if (!skyCache || skyCache.i !== lvIdx) {
      var gr = ctx.createLinearGradient(0, 0, 0, VH);
      gr.addColorStop(0, sk[0]); gr.addColorStop(1, sk[1]);
      skyCache = { i: lvIdx, gr: gr };
    }
    ctx.fillStyle = skyCache.gr; ctx.fillRect(0, 0, VW, VH);
    var night = L.sky === 'night', i, x, px;
    if (night || L.sky === 'dusk') {
      ctx.fillStyle = '#fff';
      for (i = 0; i < 60; i++) { ctx.globalAlpha = 0.3 + 0.7 * hsh(i * 3.1 + Math.floor(G.t * 2 + i) * 0.001); ctx.fillRect((((hsh(i) * VW * 1.3 - camX * 0.02) % VW) + VW) % VW, hsh(i + 9) * VH * 0.5, 1.4, 1.4); }
      ctx.globalAlpha = 1;
    }
    // Sonne / Mond
    if (night) { ctx.fillStyle = '#f4f1d0'; ctx.beginPath(); ctx.arc(520, 60, 22, 0, 7); ctx.fill(); ctx.fillStyle = sk[0]; ctx.beginPath(); ctx.arc(510, 54, 20, 0, 7); ctx.fill(); }
    else if (L.sky !== 'mist') {
      var sy = L.sky === 'day' ? 60 : 150, sc = L.sky === 'day' ? '#fff3a8' : '#ffcf5a';
      ctx.fillStyle = sc; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(480, sy, 46, 0, 7); ctx.fill();
      ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(480, sy, 30, 0, 7); ctx.fill();
    }
    var th = L.theme;
    // ferne Ebene
    if (th === 'beach') {
      ctx.fillStyle = night ? '#16324f' : L.sky === 'day' ? '#1f8fc4' : '#3d5f8f';
      ctx.fillRect(0, 210, VW, VH - 210);
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      for (i = 0; i < 24; i++) { x = ((i * 97 - camX * 0.2 + G.t * 8) % (VW + 40) + VW + 40) % (VW + 40) - 20; ctx.fillRect(x, 218 + (i % 6) * 14, 18, 1.5); }
      ctx.fillStyle = 'rgba(20,60,40,.6)';
      ctx.beginPath(); px = 300 - camX * 0.05 % 900; ctx.ellipse(px, 212, 90, 14, 0, Math.PI, 0); ctx.fill();
    } else if (th === 'city') {
      for (i = -1; i < 22; i++) {
        var n = Math.floor(camX * 0.25 / 34) + i, bx = n * 34 - camX * 0.25, bh = 60 + hsh(n) * 110;
        ctx.fillStyle = night ? '#141a36' : L.sky === 'day' ? '#7c8ba3' : '#5a4a72';
        ctx.fillRect(bx, 270 - bh, 30, bh + 90);
        ctx.fillStyle = night ? '#ffd86b' : 'rgba(255,255,255,.25)';
        for (var wy = 270 - bh + 8; wy < 260; wy += 12) for (var wx = 4; wx < 26; wx += 9) if (hsh(n * 13 + wy * 7 + wx) > (night ? 0.55 : 0.7)) ctx.fillRect(bx + wx, wy, 4, 5);
      }
    } else {
      ctx.fillStyle = th === 'mountain' ? '#5d7590' : L.sky === 'dusk' ? '#3a3f6b' : '#5e9c6a';
      ctx.beginPath(); ctx.moveTo(0, VH);
      for (x = 0; x <= VW; x += 8) { var wx2 = x + camX * 0.15; ctx.lineTo(x, (th === 'mountain' ? 120 : 170) + Math.sin(wx2 * 0.011) * 40 + Math.sin(wx2 * 0.027) * 18 + Math.sin(wx2 * 0.05) * 6); }
      ctx.lineTo(VW, VH); ctx.fill();
      if (th === 'mountain') {
        ctx.fillStyle = '#7b93ab'; ctx.beginPath(); ctx.moveTo(0, VH);
        for (x = 0; x <= VW; x += 8) { var wx3 = x + camX * 0.3; ctx.lineTo(x, 200 + Math.sin(wx3 * 0.015 + 2) * 30 + Math.sin(wx3 * 0.04) * 10); }
        ctx.lineTo(VW, VH); ctx.fill();
      }
    }
    // mittlere Ebene
    var mp = 0.5, sp = th === 'city' ? 120 : 170;
    var startN = Math.floor(camX * mp / sp) - 1;
    for (i = 0; i < Math.ceil(VW / sp) + 3; i++) {
      var nn = startN + i, mx = nn * sp - camX * mp + hsh(nn * 5) * 60, base = 300;
      if (th === 'city') drawHouse(mx, base, nn, night);
      else if (hsh(nn * 7) > 0.25) drawPalm(mx, base, 0.8 + hsh(nn) * 0.5, night || L.sky === 'dusk');
    }
    if (L.sky === 'mist') { ctx.fillStyle = 'rgba(235,242,246,.35)'; ctx.fillRect(0, 0, VW, VH); }
    // Abgrund unterhalb der Bodenlinie sichtbar dunkel
    var pg = ctx.createLinearGradient(0, 296, 0, VH);
    pg.addColorStop(0, 'rgba(5,6,12,0)'); pg.addColorStop(0.35, 'rgba(5,6,12,.85)'); pg.addColorStop(1, '#05060c');
    ctx.fillStyle = pg; ctx.fillRect(0, 296, VW, VH - 296);
  }
  function drawPalm(x, base, s, dark) {
    ctx.save(); ctx.translate(x, base); ctx.scale(s, s);
    ctx.strokeStyle = dark ? '#2a2a3a' : '#7a5530'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(10, -50, 4, -100); ctx.stroke();
    ctx.fillStyle = dark ? '#1d3a2e' : '#2e8b3a';
    for (var a = 0; a < 6; a++) {
      ctx.save(); ctx.translate(4, -100); ctx.rotate(-2.6 + a * 0.75 + Math.sin(G.t + x) * 0.04);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(25, -14, 52, 6); ctx.quadraticCurveTo(25, -2, 0, 0); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
  var HOUSECOL = ['#e8322b', '#ffd21f', '#22b04b', '#29a3d6', '#ff7ac8', '#f08a24'];
  function drawHouse(x, base, n, night) {
    var w = 70 + hsh(n) * 30, h = 50 + hsh(n + 3) * 40;
    ctx.fillStyle = night ? '#232848' : HOUSECOL[Math.floor(hsh(n + 1) * 6)];
    ctx.globalAlpha = night ? 1 : 0.85; ctx.fillRect(x, base - h, w, h); ctx.globalAlpha = 1;
    ctx.fillStyle = night ? '#141830' : '#7a4a2a';
    ctx.beginPath(); ctx.moveTo(x - 6, base - h); ctx.lineTo(x + w / 2, base - h - 22); ctx.lineTo(x + w + 6, base - h); ctx.fill();
    ctx.fillStyle = night ? '#ffd86b' : '#2a3550';
    ctx.fillRect(x + 10, base - h + 12, 12, 12); ctx.fillRect(x + w - 22, base - h + 12, 12, 12);
  }

  // ---------- Zeichnen: Tiles ----------
  function drawTiles(camX) {
    var lv = G.lv, gp = GROUND[LEVELS[G.lvIdx].theme];
    var x0 = Math.max(0, Math.floor(camX / T)), x1 = Math.min(lv.W - 1, Math.floor((camX + VW) / T) + 1);
    for (var tx = x0; tx <= x1; tx++) for (var ty = 0; ty < ROWS; ty++) {
      var t = lv.tiles[ty * lv.W + tx]; if (!t) continue;
      var x = tx * T, y = ty * T;
      if (t === 1) {
        ctx.fillStyle = gp.body; ctx.fillRect(x, y, T, T);
        ctx.fillStyle = gp.dot;
        for (var d = 0; d < 3; d++) ctx.fillRect(x + hsh(tx * 31 + ty * 7 + d) * 24 + 2, y + hsh(tx * 17 + ty * 3 + d * 5) * 24 + 2, 4, 3);
        if (!tileAt(tx, ty - 1)) {
          ctx.fillStyle = gp.top; ctx.fillRect(x, y, T, 8);
          if (LEVELS[G.lvIdx].theme !== 'beach' && LEVELS[G.lvIdx].theme !== 'city') { for (var gg = 0; gg < 5; gg++) ctx.fillRect(x + gg * 6 + 1, y - 3, 2, 4); }
          ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(x, y + 8, T, 2);
        }
      } else if (t === 2) {
        ctx.fillStyle = '#7d808b'; ctx.fillRect(x, y, T, T);
        ctx.fillStyle = '#9a9daa'; ctx.fillRect(x + 1, y + 1, T - 2, 3); ctx.fillRect(x + 1, y + 1, 3, T - 2);
        ctx.fillStyle = '#585b66'; ctx.fillRect(x + 1, y + T - 4, T - 2, 3); ctx.fillRect(x + T - 4, y + 1, 3, T - 2);
        ctx.strokeStyle = '#5c5f6a'; ctx.lineWidth = 1.2; ctx.beginPath();
        ctx.moveTo(x + 4, y + 15); ctx.lineTo(x + 26, y + 15); ctx.moveTo(x + 15, y + 4); ctx.lineTo(x + 15, y + 15); ctx.moveTo(x + 9, y + 15); ctx.lineTo(x + 9, y + 26); ctx.moveTo(x + 21, y + 15); ctx.lineTo(x + 21, y + 26);
        ctx.stroke();
      } else if (t === 3) {
        ctx.fillStyle = '#5b4636'; ctx.fillRect(x, y, T, T);
        ctx.fillStyle = '#76604c'; ctx.fillRect(x + 2, y + 2, T - 4, T - 4);
        ctx.fillStyle = '#4a382a'; ctx.fillRect(x + 6, y + 6, T - 12, T - 12);
        ctx.fillStyle = '#8a735d'; ctx.fillRect(x + 8, y + 8, T - 16, T - 16);
      } else if (t === 4) {
        ctx.fillStyle = '#1a1a1f'; ctx.fillRect(x, y, T, T);
        ctx.strokeStyle = '#3a3a44'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, T - 1, T - 1);
        var pulse = 1 + 0.08 * Math.max(0, Math.sin(G.t * Math.PI * 2 * 1.25));
        ctx.fillStyle = '#2e2e38'; ctx.beginPath(); ctx.arc(x + T / 2, y + T / 2, 11 * pulse, 0, 7); ctx.fill();
        ctx.fillStyle = '#4b4b58'; ctx.beginPath(); ctx.arc(x + T / 2, y + T / 2, 6 * pulse, 0, 7); ctx.fill();
        ctx.fillStyle = (tx + ty) % 3 === 0 ? '#e8322b' : (tx + ty) % 3 === 1 ? '#ffd21f' : '#22b04b';
        ctx.fillRect(x + 2, y + 2, 3, 3);
      } else if (t === 5) {
        ctx.fillStyle = '#9c6a3a'; ctx.fillRect(x, y, T, 12);
        ctx.fillStyle = '#c28a50'; ctx.fillRect(x, y, T, 4);
        ctx.fillStyle = '#6e4825'; ctx.fillRect(x + 4, y + 4, 2, 8); ctx.fillRect(x + 20, y + 4, 2, 8);
      }
    }
  }
  // Plattformen sind optisch dünn, aber als ganze Kachel solide: Kollisionshöhe der Kachel bleibt gleich (vereinfachtes Leveldesign)

  // ---------- Zeichnen: Figuren ----------
  var SKIN = '#6b3e26';
  function drawRasta(x, y, face, anim, moving, air) {
    var p = P;
    ctx.save(); ctx.translate(Math.round(x + PW / 2), Math.round(y)); ctx.scale(face, 1);
    if (p.vomit > 0) { ctx.translate(0, 6); ctx.rotate(0.35); ctx.translate(0, -6); }
    var sw = moving && !air ? Math.sin(anim * 14) : 0, bob = Math.abs(sw) * 1.2;
    ctx.translate(0, -bob);
    // Dreads hinten
    ctx.fillStyle = '#3b2416';
    for (var d = 0; d < 5; d++) { var dx = -10 + d * 2.2, dl = 14 + (d % 2) * 4 + Math.sin(anim * 6 + d) * (moving ? 1.5 : 0.5); ctx.fillRect(dx - (air ? 1 : 0), 7, 2.4, dl); }
    // Beine
    var l1 = air ? -3 : sw * 5, l2 = air ? 4 : -sw * 5;
    ctx.fillStyle = SKIN; ctx.fillRect(-5 + l1, 33, 4, 7); ctx.fillRect(1 + l2, 33, 4, 7);
    ctx.fillStyle = '#222'; ctx.fillRect(-6 + l1, 40, 6, 2); ctx.fillRect(0 + l2, 40, 6, 2);
    ctx.fillStyle = '#2f5fa8'; ctx.fillRect(-6, 28, 12, 7);
    // Körper
    ctx.fillStyle = '#1f9e4a'; ctx.fillRect(-7, 17, 14, 12);
    ctx.fillStyle = '#ffd21f'; ctx.fillRect(-7, 21, 14, 3);
    ctx.fillStyle = '#e8322b'; ctx.fillRect(-7, 24, 14, 2);
    // Arme
    var ar = air ? -6 : sw * 4;
    ctx.fillStyle = SKIN; ctx.fillRect(-9, 18 + (air ? -3 : 0), 3, 9); ctx.fillRect(6, 18 - ar * 0.3, 3, 9);
    // Kopf
    ctx.fillStyle = p.vomit > 0 ? '#5f6b2a' : SKIN; ctx.beginPath(); ctx.arc(1, 11, 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(3, 9, 3, 2.5);
    ctx.fillStyle = '#111'; ctx.fillRect(4.5, 9.5, 1.5, 2);
    ctx.fillStyle = '#1b0f08'; ctx.beginPath(); ctx.arc(2, 16, 4, 0, Math.PI); ctx.fill();
    if (p.vomit > 0) { ctx.fillStyle = '#9acd32'; ctx.beginPath(); ctx.ellipse(7, 14, 2.5, 2, 0, 0, 7); ctx.fill(); }
    else { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(4, 13, 2.2, 0.2, Math.PI - 0.6); ctx.stroke(); }
    // Joint im Mund beim Fliegen
    if (p.fly > 0) { ctx.fillStyle = '#f6f1e3'; ctx.fillRect(6, 13, 7, 2); ctx.fillStyle = Math.sin(G.t * 20) > 0 ? '#ff6a00' : '#ffd21f'; ctx.fillRect(13, 13, 1.6, 2); }
    // Tam-Mütze in Rot-Gelb-Grün
    ctx.save(); ctx.beginPath(); ctx.ellipse(-1, 4, 10, 7, -0.15, 0, 7); ctx.clip();
    ctx.fillStyle = '#e8322b'; ctx.fillRect(-12, -4, 24, 5);
    ctx.fillStyle = '#ffd21f'; ctx.fillRect(-12, 1, 24, 4);
    ctx.fillStyle = '#22b04b'; ctx.fillRect(-12, 5, 24, 8);
    ctx.restore();
    ctx.fillStyle = '#111'; ctx.fillRect(-8, 8.5, 15, 1.6);
    ctx.restore();
  }

  function drawCop(e) {
    var dead = !e.alive, sq = dead && e.deadType === 'squash';
    ctx.save(); ctx.translate(Math.round(e.x + e.w / 2), Math.round(e.y)); ctx.scale(e.dir, 1);
    if (sq) { ctx.translate(0, e.h); ctx.scale(1.2, 0.3); ctx.translate(0, -e.h); }
    if (dead && e.deadType === 'flip') { ctx.translate(0, e.h / 2); ctx.rotate(Math.PI); ctx.translate(0, -e.h / 2); }
    var sw = Math.sin(e.anim * 10);
    ctx.fillStyle = '#111a33'; ctx.fillRect(-6 + sw * 3, 28, 5, 8); ctx.fillRect(1 - sw * 3, 28, 5, 8);
    ctx.fillStyle = '#1d3a8a'; ctx.fillRect(-8, 14, 16, 16);
    ctx.fillStyle = '#ffd21f'; ctx.fillRect(2, 17, 3, 3);
    ctx.fillStyle = '#111'; ctx.fillRect(-8, 26, 16, 2);
    ctx.fillStyle = '#1d3a8a'; ctx.fillRect(-10, 15, 3, 10); ctx.fillRect(7, 15, 3, 10);
    ctx.fillStyle = '#e9b98c'; ctx.beginPath(); ctx.arc(1, 9, 6.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#111'; ctx.fillRect(3, 7, 2, 2); ctx.fillRect(1, 5.3, 5, 1);
    ctx.fillStyle = '#3a2410'; ctx.fillRect(1, 11, 6, 2);
    ctx.fillStyle = '#0d1a40'; ctx.fillRect(-7, 0, 15, 5); ctx.fillRect(1, 4, 9, 2);
    ctx.fillStyle = '#ffd21f'; ctx.fillRect(0, 1, 3, 3);
    ctx.restore();
  }
  function drawPol(e) {
    var dead = !e.alive, sq = dead && e.deadType === 'squash';
    ctx.save(); ctx.translate(Math.round(e.x + e.w / 2), Math.round(e.y)); ctx.scale(e.dir, 1);
    if (sq) { ctx.translate(0, e.h); ctx.scale(1.2, 0.3); ctx.translate(0, -e.h); }
    if (dead && e.deadType === 'flip') { ctx.translate(0, e.h / 2); ctx.rotate(Math.PI); ctx.translate(0, -e.h / 2); }
    var sw = e.throwAnim > 0 ? 0 : Math.sin(e.anim * 8);
    ctx.fillStyle = '#2b2f38'; ctx.fillRect(-6 + sw * 3, 30, 5, 8); ctx.fillRect(1 - sw * 3, 30, 5, 8);
    ctx.fillStyle = '#5a606c'; ctx.fillRect(-9, 15, 18, 17);
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-3, 15); ctx.lineTo(3, 15); ctx.lineTo(0, 24); ctx.fill();
    ctx.fillStyle = '#c4161c'; ctx.fillRect(-1, 16, 2, 9);
    ctx.fillStyle = '#5a606c'; ctx.fillRect(-11, 16, 3, 11);
    if (e.throwAnim > 0) { ctx.fillRect(7, 4, 3, 13); ctx.drawImage(SPR.book, 5, -2, 10, 8); }
    else { ctx.fillRect(8, 16, 3, 11); ctx.fillStyle = '#4a2c14'; ctx.fillRect(6, 26, 9, 7); }
    ctx.fillStyle = '#f0c8a0'; ctx.beginPath(); ctx.arc(1, 9, 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#8a8a8a'; ctx.fillRect(-6, 3, 10, 2);
    ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.strokeRect(1.5, 6.5, 4, 3); ctx.strokeRect(-3.5, 6.5, 4, 3);
    ctx.fillStyle = '#111'; ctx.fillRect(3, 12.5, 4, 1);
    ctx.restore();
  }

  function drawHut(lv) {
    var x = lv.hutX, y = lv.hutY;
    ctx.fillStyle = '#7a4a26'; ctx.fillRect(x + 8, y - 80, 6, 80); ctx.fillRect(x + 106, y - 80, 6, 80);
    ctx.fillStyle = '#c99a5b'; ctx.fillRect(x + 14, y - 40, 92, 40);
    ctx.fillStyle = '#e8322b'; ctx.fillRect(x + 14, y - 40, 92, 6);
    ctx.fillStyle = '#ffd21f'; ctx.fillRect(x + 14, y - 34, 92, 6);
    ctx.fillStyle = '#22b04b'; ctx.fillRect(x + 14, y - 28, 92, 6);
    ctx.fillStyle = '#d8b35a';
    ctx.beginPath(); ctx.moveTo(x - 6, y - 78); ctx.lineTo(x + 60, y - 118); ctx.lineTo(x + 126, y - 78); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#a8843a'; ctx.lineWidth = 1;
    for (var i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(x + i * 11, y - 78); ctx.lineTo(x + 60, y - 114); ctx.stroke(); }
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x + 30, y - 72, 60, 18);
    ctx.fillStyle = '#ffd21f'; ctx.font = '13px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('IRIE BAR', x + 60, y - 62);
    jamFlag(ctx, x + 112, y - 112, 24, 14);
    ctx.fillStyle = '#7a4a26'; ctx.fillRect(x + 110, y - 114, 2, 36);
    for (i = 0; i < 2; i++) { var sx = x - 34 + i * 158; ctx.fillStyle = '#1a1a1f'; ctx.fillRect(sx, y - 46, 26, 46); ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(sx + 13, y - 30, 8 + Math.max(0, Math.sin(G.t * 8)) * 1.5, 0, 7); ctx.arc(sx + 13, y - 10, 6, 0, 7); ctx.fill(); }
  }
  function drawCP(cp) {
    ctx.fillStyle = '#ddd'; ctx.fillRect(cp.x, cp.y - 90, 3, 90);
    ctx.fillStyle = '#ffd21f'; ctx.beginPath(); ctx.arc(cp.x + 1.5, cp.y - 92, 3.5, 0, 7); ctx.fill();
    var fy = cp.on ? cp.y - 88 : cp.y - 24;
    jamFlag(ctx, cp.x + 3, fy, 30, 18);
  }

  // ---------- Zeichnen: Text ----------
  function text(s, x, y, size, col, align, base) {
    ctx.font = size + 'px ' + FONT; ctx.textAlign = align || 'center'; ctx.textBaseline = base || 'middle';
    ctx.lineWidth = Math.max(2, size / 6); ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.lineJoin = 'round';
    ctx.strokeText(s, x, y); ctx.fillStyle = col || '#fff'; ctx.fillText(s, x, y);
  }
  function neon(s, x, y, size, col) {
    ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 14; text(s, x, y, size, col); ctx.restore();
  }

  function drawWorld() {
    var lv = G.lv, cam = Math.round(G.camX + (G.shake > 0 ? (Math.random() - 0.5) * 4 : 0));
    drawBG(G.lvIdx, cam);
    ctx.save(); ctx.translate(-cam, 0);
    if (lv.cp) drawCP(lv.cp);
    drawHut(lv);
    drawTiles(cam);
    // Blätter
    var i;
    for (i = 0; i < lv.leaves.length; i++) {
      var L = lv.leaves[i]; if (L.got || L.x < cam - 20 || L.x > cam + VW + 20) continue;
      var sx = Math.cos(G.t * 3 + L.x * 0.05);
      ctx.save(); ctx.translate(L.x, L.y + Math.sin(G.t * 3 + L.x) * 1.5); ctx.scale(0.35 + 0.65 * Math.abs(sx), 1);
      ctx.drawImage(SPR.leaf, -11, -11, 22, 22); ctx.restore();
    }
    // Items
    items.forEach(function (it) {
      var s = SPR[it.type], w = it.type === 'beer' ? 13 : it.type === 'plant' ? 24 : 22, h = it.type === 'beer' ? 24 : it.type === 'plant' ? 26 : 22;
      ctx.save(); ctx.shadowColor = it.type === 'beer' ? '#ffb020' : '#fff'; ctx.shadowBlur = 8 + Math.sin(G.t * 8) * 4;
      ctx.drawImage(s, it.x + (it.w - w) / 2, it.y + it.h - h, w, h); ctx.restore();
    });
    // Gegner
    lv.enemies.forEach(function (e) {
      if (!e.alive && (e.deadType === 'squash' ? e.dead > 0.5 : e.y > ROWS * T + 60)) return;
      if (e.x < cam - 40 || e.x > cam + VW + 40) return;
      if (e.type === 'cop') drawCop(e); else drawPol(e);
    });
    // Spieler
    if (P) {
      var blink = P.safe > 0 && Math.floor(G.t * 12) % 2 === 0;
      if (!blink) {
        if (P.star > 0) { ctx.save(); ctx.shadowColor = ['#e8322b', '#ffd21f', '#22b04b'][Math.floor(G.t * 10) % 3]; ctx.shadowBlur = 16; }
        if (P.dead) { ctx.save(); ctx.translate(P.x + PW / 2, P.y + PH / 2); ctx.rotate(Math.min(P.deadT * 4, Math.PI)); ctx.translate(-P.x - PW / 2, -P.y - PH / 2); }
        drawRasta(P.x, P.y, P.face, P.anim, Math.abs(P.vx) > 20, !P.onGround && !P.dead);
        if (P.dead) ctx.restore();
        if (P.star > 0) ctx.restore();
      }
    }
    // Projektile
    books.forEach(function (b) { ctx.save(); ctx.translate(b.x + 7, b.y + 5.5); ctx.rotate(b.rot); ctx.drawImage(SPR.book, -8, -6, 16, 12); ctx.restore(); });
    cookies.forEach(function (c) { ctx.save(); ctx.translate(c.x + 7, c.y + 7); ctx.rotate(c.rot); ctx.drawImage(SPR.cookie, -8, -8, 16, 16); ctx.restore(); });
    // Partikel
    parts.forEach(function (p) {
      var a = p.life / p.max; ctx.globalAlpha = Math.min(1, a * 1.5);
      if (p.kind === 'leaf') ctx.drawImage(SPR.leafS, p.x - 7, p.y - 7, 14, 14);
      else if (p.kind === 'ring') { ctx.strokeStyle = p.col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, (1 - a) * 18 + 4, 0, 7); ctx.stroke(); }
      else if (p.kind === 'smoke') { ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, p.size + (1 - a) * 8, 0, 7); ctx.fill(); }
      else if (p.kind === 'drop' || p.kind === 'spark') { ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 7); ctx.fill(); }
      else { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.col; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size); ctx.restore(); }
    });
    ctx.globalAlpha = 1;
    pops.forEach(function (p) { ctx.globalAlpha = Math.min(1, p.life * 2); text(p.txt, p.x, p.y, 13, p.col); });
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawHUD() {
    ctx.fillStyle = 'rgba(10,12,20,.55)'; ctx.fillRect(0, 0, VW, 26);
    ctx.drawImage(SPR.leaf, 6, 2, 22, 22);
    text('× ' + G.leaves + '/50', 32, 14, 15, '#b4ffb0', 'left');
    text('♥ × ' + G.lives, 140, 14, 15, '#ff7a9c', 'left');
    text('Level ' + (G.lvIdx + 1) + ' · ' + LEVELS[G.lvIdx].name, VW / 2 + 40, 14, 14, '#00f0ff');
    text(String(G.score).padStart(7, '0'), VW - 8, 14, 15, '#fff', 'right');
    var y = 34;
    function bar(img, iw, ih, t, max, col, label) {
      ctx.fillStyle = 'rgba(10,12,20,.55)'; ctx.fillRect(6, y - 2, 130, 20);
      ctx.drawImage(img, 9, y + 8 - ih / 2, iw, ih);
      ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(30, y + 4, 100, 8);
      ctx.fillStyle = col; ctx.fillRect(30, y + 4, 100 * clamp(t / max, 0, 1), 8);
      if (label) text(label, 80, y + 8, 10, '#fff');
      y += 22;
    }
    if (P.fly > 0) bar(SPR.joint, 16, 16, P.fly, 10, '#00f0ff');
    if (P.star > 0) bar(SPR.plant, 15, 16, P.star, 10, '#7cff6b');
    if (P.vomit > 0) bar(SPR.beer, 8, 15, P.vomit, 3, '#ffb020');
    if (P.cookies > 0) {
      ctx.fillStyle = 'rgba(10,12,20,.55)'; ctx.fillRect(6, y - 2, 70, 20);
      ctx.drawImage(SPR.cookie, 9, y, 16, 16); text('× ' + P.cookies, 30, y + 8, 13, '#ffcf7a', 'left');
    }
  }

  function overlay(a) { ctx.fillStyle = 'rgba(10,12,20,' + a + ')'; ctx.fillRect(0, 0, VW, VH); }
  function touchMode() { return document.body.classList.contains('is-touch'); }

  function drawTitle() {
    drawBG(0, G.t * 30);
    ctx.fillStyle = GROUND.beach.body; ctx.fillRect(0, 300, VW, 60);
    ctx.fillStyle = GROUND.beach.top; ctx.fillRect(0, 300, VW, 8);
    overlay(0.35);
    neon('RASTA-MAN', VW / 2, 92, 58, '#00f0ff');
    text(tt('sub'), VW / 2, 140, 16, '#ff2bd6');
    var stripes = ['#e8322b', '#ffd21f', '#22b04b'];
    for (var i = 0; i < 3; i++) { ctx.fillStyle = stripes[i]; ctx.fillRect(VW / 2 - 150, 158 + i * 4, 300, 4); }
    var fake = P; P = newPlayer(0, 0); P.anim = G.t;
    ctx.save(); ctx.translate(VW / 2 - 30, 220); ctx.scale(1.6, 1.6);
    drawRasta(0, 0, 1, G.t, true, false); ctx.restore(); P = fake;
    ctx.save(); ctx.translate(VW / 2 + 40, 232); ctx.scale(1.3, 1.3); ctx.drawImage(SPR.leaf, 0, 0, 22, 22); ctx.restore();
    if (Math.floor(G.t * 2) % 2 === 0) text(tt(touchMode() ? 'tapStart' : 'keyStart'), VW / 2, 330, 17, '#fff');
  }

  function drawIntro() {
    overlay(0.82);
    var L = LEVELS[G.lvIdx];
    text('Level ' + (G.lvIdx + 1) + ' / ' + LEVELS.length, VW / 2, 92, 18, '#ff2bd6');
    neon(L.name, VW / 2, 140, 44, '#00f0ff');
    var stripes = ['#e8322b', '#ffd21f', '#22b04b'];
    for (var i = 0; i < 3; i++) { ctx.fillStyle = stripes[i]; ctx.fillRect(VW / 2 - 120, 172 + i * 3, 240, 3); }
    if (L.code) {
      text(tt('cheatFor'), VW / 2, 212, 15, '#d9deef');
      ctx.fillStyle = 'rgba(255,43,214,.12)'; ctx.fillRect(VW / 2 - 110, 228, 220, 38);
      ctx.strokeStyle = '#ff2bd6'; ctx.lineWidth = 1.5; ctx.strokeRect(VW / 2 - 110, 228, 220, 38);
      neon(L.code, VW / 2, 248, 24, '#ffd21f');
    } else {
      text(tt('intro1'), VW / 2, 215, 15, '#d9deef');
      text(tt('intro2'), VW / 2, 238, 15, '#d9deef');
    }
    text('♥ × ' + G.lives, VW / 2, 296, 16, '#ff7a9c');
    if (G.timer > 0.6) text(tt(touchMode() ? 'tapGo' : 'keyGo'), VW / 2, 330, 13, '#8b93b3');
  }

  function render() {
    ctx.setTransform(SC, 0, 0, SC, 0, 0);
    ctx.imageSmoothingEnabled = true;
    if (G.state === 'title') { drawTitle(); return; }
    drawWorld(); drawHUD();
    if (G.state === 'intro') drawIntro();
    else if (G.state === 'pause') { overlay(0.6); neon('Pause', VW / 2, 150, 42, '#00f0ff'); text(tt(touchMode() ? 'tapResume' : 'keyResume'), VW / 2, 200, 15, '#d9deef'); }
    else if (G.state === 'clear') {
      overlay(Math.min(0.55, G.timer * 0.4));
      neon(tt('clear'), VW / 2, 130, 38, '#7cff6b');
      text(LEVELS[G.lvIdx].name + ' · ' + G.levelLeaves + ' ' + tt('leaves'), VW / 2, 180, 16, '#d9deef');
      text('Bonus +1000', VW / 2, 210, 16, '#ffd21f');
    } else if (G.state === 'gameover') {
      overlay(0.75); neon('Game Over', VW / 2, 130, 46, '#ff2bd6');
      text(tt('score') + ': ' + G.score, VW / 2, 185, 18, '#fff');
      if (G.lvIdx > 0) text(tt('contCode') + LEVELS[G.lvIdx].code, VW / 2, 220, 15, '#ffd21f');
      if (G.timer > 1.5) text(tt(touchMode() ? 'tapTitle' : 'keyTitle'), VW / 2, 300, 14, '#8b93b3');
    } else if (G.state === 'win') {
      overlay(0.7); neon('One Love!', VW / 2, 110, 50, '#7cff6b');
      text(tt('winText'), VW / 2, 165, 17, '#fff');
      text(tt('score') + ': ' + G.score, VW / 2, 200, 18, '#ffd21f');
      if (G.timer > 1.5) text(tt(touchMode() ? 'tapTitle' : 'keyTitle'), VW / 2, 300, 14, '#8b93b3');
    }
  }

  // ---------- Loop ----------
  var last = performance.now(), acc = 0, STEP = 1 / 120;
  function frame(ts) {
    var dt = Math.min((ts - last) / 1000, 0.1); last = ts; acc += dt;
    while (acc >= STEP) { update(STEP); acc -= STEP; }
    render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', function () { if (document.hidden && G.state === 'play') inp.pauseP = true; });

  // ---------- Seitensteuerung ----------
  var bStart = $('b-start'), bPause = $('b-pause'), bSound = $('b-sound'), bFs = $('b-fs');
  function updateButtons() {
    var running = G.state === 'play' || G.state === 'pause' || G.state === 'intro' || G.state === 'clear';
    bStart.textContent = tt(running ? 'restart' : 'start');
    bPause.textContent = tt(G.state === 'pause' ? 'resume' : 'pause');
    bPause.disabled = !(G.state === 'play' || G.state === 'pause');
  }
  function toggleSound() {
    var on = Audio.toggle();
    bSound.textContent = tt(on ? 'soundOn' : 'soundOff'); bSound.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  function isFS() { return !!(document.fullscreenElement || document.webkitFullscreenElement) || shell.classList.contains('pseudo-fs'); }
  function pseudo(on) {
    shell.classList.toggle('pseudo-fs', on); document.body.classList.toggle('no-scroll', on);
    fsLabel();
  }
  function fsLabel() { bFs.textContent = tt(isFS() ? 'fsOff' : 'fs'); }
  function toggleFS() {
    if (shell.classList.contains('pseudo-fs')) { pseudo(false); return; }
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document); return;
    }
    var req = shell.requestFullscreen || shell.webkitRequestFullscreen;
    if (req) {
      try {
        var pr = req.call(shell, { navigationUI: 'hide' });
        if (pr && pr.then) pr.then(function () {
          if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {});
        }).catch(function () { pseudo(true); });
      } catch (e) { pseudo(true); }
    } else pseudo(true);
    cv.focus({ preventScroll: true });
  }
  document.addEventListener('fullscreenchange', fsLabel);
  document.addEventListener('webkitfullscreenchange', fsLabel);

  function blurAfter(fn) { return function (e) { Audio.unlock(); fn(e); e.currentTarget.blur(); cv.focus({ preventScroll: true }); }; }
  bStart.addEventListener('click', blurAfter(function () { startGame(0); }));
  bPause.addEventListener('click', blurAfter(function () { inp.pauseP = true; }));
  bSound.addEventListener('click', blurAfter(toggleSound));
  bFs.addEventListener('click', blurAfter(toggleFS));

  var cheatForm = $('cheat'), cheatIn = $('cheat-in'), cheatMsg = $('cheat-msg');
  cheatForm.addEventListener('submit', function (e) {
    e.preventDefault(); Audio.unlock();
    var code = cheatIn.value.trim().toUpperCase(), idx = -1;
    for (var i = 1; i < LEVELS.length; i++) if (LEVELS[i].code === code) idx = i;
    if (idx < 0) { lastMsg = function () { return tt('badCode'); }; cheatMsg.textContent = tt('badCode'); cheatMsg.className = 'msg err'; return; }
    lastMsg = function () { return tt('loaded').replace('{n}', idx + 1).replace('{name}', LEVELS[idx].name); }; cheatMsg.textContent = lastMsg(); cheatMsg.className = 'msg';
    cheatIn.value = ''; cheatIn.blur();
    startGame(idx);
    shell.scrollIntoView({ behavior: 'smooth', block: 'center' });
    cv.focus({ preventScroll: true });
  });

  // Theme-Umschalter wie auf der Hauptseite
  (function () {
    var root = document.documentElement, btn = $('mode');
    btn.addEventListener('click', function () {
      var light = root.getAttribute('data-theme') !== 'light';
      root.setAttribute('data-theme', light ? 'light' : 'dark');
      btn.textContent = light ? tt('dark') : tt('light');
    });
  })();


  // Sprachumschalter wie auf der Hauptseite
  var bLang = $('lang'), lastMsg = null;
  function applyLang(l) {
    LANG = l; document.documentElement.lang = l; document.title = tt('title');
    Array.prototype.forEach.call(document.querySelectorAll('[data-t]'), function (el) { el.textContent = tt(el.getAttribute('data-t')); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-ta]'), function (el) { el.setAttribute('aria-label', tt(el.getAttribute('data-ta'))); });
    bLang.textContent = tt('langBtn');
    $('mode').textContent = document.documentElement.getAttribute('data-theme') === 'light' ? tt('dark') : tt('light');
    bSound.textContent = tt(Audio.isOn() ? 'soundOn' : 'soundOff');
    fsLabel(); updateButtons();
    if (lastMsg) cheatMsg.textContent = lastMsg();
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  bLang.addEventListener('click', function (e) { applyLang(LANG === 'en' ? 'de' : 'en'); e.currentTarget.blur(); });

  applyLang(LANG);

  // Für Tests im Browser
  window.__rasta = { applyLang: applyLang, G: G, genLevel: genLevel, LEVELS: LEVELS, startGame: startGame, get P() { return P; } };
})();
