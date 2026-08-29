#!/bin/sh
set -e

# Migrate before serving. If this fails the container dies instead of
# answering requests against a schema it doesn't match.
node scripts/migrate.mjs

exec "$@"
