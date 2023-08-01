#!/bin/bash

current_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
source "$current_dir/get_latest_stable_chrome.sh"

chrome_filename="chrome-linux64"
download_url="https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/$latest_stable_chrome/linux64/${chrome_filename}.zip"

"$current_dir/download_and_unzip.sh" "$download_url" "$chrome_filename"
