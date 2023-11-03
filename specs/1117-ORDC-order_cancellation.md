## Order cancellation

- If present I can see the market id relating to the order (<a name="1117-ORDC-001" href="#1117-ORDC-001">1117-ORDC-001</a>)
- If present I can see the order id relating to the order (<a name="1117-ORDC-002" href="#1117-ORDC-002">1117-ORDC-002</a>)

### Enriched order

- I can see the time of when the order was fetched from the data node (<a name="1117-ORDC-003" href="#1117-ORDC-003">1117-ORDC-003</a>)
- I can see the [order table](./1130-ODTB-order_table.md) (<a name="1117-ORDC-004" href="#1117-ORDC-004">1117-ORDC-004</a>)
- I can see the [order badges](./1119-ORBD-order_badges.md) (<a name="1117-ORDC-005" href="#1117-ORDC-005">1117-ORDC-005</a>)

### Order cancellation edge cases

- If I cancel an order with an order id and no market id I see the [normal cancel order view](#enriched-order) (<a name="1117-ORDC-006" href="#1117-ORDC-006">1117-ORDC-006</a>)
- If I cancel an order with an order id and a market id I see the [normal cancel order view](#enriched-order) (<a name="1117-ORDC-007" href="#1117-ORDC-007">1117-ORDC-007</a>)
- If I cancel an order without an order id but with a market id I see a warning notifying me I will close all orders for that market (<a name="1117-ORDC-008" href="#1117-ORDC-008">1117-ORDC-008</a>)
- If I cancel an order without an order id or market id I see a warning notifying me I will close all orders in all markets (<a name="1117-ORDC-009" href="#1117-ORDC-009">1117-ORDC-009</a>)
