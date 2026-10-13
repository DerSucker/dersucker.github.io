/* Bug Invaders – a retro shooter | by Martin Sucker | github.com/DerSucker | www.martinsucker.de */
(function () {
  'use strict';

  /* ================= Config ================= */
  var W = 420, H = 560, PY = 522;          // logical board size, player baseline
  var COLS = 11, CW = 30, RH = 28, EW = 24, EH = 20;
  var SHIELD_Y = 436, SC = 2, SGW = 24, SGH = 16; // firewall: 24x16 cells of 2px
  var PSPEED = 210, FIRE_CD = 0.36;
  var POINTS = { B: 10, V: 20, W: 30, T: 40 };
  var LEVELS = [
    { rows: ['WWWWWWWWWWW', 'VVVVVVVVVVV', 'VVVVVVVVVVV', 'BBBBBBBBBBB', 'BBBBBBBBBBB'], spd: 20, fire: 1.35, maxB: 3, bsp: 170, bpm: 108, key: 0, code: '', name: 'n1' },
    { rows: ['..TTTTTTT..', '.WWWWWWWWW.', 'VVVVVVVVVVV', '.BBBBBBBBB.', '..BBBBBBB..'], spd: 25, fire: 1.15, maxB: 4, bsp: 190, bpm: 114, key: 2, code: 'ROOTKIT', name: 'n2' },
    { rows: ['TWTWTWTWTWT', 'WVWVWVWVWVW', 'VBVBVBVBVBV', 'BVBVBVBVBVB', 'BBBBBBBBBBB'], spd: 30, fire: 0.95, maxB: 5, bsp: 205, bpm: 120, key: -2, code: 'SUDO', name: 'n3' },
    { rows: ['TTTT...TTTT', 'WWWW...WWWW', 'VVVVV.VVVVV', 'BBBBBBBBBBB', 'BBBBBBBBBBB'], spd: 35, fire: 0.8, maxB: 6, bsp: 220, bpm: 126, key: 3, code: 'FIREWALL', name: 'n4' },
    { rows: ['TTTTTTTTTTT', 'TWWWWWWWWWT', 'VVVVVVVVVVV', 'VBBBBBBBBBV', 'BBBBBBBBBBB'], spd: 40, fire: 0.68, maxB: 7, bsp: 235, bpm: 132, key: 0, code: 'PATCHDAY', name: 'n5' }
  ];
  // per-level colors: bug, virus, worm, trojan
  var PAL = [
    { B: '#7cff6b', V: '#ff2bd6', W: '#ffb000', T: '#00f0ff' },
    { B: '#b6ff3b', V: '#ff5a5a', W: '#ffd23f', T: '#c38bff' },
    { B: '#3affc8', V: '#ff8a3a', W: '#ff6fd8', T: '#7ab8ff' },
    { B: '#ffd23f', V: '#2fd3ff', W: '#ff3b5c', T: '#9dff6b' },
    { B: '#ff3b5c', V: '#ff8a00', W: '#ffd23f', T: '#ff2bd6' }
  ];
  var ACC_DARK = ['#00f0ff', '#ff2bd6', '#7cff6b', '#ffb000', '#ff3b5c'];
  var ACC_LIGHT = ['#0077c8', '#c0109d', '#2a8f1f', '#c26a00', '#c4102e'];
  var FONT = '"Special Elite","American Typewriter","Courier New",monospace';

  /* ================= i18n ================= */
  var TXT = {
    de: {
      light: '☀ Lightmode', dark: '☾ Darkmode', themeAria: 'Design wechseln',
      back: 'Startseite', backAria: 'Startseite',
      docTitle: 'Bug Invaders – Browsergame | Martin Sucker',
      subtitle: 'Ein Retro-Shooter: Patche die Bugs, bevor sie dein Netzwerk erreichen.',
      score: 'Punkte', level: 'Level', lives: 'Leben', best: 'Rekord', board: 'Spielfeld',
      intro: 'Patche alle Bugs, Viren, Würmer und Trojaner – bevor sie unten ankommen!',
      cheatLabel: 'Cheatcode (optional)', cheatPh: 'z. B. CODE',
      start: 'Spiel starten', startHint: 'Enter / Leertaste zum Starten',
      paused: 'Pause', resume: 'Weiter', again: 'Nochmal spielen', restart: '↺ Neustart',
      left: 'Links', right: 'Rechts', fire: 'Feuer',
      howTo: 'So wird gespielt', ctrlTitle: 'Steuerung',
      ctrlText: 'PC/Mac: Pfeiltasten oder A/D zum Bewegen, Leertaste zum Feuern. P = Pause, M = Ton, F = Vollbild. Smartphone: Buttons Links, Rechts und Feuer – oder den Finger auf dem Spielfeld ziehen (feuert automatisch).',
      goalTitle: 'Ziel',
      goalText: 'Patche jede Welle, bevor sie unten ankommt. Die Firewalls schützen dich, zerfallen aber bei jedem Treffer. In Level 5 wartet die Ransomware. Ab 10.000 Punkten gibt es ein Extraleben.',
      cheatTitle: 'Cheatcodes',
      cheatText: 'Zu Beginn jedes Levels ab Level 2 wird ein Cheatcode angezeigt. Gib ihn beim nächsten Mal vor dem Start ein, um direkt in diesem Level zu beginnen.',
      legend: 'Legende', lgPlayer: 'Admin – das bist du', lgBug: 'Bug – 10 Punkte', lgVirus: 'Virus – 20 Punkte',
      lgWorm: 'Wurm – 30 Punkte', lgTrojan: 'Trojaner – 40 Punkte', lgZero: 'Zero-Day – 50 bis 300 Punkte',
      lgBoss: 'Ransomware – Endgegner in Level 5', lgTriple: 'Dreifachschuss – 10 Sekunden',
      lgShield: 'Schild – fängt einen Treffer ab', lgSlow: 'Zeitlupe – Gegner halb so schnell',
      home: 'Startseite · Impressum · Datenschutz',
      pause: '⏸ Pause', cont: '▶ Weiter', soundOn: '♪ Ton an', soundOff: '♪ Ton aus',
      fs: '⛶ Vollbild', fsExit: '⛶ Vollbild beenden', badCode: 'Unbekannter Cheatcode.',
      lvl: 'LEVEL {n}', n1: 'Welle: Klassiker', n2: 'Welle: Keil', n3: 'Welle: Mischmasch', n4: 'Welle: Zange', n5: 'Welle: Botnetz',
      codeFor: 'Cheatcode für dieses Level:', codeHint: 'Beim nächsten Mal vor dem Start eingeben',
      skip: 'Tippen / Enter = weiter', ready: 'Bereit!', clear: 'Welle gepatcht!',
      bossWarn: 'WARNUNG', bossText: 'Ihre Dateien wurden verschlüsselt!', bossName: 'RANSOMWARE',
      gameOver: 'Game Over', win: 'Gewonnen!', invaded: 'Das Netzwerk wurde infiziert!',
      endScore: 'Punkte: {s}', winText: 'Ransomware besiegt, alle 5 Level geschafft! Punkte: {s}', newBest: 'Neuer Rekord!',
      extra: '+1 LEBEN', pTriple: 'DREIFACHSCHUSS', pShield: 'SCHILD', pSlow: 'ZEITLUPE'
    },
    en: {
      light: '☀ Light mode', dark: '☾ Dark mode', themeAria: 'Switch theme',
      back: 'Home', backAria: 'Home',
      docTitle: 'Bug Invaders – Browser Game | Martin Sucker',
      subtitle: 'A retro shooter: patch the bugs before they reach your network.',
      score: 'Score', level: 'Level', lives: 'Lives', best: 'Best', board: 'Game board',
      intro: 'Patch every bug, virus, worm and trojan – before they reach the bottom!',
      cheatLabel: 'Cheat code (optional)', cheatPh: 'e.g. CODE',
      start: 'Start game', startHint: 'Enter / Space to start',
      paused: 'Paused', resume: 'Resume', again: 'Play again', restart: '↺ Restart',
      left: 'Left', right: 'Right', fire: 'Fire',
      howTo: 'How to play', ctrlTitle: 'Controls',
      ctrlText: 'PC/Mac: arrow keys or A/D to move, Space to fire. P = pause, M = sound, F = fullscreen. Smartphone: Left, Right and Fire buttons – or drag your finger on the board (fires automatically).',
      goalTitle: 'Goal',
      goalText: 'Patch every wave before it reaches the bottom. The firewalls protect you but crumble with every hit. Ransomware awaits in level 5. You get an extra life at 10,000 points.',
      cheatTitle: 'Cheat codes',
      cheatText: 'From level 2 on, a cheat code is shown at the start of each level. Enter it before starting next time to jump straight to that level.',
      legend: 'Legend', lgPlayer: 'Admin – that’s you', lgBug: 'Bug – 10 points', lgVirus: 'Virus – 20 points',
      lgWorm: 'Worm – 30 points', lgTrojan: 'Trojan – 40 points', lgZero: 'Zero-day – 50 to 300 points',
      lgBoss: 'Ransomware – final boss in level 5', lgTriple: 'Triple shot – 10 seconds',
      lgShield: 'Shield – absorbs one hit', lgSlow: 'Slow motion – enemies at half speed',
      home: 'Home · Legal notice · Privacy',
      pause: '⏸ Pause', cont: '▶ Resume', soundOn: '♪ Sound on', soundOff: '♪ Sound off',
      fs: '⛶ Fullscreen', fsExit: '⛶ Exit fullscreen', badCode: 'Unknown cheat code.',
      lvl: 'LEVEL {n}', n1: 'Wave: Classic', n2: 'Wave: Wedge', n3: 'Wave: Mixed bag', n4: 'Wave: Pincer', n5: 'Wave: Botnet',
      codeFor: 'Cheat code for this level:', codeHint: 'Enter it before starting next time',
      skip: 'Tap / Enter = continue', ready: 'Ready!', clear: 'Wave patched!',
      bossWarn: 'WARNING', bossText: 'Your files have been encrypted!', bossName: 'RANSOMWARE',
      gameOver: 'Game Over', win: 'You win!', invaded: 'The network has been infected!',
      endScore: 'Score: {s}', winText: 'Ransomware defeated, all 5 levels cleared! Score: {s}', newBest: 'New high score!',
      extra: '+1 LIFE', pTriple: 'TRIPLE SHOT', pShield: 'SHIELD', pSlow: 'SLOW MOTION'
    }
  };

  /* ================= Helpers ================= */
  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  var root = document.documentElement;
  var lang = store('lang') === 'en' ? 'en' : 'de';
  function t(key, vars) {
    var s = (TXT[lang] && TXT[lang][key]) || TXT.de[key] || key;
    if (vars) for (var k in vars) s = s.replace('{' + k + '}', vars[k]);
    return s;
  }
  function fmt(n) { return n.toLocaleString(lang === 'en' ? 'en-US' : 'de-DE'); }

  /* ================= Audio (Web Audio, no files) ================= */
  var Snd = (function () {
    var AC = window.AudioContext || window.webkitAudioContext;
    var ac = null, master, mus, synth, sfx, noiseBuf;
    var muted = store('buginv-mute') === '1';
    var playing = false, timer = 0, nextT = 0, step = 0, bpm = 108, base = 108, key = 0, boss = false;
    // Synthwave loop: Am – F – C – G (boss: Am – Am – F – E), 16th-note arpeggio
    var PROG = [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]];
    var PROG_BOSS = [[0, 3, 7], [0, 3, 7], [-4, 0, 3], [-5, -1, 2]];
    var ROOT = [0, -4, 3, -2], ROOT_BOSS = [0, 0, -4, -5];
    var ARP = [0, 1, 2, 3, 2, 1, 0, 1, 0, 1, 2, 3, 2, 3, 1, 2];

    function init() {
      if (!AC) return false;
      if (!ac) {
        ac = new AC();
        master = ac.createGain(); master.gain.value = muted ? 0 : 0.8; master.connect(ac.destination);
        mus = ac.createGain(); mus.gain.value = 0.42; mus.connect(master);
        synth = ac.createBiquadFilter(); synth.type = 'lowpass'; synth.frequency.value = 2600; synth.Q.value = 5; synth.connect(mus);
        sfx = ac.createGain(); sfx.gain.value = 0.55; sfx.connect(master);
        var len = ac.sampleRate * 0.6;
        noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
        var d = noiseBuf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ac.state === 'suspended') ac.resume();
      return true;
    }
    function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function tone(dest, type, f, at, dur, vol, f2, atk, detune) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, at);
      if (detune) o.detune.value = detune;
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, at + dur);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(vol, at + (atk || 0.006));
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      o.connect(g); g.connect(dest); o.start(at); o.stop(at + dur + 0.03);
    }
    function noise(dest, at, dur, vol, hp, lp) {
      var s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
      s.buffer = noiseBuf; f.type = lp ? 'lowpass' : 'highpass'; f.frequency.value = lp || hp;
      g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      s.connect(f); f.connect(g); g.connect(dest); s.start(at); s.stop(at + dur + 0.02);
    }
    function kick(at) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(160, at); o.frequency.exponentialRampToValueAtTime(42, at + 0.14);
      g.gain.setValueAtTime(0.75, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.2);
      o.connect(g); g.connect(mus); o.start(at); o.stop(at + 0.24);
    }
    function sched() {
      if (!playing) return;
      var s16 = 60 / bpm / 4;
      while (nextT < ac.currentTime + 0.15) {
        var s = step % 64, bar = (s / 16) | 0, e = s % 16, at = nextT;
        var chord = (boss ? PROG_BOSS : PROG)[bar], rt = (boss ? ROOT_BOSS : ROOT)[bar] + key;
        var notes = [chord[0], chord[1], chord[2], chord[0] + 12];
        tone(synth, 'sawtooth', mtof(57 + key + notes[ARP[e]]), at, s16 * 0.9, 0.07);
        if (e % 2 === 0) tone(synth, 'sawtooth', mtof(33 + rt + (e % 4 === 2 ? 12 : 0)), at, s16 * 1.8, 0.16);
        if (e === 0) chord.forEach(function (n) { tone(synth, 'sawtooth', mtof(57 + key + n), at, s16 * 15.5, 0.025, 0, s16 * 4, 8); tone(synth, 'sawtooth', mtof(57 + key + n), at, s16 * 15.5, 0.025, 0, s16 * 4, -8); });
        if (e % 4 === 0) kick(at);
        if (e === 4 || e === 12) noise(mus, at, 0.16, 0.22, 1600);
        if (e % 2 === 0) noise(mus, at, 0.03, e % 4 === 2 ? 0.08 : 0.04, 8000);
        nextT += s16; step++;
      }
    }
    var api = {
      unlock: init,
      start: function () { if (!init() || playing) return; playing = true; step = 0; nextT = ac.currentTime + 0.06; sched(); timer = setInterval(sched, 25); },
      stop: function () { playing = false; clearInterval(timer); },
      setLevel: function (b, k) { base = bpm = b; key = k; boss = false; },
      setBoss: function (on) { boss = on; bpm = base + (on ? 10 : 0); },
      muted: function () { return muted; },
      setMute: function (m) {
        muted = m; store('buginv-mute', m ? '1' : '0');
        if (ac) master.gain.setTargetAtTime(m ? 0 : 0.8, ac.currentTime, 0.02);
      }
    };
    function fx(fn) { return function (a) { if (ac && ac.state === 'running') fn(ac.currentTime, a); }; }
    api.shoot = fx(function (n) { tone(sfx, 'square', 920, n, 0.09, 0.07, 380); });
    api.hit = fx(function (n) { noise(sfx, n, 0.14, 0.3, 0, 2500); tone(sfx, 'square', 300, n, 0.1, 0.06, 90); });
    api.eshoot = fx(function (n) { tone(sfx, 'sawtooth', 240, n, 0.12, 0.025, 120); });
    api.shield = fx(function (n) { noise(sfx, n, 0.06, 0.08, 0, 1200); });
    api.death = fx(function (n) { noise(sfx, n, 1.0, 0.45, 0, 1800); tone(sfx, 'square', 520, n, 1.1, 0.12, 50); });
    api.clear = fx(function (n) { [440, 554, 659, 880, 659, 880, 1109].forEach(function (f, i) { tone(sfx, 'square', f, n + i * 0.09, 0.12, 0.1); }); });
    api.power = fx(function (n) { [523, 784, 1047, 1568].forEach(function (f, i) { tone(sfx, 'triangle', f, n + i * 0.06, 0.12, 0.18); }); });
    api.extra = fx(function (n) { [784, 988, 1175, 1568].forEach(function (f, i) { tone(sfx, 'square', f, n + i * 0.08, 0.1, 0.1); }); });
    api.ufo = fx(function (n, a) { tone(sfx, 'square', a ? 1180 : 940, n, 0.12, 0.025); });
    api.bossHit = fx(function (n) { tone(sfx, 'square', 180, n, 0.07, 0.07, 120); });
    api.alarm = fx(function (n) { for (var i = 0; i < 4; i++) { tone(sfx, 'sawtooth', 440, n + i * 0.5, 0.25, 0.08, 880); tone(sfx, 'sawtooth', 880, n + i * 0.5 + 0.25, 0.25, 0.08, 440); } });
    api.boom = fx(function (n) { for (var i = 0; i < 6; i++) noise(sfx, n + i * 0.3, 0.5, 0.4, 0, 900 + i * 200); });
    api.over = fx(function (n) { [392, 330, 262, 196].forEach(function (f, i) { tone(sfx, 'triangle', f, n + i * 0.25, 0.3, 0.2); }); });
    api.win = fx(function (n) { [523, 523, 523, 659, 784, 659, 784, 1047].forEach(function (f, i) { tone(sfx, 'square', f, n + i * 0.14, i === 7 ? 0.6 : 0.12, 0.1); }); });
    return api;
  })();

  /* ================= Theme colors ================= */
  var C = {};
  function readTheme() {
    var cs = getComputedStyle(root);
    ['bg', 'card', 'line', 'text', 'muted', 'neon1', 'neon2'].forEach(function (k) { C[k] = cs.getPropertyValue('--' + k).trim(); });
    C.light = root.getAttribute('data-theme') === 'light';
  }

  /* ================= Sprite drawing ================= */
  function ell(g, x, y, rx, ry) { g.beginPath(); g.ellipse(x, y, Math.max(rx, .01), Math.max(ry, .01), 0, 0, Math.PI * 2); g.fill(); }
  function circ(g, x, y, r) { ell(g, x, y, r, r); }
  function rrPath(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h);
    g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }
  function rr(g, x, y, w, h, r) { rrPath(g, x, y, w, h, r); g.fill(); }
  function eyes(g, x1, x2, y, r, dark) {
    g.fillStyle = '#ffffff'; circ(g, x1, y, r); circ(g, x2, y, r);
    g.fillStyle = dark || '#14141c'; circ(g, x1, y + r * 0.2, r * 0.5); circ(g, x2, y + r * 0.2, r * 0.5);
  }
  function outline(g, light) { if (light) { g.strokeStyle = 'rgba(20,24,40,.55)'; g.lineWidth = 1; g.stroke(); } }

  // All enemies are drawn centered at (cx, cy) inside roughly 24x20 px
  function drawBug(g, cx, cy, col, fr, light) {
    g.strokeStyle = col; g.lineWidth = 1.6; g.lineCap = 'round';
    var w = fr ? 2 : -2;
    g.beginPath();
    [-4, 1, 6].forEach(function (y, i) {
      var o = (i % 2 ? -w : w);
      g.moveTo(cx - 6, cy + y); g.lineTo(cx - 11, cy + y + o);
      g.moveTo(cx + 6, cy + y); g.lineTo(cx + 11, cy + y - o);
    });
    g.moveTo(cx - 2, cy - 9); g.lineTo(cx - 5 - (fr ? 1 : 0), cy - 13);
    g.moveTo(cx + 2, cy - 9); g.lineTo(cx + 5 + (fr ? 1 : 0), cy - 13);
    g.stroke();
    g.fillStyle = col; g.beginPath(); g.ellipse(cx, cy + 2, 7.5, 8.5, 0, 0, 7); g.fill(); outline(g, light);
    circ(g, cx, cy - 7.5, 3.8);
    g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(cx, cy - 5); g.lineTo(cx, cy + 10); g.stroke();
    g.fillStyle = 'rgba(0,0,0,.35)'; circ(g, cx - 3.5, cy + 1, 1.6); circ(g, cx + 3.5, cy + 4, 1.6); circ(g, cx - 3, cy + 6.5, 1.2);
    g.fillStyle = '#ffffff'; circ(g, cx - 1.6, cy - 8, 1.1); circ(g, cx + 1.6, cy - 8, 1.1);
  }
  function drawVirus(g, cx, cy, col, fr, light) {
    var rot = fr ? 0.39 : 0;
    g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 1.8;
    for (var i = 0; i < 8; i++) {
      var a = rot + i * Math.PI / 4, c = Math.cos(a), s = Math.sin(a);
      g.beginPath(); g.moveTo(cx + c * 6, cy + s * 6); g.lineTo(cx + c * 10, cy + s * 10); g.stroke();
      circ(g, cx + c * 10.3, cy + s * 10.3, 1.9);
    }
    g.beginPath(); g.arc(cx, cy, 7.5, 0, 7); g.fill(); outline(g, light);
    eyes(g, cx - 2.8, cx + 2.8, cy - 1.2, 2.2);
    g.strokeStyle = '#14141c'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(cx - 3, cy + 3.6); g.lineTo(cx - 1, cy + 2.6); g.lineTo(cx + 1, cy + 3.6); g.lineTo(cx + 3, cy + 2.6); g.stroke();
  }
  function drawWorm(g, cx, cy, col, fr, light) {
    var ph = fr ? Math.PI : 0;
    for (var i = 0; i < 5; i++) {
      var x = cx - 9 + i * 4.2, y = cy + 2 + Math.sin(i * 1.3 + ph) * 3;
      g.fillStyle = i % 2 ? col : shade(col, -0.18);
      g.beginPath(); g.arc(x, y, 3.8, 0, 7); g.fill(); outline(g, light);
    }
    var hx = cx + 9.5, hy = cy - 1 + Math.sin(5 * 1.3 + ph) * 2;
    g.fillStyle = col; g.beginPath(); g.arc(hx, hy, 5, 0, 7); g.fill(); outline(g, light);
    eyes(g, hx - 1.4, hx + 2.2, hy - 1.2, 1.7);
    g.strokeStyle = col; g.lineWidth = 1.3; g.beginPath(); g.moveTo(hx, hy - 4.5); g.lineTo(hx - 1.5, hy - 8); g.moveTo(hx + 2.5, hy - 4); g.lineTo(hx + 4, hy - 7.5); g.stroke();
  }
  function drawTrojan(g, cx, cy, col, fr, light) {
    var dk = shade(col, -0.45);
    g.fillStyle = dk; g.fillRect(cx - 11, cy + 5, 22, 3);
    g.fillStyle = '#2a2a33'; circ(g, cx - 7, cy + 9, 2.6); circ(g, cx + 7, cy + 9, 2.6);
    g.fillStyle = '#9aa0b5'; circ(g, cx - 7, cy + 9, 0.9); circ(g, cx + 7, cy + 9, 0.9);
    g.fillStyle = col;
    g.fillRect(cx - 7, cy + 1, 2.2, 5); g.fillRect(cx - 3, cy + 1, 2.2, 5); g.fillRect(cx + 2, cy + 1, 2.2, 5); g.fillRect(cx + 5.5, cy + 1, 2.2, 5);
    g.beginPath(); g.ellipse(cx, cy, 9, 4.8, 0, 0, 7); g.fill(); outline(g, light);
    g.beginPath(); g.moveTo(cx + 4, cy - 2); g.lineTo(cx + 7, cy - 10); g.lineTo(cx + 11, cy - 9); g.lineTo(cx + 9, cy - 1); g.closePath(); g.fill();
    g.beginPath(); g.ellipse(cx + 10, cy - 9.5, 4, 2.6, 0.25, 0, 7); g.fill(); outline(g, light);
    g.strokeStyle = dk; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx + 6, cy - 10); g.lineTo(cx + 4, cy - 4); g.stroke();
    g.beginPath(); g.moveTo(cx - 9, cy - 1); g.lineTo(cx - 12, cy + (fr ? 3 : 1)); g.stroke();
    g.fillStyle = '#14141c'; circ(g, cx + 10.5, cy - 10.2, 0.9);
    g.strokeStyle = dk; g.lineWidth = 0.8; g.beginPath(); g.moveTo(cx - 6, cy - 1); g.lineTo(cx + 3, cy - 1); g.moveTo(cx - 6, cy + 1.5); g.lineTo(cx + 3, cy + 1.5); g.stroke();
  }
  function drawEnemy(g, type, cx, cy, col, fr, light) {
    if (type === 'B') drawBug(g, cx, cy, col, fr, light);
    else if (type === 'V') drawVirus(g, cx, cy, col, fr, light);
    else if (type === 'W') drawWorm(g, cx, cy, col, fr, light);
    else drawTrojan(g, cx, cy, col, fr, light);
  }
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
    function f(c) { return Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt); }
    return 'rgb(' + f(r) + ',' + f(gg) + ',' + f(b) + ')';
  }

  // Admin with laptop, (cx, by) = center x and feet y
  function drawPlayer(g, cx, by) {
    var y = by;
    g.fillStyle = '#2b3047'; g.fillRect(cx - 7, y - 9, 5, 9); g.fillRect(cx + 2, y - 9, 5, 9);
    g.fillStyle = '#1b1b1b'; rr(g, cx - 8, y - 2, 7, 3, 1.2); rr(g, cx + 1, y - 2, 7, 3, 1.2);
    g.fillStyle = '#4a5ba8'; rr(g, cx - 10, y - 22, 20, 15, 5);
    g.fillStyle = '#ffc9a0'; circ(g, cx, y - 27, 6);
    g.fillStyle = '#3a2a1e'; g.beginPath(); g.arc(cx, y - 28, 6.2, Math.PI * 1.05, Math.PI * 1.95); g.fill();
    g.strokeStyle = '#14141c'; g.lineWidth = 1; g.beginPath(); g.rect(cx - 4.6, y - 28.4, 3.6, 2.6); g.rect(cx + 1, y - 28.4, 3.6, 2.6); g.moveTo(cx - 1, y - 27.2); g.lineTo(cx + 1, y - 27.2); g.stroke();
    g.strokeStyle = '#222'; g.lineWidth = 1.4; g.beginPath(); g.arc(cx, y - 28, 7, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    g.fillStyle = '#222'; rr(g, cx - 8.5, y - 30, 2.6, 4.5, 1); rr(g, cx + 5.9, y - 30, 2.6, 4.5, 1);
    // laptop (lid back facing us, glowing logo)
    g.fillStyle = '#9aa3b8'; g.beginPath(); g.moveTo(cx - 12, y - 11); g.lineTo(cx + 12, y - 11); g.lineTo(cx + 10, y - 21); g.lineTo(cx - 10, y - 21); g.closePath(); g.fill();
    g.fillStyle = '#c9cfdd'; g.fillRect(cx - 13, y - 11, 26, 2.5);
    g.fillStyle = '#00f0ff'; g.font = 'bold 7px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('</>', cx, y - 15.6);
    g.fillStyle = '#ffc9a0'; circ(g, cx - 12, y - 11, 2); circ(g, cx + 12, y - 11, 2);
  }
  function drawPatch(g, x, y) {
    g.save(); g.translate(x, y);
    g.fillStyle = '#ffe0b5'; rr(g, -2.6, -7, 5.2, 14, 2.4);
    g.fillStyle = '#e3ae7c'; g.fillRect(-2.6, -2.5, 5.2, 5);
    g.fillStyle = '#c99263'; g.fillRect(-1.2, -5.5, 0.9, 0.9); g.fillRect(0.4, 4.4, 0.9, 0.9);
    g.restore();
  }
  function drawExploit(g, b, tm, light) {
    var col = light ? '#c4102e' : '#ff3b5c';
    g.save(); g.translate(b.x, b.y);
    if (b.vx) g.rotate(-Math.atan2(b.vx, b.vy));
    if (b.kind === 'lock') {
      g.strokeStyle = '#ffb000'; g.lineWidth = 1.8; g.beginPath(); g.arc(0, -3, 3, Math.PI, 0); g.stroke();
      g.fillStyle = '#ffb000'; rr(g, -4.5, -3, 9, 7.5, 1.5); g.fillStyle = '#14141c'; circ(g, 0, 0.5, 1.1);
    } else if (b.kind === 'orb') {
      g.fillStyle = col; circ(g, 0, 0, 4); g.fillStyle = '#ffd0d8'; circ(g, -1, -1, 1.5);
    } else {
      var f = Math.floor(tm * 12) % 2 ? 1 : -1;
      g.strokeStyle = col; g.lineWidth = 2; g.lineJoin = 'round'; g.beginPath();
      g.moveTo(0, -7); g.lineTo(3 * f, -3.5); g.lineTo(-3 * f, 0); g.lineTo(3 * f, 3.5); g.lineTo(0, 7); g.stroke();
    }
    g.restore();
  }
  function drawZeroDay(g, cx, cy, tm) {
    g.save(); g.translate(cx, cy);
    g.fillStyle = '#1a1020'; g.strokeStyle = '#ff2b4a'; g.lineWidth = 2;
    g.beginPath(); g.ellipse(0, 2, 22, 7, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#2a1830'; g.beginPath(); g.ellipse(0, -2, 11, 8, 0, Math.PI, 0); g.fill(); g.stroke();
    g.fillStyle = '#ffffff'; circ(g, -3.5, -4, 2.2); circ(g, 3.5, -4, 2.2);
    g.fillStyle = '#ff2b4a'; circ(g, -3.5, -4, 1); circ(g, 3.5, -4, 1);
    for (var i = 0; i < 5; i++) { g.fillStyle = Math.floor(tm * 8 + i) % 2 ? '#ff2b4a' : '#ffd23f'; circ(g, -14 + i * 7, 3, 1.6); }
    g.restore();
  }
  function drawPower(g, type, cx, cy) {
    var col = type === 'triple' ? '#ffd23f' : type === 'shield' ? '#2fd3ff' : '#c38bff';
    g.save(); g.translate(cx, cy);
    g.fillStyle = 'rgba(10,12,20,.85)'; g.strokeStyle = col; g.lineWidth = 1.8; rrPath(g, -10, -9, 20, 18, 5); g.fill(); g.stroke();
    g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 1.6;
    if (type === 'triple') {
      [-5, 0, 5].forEach(function (x) { g.beginPath(); g.moveTo(x, 5); g.lineTo(x, -4); g.stroke(); g.beginPath(); g.moveTo(x - 2.4, -2); g.lineTo(x, -5.5); g.lineTo(x + 2.4, -2); g.fill(); });
    } else if (type === 'shield') {
      g.beginPath(); g.moveTo(0, -6); g.lineTo(6, -3.5); g.quadraticCurveTo(6, 4, 0, 6.5); g.quadraticCurveTo(-6, 4, -6, -3.5); g.closePath(); g.fill();
    } else {
      g.beginPath(); g.arc(0, 0, 5.8, 0, 7); g.stroke(); g.beginPath(); g.moveTo(0, -3.5); g.lineTo(0, 0); g.lineTo(2.8, 1.8); g.stroke();
    }
    g.restore();
  }
  function drawBoss(g, cx, cy, sc, flash, phase2, tm) {
    g.save(); g.translate(cx, cy); g.scale(sc, sc);
    var body = flash ? '#ffffff' : phase2 ? '#ff3b5c' : '#ff8a00', dk = flash ? '#dddddd' : '#7a1a10';
    g.strokeStyle = flash ? '#ffffff' : '#c9ced9'; g.lineWidth = 11; g.beginPath(); g.arc(0, -18, 28, Math.PI, 0); g.stroke();
    g.strokeStyle = '#6b7088'; g.lineWidth = 3; g.beginPath(); g.arc(0, -18, 28, Math.PI, 0); g.stroke();
    g.fillStyle = body; rr(g, -48, -22, 96, 64, 12);
    g.strokeStyle = dk; g.lineWidth = 3; rrPath(g, -48, -22, 96, 64, 12); g.stroke();
    g.fillStyle = dk; for (var i = 0; i < 4; i++) g.fillRect(-40 + i * 24, 34, 12, 4);
    var bl = Math.floor(tm * 2) % 5 === 0 ? 0.25 : 1;
    g.fillStyle = '#ffffff'; ell(g, -18, -2, 10, 9 * bl); ell(g, 18, -2, 10, 9 * bl);
    g.fillStyle = '#14141c'; ell(g, -16, 0, 4.5, 4.5 * bl); ell(g, 16, 0, 4.5, 4.5 * bl);
    g.strokeStyle = '#14141c'; g.lineWidth = 4; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-30, -16); g.lineTo(-8, -9); g.moveTo(30, -16); g.lineTo(8, -9); g.stroke();
    g.fillStyle = '#14141c'; circ(g, 0, 18, 6); g.beginPath(); g.moveTo(-4, 20); g.lineTo(4, 20); g.lineTo(6, 33); g.lineTo(-6, 33); g.closePath(); g.fill();
    g.fillStyle = flash ? '#14141c' : '#ffd23f'; g.font = 'bold 18px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('$', -32, 24); g.fillText('$', 32, 24);
    g.restore();
  }

  /* ================= Firewall shields ================= */
  function makeShield(cx) {
    var cells = new Uint8Array(SGW * SGH);
    for (var y = 0; y < SGH; y++) for (var x = 0; x < SGW; x++) {
      var on = true;
      if (y < 4 && (x < 4 - y || x > SGW - 5 + y)) on = false;
      if (y >= 10 && x >= 7 && x <= 16 && Math.pow((x - 11.5) / 5, 2) + Math.pow((y - 16.5) / 6.5, 2) < 1) on = false;
      cells[y * SGW + x] = on ? 1 : 0;
    }
    return { x: cx - SGW * SC / 2, y: SHIELD_Y, cells: cells, cv: document.createElement('canvas'), dirty: true };
  }
  function shieldColor(x, y) {
    var row = (y / 3) | 0, off = (row % 2) * 3;
    if (y % 3 === 2 || (x + off) % 6 === 5) return '#5a2416';
    return ((x + off) / 6 | 0) % 2 ? '#e2562a' : '#c9441f';
  }
  function renderShield(s) {
    s.cv.width = Math.ceil(SGW * SC * K); s.cv.height = Math.ceil(SGH * SC * K);
    var g = s.cv.getContext('2d'); g.setTransform(K, 0, 0, K, 0, 0);
    for (var y = 0; y < SGH; y++) for (var x = 0; x < SGW; x++) {
      if (!s.cells[y * SGW + x]) continue;
      g.fillStyle = shieldColor(x, y); g.fillRect(x * SC, y * SC, SC + 0.05, SC + 0.05);
    }
    s.dirty = false;
  }
  function shieldAt(px, py) {
    for (var i = 0; i < shields.length; i++) {
      var s = shields[i], cx = Math.floor((px - s.x) / SC), cy = Math.floor((py - s.y) / SC);
      if (cx >= 0 && cx < SGW && cy >= 0 && cy < SGH && s.cells[cy * SGW + cx]) return s;
    }
    return null;
  }
  function damageShield(s, px, py, r) {
    var ccx = (px - s.x) / SC, ccy = (py - s.y) / SC;
    for (var y = Math.floor(ccy - r - 1); y <= ccy + r + 1; y++) for (var x = Math.floor(ccx - r - 1); x <= ccx + r + 1; x++) {
      if (x < 0 || x >= SGW || y < 0 || y >= SGH) continue;
      var d = Math.hypot(x - ccx, y - ccy);
      if (d < r || (d < r + 1.2 && Math.random() < 0.5)) s.cells[y * SGW + x] = 0;
    }
    s.dirty = true;
  }
  function eraseShieldRect(x0, y0, x1, y1) {
    shields.forEach(function (s) {
      var a = Math.max(0, Math.floor((x0 - s.x) / SC)), b = Math.min(SGW - 1, Math.floor((x1 - s.x) / SC));
      var c = Math.max(0, Math.floor((y0 - s.y) / SC)), d = Math.min(SGH - 1, Math.floor((y1 - s.y) / SC));
      for (var y = c; y <= d; y++) for (var x = a; x <= b; x++) if (s.cells[y * SGW + x]) { s.cells[y * SGW + x] = 0; s.dirty = true; }
    });
  }

  /* ================= DOM / canvas ================= */
  var cv = $('cv'), ctx = cv.getContext('2d'), stage = $('stage'), K = 1;

  /* ================= Game state ================= */
  var levelIdx = 0, score = 0, lives = 3, best = parseInt(store('buginv-best') || '0', 10) || 0, extraGiven = false;
  var state = 'title', stateT = 0, paused = false, anim = 0, endInfo = null, cheatMsgKey = '';
  var pl, pb = [], eb = [], enemies = [], total = 0, fx = 0, fy = 0, fdir = 1, march = 0, mframe = 0, fireT = 0;
  var shields = [], zd = null, zdT = 0, zdBeep = 0, powers = [], pw = { triple: 0, shield: 0, slow: 0 };
  var boss = null, minions = [], parts = [], popups = [], rain = [], invaded = false;
  var keys = { left: false, right: false, fire: false }, touchX = null;

  function LV() { return LEVELS[levelIdx]; }
  function setState(s) { state = s; stateT = 0; }

  function initRain() {
    rain = [];
    for (var i = 0; i < 28; i++) rain.push({ x: rnd(4, W - 4), y: rnd(0, H), v: rnd(14, 34), ch: Math.random() < 0.5 ? '0' : '1' });
  }

  function buildWave() {
    var L = LV();
    enemies = []; total = 0;
    L.rows.forEach(function (row, r) {
      for (var c = 0; c < COLS; c++) if (row[c] !== '.') { enemies.push({ t: row[c], c: c, r: r, alive: true }); total++; }
    });
    fx = (W - ((COLS - 1) * CW + EW)) / 2; fy = 70; fdir = 1; march = 0; mframe = 0;
    fireT = 1.5;
  }
  function buildShields() {
    shields = [0, 1, 2, 3].map(function (i) { return makeShield(W * (i + 0.5) / 4); });
  }
  function resetPlayer() {
    pl = { x: W / 2, cd: 0, inv: 1.5 };
    pb = []; eb = []; minions = [];
  }

  function newGame(lvl) {
    score = 0; lives = 3; extraGiven = false; popups = []; parts = [];
    hideOv(); startLevel(lvl);
  }
  function startLevel(n) {
    levelIdx = n; buildWave(); buildShields(); resetPlayer();
    pw = { triple: 0, shield: 0, slow: 0 }; powers = []; zd = null; zdT = rnd(14, 22); boss = null; invaded = false;
    hud(); setState('intro');
    Snd.stop(); Snd.setLevel(LV().bpm, LV().key); Snd.start();
  }
  function introDur() { return levelIdx > 0 ? 4.5 : 2.2; }

  function addScore(n) {
    score += n;
    if (!extraGiven && score >= 10000) {
      extraGiven = true; lives++; Snd.extra();
      popups.push({ x: pl.x, y: PY - 50, txt: t('extra'), t: 0, col: C.neon2 });
    }
    if (score > best) { best = score; store('buginv-best', String(best)); }
    hud();
  }

  function explode(x, y, col, n, spd) {
    for (var i = 0; i < (n || 14); i++) {
      var a = rnd(0, Math.PI * 2), v = rnd(30, spd || 140);
      parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(0.4, 0.9), t: 0, col: col, s: rnd(1.5, 3.2) });
    }
  }

  function enemyPos(e) { return { x: fx + e.c * CW + EW / 2, y: fy + e.r * RH + EH / 2 }; }

  /* ---------- Player ---------- */
  function shoot() {
    var maxB = pw.triple > 0 ? 6 : 2;
    if (pb.length >= maxB) return;
    pl.cd = FIRE_CD;
    var y = PY - 24;
    if (pw.triple > 0) { pb.push({ x: pl.x, y: y, vx: 0 }); pb.push({ x: pl.x - 4, y: y, vx: -70 }); pb.push({ x: pl.x + 4, y: y, vx: 70 }); }
    else pb.push({ x: pl.x, y: y, vx: 0 });
    Snd.shoot();
  }

  function hitPlayer() {
    if (pl.inv > 0) return false;
    if (pw.shield > 0) {
      pw.shield = 0; pl.inv = 0.8; Snd.shield();
      explode(pl.x, PY - 16, '#2fd3ff', 16, 120);
      return false;
    }
    die(); return true;
  }
  function die() {
    explode(pl.x, PY - 14, '#ffc9a0', 20, 160); explode(pl.x, PY - 14, '#4a5ba8', 16, 120);
    setState('dying'); Snd.stop(); Snd.death();
  }
  function afterDeath() {
    lives--; hud();
    if (lives <= 0 || invaded) return endGame(false);
    resetPlayer(); setState('ready'); Snd.start();
  }

  function levelClear() {
    pb = []; eb = []; powers = []; zd = null;
    setState('clear'); Snd.stop(); Snd.clear();
  }
  function nextLevel() {
    if (levelIdx >= LEVELS.length - 1) return endGame(true);
    startLevel(levelIdx + 1);
  }
  function endGame(won) {
    setState(won ? 'won' : 'over'); Snd.stop();
    if (won) Snd.win(); else Snd.over();
    endInfo = { won: won, score: score, best: score >= best && score > 0, invaded: invaded };
    renderEnd(); showOv('ov-end'); updateButtons();
  }

  /* ---------- Boss ---------- */
  function spawnBoss() {
    boss = { x: W / 2, y: -70, hp: 90, max: 90, t: 0, pat: 0, patT: 2.2, flash: 0, enter: true };
    Snd.setBoss(true);
  }
  function bossPattern() {
    var p2 = boss.hp < boss.max / 2, bx = boss.x, by = boss.y + 40;
    switch (boss.pat) {
      case 0: // fan
        var n = p2 ? 9 : 7;
        for (var i = 0; i < n; i++) { var a = (-50 + 100 * i / (n - 1)) * Math.PI / 180, v = 150; eb.push({ x: bx, y: by, vx: Math.sin(a) * v, vy: Math.cos(a) * v, kind: 'orb' }); }
        break;
      case 1: // aimed burst
        var dx = pl.x - bx, dy = PY - 14 - by, d = Math.hypot(dx, dy) || 1, m = p2 ? 5 : 3;
        for (var k = 0; k < m; k++) { var sp = 160 + k * 30; eb.push({ x: bx, y: by, vx: dx / d * sp, vy: dy / d * sp, kind: 'zig' }); }
        break;
      case 2: // encryption rain with a gap
        var gap = (Math.random() * 7) | 0;
        for (var j = 0; j < 10; j++) if (j !== gap && j !== gap + 1) eb.push({ x: 24 + j * 41, y: -8, vx: 0, vy: p2 ? 120 : 95, kind: 'lock' });
        break;
      case 3: // minion dive
        for (var q = 0; q < (p2 ? 4 : 3); q++) minions.push({ x: bx + (q - 1) * 22, y: by, vy: rnd(80, 100), vx: 0 });
        break;
    }
    Snd.eshoot();
    boss.pat = (boss.pat + 1) % 4;
    boss.patT = p2 ? 1.5 : 2.3;
  }

  /* ---------- Update ---------- */
  function tick(h) {
    var L = LV(), slow = pw.slow > 0 ? 0.5 : 1;
    pw.triple = Math.max(0, pw.triple - h); pw.slow = Math.max(0, pw.slow - h); pw.shield = Math.max(0, pw.shield - h);
    pl.inv = Math.max(0, pl.inv - h);

    // player move + fire
    var mv = (keys.left ? -1 : 0) + (keys.right ? 1 : 0);
    if (touchX !== null) { var dd = touchX - pl.x; mv = Math.abs(dd) < 3 ? 0 : clamp(dd / 12, -1, 1); }
    pl.x = clamp(pl.x + mv * PSPEED * h, 18, W - 18);
    pl.cd -= h;
    if ((keys.fire || touchX !== null) && pl.cd <= 0) shoot();

    // player bullets
    for (var i = pb.length - 1; i >= 0; i--) {
      var b = pb[i]; b.y -= 470 * h; b.x += b.vx * h;
      var gone = b.y < -10 || b.x < -10 || b.x > W + 10;
      if (!gone) { var s = shieldAt(b.x, b.y - 6); if (s) { damageShield(s, b.x, b.y - 6, 1.8); gone = true; } }
      if (!gone) gone = bulletHitsTargets(b);
      if (gone) pb.splice(i, 1);
    }
    if (state !== 'play') return;

    // formation
    var alive = 0, minX = 1e9, maxX = -1e9, maxY = -1e9;
    enemies.forEach(function (e) {
      if (!e.alive) return; alive++;
      var x = fx + e.c * CW, y = fy + e.r * RH;
      if (x < minX) minX = x; if (x + EW > maxX) maxX = x + EW; if (y + EH > maxY) maxY = y + EH;
    });
    if (alive) {
      var spd = L.spd * (1 + 2.4 * (1 - alive / total)) * (alive === 1 ? 1.6 : 1) * slow;
      fx += fdir * spd * h;
      if ((fdir > 0 && maxX > W - 8) || (fdir < 0 && minX < 8)) { fdir = -fdir; fy += 12; fx += fdir * 2; }
      march += h * spd / 18; if (march > 0.5) { march = 0; mframe ^= 1; }
      if (maxY > SHIELD_Y - 2) enemies.forEach(function (e) { if (e.alive) { var p = enemyPos(e); eraseShieldRect(p.x - EW / 2, p.y - EH / 2, p.x + EW / 2, p.y + EH / 2); } });
      if (maxY >= PY - 30) { invaded = true; die(); return; }
      // enemy fire
      fireT -= h * slow;
      if (fireT <= 0) {
        fireT = L.fire * rnd(0.5, 1.4);
        if (eb.length < L.maxB) {
          var bottom = {};
          enemies.forEach(function (e) { if (e.alive && (!bottom[e.c] || e.r > bottom[e.c].r)) bottom[e.c] = e; });
          var list = Object.keys(bottom).map(function (k) { return bottom[k]; }), shooter;
          if (Math.random() < 0.4) shooter = list.reduce(function (a, c) { return Math.abs(enemyPos(c).x - pl.x) < Math.abs(enemyPos(a).x - pl.x) ? c : a; });
          else shooter = list[(Math.random() * list.length) | 0];
          var sp2 = enemyPos(shooter);
          eb.push({ x: sp2.x, y: sp2.y + 10, vx: 0, vy: L.bsp, kind: 'zig' });
          Snd.eshoot();
        }
      }
    } else if (!boss && levelIdx === LEVELS.length - 1) {
      eb = []; setState('bossIntro'); Snd.stop(); Snd.alarm(); return;
    } else if (!boss) { levelClear(); return; }

    // boss
    if (boss) {
      boss.flash = Math.max(0, boss.flash - h);
      if (boss.enter) { boss.y += 45 * h; if (boss.y >= 100) { boss.y = 100; boss.enter = false; } }
      else {
        var p2 = boss.hp < boss.max / 2;
        boss.t += h * slow;
        boss.x = W / 2 + Math.sin(boss.t * (p2 ? 1.25 : 0.8)) * (W / 2 - 70);
        boss.patT -= h * slow;
        if (boss.patT <= 0) bossPattern();
      }
    }
    // minions
    for (var m = minions.length - 1; m >= 0; m--) {
      var mi = minions[m];
      mi.vx += clamp(pl.x - mi.x, -1, 1) * 140 * h; mi.vx = clamp(mi.vx, -70, 70);
      mi.x += mi.vx * h * slow; mi.y += mi.vy * h * slow;
      if (mi.y > SHIELD_Y - 8 && mi.y < SHIELD_Y + SGH * SC + 8) eraseShieldRect(mi.x - 8, mi.y - 8, mi.x + 8, mi.y + 8);
      if (Math.abs(mi.x - pl.x) < 16 && mi.y > PY - 32 && mi.y < PY + 4) { minions.splice(m, 1); if (hitPlayer()) return; continue; }
      if (mi.y > H + 20) minions.splice(m, 1);
    }

    // enemy bullets
    for (var j = eb.length - 1; j >= 0; j--) {
      var e2 = eb[j]; e2.x += e2.vx * h * slow; e2.y += e2.vy * h * slow;
      var g2 = e2.y > H + 10 || e2.x < -20 || e2.x > W + 20;
      if (!g2) { var sh = shieldAt(e2.x, e2.y + 6); if (sh) { damageShield(sh, e2.x, e2.y + 6, 2.2); g2 = true; } }
      if (!g2 && Math.abs(e2.x - pl.x) < 11 && e2.y > PY - 26 && e2.y < PY + 2) { eb.splice(j, 1); if (hitPlayer()) return; continue; }
      if (g2) eb.splice(j, 1);
    }

    // zero-day
    if (!boss) {
      zdT -= h;
      if (!zd && zdT <= 0 && alive > 6) { var dir = Math.random() < 0.5 ? 1 : -1; zd = { x: dir > 0 ? -30 : W + 30, y: 40, dir: dir }; zdT = rnd(18, 28); }
    }
    if (zd) {
      zd.x += zd.dir * 95 * h * slow;
      zdBeep -= h; if (zdBeep <= 0) { zdBeep = 0.16; Snd.ufo(Math.floor(anim * 6) % 2); }
      if (zd.x < -40 || zd.x > W + 40) zd = null;
    }

    // power-ups
    for (var q = powers.length - 1; q >= 0; q--) {
      var po = powers[q]; po.y += 80 * h;
      if (Math.abs(po.x - pl.x) < 20 && po.y > PY - 32 && po.y < PY + 6) {
        if (po.type === 'triple') pw.triple = 10; else if (po.type === 'shield') pw.shield = 15; else pw.slow = 8;
        Snd.power(); popups.push({ x: pl.x, y: PY - 50, txt: t(po.type === 'triple' ? 'pTriple' : po.type === 'shield' ? 'pShield' : 'pSlow'), t: 0, col: C.neon1 });
        powers.splice(q, 1); continue;
      }
      if (po.y > H + 10) powers.splice(q, 1);
    }
  }

  function dropPower(x, y, chance) {
    if (powers.length || Math.random() > chance) return;
    var types = ['triple', 'shield', 'slow'];
    powers.push({ x: x, y: y, type: types[(Math.random() * 3) | 0] });
  }

  // returns true if the bullet hit something
  function bulletHitsTargets(b) {
    var pal = PAL[levelIdx];
    for (var k = 0; k < enemies.length; k++) {
      var e = enemies[k]; if (!e.alive) continue;
      var p = enemyPos(e);
      if (Math.abs(b.x - p.x) < EW / 2 + 2 && Math.abs(b.y - p.y) < EH / 2 + 6) {
        e.alive = false; addScore(POINTS[e.t]); explode(p.x, p.y, pal[e.t]); Snd.hit();
        dropPower(p.x, p.y, 0.035);
        return true;
      }
    }
    if (zd && Math.abs(b.x - zd.x) < 22 && Math.abs(b.y - zd.y) < 10) {
      var pts = [50, 100, 150, 300][(Math.random() * 4) | 0];
      addScore(pts); explode(zd.x, zd.y, '#ff2b4a', 22); Snd.hit();
      popups.push({ x: zd.x, y: zd.y, txt: String(pts), t: 0, col: C.neon2 });
      dropPower(zd.x, zd.y, 0.5); zd = null; return true;
    }
    for (var m = 0; m < minions.length; m++) {
      var mi = minions[m];
      if (Math.abs(b.x - mi.x) < 11 && Math.abs(b.y - mi.y) < 12) { addScore(20); explode(mi.x, mi.y, pal.B, 10); Snd.hit(); minions.splice(m, 1); return true; }
    }
    if (boss && !boss.enter && Math.abs(b.x - boss.x) < 50 && b.y > boss.y - 50 && b.y < boss.y + 45) {
      boss.hp--; boss.flash = 0.07; addScore(10); Snd.bossHit();
      explode(b.x, b.y, '#ffd23f', 5, 90);
      if (boss.hp <= 0) {
        addScore(5000); popups.push({ x: boss.x, y: boss.y, txt: '5000', t: 0, col: C.neon2 });
        explode(boss.x, boss.y, '#ff8a00', 40, 220); explode(boss.x, boss.y, '#ffd23f', 30, 180);
        eb = []; minions = []; setState('bossDie'); Snd.stop(); Snd.boom();
      }
      return true;
    }
    return false;
  }

  function update(dt) {
    anim += dt; stateT += dt;
    rain.forEach(function (r) { r.y += r.v * dt; if (r.y > H + 10) { r.y = -10; r.x = rnd(4, W - 4); r.ch = Math.random() < 0.5 ? '0' : '1'; } });
    parts = parts.filter(function (p) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 120 * dt; return p.t < p.life; });
    popups = popups.filter(function (p) { p.t += dt; p.y -= dt * 30; return p.t < 1.2; });
    switch (state) {
      case 'intro': if (stateT > introDur()) setState('ready'); break;
      case 'ready': if (stateT > 1.2) setState('play'); break;
      case 'play':
        var n = Math.ceil(dt / (1 / 120)), h = dt / n;
        for (var k = 0; k < n && state === 'play'; k++) tick(h);
        break;
      case 'dying': if (stateT > 1.7) afterDeath(); break;
      case 'clear': if (stateT > 2.4) nextLevel(); break;
      case 'bossIntro': if (stateT > 3) { spawnBoss(); setState('play'); Snd.start(); } break;
      case 'bossDie':
        if (stateT < 1.6 && Math.random() < dt * 12) explode(boss.x + rnd(-45, 45), boss.y + rnd(-35, 35), Math.random() < 0.5 ? '#ff8a00' : '#ffd23f', 12, 160);
        if (stateT > 2.8) { boss = null; endGame(true); }
        break;
    }
  }

  /* ================= Rendering ================= */
  function resize() {
    var w = cv.clientWidth; if (!w) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    var pw2 = Math.round(w * dpr), ph = Math.round(w * dpr * H / W);
    if (pw2 === cv.width && ph === cv.height) return;
    cv.width = pw2; cv.height = ph; K = pw2 / W;
    shields.forEach(function (s) { s.dirty = true; });
  }

  function text(s, x, y, size, col, glow, align) {
    ctx.font = size + 'px ' + FONT; ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
    if (glow && !C.light) { ctx.shadowColor = col; ctx.shadowBlur = 10 * K; }
    ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.shadowBlur = 0;
  }

  function draw() {
    if (!cv.width) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.setTransform(K, 0, 0, K, 0, 0);
    var acc = (C.light ? ACC_LIGHT : ACC_DARK)[levelIdx], pal = PAL[levelIdx];

    // binary rain background
    ctx.globalAlpha = C.light ? 0.13 : 0.16;
    ctx.font = '11px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = acc;
    rain.forEach(function (r) { ctx.fillText(r.ch, r.x, r.y); });
    ctx.globalAlpha = 1;

    // ground line
    ctx.strokeStyle = acc; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7;
    if (!C.light) { ctx.shadowColor = acc; ctx.shadowBlur = 6 * K; }
    ctx.beginPath(); ctx.moveTo(8, PY + 10); ctx.lineTo(W - 8, PY + 10); ctx.stroke();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;

    // shields
    shields.forEach(function (s) {
      if (s.dirty) renderShield(s);
      ctx.drawImage(s.cv, s.x, s.y, SGW * SC, SGH * SC);
    });

    // enemies
    var fr = mframe;
    enemies.forEach(function (e) {
      if (!e.alive) return; var p = enemyPos(e);
      drawEnemy(ctx, e.t, p.x, p.y, pal[e.t], fr, C.light);
    });
    minions.forEach(function (m) { drawBug(ctx, m.x, m.y, pal.B, Math.floor(anim * 8) % 2, C.light); });
    if (zd) drawZeroDay(ctx, zd.x, zd.y, anim);

    // boss
    if (boss && (state !== 'bossDie' || stateT < 1.6)) {
      var p2 = boss.hp < boss.max / 2, sc = state === 'bossDie' ? 1 + stateT * 0.15 : 1;
      if (state === 'bossDie') ctx.globalAlpha = Math.max(0, 1 - stateT / 1.6);
      drawBoss(ctx, boss.x + (state === 'bossDie' ? rnd(-3, 3) : 0), boss.y, sc, boss.flash > 0, p2, anim);
      ctx.globalAlpha = 1;
      if (state !== 'bossDie') {
        var bw = W - 80, frac = boss.hp / boss.max;
        text(t('bossName'), W / 2, 16, 12, C.neon2, true);
        ctx.fillStyle = C.card; ctx.fillRect(40, 26, bw, 7);
        ctx.fillStyle = p2 ? '#ff3b5c' : '#ff8a00'; ctx.fillRect(40, 26, bw * frac, 7);
        ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(40, 26, bw, 7);
      }
    }

    // power-ups, bullets
    powers.forEach(function (p) { drawPower(ctx, p.type, p.x, p.y); });
    pb.forEach(function (b) { drawPatch(ctx, b.x, b.y); });
    eb.forEach(function (b) { drawExploit(ctx, b, anim, C.light); });

    // player
    var showPlayer = state !== 'dying';
    if (showPlayer && !(pl.inv > 0 && state === 'play' && Math.floor(anim * 12) % 2)) {
      drawPlayer(ctx, pl.x, PY);
      if (pw.shield > 0) {
        ctx.strokeStyle = '#2fd3ff'; ctx.lineWidth = 2; ctx.globalAlpha = 0.55 + 0.25 * Math.sin(anim * 8);
        ctx.beginPath(); ctx.ellipse(pl.x, PY - 16, 20, 22, 0, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
      }
    }

    // particles + popups
    parts.forEach(function (p) { ctx.globalAlpha = Math.max(0, 1 - p.t / p.life); ctx.fillStyle = p.col; ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s); });
    ctx.globalAlpha = 1;
    popups.forEach(function (p) { ctx.globalAlpha = Math.max(0, 1 - p.t / 1.2); text(p.txt, p.x, p.y, 13, p.col, true); });
    ctx.globalAlpha = 1;

    // active power-up timers
    var ix = 14;
    [['triple', 10], ['shield', 15], ['slow', 8]].forEach(function (a) {
      if (pw[a[0]] <= 0) return;
      ctx.save(); ctx.translate(ix, PY + 24); ctx.scale(0.8, 0.8); drawPower(ctx, a[0], 0, 0); ctx.restore();
      ctx.fillStyle = C.line; ctx.fillRect(ix + 11, PY + 22, 30, 4);
      ctx.fillStyle = C.neon1; ctx.fillRect(ix + 11, PY + 22, 30 * pw[a[0]] / a[1], 4);
      ix += 50;
    });

    if (state === 'ready') text(t('ready'), W / 2, 380, 22, C.neon2, true);
    if (state === 'clear') text(t('clear'), W / 2, 300, 24, C.neon1, true);
    if (state === 'bossIntro') drawBossIntro();
    if (state === 'intro') drawIntro();
  }

  function drawBox(bh) {
    var bw = W * 0.86, bx = (W - bw) / 2, by = (H - bh) / 2 - 20;
    ctx.globalAlpha = 0.93; ctx.fillStyle = C.card; rr(ctx, bx, by, bw, bh, 12); ctx.globalAlpha = 1;
    ctx.strokeStyle = C.neon1; ctx.lineWidth = 1.5; rrPath(ctx, bx, by, bw, bh, 12); ctx.stroke();
    return by;
  }
  function drawIntro() {
    var L = LV(), hasCode = !!L.code, bh = hasCode ? 210 : 110, by = drawBox(bh);
    text(t('lvl', { n: levelIdx + 1 }), W / 2, by + 32, 32, C.neon2, true);
    text(t(L.name), W / 2, by + 64, 13, C.muted, false);
    if (hasCode) {
      text(t('codeFor'), W / 2, by + 100, 14, C.text, false);
      text(L.code, W / 2, by + 132, 30, C.neon1, true);
      text(t('codeHint'), W / 2, by + 162, 12, C.muted, false);
    }
    if (stateT > 1) text(t('skip'), W / 2, by + bh - 16, 11, C.muted, false);
  }
  function drawBossIntro() {
    var on = Math.floor(stateT * 4) % 2 === 0, by = drawBox(130);
    text('⚠ ' + t('bossWarn') + ' ⚠', W / 2, by + 34, 26, on ? '#ff3b5c' : C.neon2, true);
    text(t('bossText'), W / 2, by + 72, 13, C.text, false);
    text(t('bossName'), W / 2, by + 104, 20, '#ff8a00', true);
  }

  /* ================= Main loop ================= */
  var last = performance.now();
  function loop(ts) {
    var dt = Math.min((ts - last) / 1000, 0.05); last = ts;
    if (!paused && state !== 'title' && state !== 'over' && state !== 'won') update(dt);
    else if (!paused) { anim += dt; march += dt; if (march > 0.6) { march = 0; mframe ^= 1; } rain.forEach(function (r) { r.y += r.v * dt; if (r.y > H + 10) r.y = -10; }); }
    draw();
    requestAnimationFrame(loop);
  }

  /* ================= UI ================= */
  function hud() {
    $('hs').textContent = fmt(score);
    $('hl').textContent = levelIdx + 1;
    $('hv').textContent = lives;
    $('hb').textContent = fmt(best);
  }
  function showOv(id) { ['ov-title', 'ov-pause', 'ov-end'].forEach(function (o) { $(o).hidden = o !== id; }); }
  function hideOv() { showOv(null); }
  function renderEnd() {
    if (!endInfo) return;
    $('end-title').textContent = endInfo.won ? t('win') : t('gameOver');
    var s = endInfo.won ? t('winText', { s: fmt(endInfo.score) }) : t('endScore', { s: fmt(endInfo.score) });
    if (!endInfo.won && endInfo.invaded) s = t('invaded') + ' ' + s;
    if (endInfo.best) s += ' – ' + t('newBest');
    $('end-text').textContent = s;
  }
  function running() { return ['intro', 'ready', 'play', 'dying', 'clear', 'bossIntro', 'bossDie'].indexOf(state) >= 0; }
  function setPaused(p) {
    if (!running() || paused === p) return;
    paused = p;
    if (p) { Snd.stop(); showOv('ov-pause'); clearKeys(); }
    else { hideOv(); last = performance.now(); if (state !== 'dying' && state !== 'clear' && state !== 'bossDie') Snd.start(); }
    updateButtons();
  }
  function codeLevel(v) {
    v = v.trim().toUpperCase();
    for (var i = 1; i < LEVELS.length; i++) if (LEVELS[i].code === v) return i;
    return -1;
  }
  function tryStart() {
    var v = $('cheat').value, lvl = 0;
    if (v.trim()) {
      lvl = codeLevel(v);
      if (lvl < 0) { cheatMsgKey = 'badCode'; $('cheat-msg').textContent = t('badCode'); $('cheat').focus(); return; }
    }
    cheatMsgKey = ''; $('cheat-msg').textContent = '';
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    Snd.unlock(); paused = false; clearKeys(); newGame(lvl); updateButtons();
  }
  function toTitle() {
    Snd.stop(); paused = false;
    levelIdx = 0; buildWave(); buildShields(); resetPlayer(); boss = null; zd = null; powers = []; parts = []; popups = [];
    score = 0; lives = 3; hud();
    setState('title'); showOv('ov-title'); updateButtons();
  }
  function skipOrConfirm() {
    if (state === 'title') return tryStart();
    if (paused) return setPaused(false);
    if (state === 'over' || state === 'won') return toTitle();
    if (state === 'intro' && stateT > 1) setState('ready');
  }

  /* ---------- Fullscreen ---------- */
  var pseudoFs = false;
  function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function isFs() { return !!fsEl() || pseudoFs; }
  function applyFs() {
    stage.classList.toggle('is-fs', isFs());
    document.body.classList.toggle('noscroll', pseudoFs);
    updateButtons(); setTimeout(resize, 60);
  }
  function toggleFs() {
    if (isFs()) {
      if (fsEl()) { var ex = document.exitFullscreen || document.webkitExitFullscreen; if (ex) ex.call(document); }
      pseudoFs = false; applyFs(); return;
    }
    var req = stage.requestFullscreen || stage.webkitRequestFullscreen;
    var fallback = function () { pseudoFs = true; applyFs(); };
    if (!req) return fallback();
    try { var pr = req.call(stage); if (pr && pr.catch) pr.catch(fallback); } catch (e) { fallback(); }
  }
  document.addEventListener('fullscreenchange', applyFs);
  document.addEventListener('webkitfullscreenchange', applyFs);

  function updateButtons() {
    $('b-pause').textContent = paused ? t('cont') : t('pause');
    $('b-pause').disabled = !running();
    $('b-sound').textContent = Snd.muted() ? t('soundOff') : t('soundOn');
    $('b-sound').setAttribute('aria-pressed', Snd.muted() ? 'false' : 'true');
    $('b-fs').textContent = isFs() ? t('fsExit') : t('fs');
  }

  /* ---------- Language ---------- */
  function applyLang() {
    root.lang = lang;
    document.title = t('docTitle');
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    $('lang').textContent = lang === 'en' ? 'Deutsch' : 'English';
    modeBtn.textContent = root.getAttribute('data-theme') === 'light' ? t('dark') : t('light');
    $('cheat-msg').textContent = cheatMsgKey ? t(cheatMsgKey) : '';
    renderEnd(); updateButtons(); hud();
  }
  $('lang').addEventListener('click', function () { lang = lang === 'en' ? 'de' : 'en'; store('lang', lang); applyLang(); });

  /* ---------- Theme (same behavior as the main site) ---------- */
  var modeBtn = $('mode');
  function setTheme(light) {
    root.setAttribute('data-theme', light ? 'light' : 'dark');
    modeBtn.textContent = light ? t('dark') : t('light');
    store('theme', light ? 'light' : 'dark');
    readTheme(); drawIcons();
  }
  modeBtn.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') !== 'light'); });

  /* ---------- Legend icons ---------- */
  function drawIcons() {
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    document.querySelectorAll('canvas.ico').forEach(function (c) {
      c.width = c.height = Math.round(40 * dpr);
      var g = c.getContext('2d'), s = c.width / 32, k = c.getAttribute('data-ico');
      g.setTransform(s, 0, 0, s, 0, 0); g.clearRect(0, 0, 32, 32);
      if (k === 'player') { g.translate(16, 0); g.scale(0.85, 0.85); drawPlayer(g, 0, 37); }
      else if (POINTS[k]) drawEnemy(g, k, 16, 16, PAL[0][k], 0, C.light);
      else if (k === 'zd') { g.translate(16, 17); g.scale(0.62, 0.62); drawZeroDay(g, 0, 0, 0); }
      else if (k === 'boss') drawBoss(g, 16, 19, 0.24, false, false, 0.1);
      else drawPower(g, k, 16, 16);
    });
  }

  /* ---------- Input ---------- */
  function clearKeys() { keys.left = keys.right = keys.fire = false; touchX = null; document.querySelectorAll('.pads .on').forEach(function (b) { b.classList.remove('on'); }); }
  var KEYMAP = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ' ': 'fire', ArrowUp: 'fire', w: 'fire', W: 'fire' };
  document.addEventListener('keydown', function (ev) {
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    var tag = ev.target && ev.target.tagName, inInput = tag === 'INPUT', k = ev.key;
    if (state === 'title' || paused || state === 'over' || state === 'won' || (state === 'intro' && stateT > 1)) {
      if ((k === 'Enter' || (k === ' ' && !inInput)) && tag !== 'BUTTON') { ev.preventDefault(); skipOrConfirm(); return; }
    }
    if (inInput) return;
    var m = KEYMAP[k];
    if (m) { if (running()) ev.preventDefault(); keys[m] = true; return; }
    if (k === 'p' || k === 'P') { setPaused(!paused); return; }
    if (k === 'Escape') { if (pseudoFs) toggleFs(); else setPaused(true); return; }
    if (k === 'm' || k === 'M') { Snd.setMute(!Snd.muted()); updateButtons(); return; }
    if (k === 'f' || k === 'F') toggleFs();
  });
  document.addEventListener('keyup', function (ev) { var m = KEYMAP[ev.key]; if (m) keys[m] = false; });
  window.addEventListener('blur', clearKeys);

  document.querySelectorAll('.pads [data-k]').forEach(function (b) {
    var k = b.getAttribute('data-k');
    function down(ev) { ev.preventDefault(); Snd.unlock(); keys[k] = true; b.classList.add('on'); if (b.setPointerCapture && ev.pointerId !== undefined) try { b.setPointerCapture(ev.pointerId); } catch (e) { } }
    function up() { keys[k] = false; b.classList.remove('on'); }
    b.addEventListener('pointerdown', down);
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    b.addEventListener('lostpointercapture', up);
    b.addEventListener('contextmenu', function (ev) { ev.preventDefault(); });
  });

  function canvasX(clientX) { var r = cv.getBoundingClientRect(); return (clientX - r.left) / r.width * W; }
  cv.addEventListener('touchstart', function (ev) {
    if (state === 'intro') { skipOrConfirm(); return; }
    if (state === 'play' || state === 'ready') { touchX = canvasX(ev.touches[0].clientX); }
  }, { passive: true });
  cv.addEventListener('touchmove', function (ev) { ev.preventDefault(); if (touchX !== null) touchX = canvasX(ev.touches[0].clientX); }, { passive: false });
  cv.addEventListener('touchend', function (ev) { if (!ev.touches.length) touchX = null; }, { passive: true });
  cv.addEventListener('touchcancel', function () { touchX = null; }, { passive: true });
  cv.addEventListener('click', function () { if (state === 'intro') skipOrConfirm(); });

  $('start').addEventListener('click', tryStart);
  $('resume').addEventListener('click', function () { setPaused(false); });
  $('again').addEventListener('click', toTitle);
  $('b-pause').addEventListener('click', function () { setPaused(!paused); });
  $('b-sound').addEventListener('click', function () { Snd.unlock(); Snd.setMute(!Snd.muted()); updateButtons(); });
  $('b-fs').addEventListener('click', toggleFs);
  $('b-restart').addEventListener('click', toTitle);
  $('cheat').addEventListener('input', function () { if (cheatMsgKey) { cheatMsgKey = ''; $('cheat-msg').textContent = ''; } });
  document.addEventListener('visibilitychange', function () { if (document.hidden) setPaused(true); });

  /* ================= Init ================= */
  if (store('theme') === 'light') { root.setAttribute('data-theme', 'light'); }
  readTheme(); initRain();
  buildWave(); buildShields(); resetPlayer();
  applyLang();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(cv);
  window.addEventListener('resize', resize);
  resize(); drawIcons(); hud(); updateButtons();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawIcons);
  // debug hook for automated tests only (no effect on gameplay)
  if (/[?&]test=1/.test(location.search)) window.__bi = { state: function () { return state; }, killAll: function () { enemies.forEach(function (e) { e.alive = false; }); }, boss: function () { return boss && boss.hp; }, hitBoss: function (n) { if (boss) { boss.hp = Math.max(1, boss.hp - n); } } };
  requestAnimationFrame(loop);
})();
