#!/bin/bash

source get_latest_stable_chrome.sh

chrome_filename="chrome-linux64"
download_url="https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/$latest_stable_chrome/linux64/$chrome_zip"

source ./download_and_unzip.sh -$download_url -$chrome_filename