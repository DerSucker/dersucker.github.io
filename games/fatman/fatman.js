/* FatMan – a retro maze game | by Martin Sucker | github.com/DerSucker | www.martinsucker.de */
(function () {
  'use strict';

  /* ================= Config ================= */
  var W = 19, H = 21, T = 24, PW = W * T, PH = H * T;
  var EXIT = { c: 9, r: 7 }, HOUSE_Y = 9, BONUS = { c: 9, r: 11 }, TUNNEL_ROW = 9;
  var MAZES = [
  [
    "###################",
    "#........#........#",
    "#o##.###.#.###.##o#",
    "#.................#",
    "#.##.#.#####.#.##.#",
    "#....#...#...#....#",
    "####.###.#.###.####",
    "XXX#.#.......#.#XXX",
    "####.#.##-##.#.####",
    "    .  #HHH#  .    ",
    "####.#.#####.#.####",
    "XXX#.#.......#.#XXX",
    "####.#.#####.#.####",
    "#........#........#",
    "#.##.###.#.###.##.#",
    "#o.#.....P.....#.o#",
    "##.#.#.#####.#.#.##",
    "#....#...#...#....#",
    "#.######.#.######.#",
    "#.................#",
    "###################"
  ],
  [
    "###################",
    "#o...#.......#...o#",
    "#.##.#.#####.#.##.#",
    "#.................#",
    "#.##.##.###.##.##.#",
    "#....#...#...#....#",
    "####.#.#.#.#.#.####",
    "XXX#.#.......#.#XXX",
    "####.#.##-##.#.####",
    "    .  #HHH#  .    ",
    "####.#.#####.#.####",
    "XXX#.#.......#.#XXX",
    "####.#.#####.#.####",
    "#.................#",
    "#.#.###.#.#.###.#.#",
    "#o#......P......#o#",
    "#.#.##.#####.##.#.#",
    "#...#.........#...#",
    "#.#.#.###.###.#.#.#",
    "#.................#",
    "###################"
  ],
  [
    "###################",
    "#o.......#.......o#",
    "#.####.#...#.####.#",
    "#......#.#.#......#",
    "#.##.#.#.#.#.#.##.#",
    "#.................#",
    "####.###.#.###.####",
    "XXX#.#.......#.#XXX",
    "####.#.##-##.#.####",
    "    .  #HHH#  .    ",
    "####.#.#####.#.####",
    "XXX#.#.......#.#XXX",
    "####.#.#####.#.####",
    "#o...#...#...#...o#",
    "#.##.#.#.#.#.#.##.#",
    "#........P........#",
    "###.#.###.###.#.###",
    "#.....#.....#.....#",
    "#.###.#.###.#.###.#",
    "#.................#",
    "###################"
  ],
  [
    "###################",
    "#........#........#",
    "#.##.###.#.###.##.#",
    "#o#......#......#o#",
    "#.#.##.#####.##.#.#",
    "#.................#",
    "####.#.#####.#.####",
    "XXX#.#.......#.#XXX",
    "####.#.##-##.#.####",
    "    .  #HHH#  .    ",
    "####.#.#####.#.####",
    "XXX#.#.......#.#XXX",
    "####.#.#####.#.####",
    "#.................#",
    "#.###.#.###.#.###.#",
    "#o..#....P....#..o#",
    "#.#.#.###.###.#.#.#",
    "#.#...#.....#...#.#",
    "#.#.#.#.#.#.#.#.#.#",
    "#.................#",
    "###################"
  ],
  [
    "###################",
    "#o...............o#",
    "#.###.#.###.#.###.#",
    "#.....#.....#.....#",
    "#.#.#.#.###.#.#.#.#",
    "#.................#",
    "####.#.#####.#.####",
    "XXX#.#.......#.#XXX",
    "####.#.##-##.#.####",
    "    .  #HHH#  .    ",
    "####.#.#####.#.####",
    "XXX#.#.......#.#XXX",
    "####.#.#####.#.####",
    "#o.......#.......o#",
    "#.##.###.#.###.##.#",
    "#..#.....P.....#..#",
    "##.#.#.#####.#.#.##",
    "#....#.......#....#",
    "#.##.#.#####.#.##.#",
    "#.................#",
    "###################"
]
];
  // pS = player speed, dS = doctor speed, frS = frightened speed, tun = tunnel speed (tiles/s)
  var LEVELS = [
    { pS: 6.6, dS: 6.0, frS: 3.6, tun: 3.4, fright: 7, rel: [0, 2, 6, 10], bonus: 'fries',   bp: 100,  bpm: 128, key: 0,  code: '' },
    { pS: 7.0, dS: 6.6, frS: 3.8, tun: 3.6, fright: 6, rel: [0, 1.5, 5, 8], bonus: 'shake',  bp: 300,  bpm: 136, key: 2,  code: 'CHEESE' },
    { pS: 7.3, dS: 7.1, frS: 4.0, tun: 3.8, fright: 5, rel: [0, 1, 4, 7],   bonus: 'hotdog', bp: 500,  bpm: 144, key: -3, code: 'BACON' },
    { pS: 7.6, dS: 7.5, frS: 4.2, tun: 4.0, fright: 4, rel: [0, 1, 3, 5],   bonus: 'pizza',  bp: 700,  bpm: 152, key: 5,  code: 'KETCHUP' },
    { pS: 7.9, dS: 7.9, frS: 4.4, tun: 4.2, fright: 3, rel: [0, .5, 2, 4],  bonus: 'chicken', bp: 1000, bpm: 160, key: 0, code: 'SUPERSIZE' }
  ];
  var DOC_COLORS = ['#ff3b5c', '#ff7ad9', '#2fd3ff', '#ffa53a'];
  var DIRS = [[0, -1], [-1, 0], [0, 1], [1, 0]]; // tie-break order: up, left, down, right
  var MODES = [7, 20, 7, 20, 5, 20, 5, 1e9];     // scatter/chase alternation in seconds
  var ACC_DARK = ['#00f0ff', '#ff2bd6', '#7cff6b', '#ffb000', '#a78bff'];
  var ACC_LIGHT = ['#0077c8', '#c0109d', '#2a8f1f', '#c26a00', '#5b3fd1'];
  var FONT = '"Special Elite","American Typewriter","Courier New",monospace';

  /* ================= i18n ================= */
  var TXT = {
    de: {
      light: '☀ Lightmode', dark: '☾ Darkmode', themeAria: 'Design wechseln',
      back: 'Startseite', backAria: 'Startseite',
      docTitle: 'FatMan – Browsergame | Martin Sucker',
      subtitle: 'Ein Retro-Labyrinthspiel: Burger futtern, Ärzten ausweichen.',
      score: 'Punkte', level: 'Level', lives: 'Leben', best: 'Rekord', board: 'Spielfeld',
      intro: 'Iss alle Burger – aber lass dich nicht von den Ärzten erwischen!',
      cheatLabel: 'Cheatcode (optional)', cheatPh: 'z. B. CODE',
      start: 'Spiel starten', startHint: 'Enter / Leertaste zum Starten',
      paused: 'Pause', resume: 'Weiter', again: 'Nochmal spielen', restart: '↺ Neustart',
      up: 'Hoch', left: 'Links', down: 'Runter', right: 'Rechts',
      howTo: 'So wird gespielt', ctrlTitle: 'Steuerung',
      ctrlText: 'PC/Mac: Pfeiltasten oder WASD. P = Pause, M = Ton, F = Vollbild. Smartphone: Steuerkreuz unter dem Spielfeld oder auf dem Spielfeld wischen.',
      goalTitle: 'Ziel',
      goalText: 'Iss alle Burger eines Levels. Wer alle 5 Level schafft, gewinnt. Ab 10.000 Punkten gibt es ein Extraleben.',
      cheatTitle: 'Cheatcodes',
      cheatText: 'Zu Beginn jedes Levels ab Level 2 wird ein Cheatcode angezeigt. Gib ihn beim nächsten Mal vor dem Start ein, um direkt in diesem Level zu beginnen.',
      legend: 'Legende', lgPlayer: 'FatMan – das bist du', lgBurger: 'Burger – 10 Punkte',
      lgDonut: 'Donut – 50 Punkte, Ärzte fliehen', lgDoctor: 'Arzt – nicht erwischen lassen!',
      lgScared: 'Erschrockener Arzt – 200 bis 1.600 Punkte', lgBonus: 'Bonus-Snack – 100 bis 1.000 Punkte',
      home: 'Startseite · Impressum · Datenschutz',
      pause: '⏸ Pause', cont: '▶ Weiter', soundOn: '♪ Ton an', soundOff: '♪ Ton aus',
      fs: '⛶ Vollbild', fsExit: '⛶ Vollbild beenden',
      badCode: 'Unbekannter Cheatcode.',
      lvl: 'LEVEL {n}', codeFor: 'Cheatcode für dieses Level:', codeHint: 'Beim nächsten Mal vor dem Start eingeben',
      skip: 'Tippen / Enter = weiter', ready: 'Bereit!', gameOver: 'Game Over', win: 'Gewonnen!',
      endScore: 'Punkte: {s}', winText: 'Alle 5 Level geschafft! Punkte: {s}', newBest: 'Neuer Rekord!', extra: '+1 LEBEN'
    },
    en: {
      light: '☀ Light mode', dark: '☾ Dark mode', themeAria: 'Switch theme',
      back: 'Home', backAria: 'Home',
      docTitle: 'FatMan – Browser Game | Martin Sucker',
      subtitle: 'A retro maze game: munch burgers, dodge doctors.',
      score: 'Score', level: 'Level', lives: 'Lives', best: 'Best', board: 'Game board',
      intro: 'Eat every burger – but don’t let the doctors catch you!',
      cheatLabel: 'Cheat code (optional)', cheatPh: 'e.g. CODE',
      start: 'Start game', startHint: 'Enter / Space to start',
      paused: 'Paused', resume: 'Resume', again: 'Play again', restart: '↺ Restart',
      up: 'Up', left: 'Left', down: 'Down', right: 'Right',
      howTo: 'How to play', ctrlTitle: 'Controls',
      ctrlText: 'PC/Mac: arrow keys or WASD. P = pause, M = sound, F = fullscreen. Smartphone: use the d-pad below the board or swipe on the board.',
      goalTitle: 'Goal',
      goalText: 'Eat all burgers in a level. Clear all 5 levels to win. You get an extra life at 10,000 points.',
      cheatTitle: 'Cheat codes',
      cheatText: 'From level 2 on, a cheat code is shown at the start of each level. Enter it before starting next time to jump straight to that level.',
      legend: 'Legend', lgPlayer: 'FatMan – that’s you', lgBurger: 'Burger – 10 points',
      lgDonut: 'Donut – 50 points, doctors flee', lgDoctor: 'Doctor – don’t get caught!',
      lgScared: 'Scared doctor – 200 to 1,600 points', lgBonus: 'Bonus snack – 100 to 1,000 points',
      home: 'Home · Legal notice · Privacy',
      pause: '⏸ Pause', cont: '▶ Resume', soundOn: '♪ Sound on', soundOff: '♪ Sound off',
      fs: '⛶ Fullscreen', fsExit: '⛶ Exit fullscreen',
      badCode: 'Unknown cheat code.',
      lvl: 'LEVEL {n}', codeFor: 'Cheat code for this level:', codeHint: 'Enter it before starting next time',
      skip: 'Tap / Enter = continue', ready: 'Ready!', gameOver: 'Game Over', win: 'You win!',
      endScore: 'Score: {s}', winText: 'All 5 levels cleared! Score: {s}', newBest: 'New high score!', extra: '+1 LIFE'
    }
  };

  /* ================= Helpers ================= */
  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
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
    var ac = null, master, mus, sfx, noiseBuf;
    var muted = store('fatman-mute') === '1';
    var playing = false, timer = 0, nextT = 0, step = 0, bpm = 128, key = 0, alarm = false, chompA = false;
    // "Burger Boogie": 12-bar boogie-woogie blues, swung eighths
    var PROG = [0, 0, 0, 0, 5, 5, 0, 0, 7, 5, 0, 7];
    var BASS = [0, 4, 7, 9, 10, 9, 7, 4];
    var R1 = [7, null, 10, 12, null, 12, 9, 7], R2 = [12, 12, 10, 7, 9, null, 7, null],
        R3 = [12, null, 15, 16, null, 12, null, null], R4 = [12, 10, 7, 4, 0, null, 0, null],
        R5 = [0, null, 4, null, 7, null, 10, null];
    var MEL = [R1, R2, R1, R3, R1, R2, R1, R2, R1, R2, R4, R5];

    function init() {
      if (!AC) return false;
      if (!ac) {
        ac = new AC();
        master = ac.createGain(); master.gain.value = muted ? 0 : 0.8; master.connect(ac.destination);
        mus = ac.createGain(); mus.gain.value = 0.45; mus.connect(master);
        sfx = ac.createGain(); sfx.gain.value = 0.6; sfx.connect(master);
        var len = ac.sampleRate * 0.5;
        noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
        var d = noiseBuf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ac.state === 'suspended') ac.resume();
      return true;
    }
    function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function tone(dest, type, f, at, dur, vol, f2) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, at);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, at + dur);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(vol, at + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      o.connect(g); g.connect(dest); o.start(at); o.stop(at + dur + 0.03);
    }
    function noise(at, dur, vol, hp) {
      var s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
      s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = hp;
      g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      s.connect(f); f.connect(g); g.connect(mus); s.start(at); s.stop(at + dur + 0.02);
    }
    function kick(at) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(150, at); o.frequency.exponentialRampToValueAtTime(45, at + 0.12);
      g.gain.setValueAtTime(0.7, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
      o.connect(g); g.connect(mus); o.start(at); o.stop(at + 0.2);
    }
    function sched() {
      if (!playing) return;
      var beat = 60 / bpm;
      while (nextT < ac.currentTime + 0.15) {
        var s = step % 96, bar = (s / 8) | 0, e = s % 8, rt = PROG[bar] + key, chorus = (step / 96) | 0;
        var len = (e % 2 === 0 ? 0.62 : 0.38) * beat, at = nextT;
        var b = 36 + rt + BASS[e];
        tone(mus, 'triangle', mtof(b), at, len * 0.95, 0.5);
        tone(mus, 'square', mtof(b), at, len * 0.45, 0.045);
        if (e === 0 || e === 4) kick(at);
        if (e === 2 || e === 6) noise(at, 0.12, 0.22, 1400);
        noise(at, 0.035, e % 2 ? 0.05 : 0.09, 7000);
        var n = MEL[bar][e];
        if (n !== null) tone(mus, chorus % 2 ? 'triangle' : 'square', mtof(60 + 12 * (chorus % 2) + rt + n), at, len * 0.9, chorus % 2 ? 0.16 : 0.075);
        if (e === 3 || e === 7) { tone(mus, 'triangle', mtof(52 + rt), at, len * 0.6, 0.05); tone(mus, 'triangle', mtof(58 + rt), at, len * 0.6, 0.05); }
        if (alarm) tone(mus, 'square', e % 2 ? 1320 : 990, at, len * 0.5, 0.03);
        nextT += len; step++;
      }
    }
    var api = {
      unlock: init,
      start: function () { if (!init() || playing) return; playing = true; step = 0; nextT = ac.currentTime + 0.06; sched(); timer = setInterval(sched, 25); },
      stop: function () { playing = false; clearInterval(timer); },
      setLevel: function (b, k) { bpm = b; key = k; },
      alarm: function (on) { alarm = on; },
      muted: function () { return muted; },
      setMute: function (m) {
        muted = m; store('fatman-mute', m ? '1' : '0');
        if (ac) master.gain.setTargetAtTime(m ? 0 : 0.8, ac.currentTime, 0.02);
      }
    };
    function fx(fn) { return function () { if (ac && ac.state === 'running') fn(ac.currentTime); }; }
    api.chomp = fx(function (n) { chompA = !chompA; tone(sfx, 'square', chompA ? 520 : 380, n, 0.07, 0.1, chompA ? 300 : 220); });
    api.donut = fx(function (n) { tone(sfx, 'sawtooth', 220, n, 0.35, 0.12, 880); tone(sfx, 'square', 330, n + 0.05, 0.3, 0.06, 1320); });
    api.eatDoc = fx(function (n) { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(sfx, 'square', f, n + i * 0.05, 0.08, 0.12); }); });
    api.death = fx(function (n) { tone(sfx, 'square', 660, n, 1.1, 0.13, 70); for (var i = 0; i < 6; i++) tone(sfx, 'triangle', 880 - i * 110, n + i * 0.16, 0.12, 0.1); });
    api.bonus = fx(function (n) { tone(sfx, 'square', 880, n, 0.1, 0.12); tone(sfx, 'square', 1320, n + 0.1, 0.15, 0.12); });
    api.extra = fx(function (n) { [784, 988, 1175, 1568].forEach(function (f, i) { tone(sfx, 'square', f, n + i * 0.08, 0.1, 0.12); }); });
    api.clear = fx(function (n) { [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) { tone(sfx, 'square', f, n + i * 0.12, 0.14, 0.12); }); });
    api.over = fx(function (n) { [392, 330, 262, 196].forEach(function (f, i) { tone(sfx, 'triangle', f, n + i * 0.25, 0.3, 0.2); }); });
    api.win = fx(function (n) { [523, 523, 523, 659, 784, 659, 784, 1047].forEach(function (f, i) { tone(sfx, 'square', f, n + i * 0.14, i === 7 ? 0.6 : 0.12, 0.12); }); });
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
  function rr(g, x, y, w, h, r) { rrPath(g, x, y, w, h, r); g.fill(); }
  function rrPath(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h);
    g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }

  function drawBurger(g, cx, cy, w) {
    var h = w * 0.82, x = cx - w / 2, top = cy - h / 2;
    g.fillStyle = '#e8a33d';
    g.beginPath(); g.moveTo(x, top + h * 0.45); g.quadraticCurveTo(x, top, cx, top); g.quadraticCurveTo(x + w, top, x + w, top + h * 0.45); g.closePath(); g.fill();
    g.fillStyle = '#fff3c4';
    g.fillRect(cx - w * 0.26, top + h * 0.2, w * 0.1, w * 0.06); g.fillRect(cx - w * 0.04, top + h * 0.12, w * 0.1, w * 0.06); g.fillRect(cx + w * 0.16, top + h * 0.22, w * 0.1, w * 0.06);
    g.fillStyle = '#5fd35f'; g.fillRect(x - w * 0.05, top + h * 0.44, w * 1.1, h * 0.13);
    g.fillStyle = '#ffd23f'; g.fillRect(x, top + h * 0.56, w, h * 0.07);
    g.fillStyle = '#6b3a1e'; rr(g, x, top + h * 0.6, w, h * 0.2, h * 0.08);
    g.fillStyle = '#d9912f'; rr(g, x + w * 0.03, top + h * 0.8, w * 0.94, h * 0.2, h * 0.09);
  }

  function drawDonut(g, cx, cy, r, hole) {
    g.fillStyle = '#d9a35b'; circ(g, cx, cy, r);
    g.fillStyle = '#ff6fb5'; circ(g, cx, cy - r * 0.05, r * 0.86);
    var sp = ['#ffffff', '#7cff6b', '#2fd3ff', '#ffd23f'];
    for (var i = 0; i < 8; i++) {
      var a = i * 0.785 + 0.3, d = r * 0.62;
      g.save(); g.translate(cx + Math.cos(a) * d, cy - r * 0.05 + Math.sin(a) * d); g.rotate(a * 2);
      g.fillStyle = sp[i % 4]; g.fillRect(-r * 0.12, -r * 0.04, r * 0.24, r * 0.08); g.restore();
    }
    g.fillStyle = hole; circ(g, cx, cy - r * 0.03, r * 0.3);
  }

  function drawBonus(g, kind, cx, cy, s) {
    g.save(); g.translate(cx, cy);
    if (kind === 'fries') {
      g.fillStyle = '#ffd23f';
      for (var i = 0; i < 5; i++) g.fillRect(-s * 0.32 + i * s * 0.14, -s * 0.48 + (i % 2) * s * 0.08, s * 0.1, s * 0.5);
      g.fillStyle = '#e8233a';
      g.beginPath(); g.moveTo(-s * 0.4, -s * 0.1); g.lineTo(s * 0.4, -s * 0.1); g.lineTo(s * 0.3, s * 0.45); g.lineTo(-s * 0.3, s * 0.45); g.closePath(); g.fill();
      g.fillStyle = '#ffd23f'; circ(g, 0, s * 0.17, s * 0.1);
    } else if (kind === 'shake') {
      g.strokeStyle = '#e8233a'; g.lineWidth = s * 0.06; g.beginPath(); g.moveTo(s * 0.05, -s * 0.25); g.lineTo(s * 0.2, -s * 0.5); g.stroke();
      g.fillStyle = '#fff5fb'; circ(g, -s * 0.08, -s * 0.24, s * 0.16); circ(g, s * 0.1, -s * 0.24, s * 0.14);
      g.fillStyle = '#ff6fb5'; g.beginPath(); g.moveTo(-s * 0.32, -s * 0.18); g.lineTo(s * 0.32, -s * 0.18); g.lineTo(s * 0.22, s * 0.48); g.lineTo(-s * 0.22, s * 0.48); g.closePath(); g.fill();
      g.fillStyle = '#ffffff'; g.fillRect(-s * 0.28, s * 0.02, s * 0.56, s * 0.08);
      g.fillStyle = '#e8233a'; circ(g, 0, -s * 0.42, s * 0.07);
    } else if (kind === 'hotdog') {
      g.fillStyle = '#e8a33d'; ell(g, 0, s * 0.08, s * 0.5, s * 0.2);
      g.fillStyle = '#b5482b'; ell(g, 0, -s * 0.02, s * 0.56, s * 0.12);
      g.strokeStyle = '#ffd23f'; g.lineWidth = s * 0.05; g.beginPath();
      for (var k = 0; k <= 6; k++) { var xx = -s * 0.4 + k * s * 0.133; if (k) g.lineTo(xx, -s * 0.02 + (k % 2 ? -1 : 1) * s * 0.05); else g.moveTo(xx, -s * 0.02); }
      g.stroke();
    } else if (kind === 'pizza') {
      g.fillStyle = '#d9912f'; g.beginPath(); g.moveTo(-s * 0.45, -s * 0.38); g.quadraticCurveTo(0, -s * 0.55, s * 0.45, -s * 0.38); g.lineTo(0, s * 0.5); g.closePath(); g.fill();
      g.fillStyle = '#ffd23f'; g.beginPath(); g.moveTo(-s * 0.36, -s * 0.3); g.lineTo(s * 0.36, -s * 0.3); g.lineTo(0, s * 0.4); g.closePath(); g.fill();
      g.fillStyle = '#c4262e'; circ(g, -s * 0.12, -s * 0.15, s * 0.08); circ(g, s * 0.12, -s * 0.12, s * 0.07); circ(g, 0, s * 0.12, s * 0.07);
    } else { // chicken
      g.save(); g.rotate(-0.6);
      g.fillStyle = '#f2ead8'; g.fillRect(-s * 0.05, s * 0.1, s * 0.1, s * 0.35); circ(g, -s * 0.07, s * 0.47, s * 0.07); circ(g, s * 0.07, s * 0.47, s * 0.07);
      g.fillStyle = '#c47a2c'; ell(g, 0, -s * 0.12, s * 0.28, s * 0.32);
      g.fillStyle = '#e09a46'; ell(g, -s * 0.07, -s * 0.2, s * 0.1, s * 0.14);
      g.restore();
    }
    g.restore();
  }

  // Fat man: side view (left/right) or front/back view (down/up)
  function drawFatMan(g, x, y, fdx, fdy, mouth, walk, sc, rot) {
    var R = T * 0.54 * (sc === undefined ? 1 : sc);
    var skin = '#ffc9a0', skinD = '#e8a27a', shirt = '#ffd23f', shirtD = '#e0b000', pants = '#3b4f9c', hair = '#5a3a1e';
    var leg = Math.sin(walk * 18) * R * 0.12;
    g.save(); g.translate(x, y); if (rot) g.rotate(rot);
    g.fillStyle = 'rgba(0,0,0,.22)'; ell(g, 0, R * 0.92, R * 0.7, R * 0.13);
    if (fdx !== 0 || fdy === 0) {
      if (fdx < 0) g.scale(-1, 1);
      g.fillStyle = pants; rr(g, -R * 0.4 + leg, R * 0.42, R * 0.3, R * 0.44, R * 0.08); rr(g, R * 0.06 - leg, R * 0.42, R * 0.3, R * 0.44, R * 0.08);
      g.fillStyle = '#222'; rr(g, -R * 0.4 + leg, R * 0.8, R * 0.4, R * 0.14, R * 0.06); rr(g, R * 0.06 - leg, R * 0.8, R * 0.4, R * 0.14, R * 0.06);
      g.fillStyle = shirt; ell(g, -R * 0.06, R * 0.12, R * 0.78, R * 0.64);
      g.fillStyle = skin; ell(g, R * 0.34, R * 0.36, R * 0.38, R * 0.32);
      g.fillStyle = skinD; circ(g, R * 0.48, R * 0.4, R * 0.05);
      g.fillStyle = shirtD; ell(g, -R * 0.12, R * 0.08, R * 0.2, R * 0.3);
      g.fillStyle = skin; circ(g, -R * 0.04 - leg * 0.6, R * 0.36, R * 0.11);
      var hx = R * 0.2, hy = -R * 0.5, hr = R * 0.42;
      g.fillStyle = skin; circ(g, hx, hy, hr);
      g.strokeStyle = hair; g.lineWidth = hr * 0.32; g.beginPath(); g.arc(hx, hy, hr * 0.84, Math.PI * 0.95, Math.PI * 1.72); g.stroke();
      var m = 0.12 + mouth * 0.55;
      g.fillStyle = '#8a1c2b'; g.beginPath(); g.moveTo(hx + hr * 0.15, hy + hr * 0.3); g.arc(hx + hr * 0.15, hy + hr * 0.3, hr * 0.78, -m * 0.5, m); g.closePath(); g.fill();
      g.fillStyle = '#1b1b1b'; circ(g, hx + hr * 0.38, hy - hr * 0.28, hr * 0.12);
      g.fillStyle = 'rgba(255,90,90,.45)'; circ(g, hx + hr * 0.05, hy + hr * 0.12, hr * 0.2);
      g.fillStyle = skinD; circ(g, hx + hr * 0.86, hy, hr * 0.17);
    } else {
      var l2 = leg * 0.8;
      g.fillStyle = pants; rr(g, -R * 0.38, R * 0.42 + l2, R * 0.3, R * 0.44, R * 0.08); rr(g, R * 0.08, R * 0.42 - l2, R * 0.3, R * 0.44, R * 0.08);
      g.fillStyle = shirtD; ell(g, -R * 0.78, R * 0.1, R * 0.17, R * 0.3); ell(g, R * 0.78, R * 0.1, R * 0.17, R * 0.3);
      g.fillStyle = skin; circ(g, -R * 0.82, R * 0.38, R * 0.11); circ(g, R * 0.82, R * 0.38, R * 0.11);
      g.fillStyle = shirt; ell(g, 0, R * 0.12, R * 0.8, R * 0.64);
      var fy = -R * 0.5, fr = R * 0.42;
      if (fdy > 0) {
        g.fillStyle = skin; ell(g, 0, R * 0.34, R * 0.42, R * 0.32);
        g.fillStyle = skinD; circ(g, 0, R * 0.4, R * 0.05);
        g.fillStyle = skin; circ(g, 0, fy, fr);
        g.strokeStyle = hair; g.lineWidth = fr * 0.3; g.beginPath(); g.arc(0, fy, fr * 0.86, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
        g.fillStyle = '#1b1b1b'; circ(g, -fr * 0.35, fy - fr * 0.18, fr * 0.11); circ(g, fr * 0.35, fy - fr * 0.18, fr * 0.11);
        g.fillStyle = 'rgba(255,90,90,.45)'; circ(g, -fr * 0.55, fy + fr * 0.15, fr * 0.17); circ(g, fr * 0.55, fy + fr * 0.15, fr * 0.17);
        g.fillStyle = '#8a1c2b'; ell(g, 0, fy + fr * 0.4, fr * 0.34, fr * (0.07 + 0.3 * mouth));
      } else {
        g.fillStyle = skin; circ(g, -fr * 0.95, fy, fr * 0.18); circ(g, fr * 0.95, fy, fr * 0.18); circ(g, 0, fy, fr);
        g.fillStyle = hair; g.beginPath(); g.arc(0, fy, fr, Math.PI * 0.85, Math.PI * 2.15); g.closePath(); g.fill();
      }
    }
    g.restore();
  }

  // Doctor: look = normal | scared | flash | eaten
  function drawDoctor(g, x, y, col, ldx, ldy, look, tm) {
    var R = T * 0.54;
    g.save(); g.translate(x, y);
    if (look === 'eaten') {
      g.fillStyle = '#ffffff'; circ(g, 0, 0, R * 0.48);
      g.fillStyle = '#e8233a'; g.fillRect(-R * 0.12, -R * 0.34, R * 0.24, R * 0.68); g.fillRect(-R * 0.34, -R * 0.12, R * 0.68, R * 0.24);
      g.restore(); return;
    }
    var normal = look === 'normal';
    var coat = look === 'scared' ? '#7ea6ff' : '#f4f7ff';
    var face = normal ? '#f2c29b' : '#b7e07a';
    var accent = normal ? col : (look === 'flash' ? '#e8233a' : '#3d55a8');
    var legY = Math.sin(tm * 16) * R * 0.1;
    g.fillStyle = 'rgba(0,0,0,.22)'; ell(g, 0, R * 0.92, R * 0.66, R * 0.12);
    g.fillStyle = '#3a3f55'; rr(g, -R * 0.32, R * 0.5 + legY, R * 0.24, R * 0.4, R * 0.06); rr(g, R * 0.08, R * 0.5 - legY, R * 0.24, R * 0.4, R * 0.06);
    g.fillStyle = coat; g.strokeStyle = '#8b93b3'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(-R * 0.48, -R * 0.14); g.quadraticCurveTo(-R * 0.72, -R * 0.1, -R * 0.74, R * 0.15);
    g.lineTo(-R * 0.8, R * 0.7); g.lineTo(R * 0.8, R * 0.7); g.lineTo(R * 0.74, R * 0.15);
    g.quadraticCurveTo(R * 0.72, -R * 0.1, R * 0.48, -R * 0.14); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = accent; g.beginPath(); g.moveTo(-R * 0.26, -R * 0.14); g.lineTo(R * 0.26, -R * 0.14); g.lineTo(0, R * 0.3); g.closePath(); g.fill();
    g.strokeStyle = '#b7bed6'; g.beginPath(); g.moveTo(0, R * 0.3); g.lineTo(0, R * 0.7); g.stroke();
    g.strokeStyle = '#4a4f63'; g.lineWidth = R * 0.08; g.beginPath(); g.moveTo(-R * 0.3, -R * 0.12); g.quadraticCurveTo(-R * 0.4, R * 0.38, -R * 0.12, R * 0.42); g.stroke();
    g.fillStyle = '#c9ced9'; circ(g, -R * 0.1, R * 0.44, R * 0.1);
    g.fillStyle = accent; g.fillRect(R * 0.32, R * 0.12, R * 0.05, R * 0.18);
    g.fillStyle = face; circ(g, 0, -R * 0.5, R * 0.4);
    g.fillStyle = accent; g.beginPath(); g.arc(0, -R * 0.6, R * 0.42, Math.PI, 0); g.closePath(); g.fill();
    g.fillStyle = '#e6eaf2'; circ(g, 0, -R * 0.74, R * 0.15); g.fillStyle = '#9aa3c0'; circ(g, 0, -R * 0.74, R * 0.06);
    if (normal) {
      g.fillStyle = '#ffffff'; circ(g, -R * 0.15, -R * 0.44, R * 0.11); circ(g, R * 0.15, -R * 0.44, R * 0.11);
      g.fillStyle = '#1b1b1b'; circ(g, -R * 0.15 + ldx * R * 0.05, -R * 0.44 + ldy * R * 0.05, R * 0.06); circ(g, R * 0.15 + ldx * R * 0.05, -R * 0.44 + ldy * R * 0.05, R * 0.06);
      g.strokeStyle = '#1b1b1b'; g.lineWidth = R * 0.06; g.beginPath();
      g.moveTo(-R * 0.28, -R * 0.6); g.lineTo(-R * 0.06, -R * 0.54); g.moveTo(R * 0.28, -R * 0.6); g.lineTo(R * 0.06, -R * 0.54); g.stroke();
    } else {
      g.fillStyle = '#1b1b1b'; circ(g, -R * 0.15, -R * 0.46, R * 0.06); circ(g, R * 0.15, -R * 0.46, R * 0.06);
      g.strokeStyle = '#1b1b1b'; g.lineWidth = R * 0.05; g.beginPath(); g.moveTo(-R * 0.2, -R * 0.3);
      for (var k = 1; k <= 4; k++) g.lineTo(-R * 0.2 + k * R * 0.1, -R * 0.3 + (k % 2 ? -1 : 1) * R * 0.05);
      g.stroke();
      g.fillStyle = '#7ad0ff'; g.beginPath(); g.moveTo(R * 0.4, -R * 0.72); g.quadraticCurveTo(R * 0.5, -R * 0.55, R * 0.4, -R * 0.52); g.quadraticCurveTo(R * 0.3, -R * 0.55, R * 0.4, -R * 0.72); g.fill();
    }
    g.restore();
  }

  /* ================= DOM ================= */
  var cv = $('cv'), ctx = cv.getContext('2d'), stage = $('stage');
  var mazeCv = document.createElement('canvas'), mazeFlashCv = document.createElement('canvas'), burgerCv = document.createElement('canvas');
  var K = 1;

  /* ================= Game state ================= */
  var grid, PSTART, levelIdx = 0, score = 0, lives = 3, best = parseInt(store('fatman-best') || '0', 10) || 0, extraGiven = false;
  var left = 0, eatenCount = 0, pl, docs = [], playT = 0, modeIdx = 0, modeT = 0, frT = 0, combo = 0, bonus = null, popups = [];
  var state = 'title', stateT = 0, paused = false, anim = 0, endInfo = null, cheatMsgKey = '';

  function LV() { return LEVELS[levelIdx]; }
  function cell(c, r) { if (r < 0 || r >= H) return '#'; c = ((c % W) + W) % W; return grid[r][c]; }
  function walkP(c, r) { var ch = cell(c, r); return ch === '.' || ch === 'o' || ch === ' '; }
  var walkD = walkP; // doctors use the same paths; the door is handled by the house logic
  function wrapE(e) { if (e.c < 0) e.c += W; else if (e.c >= W) e.c -= W; }
  function ex(e) { return e.c + e.dx * e.p; }
  function ey(e) { return e.r + e.dy * e.p; }
  function dist2(a, b, c, d) { var x = a - c, y = b - d; return x * x + y * y; }
  function wdist(ax, ay, bx, by) { var x = Math.abs(ax - bx); if (x > W / 2) x = W - x; return Math.hypot(x, ay - by); }

  function loadMaze(n) {
    grid = MAZES[n].map(function (row) { return row.split(''); });
    left = 0; eatenCount = 0;
    for (var r = 0; r < H; r++) for (var c = 0; c < W; c++) {
      var ch = grid[r][c];
      if (ch === 'P') { PSTART = { c: c, r: r }; grid[r][c] = ' '; }
      if (ch === '.' || ch === 'o') left++;
    }
  }

  function resetActors() {
    pl = { c: PSTART.c, r: PSTART.r, dx: 0, dy: 0, p: 0, q: [-1, 0], fdx: -1, fdy: 0, walk: 0 };
    var hx = [9, 8, 10];
    docs = DOC_COLORS.map(function (col, i) {
      if (i === 0) return { i: 0, col: col, mode: 'active', c: EXIT.c, r: EXIT.r, dx: -1, dy: 0, p: 0, x: EXIT.c, y: EXIT.r, fr: false, rel: 0, ldx: -1, ldy: 0 };
      return { i: i, col: col, mode: 'house', c: 0, r: 0, dx: 0, dy: 0, p: 0, x: hx[i - 1], y: HOUSE_Y, fr: false, rel: LV().rel[i], ldx: 0, ldy: 1, bob: i };
    });
    playT = 0; modeIdx = 0; modeT = 0; frT = 0; combo = 0; bonus = null;
    Snd.alarm(false);
  }

  function setState(s) { state = s; stateT = 0; }

  function newGame(lvl) {
    score = 0; lives = 3; extraGiven = false; popups = [];
    hideOv(); startLevel(lvl);
  }

  function startLevel(n) {
    levelIdx = n; loadMaze(n); resetActors(); buildMaze(); hud();
    setState('intro');
    Snd.stop(); Snd.setLevel(LV().bpm, LV().key); Snd.start();
  }

  function introDur() { return levelIdx > 0 ? 4.5 : 1.8; }

  /* ---------- Movement ---------- */
  function adv(e, sp, dt, onTile) {
    if (!(e.dx || e.dy)) { onTile(e); if (!(e.dx || e.dy)) return; }
    e.p += sp * dt;
    while (e.p >= 1) {
      e.c += e.dx; e.r += e.dy; e.p -= 1; wrapE(e);
      onTile(e);
      if (!(e.dx || e.dy)) { e.p = 0; break; }
    }
  }

  function pTile(e) {
    var ch = grid[e.r][e.c];
    if (ch === '.' || ch === 'o') {
      grid[e.r][e.c] = ' '; left--; eatenCount++;
      if (ch === '.') { addScore(10); Snd.chomp(); } else { addScore(50); startFright(); }
      if (eatenCount === 70 || eatenCount === 140) bonus = { t: 9.5 };
      if (!left) { e.dx = e.dy = 0; levelClear(); return; }
    }
    var q = e.q;
    if (q && walkP(e.c + q[0], e.r + q[1])) { e.dx = q[0]; e.dy = q[1]; }
    if ((e.dx || e.dy) && !walkP(e.c + e.dx, e.r + e.dy)) { e.dx = 0; e.dy = 0; }
    if (e.dx || e.dy) { e.fdx = e.dx; e.fdy = e.dy; }
  }

  function playerTile() { return { c: pl.c + (pl.p > 0.5 ? pl.dx : 0), r: pl.r + (pl.p > 0.5 ? pl.dy : 0) }; }

  function target(d) {
    if (d.mode === 'eaten') return EXIT;
    var scatter = modeIdx % 2 === 0;
    var corners = [{ c: W - 2, r: -3 }, { c: 1, r: -3 }, { c: W - 1, r: H + 1 }, { c: 0, r: H + 1 }];
    if (scatter) return corners[d.i];
    var p = playerTile(), fx = pl.fdx, fy = pl.fdy;
    if (d.i === 0) return p;
    if (d.i === 1) return { c: p.c + fx * 4, r: p.r + fy * 4 };
    if (d.i === 2) { var a = docs[0], ax = Math.round(ex(a)), ay = Math.round(ey(a)), mx = p.c + fx * 2, my = p.r + fy * 2; return { c: 2 * mx - ax, r: 2 * my - ay }; }
    return dist2(d.c, d.r, p.c, p.r) > 64 ? p : corners[3];
  }

  function dTile(d) {
    if (d.mode === 'eaten' && d.c === EXIT.c && d.r === EXIT.r) { d.mode = 'enter'; d.x = EXIT.c; d.y = EXIT.r; d.dx = d.dy = 0; d.p = 0; return; }
    var opts = DIRS.filter(function (o) { return walkD(d.c + o[0], d.r + o[1]) && !(o[0] === -d.dx && o[1] === -d.dy && (d.dx || d.dy)); });
    if (!opts.length) opts = [[-d.dx, -d.dy]];
    var pick;
    if (d.fr && d.mode === 'active') pick = opts[(Math.random() * opts.length) | 0];
    else {
      var tg = target(d), bestD = Infinity;
      opts.forEach(function (o) { var v = dist2(d.c + o[0], d.r + o[1], tg.c, tg.r); if (v < bestD) { bestD = v; pick = o; } });
    }
    d.dx = pick[0]; d.dy = pick[1]; d.ldx = d.dx; d.ldy = d.dy;
  }

  function reverse(e) {
    if (!(e.dx || e.dy)) return;
    e.c += e.dx; e.r += e.dy; wrapE(e); e.p = 1 - e.p; e.dx = -e.dx; e.dy = -e.dy;
    e.ldx = e.dx; e.ldy = e.dy;
  }

  function moveDoc(d, h, L) {
    if (d.mode === 'house') { d.bob += h; if (playT >= d.rel) d.mode = 'leave'; return; }
    if (d.mode === 'leave') {
      var sp = 3 * h;
      if (Math.abs(d.x - EXIT.c) > 0.01) { d.x += Math.max(-sp, Math.min(sp, EXIT.c - d.x)); d.ldx = Math.sign(EXIT.c - d.x); d.ldy = 0; }
      else {
        d.x = EXIT.c; d.y -= sp; d.ldx = 0; d.ldy = -1;
        if (d.y <= EXIT.r) { d.y = EXIT.r; d.mode = 'active'; d.c = EXIT.c; d.r = EXIT.r; d.p = 0; d.dx = Math.random() < 0.5 ? -1 : 1; d.dy = 0; d.ldx = d.dx; d.ldy = 0; }
      }
      return;
    }
    if (d.mode === 'enter') { d.y += 7 * h; if (d.y >= HOUSE_Y) { d.y = HOUSE_Y; d.mode = 'leave'; d.fr = false; } return; }
    var tunnel = d.r === TUNNEL_ROW && (d.c < 4 || d.c > W - 5);
    var spd = d.mode === 'eaten' ? 13 : d.fr ? L.frS : tunnel ? L.tun : L.dS * (d.i === 0 && left <= 20 ? 1.1 : 1);
    adv(d, spd, h, dTile);
  }

  function startFright() {
    frT = LV().fright; combo = 0;
    docs.forEach(function (d) { if (d.mode !== 'eaten' && d.mode !== 'enter') { d.fr = true; if (d.mode === 'active') reverse(d); } });
    Snd.donut(); Snd.alarm(true);
  }

  function addScore(n) {
    score += n;
    if (!extraGiven && score >= 10000) {
      extraGiven = true; lives++; Snd.extra();
      popups.push({ x: ex(pl), y: ey(pl) - 1, txt: t('extra'), t: 0, col: C.neon2 });
    }
    if (score > best) { best = score; store('fatman-best', String(best)); }
    hud();
  }

  function tick(h) {
    var L = LV();
    playT += h;
    if (frT > 0) {
      frT -= h;
      if (frT <= 0) { frT = 0; docs.forEach(function (d) { d.fr = false; }); Snd.alarm(false); }
    } else {
      modeT += h;
      if (modeT >= MODES[modeIdx]) { modeT = 0; modeIdx++; docs.forEach(function (d) { if (d.mode === 'active') reverse(d); }); }
    }
    if (bonus && (bonus.t -= h) <= 0) bonus = null;

    adv(pl, L.pS, h, pTile);
    if (state !== 'play') return;
    if (pl.dx || pl.dy) pl.walk += h;

    docs.forEach(function (d) { moveDoc(d, h, L); });

    var px = ex(pl), py = ey(pl);
    if (bonus && wdist(px, py, BONUS.c, BONUS.r) < 0.6) {
      addScore(L.bp); Snd.bonus();
      popups.push({ x: BONUS.c, y: BONUS.r, txt: String(L.bp), t: 0, col: C.neon1 });
      bonus = null;
    }
    for (var i = 0; i < docs.length; i++) {
      var d = docs[i];
      if (d.mode !== 'active') continue;
      if (wdist(ex(d), ey(d), px, py) < 0.62) {
        if (d.fr) {
          combo++; var pts = 200 * Math.pow(2, Math.min(combo, 4) - 1);
          addScore(pts); Snd.eatDoc();
          popups.push({ x: ex(d), y: ey(d), txt: String(pts), t: 0, col: C.neon1 });
          d.mode = 'eaten'; d.fr = false;
          setState('freeze');
          return;
        }
        die(); return;
      }
    }
  }

  function die() { setState('dying'); Snd.stop(); Snd.alarm(false); Snd.death(); }

  function afterDeath() {
    lives--; hud();
    if (lives <= 0) return endGame(false);
    resetActors(); setState('ready'); Snd.start();
  }

  function levelClear() { setState('clear'); Snd.stop(); Snd.alarm(false); Snd.clear(); bonus = null; }

  function nextLevel() {
    if (levelIdx >= LEVELS.length - 1) return endGame(true);
    startLevel(levelIdx + 1);
  }

  function endGame(won) {
    setState(won ? 'won' : 'over'); Snd.stop(); Snd.alarm(false);
    if (won) Snd.win(); else Snd.over();
    endInfo = { won: won, score: score, best: score >= best && score > 0 };
    renderEnd(); showOv('ov-end'); updateButtons();
  }

  function update(dt) {
    anim += dt; stateT += dt;
    popups = popups.filter(function (p) { p.t += dt; p.y -= dt * 0.8; return p.t < 1.1; });
    switch (state) {
      case 'intro': if (stateT > introDur()) setState('ready'); break;
      case 'ready': if (stateT > 1.4) setState('play'); break;
      case 'play':
        var n = Math.ceil(dt / (1 / 120)), h = dt / n;
        for (var k = 0; k < n && state === 'play'; k++) tick(h);
        break;
      case 'freeze': if (stateT > 0.5) state = 'play'; break;
      case 'dying': if (stateT > 1.8) afterDeath(); break;
      case 'clear': if (stateT > 2.4) nextLevel(); break;
    }
  }

  /* ================= Rendering ================= */
  function resize() {
    var w = cv.clientWidth; if (!w) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    var pw = Math.round(w * dpr), ph = Math.round(w * dpr * H / W);
    if (pw === cv.width && ph === cv.height && burgerCv.width) return;
    cv.width = pw; cv.height = ph; K = pw / PW;
    buildCaches();
  }

  function buildCaches() {
    if (!grid) return;
    buildMaze();
    var s = Math.ceil(T * K);
    burgerCv.width = burgerCv.height = s;
    var g = burgerCv.getContext('2d');
    g.setTransform(s / T, 0, 0, s / T, 0, 0); g.clearRect(0, 0, T, T);
    drawBurger(g, T / 2, T / 2, T * 0.44);
  }

  function isWall(c, r) { return c >= 0 && c < W && r >= 0 && r < H && grid[r][c] === '#'; }

  function paintMaze(cvs, stroke) {
    cvs.width = cv.width; cvs.height = cv.height;
    var g = cvs.getContext('2d'), I = 3;
    g.setTransform(K, 0, 0, K, 0, 0);
    g.fillStyle = C.card;
    for (var r = 0; r < H; r++) for (var c = 0; c < W; c++) if (isWall(c, r)) g.fillRect(c * T - 0.3, r * T - 0.3, T + 0.6, T + 0.6);
    g.strokeStyle = stroke; g.lineWidth = 2; g.lineCap = 'round'; g.lineJoin = 'round';
    g.shadowColor = stroke; g.shadowBlur = C.light ? 0 : 6 * K;
    g.beginPath();
    for (r = 0; r < H; r++) for (c = 0; c < W; c++) {
      if (!isWall(c, r)) continue;
      var x = c * T, y = r * T, wl = isWall(c - 1, r), wr = isWall(c + 1, r), wu = isWall(c, r - 1), wd = isWall(c, r + 1);
      var inGrid = function (cc, rr2) { return cc >= 0 && cc < W && rr2 >= 0 && rr2 < H; };
      if (!wu && inGrid(c, r - 1)) { g.moveTo(wl ? x : x + I, y + I); g.lineTo(wr ? x + T : x + T - I, y + I); }
      if (!wd && inGrid(c, r + 1)) { g.moveTo(wl ? x : x + I, y + T - I); g.lineTo(wr ? x + T : x + T - I, y + T - I); }
      if (!wl && inGrid(c - 1, r)) { g.moveTo(x + I, wu ? y : y + I); g.lineTo(x + I, wd ? y + T : y + T - I); }
      if (!wr && inGrid(c + 1, r)) { g.moveTo(x + T - I, wu ? y : y + I); g.lineTo(x + T - I, wd ? y + T : y + T - I); }
      // inner corners
      if (wr && wd && !isWall(c + 1, r + 1)) { g.moveTo(x + T, y + T - I); g.lineTo(x + T - I, y + T - I); g.lineTo(x + T - I, y + T); }
      if (wl && wd && !isWall(c - 1, r + 1)) { g.moveTo(x, y + T - I); g.lineTo(x + I, y + T - I); g.lineTo(x + I, y + T); }
      if (wr && wu && !isWall(c + 1, r - 1)) { g.moveTo(x + T, y + I); g.lineTo(x + T - I, y + I); g.lineTo(x + T - I, y); }
      if (wl && wu && !isWall(c - 1, r - 1)) { g.moveTo(x, y + I); g.lineTo(x + I, y + I); g.lineTo(x + I, y); }
    }
    g.stroke();
    g.shadowBlur = 0;
    for (r = 0; r < H; r++) for (c = 0; c < W; c++) if (grid[r][c] === '-') {
      g.fillStyle = C.neon2; g.fillRect(c * T, r * T + T / 2 - 2, T, 4);
    }
    // little red cross on the "clinic" (doctor house)
    g.fillStyle = 'rgba(232,35,58,.35)';
    g.fillRect(9 * T + T * 0.38, HOUSE_Y * T + T * 0.1, T * 0.24, T * 0.8); g.fillRect(8 * T + T * 0.6, HOUSE_Y * T + T * 0.38, T * 1.8, T * 0.24);
  }

  function buildMaze() {
    if (!grid || !cv.width) return;
    var acc = (C.light ? ACC_LIGHT : ACC_DARK)[levelIdx];
    paintMaze(mazeCv, acc);
    paintMaze(mazeFlashCv, C.light ? '#1b2033' : '#ffffff');
  }

  function text(s, x, y, size, col, glow, align) {
    ctx.font = size + 'px ' + FONT; ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
    if (glow && !C.light) { ctx.shadowColor = col; ctx.shadowBlur = 10 * K; }
    ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.shadowBlur = 0;
  }

  function docLook(d) {
    if (d.mode === 'eaten' || d.mode === 'enter') return 'eaten';
    if (!d.fr) return 'normal';
    return frT < 2 && Math.floor(frT * 5) % 2 === 0 ? 'flash' : 'scared';
  }

  function drawWrapped(fn, x) {
    fn(x);
    if (x > PW - T) fn(x - PW);
    else if (x < T) fn(x + PW);
  }

  function draw() {
    if (!grid || !cv.width) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, cv.width, cv.height);
    var flash = state === 'clear' && stateT > 0.4 && Math.floor(stateT * 4) % 2 === 0;
    ctx.drawImage(flash ? mazeFlashCv : mazeCv, 0, 0);
    ctx.setTransform(K, 0, 0, K, 0, 0);

    var pulse = 1 + 0.12 * Math.sin(anim * 6);
    for (var r = 0; r < H; r++) for (var c = 0; c < W; c++) {
      var ch = grid[r][c];
      if (ch === '.') ctx.drawImage(burgerCv, c * T, r * T, T, T);
      else if (ch === 'o') drawDonut(ctx, c * T + T / 2, r * T + T / 2, T * 0.36 * pulse, C.bg);
    }
    if (bonus && (bonus.t > 2 || Math.floor(bonus.t * 6) % 2 === 0)) drawBonus(ctx, LV().bonus, BONUS.c * T + T / 2, BONUS.r * T + T / 2, T * 0.95);

    var running = state === 'play' || state === 'freeze';
    if (state !== 'dying' && state !== 'clear') {
      docs.forEach(function (d) {
        var x, y;
        if (d.mode === 'house' || d.mode === 'leave' || d.mode === 'enter') { x = d.x; y = d.y + (d.mode === 'house' ? Math.sin(d.bob * 5) * 0.15 : 0); }
        else { x = ex(d); y = ey(d); }
        var look = docLook(d);
        drawWrapped(function (xx) { drawDoctor(ctx, xx, (y + 0.5) * T, d.col, d.ldx, d.ldy, look, running ? anim : 0); }, (x + 0.5) * T);
      });
    }
    var mouth = running && (pl.dx || pl.dy) ? Math.abs(Math.sin(anim * 14)) : 0.35;
    if (state === 'dying') {
      var k = Math.min(stateT / 1.4, 1);
      drawFatMan(ctx, (ex(pl) + 0.5) * T, (ey(pl) + 0.5) * T, pl.fdx, pl.fdy, 1, 0, Math.max(1 - k, 0.01), k * Math.PI * 4);
      if (stateT > 0.3) for (var s = 0; s < 5; s++) {
        var a = anim * 3 + s * 1.256, rad = T * (0.4 + k * 0.6);
        text('✦', (ex(pl) + 0.5) * T + Math.cos(a) * rad, (ey(pl) + 0.5) * T + Math.sin(a) * rad * 0.5 - T * 0.4, 10, '#ffd23f', true);
      }
    } else {
      drawWrapped(function (xx) { drawFatMan(ctx, xx, (ey(pl) + 0.5) * T, pl.fdx, pl.fdy, mouth, pl.walk); }, (ex(pl) + 0.5) * T);
    }

    popups.forEach(function (p) {
      ctx.globalAlpha = Math.max(0, 1 - p.t / 1.1);
      text(p.txt, (p.x + 0.5) * T, (p.y + 0.5) * T, 13, p.col, true);
      ctx.globalAlpha = 1;
    });

    if (state === 'ready') text(t('ready'), PW / 2, (BONUS.r + 0.5) * T, 20, C.neon2, true);
    if (state === 'intro') drawIntro();
  }

  function drawIntro() {
    var L = LV(), hasCode = !!L.code;
    var bw = PW * 0.86, bh = hasCode ? T * 7.4 : T * 3.4, bx = (PW - bw) / 2, by = (PH - bh) / 2;
    ctx.globalAlpha = 0.93; ctx.fillStyle = C.card; rr(ctx, bx, by, bw, bh, 12); ctx.globalAlpha = 1;
    ctx.strokeStyle = C.neon1; ctx.lineWidth = 1.5; rrPath(ctx, bx, by, bw, bh, 12); ctx.stroke();
    var y = by + T * 1.3;
    text(t('lvl', { n: levelIdx + 1 }), PW / 2, y, 34, C.neon2, true);
    if (hasCode) {
      text(t('codeFor'), PW / 2, y + T * 1.7, 14, C.text, false);
      text(L.code, PW / 2, y + T * 3.0, 32, C.neon1, true);
      text(t('codeHint'), PW / 2, y + T * 4.2, 12, C.muted, false);
    }
    if (stateT > 1) text(t('skip'), PW / 2, by + bh - T * 0.6, 11, C.muted, false);
  }

  /* ================= Main loop ================= */
  var last = performance.now();
  function loop(ts) {
    var dt = Math.min((ts - last) / 1000, 0.05); last = ts;
    if (!paused && state !== 'title' && state !== 'over' && state !== 'won') update(dt);
    else if (!paused) anim += dt;
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
    if (endInfo.best) s += ' – ' + t('newBest');
    $('end-text').textContent = s;
  }

  function running() { return ['intro', 'ready', 'play', 'freeze', 'dying', 'clear'].indexOf(state) >= 0; }

  function setPaused(p) {
    if (!running() || paused === p) return;
    paused = p;
    if (p) { Snd.stop(); showOv('ov-pause'); }
    else { hideOv(); last = performance.now(); if (state !== 'dying' && state !== 'clear') Snd.start(); }
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
    Snd.unlock(); paused = false; newGame(lvl); updateButtons();
  }

  function toTitle() {
    Snd.stop(); Snd.alarm(false); paused = false;
    levelIdx = 0; loadMaze(0); resetActors(); buildMaze(); score = 0; lives = 3; hud();
    setState('title'); showOv('ov-title'); updateButtons();
  }

  function dir(x, y) {
    if (paused) return;
    if (state === 'intro' && stateT > 1) setState('ready');
    if (['intro', 'ready', 'play', 'freeze'].indexOf(state) < 0) return;
    pl.q = [x, y];
    if (state === 'intro' || state === 'ready') { if (walkP(pl.c + x, pl.r + y)) { pl.fdx = x; pl.fdy = y; } return; }
    if ((pl.dx || pl.dy) && pl.dx === -x && pl.dy === -y) { reverse(pl); pl.fdx = x; pl.fdy = y; }
    else if ((pl.dx || pl.dy) && pl.p < 0.3 && (x !== pl.dx || y !== pl.dy) && walkP(pl.c + x, pl.r + y)) {
      pl.dx = x; pl.dy = y; pl.p = 0; pl.fdx = x; pl.fdy = y;
    }
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
    var on = isFs();
    stage.classList.toggle('is-fs', on);
    document.body.classList.toggle('noscroll', pseudoFs);
    updateButtons();
    setTimeout(resize, 60);
  }
  function toggleFs() {
    if (isFs()) {
      if (fsEl()) { var ex2 = document.exitFullscreen || document.webkitExitFullscreen; if (ex2) ex2.call(document); }
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
  $('lang').addEventListener('click', function () {
    lang = lang === 'en' ? 'de' : 'en'; store('lang', lang); applyLang();
  });

  /* ---------- Theme (same behavior as the main site) ---------- */
  var modeBtn = $('mode');
  function setTheme(light) {
    root.setAttribute('data-theme', light ? 'light' : 'dark');
    modeBtn.textContent = light ? t('dark') : t('light');
    store('theme', light ? 'light' : 'dark');
    readTheme(); buildCaches(); drawIcons();
  }
  modeBtn.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') !== 'light'); });

  /* ---------- Legend icons ---------- */
  function drawIcons() {
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    document.querySelectorAll('canvas.ico').forEach(function (c) {
      c.width = c.height = Math.round(40 * dpr);
      var g = c.getContext('2d'), s = c.width / (T * 1.3), m = T * 0.65;
      g.setTransform(s, 0, 0, s, 0, 0); g.clearRect(0, 0, T * 2, T * 2);
      switch (c.getAttribute('data-ico')) {
        case 'player': drawFatMan(g, m, m, 1, 0, 0.6, 0); break;
        case 'burger': drawBurger(g, m, m, T * 0.8); break;
        case 'donut': drawDonut(g, m, m, T * 0.45, C.card); break;
        case 'doctor': drawDoctor(g, m, m, DOC_COLORS[0], 1, 0, 'normal', 0); break;
        case 'scared': drawDoctor(g, m, m, DOC_COLORS[0], 0, 0, 'scared', 0); break;
        case 'fries': drawBonus(g, 'fries', m, m, T * 1.0); break;
      }
    });
  }

  /* ---------- Input ---------- */
  var KEYS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };
  document.addEventListener('keydown', function (ev) {
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    var inInput = ev.target && ev.target.tagName === 'INPUT';
    var k = ev.key;
    if (k === 'Enter' || (k === ' ' && !inInput)) {
      if (ev.target && ev.target.tagName === 'BUTTON') return;
      if (state === 'title' || paused || state === 'over' || state === 'won' || state === 'intro') { ev.preventDefault(); skipOrConfirm(); }
      return;
    }
    if (inInput) return;
    var m = KEYS[k];
    if (m) { if (running() || state === 'title') ev.preventDefault(); dir(m[0], m[1]); return; }
    if (k === 'p' || k === 'P') { setPaused(!paused); return; }
    if (k === 'Escape') { if (pseudoFs) toggleFs(); else setPaused(true); return; }
    if (k === 'm' || k === 'M') { Snd.setMute(!Snd.muted()); updateButtons(); return; }
    if (k === 'f' || k === 'F') { toggleFs(); }
  });

  $('pad').addEventListener('pointerdown', function (ev) {
    var b = ev.target.closest('[data-d]'); if (!b) return;
    ev.preventDefault(); Snd.unlock();
    var d = b.getAttribute('data-d').split(',');
    dir(+d[0], +d[1]);
  });
  $('pad').addEventListener('contextmenu', function (ev) { ev.preventDefault(); });

  var sx = 0, sy = 0, swiped = false;
  cv.addEventListener('touchstart', function (ev) { sx = ev.touches[0].clientX; sy = ev.touches[0].clientY; swiped = false; }, { passive: true });
  cv.addEventListener('touchmove', function (ev) {
    ev.preventDefault();
    var dx = ev.touches[0].clientX - sx, dy = ev.touches[0].clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) dir(dx > 0 ? 1 : -1, 0); else dir(0, dy > 0 ? 1 : -1);
    sx = ev.touches[0].clientX; sy = ev.touches[0].clientY; swiped = true;
  }, { passive: false });
  cv.addEventListener('touchend', function () { if (!swiped) skipOrConfirm(); }, { passive: true });
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
  readTheme();
  loadMaze(0); resetActors();
  applyLang();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(cv);
  window.addEventListener('resize', resize);
  resize(); buildCaches(); drawIcons(); hud(); updateButtons();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawIcons);
  requestAnimationFrame(loop);
})();
