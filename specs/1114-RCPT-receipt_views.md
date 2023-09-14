## Receipt views

As a user I want to understand my transaction so that I can know what I am sending to the network. e.g. price is based
on the asset or position decimals which can make this look inflated or incorrect if I do not understand the internals of
Vega.

## Shared

- I can see a receipt like view on the transaction confirmation screen if one is
  present (<a name="1114-RCPT-001" href="#1114-RCPT-001">1114-RCPT-001</a>)
- I see a loading state while the enrichment data is loading (<a name="1114-RCPT-002" href="#1114-RCPT-002">
  1114-RCPT-002</a>)
- If there is an error loading the data I see an indication of it (<a name="1114-RCPT-003" href="#1114-RCPT-003">
  1114-RCPT-003</a>)

## Transfer

### One off Transfers

- I can see the receiving key of the transfer (<a name="1114-RCPT-004" href="#1114-RCPT-004">1114-RCPT-004</a>)
- For a oneOff transfer which has a delivery date in the past there is a way to see that the transfer will be executed
  immediately (<a name="1114-RCPT-005" href="#1114-RCPT-005">1114-RCPT-005</a>)
- For a oneOff transfer which has a delivery date in the future there is a way to see when the transfer will be
  delivered (<a name="1114-RCPT-006" href="#1114-RCPT-006">1114-RCPT-006</a>)
- I can see the amount of the asset being transferred (<a name="1114-RCPT-007" href="#1114-RCPT-007">1114-RCPT-007</a>)
- I can see a link to the block explorer for that asset (<a name="1114-RCPT-008" href="#1114-RCPT-008">
  1114-RCPT-008</a>)
- When I hover over the price I can see an explanation of how to calculate the human readable price from the raw
  price (<a name="1114-RCPT-009" href="#1114-RCPT-009">1114-RCPT-009</a>)
- When I hover over the price I can see a link to the docs to read more about the
  price (<a name="1114-RCPT-010" href="#1114-RCPT-010">1114-RCPT-010</a>)
- When I hover over the price I can click on a link to go to the block explorer to see the asset
  information (<a name="1114-RCPT-011" href="#1114-RCPT-011">1114-RCPT-011</a>)

<!-- Recurring transfers not currently supported -->

## Withdrawal

- I can see the Ethereum key I am withdrawing the assets to (<a name="1114-RCPT-007" href="#1114-RCPT-007">
  1114-RCPT-007</a>)

## Order

### Shared

#### Order badges

- I can see a badge if the order is post only (<a name="1114-RCPT-008" href="#1114-RCPT-008">1114-RCPT-008</a>)
- I can see a badge if the order is reduce only (<a name="1114-RCPT-009" href="#1114-RCPT-009">1114-RCPT-009</a>)
- I can see a badge of the order time in force (<a name="1114-RCPT-010" href="#1114-RCPT-010">1114-RCPT-010</a>)
- If time in force is GTT then I can see the expiry of the order (<a name="1114-RCPT-011" href="#1114-RCPT-011">
  1114-RCPT-011</a>)

#### Decimal numbers

- I can see a tooltip for how to add the decimals to the number (<a name="1114-RCPT-023" href="#1114-RCPT-023">1114-RCPT-023</a>)
- I can see a link in the tooltip to the relevant entity on the block explorer (<a name="1114-RCPT-024" href="#1114-RCPT-024">1114-RCPT-024</a>)

<!-- #### Data enrichment -->

### Order submission

- I can see the market id of the order I am submitting (<a name="1114-RCPT-012" href="#1114-RCPT-012">1114-RCPT-012</a>)
- I can see the direction of order I am submitting (<a name="1114-RCPT-013" href="#1114-RCPT-013">1114-RCPT-013</a>)
- I can see the type of the order I am submitting (<a name="1114-RCPT-014" href="#1114-RCPT-014">1114-RCPT-014</a>)
- I can see the reference of the order I am submitting (<a name="1114-RCPT-015" href="#1114-RCPT-015">1114-RCPT-015</a>)
- I can see any relevant [order badges](#order-badges) (<a name="1114-RCPT-016" href="#1114-RCPT-016">1114-RCPT-016</a>)
- I can see the price of the order (#decimal-numbers) (<a name="1114-RCPT-017" href="#1114-RCPT-017">1114-RCPT-017</a>)
- I can see the size of the order (#decimal-numbers) (<a name="1114-RCPT-018" href="#1114-RCPT-018">1114-RCPT-018</a>)

### Order cancellation

- If present I can see the market id relating to the order (<a name="1114-RCPT-019" href="#1114-RCPT-019">
  1114-RCPT-019</a>)
- If present I can see the order id relating to the order (<a name="1114-RCPT-020" href="#1114-RCPT-020">
  1114-RCPT-020</a>)

### Order amendment

- I can see the order id of the order I am amending (<a name="1114-RCPT-021" href="#1114-RCPT-021">1114-RCPT-021</a>)
- I can see the market id relating to the order I am amending (<a name="1114-RCPT-022" href="#1114-RCPT-022">
  1114-RCPT-022</a>)
- I can see any relevant [order badges](#order-badges) (<a name="1114-RCPT-023" href="#1114-RCPT-023">1114-RCPT-023</a>)

### Stop order cancellation

- If present I can see the if of the market the order is being cancelled for (<a name="1114-RCPT-023" href="#1114-RCPT-023">1114-RCPT-023</a>)
- If present I can see the id of the stop order being cancelled (<a name="1114-RCPT-024" href="#1114-RCPT-024">1114-RCPT-024</a>)

## Stop order

- If a rises above order is present I see the rises above section (<a name="1114-RCPT-025" href="#1114-RCPT-025">1114-RCPT-025</a>)
- If a falls below is present I see the falls below section (<a name="1114-RCPT-026" href="#1114-RCPT-026">1114-RCPT-026</a>)
- In each section I can see the trigger price (<a name="1114-RCPT-027" href="#1114-RCPT-027">1114-RCPT-027</a>)
- In each section I can see the all [the details of the order](#order-submission) (<a name="1114-RCPT-028" href="#1114-RCPT-028">1114-RCPT-028</a>)

### Pegged Orders

- I can see the offset price (<a name="1114-RCPT-029" href="#1114-RCPT-029">1114-RCPT-029</a>)
- I can see the reference price (<a name="1114-RCPT-030" href="#1114-RCPT-030">1114-RCPT-030</a>)
