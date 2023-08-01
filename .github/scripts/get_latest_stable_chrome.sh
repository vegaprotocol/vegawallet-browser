#!/bin/bash

current_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
sudo chmod +x -R $current_dir
response=$(curl -s https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json)
latest_stable_chrome=$(echo "$response" | jq -r '.channels.Stable.version')
