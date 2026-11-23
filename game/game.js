/* LUMEN TIDE — Duel at the Lighthouse.
   A 1v1 card duel: you are the Keeper of the lighthouse, the Storm wants your light.
   Both sides have 20 life. Each turn you get 3 pearls of energy and a hand of 5 cards.
   Play cards by clicking them, then press END TURN. The Storm answers, then it is your
   turn again. First side to 0 life loses. No network, no libraries, pure DOM + SVG. */
(function () {
  'use strict';

  /* ---------- icons: inline SVG so nothing depends on emoji fonts ---------- */
  var ICONS = {
    beam: '<svg viewBox="0 0 64 64"><path d="M36 4 L12 36 H28 L22 60 L50 26 H32 Z" fill="#ffd66e" stroke="#fff3c4" stroke-width="2"/></svg>',
    wave: '<svg viewBox="0 0 64 64"><path d="M6 22 Q16 10 26 22 T46 22 T62 22" fill="none" stroke="#4de8d2" stroke-width="6" stroke-linecap="round"/><path d="M6 40 Q16 28 26 40 T46 40 T62 40" fill="none" stroke="#2f8f84" stroke-width="6" stroke-linecap="round"/></svg>',
    shield: '<svg viewBox="0 0 64 64"><path d="M32 4 L54 12 V32 C54 48 44 56 32 60 C20 56 10 48 10 32 V12 Z" fill="#4de8d2" stroke="#dffff8" stroke-width="2"/><path d="M32 14 L46 19 V32 C46 43 40 49 32 52 C24 49 18 43 18 32 V19 Z" fill="#0d3a4a"/></svg>',
    lantern: '<svg viewBox="0 0 64 64"><rect x="24" y="6" width="16" height="6" rx="2" fill="#ffd66e"/><path d="M20 14 H44 L48 52 H16 Z" fill="#ffd66e" opacity="0.9"/><circle cx="32" cy="34" r="10" fill="#fff3c4"/><path d="M28 52 H36 L38 60 H26 Z" fill="#ffd66e"/></svg>',
    gull: '<svg viewBox="0 0 64 64"><path d="M6 34 Q20 18 32 30 Q44 18 58 34 Q44 26 32 40 Q20 26 6 34 Z" fill="#eaf7f2"/><circle cx="32" cy="26" r="4" fill="#ffd66e"/></svg>',
    kraken: '<svg viewBox="0 0 64 64"><circle cx="32" cy="24" r="14" fill="#8f7bff"/><circle cx="27" cy="22" r="3" fill="#fff"/><circle cx="37" cy="22" r="3" fill="#fff"/><path d="M18 36 Q14 50 20 56 M28 38 Q26 52 32 58 M38 38 Q40 52 46 56 M46 34 Q52 46 48 54" fill="none" stroke="#8f7bff" stroke-width="5" stroke-linecap="round"/></svg>',
    storm: '<svg viewBox="0 0 72 72"><path d="M20 44 a12 12 0 0 1 2-24 a16 16 0 0 1 30-4 a11 11 0 0 1 4 28 Z" fill="#8f7bff"/><path d="M38 46 L30 58 H38 L32 68 L48 54 H40 Z" fill="#ffd66e"/></svg>',
    keeper: '<svg viewBox="0 0 72 72"><rect x="30" y="26" width="12" height="34" fill="#eaf7f2"/><path d="M28 26 L44 26 L40 10 L32 10 Z" fill="#ffd66e"/><circle cx="36" cy="18" r="6" fill="#fff3c4"/><path d="M14 60 H58" stroke="#4de8d2" stroke-width="4" stroke-linecap="round"/><path d="M14 52 Q36 44 58 52" fill="none" stroke="#4de8d2" stroke-width="3"/></svg>'
  };

  /* ---------- cards ---------- */
  // type: strike (damage), block, heal, draw-strike, rare strike
  var DECK = [
    { id: 'beam',    name: 'Beam Strike',   type: 'STRIKE', cost: 1, value: 3, icon: 'beam',    text: 'Deal 3 damage to the Storm.' },
    { id: 'beam',    name: 'Beam Strike',   type: 'STRIKE', cost: 1, value: 3, icon: 'beam',    text: 'Deal 3 damage to the Storm.' },
    { id: 'beam',    name: 'Beam Strike',   type: 'STRIKE', cost: 1, value: 3, icon: 'beam',    text: 'Deal 3 damage to the Storm.' },
    { id: 'wave',    name: 'Wave Crash',    type: 'STRIKE', cost: 2, value: 5, icon: 'wave',    text: 'Deal 5 damage to the Storm.' },
    { id: 'wave',    name: 'Wave Crash',    type: 'STRIKE', cost: 2, value: 5, icon: 'wave',    text: 'Deal 5 damage to the Storm.' },
    { id: 'shield',  name: 'Breakwater',    type: 'BLOCK',  cost: 1, value: 5, icon: 'shield',  text: 'Gain 5 block. Block stops damage.' },
    { id: 'shield',  name: 'Breakwater',    type: 'BLOCK',  cost: 1, value: 5, icon: 'shield',  text: 'Gain 5 block. Block stops damage.' },
    { id: 'shield',  name: 'Breakwater',    type: 'BLOCK',  cost: 1, value: 5, icon: 'shield',  text: 'Gain 5 block. Block stops damage.' },
    { id: 'lantern', name: 'Lantern Light', type: 'HEAL',   cost: 2, value: 4, icon: 'lantern', text: 'Restore 4 life to the Keeper.' },
    { id: 'lantern', name: 'Lantern Light', type: 'HEAL',   cost: 2, value: 4, icon: 'lantern', text: 'Restore 4 life to the Keeper.' },
    { id: 'gull',    name: 'Gull Dive',     type: 'STRIKE', cost: 1, value: 2, icon: 'gull',    text: 'Deal 2 damage. Draw 1 card.' },
    { id: 'gull',    name: 'Gull Dive',     type: 'STRIKE', cost: 1, value: 2, icon: 'gull',    text: 'Deal 2 damage. Draw 1 card.' },
    { id: 'kraken',  name: "Kraken's Call", type: 'STRIKE', cost: 3, value: 8, icon: 'kraken',  text: 'RARE — Deal 8 damage.', rare: true }
  ];

  var MAX_LIFE = 20, HAND_SIZE = 5, ENERGY_PER_TURN = 3;

  var state = null; // {playerLife, enemyLife, playerBlock, enemyBlock, energy, hand, deck, discard, turn, over, log[]}

  /* ---------- helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function clampLife(v) { return Math.max(0, Math.min(MAX_LIFE, v)); }
  function log(msg) {
    state.log.unshift(msg);
    if (state.log.length > 4) state.log.length = 4;
    $('log').innerHTML = state.log.map(function (m) { return '<div>' + m + '</div>'; }).join('');
  }

  function newGame() {
    state = {
      playerLife: MAX_LIFE, enemyLife: MAX_LIFE,
      playerBlock: 0, enemyBlock: 0,
      energy: ENERGY_PER_TURN, hand: [], deck: shuffle(DECK.slice()),
      discard: [], turn: 1, over: false, log: [],
      cardsPlayed: 0, damageDealt: 0
    };
    drawCards(HAND_SIZE);
    log('<b>Turn 1</b> — the Storm gathers over the sea.');
    render();
  }

  function drawCards(n) {
    for (var i = 0; i < n; i++) {
      if (state.deck.length === 0) {
        if (state.discard.length === 0) break;
        state.deck = shuffle(state.discard); state.discard = [];
      }
      state.hand.push(state.deck.pop());
    }
  }

  /* ---------- combat ---------- */
  function dealDamage(target, amount) {
    var block = target === 'enemy' ? state.enemyBlock : state.playerBlock;
    var absorbed = Math.min(block, amount);
    var real = amount - absorbed;
    if (target === 'enemy') {
      state.enemyBlock -= absorbed;
      state.enemyLife = clampLife(state.enemyLife - real);
      if (real > 0) state.damageDealt += real;
    } else {
      state.playerBlock -= absorbed;
      state.playerLife = clampLife(state.playerLife - real);
    }
    return { absorbed: absorbed, real: real };
  }

  function playCard(index) {
    if (state.over) return;
    var card = state.hand[index];
    if (!card) return;
    if (card.cost > state.energy) { log('Not enough pearls for <b>' + card.name + '</b>.'); return; }
    state.energy -= card.cost;
    state.hand.splice(index, 1);
    state.discard.push(card);
    state.cardsPlayed++;
    if (card.type === 'STRIKE') {
      var r = dealDamage('enemy', card.value);
      log('<b>' + card.name + '</b> hits the Storm for <b>' + r.real + '</b>' + (r.absorbed ? ' (' + r.absorbed + ' blocked)' : '') + '.');
      if (card.id === 'gull') drawCards(1);
    } else if (card.type === 'BLOCK') {
      state.playerBlock += card.value;
      log('<b>' + card.name + '</b> — the Keeper gains <b>' + card.value + ' block</b>.');
    } else if (card.type === 'HEAL') {
      state.playerLife = clampLife(state.playerLife + card.value);
      log('<b>' + card.name + '</b> — the Keeper heals <b>' + card.value + '</b> life.');
    }
    checkEnd();
    render();
  }

  function enemyTurn() {
    if (state.over) return;
    state.playerBlock = 0; // block fades at the start of the Storm's turn
    var moves = 1 + (Math.random() < 0.5 ? 1 : 0);
    var picks = shuffle(DECK.slice()).slice(0, moves);
    var parts = [];
    picks.forEach(function (card) {
      if (card.type === 'HEAL') {
        state.enemyLife = clampLife(state.enemyLife + card.value);
        parts.push('the Storm mends +' + card.value);
      } else if (card.type === 'BLOCK') {
        state.enemyBlock += card.value;
        parts.push('the Storm raises ' + card.value + ' block');
      } else {
        var r = dealDamage('player', card.value);
        parts.push('the Storm strikes for <b>' + r.real + '</b>' + (r.absorbed ? ' (' + r.absorbed + ' blocked)' : ''));
      }
    });
    log(parts.join(' · ') + '.');
    state.turn++;
    state.energy = ENERGY_PER_TURN;
    drawCards(Math.max(0, HAND_SIZE - state.hand.length));
    log('<b>Turn ' + state.turn + '</b> — your move, Keeper.');
    checkEnd();
    render();
  }

  function checkEnd() {
    if (state.over) return;
    if (state.enemyLife <= 0) endGame(true);
    else if (state.playerLife <= 0) endGame(false);
  }

  function endGame(won) {
    state.over = true;
    var screen = $('end-screen');
    screen.classList.remove('hidden', 'win', 'lose');
    screen.classList.add(won ? 'win' : 'lose');
    $('end-title').textContent = won ? 'THE LIGHT PREVAILS' : 'THE STORM TAKES THE LIGHT';
    $('end-sub').textContent = won
      ? 'The lighthouse beam cuts through the dark — the Storm retreats.'
      : 'The lamp gutters out. The sea keeps the light… this time.';
    $('end-stats').innerHTML =
      'Turns played: <b>' + state.turn + '</b> &nbsp;·&nbsp; Cards played: <b>' + state.cardsPlayed +
      '</b> &nbsp;·&nbsp; Damage dealt: <b>' + state.damageDealt + '</b><br>' +
      'Keeper life: <b>' + state.playerLife + ' / ' + MAX_LIFE + '</b> &nbsp;·&nbsp; Storm life: <b>' +
      state.enemyLife + ' / ' + MAX_LIFE + '</b>';
    $('end-turn-btn').disabled = true;
  }

  /* ---------- rendering ---------- */
  function cardHtml(card, index, playable) {
    var unit = card.type === 'HEAL' ? 'heal' : card.type === 'BLOCK' ? 'block' : 'dmg';
    var cls = 'card' + (card.rare ? ' rare' : '') + (playable ? ' playable' : '');
    return '<div class="' + cls + '" data-index="' + index + '">' +
      '<div class="cost">' + card.cost + '</div>' +
      '<div class="card-type">' + card.type + '</div>' +
      '<div class="card-icon">' + ICONS[card.icon] + '</div>' +
      '<div class="card-value">' + card.value + ' <span class="unit">' + unit + '</span></div>' +
      '<div class="card-name">' + card.name + '</div>' +
      '<div class="card-text">' + card.text + '</div>' +
      '</div>';
  }

  function render() {
    // enemy side
    $('enemy-life').textContent = state.enemyLife;
    $('enemy-bar').style.width = (state.enemyLife / MAX_LIFE * 100) + '%';
    $('enemy-block').textContent = state.enemyBlock > 0 ? '🛡 BLOCK ' + state.enemyBlock : '';
    $('enemy-block').style.display = state.enemyBlock > 0 ? 'inline-block' : 'none';
    var backs = '';
    for (var i = 0; i < 5; i++) backs += '<div class="card back"><span>~</span></div>';
    $('enemy-hand').innerHTML = backs;
    // player side
    $('player-life').textContent = state.playerLife;
    $('player-bar').style.width = (state.playerLife / MAX_LIFE * 100) + '%';
    $('player-block').textContent = state.playerBlock > 0 ? '🛡 BLOCK ' + state.playerBlock : '';
    $('player-block').style.display = state.playerBlock > 0 ? 'inline-block' : 'none';
    var hand = '';
    state.hand.forEach(function (card, i) {
      hand += cardHtml(card, i, !state.over && card.cost <= state.energy);
    });
    $('player-hand').innerHTML = hand;
    Array.prototype.forEach.call($('player-hand').querySelectorAll('.card.playable'), function (el) {
      el.addEventListener('click', function () { playCard(parseInt(el.getAttribute('data-index'), 10)); });
    });
    // mid bar
    $('turn-label').textContent = state.over ? '— GAME OVER —' : 'TURN ' + state.turn + ' — YOUR MOVE';
    var pearls = '';
    for (var p = 0; p < ENERGY_PER_TURN; p++) {
      pearls += '<span class="pearl' + (p < state.energy ? '' : ' spent') + '"></span>';
    }
    $('energy').innerHTML = 'PEARLS ' + pearls + ' ' + state.energy + '/' + ENERGY_PER_TURN;
    $('end-turn-btn').disabled = state.over;
  }

  /* ---------- debug / screenshot states ---------- */
  // ?screen=title | mid | win | lose — deterministic setups for screenshots.
  function applyScreenParam() {
    var m = /[?&]screen=([a-z]+)/.exec(location.search);
    if (!m) return;
    var s = m[1];
    if (s === 'title') { return; } // title screen is the default
    $('title-screen').classList.add('hidden');
    $('table').classList.remove('hidden');
    if (s === 'mid') {
      newGame();
      // a lively mid-game: both sides hurt, block up, full hand, turn 4
      state.playerLife = 14; state.enemyLife = 11;
      state.playerBlock = 5; state.enemyBlock = 3;
      state.turn = 4; state.energy = 2;
      state.hand = [
        DECK[0], DECK[3], DECK[5], DECK[8], DECK[12]
      ];
      state.log = ['<b>Turn 4</b> — your move, Keeper.', '<b>Wave Crash</b> hits the Storm for <b>5</b>.', '<b>Breakwater</b> — the Keeper gains <b>5 block</b>.', 'The Storm gathers over the sea.'];
      $('log').innerHTML = state.log.map(function (x) { return '<div>' + x + '</div>'; }).join('');
      render();
    } else if (s === 'win') {
      newGame();
      state.enemyLife = 0; state.playerLife = 9; state.turn = 7;
      state.cardsPlayed = 11; state.damageDealt = 24;
      render(); endGame(true);
    } else if (s === 'lose') {
      newGame();
      state.playerLife = 0; state.enemyLife = 6; state.turn = 6;
      state.cardsPlayed = 9; state.damageDealt = 18;
      render(); endGame(false);
    }
  }

  /* ---------- wiring ---------- */
  $('play-btn').addEventListener('click', function () {
    $('title-screen').classList.add('hidden');
    $('table').classList.remove('hidden');
    newGame();
  });
  $('end-turn-btn').addEventListener('click', function () {
    if (state.over) return;
    $('end-turn-btn').disabled = true;
    log('The Keeper holds the light and ends the turn…');
    setTimeout(function () { enemyTurn(); }, 450);
  });
  $('again-btn').addEventListener('click', function () {
    $('end-screen').classList.add('hidden');
    $('end-turn-btn').disabled = false;
    newGame();
  });

  applyScreenParam();
})();
