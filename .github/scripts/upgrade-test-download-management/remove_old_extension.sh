#!/bin/bash

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$CURRENT_DIR/common-values.sh"
rm -r "$ZIP_EXTRACT_DESTINATION"

if [ $? -eq 0 ]; then
  echo "Removed the contents in $ZIP_EXTRACT_DESTINATION)"
else
  echo "Removal failed. Check the directory or permissions."
fi

rm "$ZIP_FILE"

if [ $? -eq 0 ]; then
  echo "Removed the downloaded ZIP file"
else
  echo "Removal failed. Check the file or permissions."
fi
