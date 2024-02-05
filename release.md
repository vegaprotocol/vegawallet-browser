# Releasing

## Pre-steps

1. `npm version minor`
2. `git push --follow-tags`
3. Run the `Release extension zip` github action with the tag created in step 1, ensure publish as Github release is checked
4. Wait for CI to finish
5. Check all artifacts are uploaded to the release

## Release a new version (Chrome)

Depending on the version you are releasing (beta or mainstream). In order to do this you will need access to Chrome Web Store Developer Dashboard for Vega and have paid the Chrome Developer fee.

1. Download the relevant assets `vega-browserwallet-${NETWORK}-chrome-v0.14.0.zip`
2. Go to the Chrome Web Store Developer Dashboard
3. Click on the Vega Wallet extension for the network you are releasing
4. Click on the `Package` button (you may need to discard a draft if one exists)
5. Click `Upload new package` button
6. Press `Submit for review`, after making any required changes
7. Press ok
8. Wait for review to complete, usually quite fast but if there are new permissions it may take longer

## Release a new version (Firefox)

In order to do this you will need access to the Firefox Add-on Developer Hub for Vega.

1. Go to [Add-on developer hub](https://addons.mozilla.org/en-GB/developers/addons)
2. Click on the Vega Wallet extension for the network you are releasing
3. Click on `Upload a new version`
4. Upload the relevant assets `vega-browserwallet-${NETWORK}-firefox-v0.14.0.zip`
5. Click `Submit version for review`
6. Ensure Firefox and Firefox for Android are selected
7. Click `Continue`
8. Answer "Yes" to the question `Do you use any of the following in your extension?`
9. Upload the source code `vegawallet-browser-0.15.0.zip`
10. Click `Continue`
11. Describe the release in the field provided
12. Press continue

## Post-steps

1. Mark the pre-release as release on GitHub
