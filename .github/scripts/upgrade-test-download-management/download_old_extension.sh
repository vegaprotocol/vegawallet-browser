#!/bin/bash
CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$CURRENT_DIR/common-values.sh"

mkdir -p "$ZIP_EXTRACT_DESTINATION"
wget -O "$ZIP_FILE" "$URL"

if [ $? -eq 0 ]; then
  echo "File downloaded successfully to $ZIP_FILE"
  unzip -o "$ZIP_FILE" -d "$ZIP_EXTRACT_DESTINATION"

  if [ $? -eq 0 ]; then
    echo "File extracted successfully to $ZIP_EXTRACT_DESTINATION"
  else
    echo "Extraction failed. Check the ZIP file or the 'unzip' tool."
  fi
else
  echo "Download failed. Check the URL and try again."
fi