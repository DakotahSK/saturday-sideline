#!/bin/bash
# Build, then run the node harnesses. Every harness must finish without a thrown error.
cd "$(dirname "$0")" && ./build.sh || exit 1
cd tests; fail=0
for f in ${@:-season_t uw_t watch_t tick_t poll_t coach_t load_t split_t scr_t stop_t rd_t gs_t nav_t half_t}; do
  out=$(timeout 300 node $f.js 2>&1); rc=$?
  if [ $rc -ne 0 ] || echo "$out" | grep -q "^[A-Za-z]*Error\|at eval\|errs [1-9]"; then echo "FAIL $f"; echo "$out" | tail -8 | cut -c1-300; fail=1; else echo "ok   $f: $(echo "$out" | tail -1 | cut -c1-110)"; fi
done; exit $fail
