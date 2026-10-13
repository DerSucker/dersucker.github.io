/* Schach – 2 Spieler am selben Gerät oder gegen Stockfish
   by Martin Sucker | github.com/DerSucker | www.martinsucker.de
   Reines HTML/CSS/JS für GitHub Pages.
   Regeln: chess.js (BSD-2-Clause) · Engine: Stockfish 11 / stockfish.js (GPLv3) */
import { Chess } from './lib/chess.js';

// ---------- Level (Stockfish-Spielstärke) ----------
// skill = UCI "Skill Level" (0–20), depth bzw. movetime begrenzen die Suche
var LEVELS = [
  { skill: 0, depth: 1, code: '' },
  { skill: 1, depth: 2, code: 'E2E4' },
  { skill: 3, depth: 3, code: 'GAMBIT' },
  { skill: 5, depth: 5, code: 'ENPASSANT' },
  { skill: 8, depth: 7, code: 'FIANCHETTO' },
  { skill: 11, depth: 9, code: 'ZUGZWANG' },
  { skill: 15, movetime: 700, code: 'SICILIAN' },
  { skill: 20, movetime: 1500, code: 'GRANDMASTER' }
];
var VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
var START_COUNT = { p: 8, n: 2, b: 2, r: 2, q: 1 };
var K_UNLOCK = 'chess.unlocked', K_SAVE = 'chess.save', K_SOUND = 'chess.sound';

