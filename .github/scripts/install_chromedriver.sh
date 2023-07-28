#!/bin/bash

response=$(curl -s https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json)

stable_version=$(echo "$response" | jq -r '.channels.Stable.version')

chromedriver_filename="chromedriver-linux64"

chromedriver_zip="${chromedriver_filename}.zip"

download_url="https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/$stable_version/linux64/$chromedriver_zip"
echo "Download URL: $download_url"

wget -q "$download_url"
unzip -q "$chromedriver_zip"

sudo mv "$chromedriver_filename" /usr/local/bin/

sudo chown root:root "/usr/local/bin/$chromedriver_filename"
sudo chmod +x "/usr/local/bin/$chromedriver_filename"

rm "$chromedriver_zip"
