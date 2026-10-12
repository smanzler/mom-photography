#!/usr/bin/env bash
# dev.sh — start the stack in its own tmux session.
#
#   dev   docker logs | web
#
# Starts detached — it never moves you. Jump there yourself:
#   tmux switch-client -t '=mom-photography:'

set -uo pipefail

SESSION="${PHOTOGRAPHY_SESSION:-mom-photography}"
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
COMPOSE="$ROOT/docker/docker-compose.yml"

step() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
info() { printf '  %s\n' "$*"; }
die()  { printf '\033[31mdev: %s\033[0m\n' "$*" >&2; exit 1; }

jump_hint() {
  if [ -n "${TMUX:-}" ]; then
    info "jump there with: tmux switch-client -t '=$SESSION:'"
  else
    info "attach with:     tmux attach -t '=$SESSION:'"
  fi
}

command -v tmux >/dev/null || die "tmux not found"

# A session target needs both the '=' and the trailing ':'. Bare -t
# prefix-matches, and '=' alone can lose to a window of the same name.
if tmux has-session -t "=$SESSION:" 2>/dev/null; then
  info "session '$SESSION' is already up"
  jump_hint
  exit 0
fi

step "Containers"
docker info >/dev/null 2>&1 || die "Docker is not responding"
# --wait blocks until the database healthcheck passes, so the app never starts
# against a database that does not accept connections yet.
docker compose -f "$COMPOSE" up --wait --wait-timeout 120 -d \
  || die "containers did not come up — check 'docker compose -f $COMPOSE ps'"
info "database healthy"

step "Session"
tmux new-session -d -s "$SESSION" -c "$ROOT" -n dev \
  || die "could not create session '$SESSION'"

p_docker=$(tmux list-panes -t "=$SESSION:dev" -F '#{pane_id}' | head -1)
p_web=$(tmux split-window -h -t "$p_docker" -c "$ROOT" -P -F '#{pane_id}')

tmux select-layout -t "=$SESSION:dev" even-horizontal

# send-keys rather than a pane command, so each server runs in a real
# interactive shell and keeps the PATH you normally develop with.
tmux send-keys -t "$p_docker" "docker compose -f docker/docker-compose.yml logs -f" Enter
tmux send-keys -t "$p_web"    "pnpm dev:web" Enter

info "web       http://localhost:3000"
info "mailpit   http://localhost:8025"
info "s3 mock   http://localhost:9090"

step "Ready"
info "running detached in session '$SESSION'"
jump_hint
info "stop it with:    pnpm down"
