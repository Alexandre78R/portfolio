#!/bin/sh
set -e

echo "🚀 Deploy DEV starting..."

BACKEND_DIR="./backend"
UPLOADS_IMAGES_DIR="$BACKEND_DIR/uploads/images"
UPLOADS_VIDEOS_DIR="$BACKEND_DIR/uploads/videos"
TRANSLATIONS_DIR="$BACKEND_DIR/translations"
BACKUPS_DIR="./backups"
CV_DIR="$BACKEND_DIR/doc"
PRISMA_SCHEMA="$BACKEND_DIR/src/prisma/schema.prisma"

BRANCH="dev"
GATEWAY_PORT=8011

# =================================
# SSH (no prompt)
# =================================
mkdir -p ~/.ssh
ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null || true

# =================================
# BACKUP LOCAL FILES
# =================================
echo "📦 Backup local assets..."
TMP_DIR=$(mktemp -d)

[ -d "$UPLOADS_IMAGES_DIR" ] && {
  echo "  → backup uploads (images)"
  cp -r "$UPLOADS_IMAGES_DIR" "$TMP_DIR/uploads/images" || true
}

[ -d "$UPLOADS_VIDEOS_DIR" ] && {
  echo "  → backup uploads (videos)"
  cp -r "$UPLOADS_VIDEOS_DIR" "$TMP_DIR/uploads/videos" || true
}

[ -d "$CV_DIR" ] && {
  echo "  → backup cv documents"
  cp -r "$CV_DIR" "$TMP_DIR/doc" || true
}

[ -d "$TRANSLATIONS_DIR" ] && {
  echo "  → backup translations"
  cp -r "$TRANSLATIONS_DIR" "$TMP_DIR/translations" || true
}

[ -d "$BACKUPS_DIR" ] && {
  echo "  → backup backups"
  cp -r "$BACKUPS_DIR" "$TMP_DIR/backups" || true
}

[ -f "$BACKEND_DIR/.env" ] && {
  echo "  → backup backend .env"
  cp "$BACKEND_DIR/.env" "$TMP_DIR/.env" || true
}

[ -f "./frontend/.env" ] && {
  echo "  → backup frontend .env"
  cp "./frontend/.env" "$TMP_DIR/frontend.env" || true
}

# =================================
# GIT UPDATE (SANS RESET)
# =================================
echo "📥 Git pull..."
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# =================================
# RESTORE FILES
# =================================
echo "📂 Restore local assets..."

[ -d "$TMP_DIR/uploads/images" ] && {
  rm -rf "$UPLOADS_IMAGES_DIR"
  cp -r "$TMP_DIR/uploads/images" "$UPLOADS_IMAGES_DIR" || true
}

[ -d "$TMP_DIR/uploads/videos" ] && {
  rm -rf "$UPLOADS_VIDEOS_DIR"
  cp -r "$TMP_DIR/uploads/videos" "$UPLOADS_VIDEOS_DIR" || true
}

[ -d "$TMP_DIR/doc" ] && {
  echo "  → restore cv documents"
  rm -rf "$CV_DIR"
  cp -r "$TMP_DIR/doc" "$CV_DIR" || true
}

[ -d "$TMP_DIR/translations" ] && {
  rm -rf "$TRANSLATIONS_DIR"
  cp -r "$TMP_DIR/translations" "$TRANSLATIONS_DIR" || true
}

[ -d "$TMP_DIR/backups" ] && {
  rm -rf "$BACKUPS_DIR"
  cp -r "$TMP_DIR/backups" "$BACKUPS_DIR" || true
}

[ -f "$TMP_DIR/.env" ] && cp "$TMP_DIR/.env" "$BACKEND_DIR/.env" || true
[ -f "$TMP_DIR/frontend.env" ] && cp "$TMP_DIR/frontend.env" "./frontend/.env" || true

rm -rf "$TMP_DIR"

# =================================
# DOCKER
# =================================
echo "🐳 Restart docker..."
docker compose -f docker-compose-dev.yml down || true
GATEWAY_PORT=$GATEWAY_PORT docker compose -f docker-compose-dev.yml up --build -d

# =================================
# PRISMA (generate + migrate deploy)
# =================================
if [ -f "$PRISMA_SCHEMA" ]; then
  echo "🗄 Prisma generate & migrate deploy..."

  # Passe dans le backend pour utiliser .env
  cd "$BACKEND_DIR"

  # Charge les variables d'environnement
  export $(grep -v '^#' .env | xargs) 2>/dev/null || true

  # Génération du client Prisma
  npx prisma generate --schema=./src/prisma/schema.prisma

  # Déploiement des migrations sans perte de données
  npx prisma migrate deploy --schema=./src/prisma/schema.prisma

  cd - >/dev/null
fi

echo "✅ Deploy terminé proprement 🚀"
