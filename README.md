# LUMEN TIDE — Duel at the Lighthouse

[![make.fun · best-card-game-20261122-1826](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/bee6en9/best-card-game-20261122-1826/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/bee6en9/best-card-game-20261122-1826/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)

A 1v1 card duel built for the [make.fun bounty "Make the best card game"](https://make.fun/bounty/best-card-game-20261122-1826) (play code: `vfk2n47z`).

## The game

You are the **Keeper** of a lighthouse on a storm-lashed sea. **The Storm** wants your light. Both sides start at **20 life**. Each turn you get **3 pearls** of energy and a hand of 5 cards — click a card to play it, then press **END TURN** and the Storm answers. First side to **0 life** loses.

| Card | Cost | Effect |
| --- | --- | --- |
| Beam Strike | 1 | Deal 3 damage |
| Wave Crash | 2 | Deal 5 damage |
| Breakwater | 1 | Gain 5 block |
| Lantern Light | 2 | Heal 4 life |
| Gull Dive | 1 | Deal 2 damage, draw 1 card |
| Kraken's Call (rare) | 3 | Deal 8 damage |

Block absorbs incoming damage. The Storm plays its own hand each turn — sometimes it strikes, sometimes it mends itself. The duel is over in a handful of turns, and every turn is a real decision: spend pearls on damage now, or bank block and heal for the long night?

## Play

Open `game/index.html` in a desktop browser — no build step, no network, no libraries. Everything is static files (HTML + CSS + JS, inline SVG icons).

Debug shortcuts for screenshots: `?screen=title`, `?screen=mid`, `?screen=win`, `?screen=lose`.

## Files

- `game/index.html` — the table (title screen, duel, win/lose screens)
- `game/game.js` — rules, deck, AI opponent
- `game/style.css` — deep-sea teal + beacon gold
- `screenshots/` — title, mid-game, win, and loss renders
- `main.ts` — copies `game/` + `screenshots/` to the output and writes `dossier.json`
