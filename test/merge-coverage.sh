#!/bin/bash -e
cp coverage/frontend/unit/coverage-final.json coverage/frontend/unit-coverage.json
cp coverage/frontend/integration/coverage-final.json coverage/frontend/integration-coverage.json
npx nyc merge coverage/frontend coverage/frontend/merged-coverage.json
npx nyc report -t coverage/frontend  --report-dir coverage/frontend/final --reporter=html