// ---------- Sprache ----------
var I18N = {
  de: {
    light: '☀ Lightmode', dark: '☾ Darkmode', back: 'Startseite', backAria: 'Startseite', themeAria: 'Design wechseln', langBtn: 'English',
    title: 'Schach – Games – Martin Sucker', h1: 'Schach', role: 'Zu zweit am selben Gerät oder gegen Stockfish', go: 'OK', legal: 'Impressum & Datenschutz',
    boardAria: 'Schachbrett', modeAria: 'Spielmodus', menuAria: 'Menü', undoAria: 'Zug zurück', flipAria: 'Brett drehen', hintAria: 'Tipp', fsAria: 'Vollbild',
    menuTitle: 'Neues Spiel', modeAi: 'Gegen Computer', modePvp: '2 Spieler', lblLevel: 'Level', lblColor: 'Deine Farbe', white: 'Weiß', black: 'Schwarz', random: 'Zufall',
    lblFlip: 'Brett nach jedem Zug drehen', on: 'An', off: 'Aus', startGame: '▶ Spiel starten', resumeGame: '↻ Fortsetzen', backGame: '▶ Zurück zum Spiel',
    promoTitle: 'Umwandeln in',
    bMenu: '☰ Menü', bUndo: '↶ Zug zurück', bFlip: '⇅ Drehen', bHint: '✦ Tipp', bResign: '⚑ Aufgeben', soundOn: '♫ Ton an', soundOff: '♫ Ton aus', fs: '⛶ Vollbild', fsOff: '⛶ Vollbild beenden',
    hMoves: 'Züge', bPgn: '⧉ PGN kopieren', noMoves: 'Noch keine Züge.', pgnCopied: 'PGN in die Zwischenablage kopiert.', pgnFail: 'Kopieren nicht möglich.',
    hControls: 'Steuerung', cMouse: 'Maus / Finger', cMouseD: 'Figur antippen und Zielfeld antippen oder die Figur ziehen.',
    cKeys: 'Tastatur', cKeysD: 'Pfeiltasten bewegen den Rahmen, Enter oder Leertaste wählt aus, Esc bricht ab.',
    cSys: 'Funktionen', cSysD: 'U Zug zurück · R Brett drehen · H Tipp · N Menü · M Ton · F Vollbild',
    cMobD: 'Die Tasten unter dem Brett: Menü, Zug zurück, Drehen, Tipp und Vollbild.', cCheatD: 'Ab Level 2 am Levelanfang angezeigt. Eingabe im Menü.',
    hLevels: 'Level', levelsIntro: 'Der Computergegner ist die Schach-Engine Stockfish. Wer ein Level gewinnt, schaltet das nächste frei.',
    lvDescD: 'Stockfish-Stärke {s}/20, Suchtiefe {d}', lvDescT: 'Stockfish-Stärke {s}/20, {t} s Bedenkzeit', locked: '🔒 gesperrt', unlockedL: '✓ freigeschaltet',
    hCredits: 'Verwendete Software', crSf: 'Schach-Engine, als WebAssembly von Nathan Rugg. Lizenz: GPLv3.', crCj: 'Regeln und Zuggenerierung von Jeff Hlywa. Lizenz: BSD-2-Clause.',
    crPcT: 'Figuren „cburnett“', crPc: 'Von Colin M. L. Burnett, aus lichess chessground. Lizenz: GPLv2+.',
    lv1: 'Bauer', lv2: 'Springer', lv3: 'Läufer', lv4: 'Turm', lv5: 'Dame', lv6: 'König', lv7: 'Meister', lv8: 'Großmeister',
    you: 'Du', computer: 'Computer', lvShort: 'Level {n}',
    turnW: 'Weiß ist am Zug', turnB: 'Schwarz ist am Zug', yourTurn: 'Du bist am Zug', thinking: 'Computer denkt…', hintSearch: 'Suche Tipp…', check: 'Schach!',
    hintIs: 'Tipp: {m}', pickMenu: 'Wähle im Menü einen Spielmodus.',
    lvTitle: 'Level {n} · {name}', youPlay: 'Du spielst {c}.', whiteA: 'Weiß', blackA: 'Schwarz', codeFor: 'Cheatcode für dieses Level:', letsGo: '▶ Los geht’s',
    mate: 'Schachmatt', stalemate: 'Patt', insufficient: 'Zu wenig Material', threefold: 'Dreifache Stellungswiederholung', fifty: '50-Züge-Regel', draw: 'Remis',
    resignW: 'Weiß gibt auf', resignB: 'Schwarz gibt auf', resignYou: 'Du hast aufgegeben',
    winW: 'Weiß gewinnt', winB: 'Schwarz gewinnt', youWin: 'Gewonnen!', youLose: 'Der Computer gewinnt', drawT: 'Remis',
    lvDone: 'Level {n} geschafft! Level {m} ist freigeschaltet.', allDone: 'Du hast den Großmeister besiegt!',
    nextLv: '▶ Level {n}', again: '↺ Nochmal', toMenu: '☰ Menü', viewBoard: '◻ Brett ansehen',
    badCode: 'Unbekannter Code.', lvUnlocked: 'Level {n} freigeschaltet.',
    engFail: 'Der Computergegner konnte nicht geladen werden.', engFailSub: 'Bitte Seite neu laden oder den 2-Spieler-Modus nutzen.', errT: 'Fehler'
  },
  en: {
    light: '☀ Light mode', dark: '☾ Dark mode', back: 'Home', backAria: 'Home', themeAria: 'Switch theme', langBtn: 'Deutsch',
    title: 'Chess – Games – Martin Sucker', h1: 'Chess', role: 'Two players on one device or against Stockfish', go: 'OK', legal: 'Legal notice & privacy',
    boardAria: 'Chess board', modeAria: 'Game mode', menuAria: 'Menu', undoAria: 'Undo move', flipAria: 'Flip board', hintAria: 'Hint', fsAria: 'Fullscreen',
    menuTitle: 'New game', modeAi: 'Against computer', modePvp: '2 players', lblLevel: 'Level', lblColor: 'Your colour', white: 'White', black: 'Black', random: 'Random',
    lblFlip: 'Flip board after every move', on: 'On', off: 'Off', startGame: '▶ Start game', resumeGame: '↻ Resume', backGame: '▶ Back to game',
    promoTitle: 'Promote to',
    bMenu: '☰ Menu', bUndo: '↶ Undo', bFlip: '⇅ Flip', bHint: '✦ Hint', bResign: '⚑ Resign', soundOn: '♫ Sound on', soundOff: '♫ Sound off', fs: '⛶ Fullscreen', fsOff: '⛶ Exit fullscreen',
    hMoves: 'Moves', bPgn: '⧉ Copy PGN', noMoves: 'No moves yet.', pgnCopied: 'PGN copied to the clipboard.', pgnFail: 'Copying is not possible.',
    hControls: 'Controls', cMouse: 'Mouse / finger', cMouseD: 'Tap a piece and then the target square, or drag the piece.',
    cKeys: 'Keyboard', cKeysD: 'Arrow keys move the frame, Enter or Space selects, Esc cancels.',
    cSys: 'Functions', cSysD: 'U undo · R flip board · H hint · N menu · M sound · F fullscreen',
    cMobD: 'The buttons below the board: menu, undo, flip, hint and fullscreen.', cCheatD: 'Shown at the start of each level from level 2. Enter it in the menu.',
    hLevels: 'Levels', levelsIntro: 'The computer opponent is the chess engine Stockfish. Win a level to unlock the next one.',
    lvDescD: 'Stockfish strength {s}/20, search depth {d}', lvDescT: 'Stockfish strength {s}/20, {t} s thinking time', locked: '🔒 locked', unlockedL: '✓ unlocked',
    hCredits: 'Software used', crSf: 'Chess engine, compiled to WebAssembly by Nathan Rugg. Licence: GPLv3.', crCj: 'Rules and move generation by Jeff Hlywa. Licence: BSD-2-Clause.',
    crPcT: '“cburnett” pieces', crPc: 'By Colin M. L. Burnett, from lichess chessground. Licence: GPLv2+.',
    lv1: 'Pawn', lv2: 'Knight', lv3: 'Bishop', lv4: 'Rook', lv5: 'Queen', lv6: 'King', lv7: 'Master', lv8: 'Grandmaster',
    you: 'You', computer: 'Computer', lvShort: 'Level {n}',
    turnW: 'White to move', turnB: 'Black to move', yourTurn: 'Your move', thinking: 'Computer is thinking…', hintSearch: 'Looking for a hint…', check: 'Check!',
    hintIs: 'Hint: {m}', pickMenu: 'Choose a game mode in the menu.',
    lvTitle: 'Level {n} · {name}', youPlay: 'You play {c}.', whiteA: 'White', blackA: 'Black', codeFor: 'Cheat code for this level:', letsGo: '▶ Let’s go',
    mate: 'Checkmate', stalemate: 'Stalemate', insufficient: 'Insufficient material', threefold: 'Threefold repetition', fifty: 'Fifty-move rule', draw: 'Draw',
    resignW: 'White resigns', resignB: 'Black resigns', resignYou: 'You resigned',
    winW: 'White wins', winB: 'Black wins', youWin: 'You win!', youLose: 'The computer wins', drawT: 'Draw',
    lvDone: 'Level {n} completed! Level {m} is unlocked.', allDone: 'You beat the grandmaster!',
    nextLv: '▶ Level {n}', again: '↺ Play again', toMenu: '☰ Menu', viewBoard: '◻ View board',
    badCode: 'Unknown code.', lvUnlocked: 'Level {n} unlocked.',
    engFail: 'The computer opponent could not be loaded.', engFailSub: 'Please reload the page or use the 2-player mode.', errT: 'Error'
  }
};
var LANG = 'de';
try { if (localStorage.getItem('lang') === 'en') LANG = 'en'; } catch (e) {}
function tt(k, o) {
  var s = (I18N[LANG] && I18N[LANG][k]) || I18N.de[k] || k;
  if (o) Object.keys(o).forEach(function (n) { s = s.split('{' + n + '}').join(o[n]); });
  return s;
}
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} return null; }
function $(id) { return document.getElementById(id); }
function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

