/* Orbital Defense – UI, rendering, input, i18n, fullscreen
   by Martin Sucker | github.com/DerSucker | www.martinsucker.de */
(function () {
  'use strict';
  var C = window.TDCore, T = 48, W = C.COLS * T, H = C.ROWS * T;

  /* ---------- storage ---------- */
  var LS = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- i18n ---------- */
  var I18N = {
    de: {
      title: 'Orbital Defense – Martin Sucker', home: 'Startseite', backAria: 'Startseite', subtitle: 'Sci-Fi Tower Defense im Browser',
      themeAria: 'Design wechseln', light: '☀ Lightmode', dark: '☾ Darkmode',
      boardAria: 'Spielfeld', towersAria: 'Türme',
      hudLevel: 'Level {n}/{m}', hudWave: 'Welle {n}/{m}',
      waveBtn: '▶ Welle {n}', waveRun: 'Welle läuft', pause: '❚❚ Pause', speed: 'Tempo ×{n}', fs: '⛶ Vollbild', fsExit: '⛶ Beenden',
      tn_laser: 'Laser', tn_plasma: 'Plasma', tn_cryo: 'Cryo', tn_rail: 'Railgun', tn_tesla: 'Tesla', tn_prism: 'Prisma', tn_grav: 'Gravitron',
      td_laser: 'Schnelle Einzelschüsse, günstig und zuverlässig.',
      td_plasma: 'Plasmakugeln mit Flächenschaden.',
      td_cryo: 'Kältewelle: trifft und verlangsamt alle Gegner in Reichweite.',
      td_rail: 'Riesige Reichweite, durchschlägt Panzerung, zielt auf den stärksten Gegner.',
      td_tesla: 'Kettenblitz, der auf mehrere Gegner überspringt.',
      td_prism: 'Dauerstrahl, der auf demselben Ziel bis ×3 stärker wird. Doppelter Schaden gegen Schilde.',
      td_grav: 'Gravitationsstoß: wirft Gegner auf der Route zurück und betäubt sie kurz. Stoppt Phaser-Sprünge.',
      st: 'Schaden {d} · Reichweite {r} · {f}/s', xSplash: 'Fläche {s}', xSlow: 'bremst {p} %', xChain: '{c} Ziele', xPierce: 'ignoriert Panzerung',
      stBeam: 'Schaden {d}/s · Reichweite {r}', xRamp: 'bis ×3 · ×2 gegen Schilde', xPush: '{p} Felder zurück · {t} s betäubt',
      lvl: 'Stufe {n}/3', up: '⬆ Upgrade {c} ◆', max: 'Max. Stufe', sell: 'Verkaufen +{v} ◆',
      hintIdle: 'Turm wählen und auf ein freies Feld setzen. Gebaute Türme antippen für Upgrade oder Verkauf.',
      hintBuild: 'Auf ein freies Feld tippen, um zu bauen.',
      errMoney: 'Nicht genug Credits', errBlocked: 'Hier kann nicht gebaut werden', errMax: 'Bereits maximale Stufe', errLocked: 'Ab Level 11 verfügbar',
      waveDone: 'Welle {n} geschafft: +{b} ◆', leak: 'Kern getroffen!',
      menuText: 'Verteidige den Reaktorkern in 20 Sektoren gegen sechs Gegnertypen. Baue Türme neben die Route und rüste sie zweimal auf.',
      newGame: 'Neues Spiel', codePh: 'CHEATCODE', codeAria: 'Cheatcode', loadCode: 'Code laden', codeBad: 'Unbekannter Cheatcode.',
      introTitle: 'Level {n}: {name}', introInfo: '{w} Wellen · {c} ◆ Start-Credits',
      codeInfo: 'Cheatcode für dieses Level:', codeHint: 'Im Hauptmenü eingeben, um dieses Level beim nächsten Mal direkt zu starten.',
      tip1: 'Tipp: Wähle unten einen Turm, setze ihn neben die Route und starte dann die erste Welle.',
      enemies: 'Gegner: Drohne (schnell) · Cyborg (gepanzert) · Walker (schwer gepanzert)',
      newTitle: 'Neue Bedrohung!',
      newEnemies: 'Neue Gegner: Schildträger (Energieschild lädt sich auf) · Splitter (zerfällt in 3 Drohnen) · Phaser (springt nach vorne)',
      newTowers: 'Neue Türme: Prisma (6) und Gravitron (7)',
      startLevel: 'Level starten', menu: 'Hauptmenü',
      wonTitle: 'Sektor gesichert!', wonText: 'Integrität {l}/{m} · Credits {c} ◆', next: 'Nächstes Level',
      vicTitle: 'Galaxie gerettet!', vicText: 'Alle 20 Sektoren sind sicher. Danke fürs Spielen!',
      lostTitle: 'Reaktorkern zerstört', lostText: 'Sektor {n} ist gefallen. Versuch eine andere Aufstellung.', retry: 'Level neu starten',
      pauseTitle: 'Pause', resume: 'Weiter',
      helpTouchText: 'Turm in der Leiste unter dem Spielfeld wählen und auf ein freies Feld tippen. Einen gebauten Turm antippen, um ihn aufzurüsten oder zu verkaufen. Mit „Welle“ startest du den nächsten Angriff.',
      helpTitle: 'Steuerung', helpTouch: 'Touch & Maus', helpKeys: 'Tastatur', helpCodes: 'Cheatcodes',
      helpCodesText: 'Ab Level 2 wird beim Levelstart ein Cheatcode angezeigt. Gib ihn im Hauptmenü ein, um direkt in diesem Level weiterzuspielen.',
      kTower: 'Turm wählen', kMove: 'Cursor bewegen', kPlace: 'bauen / auswählen', kUpgrade: 'Upgrade', kSell: 'Verkaufen',
      rotate: '↻ Tipp: Gerät quer halten', kSpaceKey: 'Leertaste', kWave: 'Welle starten', kPause: 'Pause', kSpeed: 'Tempo', kFs: 'Vollbild', kEsc: 'Abbrechen',
      names: ['Mondbasis', 'Asteroidengürtel', 'Marskolonie', 'Jupiter-Orbit', 'Saturnringe', 'Nebelfeld', 'Kometenschweif', 'Pulsar-Station', 'Warp-Tor', 'Ereignishorizont',
        'Kuipergürtel', 'Oortsche Wolke', 'Proxima b', 'Doppelstern', 'Supernova', 'Dunkle Materie', 'Quasar', 'Andromeda', 'Wurmloch', 'Urknall']
    },
    en: {
      title: 'Orbital Defense – Martin Sucker', home: 'Home', backAria: 'Home', subtitle: 'Sci-fi tower defense in your browser',
      themeAria: 'Switch theme', light: '☀ Light mode', dark: '☾ Dark mode',
      boardAria: 'Game board', towersAria: 'Towers',
      hudLevel: 'Level {n}/{m}', hudWave: 'Wave {n}/{m}',
      waveBtn: '▶ Wave {n}', waveRun: 'Wave running', pause: '❚❚ Pause', speed: 'Speed ×{n}', fs: '⛶ Fullscreen', fsExit: '⛶ Exit',
      tn_laser: 'Laser', tn_plasma: 'Plasma', tn_cryo: 'Cryo', tn_rail: 'Railgun', tn_tesla: 'Tesla', tn_prism: 'Prism', tn_grav: 'Gravitron',
      td_laser: 'Rapid single shots, cheap and reliable.',
      td_plasma: 'Plasma orbs with area damage.',
      td_cryo: 'Cold wave: hits and slows all enemies in range.',
      td_rail: 'Huge range, pierces armor, targets the strongest enemy.',
      td_tesla: 'Chain lightning that jumps between enemies.',
      td_prism: 'Continuous beam that grows up to ×3 stronger on the same target. Double damage against shields.',
      td_grav: 'Gravity pulse: pushes enemies back along the route and stuns them briefly. Stops phaser jumps.',
      st: 'Damage {d} · Range {r} · {f}/s', xSplash: 'area {s}', xSlow: 'slows {p}%', xChain: '{c} targets', xPierce: 'ignores armor',
      stBeam: 'Damage {d}/s · Range {r}', xRamp: 'up to ×3 · ×2 vs shields', xPush: 'pushes back {p} tiles · {t} s stun',
      lvl: 'Level {n}/3', up: '⬆ Upgrade {c} ◆', max: 'Max level', sell: 'Sell +{v} ◆',
      hintIdle: 'Pick a tower and place it on a free tile. Tap a built tower to upgrade or sell it.',
      hintBuild: 'Tap a free tile to build.',
      errMoney: 'Not enough credits', errBlocked: 'You can\'t build here', errMax: 'Already at max level', errLocked: 'Available from level 11',
      waveDone: 'Wave {n} cleared: +{b} ◆', leak: 'Core hit!',
      menuText: 'Defend the reactor core across 20 sectors against six enemy types. Build towers next to the route and upgrade them twice.',
      newGame: 'New game', codePh: 'CHEAT CODE', codeAria: 'Cheat code', loadCode: 'Load code', codeBad: 'Unknown cheat code.',
      introTitle: 'Level {n}: {name}', introInfo: '{w} waves · {c} ◆ starting credits',
      codeInfo: 'Cheat code for this level:', codeHint: 'Enter it in the main menu to jump straight to this level next time.',
      tip1: 'Tip: pick a tower below, place it next to the route, then start the first wave.',
      enemies: 'Enemies: drone (fast) · cyborg (armored) · walker (heavily armored)',
      newTitle: 'New threat!',
      newEnemies: 'New enemies: shielder (recharging energy shield) · splitter (breaks into 3 drones) · phaser (jumps ahead)',
      newTowers: 'New towers: Prism (6) and Gravitron (7)',
      startLevel: 'Start level', menu: 'Main menu',
      wonTitle: 'Sector secured!', wonText: 'Integrity {l}/{m} · Credits {c} ◆', next: 'Next level',
      vicTitle: 'Galaxy saved!', vicText: 'All 20 sectors are safe. Thanks for playing!',
      lostTitle: 'Reactor core destroyed', lostText: 'Sector {n} has fallen. Try a different setup.', retry: 'Restart level',
      pauseTitle: 'Paused', resume: 'Resume',
      helpTouchText: 'Pick a tower in the bar below the board and tap a free tile. Tap a built tower to upgrade or sell it. Press “Wave” to start the next attack.',
      helpTitle: 'Controls', helpTouch: 'Touch & mouse', helpKeys: 'Keyboard', helpCodes: 'Cheat codes',
      helpCodesText: 'From level 2 on, a cheat code is shown when a level starts. Enter it in the main menu to continue right at that level.',
      kTower: 'pick tower', kMove: 'move cursor', kPlace: 'build / select', kUpgrade: 'upgrade', kSell: 'sell',
      rotate: '↻ Tip: turn your device sideways', kSpaceKey: 'Space', kWave: 'start wave', kPause: 'pause', kSpeed: 'speed', kFs: 'fullscreen', kEsc: 'cancel',
      names: ['Lunar Base', 'Asteroid Belt', 'Mars Colony', 'Jupiter Orbit', 'Saturn Rings', 'Nebula Field', 'Comet Tail', 'Pulsar Station', 'Warp Gate', 'Event Horizon',
        'Kuiper Belt', 'Oort Cloud', 'Proxima b', 'Binary Star', 'Supernova', 'Dark Matter', 'Quasar', 'Andromeda', 'Wormhole', 'Big Bang']
    }
  };
  var lang = LS.get('lang') === 'en' ? 'en' : 'de';
  function t(k, v) {
    var s = I18N[lang][k];
    if (s == null) s = I18N.de[k];
    if (s == null) return k;
    if (v) s = s.replace(/\{(\w+)\}/g, function (m, n) { return v[n] != null ? v[n] : m; });
    return s;
  }
  function num(x, d) { return Number(x).toLocaleString(lang === 'en' ? 'en-US' : 'de-DE', { maximumFractionDigits: d == null ? 1 : d }); }

  /* ---------- DOM ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var root = document.documentElement, game = $('game'), stage = $('stage'), board = $('board'), cv = $('cv'), ctx = cv.getContext('2d');
  var ov = $('ov'), toastEl = $('toast'), infoEl = $('info'), towersEl = $('towers');
  var bWave = $('bWave'), bPause = $('bPause'), bSpeed = $('bSpeed'), bFs = $('bFs'), modeBtn = $('mode'), langBtn = $('lang');

  /* ---------- colors ---------- */
  var COL = {}, TCOL, ECOL;
  function readColors() {
    var cs = getComputedStyle(root);
    ['bg', 'card', 'line', 'text', 'muted', 'neon1', 'neon2'].forEach(function (k) { COL[k] = cs.getPropertyValue('--' + k).trim(); });
    var light = root.getAttribute('data-theme') === 'light';
    TCOL = light ? ['#0077c8', '#c0109d', '#3d6fd6', '#a37a00', '#7a3ad1', '#00896b', '#4a5274'] : ['#00f0ff', '#ff2bd6', '#8ab4ff', '#ffe600', '#b77bff', '#7dffd4', '#e8ecff'];
    ECOL = light ? { drone: '#1f9e3a', cyborg: '#c45f00', walker: '#c81e3f', shield: '#a67c00', splitter: '#c2457f', phaser: '#5a4fcf' }
                 : { drone: '#7cff6b', cyborg: '#ff8a00', walker: '#ff4d6d', shield: '#ffd84d', splitter: '#ff9ecf', phaser: '#c9c2ff' };
    COL.light = light;
  }

  /* ---------- state ---------- */
  var S = null, dpr = 1, scale = 1, bg = document.createElement('canvas'), bgDirty = true;
  var ui = { sel: null, hover: null, kb: { c: 7, r: 4, on: false }, speed: 1, ov: null, floats: [], infoKey: '', hudKey: '', time: 0 };

  /* ---------- sizing / fullscreen ---------- */
  function isFs() { return game.classList.contains('is-fs'); }
  function nativeFs() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function resize() {
    if (isFs()) {
      var sw = stage.clientWidth, sh = stage.clientHeight, w = Math.max(160, Math.min(sw, sh * 1.6));
      board.style.width = Math.floor(w) + 'px'; board.style.height = Math.floor(w / 1.6) + 'px';
    } else { board.style.width = ''; board.style.height = ''; }
    var r = board.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var nw = Math.max(1, Math.round(r.width * dpr)), nh = Math.max(1, Math.round(r.height * dpr));
    if (nw !== cv.width || nh !== cv.height) { cv.width = nw; cv.height = nh; bgDirty = true; }
    scale = cv.width / W;
  }
  function setFs(on) {
    game.classList.toggle('is-fs', on);
    document.body.classList.toggle('noscroll', on);
    bFs.textContent = on ? t('fsExit') : t('fs');
    requestAnimationFrame(resize);
  }
  function toggleFs() {
    if (nativeFs()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    if (isFs()) { setFs(false); return; }
    var req = game.requestFullscreen || game.webkitRequestFullscreen;
    if (!req) { setFs(true); return; }
    try {
      var p = req.call(game, { navigationUI: 'hide' });
      if (p && p.then) p.then(function () {
        try { screen.orientation.lock('landscape').catch(function () {}); } catch (e) {}
      }).catch(function () { setFs(true); });
    } catch (e) { setFs(true); }
  }
  function onFsChange() { setFs(!!nativeFs()); }
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);
  if (window.ResizeObserver) new ResizeObserver(function () { resize(); }).observe(stage);
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', function () { setTimeout(resize, 250); });

  /* ---------- background cache ---------- */
  function rand(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function drawBg() {
    bg.width = cv.width; bg.height = cv.height;
    var g = bg.getContext('2d');
    g.setTransform(scale, 0, 0, scale, 0, 0);
    g.fillStyle = COL.bg; g.fillRect(0, 0, W, H);
    // stars
    var R = rand(1234 + (S ? S.li * 97 : 0));
    for (var i = 0; i < 110; i++) {
      g.globalAlpha = 0.15 + R() * (COL.light ? 0.35 : 0.6);
      g.fillStyle = R() < 0.15 ? COL.neon1 : (R() < 0.1 ? COL.neon2 : COL.muted);
      var sz = R() < 0.9 ? 1 : 2;
      g.fillRect(R() * W, R() * H, sz, sz);
    }
    g.globalAlpha = 1;
    // planet decoration
    var px = 80 + R() * (W - 160), py = 60 + R() * (H - 120), pr = 40 + R() * 50;
    var grd = g.createRadialGradient(px - pr * 0.3, py - pr * 0.3, pr * 0.1, px, py, pr);
    grd.addColorStop(0, COL.light ? 'rgba(0,119,200,.10)' : 'rgba(0,240,255,.10)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(px, py, pr, 0, 7); g.fill();
    // grid dots
    g.fillStyle = COL.line;
    for (var c = 1; c < C.COLS; c++) for (var r = 1; r < C.ROWS; r++) g.fillRect(c * T - 1, r * T - 1, 2, 2);
    if (!S) return;
    // path lane
    g.lineJoin = 'round'; g.lineCap = 'butt';
    S.polys.forEach(function (p) { lane(g, p, T * 0.86, COL.line); });
    S.polys.forEach(function (p) { lane(g, p, T * 0.7, COL.card); });
    g.setLineDash([6, 10]); g.globalAlpha = 0.35;
    S.polys.forEach(function (p) { lane(g, p, 2, COL.neon1); });
    g.setLineDash([]); g.globalAlpha = 1;
    bgDirty = false;
  }
  function lane(g, p, w, col) {
    g.strokeStyle = col; g.lineWidth = w; g.beginPath();
    p.pts.forEach(function (pt, i) { if (i) g.lineTo(pt.x * T, pt.y * T); else g.moveTo(pt.x * T, pt.y * T); });
    g.stroke();
  }

  /* ---------- drawing helpers ---------- */
  function poly(g, x, y, r, n, rot) {
    g.beginPath();
    for (var i = 0; i < n; i++) { var a = rot + i * 2 * Math.PI / n; g[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); }
    g.closePath();
  }
  function rrect(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  function drawTower(g, type, x, y, lv, ang, time, size) {
    var s = size || T, col = TCOL[type], id = C.TOWERS[type].id;
    g.save();
    g.translate(x, y);
    rrect(g, -s * 0.4, -s * 0.4, s * 0.8, s * 0.8, s * 0.14);
    g.fillStyle = COL.card; g.fill(); g.lineWidth = Math.max(1, s / 24); g.strokeStyle = col; g.stroke();
    g.shadowColor = col; g.shadowBlur = COL.light ? 0 : s / 5;
    g.fillStyle = col; g.strokeStyle = col;
    if (id === 'laser') {
      g.rotate(ang); g.lineWidth = s * 0.1; g.beginPath(); g.moveTo(0, 0); g.lineTo(s * 0.36, 0); g.stroke();
      g.beginPath(); g.arc(0, 0, s * 0.14, 0, 7); g.fill();
    } else if (id === 'plasma') {
      g.beginPath(); g.arc(0, 0, s * 0.2 + Math.sin(time * 4) * s * 0.02, 0, 7); g.fill();
      g.lineWidth = s * 0.05; g.beginPath(); g.arc(0, 0, s * 0.3, time * 2, time * 2 + 4); g.stroke();
    } else if (id === 'cryo') {
      g.rotate(time * 0.8); g.lineWidth = s * 0.06;
      for (var i = 0; i < 6; i++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(s * 0.28, 0); g.stroke(); g.rotate(Math.PI / 3); }
      g.beginPath(); g.arc(0, 0, s * 0.08, 0, 7); g.fill();
    } else if (id === 'rail') {
      g.rotate(ang); g.lineWidth = s * 0.06;
      g.beginPath(); g.moveTo(-s * 0.1, -s * 0.09); g.lineTo(s * 0.42, -s * 0.09); g.moveTo(-s * 0.1, s * 0.09); g.lineTo(s * 0.42, s * 0.09); g.stroke();
      g.fillRect(-s * 0.18, -s * 0.14, s * 0.2, s * 0.28);
    } else if (id === 'tesla') {
      g.lineWidth = s * 0.05;
      g.beginPath(); g.arc(0, 0, s * 0.26, 0, 7); g.stroke();
      g.beginPath(); g.arc(0, 0, s * 0.16, 0, 7); g.stroke();
      g.beginPath(); g.arc(Math.cos(time * 5) * s * 0.26, Math.sin(time * 5) * s * 0.26, s * 0.06, 0, 7); g.fill();
    } else if (id === 'prism') {
      g.rotate(ang + Math.PI / 2); g.lineWidth = s * 0.06;
      poly(g, 0, 0, s * 0.27, 3, -Math.PI / 2); g.stroke();
      g.beginPath(); g.arc(0, -s * 0.02, s * 0.08, 0, 7); g.fill();
    } else if (id === 'grav') {
      g.lineWidth = s * 0.05; g.setLineDash([s * 0.1, s * 0.07]);
      g.rotate(-time * 1.5); g.beginPath(); g.arc(0, 0, s * 0.28, 0, 7); g.stroke();
      g.rotate(time * 3); g.beginPath(); g.arc(0, 0, s * 0.18, 0, 7); g.stroke(); g.setLineDash([]);
      g.beginPath(); g.arc(0, 0, s * 0.08, 0, 7); g.fill();
    }
    g.restore();
    if (lv != null) {
      g.fillStyle = col;
      for (var k = 0; k <= lv; k++) g.fillRect(x - s * 0.2 + k * s * 0.15, y + s * 0.3, s * 0.1, s * 0.06);
    }
  }
  function drawEnemy(g, e, time) {
    var col = ECOL[e.type], x = e.x * T, y = e.y * T, r = e.size * T;
    var pl = S.polys[e.path], nx = C.posAt(pl, e.d + 0.1), ang = Math.atan2(nx.y - e.y, nx.x - e.x);
    g.save();
    g.shadowColor = col; g.shadowBlur = COL.light ? 0 : 10;
    g.fillStyle = e.hit > 0 ? '#ffffff' : col; g.strokeStyle = col; g.lineWidth = 2;
    if (e.type === 'drone') {
      poly(g, x, y + Math.sin(time * 9 + e.ph) * 1.5, r, 3, ang); g.fill();
    } else if (e.type === 'cyborg') {
      poly(g, x, y, r, 4, ang + Math.PI / 4); g.fill();
      g.fillStyle = COL.bg; g.beginPath(); g.arc(x, y, r * 0.3, 0, 7); g.fill();
    } else if (e.type === 'shield') {
      g.beginPath(); g.arc(x, y, r * 0.75, 0, 7); g.fill();
      if (e.shield > 0) { g.globalAlpha = 0.35 + 0.55 * e.shield / e.maxShield; g.lineWidth = 3; g.beginPath(); g.arc(x, y, r * 1.15, 0, 7); g.stroke(); g.globalAlpha = 1; }
    } else if (e.type === 'splitter') {
      for (var q = 0; q < 3; q++) { var a = ang + q * 2.094 + time * 2; g.beginPath(); g.arc(x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.45, r * 0.5, 0, 7); g.fill(); }
    } else if (e.type === 'phaser') {
      g.globalAlpha = e.blinkT < 0.5 ? 0.35 + 0.65 * Math.abs(Math.sin(time * 30)) : 0.85;
      poly(g, x, y, r, 4, ang); g.fill(); g.globalAlpha = 1;
      g.lineWidth = 1.5; poly(g, x, y, r * 1.35, 4, ang); g.stroke();
    } else {
      poly(g, x, y, r, 6, ang); g.fill();
      g.fillStyle = COL.bg; poly(g, x, y, r * 0.5, 6, ang); g.fill();
      if (e.elite) { g.lineWidth = 2; g.beginPath(); g.arc(x, y, r * 1.3, time * 3, time * 3 + 4.5); g.stroke(); }
    }
    if (e.stunT > 0) { g.shadowBlur = 0; g.strokeStyle = TCOL[6]; g.lineWidth = 1.5; g.setLineDash([3, 3]); g.beginPath(); g.arc(x, y, r + 7, time * 6, time * 6 + 5); g.stroke(); g.setLineDash([]); }
    if (e.slowT > 0) { g.shadowBlur = 0; g.strokeStyle = TCOL[2]; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r + 4, 0, 7); g.stroke(); }
    g.restore();
    if (e.hp < e.maxHp) {
      var w = Math.max(18, r * 2), k = Math.max(0, e.hp / e.maxHp);
      g.fillStyle = COL.line; g.fillRect(x - w / 2, y - r - 9, w, 4);
      g.fillStyle = k > 0.5 ? ECOL.drone : (k > 0.25 ? ECOL.cyborg : ECOL.walker); g.fillRect(x - w / 2, y - r - 9, w * k, 4);
    }
    if (e.maxShield && e.shield > 0) {
      var w2 = Math.max(18, r * 2);
      g.fillStyle = COL.line; g.fillRect(x - w2 / 2, y - r - 14, w2, 3);
      g.fillStyle = ECOL.shield; g.fillRect(x - w2 / 2, y - r - 14, w2 * e.shield / e.maxShield, 3);
    }
  }
  function drawCore(g, p, time) {
    var x = p.x * T, y = p.y * T, pulse = 1 + Math.sin(time * 3) * 0.06;
    g.save(); g.shadowColor = COL.neon1; g.shadowBlur = COL.light ? 0 : 18;
    g.strokeStyle = COL.neon1; g.lineWidth = 3; poly(g, x, y, T * 0.42 * pulse, 6, time * 0.4); g.stroke();
    g.fillStyle = COL.neon1; g.globalAlpha = 0.35 + 0.65 * (S.lives / S.maxLives); poly(g, x, y, T * 0.22, 6, -time * 0.6); g.fill();
    g.restore();
  }
  function drawPortal(g, p, time) {
    var x = p.x * T, y = p.y * T;
    g.save(); g.shadowColor = COL.neon2; g.shadowBlur = COL.light ? 0 : 14; g.strokeStyle = COL.neon2; g.lineWidth = 3;
    g.beginPath(); g.arc(x, y, T * 0.36, time * 2, time * 2 + 4.6); g.stroke();
    g.lineWidth = 2; g.beginPath(); g.arc(x, y, T * 0.22, -time * 3, -time * 3 + 4); g.stroke();
    g.restore();
  }
  function rangeCircle(g, x, y, r, col, alpha) {
    g.save(); g.globalAlpha = alpha; g.fillStyle = col; g.beginPath(); g.arc(x, y, r * T, 0, 7); g.fill();
    g.globalAlpha = Math.min(1, alpha * 4); g.strokeStyle = col; g.lineWidth = 1.5; g.setLineDash([5, 5]); g.stroke(); g.restore();
  }

  /* ---------- main draw ---------- */
  function draw() {
    if (bgDirty) drawBg();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bg, 0, 0);
    if (!S) return;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    var time = ui.time;

    // portals and core
    var ends = {};
    S.polys.forEach(function (p) {
      drawPortal(ctx, C.posAt(p, p.startD), time);
      var e = C.posAt(p, p.endD); ends[e.x + ',' + e.y] = e;
    });
    Object.keys(ends).forEach(function (k) { drawCore(ctx, ends[k], time); });

    // selected tower range
    if (ui.sel && ui.sel.mode === 'tower') {
      var st = ui.sel.tower, sd = C.TOWERS[st.type].lv[st.lv];
      rangeCircle(ctx, st.x * T, st.y * T, sd.r, TCOL[st.type], 0.08);
    }

    // towers
    S.towers.forEach(function (tw) { drawTower(ctx, tw.type, tw.x * T, tw.y * T, tw.lv, tw.ang, time); });
    S.towers.forEach(function (tw) {
      if (!tw.tgt || tw.tgt.gone || tw.tgt.hp <= 0 || !C.TOWERS[tw.type].lv[tw.lv].beam) return;
      var col = TCOL[tw.type];
      ctx.save(); ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = COL.light ? 0 : 12;
      ctx.lineWidth = 1 + tw.ramp * 1.6 + Math.sin(time * 40) * 0.6; ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.moveTo(tw.x * T, tw.y * T); ctx.lineTo(tw.tgt.x * T, tw.tgt.y * T); ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = '#ffffff'; ctx.globalAlpha = 0.7; ctx.stroke(); ctx.restore();
    });

    // build preview
    var cell = ui.kb.on ? ui.kb : ui.hover;
    if (cell && ui.sel && ui.sel.mode === 'build' && !ui.ov) {
      var ok = C.canBuild(S, cell.c, cell.r), tp = ui.sel.type, cx = (cell.c + 0.5) * T, cy = (cell.r + 0.5) * T;
      rangeCircle(ctx, cx, cy, C.TOWERS[tp].lv[0].r, ok ? TCOL[tp] : '#ff4d6d', 0.08);
      ctx.globalAlpha = ok ? 0.65 : 0.3; drawTower(ctx, tp, cx, cy, null, -Math.PI / 2, time); ctx.globalAlpha = 1;
    }
    if (ui.kb.on && !ui.ov) {
      ctx.strokeStyle = COL.neon2; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
      ctx.strokeRect(ui.kb.c * T + 2, ui.kb.r * T + 2, T - 4, T - 4); ctx.setLineDash([]);
    }

    // enemies
    S.enemies.forEach(function (e) { drawEnemy(ctx, e, time); });

    // projectiles
    S.shots.forEach(function (sh) {
      ctx.save(); ctx.fillStyle = TCOL[sh.tw]; ctx.shadowColor = TCOL[sh.tw]; ctx.shadowBlur = COL.light ? 0 : 12;
      ctx.beginPath(); ctx.arc(sh.x * T, sh.y * T, 5, 0, 7); ctx.fill(); ctx.restore();
    });

    // effects
    S.fx.forEach(function (f) {
      var col = f.tw != null ? TCOL[f.tw] : ECOL[f.type], k = f.max ? f.t / f.max : 1;
      ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = COL.light ? 0 : 10;
      if (f.k === 'beam') {
        ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(f.x1 * T, f.y1 * T); ctx.lineTo(f.x2 * T, f.y2 * T); ctx.stroke();
      } else if (f.k === 'rail') {
        ctx.globalAlpha = k; ctx.lineWidth = 1 + 4 * k; ctx.beginPath(); ctx.moveTo(f.x1 * T, f.y1 * T); ctx.lineTo(f.x2 * T, f.y2 * T); ctx.stroke();
      } else if (f.k === 'ring') {
        ctx.globalAlpha = k * 0.8; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x * T, f.y * T, f.r * T * (1 - k * 0.7), 0, 7); ctx.stroke();
      } else if (f.k === 'boom') {
        ctx.globalAlpha = k * 0.5; ctx.beginPath(); ctx.arc(f.x * T, f.y * T, f.r * T * (1.1 - k * 0.6), 0, 7); ctx.fill();
      } else if (f.k === 'chain') {
        ctx.lineWidth = 2; ctx.beginPath();
        for (var i = 0; i < f.pts.length - 1; i++) {
          var a = f.pts[i], b = f.pts[i + 1];
          ctx.moveTo(a.x * T, a.y * T);
          for (var j = 1; j < 4; j++) {
            var m = j / 4; ctx.lineTo((a.x + (b.x - a.x) * m) * T + (Math.random() - 0.5) * 10, (a.y + (b.y - a.y) * m) * T + (Math.random() - 0.5) * 10);
          }
          ctx.lineTo(b.x * T, b.y * T);
        }
        ctx.stroke();
      } else if (f.k === 'grav') {
        ctx.globalAlpha = k * 0.8; ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
        ctx.beginPath(); ctx.arc(f.x * T, f.y * T, f.r * T * k, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      } else if (f.k === 'blink') {
        ctx.globalAlpha = k * 0.7; ctx.lineWidth = 2; ctx.setLineDash([2, 5]);
        ctx.beginPath(); ctx.moveTo(f.x1 * T, f.y1 * T); ctx.lineTo(f.x2 * T, f.y2 * T); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(f.x1 * T, f.y1 * T, 10 * (1.5 - k), 0, 7); ctx.stroke();
      } else if (f.k === 'pop') {
        ctx.globalAlpha = k; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(f.x * T, f.y * T, f.r * T * (2 - k), 0, 7); ctx.stroke();
        for (var q = 0; q < 6; q++) {
          var aa = q * 1.047 + f.x, d = f.r * T * (2.4 - 1.6 * k);
          ctx.fillRect(f.x * T + Math.cos(aa) * d - 1.5, f.y * T + Math.sin(aa) * d - 1.5, 3, 3);
        }
      }
      ctx.restore();
    });

    // floating credit texts
    ctx.font = '13px "Special Elite","Courier New",monospace'; ctx.textAlign = 'center';
    ui.floats.forEach(function (fl) { ctx.globalAlpha = Math.max(0, fl.t); ctx.fillStyle = COL.neon2; ctx.fillText(fl.s, fl.x * T, fl.y * T - (1 - fl.t) * 18); });
    ctx.globalAlpha = 1;
  }

  /* ---------- HUD & panels ---------- */
  function updateHud() {
    var key = S ? [lang, S.li, S.wave, S.credits, S.lives, S.active, S.status, ui.ov, ui.speed].join('|') : lang + '|none';
    if (key === ui.hudKey) return;
    ui.hudKey = key;
    if (!S) return;
    $('hLevel').textContent = t('hudLevel', { n: S.li + 1, m: C.LEVELS.length });
    $('hWave').textContent = t('hudWave', { n: S.wave, m: S.waves });
    $('hCredits').textContent = '◆ ' + S.credits;
    var hl = $('hLives'); hl.textContent = '♥ ' + S.lives; hl.classList.toggle('warn', S.lives <= 5);
    bWave.textContent = S.active ? t('waveRun') : t('waveBtn', { n: Math.min(S.wave + 1, S.waves) });
    bWave.disabled = !!(S.active || ui.ov || S.status !== 'build' || S.wave >= S.waves);
    bPause.disabled = !!(ui.ov && ui.ov !== 'pause');
    bSpeed.textContent = t('speed', { n: ui.speed });
    if (ui.towerLi !== S.li) buildTowerButtons();
    Array.prototype.forEach.call(towersEl.children, function (b) {
      var i = +b.getAttribute('data-i');
      b.classList.toggle('poor', S.credits < C.TOWERS[i].cost);
      b.classList.toggle('on', !!(ui.sel && ui.sel.mode === 'build' && ui.sel.type === i));
      b.setAttribute('aria-pressed', ui.sel && ui.sel.mode === 'build' && ui.sel.type === i ? 'true' : 'false');
    });
    updateInfo();
  }
  function statsText(type, lv) {
    var st = C.TOWERS[type].lv[lv], id = C.TOWERS[type].id;
    if (st.beam) return t('stBeam', { d: num(st.d, 0), r: num(st.r) }) + ' · ' + t('xRamp');
    var s = t('st', { d: num(st.d, 0), r: num(st.r), f: num(st.f, 2) });
    if (st.push) s += ' · ' + t('xPush', { p: num(st.push), t: num(st.stun) });
    if (st.s) s += ' · ' + t('xSplash', { s: num(st.s) });
    if (st.sl) s += ' · ' + t('xSlow', { p: Math.round(st.sl * 100) });
    if (st.c) s += ' · ' + t('xChain', { c: st.c });
    if (id === 'rail') s += ' · ' + t('xPierce');
    return s;
  }
  function updateInfo() {
    var sel = ui.sel, key;
    if (!S || !sel) key = 'idle';
    else if (sel.mode === 'build') key = 'b' + sel.type;
    else key = 't' + sel.tower.id + '.' + sel.tower.lv + '.' + (S.credits >= (C.upgradeCost(sel.tower) || 1e9));
    key += lang;
    if (key === ui.infoKey) return;
    ui.infoKey = key;
    infoEl.textContent = '';
    if (!S || !sel) { infoEl.appendChild(document.createTextNode(t('hintIdle'))); return; }
    var id;
    if (sel.mode === 'build') {
      id = C.TOWERS[sel.type].id;
      addB(t('tn_' + id) + ' · ' + C.TOWERS[sel.type].cost + ' ◆');
      addS(t('td_' + id) + ' ' + statsText(sel.type, 0) + '. ' + t('hintBuild'));
      return;
    }
    var tw = sel.tower; id = C.TOWERS[tw.type].id;
    addB(t('tn_' + id) + ' · ' + t('lvl', { n: tw.lv + 1 }));
    addS(statsText(tw.type, tw.lv));
    var acts = document.createElement('span'); acts.className = 'acts';
    var cost = C.upgradeCost(tw), up = document.createElement('button');
    up.className = 'mode primary'; up.type = 'button';
    up.textContent = cost ? t('up', { c: cost }) : t('max');
    up.disabled = !cost || S.credits < cost;
    up.addEventListener('click', doUpgrade);
    var sl = document.createElement('button'); sl.className = 'mode'; sl.type = 'button';
    sl.textContent = t('sell', { v: C.sellValue(tw) });
    sl.addEventListener('click', doSell);
    acts.appendChild(up); acts.appendChild(sl); infoEl.appendChild(acts);
    function addB(s) { var b = document.createElement('b'); b.textContent = s; infoEl.appendChild(b); }
    function addS(s) { var sp = document.createElement('span'); sp.textContent = s; infoEl.appendChild(sp); }
  }
  function refresh() { ui.hudKey = ''; ui.infoKey = ''; updateHud(); updateInfo(); }

  var toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  }

  /* ---------- tower buttons ---------- */
  function buildTowerButtons() {
    towersEl.textContent = '';
    var li = S ? S.li : 0, n = 0;
    C.TOWERS.forEach(function (tw, i) {
      if (!C.towerUnlocked(i, li)) return;
      n++;
      var b = document.createElement('button');
      b.setAttribute('data-i', i);
      b.type = 'button'; b.className = 'tbtn'; b.style.setProperty('--tc', TCOL[i]);
      var ic = document.createElement('canvas'); ic.className = 'ic'; ic.width = 52; ic.height = 52;
      var g = ic.getContext('2d'); g.scale(52 / 48, 52 / 48); drawTower(g, i, 24, 24, null, -Math.PI / 2, 0.6, 48);
      var k = document.createElement('span'); k.className = 'k'; k.textContent = tw.key;
      var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = t('tn_' + tw.id);
      var ct = document.createElement('span'); ct.className = 'ct'; ct.textContent = tw.cost + ' ◆';
      b.appendChild(k); b.appendChild(ic); b.appendChild(nm); b.appendChild(ct);
      b.title = t('td_' + tw.id);
      b.addEventListener('click', function () { pickTower(i); });
      towersEl.appendChild(b);
    });
    towersEl.classList.toggle('n7', n > 5);
    ui.towerLi = li;
  }

  /* ---------- actions ---------- */
  function pickTower(i) {
    if (!S || ui.ov || !C.TOWERS[i]) return;
    if (!C.towerUnlocked(i, S.li)) { toast(t('errLocked')); return; }
    ui.sel = (ui.sel && ui.sel.mode === 'build' && ui.sel.type === i) ? null : { mode: 'build', type: i };
    refresh();
  }
  function tapCell(c, r) {
    if (!S || ui.ov || c < 0 || r < 0 || c >= C.COLS || r >= C.ROWS) return;
    var tw = C.towerAt(S, c, r);
    if (tw) { ui.sel = { mode: 'tower', tower: tw }; refresh(); return; }
    if (ui.sel && ui.sel.mode === 'build') {
      var res = C.build(S, ui.sel.type, c, r);
      if (!res.ok) toast(t(res.err === 'money' ? 'errMoney' : 'errBlocked'));
      else if (S.credits < C.TOWERS[ui.sel.type].cost) ui.sel = null;
    } else ui.sel = null;
    refresh();
  }
  function doUpgrade() {
    if (!S || !ui.sel || ui.sel.mode !== 'tower' || ui.ov) return;
    var res = C.upgrade(S, ui.sel.tower);
    if (!res.ok) toast(t(res.err === 'money' ? 'errMoney' : 'errMax'));
    refresh();
  }
  function doSell() {
    if (!S || !ui.sel || ui.sel.mode !== 'tower' || ui.ov) return;
    var tw = ui.sel.tower, v = C.sell(S, tw);
    ui.floats.push({ s: '+' + v, x: tw.x, y: tw.y, t: 1 });
    ui.sel = null; refresh();
  }
  function startWave() { if (S && !ui.ov && C.startWave(S)) refresh(); }
  function togglePause() {
    if (ui.ov === 'pause') hideOv();
    else if (!ui.ov && S) showOv('pause');
  }
  function cycleSpeed() { ui.speed = ui.speed >= 3 ? 1 : ui.speed + 1; refresh(); }

  /* ---------- overlays ---------- */
  function startLevel(li) {
    S = C.createLevel(li);
    ui.sel = null; ui.floats = []; bgDirty = true;
    showOv('intro');
  }
  function showOv(kind) { ui.ov = kind; renderOv(); refresh(); }
  function hideOv() { ui.ov = null; ov.hidden = true; ov.textContent = ''; refresh(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function btn(act, label, primary) { return '<button type="button" class="mode' + (primary ? ' primary' : '') + '" data-act="' + act + '">' + esc(label) + '</button>'; }
  function renderOv() {
    if (!ui.ov) { ov.hidden = true; return; }
    var h = '', lvl = S ? C.LEVELS[S.li] : null, name = S ? I18N[lang].names[S.li] : '';
    var codeBlock = (S && lvl.code) ? '<p>' + esc(t('codeInfo')) + '</p><span class="code">' + esc(lvl.code) + '</span><p>' + esc(t('codeHint')) + '</p>' : '';
    if (ui.ov === 'menu') {
      var pre = ov.querySelector('#codeIn'), val = pre ? pre.value : '';
      h = '<h2>Orbital Defense</h2><p>' + esc(t('menuText')) + '</p><div class="btns">' + btn('new', t('newGame'), true) + '</div>' +
        '<form class="codeform" id="codeForm" autocomplete="off"><input id="codeIn" maxlength="16" autocapitalize="characters" spellcheck="false" placeholder="' + esc(t('codePh')) + '" aria-label="' + esc(t('codeAria')) + '" value="' + esc(val) + '">' +
        '<button type="submit" class="mode">' + esc(t('loadCode')) + '</button></form><p class="err" id="codeErr"></p>';
    } else if (ui.ov === 'intro') {
      h = '<h2>' + esc(t('introTitle', { n: S.li + 1, name: name })) + '</h2><p>' + esc(t('introInfo', { w: S.waves, c: S.credits })) + '</p>' +
        (S.li === 0 ? '<p>' + esc(t('tip1')) + '</p><p>' + esc(t('enemies')) + '</p>' : codeBlock) +
        (S.li === C.UNLOCK_LI ? '<h2>' + esc(t('newTitle')) + '</h2><p>' + esc(t('newEnemies')) + '</p><p>' + esc(t('newTowers')) + '</p>' : '') +
        '<div class="btns">' + btn('start', t('startLevel'), true) + btn('menu', t('menu')) + '</div>';
    } else if (ui.ov === 'won') {
      h = '<h2>' + esc(t('wonTitle')) + '</h2><p>' + esc(t('wonText', { l: S.lives, m: S.maxLives, c: S.credits })) + '</p><div class="btns">' + btn('next', t('next'), true) + btn('menu', t('menu')) + '</div>';
    } else if (ui.ov === 'victory') {
      h = '<h2>' + esc(t('vicTitle')) + '</h2><p>' + esc(t('vicText')) + '</p><div class="btns">' + btn('menu', t('menu'), true) + '</div>';
    } else if (ui.ov === 'lost') {
      h = '<h2>' + esc(t('lostTitle')) + '</h2><p>' + esc(t('lostText', { n: S.li + 1 })) + '</p><div class="btns">' + btn('retry', t('retry'), true) + btn('menu', t('menu')) + '</div>';
    } else if (ui.ov === 'pause') {
      h = '<h2>' + esc(t('pauseTitle')) + '</h2><p>' + esc(t('introTitle', { n: S.li + 1, name: name })) + '</p>' + codeBlock +
        '<div class="btns">' + btn('resume', t('resume'), true) + btn('retry', t('retry')) + btn('menu', t('menu')) + '</div>';
    }
    ov.innerHTML = '<div class="ovbox">' + h + '</div>';
    ov.hidden = false;
    var p = ov.querySelector('.primary');
    if (p && !('ontouchstart' in window)) p.focus({ preventScroll: true });
  }
  ov.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'new') startLevel(0);
    else if (a === 'start' || a === 'resume') hideOv();
    else if (a === 'next') startLevel(Math.min(S.li + 1, C.LEVELS.length - 1));
    else if (a === 'retry') startLevel(S.li);
    else if (a === 'menu') goMenu();
  });
  ov.addEventListener('submit', function (e) {
    e.preventDefault();
    var inp = $('codeIn'), li = C.levelByCode(inp.value);
    if (li < 0) { $('codeErr').textContent = t('codeBad'); inp.select(); return; }
    startLevel(li);
  });
  function goMenu() { S = C.createLevel(0); ui.sel = null; bgDirty = true; showOv('menu'); }

  /* ---------- input: pointer ---------- */
  function cellOf(ev) {
    var r = cv.getBoundingClientRect();
    return { c: Math.floor((ev.clientX - r.left) / r.width * C.COLS), r: Math.floor((ev.clientY - r.top) / r.height * C.ROWS) };
  }
  cv.addEventListener('pointerdown', function (ev) {
    if (ev.button > 0) return;
    ev.preventDefault();
    ui.kb.on = false;
    var c = cellOf(ev); ui.hover = ev.pointerType === 'mouse' ? c : null;
    tapCell(c.c, c.r);
  });
  cv.addEventListener('pointermove', function (ev) { if (ev.pointerType === 'mouse') { ui.hover = cellOf(ev); ui.kb.on = false; } });
  cv.addEventListener('pointerleave', function () { ui.hover = null; });
  cv.addEventListener('contextmenu', function (ev) { ev.preventDefault(); ui.sel = null; refresh(); });
  cv.tabIndex = 0;

  /* ---------- input: keyboard ---------- */
  document.addEventListener('keydown', function (ev) {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var k = ev.key, tag = ev.target && ev.target.tagName;
    if (tag === 'INPUT') return;
    if (k === 'f' || k === 'F') { ev.preventDefault(); toggleFs(); return; }
    if (ui.ov) {
      if (ui.ov === 'pause' && (k === 'p' || k === 'P' || k === 'Escape')) { ev.preventDefault(); hideOv(); return; }
      if ((k === 'Enter' || k === ' ') && tag !== 'BUTTON') { var p = ov.querySelector('.primary'); if (p) { ev.preventDefault(); p.click(); } }
      return;
    }
    if (!S) return;
    var mv = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] }[k];
    if (mv) {
      ev.preventDefault();
      if (ui.kb.on) { ui.kb.c = Math.max(0, Math.min(C.COLS - 1, ui.kb.c + mv[0])); ui.kb.r = Math.max(0, Math.min(C.ROWS - 1, ui.kb.r + mv[1])); }
      ui.kb.on = true; return;
    }
    if (k >= '1' && k <= '7') { pickTower(+k - 1); if (!ui.hover) ui.kb.on = true; return; }
    if (k === 'Enter' || k === 'e' || k === 'E') { if (tag === 'BUTTON') return; ev.preventDefault(); ui.kb.on = true; tapCell(ui.kb.c, ui.kb.r); return; }
    if (k === 'u' || k === 'U') { doUpgrade(); return; }
    if (k === 'x' || k === 'X' || k === 'Delete' || k === 'Backspace') { ev.preventDefault(); doSell(); return; }
    if (k === ' ' || k === 'n' || k === 'N') { if (tag === 'BUTTON' && k === ' ') return; ev.preventDefault(); startWave(); return; }
    if (k === 'p' || k === 'P') { togglePause(); return; }
    if (k === 'Escape') { if (ui.sel) { ui.sel = null; refresh(); } else togglePause(); return; }
    if (k === 'g' || k === 'G' || k === '+') { cycleSpeed(); return; }
  });

  /* ---------- buttons ---------- */
  game.addEventListener('pointerup', function (e) {
    var b = e.target.closest('button'); if (b && e.pointerType !== 'keyboard') setTimeout(function () { b.blur(); }, 0);
  });
  bWave.addEventListener('click', startWave);
  bPause.addEventListener('click', togglePause);
  bSpeed.addEventListener('click', cycleSpeed);
  bFs.addEventListener('click', toggleFs);
  document.addEventListener('visibilitychange', function () { if (document.hidden && S && !ui.ov) showOv('pause'); });

  /* ---------- theme & language ---------- */
  function themeText() { modeBtn.textContent = root.getAttribute('data-theme') === 'light' ? t('dark') : t('light'); }
  modeBtn.addEventListener('click', function () {
    var light = root.getAttribute('data-theme') !== 'light';
    root.setAttribute('data-theme', light ? 'light' : 'dark');
    LS.set('theme', light ? 'light' : 'dark');
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', light ? '#f3f4fa' : '#0a0c14');
    themeText(); readColors(); buildTowerButtons(); bgDirty = true; refresh();
  });
  function applyLang() {
    root.lang = lang; document.title = t('title');
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    langBtn.textContent = lang === 'en' ? 'Deutsch' : 'English';
    themeText();
    bPause.textContent = t('pause'); bFs.textContent = isFs() ? t('fsExit') : t('fs');
    var keys = [['1–7', 'kTower'], ['← ↑ ↓ → / WASD', 'kMove'], ['Enter', 'kPlace'], ['U', 'kUpgrade'], ['X', 'kSell'], [t('kSpaceKey'), 'kWave'], ['P', 'kPause'], ['G', 'kSpeed'], ['F', 'kFs'], ['Esc', 'kEsc']];
    var ul = $('keys'); ul.textContent = '';
    keys.forEach(function (kv) {
      var li = document.createElement('li'), kb = document.createElement('kbd'); kb.textContent = kv[0];
      li.appendChild(kb); li.appendChild(document.createTextNode(' ' + t(kv[1]))); ul.appendChild(li);
    });
    buildTowerButtons();
    if (ui.ov) renderOv();
    refresh();
  }
  langBtn.addEventListener('click', function () { lang = lang === 'en' ? 'de' : 'en'; LS.set('lang', lang); applyLang(); });

  /* ---------- loop ---------- */
  var last = performance.now();
  function loop(now) {
    var dt = Math.min((now - last) / 1000, 0.05); last = now;
    ui.time += dt;
    if (S && !ui.ov) {
      var total = dt * ui.speed;
      while (total > 1e-6) { var h = Math.min(total, 1 / 60); C.step(S, h); total -= h; }
      while (S.events.length) handle(S.events.shift());
    }
    for (var i = ui.floats.length - 1; i >= 0; i--) { ui.floats[i].t -= dt * 1.2; if (ui.floats[i].t <= 0) ui.floats.splice(i, 1); }
    if (ui.sel && ui.sel.mode === 'tower' && S && S.towers.indexOf(ui.sel.tower) < 0) ui.sel = null;
    updateHud();
    draw();
    requestAnimationFrame(loop);
  }
  function handle(ev) {
    if (ev.k === 'kill') ui.floats.push({ s: '+' + ev.rw, x: ev.x, y: ev.y, t: 1 });
    else if (ev.k === 'wave' && S.status === 'build') toast(t('waveDone', { n: ev.n, b: ev.bonus }));
    else if (ev.k === 'leak') toast(t('leak'));
    else if (ev.k === 'won') { ui.sel = null; showOv(S.li >= C.LEVELS.length - 1 ? 'victory' : 'won'); }
    else if (ev.k === 'lost') { ui.sel = null; showOv('lost'); }
  }

  /* ---------- init ---------- */
  readColors();
  resize();
  applyLang();
  var q = (location.search.match(/[?&]code=([^&]+)/) || [])[1], qli = q ? C.levelByCode(decodeURIComponent(q)) : -1;
  if (qli > 0) startLevel(qli); else goMenu();
  requestAnimationFrame(loop);
})();
