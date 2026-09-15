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
├── result/
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
