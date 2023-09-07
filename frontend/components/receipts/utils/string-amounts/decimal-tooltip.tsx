import config from '!/config'
import { ExternalLink } from '@vegaprotocol/ui-toolkit'
import { CONSTANTS } from '../../../../../lib/constants'

export const locators = {
  description1: 'description1',
  description2: 'description2',
  description3: 'description3',
  explorerLink: 'explorer-link',
  docsLink: 'docs-link'
}

export const DecimalTooltip = ({
  variableName,
  entityLink,
  entityText
}: {
  entityLink: string
  entityText: string
  variableName: string
}) => {
  const docsHref = `${config.network.docs}/api/using-the-apis#decimal-precision`
  return (
    <div style={{ maxWidth: CONSTANTS.width }}>
      <p data-testid={locators.description1}>This number does not include a decimal point.</p>

      <p data-testid={locators.description2} className="mt-1">
        To get the value including decimals, find the{' '}
        <ExternalLink data-testid={locators.explorerLink} href={entityLink}>
          {entityText}
        </ExternalLink>{' '}
        on the block explorer and divide the amount by{' '}
        <code>
          10<sup>{variableName}</sup>
        </code>{' '}
        e.g. <code>1000</code> with a {variableName} value of <code>2</code> would become{' '}
        <code>
          1000 ÷ 10<sup>2</sup> = 10
        </code>
        .{' '}
      </p>
      <p data-testid={locators.description3} className="mt-1">
        <ExternalLink data-testid={locators.docsLink} href={docsHref}>
          Read more
        </ExternalLink>
      </p>
    </div>
  )
}
