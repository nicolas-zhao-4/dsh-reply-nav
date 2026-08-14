#!/usr/bin/env sh
# Installs dsh-reply-nav into a dsh web profile and registers it in the patch layer.
# Usage: ./install.sh [profileName]   (default profile: web)
set -e

DSH_HOME_DIR="${DSH_HOME:-$HOME/.dsh}"
PROFILE="${1:-web}"
PROFILE_DIR="$DSH_HOME_DIR/profiles/$PROFILE"

if [ ! -d "$PROFILE_DIR" ]; then
    echo "profile '$PROFILE' not found at $PROFILE_DIR. Pass your profile name as the first argument." >&2
    exit 1
fi

# 1) copy the package into the profile's node_modules
NODE_MODULES="$PROFILE_DIR/node_modules"
TARGET="$NODE_MODULES/dsh-reply-nav"
mkdir -p "$NODE_MODULES"
if [ -d "$TARGET" ]; then
    echo "already installed: $TARGET"
else
    mkdir -p "$TARGET"
    cp -R "$(dirname "$0")/lib" "$TARGET/lib"
    cp "$(dirname "$0")/package.json" "$TARGET/"
    echo "installed: $TARGET"
fi

# 2) register the loader row in cordis.patch.yml (idempotent)
PATCH="$PROFILE_DIR/cordis.patch.yml"
if [ -f "$PATCH" ] && grep -q "id: reply-nav" "$PATCH"; then
    echo "already registered in $PATCH"
else
    printf '\n- insert:\n    - id: reply-nav\n      name: dsh-reply-nav\n' >> "$PATCH"
    echo "registered in $PATCH"
fi

echo ""
echo "Done. Refresh the dsh web page (no dsh restart needed)."
echo "If the rail does not appear, open the browser console (F12) and check /plugins/dsh-reply-nav/client.js returns 200."
