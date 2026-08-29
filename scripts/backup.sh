#!/bin/sh
# Backs up everything that cannot be rebuilt: the database and the uploads.
#
# Run from the project root on the VPS, e.g. nightly from host cron:
#   0 3 * * * cd /srv/happyday && ./scripts/backup.sh >> /var/log/happyday-backup.log 2>&1
#
# The code and the generated artwork are in git; the two things here are not.
set -eu

DATA_DIR="${DATA_DIR:-./data}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
KEEP_DAYS="${KEEP_DAYS:-14}"

DB="$DATA_DIR/app.db"
UPLOADS="$DATA_DIR/uploads"
STAMP=$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_DIR"

if [ ! -f "$DB" ]; then
  echo "sem banco em $DB — nada a fazer"
  exit 0
fi

# `VACUUM INTO` takes a consistent snapshot of a live database, WAL included,
# without blocking writers. Copying app.db directly would race the WAL and
# can produce a file that opens but is missing the last transactions.
sqlite3 "$DB" "VACUUM INTO '$BACKUP_DIR/app-$STAMP.db'"

# Verify before trusting it. A backup nobody checked is a guess.
if ! sqlite3 "$BACKUP_DIR/app-$STAMP.db" "PRAGMA integrity_check;" | grep -q '^ok$'; then
  echo "FALHA: integrity_check não passou em app-$STAMP.db"
  rm -f "$BACKUP_DIR/app-$STAMP.db"
  exit 1
fi

gzip -f "$BACKUP_DIR/app-$STAMP.db"

if [ -d "$UPLOADS" ]; then
  tar -czf "$BACKUP_DIR/uploads-$STAMP.tar.gz" -C "$DATA_DIR" uploads
fi

# Retention. Without this the disk fills and the site goes down for a reason
# that has nothing to do with the site.
find "$BACKUP_DIR" -name 'app-*.db.gz'        -mtime "+$KEEP_DAYS" -delete
find "$BACKUP_DIR" -name 'uploads-*.tar.gz'   -mtime "+$KEEP_DAYS" -delete

echo "backup $STAMP concluído:"
ls -lh "$BACKUP_DIR" | grep "$STAMP" | awk '{print "  " $9 "  " $5}'

# A backup that has never been restored is a hypothesis. Restore drill:
#   gunzip -c backups/app-<stamp>.db.gz > /tmp/restore-test.db
#   sqlite3 /tmp/restore-test.db "select count(*) from sites;"
