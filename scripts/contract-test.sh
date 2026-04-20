#!/usr/bin/env bash
# Contract test: verify consumer apps compile with current library version
# Usage: ./scripts/contract-test.sh /path/to/consumer-app

set -e
APP_PATH="${1:?Usage: $0 <path-to-consumer-app>}"

echo "🔍 Contract testing: $APP_PATH"
cd "$APP_PATH"
npx tsc --noEmit
echo "✅ Contract test passed: $APP_PATH"
