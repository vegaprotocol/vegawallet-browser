#!/bin/bash

response=$(curl -s https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json)

stable_version=$(echo "$response" | grep -oP '"Stable":{"channel":"Stable","version":"\K[^"]+')

echo "Stable Version: $stable_version"

download_url="https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/$stable_version/linux64/chromedriver-linux64.zip"
echo "Download URL: $download_url" 

wget $download_url
unzip chromedriver_linux64.zip
sudo mv chromedriver /usr/local/bin/
sudo chown root:root /usr/local/bin/chromedriver
sudo chmod +x /usr/local/bin/chromedriver
