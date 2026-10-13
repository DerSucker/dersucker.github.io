/* Firewall Breaker – Retro-Ballspiel
   by Martin Sucker | github.com/DerSucker | www.martinsucker.de
   Reines HTML/CSS/JS für GitHub Pages, keine externen Abhängigkeiten. */
(function () {
  'use strict';

  // ---------- Konstanten ----------
  var W = 480, H = 640, SC = 2;
  var COLS = 12, BW = 38, BH = 16, GX = (W - COLS * BW) / 2, GY = 64, ROWS = 20;
  var TOP = 34, R = 6, PY = 596, PH = 12;
  var FONT = '"Special Elite","American Typewriter","Courier New",Courier,monospace';
  var HS_KEY = 'firewallBreaker.highscore';

  // ---------- Sprache ----------
  var I18N = {
    de: {
      light: '☀ Lightmode', dark: '☾ Darkmode',
      back: 'Startseite', backAria: 'Startseite',
      title: 'Firewall Breaker – Games – Martin Sucker', role: 'Durchbrich die Firewall – Block für Block', go: 'OK',
      hControls: 'Steuerung', cMove: 'Paddle bewegen', cMoveD: '← → oder A / D, alternativ die Maus', cLaunch: 'Ball starten', cLaunchD: 'Leertaste oder Mausklick',
      cSys: 'Pause / Ton / Vollbild', cSysD: 'P bzw. Esc / M / F', cMobD: 'Auf dem Spielfeld wischen oder ◀ ▶ benutzen. Tippen startet den Ball.',
      cCheatD: 'Ab Level 2 am Levelanfang angezeigt. Eingabe auf dem Startbildschirm.',
      hBricks: 'Firewall-Blöcke', bNormal: 'Normal', bNormalD: '1 Treffer.', bHard: 'Gehärtet', bHardD: '2–3 Treffer, bekommt sichtbare Risse.',
      bMetal: 'Metall', bMetalD: 'Unzerstörbar.', bBoom: 'Explosiv', bBoomD: 'Reißt alle Nachbarsteine mit.', bBoss: 'Master-Firewall', bBossD: 'Endgegner in Level 5. Bewegt sich und baut Steine nach.',
      pMultiD: 'Zwei zusätzliche Datenpakete.', pWide: 'W · Breites Paddle', pWideD: 'Das Kabel wird länger.', pLaserD: 'Feuert automatisch nach oben.',
      pSticky: 'C · Klebe-Paddle', pStickyD: 'Ball bleibt hängen, Start per Leertaste oder Tippen.', pSlow: 'S · Zeitlupe', pSlowD: 'Ball wird langsamer.',
      pLife: '+ · Extraleben', pLifeD: 'Ein Leben mehr.', pNarrow: 'N · Schmales Paddle', pNarrowD: 'Negativ: Das Kabel schrumpft.',
      legal: 'Impressum & Datenschutz', themeAria: 'Design wechseln', canvasAria: 'Spielfeld Firewall Breaker', langBtn: 'English',
      start: '▶ Start', restart: '↺ Neustart', pause: '❚❚ Pause', resume: '▶ Weiter', soundOn: '♫ Ton an', soundOff: '♫ Ton aus', fs: '⛶ Vollbild', fsOff: '⛶ Vollbild beenden',
      badCode: 'Unbekannter Code.', loaded: 'Level {n} geladen.',
      sub: 'Ein Retro-Ballspiel gegen die Firewall', hs: 'Highscore', keyStart: 'Leertaste = Start', tapStart: 'Tippen = Start', cheatLbl: 'Cheatcode:',
      score: 'Punkte', level: 'Level', lives: 'Leben', codeFor: 'Cheatcode für dieses Level:', getReady: 'Bereit machen…',
      keyLaunch: 'Leertaste / Klick = Ball starten', tapLaunch: 'Tippen = Ball starten', pauseT: 'Pause', keyResume: 'P oder Esc zum Weiterspielen', tapResume: 'Tippen zum Weiterspielen',
      clear: 'Firewall durchbrochen!', over: 'Verbindung getrennt', win: 'Zugriff gewährt!', winSub: 'Die Master-Firewall ist gefallen.',
      newHs: 'Neuer Highscore!', keyTitle: 'Leertaste = Startbildschirm', tapTitle: 'Tippen = Startbildschirm', contCode: 'Weiter mit Cheatcode: ',
      combo: 'Combo', bossName: 'MASTER-FIREWALL', bossWarn: 'Endgegner!',
      pu_multi: 'Multiball!', pu_wide: 'Breites Kabel!', pu_laser: 'Laser!', pu_sticky: 'Klebe-Paddle!', pu_slow: 'Zeitlupe!', pu_life: 'Extraleben!', pu_narrow: 'Kabel geschrumpft!',
      L1: 'Burg-Firewall', L2: 'Server-Rack', L3: 'Security-Logo', L4: 'Firewall-Mauer', L5: 'Master-Firewall'
    },
    en: {
      light: '☀ Light mode', dark: '☾ Dark mode',
      back: 'Home', backAria: 'Home',
      title: 'Firewall Breaker – Games – Martin Sucker', role: 'Break through the firewall – block by block', go: 'OK',
      hControls: 'Controls', cMove: 'Move paddle', cMoveD: '← → or A / D, or use the mouse', cLaunch: 'Launch ball', cLaunchD: 'Space or mouse click',
      cSys: 'Pause / Sound / Fullscreen', cSysD: 'P or Esc / M / F', cMobD: 'Swipe on the game field or use ◀ ▶. Tap to launch the ball.',
      cCheatD: 'Shown at the start of each level from level 2. Enter it on the start screen.',
      hBricks: 'Firewall blocks', bNormal: 'Normal', bNormalD: '1 hit.', bHard: 'Hardened', bHardD: '2–3 hits, shows visible cracks.',
      bMetal: 'Metal', bMetalD: 'Indestructible.', bBoom: 'Explosive', bBoomD: 'Takes all neighbouring blocks with it.', bBoss: 'Master Firewall', bBossD: 'Boss in level 5. Moves around and rebuilds blocks.',
      pMultiD: 'Two extra data packets.', pWide: 'W · Wide paddle', pWideD: 'The cable gets longer.', pLaserD: 'Fires upwards automatically.',
      pSticky: 'C · Catch paddle', pStickyD: 'The ball sticks; launch with Space or a tap.', pSlow: 'S · Slow motion', pSlowD: 'The ball slows down.',
      pLife: '+ · Extra life', pLifeD: 'One more life.', pNarrow: 'N · Narrow paddle', pNarrowD: 'Negative: the cable shrinks.',
      legal: 'Legal notice & privacy', themeAria: 'Switch theme', canvasAria: 'Firewall Breaker game screen', langBtn: 'Deutsch',
      start: '▶ Start', restart: '↺ Restart', pause: '❚❚ Pause', resume: '▶ Resume', soundOn: '♫ Sound on', soundOff: '♫ Sound off', fs: '⛶ Fullscreen', fsOff: '⛶ Exit fullscreen',
      badCode: 'Unknown code.', loaded: 'Level {n} loaded.',
      sub: 'A retro ball game against the firewall', hs: 'High score', keyStart: 'Space = start', tapStart: 'Tap = start', cheatLbl: 'Cheat code:',
      score: 'Score', level: 'Level', lives: 'Lives', codeFor: 'Cheat code for this level:', getReady: 'Get ready…',
      keyLaunch: 'Space / click = launch ball', tapLaunch: 'Tap = launch ball', pauseT: 'Pause', keyResume: 'P or Esc to resume', tapResume: 'Tap to resume',
      clear: 'Firewall breached!', over: 'Connection lost', win: 'Access granted!', winSub: 'The Master Firewall has fallen.',
      newHs: 'New high score!', keyTitle: 'Space = start screen', tapTitle: 'Tap = start screen', contCode: 'Continue with cheat code: ',
      combo: 'Combo', bossName: 'MASTER FIREWALL', bossWarn: 'Boss fight!',
      pu_multi: 'Multiball!', pu_wide: 'Wide cable!', pu_laser: 'Laser!', pu_sticky: 'Catch paddle!', pu_slow: 'Slow motion!', pu_life: 'Extra life!', pu_narrow: 'Cable shrunk!',
      L1: 'Castle Firewall', L2: 'Server Rack', L3: 'Security Logo', L4: 'Firewall Wall', L5: 'Master Firewall'
    }
  };
  var LANG = 'de';
  try { if (localStorage.getItem('lang') === 'en') LANG = 'en'; } catch (e) {}
  function tt(k) { return (I18N[LANG] && I18N[LANG][k]) || I18N.de[k] || k; }

  // ---------- Level ----------
  // . leer  n normal  h gehärtet (2)  H gehärtet (3)  m Metall  x explosiv
  var LEVELS = [
    { code: '', speed: 290, map: [
      'n.n......n.n',
      'nnn......nnn',
      'nhn.n..n.nhn',
      'nnnnnnnnnnnn',
      'nnnnhhhhnnnn',
      'nxnnn..nnnxn',
      'nnnnn..nnnnn',
      'hnnnn..nnnnh',
      'nnnnnnnnnnnn'] },
    { code: 'PING', speed: 315, map: [
      'mmmmm..mmmmm',
      'mhnhm..mhnhm',
      'mnxnm..mnxnm',
      'mhnhm..mhnhm',
      'mnnnm..mnnnm',
      'mhxhm..mhxhm',
      'mnnnm..mnnnm',
      'm...m..m...m',
      '............',
      'nnnnnnnnnnnn'] },
    { code: 'SUBNET', speed: 340, map: [
      '....HHHH....',
      '...H....H...',
      '...H....H...',
      '...h....h...',
      '..nnnnnnnn..',
      '..nnnnnnnn..',
      '..nnnxxnnn..',
      '..nnnmmnnn..',
      '..nnnmmnnn..',
      '..hhhhhhhh..',
      '..HHHHHHHH..'] },
    { code: 'PORT443', speed: 365, map: [
      'HHHHHHHHHHHH',
      'hxhhhhhhhhxh',
      'nnnmnnnnmnnn',
      'nnnmnxxnmnnn',
      'hhhmhhhhmhhh',
      'nnnmnnnnmnnn',
      'xnnnnnnnnnnx',
      'HhHhHhHhHhHh',
      '............',
      '.m..m..m..m.'] },
    { code: 'ROOT', speed: 385, boss: true, map: [
      '............',
      '............',
      '............',
      '............',
      'hhhhhhhhhhhh',
      'nnmnnnnnnmnn',
      'nnnnxnnxnnnn',
      'nnnnnnnnnnnn'] }
  ];
  var ROWCOL = ['#ff2bd6', '#c45cff', '#7d7bff', '#00b7ff', '#00f0ff', '#00e0a8', '#7cff6b', '#ffe14d', '#ffb020', '#ff7a3d', '#ff4d6d'];

  // ---------- Hilfen ----------
  function $(id) { return document.getElementById(id); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  var cv = $('cv'), ctx = cv.getContext('2d');
  cv.width = W * SC; cv.height = H * SC;

  // ---------- Audio: funkiger Chiptune + Effekte ----------
  var Sound = (function () {
    var ac = null, master, mus, sfx, noiseBuf, pulse12, pulse25, on = true, playing = false, timer = 0, next = 0, step = 0;
    var bpm = 112, root = 40, lvl = 0;
    var PROG = [[0, 'm7'], [0, 'm7'], [5, '7'], [5, '7'], [0, 'm7'], [0, 'm7'], [8, 'M7'], [7, '7']];
    var CH = { m7: [0, 3, 7, 10], '7': [0, 4, 7, 10], M7: [0, 4, 7, 11] };
    // Bass: [Schritt, Intervall]
    var BASS = [[0, 0], [3, 12], [4, 0], [6, 10], [7, 12], [10, 0], [11, 7], [12, 10], [14, 12]];
    // Lead-Motiv über 2 Takte (32 Schritte), Werte = Halbtöne über E4
    var LEAD = [0, null, 3, null, 5, null, 7, 5, null, 3, null, 0, null, null, 10, null,
      12, null, 10, 7, null, 5, null, 7, null, null, 3, null, 5, 3, 0, null];
    var LEAD2 = [7, null, 7, 10, null, 12, null, 10, 7, null, 5, null, 7, null, null, null,
      3, null, 5, null, 7, null, 10, null, 12, null, 15, null, 12, 10, 7, null];
    function unlock() {
      if (!ac) {
        var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
        ac = new C();
        master = ac.createGain(); master.gain.value = on ? 0.5 : 0; master.connect(ac.destination);
        mus = ac.createGain(); mus.gain.value = 0.42; mus.connect(master);
        sfx = ac.createGain(); sfx.gain.value = 0.6; sfx.connect(master);
        noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
        var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        pulse12 = mkPulse(0.125); pulse25 = mkPulse(0.25);
      }
      if (ac.state === 'suspended') ac.resume();
    }
    function mkPulse(duty) {
      // Pulswelle mit Tastverhältnis 'duty' als Fourier-Reihe
      var n = 48, re = new Float32Array(n), im = new Float32Array(n);
      for (var k = 1; k < n; k++) re[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty);
      return ac.createPeriodicWave(re, im);
    }
    function mf(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function env(g, t, a, d, p) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(p, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
    function tone(t, f, dur, wave, peak, dest, lp) {
      var o = ac.createOscillator(), g = ac.createGain();
      if (typeof wave === 'string') o.type = wave; else o.setPeriodicWave(wave);
      o.frequency.setValueAtTime(f, t);
      var node = o;
      if (lp) { var fl = ac.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; o.connect(fl); node = fl; }
      node.connect(g); g.connect(dest); env(g, t, 0.004, dur, peak); o.start(t); o.stop(t + dur + 0.05); return o;
    }
    function noise(t, dur, peak, type, f, dest) {
      var s = ac.createBufferSource(); s.buffer = noiseBuf;
      var fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f;
      var g = ac.createGain(); s.connect(fl); fl.connect(g); g.connect(dest);
      env(g, t, 0.002, dur, peak); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
    }
    function kick(t) { var o = ac.createOscillator(), g = ac.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12); o.connect(g); g.connect(mus); env(g, t, 0.002, 0.18, 0.9); o.start(t); o.stop(t + 0.25); }
    function snare(t) { noise(t, 0.12, 0.45, 'highpass', 1500, mus); tone(t, 220, 0.06, 'triangle', 0.25, mus); }
    function hat(t, v, open) { noise(t, open ? 0.14 : 0.03, v, 'highpass', 8000, mus); }
    function playStep(s, t) {
      var st = s % 16, bar = Math.floor(s / 16) % 8, sd = 60 / bpm / 4;
      var ch = PROG[bar], r = root + ch[0], iv = CH[ch[1]];
      var boss = lvl === 4;
      // Drums (Funk-Groove)
      if (st === 0 || st === 10 || (st === 7 && bar % 2 === 1)) kick(t);
      if (st === 4 || st === 12) snare(t);
      if (st === 15 && bar === 7) snare(t);
      if (st % 2 === 0) hat(t, st % 4 === 2 ? 0.1 : 0.05, st === 14); else if (boss) hat(t, 0.03);
      // Slap-Bass mit Oktaven
      for (var i = 0; i < BASS.length; i++) if (BASS[i][0] === st) {
        var bi = BASS[i][1] === 10 ? iv[3] : BASS[i][1];
        tone(t, mf(r + bi), sd * 0.8, pulse25, 0.22, mus, 1400);
      }
      // Funk-Stabs auf den Offbeats
      if (st === 3 || st === 6 || st === 11) {
        for (var k = 1; k < 4; k++) tone(t, mf(r + 24 + iv[k]), sd * 0.6, pulse12, 0.045, mus, 4000);
      }
      // Lead: ab Takt 4 Melodie, vorher Arpeggio
      if (bar >= 4) {
        var mot = (lvl % 2 === 0) ? LEAD : LEAD2, n = mot[((bar - 4) % 2) * 16 + st];
        if (n != null) tone(t, mf(64 + n + (boss ? -2 : 0)), sd * 1.5, 'square', 0.05, mus, 3200);
      } else if (st % 2 === 1) {
        tone(t, mf(r + 36 + iv[(st >> 1) % 4]), sd * 0.5, pulse12, 0.03, mus, 5000);
      }
    }
    function tick() {
      if (!playing || !ac) return;
      var sd = 60 / bpm / 4;
      if (next < ac.currentTime) next = ac.currentTime + 0.05;
      while (next < ac.currentTime + 0.15) { playStep(step, next); next += sd; step++; }
    }
    function setLevel(i) { lvl = i; bpm = i === 4 ? 128 : 112 + i * 3; root = i === 4 ? 38 : 40; }
    function start() {
      unlock(); if (!ac || playing) return;
      playing = true; step = 0; next = ac.currentTime + 0.08;
      clearInterval(timer); timer = setInterval(tick, 30); tick();
    }
    function stop() { playing = false; clearInterval(timer); }
    function toggle() { on = !on; if (ac) master.gain.setTargetAtTime(on ? 0.5 : 0, ac.currentTime, 0.02); return on; }
    function fx(name, p) {
      if (!ac || !on) return;
      var t = ac.currentTime + 0.003, o;
      switch (name) {
        case 'paddle': tone(t, 520, 0.07, pulse25, 0.16, sfx); tone(t + 0.03, 780, 0.06, pulse25, 0.1, sfx); break;
        case 'wall': tone(t, 300, 0.04, 'square', 0.07, sfx, 2000); break;
        case 'brick': tone(t, mf(72 + Math.min(p || 0, 16)), 0.08, pulse25, 0.14, sfx); break;
        case 'crack': tone(t, mf(60 + Math.min(p || 0, 16)), 0.06, 'square', 0.12, sfx, 1800); noise(t, 0.05, 0.15, 'bandpass', 2500, sfx); break;
        case 'metal': tone(t, 1760, 0.15, 'triangle', 0.12, sfx); tone(t, 2637, 0.1, 'triangle', 0.06, sfx); noise(t, 0.04, 0.12, 'highpass', 6000, sfx); break;
        case 'boom': noise(t, 0.45, 0.6, 'lowpass', 900, sfx); tone(t, 90, 0.35, 'triangle', 0.5, sfx); break;
        case 'power': [0, 4, 7, 12, 16].forEach(function (n, k) { tone(t + k * 0.045, mf(76 + n), 0.07, pulse12, 0.11, sfx); }); break;
        case 'bad': [0, -3, -6, -9].forEach(function (n, k) { tone(t + k * 0.06, mf(64 + n), 0.08, 'square', 0.1, sfx, 1500); }); break;
        case 'life': [0, 4, 7, 12, 7, 12, 16].forEach(function (n, k) { tone(t + k * 0.07, mf(79 + n), 0.08, pulse25, 0.1, sfx); }); break;
        case 'laser': o = tone(t, 1600, 0.08, 'square', 0.06, sfx, 5000); o.frequency.exponentialRampToValueAtTime(500, t + 0.08); break;
        case 'lost': for (var i = 0; i < 5; i++) tone(t + i * 0.09, mf(70 - i * 4), 0.1, 'square', 0.12, sfx, 2000); break;
        case 'clear': [0, 4, 7, 12, 16, 19, 24].forEach(function (n, k) { tone(t + k * 0.08, mf(64 + n), 0.12, pulse25, 0.12, sfx); }); break;
        case 'over': [0, -5, -8, -12].forEach(function (n, k) { tone(t + k * 0.22, mf(60 + n), 0.25, 'triangle', 0.2, sfx); }); break;
        case 'bosshit': tone(t, 110, 0.12, 'square', 0.18, sfx, 900); noise(t, 0.08, 0.25, 'bandpass', 700, sfx); break;
        case 'build': tone(t, 220, 0.08, pulse12, 0.08, sfx); tone(t + 0.05, 330, 0.08, pulse12, 0.08, sfx); break;
        case 'launch': o = tone(t, 400, 0.1, pulse25, 0.12, sfx); o.frequency.exponentialRampToValueAtTime(900, t + 0.1); break;
        case 'pause': tone(t, 660, 0.05, 'square', 0.06, sfx); break;
      }
    }
    return { unlock: unlock, start: start, stop: stop, setLevel: setLevel, toggle: toggle, fx: fx, isOn: function () { return on; } };
  })();

  // ---------- Highscore ----------
  var highscore = 0;
  try { highscore = parseInt(localStorage.getItem(HS_KEY), 10) || 0; } catch (e) {}
  function saveHS() {
    if (G.score > highscore) { highscore = G.score; G.newHs = true; try { localStorage.setItem(HS_KEY, String(highscore)); } catch (e) {} }
  }

  // ---------- Zustand ----------
  var G = { state: 'title', lvl: 0, lives: 3, score: 0, timer: 0, t: 0, combo: 0, speedUp: 1, shake: 0, newHs: false };
  var bricks = [], cells = [], balls = [], drops = [], lasers = [], parts = [], pops = [], booms = [];
  var pad = { x: W / 2 - 40, w: 80, tw: 80 }, boss = null;
  var fxT = { wide: 0, narrow: 0, laser: 0, sticky: 0, slow: 0 }, laserCd = 0;

  function cellAt(c, r) { return (c >= 0 && c < COLS && r >= 0 && r < ROWS) ? cells[r * COLS + c] : null; }
  function makeBrick(c, r, type) {
    var hp = type === 'h' ? 2 : type === 'H' ? 3 : 1;
    var b = { c: c, r: r, x: GX + c * BW, y: GY + r * BH, w: BW, h: BH, type: type === 'H' ? 'h' : type, hp: hp, max: hp, alive: true, flash: 0, build: 1, col: ROWCOL[r % ROWCOL.length] };
    bricks.push(b); cells[r * COLS + c] = b; return b;
  }
  function loadLevel(i) {
    G.lvl = i; bricks = []; cells = new Array(COLS * ROWS); drops = []; lasers = []; parts = []; pops = []; booms = [];
    LEVELS[i].map.forEach(function (row, r) {
      for (var c = 0; c < COLS; c++) { var ch = row.charAt(c); if (ch !== '.' && ch) makeBrick(c, r, ch); }
    });
    boss = LEVELS[i].boss ? { x: W / 2 - 70, y: GY + 4, w: 140, h: 44, hp: 30, max: 30, flash: 0, buildT: 3, dead: false, deadT: 0, ph: 0 } : null;
    fxT = { wide: 0, narrow: 0, laser: 0, sticky: 0, slow: 0 };
    G.speedUp = 1; G.combo = 0;
    Sound.setLevel(i);
    resetBall();
  }
  function resetBall() {
    pad.tw = 80; pad.w = 80; pad.x = clamp(pad.x, 0, W - pad.w);
    fxT.wide = fxT.narrow = fxT.laser = fxT.sticky = fxT.slow = 0;
    balls = [{ x: pad.x + pad.w / 2, y: PY - R - 1, vx: 0, vy: 0, stuck: true, off: pad.w / 2, noPad: 0 }];
    G.combo = 0;
  }
  function startGame(i) {
    G.lives = 3; G.score = 0; G.newHs = false; pad.x = W / 2 - 40;
    loadLevel(i); G.state = 'intro'; G.timer = 0;
    Sound.stop(); Sound.start(); updateUI();
  }
  function baseSpeed() { return LEVELS[G.lvl].speed * G.speedUp * (fxT.slow > 0 ? 0.65 : 1); }

  // ---------- Effekte ----------
  function part(x, y, vx, vy, life, col, size, grav) { if (parts.length > 500) parts.shift(); parts.push({ x: x, y: y, vx: vx, vy: vy, life: life, max: life, col: col, size: size, grav: grav || 0 }); }
  function burst(x, y, col, n, sp) { for (var i = 0; i < n; i++) { var a = Math.random() * Math.PI * 2, s = rnd(40, sp || 220); part(x, y, Math.cos(a) * s, Math.sin(a) * s, rnd(0.3, 0.7), col, rnd(2, 4), 300); } }
  function pop(x, y, txt, col, size) { pops.push({ x: x, y: y, txt: txt, col: col || '#fff', life: 1.1, size: size || 13 }); }

  // ---------- Steine ----------
  function points(n) { var m = Math.max(1, Math.min(G.combo, 10)); G.score += n * m; return n * m; }
  function hitBrick(b, src) {
    if (!b.alive || b.build < 1) return;
    if (b.type === 'm') { b.flash = 0.15; Sound.fx('metal'); return; }
    if (src === 'ball') G.combo++;
    b.hp--; b.flash = 0.12;
    if (b.hp > 0) {
      points(20); Sound.fx('crack', G.combo);
      for (var i = 0; i < 4; i++) part(b.x + rnd(0, b.w), b.y + b.h, rnd(-40, 40), rnd(20, 80), 0.5, '#9aa3c7', 2, 300);
      return;
    }
    destroyBrick(b, src);
  }
  function destroyBrick(b, src) {
    if (!b.alive || b.type === 'm') return;
    b.alive = false; cells[b.r * COLS + b.c] = null;
    var pts = points(b.type === 'x' ? 60 : b.max > 1 ? 50 + b.max * 20 : 50);
    if (G.combo >= 3 && src === 'ball') pop(b.x + b.w / 2, b.y, tt('combo') + ' x' + Math.min(G.combo, 10), '#ffe14d', 12 + Math.min(G.combo, 10));
    else if (pts >= 100) pop(b.x + b.w / 2, b.y, '+' + pts, '#fff', 11);
    burst(b.x + b.w / 2, b.y + b.h / 2, b.type === 'x' ? '#ff7a3d' : b.col, 10);
    if (b.type === 'x') {
      Sound.fx('boom'); G.shake = 0.25;
      for (var dc = -1; dc <= 1; dc++) for (var dr = -1; dr <= 1; dr++) if (dc || dr) booms.push({ c: b.c + dc, r: b.r + dr, t: 0.07 });
      burst(b.x + b.w / 2, b.y + b.h / 2, '#ffe14d', 24, 320);
    } else Sound.fx('brick', G.combo);
    if (Math.random() < (src === 'boom' ? 0.08 : 0.17)) spawnDrop(b.x + b.w / 2, b.y + b.h / 2);
    if (!boss) checkClear();
  }
  function remaining() { var n = 0; for (var i = 0; i < bricks.length; i++) if (bricks[i].alive && bricks[i].type !== 'm') n++; return n; }
  function checkClear() {
    if (G.state === 'play' && remaining() === 0) levelClear();
  }
  function levelClear() {
    G.state = 'clear'; G.timer = 0; Sound.stop(); Sound.fx('clear');
    G.score += 1000 + 250 * G.lvl; saveHS(); updateUI();
  }

  // ---------- Power-ups ----------
  var PU = [
    { k: 'multi', l: 'M', c: '#00f0ff', w: 18 }, { k: 'wide', l: 'W', c: '#7cff6b', w: 17 }, { k: 'laser', l: 'L', c: '#ff4d6d', w: 14 },
    { k: 'sticky', l: 'C', c: '#c45cff', w: 14 }, { k: 'slow', l: 'S', c: '#ffe14d', w: 14 }, { k: 'life', l: '+', c: '#ff2bd6', w: 6 },
    { k: 'narrow', l: 'N', c: '#5a6278', w: 17, bad: true }
  ];
  function spawnDrop(x, y) {
    var tot = 0, i; for (i = 0; i < PU.length; i++) tot += PU[i].w;
    var r = Math.random() * tot; for (i = 0; i < PU.length; i++) { r -= PU[i].w; if (r <= 0) break; }
    var p = PU[Math.min(i, PU.length - 1)];
    drops.push({ x: x - 15, y: y - 7, w: 30, h: 14, p: p });
  }
  function applyPU(p, x, y) {
    pop(x, y - 10, tt('pu_' + p.k), p.c, 13);
    if (p.bad) Sound.fx('bad'); else if (p.k === 'life') Sound.fx('life'); else Sound.fx('power');
    G.score += p.bad ? 0 : 100;
    switch (p.k) {
      case 'multi':
        var src = balls.filter(function (b) { return !b.stuck; })[0] || balls[0];
        if (src.stuck) { src.stuck = false; launchBall(src); }
        for (var k = 0; k < 2; k++) {
          var a = Math.atan2(src.vy, src.vx) + (k ? 0.45 : -0.45), s = baseSpeed();
          balls.push({ x: src.x, y: src.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, stuck: false, off: 0, noPad: 0 });
        }
        break;
      case 'wide': fxT.wide = 15; fxT.narrow = 0; break;
      case 'narrow': fxT.narrow = 12; fxT.wide = 0; break;
      case 'laser': fxT.laser = 10; break;
      case 'sticky': fxT.sticky = 15; break;
      case 'slow': fxT.slow = 10; break;
      case 'life': G.lives++; break;
    }
  }

  // ---------- Kollision ----------
  // Kreis gegen Rechteck: liefert Normale und Eindringtiefe
  function circRect(bx, by, r, x, y, w, h) {
    var cx = clamp(bx, x, x + w), cy = clamp(by, y, y + h), dx = bx - cx, dy = by - cy, d2 = dx * dx + dy * dy;
    if (d2 >= r * r) return null;
    if (d2 > 1e-9) { var d = Math.sqrt(d2); return { nx: dx / d, ny: dy / d, pen: r - d }; }
    var l = bx - x, rt = x + w - bx, t = by - y, bt = y + h - by, m = Math.min(l, rt, t, bt);
    if (m === t) return { nx: 0, ny: -1, pen: t + r };
    if (m === bt) return { nx: 0, ny: 1, pen: bt + r };
    if (m === l) return { nx: -1, ny: 0, pen: l + r };
    return { nx: 1, ny: 0, pen: rt + r };
  }
  function reflect(b, h) {
    b.x += h.nx * h.pen; b.y += h.ny * h.pen;
    var dot = b.vx * h.nx + b.vy * h.ny;
    if (dot < 0) { b.vx -= 2 * dot * h.nx; b.vy -= 2 * dot * h.ny; }
  }
  function normalize(b) {
    var s = baseSpeed(), cur = Math.hypot(b.vx, b.vy) || 1;
    b.vx = b.vx / cur * s; b.vy = b.vy / cur * s;
    var minVy = s * 0.32;
    if (Math.abs(b.vy) < minVy) {
      b.vy = (b.vy >= 0 ? 1 : -1) * minVy;
      b.vx = (b.vx >= 0 ? 1 : -1) * Math.sqrt(s * s - minVy * minVy);
    }
  }
  function launchBall(b) {
    var t = clamp((b.x - (pad.x + pad.w / 2)) / (pad.w / 2), -0.8, 0.8), a = t * 1.0 + rnd(-0.12, 0.12), s = baseSpeed();
    if (Math.abs(a) < 0.12) a = a < 0 ? -0.18 : 0.18;
    b.vx = Math.sin(a) * s; b.vy = -Math.cos(a) * s; b.stuck = false;
    Sound.fx('launch');
  }

  // Ball in kleinen Teilschritten bewegen (max. 3 px) -> kein Tunneling
  function stepBall(b, dt) {
    if (b.stuck) { b.x = pad.x + clamp(b.off, R, pad.w - R); b.y = PY - R - 0.5; return true; }
    var dist = Math.hypot(b.vx, b.vy) * dt, n = Math.max(1, Math.ceil(dist / 3)), sdt = dt / n;
    for (var i = 0; i < n; i++) {
      b.x += b.vx * sdt; b.y += b.vy * sdt;
      // Wände
      if (b.x < R) { b.x = R; b.vx = Math.abs(b.vx); Sound.fx('wall'); }
      else if (b.x > W - R) { b.x = W - R; b.vx = -Math.abs(b.vx); Sound.fx('wall'); }
      if (b.y < TOP + R) { b.y = TOP + R; b.vy = Math.abs(b.vy); Sound.fx('wall'); }
      // Paddle
      if (b.vy > 0) {
        var hp = circRect(b.x, b.y, R, pad.x, PY, pad.w, PH);
        if (hp) {
          if (b.y < PY + PH * 0.6) {
            var t = clamp((b.x - (pad.x + pad.w / 2)) / (pad.w / 2 + R), -1, 1), a = t * (Math.PI / 3), s = baseSpeed();
            b.vx = Math.sin(a) * s; b.vy = -Math.cos(a) * s; b.y = PY - R - 0.01;
            if (fxT.sticky > 0) { b.stuck = true; b.off = b.x - pad.x; }
            G.combo = 0; b.noPad = 0; Sound.fx('paddle');
            part(b.x, PY, 0, -40, 0.3, '#00f0ff', 3, 0);
            if (b.stuck) return true;
          } else reflect(b, hp);
        }
      }
      // Endgegner
      if (boss && !boss.dead) {
        var hb = circRect(b.x, b.y, R, boss.x, boss.y, boss.w, boss.h);
        if (hb) { reflect(b, hb); hitBoss(b.x, b.y); normalize(b); }
      }
      // Steine: nur die tiefste Kollision je Teilschritt auflösen
      var c0 = Math.floor((b.x - GX) / BW), r0 = Math.floor((b.y - GY) / BH), best = null, bh = null;
      for (var dc = -1; dc <= 1; dc++) for (var dr = -1; dr <= 1; dr++) {
        var br = cellAt(c0 + dc, r0 + dr);
        if (!br || !br.alive || br.build < 1) continue;
        var h = circRect(b.x, b.y, R, br.x, br.y, br.w, br.h);
        if (h && (!bh || h.pen > bh.pen)) { bh = h; best = br; }
      }
      if (best) {
        reflect(b, bh); hitBrick(best, 'ball');
        G.speedUp = Math.min(1.3, G.speedUp + 0.004);
        normalize(b);
        if (G.state !== 'play') return true;
      }
      if (b.y > H + 20) return false;
    }
    return true;
  }

  function hitBoss(x, y) {
    if (!boss || boss.dead) return;
    boss.hp--; boss.flash = 0.15; G.combo++; points(100); Sound.fx('bosshit'); G.shake = 0.1;
    burst(x, y, '#ff4d6d', 8, 200);
    if (boss.hp <= 0) {
      boss.dead = true; boss.deadT = 0; G.score += 5000; Sound.fx('boom'); G.shake = 0.6;
      bricks.forEach(function (b) { if (b.alive && b.type !== 'm') destroyBrick(b, 'boom'); });
    }
  }

  // ---------- Eingabe ----------
  var inp = { left: false, right: false, tl: false, tr: false, launchP: false, startP: false, pauseP: false, tap: false, mouseX: null };
  var KEYS = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'launch', Enter: 'launch', ArrowUp: 'launch', KeyW: 'launch', KeyP: 'pause', Escape: 'pause', KeyM: 'mute', KeyF: 'fs' };
  function typing(e) { var t = e.target; return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'); }
  window.addEventListener('keydown', function (e) {
    if (typing(e)) return;
    // Auf dem Startbildschirm Buchstaben direkt ins Cheatfeld leiten
    if (G.state === 'title' && /^Key[A-Z]$|^Digit[0-9]$/.test(e.code) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (cheatIn.value.length < 12) cheatIn.value += e.code.slice(-1);
      cheatIn.focus(); return;
    }
    var a = KEYS[e.code]; if (!a) return;
    e.preventDefault(); Sound.unlock();
    if (a === 'left') { inp.left = true; inp.mouseX = null; }
    else if (a === 'right') { inp.right = true; inp.mouseX = null; }
    else if (a === 'launch') { if (!e.repeat) { inp.launchP = true; inp.startP = true; } }
    else if (a === 'pause') { if (e.code === 'Escape' && shell.classList.contains('pseudo-fs')) pseudo(false); else inp.pauseP = true; }
    else if (a === 'mute') toggleSound();
    else if (a === 'fs') toggleFS();
  });
  window.addEventListener('keyup', function (e) {
    if (typing(e)) return;
    var a = KEYS[e.code]; if (!a) return;
    e.preventDefault();
    if (a === 'left') inp.left = false; else if (a === 'right') inp.right = false;
  });
  window.addEventListener('blur', function () { inp.left = inp.right = inp.tl = inp.tr = false; });

  var shell = $('shell'), dpad = $('dpad'), cheatForm = $('cheat'), cheatIn = $('cheat-in'), cheatMsg = $('cheat-msg');
  function markTouch() { document.body.classList.add('is-touch'); }
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) markTouch();
  window.addEventListener('touchstart', markTouch, { passive: true, once: true });

  // Canvas: Maus bewegt Paddle direkt, Touch per Ziehen (relativ), Tippen = Start
  function toLogical(clientX) { var r = cv.getBoundingClientRect(), s = Math.min(r.width / W, r.height / H), ox = r.left + (r.width - W * s) / 2; return { x: (clientX - ox) / s, s: s }; }
  var drag = null;
  cv.addEventListener('pointerdown', function (e) {
    Sound.unlock(); cv.focus({ preventScroll: true });
    if (e.pointerType === 'mouse') { inp.tap = true; inp.launchP = true; return; }
    e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    drag = { id: e.pointerId, sx: e.clientX, px: pad.x, t: performance.now(), moved: 0 };
  });
  cv.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'mouse') { inp.mouseX = toLogical(e.clientX).x; return; }
    if (!drag || e.pointerId !== drag.id) return;
    var s = toLogical(e.clientX).s, dx = (e.clientX - drag.sx) / s;
    drag.moved = Math.max(drag.moved, Math.abs(e.clientX - drag.sx));
    pad.x = clamp(drag.px + dx * 1.15, 0, W - pad.w);
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.moved < 12 && performance.now() - drag.t < 350) { inp.tap = true; inp.launchP = true; }
    drag = null;
  }
  cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', function () { drag = null; });
  cv.addEventListener('mouseleave', function () { inp.mouseX = null; });

  var dpadPtr = null;
  function dpadSet(e) { var r = dpad.getBoundingClientRect(), left = e.clientX < r.left + r.width / 2; inp.tl = left; inp.tr = !left; dpad.children[0].classList.toggle('on', left); dpad.children[1].classList.toggle('on', !left); }
  function dpadOff() { dpadPtr = null; inp.tl = inp.tr = false; dpad.children[0].classList.remove('on'); dpad.children[1].classList.remove('on'); }
  dpad.addEventListener('pointerdown', function (e) { e.preventDefault(); Sound.unlock(); dpadPtr = e.pointerId; try { dpad.setPointerCapture(e.pointerId); } catch (x) {} dpadSet(e); });
  dpad.addEventListener('pointermove', function (e) { if (e.pointerId === dpadPtr) dpadSet(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) { dpad.addEventListener(ev, function (e) { if (e.pointerId === dpadPtr) dpadOff(); }); });
  Array.prototype.forEach.call(document.querySelectorAll('.tbtn'), function (b) {
    var k = b.getAttribute('data-k');
    b.addEventListener('pointerdown', function (e) {
      e.preventDefault(); Sound.unlock(); b.classList.add('on');
      if (k === 'launch') { inp.launchP = true; inp.startP = true; }
      else if (k === 'pause') inp.pauseP = true;
      else if (k === 'fs') toggleFS();
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { b.addEventListener(ev, function () { b.classList.remove('on'); }); });
  });
  shell.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // ---------- Update ----------
  function updatePlay(dt) {
    // Timer
    for (var k in fxT) if (fxT[k] > 0) fxT[k] = Math.max(0, fxT[k] - dt);
    pad.tw = fxT.wide > 0 ? 124 : fxT.narrow > 0 ? 50 : 80;
    if (pad.w !== pad.tw) { var cx = pad.x + pad.w / 2, dw = pad.tw - pad.w; pad.w += clamp(dw, -200 * dt, 200 * dt); pad.x = cx - pad.w / 2; }
    // Paddle
    var dir = (inp.right || inp.tr ? 1 : 0) - (inp.left || inp.tl ? 1 : 0);
    if (dir) pad.x += dir * 560 * dt;
    else if (inp.mouseX != null) pad.x += (inp.mouseX - pad.w / 2 - pad.x) * Math.min(1, dt * 25);
    pad.x = clamp(pad.x, 0, W - pad.w);

    if (inp.launchP) { balls.forEach(function (b) { if (b.stuck) launchBall(b); }); }
    inp.launchP = false;

    // Bälle
    for (var i = balls.length - 1; i >= 0; i--) {
      var b = balls[i];
      if (!b.stuck) normalize(b);
      b.noPad += dt;
      if (b.noPad > 22 && !b.stuck) { var a = Math.atan2(b.vy, b.vx) + rnd(-0.4, 0.4); b.vx = Math.cos(a); b.vy = Math.sin(a); normalize(b); b.noPad = 12; }
      if (!stepBall(b, dt)) { balls.splice(i, 1); continue; }
      if (G.state !== 'play') return;
      if (!b.stuck && Math.random() < 0.6) part(b.x, b.y, 0, 0, 0.25, fxT.slow > 0 ? '#ffe14d' : '#00f0ff', 2.2, 0);
    }
    if (!balls.length) {
      G.lives--; Sound.fx('lost'); G.shake = 0.3;
      if (G.lives <= 0) { G.state = 'over'; G.timer = 0; Sound.stop(); Sound.fx('over'); saveHS(); updateUI(); return; }
      resetBall(); drops = []; lasers = [];
    }

    // Explosionen (Kettenreaktion)
    for (i = booms.length - 1; i >= 0; i--) {
      booms[i].t -= dt;
      if (booms[i].t <= 0) { var bb = cellAt(booms[i].c, booms[i].r); booms.splice(i, 1); if (bb && bb.alive) destroyBrick(bb, 'boom'); if (G.state !== 'play') return; }
    }

    // Power-ups
    for (i = drops.length - 1; i >= 0; i--) {
      var d = drops[i]; d.y += 120 * dt;
      if (d.y + d.h >= PY && d.y <= PY + PH && d.x + d.w >= pad.x && d.x <= pad.x + pad.w) { applyPU(d.p, d.x + d.w / 2, d.y); drops.splice(i, 1); continue; }
      if (d.y > H) drops.splice(i, 1);
    }

    // Laser
    if (fxT.laser > 0) {
      laserCd -= dt;
      if (laserCd <= 0) { laserCd = 0.32; lasers.push({ x: pad.x + 6, y: PY - 4 }, { x: pad.x + pad.w - 6, y: PY - 4 }); Sound.fx('laser'); }
    }
    for (i = lasers.length - 1; i >= 0; i--) {
      var L = lasers[i], ly0 = L.y; L.y -= 760 * dt;
      var hit = false;
      for (var yy = ly0; yy >= L.y && !hit; yy -= 4) {
        if (boss && !boss.dead && L.x >= boss.x && L.x <= boss.x + boss.w && yy >= boss.y && yy <= boss.y + boss.h) { hitBoss(L.x, yy); hit = true; break; }
        var lb = cellAt(Math.floor((L.x - GX) / BW), Math.floor((yy - GY) / BH));
        if (lb && lb.alive && lb.build >= 1) { hitBrick(lb, 'laser'); hit = true; }
      }
      if (hit || L.y < TOP) { if (hit) burst(L.x, L.y, '#ff4d6d', 4, 120); lasers.splice(i, 1); }
      if (G.state !== 'play') return;
    }

    // Endgegner
    if (boss) {
      if (boss.dead) {
        boss.deadT += dt;
        if (Math.random() < 0.5) burst(boss.x + rnd(0, boss.w), boss.y + rnd(0, boss.h), Math.random() < 0.5 ? '#ff4d6d' : '#ffe14d', 6, 260);
        if (boss.deadT > 2) { G.state = 'win'; G.timer = 0; Sound.stop(); Sound.fx('clear'); saveHS(); updateUI(); }
      } else {
        var rage = 1 - boss.hp / boss.max;
        boss.ph += dt * (0.9 + rage * 1.4);
        boss.x = W / 2 - boss.w / 2 + Math.sin(boss.ph) * (W / 2 - boss.w / 2 - 6);
        boss.y = GY + 4 + Math.sin(boss.ph * 2.3) * 6;
        boss.flash = Math.max(0, boss.flash - dt);
        boss.buildT -= dt;
        if (boss.buildT <= 0) { boss.buildT = 2.6 - rage * 1.3; rebuild(); }
      }
    }

    bricks.forEach(function (br) { if (br.flash > 0) br.flash -= dt; if (br.build < 1) br.build = Math.min(1, br.build + dt * 2.5); });
  }

  // Master-Firewall baut einen Stein in einer freien Zelle nach
  function rebuild() {
    var free = [];
    for (var r = 4; r < 11; r++) for (var c = 0; c < COLS; c++) {
      if (cellAt(c, r)) continue;
      var x = GX + c * BW, y = GY + r * BH, ok = true;
      for (var i = 0; i < balls.length; i++) if (circRect(balls[i].x, balls[i].y, R + 6, x, y, BW, BH)) ok = false;
      if (ok) free.push([c, r]);
    }
    if (!free.length) return;
    var f = free[Math.floor(Math.random() * free.length)];
    var nb = makeBrick(f[0], f[1], Math.random() < 0.25 ? 'h' : 'n'); nb.build = 0;
    // Bauanimation: Strahl vom Boss zum Stein
    for (var k = 0; k < 8; k++) part(boss.x + boss.w / 2 + (nb.x + BW / 2 - boss.x - boss.w / 2) * k / 8, boss.y + boss.h + (nb.y - boss.y - boss.h) * k / 8, 0, 0, 0.35, '#ff4d6d', 2.5, 0);
    Sound.fx('build');
  }

  function updateParts(dt) {
    for (var i = parts.length - 1; i >= 0; i--) { var p = parts[i]; p.life -= dt; if (p.life <= 0) { parts.splice(i, 1); continue; } p.vy += p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
    for (i = pops.length - 1; i >= 0; i--) { pops[i].life -= dt; pops[i].y -= 28 * dt; if (pops[i].life <= 0) pops.splice(i, 1); }
    if (G.shake > 0) G.shake -= dt;
  }
  function anyStart() { var s = inp.startP || inp.tap; inp.startP = inp.tap = false; return s; }

  function update(dt) {
    G.t += dt;
    if (inp.pauseP) {
      inp.pauseP = false;
      if (G.state === 'play') { G.state = 'pause'; Sound.stop(); Sound.fx('pause'); updateUI(); }
      else if (G.state === 'pause') { G.state = 'play'; Sound.start(); updateUI(); }
    }
    switch (G.state) {
      case 'title': if (anyStart()) startGame(0); break;
      case 'intro':
        G.timer += dt;
        if ((G.timer > 0.6 && anyStart()) || G.timer > 3.5) { G.state = 'play'; inp.launchP = false; updateUI(); }
        inp.tap = false; inp.launchP = false; break;
      case 'play': inp.startP = inp.tap = false; updatePlay(dt); updateParts(dt); break;
      case 'pause': if (inp.tap) inp.pauseP = true; inp.tap = inp.startP = inp.launchP = false; break;
      case 'clear':
        G.timer += dt; updateParts(dt);
        if (G.timer > 3 || (G.timer > 1 && anyStart())) { loadLevel(G.lvl + 1); G.state = 'intro'; G.timer = 0; Sound.start(); updateUI(); }
        inp.tap = inp.launchP = false; break;
      case 'over': case 'win':
        G.timer += dt; updateParts(dt);
        if (G.timer > 1.5 && anyStart()) { G.state = 'title'; updateUI(); }
        inp.tap = inp.launchP = false; break;
    }
    cheatForm.hidden = G.state !== 'title';
  }

  // ---------- Zeichnen ----------
  function text(s, x, y, size, col, align) {
    ctx.font = size + 'px ' + FONT; ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = Math.max(2, size / 6); ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.lineJoin = 'round';
    ctx.strokeText(s, x, y); ctx.fillStyle = col || '#fff'; ctx.fillText(s, x, y);
  }
  function neon(s, x, y, size, col) { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 16; text(s, x, y, size, col); ctx.restore(); }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  function drawBG() {
    var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a0c14'); g.addColorStop(1, '#141a33');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // Netzwerk-Raster mit wandernden Datenpunkten
    ctx.strokeStyle = 'rgba(0,240,255,.06)'; ctx.lineWidth = 1;
    for (var x = 0; x <= W; x += 32) { ctx.beginPath(); ctx.moveTo(x + 0.5, TOP); ctx.lineTo(x + 0.5, H); ctx.stroke(); }
    for (var y = TOP; y <= H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,43,214,.35)';
    for (var i = 0; i < 10; i++) { var px = ((i * 97 + G.t * (20 + i * 6)) % W), py = TOP + ((i * 151) % (H - TOP)); ctx.fillRect(Math.floor(px / 32) * 32 + ((G.t * 40 + i * 13) % 32), Math.floor(py / 32) * 32, 3, 1.5); }
  }

  function drawBrick(b) {
    var a = b.build; if (a <= 0) return;
    var x = b.x + 1, y = b.y + 1, w = b.w - 2, h = b.h - 2;
    ctx.globalAlpha = a;
    if (b.type === 'm') {
      var gm = ctx.createLinearGradient(0, y, 0, y + h); gm.addColorStop(0, '#c7ccd8'); gm.addColorStop(0.5, '#7d8496'); gm.addColorStop(1, '#4a5062');
      ctx.fillStyle = gm; ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#2d3140'; [[3, 3], [w - 5, 3], [3, h - 5], [w - 5, h - 5]].forEach(function (p) { ctx.fillRect(x + p[0], y + p[1], 2, 2); });
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(x + 8, y + h - 3); ctx.lineTo(x + 16, y + 3); ctx.stroke();
    } else if (b.type === 'x') {
      ctx.fillStyle = '#3a0d12'; ctx.fillRect(x, y, w, h);
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      ctx.fillStyle = '#ffb020'; for (var s = -h; s < w; s += 8) { ctx.beginPath(); ctx.moveTo(x + s, y + h); ctx.lineTo(x + s + 4, y + h); ctx.lineTo(x + s + 4 + h, y); ctx.lineTo(x + s + h, y); ctx.fill(); }
      ctx.restore();
      var blink = 0.5 + 0.5 * Math.sin(G.t * 8 + b.c);
      ctx.fillStyle = 'rgba(255,60,60,' + (0.35 + blink * 0.4) + ')'; ctx.fillRect(x + w / 2 - 6, y + 2, 12, h - 4);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('!', x + w / 2, y + h / 2 + 1);
    } else {
      var col = b.type === 'h' ? '#8a93b8' : b.col;
      ctx.fillStyle = col; ctx.fillRect(x, y, w, h);
      ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(x, y, w, 3);
      ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillRect(x, y + h - 3, w, 3);
      // Mauerfugen (Firewall-Optik)
      ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(x + w / 2, y + 3, 1, h / 2 - 3);
      if (b.type === 'h') {
        ctx.strokeStyle = '#2a2f45'; ctx.lineWidth = 1.5; ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
        var dmg = b.max - b.hp;
        ctx.strokeStyle = '#151827'; ctx.lineWidth = 1.2;
        if (dmg >= 1) { ctx.beginPath(); ctx.moveTo(x + 6, y + 2); ctx.lineTo(x + 11, y + 7); ctx.lineTo(x + 9, y + 12); ctx.moveTo(x + 11, y + 7); ctx.lineTo(x + 17, y + 6); ctx.stroke(); }
        if (dmg >= 2) { ctx.beginPath(); ctx.moveTo(x + w - 5, y + h - 2); ctx.lineTo(x + w - 11, y + 6); ctx.lineTo(x + w - 18, y + 9); ctx.moveTo(x + w - 11, y + 6); ctx.lineTo(x + w - 9, y + 1); ctx.stroke(); }
        if (b.max === 3) { ctx.fillStyle = '#ffe14d'; ctx.fillRect(x + w - 6, y + 3, 3, 3); }
      }
    }
    if (b.flash > 0) { ctx.fillStyle = 'rgba(255,255,255,' + (b.flash * 5) + ')'; ctx.fillRect(x, y, w, h); }
    ctx.globalAlpha = 1;
  }

  // Paddle als Netzwerkkabel mit RJ45-Steckern
  function drawPaddle() {
    var x = pad.x, w = pad.w, y = PY;
    var col = fxT.narrow > 0 ? '#8a93b8' : fxT.sticky > 0 ? '#c45cff' : '#00f0ff';
    ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 12;
    ctx.fillStyle = col; rr(x + 10, y + 2, w - 20, PH - 4, 4); ctx.fill(); ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,.25)'; for (var i = x + 16; i < x + w - 16; i += 8) ctx.fillRect(i, y + 3, 3, PH - 6);
    [x, x + w - 12].forEach(function (cx, k) {
      ctx.fillStyle = 'rgba(220,235,255,.85)'; rr(cx, y, 12, PH, 2); ctx.fill();
      ctx.fillStyle = '#e8b830'; for (var p = 0; p < 4; p++) ctx.fillRect(cx + (k ? 8 : 1), y + 2 + p * 2.2, 3, 1.2);
    });
    if (fxT.laser > 0) { ctx.fillStyle = '#ff4d6d'; ctx.fillRect(x + 4, y - 5, 4, 5); ctx.fillRect(x + w - 8, y - 5, 4, 5); }
  }
  function drawBall(b) {
    ctx.save(); ctx.shadowColor = fxT.slow > 0 ? '#ffe14d' : '#00f0ff'; ctx.shadowBlur = 14;
    ctx.fillStyle = '#fff'; rr(b.x - R, b.y - R, R * 2, R * 2, 3); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#ff2bd6'; ctx.fillRect(b.x - 3, b.y - 3, 2, 2); ctx.fillRect(b.x + 1, b.y - 1, 2, 2); ctx.fillRect(b.x - 2, b.y + 1, 2, 2);
  }
  function drawBoss() {
    var b = boss; if (!b || (b.dead && b.deadT > 1.2)) return;
    ctx.save(); if (b.dead) ctx.globalAlpha = Math.max(0, 1 - b.deadT / 1.2);
    ctx.shadowColor = '#ff4d6d'; ctx.shadowBlur = 18;
    ctx.fillStyle = '#2a0b14'; rr(b.x, b.y, b.w, b.h, 6); ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = b.flash > 0 ? '#fff' : '#ff4d6d'; ctx.lineWidth = 2; rr(b.x, b.y, b.w, b.h, 6); ctx.stroke();
    // Mauerraster mit Flammen
    ctx.strokeStyle = 'rgba(255,77,109,.45)'; ctx.lineWidth = 1;
    for (var r = 1; r < 3; r++) { ctx.beginPath(); ctx.moveTo(b.x + 4, b.y + r * b.h / 3); ctx.lineTo(b.x + b.w - 4, b.y + r * b.h / 3); ctx.stroke(); }
    for (var c = 0; c < 6; c++) { ctx.beginPath(); var ox = (c % 2) * 11; ctx.moveTo(b.x + 12 + c * 22 + ox * 0, b.y + 4); ctx.lineTo(b.x + 12 + c * 22, b.y + b.h - 4); ctx.stroke(); }
    // Auge
    var ex = b.x + b.w / 2, ey = b.y + b.h / 2, look = 0;
    if (balls[0]) look = clamp((balls[0].x - ex) / 60, -1, 1) * 6;
    ctx.fillStyle = '#0a0c14'; ctx.beginPath(); ctx.ellipse(ex, ey, 22, 12, 0, 0, 7); ctx.fill();
    ctx.fillStyle = b.flash > 0 ? '#fff' : '#ff4d6d'; ctx.beginPath(); ctx.arc(ex + look, ey, 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffe14d'; ctx.beginPath(); ctx.arc(ex + look, ey, 3, 0, 7); ctx.fill();
    ctx.restore();
    // Lebensbalken
    if (!b.dead) {
      ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(40, TOP + 4, W - 80, 8);
      ctx.fillStyle = '#ff4d6d'; ctx.fillRect(40, TOP + 4, (W - 80) * b.hp / b.max, 8);
      text(tt('bossName'), W / 2, TOP + 20, 10, '#ff9aae');
    }
  }
  function drawDrop(d) {
    ctx.save(); ctx.shadowColor = d.p.c; ctx.shadowBlur = 10;
    ctx.fillStyle = d.p.c; rr(d.x, d.y, d.w, d.h, 7); ctx.fill(); ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(d.x + 5, d.y + 2, d.w - 10, 3);
    ctx.fillStyle = d.p.bad ? '#fff' : '#0a0c14'; ctx.font = 'bold 12px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(d.p.l, d.x + d.w / 2, d.y + d.h / 2 + 1);
  }

  function drawHUD() {
    ctx.fillStyle = 'rgba(10,12,20,.9)'; ctx.fillRect(0, 0, W, TOP);
    ctx.fillStyle = '#262c47'; ctx.fillRect(0, TOP - 1, W, 1);
    text(String(G.score).padStart(7, '0'), 10, 17, 15, '#fff', 'left');
    text(tt('level') + ' ' + (G.lvl + 1), W / 2, 17, 13, '#00f0ff');
    text('HI ' + String(Math.max(highscore, G.score)).padStart(7, '0'), W - 10, 17, 11, '#8b93b3', 'right');
    // Leben als kleine Kabel
    var lx = 10; for (var i = 0; i < Math.min(G.lives - 1, 9); i++) { ctx.fillStyle = 'rgba(0,240,255,.8)'; rr(lx + i * 20, H - 14, 16, 5, 2); ctx.fill(); }
    // aktive Power-ups
    var px = W - 10, list = [['laser', 'L', '#ff4d6d', 10], ['sticky', 'C', '#c45cff', 15], ['slow', 'S', '#ffe14d', 10], ['wide', 'W', '#7cff6b', 15], ['narrow', 'N', '#8a93b8', 12]];
    list.forEach(function (it) {
      if (fxT[it[0]] <= 0) return;
      px -= 30; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(px, H - 20, 26, 14);
      ctx.fillStyle = it[2]; ctx.fillRect(px, H - 8, 26 * fxT[it[0]] / it[3], 2);
      ctx.font = 'bold 10px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(it[1], px + 13, H - 14);
    });
    if (G.combo >= 2) text(tt('combo') + ' x' + Math.min(G.combo, 10), W / 2, H - 14, 11, '#ffe14d');
  }

  function drawField() {
    var sh = G.shake > 0 ? G.shake * 10 : 0;
    ctx.save(); if (sh) ctx.translate(rnd(-sh, sh), rnd(-sh, sh));
    drawBG();
    bricks.forEach(function (b) { if (b.alive) drawBrick(b); });
    drawBoss();
    lasers.forEach(function (L) { ctx.fillStyle = '#ff4d6d'; ctx.fillRect(L.x - 1, L.y - 8, 2, 10); });
    drops.forEach(drawDrop);
    drawPaddle();
    balls.forEach(drawBall);
    parts.forEach(function (p) { ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.col; ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size); });
    ctx.globalAlpha = 1;
    pops.forEach(function (p) { ctx.globalAlpha = Math.min(1, p.life * 2); text(p.txt, p.x, p.y, p.size, p.col); });
    ctx.globalAlpha = 1;
    ctx.restore();
    drawHUD();
  }
  function overlay(a) { ctx.fillStyle = 'rgba(10,12,20,' + a + ')'; ctx.fillRect(0, 0, W, H); }
  function touchMode() { return document.body.classList.contains('is-touch'); }

  function drawTitle() {
    drawBG();
    // Deko-Steine
    for (var r = 0; r < 4; r++) for (var c = 0; c < COLS; c++) {
      var x = GX + c * BW + 1, y = 70 + r * BH + 1, wave = Math.sin(G.t * 2 + c * 0.5 + r) * 0.5 + 0.5;
      ctx.globalAlpha = 0.25 + wave * 0.35; ctx.fillStyle = ROWCOL[(c + r * 2) % ROWCOL.length]; ctx.fillRect(x, y, BW - 2, BH - 2);
    }
    ctx.globalAlpha = 1;
    neon('FIREWALL', W / 2, 200, 52, '#00f0ff');
    neon('BREAKER', W / 2, 252, 52, '#ff2bd6');
    text(tt('sub'), W / 2, 296, 15, '#d9deef');
    text(tt('hs') + ': ' + highscore, W / 2, 330, 15, '#ffe14d');
    var bx = W / 2 + Math.sin(G.t * 2.2) * 120, by = 380 + Math.abs(Math.cos(G.t * 4.4)) * -24;
    drawBall({ x: bx, y: by });
    var old = pad.x, ow = pad.w; pad.w = 80; pad.x = bx - 40; drawPaddle(); pad.x = old; pad.w = ow;
    text(tt('cheatLbl'), W / 2, 404, 13, '#8b93b3');
    if (Math.floor(G.t * 2) % 2 === 0) text(tt(touchMode() ? 'tapStart' : 'keyStart'), W / 2, 560, 18, '#fff');
  }
  function drawIntro() {
    overlay(0.75);
    text(tt('level') + ' ' + (G.lvl + 1) + ' / ' + LEVELS.length, W / 2, 200, 18, '#ff2bd6');
    neon(tt('L' + (G.lvl + 1)), W / 2, 245, 34, '#00f0ff');
    if (LEVELS[G.lvl].boss) text(tt('bossWarn'), W / 2, 285, 16, '#ff4d6d');
    if (LEVELS[G.lvl].code) {
      text(tt('codeFor'), W / 2, 325, 14, '#d9deef');
      ctx.fillStyle = 'rgba(255,43,214,.12)'; ctx.fillRect(W / 2 - 100, 342, 200, 36);
      ctx.strokeStyle = '#ff2bd6'; ctx.lineWidth = 1.5; ctx.strokeRect(W / 2 - 100, 342, 200, 36);
      neon(LEVELS[G.lvl].code, W / 2, 361, 22, '#ffe14d');
    } else text(tt('getReady'), W / 2, 340, 15, '#d9deef');
    text(tt(touchMode() ? 'tapLaunch' : 'keyLaunch'), W / 2, 440, 13, '#8b93b3');
  }

  function render() {
    ctx.setTransform(SC, 0, 0, SC, 0, 0);
    if (G.state === 'title') { drawTitle(); return; }
    drawField();
    if (G.state === 'play' && balls.some(function (b) { return b.stuck; }) && Math.floor(G.t * 2) % 2 === 0) text(tt(touchMode() ? 'tapLaunch' : 'keyLaunch'), W / 2, PY - 40, 12, '#8b93b3');
    if (G.state === 'intro') drawIntro();
    else if (G.state === 'pause') { overlay(0.6); neon(tt('pauseT'), W / 2, 280, 40, '#00f0ff'); text(tt(touchMode() ? 'tapResume' : 'keyResume'), W / 2, 330, 14, '#d9deef'); }
    else if (G.state === 'clear') { overlay(Math.min(0.6, G.timer * 0.5)); neon(tt('clear'), W / 2, 270, 28, '#7cff6b'); text('+' + (1000 + 250 * G.lvl), W / 2, 315, 18, '#ffe14d'); }
    else if (G.state === 'over' || G.state === 'win') {
      overlay(0.78);
      if (G.state === 'over') neon(tt('over'), W / 2, 240, 30, '#ff2bd6');
      else { neon(tt('win'), W / 2, 230, 36, '#7cff6b'); text(tt('winSub'), W / 2, 272, 14, '#d9deef'); }
      text(tt('score') + ': ' + G.score, W / 2, 310, 20, '#fff');
      if (G.newHs) neon(tt('newHs'), W / 2, 345, 18, '#ffe14d'); else text(tt('hs') + ': ' + highscore, W / 2, 345, 14, '#8b93b3');
      if (G.state === 'over' && G.lvl > 0) text(tt('contCode') + LEVELS[G.lvl].code, W / 2, 385, 14, '#ffe14d');
      if (G.timer > 1.5) text(tt(touchMode() ? 'tapTitle' : 'keyTitle'), W / 2, 460, 13, '#8b93b3');
    }
  }

  // ---------- Loop ----------
  var last = performance.now(), acc = 0, STEP = 1 / 120;
  function frame(ts) {
    var dt = Math.min((ts - last) / 1000, 0.1); last = ts; acc += dt;
    while (acc >= STEP) { update(STEP); acc -= STEP; }
    render(); requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', function () { if (document.hidden && G.state === 'play') inp.pauseP = true; });

  // ---------- Seitensteuerung ----------
  var bStart = $('b-start'), bPause = $('b-pause'), bSound = $('b-sound'), bFs = $('b-fs'), bLang = $('lang');
  function updateUI() {
    var running = ['intro', 'play', 'pause', 'clear'].indexOf(G.state) >= 0;
    bStart.textContent = tt(running ? 'restart' : 'start');
    bPause.textContent = tt(G.state === 'pause' ? 'resume' : 'pause');
    bPause.disabled = !(G.state === 'play' || G.state === 'pause');
    bSound.textContent = tt(Sound.isOn() ? 'soundOn' : 'soundOff');
    bSound.setAttribute('aria-pressed', Sound.isOn() ? 'true' : 'false');
    fsLabel();
  }
  function toggleSound() { Sound.toggle(); updateUI(); }
  function isFS() { return !!(document.fullscreenElement || document.webkitFullscreenElement) || shell.classList.contains('pseudo-fs'); }
  function pseudo(on) { shell.classList.toggle('pseudo-fs', on); document.body.classList.toggle('no-scroll', on); fsLabel(); }
  function fsLabel() { bFs.textContent = tt(isFS() ? 'fsOff' : 'fs'); }
  function toggleFS() {
    if (shell.classList.contains('pseudo-fs')) { pseudo(false); return; }
    if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    var req = shell.requestFullscreen || shell.webkitRequestFullscreen;
    if (req) {
      try { var pr = req.call(shell, { navigationUI: 'hide' }); if (pr && pr.catch) pr.catch(function () { pseudo(true); }); }
      catch (e) { pseudo(true); }
    } else pseudo(true);
    cv.focus({ preventScroll: true });
  }
  document.addEventListener('fullscreenchange', fsLabel);
  document.addEventListener('webkitfullscreenchange', fsLabel);
  function after(fn) { return function (e) { Sound.unlock(); fn(e); e.currentTarget.blur(); cv.focus({ preventScroll: true }); }; }
  bStart.addEventListener('click', after(function () { startGame(0); }));
  bPause.addEventListener('click', after(function () { inp.pauseP = true; }));
  bSound.addEventListener('click', after(toggleSound));
  bFs.addEventListener('click', after(toggleFS));

  // Cheatcode auf dem Startbildschirm
  var lastMsg = null;
  cheatForm.addEventListener('submit', function (e) {
    e.preventDefault(); Sound.unlock();
    var code = cheatIn.value.trim().toUpperCase(), idx = -1;
    for (var i = 1; i < LEVELS.length; i++) if (LEVELS[i].code === code) idx = i;
    if (idx < 0) { lastMsg = function () { return tt('badCode'); }; cheatMsg.textContent = lastMsg(); cheatMsg.className = 'cheat-msg err'; return; }
    lastMsg = null; cheatMsg.textContent = ''; cheatMsg.className = 'cheat-msg';
    cheatIn.value = ''; cheatIn.blur();
    startGame(idx); cv.focus({ preventScroll: true });
  });
  cheatIn.addEventListener('keydown', function (e) { if (e.key === 'Escape') cheatIn.blur(); e.stopPropagation(); });
  cheatIn.addEventListener('input', function () { if (lastMsg) { lastMsg = null; cheatMsg.textContent = ''; } });

  // Theme und Sprache wie auf der Hauptseite
  (function () {
    var root = document.documentElement, btn = $('mode');
    btn.addEventListener('click', function () {
      var light = root.getAttribute('data-theme') !== 'light';
      root.setAttribute('data-theme', light ? 'light' : 'dark');
      btn.textContent = light ? tt('dark') : tt('light');
    });
  })();
  function applyLang(l) {
    LANG = l; document.documentElement.lang = l; document.title = tt('title');
    Array.prototype.forEach.call(document.querySelectorAll('[data-t]'), function (el) { el.textContent = tt(el.getAttribute('data-t')); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-ta]'), function (el) { el.setAttribute('aria-label', tt(el.getAttribute('data-ta'))); });
    bLang.textContent = tt('langBtn');
    $('mode').textContent = document.documentElement.getAttribute('data-theme') === 'light' ? tt('dark') : tt('light');
    if (lastMsg) cheatMsg.textContent = lastMsg();
    updateUI();
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  bLang.addEventListener('click', function (e) { applyLang(LANG === 'en' ? 'de' : 'en'); e.currentTarget.blur(); });
  applyLang(LANG);

  // Für Tests im Browser
  window.__fb = { update: update, inp: inp, G: G, LEVELS: LEVELS, startGame: startGame, applyLang: applyLang,
    get balls() { return balls; }, get bricks() { return bricks; }, get boss() { return boss; }, get pad() { return pad; }, get drops() { return drops; },
    fxT: function () { return fxT; }, applyPU: function (k) { applyPU(PU.filter(function (p) { return p.k === k; })[0], W / 2, 400); }, stepBall: stepBall };
})();