// ---------- Ton ----------
var Sound = (function () {
  var ac = null, on = store(K_SOUND) !== '0';
  function unlock() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    var A = window.AudioContext || window.webkitAudioContext; if (!A) return;
    try { ac = new A(); } catch (e) { ac = null; }
  }
  function tone(f, d, type, vol, delay) {
    if (!on || !ac) return;
    var t = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'triangle'; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(vol || 0.15, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + 0.02);
  }
  return {
    unlock: unlock, isOn: function () { return on; },
    toggle: function () { on = !on; store(K_SOUND, on ? '1' : '0'); },
    move: function () { tone(620, 0.06, 'triangle', 0.18); tone(310, 0.05, 'sine', 0.12, 0.01); },
    capture: function () { tone(220, 0.12, 'square', 0.08); tone(140, 0.14, 'triangle', 0.18, 0.02); },
    check: function () { tone(880, 0.1, 'square', 0.06); tone(660, 0.14, 'square', 0.06, 0.1); },
    end: function (good) {
      var n = good ? [523, 659, 784, 1047] : [440, 392, 330, 262];
      n.forEach(function (f, i) { tone(f, 0.22, 'triangle', 0.14, i * 0.13); });
    }
  };
})();

// ---------- Engine (Stockfish im Web Worker) ----------
var Engine = {
  w: null, failed: false, queue: [],
  init: function () {
    if (this.w || this.failed) return;
    var self = this;
    try { this.w = new Worker('lib/stockfish.js'); } catch (e) { this.fail(); return; }
    this.w.onmessage = function (e) { self.onLine(String(e && e.data !== undefined ? e.data : e)); };
    this.w.onerror = function () { self.fail(); };
    this.send('uci'); this.send('isready');
  },
  send: function (c) { if (this.w) this.w.postMessage(c); },
  onLine: function (line) {
    if (line.indexOf('bestmove') !== 0) return;
    var h = this.queue.shift(); if (!h) return;
    clearTimeout(h.timer);
    if (!h.cancelled) h.cb(line.split(/\s+/)[1] || null);
  },
  fail: function () {
    this.failed = true;
    var q = this.queue; this.queue = [];
    q.forEach(function (h) { clearTimeout(h.timer); if (!h.cancelled) h.cb(null); });
  },
  go: function (moves, skill, lim, cb) {
    this.init();
    var h = { cb: cb, cancelled: false, timer: 0 }, self = this;
    if (this.failed) { setTimeout(function () { cb(null); }, 0); return h; }
    this.queue.push(h);
    h.timer = setTimeout(function () { if (self.queue.indexOf(h) >= 0) self.fail(); }, 45000);
    this.send('setoption name Skill Level value ' + skill);
    this.send('position startpos' + (moves.length ? ' moves ' + moves.join(' ') : ''));
    this.send(lim.movetime ? 'go movetime ' + lim.movetime : 'go depth ' + lim.depth);
    return h;
  },
  cancel: function (h) { if (h && !h.cancelled) { h.cancelled = true; this.send('stop'); } },
  newGame: function () { this.init(); this.send('ucinewgame'); this.send('isready'); }
};

// ---------- Spielzustand ----------
var game = new Chess();
var S = {
  started: false, mode: 'ai', level: 0, human: 'w', autoflip: false, orient: 'w',
  over: null, sel: null, targets: [], hint: null, cur: 'e2', thinking: false,
  aiReq: null, hintReq: null, drag: null, msgSpec: null, promo: null, flash: null
};
var M = { mode: 'ai', level: 0, color: 'w', flip: '0' };
var unlocked = Math.min(LEVELS.length, Math.max(1, parseInt(store(K_UNLOCK), 10) || 1));

var shell = $('shell'), stage = $('stage'), board = $('board'), ghost = $('ghost');
var ovMenu = $('ov-menu'), ovMsg = $('ov-msg'), ovPromo = $('ov-promo');

function lans() { return game.history({ verbose: true }).map(function (m) { return m.lan || (m.from + m.to + (m.promotion || '')); }); }
function opp(c) { return c === 'w' ? 'b' : 'w'; }
function lvName(i) { return tt('lv' + (i + 1)); }
function colorWord(c) { return tt(c === 'w' ? 'whiteA' : 'blackA'); }
function isAiTurn() { return S.started && S.mode === 'ai' && !S.over && game.turn() !== S.human; }
function overlayOpen() { return !ovMenu.hidden || !ovMsg.hidden || !ovPromo.hidden; }

// ---------- Speichern / Fortsetzen ----------
function save() {
  if (!S.started || S.over) { store(K_SAVE, null); return; }
  store(K_SAVE, JSON.stringify({ mode: S.mode, level: S.level, human: S.human, autoflip: S.autoflip, orient: S.orient, moves: lans() }));
}
function loadSaved() { try { var d = JSON.parse(store(K_SAVE) || 'null'); return d && Array.isArray(d.moves) ? d : null; } catch (e) { return null; } }

