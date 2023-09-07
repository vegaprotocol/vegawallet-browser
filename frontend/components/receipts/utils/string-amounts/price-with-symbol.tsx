export const locators = {
  price: 'price',
  symbol: 'symbol',
  priceWithSymbol: 'price-with-symbol'
}

export const PriceWithSymbol = ({ price, symbol }: { price: string | number; symbol?: string }) => {
  return (
    <div data-testid={locators.priceWithSymbol}>
      <span data-testid={locators.price}>{price}</span>
      &nbsp;
      {symbol ? (
        <span className="text-vega-dark-300" data-testid={locators.symbol}>
          {symbol}
        </span>
      ) : null}
    </div>
  )
}
