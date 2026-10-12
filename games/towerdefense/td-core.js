/* Orbital Defense – game logic (no DOM, testable in Node)
   by Martin Sucker | github.com/DerSucker | www.martinsucker.de */
(function (root) {
  'use strict';

  var COLS = 16, ROWS = 10;
  var UNLOCK_LI = 10; // level index from which new towers and enemies appear (level 11)

  /* Towers: 3 stages each (base + 2 upgrades). u = upgrade cost to reach this stage.
     r = range (tiles), d = damage (per hit, or per second for beams), f = shots per second,
     s = splash radius, sl = slow factor, c = chain targets, p = ignores armor,
     beam = continuous beam ramping up to x3, push = knockback tiles, stun = seconds */
  var TOWERS = [
    { id: 'laser',  key: '1', cost: 50,  lv: [
      { r: 2.5, d: 8,  f: 4 },
      { r: 2.8, d: 14, f: 4.5, u: 60 },
      { r: 3.1, d: 24, f: 5,   u: 110 } ] },
    { id: 'plasma', key: '2', cost: 90,  lv: [
      { r: 2.6, d: 22, f: 0.9, s: 0.9 },
      { r: 2.9, d: 38, f: 1,   s: 1,    u: 90 },
      { r: 3.2, d: 62, f: 1.1, s: 1.15, u: 160 } ] },
    { id: 'cryo',   key: '3', cost: 70,  lv: [
      { r: 2,   d: 3,  f: 1, sl: 0.35 },
      { r: 2.3, d: 6,  f: 1, sl: 0.45, u: 70 },
      { r: 2.6, d: 10, f: 1, sl: 0.55, u: 120 } ] },
    { id: 'rail',   key: '4', cost: 130, lv: [
      { r: 4.5, d: 70,  f: 0.45, p: 1 },
      { r: 5,   d: 130, f: 0.5,  p: 1, u: 120 },
      { r: 5.5, d: 230, f: 0.55, p: 1, u: 200 } ] },
    { id: 'tesla',  key: '5', cost: 110, lv: [
      { r: 2.4, d: 14, f: 1.2, c: 3 },
      { r: 2.6, d: 22, f: 1.4, c: 4, u: 100 },
      { r: 2.9, d: 34, f: 1.6, c: 6, u: 170 } ] },
    { id: 'prism',  key: '6', cost: 150, unlock: UNLOCK_LI, lv: [
      { r: 3,   d: 30, beam: 1 },
      { r: 3.3, d: 55, beam: 1, u: 140 },
      { r: 3.6, d: 95, beam: 1, u: 230 } ] },
    { id: 'grav',   key: '7', cost: 120, unlock: UNLOCK_LI, lv: [
      { r: 2,   d: 5,  f: 0.4,  push: 0.8, stun: 0.4 },
      { r: 2.3, d: 10, f: 0.45, push: 1.1, stun: 0.6, u: 110 },
      { r: 2.6, d: 18, f: 0.5,  push: 1.5, stun: 0.8, u: 180 } ] }
  ];

  /* Enemies: hp, sp = tiles/s, rw = credits, armor = flat damage reduction, dmg = core damage */
  var ENEMIES = {
    drone:    { hp: 28,  sp: 2.1,  rw: 5,  armor: 0, dmg: 1, size: 0.26, gap: 0.45 },
    cyborg:   { hp: 75,  sp: 1.25, rw: 9,  armor: 1, dmg: 1, size: 0.32, gap: 0.75 },
    walker:   { hp: 240, sp: 0.72, rw: 22, armor: 4, dmg: 2, size: 0.4,  gap: 1.4 },
    shield:   { hp: 110, sp: 1.0,  rw: 14, armor: 0, dmg: 1, size: 0.32, gap: 0.9, shield: 90 },
    splitter: { hp: 150, sp: 0.9,  rw: 12, armor: 2, dmg: 2, size: 0.36, gap: 1.1, split: 3 },
    phaser:   { hp: 85,  sp: 1.35, rw: 12, armor: 1, dmg: 1, size: 0.3,  gap: 0.7, blink: 1.6 }
  };

  /* Levels: waypoints are grid cells; -1 / COLS / ROWS = off-grid entry or exit */
  var LEVELS = [
    { code: null,         hp: 1.15, credits: 200, waves: 5,  paths: [[[-1,2],[5,2],[5,7],[11,7],[11,3],[16,3]]] },
    { code: 'ASTEROID',   hp: 1.15, credits: 230, waves: 5,  paths: [[[-1,7],[3,7],[3,2],[8,2],[8,8],[13,8],[13,4],[16,4]]] },
    { code: 'MARS',       hp: 1.00, credits: 260, waves: 6,  paths: [[[4,-1],[4,4],[10,4],[10,1],[14,1],[14,8],[2,8],[2,10]]] },
    { code: 'JUPITER',    hp: 1.10, credits: 290, waves: 6,  paths: [[[-1,1],[13,1],[13,4],[2,4],[2,7],[13,7],[13,10]]] },
    { code: 'SATURN',     hp: 1.35, credits: 320, waves: 7,  paths: [[[-1,8],[12,8],[12,2],[4,2],[4,5],[9,5],[9,-1]]] },
    { code: 'NEBULA',     hp: 0.75, credits: 360, waves: 7,  paths: [[[-1,2],[7,2],[7,5],[16,5]], [[-1,8],[7,8],[7,5],[16,5]]] },
    { code: 'COMET',      hp: 1.15, credits: 400, waves: 8,  paths: [[[8,-1],[8,2],[2,2],[2,7],[6,7],[6,4],[11,4],[11,8],[14,8],[14,-1]]] },
    { code: 'PULSAR',     hp: 0.85, credits: 440, waves: 8,  paths: [[[-1,1],[4,1],[4,5],[10,5],[10,9],[16,9]], [[16,1],[12,1],[12,5],[10,5],[10,9],[16,9]]] },
    { code: 'WARP',       hp: 1.05, credits: 480, waves: 9,  paths: [[[-1,0],[14,0],[14,3],[1,3],[1,6],[14,6],[14,9],[-1,9]]] },
    { code: 'BLACKHOLE',  hp: 0.65, credits: 540, waves: 10, paths: [[[7,-1],[7,2],[2,2],[2,5],[13,5],[13,8],[16,8]], [[-1,8],[4,8],[4,5],[13,5],[13,8],[16,8]]] },
    // --- levels 11-20: new towers (prism, gravitron) and enemies (shield, splitter, phaser) ---
    { code: 'KUIPER',     hp: 0.40, credits: 600, waves: 8,  paths: [[[-1,5],[2,5],[2,1],[6,1],[6,8],[10,8],[10,1],[14,1],[14,6],[16,6]]] },
    { code: 'OORT',       hp: 0.37, credits: 640, waves: 8,  paths: [[[-1,1],[5,1],[5,4],[16,4]], [[-1,8],[9,8],[9,4],[16,4]]] },
    { code: 'PROXIMA',    hp: 0.96, credits: 680, waves: 9,  paths: [[[-1,0],[15,0],[15,9],[1,9],[1,2],[13,2],[13,7],[3,7],[3,4],[10,4]]] },
    { code: 'BINARY',     hp: 0.23, credits: 720, waves: 9,  paths: [[[-1,1],[6,1],[6,3],[2,3],[2,6],[7,6],[7,5]], [[16,8],[12,8],[12,1],[9,1],[9,5],[7,5]]] },
    { code: 'SUPERNOVA',  hp: 0.47, credits: 760, waves: 10, paths: [[[3,-1],[3,3],[1,3],[1,8],[8,8],[8,2],[12,2],[12,7],[16,7]]] },
    { code: 'DARKMATTER', hp: 0.46, credits: 800, waves: 10, paths: [[[-1,0],[10,0],[10,4],[16,4]], [[-1,9],[4,9],[4,6],[10,6],[10,4],[16,4]]] },
    { code: 'QUASAR',     hp: 0.43, credits: 840, waves: 11, paths: [[[1,-1],[1,8],[4,8],[4,1],[7,1],[7,8],[10,8],[10,1],[13,1],[13,8],[16,8]]] },
    { code: 'ANDROMEDA',  hp: 0.30, credits: 880, waves: 11, paths: [[[-1,2],[12,2],[12,7],[16,7]], [[3,10],[3,5],[9,5],[9,-1]]] },
    { code: 'WORMHOLE',   hp: 0.39, credits: 920, waves: 12, paths: [[[-1,1],[6,1],[6,4],[16,4]], [[-1,7],[6,7],[6,4],[16,4]], [[16,8],[11,8],[11,4],[16,4]]] },
    { code: 'BIGBANG',    hp: 0.32, credits: 960, waves: 12, paths: [[[-1,0],[14,0],[14,3],[4,3],[4,5],[8,5]], [[-1,9],[14,9],[14,6],[11,6],[11,5],[8,5]]] }
  ];

  function levelByCode(code) {
    var c = String(code || '').trim().toUpperCase().replace(/[\s-]+/g, '');
    for (var i = 1; i < LEVELS.length; i++) if (LEVELS[i].code === c) return i;
    return -1;
  }
  function towerUnlocked(type, li) { return li >= (TOWERS[type].unlock || 0); }

  /* Expand waypoints to a polyline (tile units, cell centers) and a set of path cells */
  function inGrid(c, r) { return c >= 0 && c < COLS && r >= 0 && r < ROWS; }
  function buildPaths(lv) {
    var cells = {}, polys = [];
    lv.paths.forEach(function (wp) {
      var pts = [], len = [0], total = 0;
      for (var i = 0; i < wp.length; i++) {
        pts.push({ x: wp[i][0] + 0.5, y: wp[i][1] + 0.5 });
        if (i > 0) {
          var a = wp[i - 1], b = wp[i];
          var dc = Math.sign(b[0] - a[0]), dr = Math.sign(b[1] - a[1]);
          var c = a[0], r = a[1];
          while (true) {
            if (inGrid(c, r)) cells[c + ',' + r] = 1;
            if (c === b[0] && r === b[1]) break;
            c += dc; r += dr;
          }
          total += Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
          len.push(total);
        }
      }
      var f = wp[0], l = wp[wp.length - 1];
      polys.push({ pts: pts, len: len, total: total,
        startD: inGrid(f[0], f[1]) ? 0 : 1, endD: inGrid(l[0], l[1]) ? total : total - 1 });
    });
    return { cells: cells, polys: polys };
  }

  function posAt(poly, d) {
    var p = poly.pts, L = poly.len;
    if (d <= 0) return { x: p[0].x, y: p[0].y };
    for (var i = 1; i < p.length; i++) {
      if (d <= L[i]) {
        var k = (d - L[i - 1]) / (L[i] - L[i - 1]);
        return { x: p[i - 1].x + (p[i].x - p[i - 1].x) * k, y: p[i - 1].y + (p[i].y - p[i - 1].y) * k };
      }
    }
    var e = p[p.length - 1];
    return { x: e.x, y: e.y };
  }

  /* Deterministic wave composition, enemy types interleaved */
  function buildWave(li, w) {
    var L = li + 1, W = LEVELS[li].waves, last = (w === W - 1);
    var Lc = L <= 10 ? L : 10 + (L - 10) * 0.5, X = L - 10; // count level, new-level offset
    var cnt = {
      drone: Math.floor(5 + w * 2 + Lc),
      cyborg: w >= 1 ? Math.floor(2 + w + Lc / 2) : 0,
      walker: (L >= 3 && w >= 2) ? Math.floor((w - 1) / 2) + Math.floor(Lc / 3) : (L === 2 && last ? 1 : 0),
      shield: 0, splitter: 0, phaser: 0
    };
    if (X > 0) {
      cnt.shield = w >= 1 ? 1 + Math.floor(w / 2) + Math.floor(X / 3) : 0;
      cnt.phaser = w >= 1 ? 1 + Math.floor(w / 3) + Math.floor(X / 3) : 0;
      cnt.splitter = w >= 2 ? Math.floor(w / 2) + Math.floor(X / 4) : 0;
      cnt.drone = Math.floor(cnt.drone * 0.7);
    }
    var hpMul = LEVELS[li].hp * (1 + 0.5 * (L - 1)) * (1 + 0.13 * w);
    var rwMul = 1 + 0.05 * (L - 1);
    var items = [], off = { drone: 0, cyborg: 0.5, walker: 0.7, shield: 0.3, splitter: 0.85, phaser: 0.15 };
    Object.keys(cnt).forEach(function (type) {
      for (var i = 0; i < cnt[type]; i++) items.push({ type: type, k: (i + off[type]) / cnt[type] });
    });
    items.sort(function (a, b) { return a.k - b.k; });
    if (last && L >= 3) items.push({ type: 'walker', elite: true });
    var t = 0, nPaths = LEVELS[li].paths.length;
    return items.map(function (it, idx) {
      var E = ENEMIES[it.type], hp = Math.round(E.hp * hpMul * (it.elite ? 6 : 1));
      var q = { t: t, type: it.type, hp: hp, rw: Math.round(E.rw * rwMul * (it.elite ? 5 : 1)), elite: !!it.elite, path: idx % nPaths,
        shield: E.shield ? Math.round(E.shield * hpMul) : 0 };
      t += E.gap;
      return q;
    });
  }

  function createLevel(li) {
    var lv = LEVELS[li], p = buildPaths(lv);
    return {
      li: li, credits: lv.credits, lives: 20, maxLives: 20,
      wave: 0, waves: lv.waves, active: false,
      spawnQ: [], spawnT: 0, enemies: [], towers: [], shots: [], fx: [], events: [],
      cells: p.cells, polys: p.polys, status: 'build', time: 0, nextId: 1
    };
  }

  function towerAt(s, c, r) {
    for (var i = 0; i < s.towers.length; i++) if (s.towers[i].c === c && s.towers[i].r === r) return s.towers[i];
    return null;
  }

  function canBuild(s, c, r) {
    return inGrid(c, r) && !s.cells[c + ',' + r] && !towerAt(s, c, r);
  }

  function build(s, type, c, r) {
    var T = TOWERS[type];
    if (!towerUnlocked(type, s.li)) return { ok: false, err: 'locked' };
    if (!canBuild(s, c, r)) return { ok: false, err: 'blocked' };
    if (s.credits < T.cost) return { ok: false, err: 'money' };
    s.credits -= T.cost;
    var tw = { id: s.nextId++, type: type, c: c, r: r, x: c + 0.5, y: r + 0.5, lv: 0, cd: 0, spent: T.cost, ang: -Math.PI / 2, tgt: null, ramp: 1 };
    s.towers.push(tw);
    return { ok: true, tower: tw };
  }

  function upgradeCost(tw) {
    var L = TOWERS[tw.type].lv;
    return tw.lv < L.length - 1 ? L[tw.lv + 1].u : 0;
  }

  function upgrade(s, tw) {
    var cost = upgradeCost(tw);
    if (!cost) return { ok: false, err: 'max' };
    if (s.credits < cost) return { ok: false, err: 'money' };
    s.credits -= cost; tw.spent += cost; tw.lv++;
    return { ok: true };
  }

  function sellValue(tw) { return Math.floor(tw.spent * 0.7); }

  function sell(s, tw) {
    var i = s.towers.indexOf(tw);
    if (i < 0) return 0;
    s.towers.splice(i, 1);
    var v = sellValue(tw);
    s.credits += v;
    return v;
  }

  function startWave(s) {
    if (s.active || s.status !== 'build' || s.wave >= s.waves) return false;
    s.spawnQ = buildWave(s.li, s.wave);
    s.spawnT = 0; s.wave++; s.active = true;
    return true;
  }

  /* beam: continuous damage – double damage against shields, armor as percentage */
  function hurt(s, e, dmg, pierce, beam) {
    if (e.hp <= 0) return;
    e.hit = 0.08;
    if (e.shield > 0) {
      var sd = beam ? dmg * 2 : dmg, take = Math.min(e.shield, sd);
      e.shield -= take; e.sinceHit = 0;
      dmg = (sd - take) / (beam ? 2 : 1);
      if (dmg <= 0) return;
    }
    if (beam) e.hp -= dmg * Math.max(0.5, 1 - e.armor * 0.08);
    else e.hp -= pierce ? dmg : Math.max(dmg * 0.25, dmg - e.armor);
  }

  function alive(e) { return e && e.hp > 0 && !e.gone; }

  function inRange(s, x, y, r) {
    var out = [];
    for (var i = 0; i < s.enemies.length; i++) {
      var e = s.enemies[i];
      if (e.hp > 0 && (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y) <= r * r) out.push(e);
    }
    return out;
  }
  function dist2(a, x, y) { return (a.x - x) * (a.x - x) + (a.y - y) * (a.y - y); }
  function first(list) { return list.reduce(function (a, b) { return b.d > a.d ? b : a; }); }

  function beamStep(s, tw, dt) {
    var st = TOWERS[tw.type].lv[tw.lv];
    if (!alive(tw.tgt) || dist2(tw.tgt, tw.x, tw.y) > st.r * st.r) {
      var list = inRange(s, tw.x, tw.y, st.r);
      tw.tgt = list.length ? first(list) : null;
      tw.ramp = 1;
    }
    if (!tw.tgt) return;
    tw.ramp = Math.min(3, tw.ramp + dt);
    tw.ang = Math.atan2(tw.tgt.y - tw.y, tw.tgt.x - tw.x);
    hurt(s, tw.tgt, st.d * tw.ramp * dt, false, true);
  }

  function fire(s, tw) {
    var st = TOWERS[tw.type].lv[tw.lv], id = TOWERS[tw.type].id;
    var list = inRange(s, tw.x, tw.y, st.r);
    if (!list.length) return false;
    var tgt;
    if (id === 'rail') tgt = list.reduce(function (a, b) { return b.hp + (b.shield || 0) > a.hp + (a.shield || 0) ? b : a; });
    else tgt = first(list);
    tw.ang = Math.atan2(tgt.y - tw.y, tgt.x - tw.x);

    if (id === 'laser') {
      hurt(s, tgt, st.d, false);
      s.fx.push({ k: 'beam', t: 0.07, x1: tw.x, y1: tw.y, x2: tgt.x, y2: tgt.y, tw: tw.type });
    } else if (id === 'plasma') {
      s.shots.push({ x: tw.x, y: tw.y, tx: tgt.x, ty: tgt.y, tgt: tgt, sp: 7, d: st.d, s: st.s, tw: tw.type });
    } else if (id === 'cryo') {
      list.forEach(function (e) {
        hurt(s, e, st.d, false);
        e.slow = Math.max(e.slow, st.sl);
        e.slowT = 1.5;
      });
      s.fx.push({ k: 'ring', t: 0.35, max: 0.35, x: tw.x, y: tw.y, r: st.r, tw: tw.type });
    } else if (id === 'rail') {
      hurt(s, tgt, st.d, true);
      var dx = tgt.x - tw.x, dy = tgt.y - tw.y, n = Math.hypot(dx, dy) || 1;
      s.fx.push({ k: 'rail', t: 0.22, max: 0.22, x1: tw.x, y1: tw.y, x2: tw.x + dx / n * st.r, y2: tw.y + dy / n * st.r, tw: tw.type });
    } else if (id === 'tesla') {
      var hit = [tgt], pts = [{ x: tw.x, y: tw.y }, { x: tgt.x, y: tgt.y }], cur = tgt, dmg = st.d;
      hurt(s, tgt, dmg, false);
      for (var j = 1; j < st.c; j++) {
        var best = null, bd = 1.6 * 1.6;
        for (var k = 0; k < s.enemies.length; k++) {
          var e = s.enemies[k];
          if (e.hp <= 0 || hit.indexOf(e) >= 0) continue;
          var dd = dist2(e, cur.x, cur.y);
          if (dd < bd) { bd = dd; best = e; }
        }
        if (!best) break;
        dmg *= 0.85; hurt(s, best, dmg, false);
        hit.push(best); pts.push({ x: best.x, y: best.y }); cur = best;
      }
      s.fx.push({ k: 'chain', t: 0.15, pts: pts, tw: tw.type });
    } else if (id === 'grav') {
      list.forEach(function (e) {
        var k = e.elite ? 0.25 : (e.type === 'walker' ? 0.5 : 1);
        e.d = Math.max(0, e.d - st.push * k);
        e.stunT = Math.max(e.stunT, st.stun * k);
        var p = posAt(s.polys[e.path], e.d); e.x = p.x; e.y = p.y;
        hurt(s, e, st.d, false);
      });
      s.fx.push({ k: 'grav', t: 0.45, max: 0.45, x: tw.x, y: tw.y, r: st.r, tw: tw.type });
    }
    return true;
  }

  function spawnEnemy(s, o) {
    var E = ENEMIES[o.type], poly = s.polys[o.path], p0 = posAt(poly, o.d || 0);
    var e = {
      id: s.nextId++, type: o.type, hp: o.hp, maxHp: o.hp, rw: o.rw, elite: !!o.elite,
      armor: E.armor * (o.elite ? 2 : 1), sp: E.sp * (o.elite ? 0.8 : 1), dmg: o.elite ? 5 : E.dmg,
      size: (o.size || E.size) * (o.elite ? 1.35 : 1), path: o.path, d: o.d || 0, x: p0.x, y: p0.y,
      slow: 0, slowT: 0, stunT: 0, hit: 0, ph: Math.random() * 6,
      shield: o.shield || 0, maxShield: o.shield || 0, sinceHit: 9,
      blinkT: E.blink ? 2.5 : 0, mini: !!o.mini
    };
    s.enemies.push(e);
    return e;
  }

  function removeEnemy(s, i) { s.enemies[i].gone = true; s.enemies.splice(i, 1); }

  function step(s, dt) {
    if (s.status !== 'build') return;
    s.time += dt;

    // spawn
    if (s.active) {
      s.spawnT += dt;
      while (s.spawnQ.length && s.spawnQ[0].t <= s.spawnT) spawnEnemy(s, s.spawnQ.shift());
    }

    // move enemies
    for (var i = s.enemies.length - 1; i >= 0; i--) {
      var e = s.enemies[i], E = ENEMIES[e.type], pl = s.polys[e.path];
      if (e.slowT > 0) { e.slowT -= dt; if (e.slowT <= 0) e.slow = 0; }
      if (e.hit > 0) e.hit -= dt;
      if (e.maxShield) {
        e.sinceHit += dt;
        if (e.sinceHit > 2 && e.shield < e.maxShield) e.shield = Math.min(e.maxShield, e.shield + e.maxShield * 0.25 * dt);
      }
      if (e.stunT > 0) { e.stunT -= dt; continue; }
      e.d += e.sp * (1 - e.slow) * dt;
      if (E.blink) {
        e.blinkT -= dt;
        if (e.blinkT <= 0) {
          var from = { x: e.x, y: e.y };
          e.d = Math.min(e.d + E.blink, pl.total - 0.05); e.blinkT = 2.5;
          var to = posAt(pl, e.d);
          s.fx.push({ k: 'blink', t: 0.3, max: 0.3, x1: from.x, y1: from.y, x2: to.x, y2: to.y, type: e.type });
        }
      }
      if (e.d >= pl.total) {
        removeEnemy(s, i);
        s.lives = Math.max(0, s.lives - e.dmg);
        s.events.push({ k: 'leak', x: e.x, y: e.y });
        continue;
      }
      var p = posAt(pl, e.d); e.x = p.x; e.y = p.y;
    }
    if (s.lives <= 0) { s.status = 'lost'; s.events.push({ k: 'lost' }); return; }

    // towers
    s.towers.forEach(function (tw) {
      var st = TOWERS[tw.type].lv[tw.lv];
      if (st.beam) { beamStep(s, tw, dt); return; }
      tw.cd -= dt;
      if (tw.cd <= 0) {
        if (fire(s, tw)) tw.cd = 1 / st.f;
        else tw.cd = 0;
      }
    });

    // projectiles
    for (var j = s.shots.length - 1; j >= 0; j--) {
      var sh = s.shots[j];
      if (sh.tgt && sh.tgt.hp > 0 && !sh.tgt.gone) { sh.tx = sh.tgt.x; sh.ty = sh.tgt.y; }
      var dx = sh.tx - sh.x, dy = sh.ty - sh.y, dist = Math.hypot(dx, dy), mv = sh.sp * dt;
      if (dist <= mv) {
        inRange(s, sh.tx, sh.ty, sh.s).forEach(function (en) { hurt(s, en, sh.d, false); });
        s.fx.push({ k: 'boom', t: 0.3, max: 0.3, x: sh.tx, y: sh.ty, r: sh.s, tw: sh.tw });
        s.shots.splice(j, 1);
      } else { sh.x += dx / dist * mv; sh.y += dy / dist * mv; }
    }

    // deaths (splitters release mini drones)
    for (var k = s.enemies.length - 1; k >= 0; k--) {
      var en = s.enemies[k];
      if (en.hp <= 0) {
        s.credits += en.rw;
        s.fx.push({ k: 'pop', t: 0.4, max: 0.4, x: en.x, y: en.y, type: en.type, r: en.size });
        s.events.push({ k: 'kill', rw: en.rw, x: en.x, y: en.y });
        removeEnemy(s, k);
        var n = ENEMIES[en.type].split;
        if (n) for (var m = 0; m < n; m++) {
          spawnEnemy(s, { type: 'drone', hp: Math.max(1, Math.round(en.maxHp * 0.3)), rw: 2, path: en.path,
            d: Math.max(0, en.d + (m - (n - 1) / 2) * 0.3), size: 0.2, mini: true });
        }
      }
    }

    // fx timers
    for (var f = s.fx.length - 1; f >= 0; f--) { s.fx[f].t -= dt; if (s.fx[f].t <= 0) s.fx.splice(f, 1); }

    // wave end
    if (s.active && !s.spawnQ.length && !s.enemies.length) {
      s.active = false;
      var bonus = 25 + 5 * (s.wave - 1);
      s.credits += bonus;
      s.events.push({ k: 'wave', bonus: bonus, n: s.wave });
      if (s.wave >= s.waves) { s.status = 'won'; s.events.push({ k: 'won' }); }
    }
  }

  var api = {
    COLS: COLS, ROWS: ROWS, TOWERS: TOWERS, ENEMIES: ENEMIES, LEVELS: LEVELS, UNLOCK_LI: UNLOCK_LI,
    levelByCode: levelByCode, towerUnlocked: towerUnlocked, createLevel: createLevel, buildWave: buildWave,
    canBuild: canBuild, build: build, towerAt: towerAt, upgrade: upgrade, upgradeCost: upgradeCost,
    sell: sell, sellValue: sellValue, startWave: startWave, step: step, posAt: posAt
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TDCore = api;
})(this);