// ---------- Spielablauf ----------
function setHeaders() {
  var names = S.mode === 'ai'
    ? { w: S.human === 'w' ? tt('you') : 'Stockfish (' + tt('lvShort', { n: S.level + 1 }) + ')', b: S.human === 'b' ? tt('you') : 'Stockfish (' + tt('lvShort', { n: S.level + 1 }) + ')' }
    : { w: tt('white'), b: tt('black') };
  var d = new Date();
  try {
    game.setHeader('Event', 'martinsucker.de/games/chess');
    game.setHeader('Date', d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0'));
    game.setHeader('White', names.w); game.setHeader('Black', names.b);
  } catch (e) {}
}

function newGame(cfg, moves) {
  cancelAI(); cancelHint();
  game.reset();
  S.mode = cfg.mode; S.level = cfg.level || 0; S.autoflip = !!cfg.autoflip;
  S.human = cfg.mode === 'ai' ? cfg.human : 'w';
  S.over = null; S.sel = null; S.targets = []; S.hint = null; S.started = true; S.flash = null;
  (moves || []).forEach(function (u) { try { game.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch (e) {} });
  S.orient = cfg.orient || (S.mode === 'ai' ? S.human : (S.autoflip ? game.turn() : 'w'));
  S.cur = S.orient === 'w' ? 'e2' : 'e7';
  setHeaders();
  if (S.mode === 'ai') Engine.newGame();
  closeMenu(); closeMsg(); closePromo();
  save(); render();
  if (S.mode === 'ai' && !moves) showLevelIntro();
  else { focusBoard(); maybeAI(); }
}

function showLevelIntro() {
  showMsg(function () {
    var L = LEVELS[S.level];
    return {
      title: tt('lvTitle', { n: S.level + 1, name: lvName(S.level) }),
      sub: tt('youPlay', { c: colorWord(S.human) }),
      code: S.level > 0 ? L.code : '',
      btns: [{ t: tt('letsGo'), hot: true, fn: function () { closeMsg(); focusBoard(); maybeAI(); } }]
    };
  });
}

function maybeAI() {
  if (!isAiTurn() || S.aiReq || overlayOpen()) { render(); return; }
  if (Engine.failed) { engineFail(); return; }
  var L = LEVELS[S.level], t0 = Date.now();
  S.thinking = true;
  var req = Engine.go(lans(), L.skill, L, function (mv) {
    setTimeout(function () {
      if (S.aiReq !== req) return;
      S.aiReq = null; S.thinking = false;
      if (!mv || mv === '(none)' || mv.length < 4) { if (!game.isGameOver()) engineFail(); else render(); return; }
      applyMove({ from: mv.slice(0, 2), to: mv.slice(2, 4), promotion: mv[4] });
    }, Math.max(0, 450 - (Date.now() - t0)));
  });
  S.aiReq = req;
  render();
}
function cancelAI() { if (S.aiReq) { Engine.cancel(S.aiReq); S.aiReq = null; } S.thinking = false; }
function cancelHint() { if (S.hintReq) { Engine.cancel(S.hintReq); S.hintReq = null; } }

function engineFail() {
  S.thinking = false; S.aiReq = null; render();
  showMsg(function () { return { title: tt('errT'), sub: tt('engFail') + ' ' + tt('engFailSub'), btns: [{ t: tt('toMenu'), hot: true, fn: function () { closeMsg(); openMenu(); } }] }; });
}

function applyMove(m) {
  var r;
  try { r = game.move(m); } catch (e) { r = null; }
  if (!r) return false;
  cancelHint();
  S.sel = null; S.targets = []; S.hint = null; S.flash = null;
  if (S.mode === 'pvp' && S.autoflip) S.orient = game.turn();
  if (game.inCheck()) Sound.check(); else if (r.captured) Sound.capture(); else Sound.move();
  checkEnd();
  save(); render();
  if (!S.over) maybeAI();
  return true;
}

function checkEnd() {
  if (!game.isGameOver()) return;
  var reason = 'draw', winner = null;
  if (game.isCheckmate()) { reason = 'mate'; winner = opp(game.turn()); }
  else if (game.isStalemate()) reason = 'stalemate';
  else if (game.isInsufficientMaterial()) reason = 'insufficient';
  else if (game.isThreefoldRepetition()) reason = 'threefold';
  else if (game.isDrawByFiftyMoves && game.isDrawByFiftyMoves()) reason = 'fifty';
  S.over = { reason: reason, winner: winner };
  gameOver();
}

function resign() {
  if (!S.started || S.over) return;
  cancelAI(); cancelHint();
  var loser = S.mode === 'ai' ? S.human : game.turn();
  S.over = { reason: 'resign', winner: opp(loser), loser: loser };
  gameOver();
}

function gameOver() {
  S.sel = null; S.targets = []; S.hint = null;
  store(K_SAVE, null);
  var humanWon = S.mode === 'ai' && S.over.winner === S.human;
  if (humanWon && S.level + 2 > unlocked && S.level + 1 < LEVELS.length) { unlocked = S.level + 2; store(K_UNLOCK, String(unlocked)); renderLevelList(); }
  render();
  setTimeout(function () {
    if (!S.over) return;
    Sound.end(S.mode === 'pvp' ? true : humanWon || (S.over.winner === null));
    showMsg(overSpec);
  }, 650);
}

function resultTitle() {
  var o = S.over; if (!o) return '';
  if (!o.winner) return tt('drawT');
  if (S.mode === 'ai') return o.winner === S.human ? tt('youWin') : tt('youLose');
  return tt(o.winner === 'w' ? 'winW' : 'winB');
}
function reasonText() {
  var o = S.over; if (!o) return '';
  if (o.reason === 'resign') return S.mode === 'ai' ? tt('resignYou') : tt(o.loser === 'w' ? 'resignW' : 'resignB');
  return tt(o.reason);
}
function overSpec() {
  var o = S.over, btns = [], sub = reasonText();
  var won = S.mode === 'ai' && o.winner === S.human;
  if (won && S.level + 1 < LEVELS.length) {
    sub += ' · ' + tt('lvDone', { n: S.level + 1, m: S.level + 2 });
    btns.push({ t: tt('nextLv', { n: S.level + 2 }), hot: true, fn: function () { M.level = S.level + 1; newGame({ mode: 'ai', level: S.level + 1, human: S.human }); } });
  } else if (won) sub += ' · ' + tt('allDone');
  btns.push({ t: tt('again'), hot: !btns.length, fn: function () { newGame({ mode: S.mode, level: S.level, human: S.human, autoflip: S.autoflip }); } });
  btns.push({ t: tt('toMenu'), fn: function () { closeMsg(); openMenu(); } });
  btns.push({ t: tt('viewBoard'), fn: function () { closeMsg(); focusBoard(); } });
  return { title: resultTitle(), sub: sub, btns: btns };
}

function undo() {
  if (!S.started || !game.history().length) return;
  cancelAI(); cancelHint(); closeMsg(); closePromo();
  S.over = null;
  game.undo();
  if (S.mode === 'ai') { while (game.history().length && game.turn() !== S.human) game.undo(); }
  else if (S.autoflip) S.orient = game.turn();
  S.sel = null; S.targets = []; S.hint = null; S.flash = null;
  save(); render(); maybeAI();
}

function hint() {
  if (!S.started || S.over || S.thinking || S.hintReq || isAiTurn() || overlayOpen()) return;
  if (Engine.failed) { engineFail(); return; }
  var req = Engine.go(lans(), 20, { depth: 10 }, function (mv) {
    if (S.hintReq !== req) return;
    S.hintReq = null;
    if (mv && mv.length >= 4) {
      S.hint = [mv.slice(0, 2), mv.slice(2, 4)];
      var san = mv;
      try { var c = new Chess(game.fen()); san = c.move({ from: mv.slice(0, 2), to: mv.slice(2, 4), promotion: mv[4] }).san; } catch (e) {}
      S.flash = function () { return tt('hintIs', { m: san }); };
    }
    render();
  });
  S.hintReq = req;
  render();
}

function flip() { S.orient = opp(S.orient); render(); }

// ---------- Auswahl und Züge ----------
function canPick(sq) {
  if (!S.started || S.over || S.thinking || overlayOpen()) return false;
  if (S.mode === 'ai' && game.turn() !== S.human) return false;
  var p = game.get(sq);
  return !!p && p.color === game.turn();
}
function select(sq) { S.sel = sq; S.targets = game.moves({ square: sq, verbose: true }); render(); }
function deselect() { if (S.sel) { S.sel = null; S.targets = []; render(); } }
function tryMove(from, to) {
  var ms = S.targets.filter(function (m) { return m.from === from && m.to === to; });
  if (!ms.length) return false;
  if (ms.some(function (m) { return m.promotion; })) { openPromo(from, to); return true; }
  applyMove({ from: from, to: to });
  return true;
}
function activate(sq) {
  if (S.sel && S.sel !== sq && tryMove(S.sel, sq)) return;
  if (canPick(sq)) { if (S.sel === sq) deselect(); else select(sq); }
  else deselect();
}

// ---------- Brett-Darstellung ----------
var FILES = 'abcdefgh';
function sqAt(r, c) { return S.orient === 'w' ? FILES[c] + (8 - r) : FILES[7 - c] + (r + 1); }
function rcOf(sq) { var f = FILES.indexOf(sq[0]), k = +sq[1]; return S.orient === 'w' ? { r: 8 - k, c: f } : { r: k - 1, c: 7 - f }; }
var cells = [];
for (var i = 0; i < 64; i++) { var d = document.createElement('div'); d.className = 'sq'; board.appendChild(d); cells.push(d); }

function kingSq(color) {
  var b = game.board();
  for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) { var p = b[r][c]; if (p && p.type === 'k' && p.color === color) return p.square; }
  return null;
}

function render() {
  var last = game.history({ verbose: true }).slice(-1)[0];
  var chk = game.inCheck() ? kingSq(game.turn()) : null;
  var tg = {};
  S.targets.forEach(function (m) { tg[m.to] = m.captured || (m.flags && m.flags.indexOf('e') >= 0) ? 'cap' : 't'; });
  for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) {
    var sq = sqAt(r, c), el = cells[r * 8 + c], p = game.get(sq);
    var f = FILES.indexOf(sq[0]), k = +sq[1];
    var cls = 'sq' + ((f + k) % 2 === 0 ? ' l' : '');
    if (last && (last.from === sq || last.to === sq)) cls += ' last';
    if (S.hint && (S.hint[0] === sq || S.hint[1] === sq)) cls += ' hint';
    if (S.sel === sq) cls += ' sel';
    if (chk === sq) cls += ' chk';
    if (tg[sq]) cls += ' tgt' + (tg[sq] === 'cap' ? ' cap' : '');
    if (S.cur === sq) cls += ' cur';
    el.className = cls;
    var html = '';
    if (c === 0) html += '<span class="co r">' + k + '</span>';
    if (r === 7) html += '<span class="co f">' + sq[0] + '</span>';
    if (p) html += '<div class="pc ' + p.color + p.type + (S.drag && S.drag.moved && S.drag.from === sq ? ' dragging' : '') + '"></div>';
    el.innerHTML = html;
    el.setAttribute('data-sq', sq);
  }
  renderInfo(); renderMoves(); updateUI();
}

