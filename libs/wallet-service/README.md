# Admin

1. A lot of these endpoints requires the passphrase at any mutating operation. Why?
2. Should `describe_*` with an unknown identifier return `null` or an error?
3. Should `remove_*` with an unknown identifier return `{}` or an error?
4. Should the success response be `{}` or something else? Eg. `null`, a success object or the identifier that was removed?

## Networks

### `list_networks`

Should `params` be completely ignored or asserted to be `null`?

### `import_network`

This is very desktop focused atm given that it takes a URL or file path instead of the config content.
What is the expected format ? TOML is what I have my configs as
Should the config be validated in any way? Does a spec for the config exist in some form?
What is the error on duplicate name?
Is the `name` parameter a pet name that it should answer to in the JSON RPC or does it overwrite what's in the config?

### `describe_network`

A JSON representation of the network config from above, but with changes overlaid?

### `update_network`

Are all parameters required or will just the ones present replace be replaced? If the latter, can I delete keys from the config?
What happens if the `api` parameter is only partially defined (eg. missing the `grpc` key)?

### `remove_network`

:+1:

## Wallet

### `list_wallets`

Is the sorting on this endpoint a requirement?

### `create_wallet`

Should there be any validation of wallet name?
What if I use an existing wallet name?
Should there be any requirement to the passphrase?

### `import_wallet`

This needs to have defined exactly what wordlist we accept `recoveryPhrase` from

### `describe_wallet`

What is the possible values for `type`?
What is `ID`?

### `rename_wallet`

What does the fail on using an existing name look like?

### `remove_wallet`

:+1:

## Keys

### `list_keys`

### `generate_key`

Why do I need to enter my passphrase?
What is the reason we return `metadata`? To mirror the `describe_key` endpoint?

### `describe_key`

### `annotate_key`

### `taint_key`

### `untaint_key`

### `isolate_key`

### `rotate_key`

Webwallet will probably not support this. At least not at first.
Curious, what kind of key is rotated?

## Permissions

### `list_permissions`

### `describe_permissions`

### `update_permissions`

### `revoke_permissions`

### `purge_permissions`

## Transactions

### `sign_message`

Should we allow signing any message?
What is the signature format? Is it the Vega `Ed25519(Sha3(msg))`?
Should we include a signature version and identifier like vega signatures?

### `verify_message`

Can I pass any pubKey?
What does validation errors look like (eg bad signature format, bad pubKey)

### `sign_transaction`

What does passing a network do? Make `chainId` optional?
What is the format of the `encodedCommand`? JSON like on the client?
Why do we pass the `blockHeight`?
What about parameters for PoW?

### `send_transaction`

What format is supported for node address? Is it the FQDN or a URL?

# Client

## Connect

### `connect_wallet`

### `disconnect_wallet`

## Permissions

### `request_permissions`

### `get_permissions`

## Keys

### `list_keys`

## Network

### `get_chain_id`

## Transactions

### `sign_transaction`

Base64 transaction body?

### `send_transaction`
