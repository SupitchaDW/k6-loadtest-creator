# Project1-K6-LOADTEST

K6 load-test template for a web platform that supports:

1. Sign up / Login
   - Supporter
   - Creator (with additional registration steps)
2. AI Generate

Metrics are sent to **InfluxDB** through `K6_INFLUXDB`.

## Project structure

```text
Project1-K6-LOADTEST/
├── data/
├── helpers/
│   ├── auth.js
│   ├── config.js
│   ├── signup.js
│   └── ai-generate.js
├── results/
├── testScript/
│   ├── v1/
│   │   └── load-test.js
│   └── k6-run-all.js
├── .env
├── .gitignore
├── README.md
└── run.sh
```

## Prerequisites

- k6 installed
- InfluxDB v1.x (or a compatible k6 InfluxDB v1 output endpoint)
- Application API available from the machine running k6

## Configure

Edit `.env`:

```env
BASE_URL=https://your-app.example.com
K6_INFLUXDB=http://localhost:8086/k6
SIGNUP_SUPPORTER_PATH=/api/auth/signup/supporter
SIGNUP_CREATOR_PATH=/api/auth/signup/creator
LOGIN_PATH=/api/auth/login
AI_GENERATE_PATH=/api/ai/generate
```

If Creator signup has more steps, set the additional endpoint variables in `.env` and update the payloads in `helpers/signup.js` to match the real API contract.

## Run

```bash
./run.sh
```

The run sends metrics to InfluxDB and also writes a local k6 summary JSON under `results/`.

## Run with a different load profile

Override `STAGES` without changing `.env`:

```bash
STAGES='[{"duration":"1m","target":100},{"duration":"5m","target":100},{"duration":"1m","target":0}]' ./run.sh
```

## Run only one scenario

The default entry point contains all three scenarios. To test one scenario, use k6 directly with the appropriate script or create a small entry script that exports only the desired scenario.

## InfluxDB data

The `--out influxdb=${K6_INFLUXDB}` option sends standard k6 metrics to InfluxDB, including request duration, request count, failures, VUs, checks, and custom metrics.

Useful tags include:

- `test_name`
- `scenario`
- `api`

Custom AI metrics:

- `ai_generate_duration`
- `ai_generate_failure_rate`

## Important implementation notes

### Unique sign-up data

Each VU iteration generates a unique email:

```text
supporter_<timestamp>_<vu>_<iteration>@example.test
creator_<timestamp>_<vu>_<iteration>@example.test
```

This prevents duplicate-email errors from dominating the load-test result.

### AI Generate

For a realistic load test, prefer setting `AI_TEST_EMAIL` and `AI_TEST_PASSWORD` so every iteration does not create a new account. If omitted, the script creates a supporter account and logs in before each AI request.

### Creator flow

`helpers/signup.js` contains an extensible multi-step flow. Replace the example payloads and paths with the actual Creator registration API steps.

### Thresholds

Default thresholds are intentionally conservative and should be changed to the project's SLA/SLO:

- HTTP error rate <= 1%
- Overall p95 HTTP duration < 30s
- AI Generate failure rate <= 1%
- AI Generate p95 < 30s

## Recommended test profiles

For a new system, run these separately:

| Test | Purpose | Example |
|---|---|---|
| Smoke | Verify scripts/API are working | 1-2 VUs, 1-2 min |
| Load | Normal expected traffic | 10 → 50 → 100 VUs |
| Peak | Expected maximum traffic | ramp to target peak |
| Stress | Find breaking point | progressively increase VUs |
| Spike | Sudden traffic burst | 10 → 500 VUs quickly |

Do not start with a very high VU count until Smoke and Load tests pass.
