#!/bin/bash

source ./get_latest_stable_chrome.sh

chromedriver_filename="chromedriver-linux64"

download_url="https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/$latest_stable_chrome/linux64/$chromedriver_zip"

source ./download_and_unzip.sh -$download_url -$chromedriver_filename