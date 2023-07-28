#!/bin/bash

download_url="$1"
filename="$2"
echo "Download URL: $download_url"
echo "Filename: $filename"

wget -q "$download_url"
unzip -q "$filename" + ".zip"

sudo mv "$filename" /usr/local/bin/

sudo chown root:root "/usr/local/bin/$filename"
sudo chmod +x "/usr/local/bin/$filename"

rm "$filename" + ".zip"