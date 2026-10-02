const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

function loadGame() {
  const element = () => ({
    style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {}, setAttribute() {}, appendChild() {}, getContext() { return {}; },
    querySelectorAll: () => [],
  });
  const context = vm.createContext({
    document: { getElementById: element, createElement: element, addEventListener() {} },
    window: { addEventListener() {}, matchMedia: () => ({ matches: false }) },
    location: { search: '', hash: '' }, URLSearchParams,
    localStorage: { getItem: () => null, setItem() {} },
    performance: { now: () => 0 }, ResizeObserver: class { observe() {} },
    setTimeout() {}, clearTimeout() {},
  });
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  // Run the real game functions without starting the browser animation loop.
  const end = source.lastIndexOf('  if (window.claude && window.claude.hot && window.claude.hot.snapshot)');
  assert.ok(end > 0, 'browser startup boundary is present');
  vm.runInContext(source.slice(0, end) + `
    globalThis.game = {
      newGame, createLine, deleteLine, addTrain, arrive, updateTrain, rebuildAll, pointAt, trainCarPosition,
      project(g, width, height, inset = 0) {
        W = width; H = height; mapBottomInset = inset;
        syncScreen(g); rebuildAll(g);
      },
      setup() { W = 1280; H = 800; }
    };
  })();`, context);
  context.game.setup();
  return context.game;
}

function fixture(api, mode = 'rivals', reverse = false) {
  const g = api.newGame('drybasin', mode, 12345, false);
  g.stations = [
    { id: 1, rx: 400, ry: 240, x: 400, y: 240, shape: 'circle', passengers: [], owner: 0 },
    { id: 2, rx: 800, ry: 400, x: 800, y: 400, shape: 'triangle', passengers: [], owner: 1 },
    { id: 3, rx: 600, ry: 560, x: 600, y: 560, shape: 'square', passengers: [], owner: 0 },
  ];
  g.nextId = 4;
  if (reverse) api.createLine(g, 1, 2, 4, 1);
  api.createLine(g, 1, 2, 0, 0);
  if (g.coop && !reverse) api.createLine(g, 1, 2, 4, 1);
  g.stations[1].passengers = Array.from({ length: 8 }, () => ({ d: 'circle', born: 0 }));
  return g;
}

function simulationState(g) {
  return JSON.stringify({
    score: g.score, stats: g.stats, depots: g.depots,
    passengers: g.stations.map((s) => s.passengers), trains: g.trains,
  });
}

test('different screen sizes and local panels preserve arrivals, boardings and scores', () => {
  const api = loadGame(), a = fixture(api), b = fixture(api);
  api.project(b, 390, 844, 320);
  for (let step = 0; step < 1500; step++) {
    if (step === 137) api.project(b, 390, 844, 440);
    if (step === 489) api.project(b, 844, 390, 180);
    if (step === 891) api.project(b, 390, 844, 290);
    for (const g of [a, b]) {
      g.t = step / 60;
      for (const tr of g.trains) api.updateTrain(g, tr, 1 / 60);
    }
    assert.equal(simulationState(a), simulationState(b), `peers differ at step ${step}`);
  }
  assert.equal(a.score, 8);
  assert.equal(a.depots[0].score, 8);
});

test('simultaneous arrivals board in creation order, regardless of player', () => {
  const api = loadGame();
  for (const reverse of [false, true]) {
    const g = fixture(api, 'rivals', reverse);
    for (const tr of g.trains) {
      const line = g.lines.find((l) => l.id === tr.lineId);
      tr.dist = line.total - 0.5;
      api.updateTrain(g, tr, 1 / 60);
    }
    assert.deepEqual(Array.from(g.trains, (t) => t.passengers.length), [6, 2]);
    assert.equal(g.lines[0].owner, reverse ? 1 : 0);
  }
});

test('resizing a loop preserves train state and renders every stop at its station', () => {
  const api = loadGame(), g = fixture(api, 'normal');
  const line = g.lines[0];
  line.stations.push(3); line.loop = true; api.rebuildAll(g);
  const tr = g.trains[0]; tr.dist = line.total - 18.25;
  const before = JSON.stringify(tr);
  for (const inset of [260, 420, 280]) {
    api.project(g, 390, 844, inset);
    assert.equal(JSON.stringify(tr), before);
    for (let i = 0; i < line.stations.length; i++) {
      const st = g.stations.find((s) => s.id === line.stations[i]);
      const p = api.pointAt(line, line.stationDist[i]);
      assert.ok(Math.hypot(p.x - st.x, p.y - st.y) < 1e-8);
    }
  }
});

test('carriages stay spaced on the displayed path after a small-screen resize', () => {
  const api = loadGame(), g = fixture(api, 'normal'), line = g.lines[0], tr = g.trains[0];
  g.stations[1].ry = g.stations[0].ry;
  api.project(g, 390, 844, 350);
  tr.dist = line.total * 0.75; tr.cars = 2;
  const head = api.trainCarPosition(line, tr, 0), car = api.trainCarPosition(line, tr, 1);
  assert.ok(Math.abs(Math.hypot(head.x - car.x, head.y - car.y) - 34) < 1e-8);
});
