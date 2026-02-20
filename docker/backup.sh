#!/bin/sh
# ═══════════════════════════════════════════════════════════════
#  Automated MySQL Backup Script
#  Runs every 24 hours inside the backup container.
#  Dumps are saved to /backups/ volume (never lost).
#  Keeps last 7 days of backups automatically.
# ═══════════════════════════════════════════════════════════════

echo "🔄 Backup service started..."

while true; do
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="/backups/rm_backup_${TIMESTAMP}.sql.gz"
    
    echo "📦 Creating backup: ${BACKUP_FILE}"
    
    # Dump the entire database and gzip it
    mysqldump \
        -h mysql \
        -u "${DB_USER}" \
        -p"${DB_PASS}" \
        "${DB_NAME}" \
        --single-transaction \
        --quick \
        --lock-tables=false \
    | gzip > "${BACKUP_FILE}"
    
    if [ $? -eq 0 ]; then
        echo "✅ Backup successful: ${BACKUP_FILE}"
    else
        echo "❌ Backup FAILED at ${TIMESTAMP}" >&2
    fi
    
    # ── Clean up backups older than 7 days ──────────────────
    echo "🧹 Removing backups older than 7 days..."
    find /backups -name "rm_backup_*.sql.gz" -mtime +7 -delete
    
    echo "📋 Current backups:"
    ls -lh /backups/
    
    # ── Wait 24 hours before next backup ────────────────────
    echo "⏳ Next backup in 24 hours..."
    sleep 86400
done
