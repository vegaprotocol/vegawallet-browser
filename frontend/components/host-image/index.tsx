import { useState } from 'react'
import locators from '../locators'
import classnames from 'classnames'
import { parseDomain, ParseResultType } from 'parse-domain'

function toHex(str: string) {
  var result = ''
  for (var i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16)
  }
  return result
}

const getRemainder = (str: string) => {
  const h = toHex(str)
  return Number(BigInt('0x' + h) % BigInt(6))
}

const COLORS_MAP = [
  { backgroundColor: 'bg-vega-pink-650', textColor: 'text-vega-pink-500' },
  { backgroundColor: 'bg-vega-green-650', textColor: 'text-vega-green-500' },
  { backgroundColor: 'bg-vega-purple-650', textColor: 'text-vega-purple-500' },
  { backgroundColor: 'bg-vega-blue-650', textColor: 'text-vega-blue-500' },
  { backgroundColor: 'bg-vega-yellow-650', textColor: 'text-vega-yellow-500' },
  { backgroundColor: 'bg-vega-orange-650', textColor: 'text-vega-orange-500' }
]

export interface HostImageProps {
  hostname: string
  size?: number
}

const FallbackImage = ({ hostname, size = 16 }: HostImageProps) => {
  const colorIndex = getRemainder(hostname)
  const parseResult = parseDomain(new URL(hostname).host)

  const letter = parseResult.type === ParseResultType.Listed ? parseResult.domain?.charAt(0) || '?' : '?'

  return (
    <div
      className={classnames(
        COLORS_MAP[colorIndex].textColor,
        COLORS_MAP[colorIndex].backgroundColor,
        'flex justify-center items-center rounded-md text-lg uppercase overflow-hidden'
      )}
      style={{
        width: size,
        height: size
      }}
    >
      {letter}
    </div>
  )
}

export const HostImage = ({ hostname, size = 48 }: HostImageProps) => {
  const [useFallback, setUseFallback] = useState(false)
  return useFallback ? (
    <FallbackImage hostname={hostname} size={size} />
  ) : (
    <img
      data-testid={locators.hostImage}
      style={{
        width: size,
        height: size
      }}
      alt={hostname}
      src={`${hostname}/favicon.ico`}
      onError={() => setUseFallback(true)}
    />
  )
}
