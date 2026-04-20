#!/usr/bin/env bash
# Install git hooks for the NativeUi monorepo
# Run from anywhere within the repository.
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOK_DIR="${REPO_ROOT}/.git/hooks"
PRECOMMIT="${HOOK_DIR}/pre-commit"

# Resolve the native-ui package relative to repo root
PKG_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REL_PKG="$(python3 -c "import os,sys; print(os.path.relpath(sys.argv[1], sys.argv[2]))" "$PKG_DIR" "$REPO_ROOT")"

echo "📦 Installing git hooks..."
echo "   Repo root : ${REPO_ROOT}"
echo "   Package   : ${REL_PKG}"

mkdir -p "${HOOK_DIR}"

# If a pre-commit hook already exists, check if we already appended our block
if [ -f "$PRECOMMIT" ] && grep -q "native-ui stories:check" "$PRECOMMIT"; then
  echo "✅ Pre-commit hook already contains stories:check. Nothing to do."
  exit 0
fi

# Append (or create) the pre-commit hook
cat >> "$PRECOMMIT" <<HOOK
#!/usr/bin/env bash
# --- native-ui stories:check ---
# Ensures every component/primitive has a corresponding Storybook story.
if git diff --cached --name-only | grep -q "${REL_PKG}/src/"; then
  echo "🔍 Checking for missing stories in native-ui..."
  (cd "${REPO_ROOT}/${REL_PKG}" && node scripts/generate-stories.mjs --check)
fi
# --- end native-ui stories:check ---
HOOK

chmod +x "$PRECOMMIT"
echo "✅ Pre-commit hook installed at ${PRECOMMIT}"
