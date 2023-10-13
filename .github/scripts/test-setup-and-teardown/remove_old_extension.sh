#!/bin/bash

# Define the destination directory
DESTINATION="./test"

# Remove the extracted contents
rm -r "$DESTINATION"

# Check if the removal was successful
if [ $? -eq 0 ]; then
  echo "Removed the contents in $DESTINATION"
else
  echo "Removal failed. Check the directory or permissions."
fi

# Remove the downloaded ZIP file
rm "$DESTINATION/vega-browserwallet-testnet-chrome-v0.10.0.zip"

# Check if the removal was successful
if [ $? -eq 0 ]; then
  echo "Removed the downloaded ZIP file"
else
  echo "Removal failed. Check the file or permissions."
fi