function renderInfo() {
  var counts = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } }, mat = { w: 0, b: 0 };
  game.board().forEach(function (row) { row.forEach(function (p) { if (p && p.type !== 'k') { counts[p.color][p.type]++; mat[p.color] += VAL[p.type]; } }); });
  function capsHtml(color) { // Figuren, die "color" geschlagen hat
    var o = opp(color), h = '';
    ['q', 'r', 'b', 'n', 'p'].forEach(function (t) { for (var n = Math.max(0, START_COUNT[t] - counts[o][t]); n > 0; n--) h += '<span class="pc ' + o + t + '"></span>'; });
    var adv = mat[color] - mat[o];
    if (adv > 0) h += '<span class="adv">+' + adv + '</span>';
    return h;
  }
  function nameHtml(color) {
    var n;
    if (!S.started) n = tt(color === 'w' ? 'white' : 'black');
    else if (S.mode === 'ai') n = color === S.human ? tt('you') : tt('computer') + ' · ' + tt('lvShort', { n: S.level + 1 });
    else n = tt(color === 'w' ? 'white' : 'black');
    var think = S.thinking && S.mode === 'ai' && color !== S.human ? '<span class="think">…</span>' : '';
    return '<span class="dot ' + color + '"></span>' + n + think;
  }
  var top = opp(S.orient), bot = S.orient, turn = S.started && !S.over ? game.turn() : null;
  $('name-top').innerHTML = nameHtml(top); $('caps-top').innerHTML = capsHtml(top);
  $('name-bot').innerHTML = nameHtml(bot); $('caps-bot').innerHTML = capsHtml(bot);
  $('info-top').classList.toggle('turn', turn === top);
  $('info-bot').classList.toggle('turn', turn === bot);

  var st = $('status'), txt, alert = false;
  if (!S.started) txt = tt('pickMenu');
  else if (S.over) { txt = resultTitle() + ' – ' + reasonText(); alert = true; }
  else if (S.thinking) txt = tt('thinking');
  else if (S.hintReq) txt = tt('hintSearch');
  else if (S.flash) txt = S.flash();
  else {
    txt = S.mode === 'ai' ? (game.turn() === S.human ? tt('yourTurn') : tt('thinking')) : tt(game.turn() === 'w' ? 'turnW' : 'turnB');
    if (game.inCheck()) { txt += ' · ' + tt('check'); alert = true; }
  }
  st.textContent = txt;
  st.classList.toggle('alert', alert);
}

