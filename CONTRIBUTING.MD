# Watching a build

Run:

`yarn watch`

You can then use the `Update` button in your browser to test the extension.

Maybe this?

```
npx web-ext run \
 --source-dir=build \
 --target=chromium \
 --start-url=build/index.html
```
