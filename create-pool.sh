#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

K6_BIN="./k6"
POOL_SIZE="${CREATOR_POOL_SIZE:-10}"
OUTPUT_FILE="data/creator-pool.json"

# Load .env
if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

: "${TEST_PASSWORD:?TEST_PASSWORD is required}"

if [[ ! -x "$K6_BIN" ]]; then
  echo "ERROR: k6 binary not found: $K6_BIN"
  exit 1
fi

mkdir -p data

TIMESTAMP="$(date +%s%3N)"

echo "=============================================="
echo "Create Creator Pool"
echo "Pool size : ${POOL_SIZE}"
echo "Timestamp : ${TIMESTAMP}"
echo "Output    : ${OUTPUT_FILE}"
echo "=============================================="

# Generate creator pool JSON
{
  echo "["
  
  for ((i=1; i<=POOL_SIZE; i++)); do
    NUMBER="$(printf "%03d" "$i")"

    EMAIL="k6lt_ai_user_${NUMBER}_${TIMESTAMP}@example.com"
    USER_DISPLAY_NAME="k6lt_ai_user_${NUMBER}_${TIMESTAMP}"
    CREATOR_DISPLAY_NAME="k6lt_ai_creator_${NUMBER}_${TIMESTAMP}"

    if [[ "$i" -gt 1 ]]; then
      echo ","
    fi

    cat <<EOF
  {
    "email": "${EMAIL}",
    "userDisplayName": "${USER_DISPLAY_NAME}",
    "creatorDisplayName": "${CREATOR_DISPLAY_NAME}"
  }
EOF
  done

  echo
  echo "]"
} > "$OUTPUT_FILE"

echo ""
echo "Creator pool generated:"
cat "$OUTPUT_FILE"

echo ""
echo "Creating Creator users..."

"$K6_BIN" run \
  -e TEST_PASSWORD="$TEST_PASSWORD" \
  -e CREATOR_POOL_FILE="$OUTPUT_FILE" \
  testScript/create-creator-pool.js

echo ""
echo "=============================================="
echo "Creator pool creation finished."
echo "Pool file: ${OUTPUT_FILE}"
echo "=============================================="
