# Saturday Sideline

College football sim (the Church League, 48 teams) shipped as ONE self-contained HTML artifact on claude.ai. The owner (Dakotah) plays mostly on his phone (about 390-430px wide) and sometimes on desktop.

## Layout of this repo
- `src/head.html`, `src/style.css`, `src/body.html`, `src/main.js` are the source. `src/logodata.js` holds only embedded logo image blobs (webp data URIs). Never read or grep-print it whole.
- `./build.sh` concatenates them into `dist/sideline.html` (the artifact), `dist/preview.html` (for a local browser) and `tests/t.js` (script only).
- `./test.sh` builds and runs the node harnesses in `tests/` (they `eval` t.js against `tests/stub.js`, a fake DOM). `./test.sh uw_t watch_t` runs just those.
- `node tests/shot.js shots/x.png 430 900 "<js>" 1500` opens the built game in Chromium with the real Season 6 career loaded, evals your JS (globals like `S`, `G`, `SC`, `act`, `render` are reachable), then screenshots. View the PNG with the Read tool. Chromium and Playwright are preinstalled; never install them. Google Fonts cannot load here, ignore that console error.
- `saves/career.json` is the owner's real career (Season 6, week 1). Never edit it.

## Hard rules
- Vanilla JS only, everything inline, no external requests besides the existing Google Fonts link. No new libraries.
- `main.js` has some very long lines (vector path data up to 160 KB). ALWAYS search with Grep using head_limit, or `grep -n ... | cut -c1-220`. Never cat the file. Read with offset/limit and be careful near lines 2900-3070 (logo path data).
- Old saves must keep loading. Any new field on `S` (career), a team, or `G` (live game) needs a safe default where it is read (`S.x||default`) or in the existing patch functions (`patchLeague`, `patchG`). A game can be saved mid-play and restored, so `G` must stay JSON-serializable. Transient animation state belongs in `SC` (the scene), not `G`.
- Never trim or delete history: team `past`, rivalry history, `S.arch`, `S.history`, records. Only `S.feed`, `S.gdHist`, `S.pod.eps` are disposable.
- Save size matters (cloud docs split at 240,000 chars). Do not persist bulky new data; derive it deterministically from seeds (`srng(hashS(...))`) the way `boxFor` does.
- Performance: the field renders on a canvas every frame on a phone. No per-frame allocations of big arrays, no layout thrash; UI panels update only when their content key changes (see `tickRefresh`).
- Text shown in the game: no em dashes, no AI-sounding filler. Write like a sports broadcast or a fan.
- Logos and names: original artwork only. Never recreate real schools' or pro teams' marks.
- Keep the score bug (the in-game scoreboard strip with rolling digits) exactly as it is unless your task says otherwise.
- Stay inside your assigned task. Other agents are changing other areas of the same files at the same time, and all branches get merged. Make focused edits; do not reformat, rename or move code you are not changing, and do not rewrap long lines.

## Engine map
- State: `S` career, `G`=`S.game` live game, `SC` scene (camera, players `SC.pl`, crowd), `LS` league template, `CLOUD` sync state.
- UI: `render()` rebuilds `#app` from `S.view` / `S.tab`; `act(name,data)` handles every `data-act` click. Tabs are built by functions like `weekTab`, `schedTab`, `progTab`, `summaryView`.
- Game flow: `startGame` (user game), `startWatch` (watch any game, `G.watch`), `autoStep`, `simToEnd`, phases in `G.phase` (coin, kick, play, half, over...).
- Plays: `startPlay` / `stepPlay` / `finishPlay`, kicks `startKick` / `stepKick`, `chase`, `tackle`, playbook data near the play-call UI. Drawing: `drawPlayers`, `retroPlayers` (pixel style, the default), chalk mode `S.chalk`.
- Scene: stadium exterior flyover, coin toss, crowd, weather via `gameEnv(g)`; field logos `fieldLogos`.
- Around the league: `tickItems`, `tickerHTML`, `tickStep`, `tickRefresh`, `btGame`, pre-simmed scores in `g.pre` via `preSimWeek`.
- Non-user results: `simGame`, `quickScore`. Poll: `poll()`, `rankScores()`. Playoff: `cfpField`, `makePlayoff`.
- News and drama: `S.news[week]` items `{tag,score,team,title,body}`, built by the weekly news generator (search `add('Drama'`), pressers (`S.presser`), fan feed (`S.feed`), podcast (`S.pod`), coaching carousel.
- Coaches: `coachRt`, `coachMod`, `hireRt`, `coachSeasonEnd`.

## Before you finish
1. `./test.sh` must pass (all `ok`). Add a harness in `tests/` for your feature when it has logic worth protecting.
2. Screenshot your work with `tests/shot.js` at 430x900 (and 1280x800 if it is layout work) and actually look at it.
3. Commit on your branch with a clear message. Do not push or publish anything.
4. Your final message: what you changed, new save fields, anything risky, and what you could not finish.
