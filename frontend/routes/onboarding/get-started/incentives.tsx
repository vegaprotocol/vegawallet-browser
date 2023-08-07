export const locators = {
  paragraph: 'incentives-paragraph',
  link: 'incentives-link'
}

export const Incentives = () => {
  return (
    <p className="text-xs mb-2" data-testid={locators.paragraph}>
      This is an experimental release for testing purposes only and supports trading in testnet assets with no financial
      risk. Download to get involved in testing on Vega and participate in Fairground{' '}
      <a
        href="https://fairground.wtf/"
        target="_blank"
        rel="noreferrer nofollow noopener"
        className="underline"
        data-testid={locators.link}
      >
        incentives
      </a>{' '}
      to earn rewards!
    </p>
  )
}
