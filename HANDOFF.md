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

All of it is merged into `main` and published (version 95):
- Scroll bug fixed (stale cloud copy was reloading the old page). Test `nav_t`.
- Five-section bottom nav with sub-tabs, compact Around the League scores.
- 12 new Figma logos (FBO, SCB, NWY, SDB, ELL, EBC, HAL, BLV, HOU, WBK, CAL, VIC).
- Watch-game UI, live fan chat, halftime league recap. Test `half_t`.
- 13 new plays, 4 defensive calls, grouped play menus, pocket QB, OL/DL blocking pairs, smoother steering. Tests `pocket_t`, `bal_t` (run from tests/).
- Story arcs (`S.arcs`): hot seat to midseason firing, QB controversy resolution, unbeaten watch, Cinderella, free fall, revenge games, division races, coach feuds, record chases. Storylines card in League > News. Test `story_t`.
- Stadium variants per team, domes (NWY, LHI, SYR, ESB, SKY, HOU, VIC) with no weather, more pregame shots. Test `dome_t`.
- Name changes and permanent named Berean players (`team.named`).

Known leftovers and polish ideas (not done):
- VIC logo has a white fill inside the bow on dark backgrounds.
- On a long dropback the offensive linemen bunch toward the center.
- Desktop game screen: the field fills the viewport so the play-call panel and watch dock sit below the fold.
- Halftime totals can disagree with pass plus rush when sacks are involved; halftime "By quarter" note has no quarter labels.
- The STOPPED flash can stay on screen at game over after a turnover on downs.
- Watch speed 1x feels slow; rain is faint during play.
- Arcs: unbeaten arcs are the most frequent.
- Stadium variety mostly shows in pregame; upper decks look blocky at low angles.
- Parity (done 2026-11-11, version 96, he approved): in `recruitAll` prestige weight in class score .5 to .38, coach weight .3 to .45, last-season wins .6 to .8, coach development .05 to .08, prestige blend .8/.2 to .72/.28. `tests/parity_t.js` (run from tests/, slow): 8-season sim went from 10 to 13 distinct top-4 teams, top-8 carryover 5.4 to 5.1. Next dial if he wants more: prestige blend .65/.35 or coach weight .55.
- Also in version 96: Rankings > Recruits tab (full class rankings), score bug tightened for phones (CSS media queries at 520px and 400px only, he approved), arc tuning (hot seat starts for weak teams at 0-4/1-5, free fall needs 4 losses unless preseason top 3).

## Starter prompt for a new chat

> I'm continuing my Saturday Sideline game. The code is in my GitHub repo DakotahSK/saturday-sideline. Attach it, read HANDOFF.md in the repo, then pick up the next unfinished item. My game is at https://claude.ai/artifact/MjH8uh9Q7zihqKJGq7rEPB.
