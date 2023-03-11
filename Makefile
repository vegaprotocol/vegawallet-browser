JS_BUNDLER=npx browserify --debug -t [ babelify --global ]
# JS_BUNDLER=npx watchify --debug -t [ babelify --global ]

.PHONY: clean test-chrome test-firefox

clean:
	rm -r dist

test-chrome: dist/chrome
	npx web-ext run \
		--source-dir=$< \
		--target=chromium \
		--start-url=test/sample-dapp/index.html

test-firefox: dist/firefox
	npx web-ext run \
		--source-dir=$< \
		--devtools \
		--target=firefox-desktop \
		--start-url=test/sample-dapp/index.html

dist: dist/firefox dist/chrome

dist/firefox: dist/firefox/manifest.json \
	dist/firefox/ui/index.html \
	dist/firefox/ui/index.js \
	dist/firefox/icons \
	dist/firefox/fonts \
	dist/firefox/background.js \
	dist/firefox/pow-worker.js \
	dist/firefox/content-script.js \
	dist/firefox/in-page.js

dist/chrome: dist/chrome/manifest.json \
	dist/chrome/ui/index.html \
	dist/chrome/ui/index.js \
	dist/chrome/icons \
	dist/chrome/fonts \
	dist/chrome/background.js \
	dist/chrome/pow-worker.js \
	dist/chrome/content-script.js \
	dist/chrome/in-page.js

node_modules: package.json
	npm install
	touch -m node_modules

# Build ui/index.html
dist/chrome/ui/index.html: web-extension/common/ui/index.html
dist/firefox/ui/index.html: web-extension/common/ui/index.html
dist/chrome/ui/index.html dist/firefox/ui/index.html:
	mkdir -p $(@D)
	cp $^ $@

# Build manifests
dist/chrome/manifest.json: web-extension/common/manifest.json web-extension/chrome/manifest.json
dist/firefox/manifest.json: web-extension/common/manifest.json web-extension/firefox/manifest.json
dist/firefox/manifest.json dist/chrome/manifest.json:
	mkdir -p $(@D)
	jq --slurp --from-file scripts/merge-manifests.jq $^ > $@

# Build icons
dist/firefox/icons dist/chrome/icons: web-extension/common/icons
	mkdir -p $(@D)
	cp -r $^ $@

# Build fonts
dist/firefox/fonts dist/chrome/fonts: web-extension/common/fonts
	mkdir -p $(@D)
	cp -r $^ $@

# Build background.js
dist/firefox/background.js dist/chrome/background.js: web-extension/common/background.js node_modules
	$(JS_BUNDLER) $< -o $@

dist/firefox/pow-worker.js dist/chrome/pow-worker.js: web-extension/common/pow-worker.js node_modules
	$(JS_BUNDLER) $< -o $@

# Build ui/index.js
dist/firefox/ui/index.js dist/chrome/ui/index.js: web-extension/common/ui/index.js node_modules
	$(JS_BUNDLER) $< -o $@

# Build content-script.js
dist/firefox/content-script.js dist/chrome/content-script.js: web-extension/common/content-script.js node_modules
	$(JS_BUNDLER) $< -o $@

# Build in-page.js
dist/firefox/in-page.js dist/chrome/in-page.js: web-extension/common/in-page.js node_modules
	$(JS_BUNDLER) $< -o $@

schemas: web-extension/common/validation/client/connect-wallet.js \
	web-extension/common/validation/client/disconnect-wallet.js \
	web-extension/common/validation/client/get-chain-id.js \
	web-extension/common/validation/client/list-keys.js \
	web-extension/common/validation/client/send-transaction.js

web-extension/common/validation/client/connect-wallet.js: 		web-extension/common/schemas/client/connect-wallet.js
web-extension/common/validation/client/disconnect-wallet.js: 	web-extension/common/schemas/client/disconnect-wallet.js
web-extension/common/validation/client/get-chain-id.js: 			web-extension/common/schemas/client/get-chain-id.js
web-extension/common/validation/client/list-keys.js: 					web-extension/common/schemas/client/list-keys.js
web-extension/common/validation/client/send-transaction.js: 	web-extension/common/schemas/client/send-transaction.js
web-extension/common/validation/client/connect-wallet.js \
	web-extension/common/validation/client/disconnect-wallet.js \
	web-extension/common/validation/client/get-chain-id.js \
	web-extension/common/validation/client/list-keys.js \
	web-extension/common/validation/client/send-transaction.js:
	mkdir -p $(@D)
	./scripts/compile-ajv-schema.js $< > $@
