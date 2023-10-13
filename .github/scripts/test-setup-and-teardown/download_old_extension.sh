#!/bin/bash

# Define the URL and the destination directory
URL="https://github.com/vegaprotocol/vegawallet-browser/releases/download/v0.10.0/vega-browserwallet-testnet-chrome-v0.10.0.zip"
ZIP_FILE="./test/vega-browserwallet-testnet-chrome-v0.10.0.zip"
DESTINATION="./test/vega-browserwallet-testnet-chrome-v0.10.0"

# Create the destination directory if it doesn't exist
mkdir -p "$DESTINATION"

# Download the file using wget
wget -O "$ZIP_FILE" "$URL"

# Check if the download was successful
if [ $? -eq 0 ]; then
  echo "File downloaded successfully to $ZIP_FILE"

  # Extract the contents into the subdirectory
  unzip -o "$ZIP_FILE" -d "$DESTINATION"

  if [ $? -eq 0 ]; then
    echo "File extracted successfully to $DESTINATION"
  else
    echo "Extraction failed. Check the ZIP file or the 'unzip' tool."
  fi
else
  echo "Download failed. Check the URL and try again."
fi
