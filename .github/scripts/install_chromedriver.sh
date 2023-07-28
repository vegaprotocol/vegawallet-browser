#!/bin/bash

response=$(curl -s https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json)

stable_version=$(echo "$response" | grep -oP '"Stable":{"channel":"Stable","version":"\K[^"]+')

echo "Stable Version: $stable_version"
chromedriver_filename="chromedriver-linux64.zip" 

download_url="https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/$stable_version/linux64/$chromedriver_filename"
echo "Download URL: $download_url" 

wget $download_url
unzip $chromedriver_filename

ls -la
sudo mv chromedriver-linux64 /usr/local/bin/
sudo chown root:root /usr/local/bin/chromedriver-linux64
sudo chmod +x /usr/local/bin/chromedriver-linux64
