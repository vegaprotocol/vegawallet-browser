# Client API

## Methods

### Connect (client.connect_wallet)

- If I connect and it is not approved then I get an error telling me the user rejected the connection (<a name="1137-CLNT-001" href="#1137-CLNT-001">1137-CLNT-001</a>)
- If I connect and it is approved then I do not get an error (<a name="1137-CLNT-002" href="#1137-CLNT-002">1137-CLNT-002</a>)
- If I connect and it is rejected I am not connected (<a name="1137-CLNT-003" href="#1137-CLNT-003">1137-CLNT-003</a>)
- If I connect and it is approved and I try to connect again then the connection is automatically approved (<a name="1137-CLNT-004" href="#1137-CLNT-004">1137-CLNT-004</a>)
- If I connect without a chain Id I am connected to the default network for that extension (<a name="1137-CLNT-005" href="#1137-CLNT-005">1137-CLNT-005</a>)
- If I connect with a non-existent chain Id I get an error telling me the network was not found (<a name="1137-CLNT-006" href="#1137-CLNT-006">1137-CLNT-006</a>)
- If I connect with a chainId I am connected to that chain (<a name="1137-CLNT-007" href="#1137-CLNT-007">1137-CLNT-007</a>)
- If I connect with a chainId and then connect again with a different chainId then I get an error indicating that I am already connected to a different chain (<a name="1137-CLNT-008" href="#1137-CLNT-008">1137-CLNT-008</a>)
- If I connect and it is approved and use the UI to disconnect then I am required to approve the connection again (<a name="1137-CLNT-014" href="#1137-CLNT-014">1137-CLNT-014</a>)

### Is Connected (client.is_connected)

- If I connect and it is approved then isConnected is true (<a name="1137-CLNT-009" href="#1137-CLNT-009">1137-CLNT-009</a>)
- If I connect and it is not approved then isConnected is false (<a name="1137-CLNT-010" href="#1137-CLNT-010">1137-CLNT-010</a>)
- If I connect and it is approved and the user disconnects then isConnected is true (<a name="1137-CLNT-011" href="#1137-CLNT-011">1137-CLNT-011</a>)

### Disconnect wallet (client.disconnect_wallet)

This method is deprecated and is kept for backward compatibility.

- If I call the client.disconnect_wallet method nothing happens (<a name="1137-CLNT-012" href="#1137-CLNT-012">1137-CLNT-012</a>)

## Events

### Disconnect (client.disconnect_wallet)

- If I connect and the user disconnects via the UI, an event is sent to all listeners (<a name="1137-CLNT-013" href="#1137-CLNT-013">1137-CLNT-013</a>)