function renderMoves() {
  var h = game.history(), ol = $('moves'), html = '';
  for (var i = 0; i < h.length; i += 2) {
    html += '<li><span' + (i === h.length - 1 ? ' class="now"' : '') + '>' + h[i] + '</span>' +
      (h[i + 1] ? '<span' + (i + 1 === h.length - 1 ? ' class="now"' : '') + '>' + h[i + 1] + '</span>' : '') + '</li>';
  }
  ol.innerHTML = html;
  $('moves-empty').hidden = h.length > 0;
}

// ---------- Overlays ----------
function showMsg(specFn) { S.msgSpec = specFn; ovMsg.hidden = false; renderMsg(true); }
function renderMsg(focus) {
  if (ovMsg.hidden || !S.msgSpec) return;
  var s = S.msgSpec();
  $('msg-title').textContent = s.title;
  $('msg-sub').textContent = s.sub || ''; $('msg-sub').hidden = !s.sub;
  var mc = $('msg-code');
  if (s.code) { mc.hidden = false; mc.innerHTML = ''; mc.appendChild(document.createTextNode(tt('codeFor'))); var b = document.createElement('b'); b.textContent = s.code; mc.appendChild(b); }
  else mc.hidden = true;
  var box = $('msg-btns'); box.innerHTML = '';
  s.btns.forEach(function (bt) {
    var e = document.createElement('button'); e.type = 'button'; e.className = 'mode' + (bt.hot ? ' hot' : ''); e.textContent = bt.t;
    e.addEventListener('click', function () { Sound.unlock(); bt.fn(); });
    box.appendChild(e);
  });
  if (focus) { var hot = box.querySelector('.hot') || box.firstChild; if (hot) hot.focus({ preventScroll: true }); }
  updateUI();
}
function closeMsg() { ovMsg.hidden = true; S.msgSpec = null; updateUI(); }

function openMenu() {
  if (S.drag) endDrag();
  ovMenu.hidden = false; syncMenu();
  var hot = $('m-start'); hot.focus({ preventScroll: true });
  updateUI();
}
function closeMenu() { ovMenu.hidden = true; updateUI(); }
function syncMenu() {
  ovMenu.classList.toggle('ai', M.mode === 'ai'); ovMenu.classList.toggle('pvp', M.mode === 'pvp');
  qa('[data-mode]', ovMenu).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-mode') === M.mode); });
  qa('[data-color]', ovMenu).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-color') === M.color); });
  qa('[data-flip]', ovMenu).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-flip') === M.flip); });
  if (M.level >= unlocked) M.level = unlocked - 1;
  var lv = $('lv-sel'); lv.innerHTML = '';
  LEVELS.forEach(function (L, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'opt' + (i === M.level ? ' on' : '');
    b.textContent = i < unlocked ? String(i + 1) : '🔒';
    b.disabled = i >= unlocked;
    b.setAttribute('aria-label', tt('lvShort', { n: i + 1 }) + ' · ' + lvName(i));
    b.addEventListener('click', function () { M.level = i; syncMenu(); });
    lv.appendChild(b);
  });
  $('lv-name').textContent = tt('lvShort', { n: M.level + 1 }) + ' · ' + lvName(M.level);
  var res = $('m-resume');
  var running = S.started && !S.over;
  res.hidden = !(running || (!S.started && loadSaved()));
  res.textContent = running ? tt('backGame') : tt('resumeGame');
}
qa('[data-mode]', ovMenu).forEach(function (b) { b.addEventListener('click', function () { M.mode = b.getAttribute('data-mode'); syncMenu(); }); });
qa('[data-color]', ovMenu).forEach(function (b) { b.addEventListener('click', function () { M.color = b.getAttribute('data-color'); syncMenu(); }); });
qa('[data-flip]', ovMenu).forEach(function (b) { b.addEventListener('click', function () { M.flip = b.getAttribute('data-flip'); syncMenu(); }); });
function startFromMenu() {
  Sound.unlock();
  var human = M.color === 'r' ? (Math.random() < 0.5 ? 'w' : 'b') : M.color;
  newGame({ mode: M.mode, level: M.level, human: human, autoflip: M.flip === '1' });
}
$('m-start').addEventListener('click', startFromMenu);
$('m-resume').addEventListener('click', function () {
  Sound.unlock();
  if (S.started && !S.over) { closeMenu(); focusBoard(); return; }
  var d = loadSaved(); if (!d) { syncMenu(); return; }
  newGame({ mode: d.mode === 'pvp' ? 'pvp' : 'ai', level: Math.min(LEVELS.length - 1, d.level | 0), human: d.human === 'b' ? 'b' : 'w', autoflip: !!d.autoflip, orient: d.orient === 'b' ? 'b' : (d.orient === 'w' ? 'w' : null) }, d.moves);
});

// Cheatcodes
var cheatForm = $('cheat'), cheatIn = $('cheat-in'), cheatMsg = $('cheat-msg'), cheatSpec = null;
cheatForm.addEventListener('submit', function (e) {
  e.preventDefault(); Sound.unlock();
  var code = cheatIn.value.trim().toUpperCase(), idx = -1;
  for (var i = 1; i < LEVELS.length; i++) if (LEVELS[i].code === code) idx = i;
  if (idx < 0) { cheatSpec = function () { return tt('badCode'); }; cheatMsg.textContent = cheatSpec(); cheatMsg.className = 'cheat-msg err'; return; }
  cheatSpec = null; cheatMsg.textContent = ''; cheatMsg.className = 'cheat-msg'; cheatIn.value = ''; cheatIn.blur();
  if (idx + 1 > unlocked) { unlocked = idx + 1; store(K_UNLOCK, String(unlocked)); renderLevelList(); }
  M.mode = 'ai'; M.level = idx;
  var human = M.color === 'r' ? (Math.random() < 0.5 ? 'w' : 'b') : M.color;
  newGame({ mode: 'ai', level: idx, human: human });
});
cheatIn.addEventListener('keydown', function (e) { if (e.key === 'Escape') cheatIn.blur(); e.stopPropagation(); });
cheatIn.addEventListener('input', function () { if (cheatSpec) { cheatSpec = null; cheatMsg.textContent = ''; } });

