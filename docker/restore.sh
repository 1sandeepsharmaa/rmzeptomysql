#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  Manual Restore Script
#  Usage:  ./docker/restore.sh rm_backup_20260220_120000.sql.gz
# ═══════════════════════════════════════════════════════════════

set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Usage: $0 <backup_filename.sql.gz>"
    echo "   Backups are stored in the rm_mysql_backups Docker volume."
    echo ""
    echo "   To list available backups:"
    echo "   docker run --rm -v rm_mysql_backups:/backups alpine ls /backups"
    exit 1
fi

# Load env vars
source ./backend/.env

echo "⚠️  This will OVERWRITE the database '${DB_NAME}' with backup: ${BACKUP_FILE}"
read -p "Type 'yes' to confirm: " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Restore cancelled."
    exit 0
fi

echo "🔄 Restoring database from ${BACKUP_FILE}..."

docker run --rm \
    --network rm_network \
    -v rm_mysql_backups:/backups \
    mysql:8.0 \
    sh -c "gunzip < /backups/${BACKUP_FILE} | mysql -h mysql -u${DB_USER} -p${DB_PASS} ${DB_NAME}"

echo "✅ Restore complete!"
