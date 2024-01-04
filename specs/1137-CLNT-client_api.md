# Client API

## Methods

### Connect (client.connect_wallet)

- If I connect and it is not approved then I get an error telling me the user rejected the connection
- If I connect and it is approved then I do not get an error
- If I connect and it is approved and I try to connect again then the connection is automatically approved
- If I connect without a chain Id I am connected to the default network for that extension
- If I connect with a non-existent chain Id I get an error telling me the network was not found
- If I connect with a chainId I am connected to that chain
- If I connect with a chainId and then connect again with a different chainId then I get an error indicating that I am already connected to a different chain

### Get Chain Id (client.get_chain_id)

- If I am not connected then I receive the selected chainId for the wallet
- If I connect and then get the chain id then I get the chain id of that network

### Is Connected (client.is_connected)

- If I connect and it is approved then isConnected is true
- If I connect and it is not approved then isConnected is false
- If I connect and it is approved and the user disconnects then isConnected is false

### Disconnect wallet (client.disconnect_wallet)

This method is deprecated and is kept for backward compatibility.

- If I call this method nothing happens

### Send Transaction (client.send_transaction)

<!-- TODO -->

### List Keys (client.list_keys)

- If I am connected then I receive the keys for the wallet
- If I am not connected then I receive an error

## Events

### Disconnect (client.disconnect)

- If I connect and the user disconnects, an event is sent to all listeners