// Bauernumwandlung
function openPromo(from, to) {
  S.promo = { from: from, to: to };
  var box = $('promo'), c = game.turn(); box.innerHTML = '';
  ['q', 'r', 'b', 'n'].forEach(function (t, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pc ' + c + t;
    b.setAttribute('aria-label', t.toUpperCase() + ' (' + (i + 1) + ')');
    b.addEventListener('click', function () { var p = S.promo; closePromo(); if (p) applyMove({ from: p.from, to: p.to, promotion: t }); });
    box.appendChild(b);
  });
  ovPromo.hidden = false; box.firstChild.focus({ preventScroll: true });
  updateUI();
}
function closePromo() { ovPromo.hidden = true; S.promo = null; updateUI(); }
ovPromo.addEventListener('click', function (e) { if (e.target === ovPromo) { closePromo(); deselect(); focusBoard(); } });

// ---------- Zeiger (Maus, Touch, Stift) ----------
function sqFromPoint(x, y) {
  var r = board.getBoundingClientRect();
  var c = Math.floor((x - r.left) / r.width * 8), w = Math.floor((y - r.top) / r.height * 8);
  if (c < 0 || c > 7 || w < 0 || w > 7) return null;
  return sqAt(w, c);
}
board.addEventListener('pointerdown', function (e) {
  if (e.button > 0 || overlayOpen()) return;
  Sound.unlock();
  board.classList.remove('kb');
  var sq = sqFromPoint(e.clientX, e.clientY); if (!sq) return;
  e.preventDefault();
  board.focus({ preventScroll: true });
  if (S.sel && S.sel !== sq && tryMove(S.sel, sq)) return;
  if (!canPick(sq)) { deselect(); return; }
  var wasSel = S.sel === sq;
  if (!wasSel) select(sq);
  S.drag = { from: sq, x: e.clientX, y: e.clientY, moved: false, wasSel: wasSel, id: e.pointerId };
  try { board.setPointerCapture(e.pointerId); } catch (er) {}
});
board.addEventListener('pointermove', function (e) {
  var d = S.drag; if (!d || e.pointerId !== d.id) return;
  if (!d.moved && Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) < 7) return;
  if (!d.moved) {
    d.moved = true;
    var p = game.get(d.from), size = board.getBoundingClientRect().width / 8 * 1.12;
    ghost.className = 'ghost pc ' + p.color + p.type; ghost.style.width = ghost.style.height = size + 'px'; ghost.hidden = false;
    render();
  }
  ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px';
  var over = sqFromPoint(e.clientX, e.clientY);
  cells.forEach(function (c) { c.classList.toggle('over', c.getAttribute('data-sq') === over && over !== d.from); });
});
function endDrag() {
  ghost.hidden = true;
  cells.forEach(function (c) { c.classList.remove('over'); });
  var d = S.drag; S.drag = null;
  if (d && d.moved) render();
  return d;
}
board.addEventListener('pointerup', function (e) {
  var d = S.drag; if (!d || e.pointerId !== d.id) return;
  var to = sqFromPoint(e.clientX, e.clientY);
  endDrag();
  if (d.moved) { if (to && to !== d.from) tryMove(d.from, to); }
  else if (d.wasSel) deselect();
});
board.addEventListener('pointercancel', function () { endDrag(); });
board.addEventListener('contextmenu', function (e) { e.preventDefault(); });

// ---------- Tastatur ----------
function typing(e) { var t = e.target; return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable); }
function focusBoard() { if (!overlayOpen()) board.focus({ preventScroll: true }); }
window.addEventListener('keydown', function (e) {
  if (typing(e) || e.ctrlKey || e.metaKey || e.altKey) return;
  var k = e.key, ae = document.activeElement;
  var onBoard = ae === board || ae === document.body || ae === null;
  if (!ovPromo.hidden) {
    var map = { 1: 'q', 2: 'r', 3: 'b', 4: 'n', q: 'q', r: 'r', b: 'b', n: 'n' }, t = map[k.toLowerCase()];
    if (t) { e.preventDefault(); var p = S.promo; closePromo(); if (p) applyMove({ from: p.from, to: p.to, promotion: t }); }
    else if (k === 'Escape') { e.preventDefault(); closePromo(); deselect(); focusBoard(); }
    return;
  }
  if (k === 'Escape') {
    if (S.sel) { e.preventDefault(); deselect(); return; }
    if (!ovMenu.hidden && S.started) { e.preventDefault(); closeMenu(); focusBoard(); return; }
    if (shell.classList.contains('pseudo-fs')) { e.preventDefault(); pseudo(false); }
    return;
  }
  if (k === 'f' || k === 'F') { e.preventDefault(); toggleFS(); return; }
  if (k === 'm' || k === 'M') { e.preventDefault(); Sound.unlock(); Sound.toggle(); updateUI(); return; }
  if (overlayOpen()) return;
  var dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
  if (dirs[k] && onBoard) {
    e.preventDefault();
    board.classList.add('kb');
    var rc = rcOf(S.cur), nr = Math.max(0, Math.min(7, rc.r + dirs[k][0])), nc = Math.max(0, Math.min(7, rc.c + dirs[k][1]));
    S.cur = sqAt(nr, nc); render(); return;
  }
  if ((k === 'Enter' || k === ' ') && onBoard) { e.preventDefault(); Sound.unlock(); board.classList.add('kb'); activate(S.cur); return; }
  var lk = k.toLowerCase();
  if (lk === 'u' || k === 'Backspace') { e.preventDefault(); undo(); }
  else if (lk === 'r') { e.preventDefault(); flip(); }
  else if (lk === 'h') { e.preventDefault(); hint(); }
  else if (lk === 'n') { e.preventDefault(); openMenu(); }
});
board.addEventListener('focus', function () { if (!board.classList.contains('kb') && S.started && !S.over) { /* Rahmen erst bei Tastaturnutzung */ } });

