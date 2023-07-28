#!/bin/bash

sudo chmod +x -R .github/scripts
response=$(curl -s https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json)
latest_stable_chrome=$(echo "$response" | jq -r '.channels.Stable.version')
