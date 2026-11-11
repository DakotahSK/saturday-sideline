# Saturday Sideline handoff

Read this first when continuing the project in a new chat. It covers where everything lives, how to restore the code, what is finished, what is in progress, and how Dakotah wants the work done.

## Where things live

- **The game (live):** claude.ai artifact https://claude.ai/artifact/MjH8uh9Q7zihqKJGq7rEPB, a single self-contained HTML file. Publish updates to that same URL; never create a new artifact. Published version 92 on 2026-11-11.
- **The code:** GitHub repo https://github.com/DakotahSK/saturday-sideline (private). Every work branch is pushed there. In a new chat, attach the repo (add_repo DakotahSK/saturday-sideline with push access) and clone it:
  ```
  git clone https://github.com/DakotahSK/saturday-sideline && cd saturday-sideline
  git fetch origin '+refs/heads/*:refs/remotes/origin/*'   # all work branches
  ./build.sh           # builds dist/sideline.html (the artifact)
  ./test.sh            # runs the test harnesses
  ```
  `CLAUDE.md` in the repo explains the source layout, build and test scripts, the screenshot tool and the engine map. Read it before editing anything.
- **Dakotah's career save:** stored in the artifact's own database, collection `data/users/me`, doc `career` (also `league`, `career_prev`, `snap0` to `snap9`). The `json` field is `'gz:' + base64(gzip(JSON))`; saves over 240,000 characters split into extra docs (`career_a0`...). Read it with the ArtifactData tool using the artifact URL. Write back with `if_version`, and set both the doc `ts` and `S._ts` to now, or the game will prefer its local copy. `saves/career.json` in the repo is a Season 6 Week 1 copy for testing only.
- **Figma:** file "Church League Logo Upgrades", key `VuscGupAqnXIDjU33vqnDq`. Dakotah is on the Starter plan: `generate_image` works and uses his AI credits, but exports (`get_screenshot`, `use_figma`) hit a small monthly limit. When exports are blocked, ask him to export PNGs from Figma and attach them.

## How Dakotah wants things done

- Do not change anything unless he explicitly asks. When he is just talking ball ("who wins it all", "rank the conferences"), answer from his save and change nothing. When he says he does not want simulations, do not run them.
- No em dashes and nothing that reads as AI-written, in the game or in anything written for him.
- Never trim history (team past seasons, rivalries, the archive, records). Only the fan feed, gdHist and podcast episodes are disposable.
- Logos: original art only, no copies of real schools' marks. No human figures or faces in mascot logos.
- He plays mostly on his phone and wants one game he can play anywhere, so the game stays a claude.ai artifact with cloud saves (not a local copy).
- Usage limits matter. Use Sonnet for subagents, run at most two at a time, and keep Opus for the overseer role (merging, review, publishing).

## Status of the overhaul he asked for on 2026-11-11

Shipped in version 92 (on `main`):
- Scroll bug fixed (a slow cloud save was reloading an older copy and its page). Test: `tests/nav_t.js`.
- Main pages redesigned: five-section bottom nav (Home, League, Rankings, Teams, Program) with remembered sub-tabs, compact Around the League with filter chips.
- 12 new Figma logos: FBO, SCB, NWY, SDB, ELL, EBC, HAL, BLV, HOU, WBK, CAL, VIC. Known flaw: VIC has a white fill inside the bow on dark backgrounds; clean up the cutout.
- Name changes: Berean coach Adam Riveiro, QB Ethan Allen; Jerome coach Tim Knutson, QB Max Levdanskiy. Permanent named Berean players via `team.named`: Clark Allison (RB), Everett Allison (WR), Ollie Forrester (LB). These are in the cloud save and the code.

Merged into `main`, not yet published:
- `gameday`: watch-mode UI (speeds, skips, drive tracker, tabbed dock), live fan chat (under 1% repeated lines), halftime show that recaps the league. Test: `tests/half_t.js`. Known leftovers: on desktop the dock sits below the fold; the halftime "By quarter" note has no quarter labels; week-1 cards say "(0-0) leads the division".

In progress on branches (not shipped):
- `anim-playbook`: 13 new offensive plays, 4 defensive calls, grouped play menus, QB pocket movement, OL/DL blocking pairs, smoother steering. Needs a visual check, tuning, and a merge with main.
- `stories`: only the `tests/story_t.js` inventory harness so far. Findings: about 109 stories a season but no multi-week arcs, QB controversies never resolve, midseason firings never happen. A design is in the branch's report: `S.arcs` with arc types (hot seat to firing, QB controversy resolution, unbeaten watch, Cinderella, revenge games from past playoff results, division races, coach feuds, record chases, portal sagas), using real league history. Not built.
- `stadiums`: nothing built yet. Plan: a stadium identity per team derived from the team (architecture, capacity by prestige, scenery by region), domes by abbr (HOU, NWY, LHI, SYR, ESB, VIC, SKY) with a saved `t.dome` override, where `gameEnv` must remove weather for domes (including cached `g.env`), and more pregame camera shots seeded per game and cached in `SC`. Known existing bug: resuming a game mid-intro during the second exterior shot throws in `exCamShot` because `SC.ext` is undefined (black screen until skip).

Still to do after those: merge everything into main, run `./test.sh`, have a fresh agent play through and hunt bugs, publish, then send Dakotah a list of suggestions (he asked for suggestions at the end).

## Starter prompt for a new chat

> I'm continuing my Saturday Sideline game. The code is in my GitHub repo DakotahSK/saturday-sideline. Attach it, read HANDOFF.md in the repo, then pick up the next unfinished item. My game is at https://claude.ai/artifact/MjH8uh9Q7zihqKJGq7rEPB.