// ---------- Touch-Erkennung ----------
function markTouch() { document.body.classList.add('is-touch'); fit(); }
if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) document.body.classList.add('is-touch');
window.addEventListener('touchstart', markTouch, { passive: true, once: true });
qa('#touch .tbtn').forEach(function (b) {
  b.addEventListener('click', function () {
    Sound.unlock();
    var k = b.getAttribute('data-k');
    if (k === 'menu') { if (ovMenu.hidden) openMenu(); else if (S.started) { closeMenu(); } }
    else if (k === 'undo') undo(); else if (k === 'flip') flip(); else if (k === 'hint') hint(); else if (k === 'fs') toggleFS();
    b.blur();
  });
});

// ---------- Größe / Vollbild ----------
var lastBs = 0;
function fit() {
  var cs = getComputedStyle(stage), w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), size = w;
  if (isFS()) {
    var touch = $('touch'), extra = $('info-top').offsetHeight + $('info-bot').offsetHeight + $('status').offsetHeight + 28;
    size = Math.min(w, shell.clientHeight - (touch.offsetParent ? touch.offsetHeight : 0) - extra);
  }
  size = Math.max(160, Math.floor(size / 8) * 8);
  if (size !== lastBs) { lastBs = size; stage.style.setProperty('--bs', size + 'px'); }
}
function isFS() { return !!(document.fullscreenElement || document.webkitFullscreenElement) || shell.classList.contains('pseudo-fs'); }
function pseudo(on) { shell.classList.toggle('pseudo-fs', on); document.body.classList.toggle('no-scroll', on); lastBs = 0; fit(); updateUI(); }
function toggleFS() {
  if (shell.classList.contains('pseudo-fs')) { pseudo(false); return; }
  if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  var req = shell.requestFullscreen || shell.webkitRequestFullscreen;
  if (req) {
    try { var pr = req.call(shell, { navigationUI: 'hide' }); if (pr && pr.catch) pr.catch(function () { pseudo(true); }); }
    catch (e) { pseudo(true); }
  } else pseudo(true);
  focusBoard();
}
function onFsChange() { lastBs = 0; setTimeout(fit, 30); updateUI(); }
document.addEventListener('fullscreenchange', onFsChange);
document.addEventListener('webkitfullscreenchange', onFsChange);
window.addEventListener('resize', fit);
if (window.ResizeObserver) new ResizeObserver(function () { fit(); }).observe(shell);

// ---------- Seitensteuerung ----------
var bUndo = $('b-undo'), bHint = $('b-hint'), bResign = $('b-resign'), bSound = $('b-sound'), bFs = $('b-fs'), bLang = $('lang');
function updateUI() {
  var canUndo = S.started && game.history().length > 0;
  var canHint = S.started && !S.over && !S.thinking && !S.hintReq && !isAiTurn();
  bUndo.disabled = !canUndo; bHint.disabled = !canHint; bResign.disabled = !(S.started && !S.over);
  qa('#touch [data-k="undo"]')[0].disabled = !canUndo; qa('#touch [data-k="hint"]')[0].disabled = !canHint;
  bSound.textContent = tt(Sound.isOn() ? 'soundOn' : 'soundOff');
  bSound.setAttribute('aria-pressed', Sound.isOn() ? 'true' : 'false');
  bFs.textContent = tt(isFS() ? 'fsOff' : 'fs');
}
function after(fn) { return function (e) { Sound.unlock(); fn(e); e.currentTarget.blur(); focusBoard(); }; }
$('b-menu').addEventListener('click', after(function () { openMenu(); }));
bUndo.addEventListener('click', after(undo));
$('b-flip').addEventListener('click', after(flip));
bHint.addEventListener('click', after(hint));
bResign.addEventListener('click', after(resign));
bSound.addEventListener('click', after(function () { Sound.toggle(); updateUI(); }));
bFs.addEventListener('click', after(toggleFS));
$('b-pgn').addEventListener('click', function (e) {
  var done = function (ok) { S.flash = function () { return tt(ok ? 'pgnCopied' : 'pgnFail'); }; render(); };
  var txt = game.pgn();
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { done(false); });
  else done(false);
  e.currentTarget.blur();
});

function renderLevelList() {
  var box = $('lv-list'); box.innerHTML = '';
  LEVELS.forEach(function (L, i) {
    var d = document.createElement('div'), s = document.createElement('strong'), p = document.createElement('p'), q = document.createElement('p');
    s.textContent = tt('lvShort', { n: i + 1 }) + ' · ' + lvName(i);
    p.textContent = L.movetime ? tt('lvDescT', { s: L.skill, t: String(L.movetime / 1000).replace('.', LANG === 'de' ? ',' : '.') }) : tt('lvDescD', { s: L.skill, d: L.depth });
    q.textContent = i < unlocked ? tt('unlockedL') : tt('locked');
    d.appendChild(s); d.appendChild(p); d.appendChild(q); box.appendChild(d);
  });
}

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
  qa('[data-t]').forEach(function (el) {
    var k = el.getAttribute('data-t');
    if (k === 'h1') { el.firstChild.nodeValue = tt('h1'); return; }
    el.textContent = tt(k);
  });
  qa('[data-ta]').forEach(function (el) { el.setAttribute('aria-label', tt(el.getAttribute('data-ta'))); });
  bLang.textContent = tt('langBtn');
  $('mode').textContent = document.documentElement.getAttribute('data-theme') === 'light' ? tt('dark') : tt('light');
  if (cheatSpec) cheatMsg.textContent = cheatSpec();
  if (S.started) setHeaders();
  if (!ovMenu.hidden) syncMenu();
  renderMsg(false); renderLevelList(); render();
  store('lang', l);
}
bLang.addEventListener('click', function (e) { applyLang(LANG === 'en' ? 'de' : 'en'); e.currentTarget.blur(); });

// ---------- Start ----------
applyLang(LANG);
fit();
openMenu();

// Für Tests im Browser
window.__chess = { game: game, S: S, M: M, LEVELS: LEVELS, Engine: Engine, newGame: newGame, applyMove: applyMove, undo: undo, hint: hint, resign: resign, flip: flip, activate: activate, applyLang: applyLang, get unlocked() { return unlocked; } };
