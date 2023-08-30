import { render, screen } from '@testing-library/react'
import { PriceWithSymbol, locators } from './price-with-symbol'

describe('PriceWithSymbol component', () => {
  it('renders price and symbol correctly', () => {
    const price = 9.99
    const symbol = 'USD'

    render(<PriceWithSymbol price={price} symbol={symbol} />)

    const priceElement = screen.getByTestId(locators.price)
    const symbolElement = screen.getByTestId(locators.symbol)
    const priceWithSymbolElement = screen.getByTestId(locators.priceWithSymbol)

    expect(priceElement).toHaveTextContent(price.toString())
    expect(symbolElement).toHaveTextContent(symbol)
    expect(priceWithSymbolElement).toContainElement(priceElement)
    expect(priceWithSymbolElement).toContainElement(symbolElement)
    expect(screen.getByTestId(locators.priceWithSymbol)).toHaveTextContent('9.99 USD')
  })
})
