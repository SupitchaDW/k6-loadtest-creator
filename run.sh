#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

K6_BIN="./k6"

if [[ ! -x "$K6_BIN" ]]; then
  echo "ERROR: custom k6 binary not found: $K6_BIN"
  exit 1
fi

# Load .env
if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

# Environment
ENVIRONMENT="${1:-${ENVIRONMENT:-sit}}"
export ENVIRONMENT

# Test script
TEST_SCRIPT="${TEST_SCRIPT:-testScript/run-all-api.js}"

: "${TEST_USERNAME:?TEST_USERNAME is required}"
: "${TEST_PASSWORD:?TEST_PASSWORD is required}"

API_FLOW="${API_FLOW:-login}"
TEST_CASE="${TEST_CASE:-TC001}"

TEST_NAME="$(basename "${TEST_SCRIPT}" .js)"

# Result folder
RESULT_DIR="${ROOT_DIR}/result"
mkdir -p "$RESULT_DIR"

# Timestamp
TIMESTAMP="$(date '+%Y%m%d_%H%M%S')"

REPORT_NAME="${API_FLOW}_${TEST_CASE}_${ENVIRONMENT}_${TIMESTAMP}"
HTML_REPORT="${RESULT_DIR}/${REPORT_NAME}.html"

echo "=============================================="
echo "K6 Load Test"
echo "Environment  : ${ENVIRONMENT}"
echo "API Flow     : ${API_FLOW}"
echo "Test Case    : ${TEST_CASE}"
echo "Test script  : ${TEST_SCRIPT}"
echo "HTML Report  : ${HTML_REPORT}"
echo "=============================================="

"$K6_BIN" run \
  -e API_FLOW="${API_FLOW}" \
  -e TEST_CASE="${TEST_CASE}" \
  -e ENVIRONMENT="${ENVIRONMENT}" \
  -e TEST_USERNAME="${TEST_USERNAME}" \
  -e TEST_PASSWORD="${TEST_PASSWORD}" \
  -e HTML_REPORT="${HTML_REPORT}" \
  --out xk6-influxdb="$K6_INFLUXDB_ADDR" \
  "$TEST_SCRIPT"


echo ""
echo "=============================================="
echo "K6 Load Test completed"
echo "HTML Report:"
echo "${HTML_REPORT}"
echo "=============================================="