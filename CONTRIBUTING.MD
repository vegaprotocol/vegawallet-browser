# Development

To watch for changes in the `frontend` and `web-extension` fire up two terminals and run:

`yarn watch` in the first terminal
`yarn dev:[chrome|firefox]` in the second terminal

# Building

`yarn build`

# Updating the protos

## Full update

The protos are generated automatically from the Vega repository in the [js-protos](https://github.com/vegaprotocol/js-protos) repo. It polls for new Vega tags and generates a PR to review with all the protos changes contained. This workflow can also be run manually.

1. (optional): Run the workflow to generate the protos manually
2. Check over and if good then merge the generated PR in js-protos.
3. Bump and tag the js-protos repo and publish this to npm

# Updating this repo

Dependabot will generate a PR if there are new protos, this only happens once a day. If you want to update the protos manually:

1. Run `yarn update-protos`
2. Commit all the changes

Note: there is a postinstall script to regenerate some files after a `yarn` is run. This happens automatically, and you don't need to do anything.
