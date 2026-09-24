#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "=== MUXI API Verification ==="

echo "=== Frontend build ==="
cd web/default
if [ ! -d node_modules ]; then
  npm install
fi
npm run build

echo "=== Backend build ==="
cd "$ROOT"
go build -o one-api.exe .

echo "=== Verification Complete ==="
echo "Next: read feature_list.json → pick ONE in-progress/not-started feature"
