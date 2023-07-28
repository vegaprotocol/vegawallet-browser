#!/bin/bash

source .github/scripts/get_latest_stable_chrome.sh

chrome_filename="chrome-linux64"
download_url="https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/$latest_stable_chrome/linux64/${chrome_filename}.zip"

echo "working directory: $(pwd)"
echo "directory contents: $(ls -la)"
$(pwd)/.github/scripts/download_and_unzip.sh "$download_url" "$chrome_filename"
