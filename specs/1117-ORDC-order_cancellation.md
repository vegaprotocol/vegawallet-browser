## Order cancellation

- If present I can see the market id relating to the order (<a name="1117-ORDC-001" href="#1117-ORDC-001">1117-ORDC-001</a>)
- If present I can see the order id relating to the order (<a name="1117-ORDC-002" href="#1117-ORDC-002">1117-ORDC-002</a>)

### Enriched order

- I can see the time of when the order was fetched from the data node
- I can see the [order table](./1130-ODTB-order_table.md)
- I can see the [order badges](./1119-ORBD-order_badges.md)

### Order cancellation edge cases

- If I cancel an order with an order id and no market id I see the [normal cancel order view](#enriched-order)
- If I cancel an order with an order id and a market id I see the [normal cancel order view](#enriched-order)
- If I cancel an order without and order id but with a market id I see a warning notifying me I will close all orders for that market
- If I cancel an order without an order id or market id I see a warning notifying me I will close all orders in all markets
