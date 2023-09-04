## Receipt views

As a user I want to understand my transaction so that I can know what I am sending to the network. e.g. price is based on the asset or position decimals which can make this look inflated to a lay user.

## Transfer

### Shared

- I can see a receipt like view on the transaction confirmation screen if one is present (<a name="1114-RCPT-001" href="#1114-RCPT-001">1114-RCPT-001</a>)
- I see a loading state while the enrichment data is loading (<a name="1114-RCPT-002" href="#1114-RCPT-002">1114-RCPT-002</a>)
- If there is an error loading the data I see an indication of it (<a name="1114-RCPT-003" href="#1114-RCPT-003">1114-RCPT-003</a>)

### Transfers

- I can see the receiving key of the transfer (<a name="1114-RCPT-004" href="#1114-RCPT-004">1114-RCPT-004</a>)
- For a oneOff transfer which has a delivery date in the past there is a way to see that the transfer will be executed immediately (<a name="1114-RCPT-005" href="#1114-RCPT-005">1114-RCPT-005</a>)
- For a oneOff transfer which has a delivery date in the future there is a way to see when the transfer will be delivered (<a name="1114-RCPT-006" href="#1114-RCPT-006">1114-RCPT-006</a>)
- I can see the amount of the asset being transferred (<a name="1114-RCPT-007" href="#1114-RCPT-007">1114-RCPT-007</a>)
- I can see a link to the block explorer for that asset (<a name="1114-RCPT-008" href="#1114-RCPT-008">1114-RCPT-008</a>)
- When I hover over the price I can see an explanation of how to calculate the human readable price from the raw price (<a name="1114-RCPT-009" href="#1114-RCPT-009">1114-RCPT-009</a>)
- When I hover over the price I can see a link to the docs to read more about the price (<a name="1114-RCPT-010" href="#1114-RCPT-010">1114-RCPT-010</a>)
- When I hover over the price I can click on a link to go to the block explorer to see the asset information (<a name="1114-RCPT-011" href="#1114-RCPT-011">1114-RCPT-011</a>)

<!-- Recurring transfers not currently supported -->
